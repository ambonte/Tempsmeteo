// API Keys
const WEATHER_API_KEY = "0dc234f8cac8d80d035d535ce9b251f2"; //  OpenWeatherMap API Key


// Select Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const localTime = document.getElementById("local-time");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");

// Fetch Weather Data
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        if (response.status !== 200) {
            alert("City not found! Try again.");
            return;
        }

        cityName.textContent = data.name;
        temperature.textContent = ` ${Math.round(data.main.temp)}°C`;
        weatherCondition.textContent = `Condition: ${data.weather[0].description}`;

        // Update Weather Icon
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.src = iconUrl;
        weatherIcon.style.display = "block";

        // Fetch Local Time
        fetchTime(data.coord.lat, data.coord.lon);

        // Fetch 7-Day Forecast
        fetchForecast(data.coord.lat, data.coord.lon);

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

// Fetch Local Time
async function fetchTime(lat, lon) {
    try {
        const response = await fetch(
            `https://www.timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`
        );
        const data = await response.json();

        let timeString = `${data.hour}:${data.minute < 10 ? "0" : ""}${data.minute}`;
        localTime.textContent = `Heure locale: ${timeString}`;
    } catch (error) {
        console.error("Error fetching time:", error);
        localTime.textContent = "Heure locale: --:--";
    }
}

// Fetch 7-Day Forecast
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        const dailyForecasts = {};
        data.list.forEach(entry => {
            const date = new Date(entry.dt * 1000).toLocaleDateString("en-US", { weekday: 'short' });
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = entry;
            }
        });

        displayForecast(Object.values(dailyForecasts).slice(0, 7));

    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// Display Forecast
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    forecastData.forEach(day => {
        const temp = Math.round(day.main.temp);
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <p><strong>${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'short' })}</strong></p>
                <img src="${icon}" class="forecast-icon">
                <p>${temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
}

// Event Listeners
searchBtn.addEventListener("click", () => fetchWeather(cityInput.value.trim()));
fetchWeather("Paris"); // Load default city
