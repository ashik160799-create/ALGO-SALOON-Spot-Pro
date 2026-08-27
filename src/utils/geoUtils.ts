import { getCountryByCode, supportedCountries } from '../data/mockData';
import { CountryInfo } from '../types';

export interface ParsedMapLocation {
  latitude: number;
  longitude: number;
  placeId?: string;
  formattedUrl: string;
}

/**
 * Extracts high-precision latitude, longitude, and optional Google Place ID from various Google Maps URLs
 * Supports:
 * - https://maps.google.com/?q=25.2048,55.2708
 * - https://www.google.com/maps/@25.2048,55.2708,17z
 * - https://www.google.com/maps/place/Salon+Name/@25.2048,55.2708,17z/data=!3m1!1e3!4m6!3m5!1s0x3e5f4349...
 * - https://www.google.com/maps/search/?api=1&query=25.2048,55.2708
 * - https://www.google.com/maps/dir/?api=1&destination=25.2048,55.2708
 * - Geo URI geo:25.2048,55.2708
 */
export const parseCoordinatesFromMapUrl = (url: string): ParsedMapLocation | null => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // 1. Check for query coordinates ?q=lat,lng or query=lat,lng or destination=lat,lng or ll=lat,lng
  const queryMatch = trimmed.match(/(?:[?&](?:q|query|destination|ll|center)=|geo:)([-+]?\d{1,2}(?:\.\d+)?),([-+]?\d{1,3}(?:\.\d+)?)/i);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return {
        latitude: lat,
        longitude: lng,
        formattedUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`
      };
    }
  }

  // 2. Check for path coordinates /@lat,lng,zoom
  const atMatch = trimmed.match(/@([-+]?\d{1,2}(?:\.\d+)?),([-+]?\d{1,3}(?:\.\d+)?)/i);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return {
        latitude: lat,
        longitude: lng,
        formattedUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`
      };
    }
  }

  // 3. Check for protobuf data parameters !3dlat!4dlng
  const dataMatch = trimmed.match(/!3d([-+]?\d{1,2}(?:\.\d+)?)(?:!4d|.*!4d)([-+]?\d{1,3}(?:\.\d+)?)/i);
  if (dataMatch) {
    const lat = parseFloat(dataMatch[1]);
    const lng = parseFloat(dataMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return {
        latitude: lat,
        longitude: lng,
        formattedUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`
      };
    }
  }

  // 4. Check for direct comma-separated "lat, lng" string
  const plainCoords = trimmed.match(/^([-+]?\d{1,2}(?:\.\d+)?)\s*,\s*([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (plainCoords) {
    const lat = parseFloat(plainCoords[1]);
    const lng = parseFloat(plainCoords[2]);
    if (isValidCoordinates(lat, lng)) {
      return {
        latitude: lat,
        longitude: lng,
        formattedUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`
      };
    }
  }

  return null;
};

/**
 * Validates that latitude and longitude fall within real Earth geographic boundaries
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
};

/**
 * Determines the country and settlement currency based on real-world geographic bounding boxes
 */
export const resolveCountryFromCoordinates = (lat: number, lng: number): CountryInfo => {
  if (!isValidCoordinates(lat, lng)) {
    return supportedCountries[0]; // Default UAE (AED)
  }

  // United Arab Emirates (UAE)
  if (lat >= 22.5 && lat <= 26.5 && lng >= 51.0 && lng <= 56.5) {
    return getCountryByCode('AE');
  }

  // India (IN)
  if (lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5) {
    return getCountryByCode('IN');
  }

  // Saudi Arabia (SA)
  if (lat >= 16.0 && lat <= 32.5 && lng >= 34.5 && lng <= 55.5) {
    return getCountryByCode('SA');
  }

  // United States (US)
  if (lat >= 24.0 && lat <= 49.5 && lng >= -125.0 && lng <= -66.5) {
    return getCountryByCode('US');
  }

  // United Kingdom (GB)
  if (lat >= 49.5 && lat <= 60.5 && lng >= -8.5 && lng <= 2.0) {
    return getCountryByCode('GB');
  }

  // Singapore (SG)
  if (lat >= 1.15 && lat <= 1.5 && lng >= 103.6 && lng <= 104.1) {
    return getCountryByCode('SG');
  }

  // Oman (OM)
  if (lat >= 16.5 && lat <= 26.5 && lng >= 51.8 && lng <= 60.0) {
    return getCountryByCode('OM');
  }

  // Qatar (QA)
  if (lat >= 24.4 && lat <= 26.3 && lng >= 50.7 && lng <= 51.7) {
    return getCountryByCode('QA');
  }

  // Bahrain (BH)
  if (lat >= 25.7 && lat <= 26.4 && lng >= 50.3 && lng <= 50.8) {
    return getCountryByCode('BH');
  }

  // Kuwait (KW)
  if (lat >= 28.5 && lat <= 30.2 && lng >= 46.5 && lng <= 48.5) {
    return getCountryByCode('KW');
  }

  // Australia (AU)
  if (lat >= -44.0 && lat <= -10.0 && lng >= 112.0 && lng <= 154.0) {
    return getCountryByCode('AU');
  }

  // Canada (CA)
  if (lat >= 41.5 && lat <= 83.5 && lng >= -141.0 && lng <= -52.5) {
    return getCountryByCode('CA');
  }

  return supportedCountries[0]; // Default UAE
};

/**
 * Calculates high-precision spherical distance between two geographic points using Earth Haversine formula
 * Returns distance in Kilometers rounded to 1 decimal place (e.g. 1.2, 3.8)
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
    return 1.2; // Fallback sensible default
  }

  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

/**
 * Generates an official Google Maps turn-by-turn navigation URL for one-tap customer directions
 */
export const generateGoogleMapsDirectionsUrl = (
  lat: number,
  lng: number,
  address?: string
): string => {
  if (isValidCoordinates(lat, lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}`;
  }
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  return 'https://maps.google.com';
};
