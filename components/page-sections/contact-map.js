"use client";
import React, { useEffect, useRef } from 'react';

const ContactMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const ipinfoToken = process.env.NEXT_PUBLIC_IPINFO_TOKEN;

    if (!googleMapsApiKey) {
      console.error('Missing Google Maps API key');
      return;
    }

    const officeLocation = { lat: 34.2223615, lng: -118.3973938 };

    const loadScript = (url) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`
    );

    window.initMap = async () => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
        center: officeLocation,
      });

      new window.google.maps.Marker({
        position: officeLocation,
        map,
        title: 'Our Office',
      });

      try {
        const res = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`);
        const data = await res.json();
        if (!data.loc) throw new Error('Invalid IPInfo response');
        const [userLat, userLng] = data.loc.split(',').map(Number);
        const userLocation = { lat: userLat, lng: userLng };

        new window.google.maps.Marker({
          position: userLocation,
          map,
          title: 'Your Location',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });

        new window.google.maps.Polyline({
          path: [userLocation, officeLocation],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map,
        });

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(userLocation);
        bounds.extend(officeLocation);
        map.fitBounds(bounds);
      } catch (err) {
        console.error('Geolocation error:', err);
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[500px] shadow-lg" />;
};

export default ContactMap;
