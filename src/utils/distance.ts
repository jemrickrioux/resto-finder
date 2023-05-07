type LatLong = {
  lat: number;
  lng: number;
};

export function calculateDistance(from: LatLong, to: LatLong): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(from.lat - to.lat);
  const dLon = toRadians(from.lng - to.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
