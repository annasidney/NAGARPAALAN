import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Asset, Issue, DashcamVehicle } from '../types';

interface CityMapProps {
  assets: Asset[];
  issues: Issue[];
  vehicles?: DashcamVehicle[];
  selectedAssetId?: string | null;
  onSelectAsset?: (assetId: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showHeatmapLayer?: boolean;
}

export const CityMapComponent: React.FC<CityMapProps> = ({
  assets,
  issues,
  vehicles = [],
  selectedAssetId,
  onSelectAsset,
  center = [12.9716, 77.5946], // Bengaluru center default
  zoom = 13,
  height = '540px',
  showHeatmapLayer = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet marker icons
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: true
      });

      // OpenStreetMap standard tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers and selected asset
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const map = mapInstanceRef.current;

    // Add Asset Markers
    assets.forEach((asset) => {
      const isSelected = asset.id === selectedAssetId;
      const isCritical = asset.currentRiskScore >= 75 || asset.recurrenceCount > 1;

      const markerColor = isCritical
        ? '#ef4444' // red
        : asset.currentRiskScore >= 50
        ? '#f59e0b' // amber
        : '#10b981'; // green

      const iconHtml = `
        <div style="
          background-color: ${markerColor};
          width: ${isSelected ? '28px' : '22px'};
          height: ${isSelected ? '28px' : '22px'};
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 ${isSelected ? '16px 4px' : '8px 2px'} ${markerColor}88;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <span style="font-size: 10px; color: white; font-weight: bold;">
            ${asset.category === 'road' ? '🛣️' : asset.category === 'streetlight' ? '💡' : '🌊'}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-asset-marker',
        html: iconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([asset.latitude, asset.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; color: #0f172a; min-width: 200px; padding: 2px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">${asset.assetCode}</div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${asset.name}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">Ward: ${asset.ward}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px;">
            <span>Condition: <b>${asset.conditionScore}/100</b></span>
            <span style="color: ${markerColor}; font-weight: bold;">Risk: ${asset.currentRiskScore}/100</span>
          </div>
          ${asset.recurrenceCount > 0 ? `<div style="background-color: #fee2e2; color: #b91c1c; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px;">⚠️ ${asset.recurrenceCount} RECURRING FAILURES</div>` : ''}
          <button id="view-asset-btn-${asset.id}" style="
            width: 100%;
            background-color: #0f172a;
            color: #ffffff;
            border: none;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">Inspect City Memory</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-asset-btn-${asset.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectAsset) onSelectAsset(asset.id);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectAsset) onSelectAsset(asset.id);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Add Patrol Vehicles
    vehicles.forEach((veh) => {
      const vehIconHtml = `
        <div style="
          background-color: #0284c7;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: 12px;">🚗</span>
        </div>
      `;

      const vehMarker = L.marker([veh.currentLat, veh.currentLng], {
        icon: L.divIcon({
          className: 'dashcam-veh-marker',
          html: vehIconHtml,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      });

      vehMarker.bindPopup(`
        <div style="font-family: inherit; color: #0f172a;">
          <div style="font-weight: bold; font-size: 13px;">${veh.vehicleId}</div>
          <div style="font-size: 11px; color: #64748b;">Driver: ${veh.driverName}</div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 4px;">Live Speed: ${veh.speedKmh} km/h</div>
          <div style="font-size: 11px;">Detections: <b>${veh.detectionsCount}</b></div>
        </div>
      `);

      markersLayerRef.current?.addLayer(vehMarker);
    });

    // If an asset is selected, smoothly fly to it
    if (selectedAssetId) {
      const target = assets.find((a) => a.id === selectedAssetId);
      if (target) {
        map.flyTo([target.latitude, target.longitude], 15, { duration: 1.2 });
      }
    }
  }, [assets, issues, vehicles, selectedAssetId, onSelectAsset]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 text-xs flex items-center gap-4 text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Normal (&lt;50 Risk)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>Elevated Risk (50-74)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>
          <span>Critical Failure / Recurrence (75+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block"></span>
          <span>Dashcam Patrol</span>
        </div>
      </div>
    </div>
  );
};
