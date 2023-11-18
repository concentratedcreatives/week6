// Constants
const searchHistoryElement = document.getElementById("recently-viewed");
const searchFormElement = document.getElementById("search-form");
const cityInputElement = document.getElementById("city");

// Event Listeners
searchFormElement.addEventListener("submit", handleSearchFormSubmit);

// Functions
function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchCityName = cityInputElement.value.trim();
  executeSearch(searchCityName);
  addRecentSearchButton(searchCityName);
}

function executeSearch(searchCityName) {
  const recentSearchesList = JSON.parse(localStorage.getItem("searches")) || [];
  recentSearchesList.push(searchCityName);
  localStorage.setItem("searches", JSON.stringify(recentSearchesList));
  getWeatherData(searchCityName);
}

function getWeatherData(cityName) {
  const weatherApiKey = "4ae2038586bb2f2bef6082ebb4dfdfe2";
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}&units=imperial`;

  fetch(weatherApiUrl)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("city", JSON.stringify(data));
      updateCurrentCity(data, cityName);
      setCurrentWeather(data.list[0]);
      setFiveDayForecast(data.list);
    });
}

function updateCurrentCity(data, cityName) {
  const currentCityElement = document.getElementById("current-city");
  currentCityElement.textContent = cityName;
}

function setCurrentWeather(weatherInfo) {
  const forecastDate = new Date(weatherInfo.dt * 1000).toLocaleDateString("en-US", {
    dateStyle: "short",
  });

  updateCurrentDate(forecastDate);
  updateCurrentIcon(weatherInfo.weather[0].icon);
  updateCurrentTemperature(weatherInfo.main.temp);
  updateCurrentWind(weatherInfo.wind.speed);
  updateCurrentHumidity(weatherInfo.main.humidity);
}

function updateCurrentDate(forecastDate) {
  const currentDateElement = document.getElementById("current-date");
  currentDateElement.textContent = forecastDate;
}

function updateCurrentIcon(iconId) {
  const weatherIconLink = `https://openweathermap.org/img/wn/${iconId}.png`;
  const currentIconElement = document.getElementById("current-icon");
  currentIconElement.innerHTML = `<img src="${weatherIconLink}">`;
}

function updateCurrentTemperature(temperature) {
  const currentTemperatureElement = document.getElementById("current-temperature");
  currentTemperatureElement.textContent = `Temperature: ${temperature}`;
}

function updateCurrentWind(windSpeed) {
  const currentWindElement = document.getElementById("current-wind");
  currentWindElement.textContent = `Wind: ${windSpeed} MPH`;
}

function updateCurrentHumidity(humidity) {
  const currentHumidityElement = document.getElementById("current-humidity");
  currentHumidityElement.textContent = `Humidity: ${humidity} %`;
}

function setFiveDayForecast(weatherForecast) {
  for (let i = 0; i < weatherForecast.length; i += 8) {
    setForecastDay(weatherForecast[i], i / 8 + 1);
  }
}

function setForecastDay(dayWeather, dayNumber) {
  const dayElement = document.getElementById(`day-${dayNumber}`);
  const dayInfoList = [];
  const forecastDate = new Date(dayWeather.dt * 1000).toLocaleDateString("en-US", {
    dateStyle: "short",
  });

  const titleParagraph = document.createElement("p");
  titleParagraph.innerHTML = `${forecastDate}<img src="https://openweathermap.org/img/wn/${dayWeather.weather[0].icon}.png">`;
  dayInfoList.push(titleParagraph);

  const tempParagraph = document.createElement("p");
  tempParagraph.textContent = `Temp: ${dayWeather.main.temp}`;
  dayInfoList.push(tempParagraph);

  const windParagraph = document.createElement("p");
  windParagraph.textContent = `Wind: ${dayWeather.wind.speed} MPH`;
  dayInfoList.push(windParagraph);

  const humidityParagraph = document.createElement("p");
  humidityParagraph.textContent = `Humidity: ${dayWeather.main.humidity} %`;
  dayInfoList.push(humidityParagraph);

  dayElement.replaceChildren(...dayInfoList);
}

function addRecentSearchButton(cityName) {
  const recentSearchButton = document.createElement("button");
  recentSearchButton.textContent = cityName;
  recentSearchButton.addEventListener("click", function () {
    executeSearch(cityName);
  });
  searchHistoryElement.appendChild(recentSearchButton);
}

// On page load, set the default city (Santa Fe) for immediate data display
getWeatherData("Santa Fe");
