import React, { useEffect, useRef, useState } from 'react';

interface OrderMapProps {
  restaurantLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  driverLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  restaurantName: string;
  deliveryAddress: string;
}

export default function OrderMap({
  restaurantLocation,
  deliveryLocation,
  driverLocation,
  restaurantName,
  deliveryAddress,
}: OrderMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!mapRef.current) return;

        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JavaScript
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
          if (!mapRef.current) return;

          // @ts-expect-error - Leaflet is loaded dynamically
          const L = window.L;
          
          // Create map
          const map = L.map(mapRef.current).setView(
            [restaurantLocation.latitude, restaurantLocation.longitude], 
            13
          );

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Custom marker icons
          const restaurantIcon = L.divIcon({
            className: 'custom-marker restaurant-marker',
            html: `
              <div style="
                width: 32px; 
                height: 32px; 
                background: #FF6B6B; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                <span style="color: white; font-size: 16px;">🍕</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const deliveryIcon = L.divIcon({
            className: 'custom-marker delivery-marker',
            html: `
              <div style="
                width: 32px; 
                height: 32px; 
                background: #4CAF50; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                <span style="color: white; font-size: 16px;">🏠</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const driverIcon = L.divIcon({
            className: 'custom-marker driver-marker',
            html: `
              <div style="
                width: 32px; 
                height: 32px; 
                background: #2196F3; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                <span style="color: white; font-size: 16px;">🚗</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          // Add restaurant marker
          const restaurantMarker = L.marker(
            [restaurantLocation.latitude, restaurantLocation.longitude], 
            { icon: restaurantIcon }
          ).addTo(map);

          restaurantMarker.bindPopup(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #333;">${restaurantName}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">Restaurant</p>
            </div>
          `);

          // Add delivery marker
          const deliveryMarker = L.marker(
            [deliveryLocation.latitude, deliveryLocation.longitude], 
            { icon: deliveryIcon }
          ).addTo(map);

          deliveryMarker.bindPopup(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #333;">Delivery Location</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${deliveryAddress}</p>
            </div>
          `);

          // Add driver marker if available
          if (driverLocation) {
            const driverMarker = L.marker(
              [driverLocation.latitude, driverLocation.longitude], 
              { icon: driverIcon }
            ).addTo(map);

            driverMarker.bindPopup(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #333;">Driver Location</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">Current position</p>
              </div>
            `);
          }

          // Draw route line between restaurant and delivery
          L.polyline([
            [restaurantLocation.latitude, restaurantLocation.longitude],
            [deliveryLocation.latitude, deliveryLocation.longitude]
          ], {
            color: '#3B82F6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(map);

          // Fit map to show all markers
          const bounds = L.latLngBounds([
            [restaurantLocation.latitude, restaurantLocation.longitude],
            [deliveryLocation.latitude, deliveryLocation.longitude]
          ]);
          
          if (driverLocation) {
            bounds.extend([driverLocation.latitude, driverLocation.longitude]);
          }
          
          map.fitBounds(bounds, { padding: [20, 20] });

          setIsLoading(false);
        };

        script.onerror = () => {
          setError('Failed to load map library');
          setIsLoading(false);
        };

        document.head.appendChild(script);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please check your internet connection.');
        setIsLoading(false);
      }
    };

    initMap();
  }, [restaurantLocation, deliveryLocation, driverLocation, restaurantName, deliveryAddress]);

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
} 