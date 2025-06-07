
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const cityText = document.querySelector(".city-text");
const currentDateText = document.querySelector(".current-date-time");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const tempText = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-text");
const windValueTxt = document.querySelector(".wind-speed-value");

const forecastItemContainer = document.querySelector(".forecast-item-container");

const apiKey = "9ee019e177ccd9c0a9d83fd6d4a716ae";

searchBtn.addEventListener("click", () => {
    if (cityInput.ariaValueMax.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = (await fetch(apiUrl)).json();
    return response;
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options);
}

function getWeatherIcon(icon) {
    // https://openweathermap.org/img/wn/10d@2x.png
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    return iconUrl;
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);

    if (weatherData.cod != 200) {
        alert("Data not found");
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ icon, main }],
        wind: { speed }
    } = weatherData;

    cityText.textContent = country;
    currentDateText.textContent = getCurrentDate();
    weatherSummaryImg.src = getWeatherIcon(icon);
    tempText.textContent = Math.round(temp) + " °C";
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + " %";
    windValueTxt.textContent = Math.round(speed * 18 / 5) + " Km/Hr";

    await updateForecastInfo(city);
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData("forecast", city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate))
            updateForecastItems(forecastWeather);
    });
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ icon }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOption);

    const forecastItem = `
        <div class="forecast-item">
        <h5 class="forecast-item-date lato-regular">${dateResult}</h5>
        <img src="${getWeatherIcon(icon)}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
        `;

    forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
}


function getWeather() {
    updateWeatherInfo("ranchi");
    updateForecastInfo("ranchi");
}

getWeather();