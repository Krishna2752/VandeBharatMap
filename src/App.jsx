import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import { Train, MapPin, Clock, Navigation, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Import your stations JSON file
import stationsLookup from './stations.json';

// Custom Icons for Terminus and Intermediate Stations
const stationIcon = new L.DivIcon({
  className: 'custom-station-icon',
  html: `<div style="background-color: #f97316; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

const terminusIcon = new L.DivIcon({
  className: 'custom-terminus-icon',
  html: `<div style="background-color: #2563eb; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Vande Bharat Route Definitions
const ROUTE_DEFINITIONS = [
  {
    id: "22435",
    name: "New Delhi - Varanasi Vande Bharat",
    color: "#2563eb",
    distance: "759 km",
    duration: "8h 00m",
    codes: ["NDLS", "CNB", "PRYJ", "BSB"]
  },
  {
  "id": "20901",
  "name": "Mumbai Central - Gandhinagar Capital",
  "color": "#dc2626",
  "distance": "522 km",
  "duration": "6h 30m",
  "codes": ["MMCT", "BVI", "VAPI", "ST", "BRC", "ADI", "GNC"]
  },
  {
    id: "20607",
    name: "MGR Chennai Central - Mysuru",
    color: "#16a34a",
    distance: "496 km",
    duration: "6h 30m",
    codes: ["MAS", "KPD", "SBC", "MYS"]
  },
  {
    id: "22301",
    name: "Howrah - New Jalpaiguri",
    color: "#9333ea",
    distance: "561 km",
    duration: "7h 30m",
    codes: ["HWH", "BHP", "MLDT", "BOE", "KNE", "NJP"]
  },
  {
    id: "20633",
    name: "Kasaragod - Thiruvananthapuram",
    color: "#ea580c",
    distance: "587 km",
    duration: "8h 05m",
    codes: ["KGQ", "CAN", "CLT", "TCR", "ERN", "KTYM", "QLN", "TVC"]
  },
  {
    id: "22439",
    name: "New Delhi - SMVD Katra",
    color: "#06b6d4",
    distance: "655 km",
    duration: "8h 05m",
    codes: ["NDLS", "UMB", "LDH", "JRC", "PTKC", "JAT", "SVDK"]
  },
  {
    id: "20704",
    name: "Yesvantpur - Kacheguda Vande Bharat",
    color: "#facc15",
    distance: "610 km",
    duration: "8h 15m",
    codes: ["YPR", "DMM", "ATP", "KRNT", "MBNR", "KCG"]
  },
  {
  "id": "26401",
  "name": "Jammu Tawi - Srinagar Vande Bharat",
  "color": "#facc15",
  "distance": "269 km",
  "duration": "4h 50m",
  "codes": ["JAT", "MCTM", "SVDK", "REAI", "BAHL", "SINA"]
},
  {
    id: "20171",
    name: "Rani Kamlapati (Bhopal) - Hazrat Nizamuddin",
    color: "#ec4899",
    distance: "702 km",
    duration: "7h 30m",
    codes: ["RKMP", "VGLJ", "GWL", "AGC", "NZM"]
  },
  {
    id: "22223",
    name: "Chhatrapati Shivaji Maharaj Terminus - Shirdi",
    color: "#8b5cf6",
    distance: "343 km",
    duration: "5h 20m",
    codes: ["CSMT", "DR", "TNA", "KYN", "NK", "SNSI"]
  },
  {
    id: "22225",
    name: "CSMT Mumbai - Solapur",
    color: "#10b981",
    distance: "452 km",
    duration: "6h 30m",
    codes: ["CSMT", "DR", "TNA", "KYN", "PUNE", "KWV", "SUR"]
  },
  {
    id: "20643",
    name: "MGR Chennai Central - Coimbatore",
    color: "#f59e0b",
    distance: "497 km",
    duration: "5h 50m",
    codes: ["MAS", "KPD", "SA", "ED", "CBE"]
  },
  {
    id: "20836",
    name: "Puri - Rourkela Vande Bharat",
    color: "#0284c7",
    distance: "505 km",
    duration: "7h 45m",
    codes: ["PURI", "BBS", "CTC", "DNKL", "ANGL", "SBPY", "JSG", "ROU"]
  },
  {
    id: "22347",
    name: "Howrah - Patna Vande Bharat",
    color: "#84cc16",
    distance: "532 km",
    duration: "6h 50m",
    codes: ["HWH", "ASN", "JSME", "JAJ", "MKA", "PNC", "PNBE"]
  },
  {
    id: "20677",
    name: "MGR Chennai Central - Vijayawada",
    color: "#6366f1",
    distance: "514 km",
    duration: "6h 40m",
    codes: ["MAS", "NLR", "OGL", "BZA"]
  },
  {
    id: "20701",
    name: "Secunderabad - Tirupati",
    color: "#d97706",
    distance: "661 km",
    duration: "8h 15m",
    codes: ["SC", "NLDA", "MRGA", "GNT", "OGL", "NLR", "TPTY"]
  },
  {
    id: "20977",
    name: "Ajmer - Delhi Cantt Vande Bharat",
    color: "#14b8a6",
    distance: "428 km",
    duration: "5h 15m",
    codes: ["AII", "KSG", "JP", "AWR", "GGN", "DEC"]
  },
  {
    id: "22549",
    name: "Gorakhpur - Prayagraj (via Lucknow)",
    color: "#e11d48",
    distance: "500 km",
    duration: "7h 30m",
    codes: ["GKP", "BST", "AY", "LKO", "CNB", "PRYJ"]
  },
  {
    id: "20833",
    name: "Visakhapatnam - Secunderabad",
    color: "#3b82f6",
    distance: "698 km",
    duration: "8h 30m",
    codes: ["VSKP", "SLLO", "RJY", "BZA", "WL", "SC"]
  },
  {
    id: "20898",
    name: "Ranchi - Howrah Vande Bharat",
    color: "#a855f7",
    distance: "463 km",
    duration: "7h 05m",
    codes: ["RNC", "MURI", "BKSC", "KGP", "HWH"]
  },
  {
    id: "22227",
    name: "New Jalpaiguri - Guwahati",
    color: "#059669",
    distance: "407 km",
    duration: "5h 30m",
    codes: ["NJP", "NCB", "NOQ", "KOJ", "RNY", "GHY"]
  },
  {
    id: "20825",
    name: "Bilaspur - Nagpur Vande Bharat",
    color: "#eab308",
    distance: "412 km",
    duration: "5h 30m",
    codes: ["BSP", "R", "DURG", "RJN", "G", "NGP"]
  },
  {
    id: "22229",
    name: "CSMT Mumbai - Madgaon (Goa)",
    color: "#06b6d4",
    distance: "586 km",
    duration: "10h 05m",
    codes: ["CSMT", "DR", "TNA", "PNVL", "KHED", "RN", "KKW", "MAO"]
  },
  {
    id: "22447",
    name: "New Delhi - Amb Andaura",
    color: "#6366f1",
    distance: "412 km",
    duration: "5h 15m",
    codes: ["NDLS", "UMB", "CDG", "ANSB", "UHL", "AADR"]
  },
  {
    id: "20661",
    name: "KSR Bengaluru - Dharwad",
    color: "#10b981",
    distance: "489 km",
    duration: "6h 25m",
    codes: ["SBC", "YPR", "DVG", "UBL", "DWR"]
  },
  {
    id: "22545",
    name: "Lucknow - Dehradun Vande Bharat",
    color: "#f43f5e",
    distance: "545 km",
    duration: "8h 15m",
    codes: ["LKO", "BE", "MB", "HW", "DDN"]
  },
  {
    id: "20979",
    name: "Udaipur City - Jaipur",
    color: "#8b5cf6",
    distance: "435 km",
    duration: "6h 15m",
    codes: ["UDZ", "MVJ", "CNA", "BHL", "AII", "KSG", "JP"]
  },
  {
    id: "22349",
    name: "Patna - Ranchi Vande Bharat",
    color: "#ec4899",
    distance: "379 km",
    duration: "6h 00m",
    codes: ["PNBE", "GAYA", "KQR", "HZBN", "BRKA", "MURI", "RNC"]
  },
  {
    id: "20653",
    name: "KSR Bengaluru - Ernakulam",
    color: "#14b8a6",
    distance: "587 km",
    duration: "8h 40m",
    codes: ["SBC", "TPT", "SA", "ED", "TUP", "CBE", "PGT", "TCR", "ERS"]
  },
  {
    id: "20605",
    name: "Chennai Egmore - Nagercoil",
    color: "#d97706",
    distance: "724 km",
    duration: "8h 50m",
    codes: ["MS", "TBM", "VM", "TPJ", "DG", "MDU", "VPT", "CVP", "TEN", "NCJ"]
  },
  {
    id: "20835",
    name: "Visakhapatnam - Bhubaneswar",
    color: "#0284c7",
    distance: "444 km",
    duration: "6h 15m",
    codes: ["VSKP", "VZM", "CHE", "PSA", "BAM", "BALU", "KUR", "BBS"]
  },
  {
    id: "20903",
    name: "Ahmedabad - Okha Vande Bharat",
    color: "#3b82f6",
    distance: "499 km",
    duration: "6h 30m",
    codes: ["ADI", "VG", "SUNR", "RJT", "JAM", "DWK", "OKHA"]
  },
  {
    id: "22457",
    name: "Anand Vihar (Delhi) - Dehradun",
    color: "#84cc16",
    distance: "302 km",
    duration: "4h 45m",
    codes: ["ANVT", "MTC", "SRE", "RK", "HW", "DDN"]
  },
  {
    id: "20705",
    name: "Mumbai CSMT - Jalna Vande Bharat",
    color: "#a855f7",
    distance: "437 km",
    duration: "6h 50m",
    codes: ["CSMT", "DR", "TNA", "KYN", "NK", "MMR", "AWB", "J"]
  },
  {
    id: "20645",
    name: "Mangaluru Central - Thiruvananthapuram",
    color: "#f59e0b",
    distance: "621 km",
    duration: "8h 35m",
    codes: ["MAQ", "KGQ", "CAN", "CLT", "SRR", "TCR", "ERN", "KTYM", "QLN", "TVC"]
  },
  {
    id: "20173",
    name: "Rani Kamalapati - Rewa",
    color: "#10b981",
    distance: "568 km",
    duration: "8h 00m",
    codes: ["RKMP", "NDPM", "ET", "PPI", "JBP", "KTE", "MYR", "REWA"]
  },
  {
    id: "20871",
    name: "Howrah - Rourkela Vande Bharat",
    color: "#06b6d4",
    distance: "413 km",
    duration: "6h 05m",
    codes: ["HWH", "KGP", "TATA", "CKU", "ROU"]
  },
  {
    id: "22425",
    name: "Ayodhya Dham - Anand Vihar Terminal",
    color: "#ec4899",
    distance: "628 km",
    duration: "8h 20m",
    codes: ["AY", "LKO", "CNB", "ANVT"]
  },
  {
    id: "22345",
    name: "Patna - Gomti Nagar (Lucknow)",
    color: "#6366f1",
    distance: "545 km",
    duration: "8h 30m",
    codes: ["PNBE", "ARA", "BXR", "DDU", "BSB", "GTNR"]
  },
  {
    id: "20897",
    name: "Howrah - Gaya Vande Bharat",
    color: "#eab308",
    distance: "458 km",
    duration: "5h 40m",
    codes: ["HWH", "DGR", "ASN", "DHN", "KQR", "GAYA"]
  }
];

function MapBackgroundClickHandler({ onReset }) {
  useMapEvent('click', (e) => {
    const target = e.originalEvent.target;
    const clickedOnRoute = target.closest('.leaflet-interactive');
    if (!clickedOnRoute) {
      onReset();
    }
  });
  return null;
}

export default function App() {
  const [selectedRouteId, setSelectedRouteId] = useState('ALL');

  const handleRouteClick = (routeId) => {
    setSelectedRouteId((current) => (current === routeId ? 'ALL' : routeId));
  };

  const handleMapReset = () => {
    setSelectedRouteId('ALL');
  };

  // Process and map station codes to coordinates safely
  const processedRoutes = useMemo(() => {
    return ROUTE_DEFINITIONS.map(route => {
      const resolvedStations = route.codes.map(code => {
        const lookup = stationsLookup[code.toUpperCase()] || stationsLookup[code];
        
        // Ensure lat/lng are strictly numbers
        if (lookup && lookup.lat !== undefined && lookup.lng !== undefined) {
          const latNum = typeof lookup.lat === 'number' ? lookup.lat : parseFloat(lookup.lat);
          const lngNum = typeof lookup.lng === 'number' ? lookup.lng : parseFloat(lookup.lng);

          if (!isNaN(latNum) && !isNaN(lngNum)) {
            return {
              code: code,
              name: lookup.name || code,
              lat: latNum,
              lng: lngNum
            };
          }
        }
        return null;
      }).filter(Boolean);

      return {
        ...route,
        stations: resolvedStations,
        isValid: resolvedStations.length >= 2
      };
    });
  }, []);

  // Filter routes based on dropdown selection
  const activeRoutes = useMemo(() => {
    if (selectedRouteId === 'ALL') {
      return processedRoutes.filter(r => r.isValid);
    }
    return processedRoutes.filter(r => r.id === selectedRouteId && r.isValid);
  }, [selectedRouteId, processedRoutes]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700 shadow-md backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Train className="h-7 w-7 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">Vande Bharat Express Network</h1>
            <p className="text-xs text-slate-400">Live Interactive Map</p>
          </div>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300">Select Route:</label>
          <select
            className="bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
          >
            <option value="ALL">All Operational Routes ({activeRoutes.length} active)</option>
            {processedRoutes.map(route => (
              <option key={route.id} value={route.id}>
                {route.name} ({route.id}) {route.isValid ? '' : '[Missing Stations]'}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Map Container */}
      <div className="flex flex-1 relative overflow-hidden">
        <div className="flex-1 h-full z-0">
          <MapContainer
            center={[19.3826, 72.8320]} // Centered around Vasai Road / Naigaon region
            zoom={6}
            zoomControl={false}
            className="h-full w-full bg-slate-950"
          >
            <MapBackgroundClickHandler onReset={handleMapReset} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />

            {/* Render Routes & Markers */}
            {activeRoutes.map((route) => {
              const routePolyline = route.stations.map(s => [s.lat, s.lng]);
              const isSelected = selectedRouteId === route.id;

              return (
                <React.Fragment key={route.id}>
                  {/* Route Polyline */}
                  <Polyline
                    positions={routePolyline}
                    pathOptions={{
                      color: route.color,
                      weight: isSelected ? 6 : 4,
                      opacity: isSelected || selectedRouteId === 'ALL' ? 0.9 : 0.2,
                      className: 'cursor-pointer'
                    }}
                    eventHandlers={{
                      click: (e) => {
                        // Prevent Leaflet from triggering click events on overlapping routes underneath
                        L.DomEvent.stopPropagation(e.originalEvent);
                        handleRouteClick(route.id);
                      }
                    }}
                  />

                  {/* Station Markers */}
                  {route.stations.map((station, idx) => {
                    const isTerminus = idx === 0 || idx === route.stations.length - 1;
                    return (
                      <Marker
                        key={`${route.id}-${station.code}-${idx}`}
                        position={[station.lat, station.lng]}
                        icon={isTerminus ? terminusIcon : stationIcon}
                      >
                        <Popup>
                          <div className="p-1 min-w-[180px]">
                            <h3 className="font-bold text-slate-900 text-sm border-b pb-1 flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-orange-600 inline" />
                              {station.name}
                            </h3>
                            <div className="mt-2 text-xs text-slate-700 space-y-1">
                              <p><span className="font-semibold">Station Code:</span> {station.code}</p>
                              <p><span className="font-semibold">Route:</span> {route.name}</p>
                              <p><span className="font-semibold">Coordinates:</span> {station.lat.toFixed(4)}, {station.lng.toFixed(4)}</p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="absolute top-4 left-4 z-10 w-80 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl max-h-[85vh] overflow-y-auto">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-orange-400" /> Active Route Details
          </h2>

          <div className="space-y-3">
            {activeRoutes.length === 0 ? (
              <div className="text-xs text-amber-400 bg-amber-950/50 p-3 rounded border border-amber-800">
                No matching station codes found in <code>stations.json</code>. Ensure station codes in <code>ROUTE_DEFINITIONS</code> match JSON keys.
              </div>
            ) : (
              activeRoutes.map((route) => {
                const isSelected = selectedRouteId === route.id;

                return (
                  <div
                    key={route.id}
                    onClick={() => handleRouteClick(route.id)}
                    className={[
                      'cursor-pointer rounded-lg border transition-all duration-200',
                      isSelected
                        ? 'scale-[1.02] border-orange-400 bg-slate-600/80 p-4 shadow-lg shadow-orange-500/10'
                        : 'border-slate-600 bg-slate-700/50 p-3 hover:border-slate-500'
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }}></span>
                      <h3 className="font-medium text-sm text-slate-100">{route.name}</h3>
                    </div>

                    <div className="flex justify-between text-xs text-slate-300 mt-2">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-slate-400" /> {route.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" /> {route.duration}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-600/60 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Stops: </span>
                      {route.stations.map(s => `${s.name} (${s.code})`).join(' → ')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}