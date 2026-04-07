/**
 * Calculates the great-circle distance between two coordinates
 * using the Haversine formula.
 *
 * @param {number} lat1  - Latitude of point A (degrees)
 * @param {number} lon1  - Longitude of point A (degrees)
 * @param {number} lat2  - Latitude of point B (degrees)
 * @param {number} lon2  - Longitude of point B (degrees)
 * @returns {number}       Distance in kilometres (rounded to 4 decimal places)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const EARTH_RADIUS_KM = 6371;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((EARTH_RADIUS_KM * c).toFixed(4));
};

module.exports = { calculateDistance };
