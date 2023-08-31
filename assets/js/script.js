// Function to fetch coordinates based on city name from OpenWeatherMap API
function getCoordinates(cityName) {
  // API key for OpenWeatherMap
  var apiKey = "d3eb013621b045498080b3dca1ba23a8";
  // Construct the URL for geocoding API request
  var geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // Fetch coordinates and handle response
  return fetch(geocodingUrl)
    .then((response) => {
      // If response is not successful, throw an error
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      // Extract and return latitude and longitude coordinates
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

// When the DOM is loaded, attach event listeners and perform actions
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  var form = document.getElementById("city-form");
  // Attach a submit event listener to the form
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Form submitted"); // Log that form was submitted

    // Get the input element for city name
    var cityInput = document.getElementById("city-input");
    var cityName = cityInput.value.trim(); // Trim whitespace

    // Check if a city name was provided
    if (cityName !== "") {
      // Fetch coordinates using the provided city name
      getCoordinates(cityName).then((coordinates) => {
        // API key for OpenWeatherMap
        var apiKey = "d3eb013621b045498080b3dca1ba23a8";
        // Construct the URL for forecast API request
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;

        // Fetch forecast data and handle response
        fetch(forecastUrl)
          .then((response) => {
            // If response is not successful, throw an error
            if (!response.ok) {
              throw new Error("Error fetching forecast data");
            }
            return response.json();
          })
          .then((forecastData) => {
            // Get the forecast container element
            var forecastContainer =
              document.getElementById("forecast-container");
            forecastContainer.innerHTML = "";

            // Function to map weather descriptions to Font Awesome icons
            function getWeatherIconClass(description) {
              // Map weather descriptions to corresponding icon classes
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
              // Return corresponding icon class or fallback icon
              return iconMapping[description.toLowerCase()] || "fa-question";
            }

            // Loop through forecast data items and create forecast cards
            forecastData.list.forEach((item) => {
              var dateTime = item.dt_txt;
              var dateObj = new Date(dateTime);
              var dayOfWeek = dateObj.getDay();

              // Array of day names
              var daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              // Format date and time
              var formattedDate = `${daysOfWeek[dayOfWeek]}, ${
                dateObj.getMonth() + 1
              }/${dateObj.getFullYear()}`;
              var formattedTime = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              // Extract temperature, humidity, wind speed, and weather description
              var temperature = item.main.temp;
              var humidity = item.main.humidity;
              var windSpeed = item.wind.speed;
              var weatherDescription = item.weather[0].description;

              // Convert temperature to Fahrenheit
              var temperatureFahrenheit = ((temperature - 273.15) * 9) / 5 + 32;

              // Create a forecast card element
              var forecastCard = document.createElement("div");
              forecastCard.classList.add("forecast-card");

              // Create and populate elements for forecast details
              // Populate the dateElement with the formatted date and time
              var dateElement = document.createElement("p");
              dateElement.textContent = `Date: ${formattedDate} ${formattedTime}`;

              // Create a paragraph element to display the temperature
              var temperatureElement = document.createElement("p");
              // Populate the temperatureElement with the temperature in Fahrenheit
              temperatureElement.innerHTML = `<i class="fas fa-thermometer-half"></i> Temperature: ${temperatureFahrenheit.toFixed(
                2
              )} °F`;

              // Create a paragraph element to display the humidity
              var humidityElement = document.createElement("p");
              // Populate the humidityElement with the humidity percentage
              humidityElement.innerHTML = `<i class="fas fa-tint"></i> Humidity: ${humidity}%`;

              // Create a paragraph element to display the wind speed
              var windElement = document.createElement("p");
              // Populate the windElement with the wind speed
              windElement.innerHTML = `<i class="fas fa-wind"></i> Wind Speed: ${windSpeed} m/s`;

              // Create a paragraph element to display the weather description
              var descriptionElement = document.createElement("p");
              // Get the corresponding weather icon class based on the weather description
              var weatherIconClass = getWeatherIconClass(weatherDescription);
              // Populate the descriptionElement with the weather description and icon
              descriptionElement.innerHTML = `<i class="fas ${weatherIconClass}"></i> Description: ${weatherDescription}`;

              // Append the created elements to the forecast card
              forecastCard.appendChild(dateElement);
              forecastCard.appendChild(temperatureElement);
              forecastCard.appendChild(humidityElement);
              forecastCard.appendChild(windElement);
              forecastCard.appendChild(descriptionElement);

              // Append the forecast card to the forecast container
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
