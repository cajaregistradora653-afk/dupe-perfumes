import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Ambas sedes en un solo mapa (coordenadas verificadas) */
const SEDES = [
  {
    nombre: 'Sede Plaza Barcelona',
    dir: 'Cra. 11 #14-51 · CC Plaza Barcelona',
    pos: [5.7178304, -72.9270605],
    gdir: 'https://www.google.com/maps/dir/?api=1&destination=Cra.+11+%2314-51,+Sogamoso,+Boyac%C3%A1',
  },
  {
    nombre: 'Sede Plaza de la Villa',
    dir: 'Cl. 12 #10-88 · Plaza de la Villa',
    pos: [5.7147979, -72.9277154],
    gdir: 'https://www.google.com/maps/dir/?api=1&destination=Cl.+12+%2310-88,+Sogamoso,+Boyac%C3%A1',
  },
];

const pinIcon = () =>
  L.divIcon({
    className: 'dupe-pin',
    html: '<div style="width:30px;height:30px;border-radius:50%;background:#1E5144;border:3px solid #C9A84C;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.35)"><div style="width:8px;height:8px;border-radius:50%;background:#fff"></div></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });

const SedesMap = () => {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !ref.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: true }).setView([5.7163, -72.9274], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    SEDES.forEach((s) => {
      L.marker(s.pos, { icon: pinIcon() })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:160px"><b>${s.nombre}</b><br/><span style="color:#555">${s.dir}</span><br/><a href="${s.gdir}" target="_blank" rel="noopener" style="color:#1E5144;font-weight:bold">Cómo llegar &rarr;</a></div>`
        );
    });
    map.fitBounds(L.latLngBounds(SEDES.map((s) => s.pos)).pad(0.4));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
};

export default SedesMap;
