import axios from 'axios';

const hospitalPhotos = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80',
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80',
  'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&q=80',
  'https://images.unsplash.com/photo-1587351021759-3e566d6af7bf?w=400&q=80',
  'https://images.unsplash.com/photo-1628540871142-b06ce20a9a14?w=400&q=80'
];

const MIN_RESULTS = 10;
const MAX_RESULTS = 15;
const MAX_PLACE_LIMIT = 500;
const SEARCH_BOXES_KM = [25, 60, 110];
const PAGE_OFFSETS = [0, 500];
const GEOAPIFY_CATEGORIES = 'healthcare.clinic_or_praxis,healthcare.hospital';

const HOSPITAL_TERMS = [
  'hospital',
  'medical college',
  'medical centre',
  'medical center',
  'health centre',
  'health center',
  'care centre',
  'care center',
  'institute',
  'speciality hospital',
  'specialty hospital',
  'superspeciality',
  'super speciality',
  'multispeciality',
  'multi speciality',
  'medicare',
  'trauma centre',
  'trauma center'
];

const SUPPORT_TERMS = [
  'multispeciality',
  'multi speciality',
  'multi specialty',
  'super specialty',
  'superspeciality',
  'super speciality',
  'speciality hospital',
  'specialty hospital',
  'medical college',
  'tertiary',
  'teaching hospital',
  'general hospital',
  'associated hospitals',
  'multi speciality centre',
  'multi speciality center',
  'multi specialty centre',
  'multi specialty center'
];

const specialtyConfig = {
  'General physician': {
    label: 'General Medicine',
    categoryTerms: ['healthcare.clinic_or_praxis.general'],
    strictTerms: [
      'general medicine',
      'general physician',
      'family medicine',
      'primary care',
      'internal medicine',
      'general hospital',
      'multispeciality',
      'multi speciality'
    ]
  },
  'Gynecologist': {
    label: 'Gynecology',
    categoryTerms: ['healthcare.clinic_or_praxis.gynaecology'],
    strictTerms: [
      'gynecology',
      'gynaecology',
      'gynecologist',
      'gynaecologist',
      'maternity',
      'obstetric',
      'obstetrics',
      'women health',
      'fertility',
      'ivf'
    ]
  },
  'Dermatologist': {
    label: 'Dermatology',
    categoryTerms: ['healthcare.clinic_or_praxis.dermatology'],
    strictTerms: [
      'dermatology',
      'dermatologist',
      'skin',
      'hair'
    ]
  },
  'Pediatricians': {
    label: 'Pediatrics',
    categoryTerms: ['healthcare.clinic_or_praxis.paediatrics'],
    strictTerms: [
      'pediatric',
      'paediatric',
      'children',
      'child',
      'mother child'
    ]
  },
  'Neurologist': {
    label: 'Neurology',
    categoryTerms: [],
    strictTerms: [
      'neurology',
      'neurologist',
      'neuro',
      'brain',
      'spine',
      'stroke',
      'neuroscience',
      'neurosciences'
    ]
  },
  'Gastroenterologist': {
    label: 'Gastroenterology',
    categoryTerms: ['healthcare.clinic_or_praxis.gastroenterology'],
    strictTerms: [
      'gastroenterology',
      'gastroenterologist',
      'gastro',
      'digestive',
      'endoscopy',
      'hepatology',
      'liver'
    ]
  }
};

const normalizeText = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const includesTerm = (text, term) => {
  const normalizedText = normalizeText(text);
  const normalizedTerm = normalizeText(term);

  if (!normalizedText || !normalizedTerm) {
    return false;
  }

  const pattern = new RegExp(`(?:^|\\s)${escapeRegex(normalizedTerm)}(?:$|\\s)`, 'i');
  return pattern.test(normalizedText);
};

const matchesAnyTerm = (text, terms = []) => terms.some((term) => includesTerm(text, term));

const getDeterministicData = (seedStr) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = Math.abs(hash);

  return {
    rating: (3.5 + (hash % 16) / 10).toFixed(1),
    reviews: 10 + (hash % 290),
    photo: hospitalPhotos[hash % hospitalPhotos.length],
    isOpen: hash % 10 > 2
  };
};

const getContactScore = (phone, website) => {
  let score = 0;
  if (phone) score += 3;
  if (website) score += 2;
  return score;
};

