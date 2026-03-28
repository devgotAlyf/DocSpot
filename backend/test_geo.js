import axios from 'axios';
import './config/env.js';

async function test() {
  const lat = '28.6139'; // Delhi
  const lng = '77.2090'; // Delhi
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error('GEOAPIFY_API_KEY is not configured');
    return;
  }

  const url = 'https://api.geoapify.com/v2/places';

  try {
    const response = await axios.get(url, {
      params: {
        categories: 'healthcare.clinic_or_praxis,healthcare.hospital',
        filter: `circle:${lng},${lat},25000`,
        bias: `proximity:${lng},${lat}`,
        limit: 5,
        apiKey: apiKey,
      },
    });

    const features = response.data.features || [];
    console.log('Found ' + features.length + ' places');
    if (features.length > 0) {
      console.log('First place:');
      console.log('Name:', features[0].properties.name);
      console.log('Address:', features[0].properties.address_line2);
      console.log('Lat:', features[0].properties.lat, 'Lon:', features[0].properties.lon);
      console.log('Country:', features[0].properties.country);
    }
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

test();
