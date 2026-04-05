// ---------------- CONFIG SICUREZZA ----------------
const CONFIG = {
  CACHE_DURATION: 60 * 60 * 1000,
  MAX_REQUESTS: 5,
  TIME_WINDOW: 10000 // 10 secondi
};

let requestCount = 0;
let lastReset = Date.now();

// ---------------- RATE LIMIT ----------------
function canMakeRequest() {
  const now = Date.now();

  if (now - lastReset > CONFIG.TIME_WINDOW) {
    requestCount = 0;
    lastReset = now;
  }

  if (requestCount >= CONFIG.MAX_REQUESTS) {
    return false;
  }

  requestCount++;
  return true;
}

// ---------------- SANITIZZAZIONE INPUT ----------------
function sanitizeInput(input) {
  return input.replace(/[<>]/g, "").trim();
}

// ---------------- FETCH SICURO (con timeout) ----------------
async function safeFetch(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) throw new Error("Errore API");

    return await response.json();
  } catch (error) {
    throw new Error("Errore di rete o timeout");
  }
}

// ---------------- CACHE ----------------
function saveToCache(key, data) {
  const cacheObject = { data, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(cacheObject));
}

function getFromCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsed = JSON.parse(cached);

  if (Date.now() - parsed.timestamp > CONFIG.CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

// ---------------- DESCRIZIONE METEO ----------------
function getWeatherDescription(code) {
  const descriptions = {
    0: "Cielo sereno", 1: "Prevalentemente sereno", 2: "Parzialmente nuvoloso",
    3: "Nuvoloso", 45: "Nebbia", 48: "Nebbia con brina",
    51: "Pioggia leggera", 61: "Pioggia", 71: "Neve", 80: "Rovesci",
  };
  return descriptions[code] || "Condizioni meteo sconosciute";
}

// ---------------- METEO ----------------
async function getWeatherByCity(cityName) {
  try {
    // 🔐 Sanitizzazione
    cityName = sanitizeInput(cityName);

    if (!cityName) {
      return { error: true, message: "Inserisci una città valida" };
    }

    // 🔐 Rate limit
    if (!canMakeRequest()) {
      return { error: true, message: "Troppe richieste, riprova tra poco" };
    }

    const cacheKey = "weather_" + cityName.toLowerCase();
    const cachedWeather = getFromCache(cacheKey);
    if (cachedWeather) return cachedWeather;

    // 🔹 Geocoding
    const geoData = await safeFetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
    );

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Città non trovata");
    }

    const { latitude, longitude, name } = geoData.results[0];

    // 🔹 Meteo (solo dati affidabili)
    const weatherData = await safeFetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!weatherData.current_weather) {
      throw new Error("Dati meteo non disponibili");
    }

    const result = {
      city: name,
      temperature: weatherData.current_weather.temperature,
      description: getWeatherDescription(weatherData.current_weather.weathercode)
    };

    saveToCache(cacheKey, result);
    return result;

  } catch (error) {
    return { error: true, message: error.message };
  }
}

// ---------------- MULTIPLE CITTÀ ----------------
async function getWeatherForMultipleCities(cityList) {
  const cities = cityList.split(",").map(c => sanitizeInput(c));
  const results = [];

  for (const city of cities) {
    if (city) {
      results.push(await getWeatherByCity(city));
    }
  }

  return results;
}

// ---------------- UI ----------------
function displayWeather(results) {
  const container = document.getElementById("output");
  container.innerHTML = "";

  results.forEach(item => {
    if (item.error) {
      container.innerHTML += `<p class="error">${item.message}</p>`;
      return;
    }

    container.innerHTML += `
      <div class="weather-card-result">
        <h2>${item.city}</h2>
        <p><strong>Temperatura:</strong> ${item.temperature} °C</p>
        <p><strong>Condizioni:</strong> ${item.description}</p>
      </div>
    `;
  });
}

// ---------------- UI EVENT ----------------
async function handleClick() {
  const input = document.getElementById("cityInput").value;
  const results = await getWeatherForMultipleCities(input);
  displayWeather(results);
}

// ---------------- INFO LICENZE (per il corso) ----------------
console.log("Dati forniti da Open-Meteo API (uso gratuito, no API key richiesta)");