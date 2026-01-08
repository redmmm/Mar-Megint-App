export interface WeatherData {
  temp: number;
  conditionText: string;
  canSkate: boolean;
  city: string;
  permissionDenied?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

// Get user's current location with optimized settings
export const getPositionWithTimeout = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    console.log('Checking geolocation support...');

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      reject(new Error('A böngésző nem támogatja a helymeghatározást'));
      return;
    }

    console.log('Requesting geolocation permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position.coords.latitude, position.coords.longitude);
        resolve(position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: false, // Use Wi-Fi/IP location for speed
        timeout: 30000, // Wait 30 seconds for user decision
        maximumAge: 1800000, // 30 minutes - use cached location if recent
      }
    );
  });
};

// Get city name from coordinates using Nominatim (OpenStreetMap)
export const getCityFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Failed to get location data');
    }

    const data = await response.json();

    // Try to get city name from different possible fields
    const city = data.address?.city ||
                 data.address?.town ||
                 data.address?.village ||
                 data.address?.municipality ||
                 data.display_name?.split(',')[0] ||
                 'Unknown Location';

    return city;
  } catch (error) {
    console.error('Error getting city name:', error);
    return 'Unknown Location';
  }
};

// Helper function for city name (alias for backward compatibility)
export const getCityName = getCityFromCoordinates;

// Get location via IP address using geojs.io
export const getLocationFromIP = async (): Promise<{ latitude: number; longitude: number; city: string }> => {
  console.log('Fetching location via IP address...');

  const response = await fetch('https://get.geojs.io/v1/ip/geo.json');

  if (!response.ok) {
    throw new Error('Failed to fetch IP location data');
  }

  const data = await response.json();

  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);
  const city = data.city || 'Unknown Location';

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinates from IP location');
  }

  console.log('IP location data:', { latitude, longitude, city });
  return { latitude, longitude, city };
};

// Fetch weather data and return complete result
export const fetchWeatherFromOpenMeteo = async (lat: number, lon: number, city: string): Promise<WeatherData> => {
  try {
    console.log('Fetching weather data with coordinates:', { lat, lon, city });

    // Get weather data
    const weatherData = await getWeatherData(lat, lon);
    console.log('Weather conditions:', weatherData);

    // Check skate conditions
    const skateCheck = checkSkateConditions(weatherData.temperature, weatherData.weatherCode);
    console.log('Skate conditions result:', skateCheck);

    // Add city to result
    skateCheck.city = city;

    console.log('Final result:', skateCheck);
    return skateCheck;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    console.error('Weather fetch failed:', errorMessage);
    throw new Error(`Időjárás adatok lekérése sikertelen: ${errorMessage}`);
  }
};

// Fetch weather data from Open-Meteo API
export const getWeatherData = async (lat: number, lon: number): Promise<{ temperature: number; weatherCode: number }> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
  };
};

// Determine if weather conditions are suitable for skating
export const checkSkateConditions = (temperature: number, weatherCode: number): WeatherData => {
  // WMO Weather Codes 51+ indicate precipitation (rain, snow, etc.)
  const hasPrecipitation = weatherCode >= 51;
  const isSnow = weatherCode >= 71 && weatherCode <= 86; // Snow codes

  // Precipitation is the #1 dealbreaker
  if (hasPrecipitation) {
    const precipitationType = isSnow ? 'havazik' : 'esik';
    return {
      temp: temperature,
      conditionText: `Nincs deszkás idő, mert ${precipitationType}.`,
      canSkate: false,
      city: '', // Will be filled by caller
    };
  }

  // Temperature-based logic when it's clear/dry
  if (temperature > 33) {
    return {
      temp: temperature,
      conditionText: 'Túl meleg van a deszkázáshoz.',
      canSkate: false,
      city: '',
    };
  }

  if (temperature > 30) {
    return {
      temp: temperature,
      conditionText: 'Meleg van, de tolhatod.',
      canSkate: true,
      city: '',
    };
  }

  if (temperature >= 20 && temperature <= 28) {
    return {
      temp: temperature,
      conditionText: 'Ideális deszkás idő van!',
      canSkate: true,
      city: '',
    };
  }

  if (temperature >= 10 && temperature < 20) {
    return {
      temp: temperature,
      conditionText: 'Deszkás idő van.',
      canSkate: true,
      city: '',
    };
  }

  if (temperature < 5) {
    return {
      temp: temperature,
      conditionText: 'Túl hideg van a deszkázáshoz.',
      canSkate: false,
      city: '',
    };
  }

  if (temperature >= 5 && temperature < 10) {
    return {
      temp: temperature,
      conditionText: 'Deszkás idő, de hideg van.',
      canSkate: true,
      city: '',
    };
  }

  // Default case (shouldn't reach here with current logic)
  return {
    temp: temperature,
    conditionText: 'Deszkás idő van.',
    canSkate: true,
    city: '',
  };
};

// Main function to get complete weather check
export const getSkateWeatherCheck = async (): Promise<WeatherData> => {
  // Initialize with Győr fallback by default
  let lat = 47.6875;
  let lon = 17.6504;
  let city = "Győr (Alapértelmezett)";

  try {
    // Layer 1: Try Browser Geolocation
    console.log("Layer 1: Attempting browser geolocation...");
    const pos = await getPositionWithTimeout();
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    city = await getCityName(lat, lon) || "Ismeretlen helyszín";
    console.log("Browser location found:", city);

  } catch (browserError) {
    console.warn("Browser geolocation failed:", browserError);

    // Check error codes for strict handling
    if (browserError instanceof GeolocationPositionError) {
      // Error code 1: PERMISSION_DENIED - User clicked "Block"
      // Error code 3: TIMEOUT - User left popup open too long
      // For both cases: Fall back to Győr immediately without IP fallback
      if (browserError.code === 1 || browserError.code === 3) {
        console.log(`User ${browserError.code === 1 ? 'denied permission' : 'timed out'}. Using Győr fallback without IP fallback.`);
        const weatherResult = await fetchWeatherFromOpenMeteo(lat, lon, city);
        return {
          ...weatherResult,
          permissionDenied: true
        };
      }

      // Error code 2: POSITION_UNAVAILABLE - User allowed but hardware failed
      // Only in this case, try IP fallback
      if (browserError.code === 2) {
        try {
          console.log("Layer 2: Attempting IP geolocation fallback (hardware failure)...");
          const ipLocation = await getLocationFromIP();
          lat = ipLocation.latitude;
          lon = ipLocation.longitude;
          city = ipLocation.city;
          console.log("IP Location found:", city);
        } catch (ipError) {
          console.warn("IP geolocation failed. Using Győr fallback.", ipError);
        }
      }
    } else {
      // Non-GeolocationPositionError (e.g., network issues, etc.)
      // Fall back to Győr without IP fallback
      console.warn("Non-geolocation error. Using Győr fallback.", browserError);
    }
  }

  // Layer 4: Fetch Weather (always runs with final coordinates)
  return await fetchWeatherFromOpenMeteo(lat, lon, city);
};

// Search for Hungarian cities using Open-Meteo Geocoding API
export interface HungarianCityResult {
  name: string;
  latitude: number;
  longitude: number;
}

export const searchHungarianCities = async (query: string): Promise<HungarianCityResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=hu&format=json&country=HU`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch city search results');
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((result: any) => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
    }));
  } catch (error) {
    console.error('Error searching Hungarian cities:', error);
    return [];
  }
};
