# 🌦️ Weather App (JavaScript + Open-Meteo API)

## 📌 Panoramica

Questa applicazione web permette agli utenti di inserire il nome di una città e ottenere informazioni meteo in tempo reale.

L'app utilizza le API gratuite di Open-Meteo per:
1. Convertire il nome della città in coordinate geografiche (latitudine e longitudine)
2. Recuperare i dati meteo attuali

È progettata come progetto didattico per sviluppatori principianti che vogliono imparare:
- Uso delle API con `fetch`
- Programmazione asincrona (`async/await`)
- Gestione degli errori
- Manipolazione del DOM

---

## ✨ Funzionalità

- 🔍 Inserimento città tramite input utente
- 🌍 Conversione città → coordinate (Geocoding API)
- 🌡️ Recupero temperatura attuale
- ☁️ Descrizione meteo leggibile
- ⚠️ Gestione errori:
  - input vuoto
  - città non valida
  - errori API
- 🧾 Output formattato in JSON

---

## ⚙️ Installazione

1. Clona o scarica il progetto:
```bash
git clone <repo-url>
cd <repo>
```

2. Apri il progetto in VS Code

3. Installa l’estensione consigliata:
- Live Server

4. Avvia il progetto:
- Click destro su `index.html`
- → Open with Live Server

---

## 🚀 Utilizzo

1. Inserisci il nome di una città nel campo input
2. Clicca sul pulsante "Cerca"
3. Visualizza il risultato nel browser

---

## 📥 Esempi di output

### ✔️ Caso valido
```json
{
  "city": "Milan",
  "temperature": 18.5,
  "description": "Parzialmente nuvoloso"
}
```

### ❌ Caso errore
```json
{
  "error": true,
  "message": "Città non trovata"
}
```

---

## 🧠 Struttura del codice

### `getWeatherByCity(cityName)`
- Funzione principale
- Valida input
- Chiama le API
- Restituisce risultato JSON

### `getWeatherDescription(code)`
- Traduce codici meteo in testo leggibile

### `handleClick()`
- Gestisce l'interazione utente
- Aggiorna il contenuto della pagina

---

## ⚠️ Gestione degli errori

L'app gestisce:
- Input vuoto
- Città non trovata
- Errori di rete/API
- Dati mancanti nelle risposte API

Gli errori vengono restituiti in formato JSON.

---

## 📊 Miglioramenti futuri

- 🌬️ Aggiunta velocità del vento
- 🎨 Miglioramento interfaccia grafica
- ⚡ Caching delle richieste API
- 🌐 Supporto multi-lingua
- 📱 Ottimizzazione mobile
- 🧪 Test automatici

---

## 📚 Tecnologie utilizzate

- JavaScript (ES6+)
- Fetch API
- Open-Meteo API

---

## 🧑‍💻 Note per sviluppatori

- Applicazione completamente frontend
- Non richiede backend
- Richiede connessione internet
- Ideale per apprendimento e pratica

---

## 📄 Licenza

Progetto a scopo educativo.
