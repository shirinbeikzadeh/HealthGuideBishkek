import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function distanceKm(a, b) {
  const radians = degrees => degrees * Math.PI / 180;
  const dLat = radians(b.lat-a.lat), dLon = radians(b.lng-a.lng);
  const value = Math.sin(dLat/2)**2 + Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1-value));
}

export function renderDirectoryMap(element, records, userPosition) {
  const map = L.map(element, {scrollWheelZoom:false, zoomAnimation:false, fadeAnimation:false, markerZoomAnimation:false}).setView([42.855,74.605], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  const points = [];
  for (const record of records) {
    if (!record.coordinates) continue;
    const point = [record.coordinates.lat, record.coordinates.lng];
    const popup = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = record.name;
    const address = document.createElement('p');
    address.textContent = record.address;
    popup.append(title, address);
    if (record.availabilityNote) {
      const note = document.createElement('p');
      note.textContent = record.availabilityNote;
      popup.append(note);
    }
    L.circleMarker(point,{radius:9,color:'#fff',weight:2,fillColor:'#087c6d',fillOpacity:1}).addTo(map).bindPopup(popup);
    points.push(point);
  }
  if (userPosition) {
    const point = [userPosition.lat,userPosition.lng];
    L.circleMarker(point,{radius:9,color:'#fff',weight:3,fillColor:'#246fd1',fillOpacity:1}).addTo(map).bindPopup('Your approximate location');
    points.push(point);
  }
  if (points.length) map.fitBounds(points,{padding:[35,35],maxZoom:15});
  return map;
}
