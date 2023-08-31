function getCoordinates(cityName) {
  var apiKey = "d3eb013621b045498080b3dca1ba23a8";
  var geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  return fetch(geocodingUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      var coordiantes = {
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
      return coordiantes;
    })
    .catch((error) => {
      console.error("Error fetching coordinates", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("city-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted");

    var cityInput = document.getElementById("city-input");
    var cityName = cityInput.value.trim();

    if (cityName !== "") {
      getCoordinates(cityName).then((coordinates) => {
        var apiKey = "d3eb013621b045498080b3dca1ba23a8";
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;

        fetch(forecastUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error fetching forecast data");
            }
            return response.json();
          })
          .then((forecastData) => {
            var forecastContainer =
              document.getElementById("forecast-container");
            forecastContainer.innerHTML = "";

            function getWeatherIconClass(description) {
              var iconMapping = {
                "clear sky": "fa-sun",
                "few clouds": "fa-cloud-sun",
                "broken clouds": "fa-cloud-sun",
                "scattered clouds": "fa-cloud",
                snow: "fa-snowflake",
                "scattered rains": "fa-cloud-showers-water",
                rain: "fa-cloud-rain",
                "light rain": "fa-cloud-sun-rain",
              };
              return iconMapping[description.toLowerCase()] || "fa-question";
            }

            forecastData.list.forEach((item) => {
              var dateTime = item.dt_txt;
              var dateObj = new Date(dateTime);
              var dayOfWeek = dateObj.getDay();

              var daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              var formattedDate = `${daysOfWeek[dayOfWeek]}, ${
                dateObj.getMonth() + 1
              }/${dateObj.getFullYear()}`;
              var formattedTime = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              var temperature = item.main.temp;
              var humidity = item.main.humidity;
              var windSpeed = item.wind.speed;
              var weatherDescription = item.weather[0].description;

              var temperatureFahrenheit = ((temperature - 273.15) * 9) / 5 + 32;

              var forecastCard = document.createElement("div");
              forecastCard.classList.add("forecast-card");

              var dateElement = document.createElement("p");
              dateElement.textContent = `Date: ${formattedDate} ${formattedTime}`;

              var temperatureElement = document.createElement("p");
              temperatureElement.innerHTML = `<i class="fas fa-thermometer-half"></i> Temperature: ${temperatureFahrenheit.toFixed(
                2
              )} °F`;

              var humidityElement = document.createElement("p");
              humidityElement.innerHTML = `<i class="fas fa-tint"></i> Humidity: ${humidity}%`;

              var windElement = document.createElement("p");
              windElement.innerHTML = `<i class="fas fa-wind"></i> Wind Speed: ${windSpeed} m/s`;

              var descriptionElement = document.createElement("p");
              var weatherIconClass = getWeatherIconClass(weatherDescription);
              descriptionElement.innerHTML = `<i class="fas ${weatherIconClass}"></i> Description: ${weatherDescription}`;

              forecastCard.appendChild(dateElement);
              forecastCard.appendChild(temperatureElement);
              forecastCard.appendChild(humidityElement);
              forecastCard.appendChild(windElement);
              forecastCard.appendChild(descriptionElement);

              forecastContainer.appendChild(forecastCard);
            });
          })
          .catch((error) => {
            console.error("Error fetching forecast data:", error);
          });
      });
    } else {
    }
  });
});