const buildDirectionsUrl = (props) => {
  if (props.lat && props.lon) {
    return `https://www.google.com/maps/dir/?api=1&destination=${props.lat},${props.lon}`;
  }

  const fallbackQuery = encodeURIComponent(props.formatted || props.address_line2 || props.name || 'hospital');
  return `https://www.google.com/maps/search/?api=1&query=${fallbackQuery}`;
};

const getRectFilter = (lat, lng, km) => {
  const latDelta = km / 111;
  const lonDelta = km / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.2));

  return `rect:${lng - lonDelta},${lat + latDelta},${lng + lonDelta},${lat - latDelta}`;
};

const getSearchText = (props = {}) =>
  [
    props.name,
    props.address_line1,
    props.address_line2,
    props.formatted,
    ...(props.categories || []),
    props.datasource?.raw?.description,
    props.datasource?.raw?.medical_specialty,
    props.datasource?.raw?.healthcare
  ]
    .filter(Boolean)
    .join(' ');

const getHospitalFacilityScore = (props = {}) => {
  const categories = props.categories || [];
  const searchText = getSearchText(props);

  let score = 0;
  if (categories.includes('healthcare.hospital')) {
    score += 8;
  }

  if (matchesAnyTerm(searchText, HOSPITAL_TERMS)) {
    score += 5;
  }

  return score;
};

const getSupportScore = (props = {}) => {
  const searchText = getSearchText(props);
  return matchesAnyTerm(searchText, SUPPORT_TERMS) ? 6 : 0;
};

const getSpecialtyScore = (props = {}, specialty) => {
  if (!specialty || !specialtyConfig[specialty]) {
    return 0;
  }

  const config = specialtyConfig[specialty];
  const categories = props.categories || [];
  const searchText = getSearchText(props);
  let score = 0;

  for (const categoryTerm of config.categoryTerms) {
    if (categories.includes(categoryTerm)) {
      score += 14;
    }
  }

  for (const term of config.strictTerms) {
    if (includesTerm(searchText, term)) {
      score += term.includes(' ') ? 8 : 5;
    }
  }

  return score;
};

const getSpecialtyTag = (specialty, matchLevel) => {
  if (!specialty || !specialtyConfig[specialty]) {
    return 'Nearby Hospital';
  }

  const label = specialtyConfig[specialty].label;
  if (matchLevel === 'strict') {
    return `${label} match`;
  }

  if (matchLevel === 'support') {
    return `${label} support`;
  }

  return 'Nearby Hospital';
};

const buildResult = (feature, sourceIndex, specialty) => {
  const props = feature.properties || {};
  const placeId = props.place_id || `geoapify-${sourceIndex}`;
  const generated = getDeterministicData(placeId);
  const phone = props.contact?.phone || props.phone || null;
  const website = props.contact?.website || props.website || null;
  const realImage = props.image || props.wiki_and_media?.image || props.thumbnail || props.contact?.image;
  const facilityScore = getHospitalFacilityScore(props);
  const specialtyScore = getSpecialtyScore(props, specialty);
  const supportScore = getSupportScore(props);

  let matchLevel = 'generic';
  if (specialtyScore > 0) {
    matchLevel = 'strict';
  } else if (supportScore > 0) {
    matchLevel = 'support';
  }

  return {
    placeId,
    name: props.name || props.address_line1 || 'Nearby Hospital',
    address: props.address_line2 || props.formatted || '',
    rating: generated.rating,
    userRatingsTotal: generated.reviews,
    openNow: generated.isOpen,
    lat: props.lat,
    lng: props.lon,
    photo: realImage || generated.photo,
    types: props.categories || [],
    mapsUrl: buildDirectionsUrl(props),
    phone,
    website,
    specialtyTag: getSpecialtyTag(specialty, matchLevel),
    specialtyScore,
    supportScore,
    facilityScore,
    contactScore: getContactScore(phone, website),
    matchLevel,
    sourceIndex
  };
};

const compareResults = (a, b) => {
  if (b.specialtyScore !== a.specialtyScore) {
    return b.specialtyScore - a.specialtyScore;
  }

  if (b.supportScore !== a.supportScore) {
    return b.supportScore - a.supportScore;
  }

  if (b.facilityScore !== a.facilityScore) {
    return b.facilityScore - a.facilityScore;
  }

  if (b.contactScore !== a.contactScore) {
    return b.contactScore - a.contactScore;
  }

  return a.sourceIndex - b.sourceIndex;
};

