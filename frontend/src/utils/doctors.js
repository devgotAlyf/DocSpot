import { doctors as demoDoctors, specialityData } from '../assets/assets'

const specialityAliases = {
  'general physician': 'General physician',
  'general physicians': 'General physician',
  'general doctor': 'General physician',
  'general doctors': 'General physician',
  'family doctor': 'General physician',
  'family doctors': 'General physician',
  'primary care': 'General physician',
  'primary care doctor': 'General physician',
  'gynecologist': 'Gynecologist',
  'gynecologists': 'Gynecologist',
  'gynaecologist': 'Gynecologist',
  'gynaecologists': 'Gynecologist',
  'obstetrician': 'Gynecologist',
  'obstetricians': 'Gynecologist',
  'dermatologist': 'Dermatologist',
  'dermatologists': 'Dermatologist',
  'skin specialist': 'Dermatologist',
  'pediatrician': 'Pediatricians',
  'pediatricians': 'Pediatricians',
  'paediatrician': 'Pediatricians',
  'paediatricians': 'Pediatricians',
  'child specialist': 'Pediatricians',
  'neurologist': 'Neurologist',
  'neurologists': 'Neurologist',
  'neurology': 'Neurologist',
  'neuro specialist': 'Neurologist',
  'gastroenterologist': 'Gastroenterologist',
  'gastroenterologists': 'Gastroenterologist',
  'gastroenterology': 'Gastroenterologist',
  'digestive specialist': 'Gastroenterologist',
}

const defaultSpecialityOrder = specialityData.map((item) => item.speciality)
const minDoctorsPerSpeciality = 3

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const canonicalizeSpeciality = (value = '') => {
  const normalized = normalizeText(value)
  return specialityAliases[normalized] || value || ''
}

export const specialityMatches = (left, right) => {
  if (!left || !right) return false
  return canonicalizeSpeciality(left) === canonicalizeSpeciality(right)
}

const normalizeDoctor = (doctor, index, sourcePrefix) => {
  const speciality = canonicalizeSpeciality(doctor.speciality)
  const id = doctor._id || doctor.id || `${sourcePrefix}-${index}`

  return {
    ...doctor,
    _id: id,
    id,
    speciality,
    available: doctor.available !== false,
    address: doctor.address || { line1: 'Address details available on request', line2: '' },
    image: doctor.image,
  }
}

const dedupeDoctors = (doctorList) => {
  const seen = new Set()
  const merged = []

  for (const doctor of doctorList) {
    const key = `${doctor._id}-${doctor.speciality}`
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    merged.push(doctor)
  }

  return merged
}

export const buildDoctorDirectory = (remoteDoctors = []) => {
  const normalizedRemote = remoteDoctors.map((doctor, index) => normalizeDoctor(doctor, index, 'remote'))
  const normalizedDemo = demoDoctors.map((doctor, index) => normalizeDoctor(doctor, index, 'demo'))
  const merged = [...normalizedRemote]

  for (const speciality of defaultSpecialityOrder) {
    const currentCount = merged.filter((doctor) => doctor.speciality === speciality).length
    if (currentCount >= minDoctorsPerSpeciality) {
      continue
    }

    const doctorsNeeded = minDoctorsPerSpeciality - currentCount
    const fallbackDoctors = normalizedDemo
      .filter((doctor) => doctor.speciality === speciality && !merged.some((item) => item._id === doctor._id))
      .slice(0, doctorsNeeded)

    merged.push(...fallbackDoctors)
  }

  return dedupeDoctors(merged)
}

export const getDirectorySpecialities = (doctorList = []) => {
  const doctorSpecialities = doctorList.map((doctor) => doctor.speciality).filter(Boolean)
  return Array.from(new Set([...defaultSpecialityOrder, ...doctorSpecialities]))
}
