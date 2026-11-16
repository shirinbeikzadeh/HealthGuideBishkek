import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function distanceKm(a, b) {
  const radians = degrees => degrees * Math.PI / 180;
  const dLat = radians(b.lat-a.lat), dLon = radians(b.lng-a.lng);
  const value = Math.sin(dLat/2)**2 + Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1-value));
}

export function renderDirectoryMap(element, records, userPosition, labels = {}) {
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
    const hint = document.createElement('p');
    hint.className = 'map-destination-hint';
    hint.textContent = labels.approximate || 'The map pin is approximate. Confirm the destination before booking.';
    popup.append(hint);
    const actions = document.createElement('div');
    actions.className = 'map-destination-actions';
    const destination = encodeURIComponent(record.address);
    const taxiParams = new URLSearchParams({
      'end-lat': String(record.coordinates.lat),
      'end-lon': String(record.coordinates.lng),
      appmetrica_tracking_id: '25395763362139037'
    });
    const destinations = [
      [labels.yandexTaxi || 'Yandex Go taxi', 'https://3.redirect.appmetrica.yandex.com/route?' + taxiParams, false],
      ['2GIS', record.mapUrl?.startsWith('https://2gis.kg/') ? record.mapUrl : 'https://2gis.kg/bishkek/search/' + destination, true],
      ['Google Maps', 'https://www.google.com/maps/search/?api=1&query=' + destination, true]
    ];
    for (const [label, url, newTab] of destinations) {
      const action = document.createElement('a');
      action.className = 'map-destination-button';
      action.textContent = label;
      action.href = url;
      if (newTab) { action.target = '_blank'; action.rel = 'noopener noreferrer'; }
      actions.append(action);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'map-destination-button map-copy';
    copy.textContent = labels.copyAddress || 'Copy address';
    const feedback = document.createElement('p');
    feedback.className = 'map-copy-feedback';
    feedback.setAttribute('role', 'status');
    const manual = document.createElement('input');
    manual.type = 'text';
    manual.value = record.address;
    manual.readOnly = true;
    manual.hidden = true;
    manual.setAttribute('aria-label', labels.copyAddress || 'Copy address');
    copy.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(record.address);
        feedback.textContent = labels.copied || 'Address copied.';
        manual.hidden = true;
      } catch {
        manual.hidden = false;
        manual.focus();
        manual.select();
        feedback.textContent = labels.copyManually || 'Select and copy the address.';
      }
    });
    actions.append(copy);
    popup.append(actions, feedback, manual);
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