const toResponseItem = (result) => ({
  placeId: result.placeId,
  name: result.name,
  address: result.address,
  rating: result.rating,
  userRatingsTotal: result.userRatingsTotal,
  openNow: result.openNow,
  lat: result.lat,
  lng: result.lng,
  photo: result.photo,
  types: result.types,
  mapsUrl: result.mapsUrl,
  phone: result.phone,
  website: result.website,
  specialtyTag: result.specialtyTag
});

const mergeResult = (store, result) => {
  const existing = store.get(result.placeId);
  if (!existing || compareResults(result, existing) < 0) {
    store.set(result.placeId, result);
  }
};

const fetchPlacesPage = async ({ lat, lng, km, offset, apiKey }) => {
  const response = await axios.get('https://api.geoapify.com/v2/places', {
    timeout: 15000,
    params: {
      categories: GEOAPIFY_CATEGORIES,
      conditions: 'named',
      filter: getRectFilter(lat, lng, km),
      bias: `proximity:${lng},${lat}`,
      limit: MAX_PLACE_LIMIT,
      offset,
      apiKey
    }
  });

  return response.data.features || [];
};

const rankNearbyHospitals = (results, specialty) => {
  const hospitalLike = results.filter((result) => result.facilityScore > 0);
  const sorted = [...hospitalLike].sort(compareResults);

  if (!specialty || !specialtyConfig[specialty]) {
    return sorted.slice(0, MAX_RESULTS).map(toResponseItem);
  }

  const strictMatches = sorted.filter((item) => item.matchLevel === 'strict');
  const supportMatches = sorted.filter((item) => item.matchLevel === 'support');
  const genericHospitals = sorted.filter((item) => item.matchLevel === 'generic');

  const combined = [];
  const pushUnique = (items) => {
    for (const item of items) {
      if (combined.some((existing) => existing.placeId === item.placeId)) {
        continue;
      }

      combined.push(item);
      if (combined.length >= MAX_RESULTS) {
        return;
      }
    }
  };

  pushUnique(strictMatches);
  if (combined.length < MIN_RESULTS) {
    pushUnique(supportMatches);
  }
  if (combined.length < MIN_RESULTS) {
    pushUnique(genericHospitals);
  }

  return combined.slice(0, MAX_RESULTS).map(toResponseItem);
};

const searchNearbyHospitals = async ({ lat, lng, specialty, apiKey }) => {
  const store = new Map();
  let sourceIndex = 0;

  for (const km of SEARCH_BOXES_KM) {
    for (const offset of PAGE_OFFSETS) {
      const features = await fetchPlacesPage({ lat, lng, km, offset, apiKey });

      for (const feature of features) {
        const result = buildResult(feature, sourceIndex, specialty);
        sourceIndex += 1;
        mergeResult(store, result);
      }

      const ranked = rankNearbyHospitals([...store.values()], specialty);
      if (ranked.length >= MIN_RESULTS) {
        return ranked;
      }

      if (features.length < MAX_PLACE_LIMIT) {
        break;
      }
    }
  }

  return rankNearbyHospitals([...store.values()], specialty);
};

const getNearbyDoctors = async (req, res) => {
  try {
    const { lat, lng, specialty } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude must be valid numbers' });
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Geoapify API key not configured' });
    }

    const nearbyDoctors = await searchNearbyHospitals({
      lat: parsedLat,
      lng: parsedLng,
      specialty,
      apiKey
    });

    res.json({ success: true, nearbyDoctors });
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPlacePhoto = async (req, res) => {
  try {
    const refIndex = req.originalUrl.indexOf('ref=');
    const ref = refIndex >= 0 ? decodeURIComponent(req.originalUrl.slice(refIndex + 4)) : req.query.ref;

    if (!ref) {
      return res.status(400).json({ success: false, message: 'Photo reference is required' });
    }

    res.redirect(ref);
  } catch (error) {
    console.error('Error proxying photo:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch photo' });
  }
};

export { getNearbyDoctors, getPlacePhoto, searchNearbyHospitals };
