function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// CURRENT DATE AND TIME
function getCurrentDateTime() {
  const date = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedDate = dateFormatter.format(date);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const formattedTime = timeFormatter.format(date);

  return `${formattedDate}. ${formattedTime}`;
}

function updateCurrentDate() {
  let todayDate = $(".today-date");
  todayDate.text(getCurrentDateTime());
}
updateCurrentDate();
setInterval(updateCurrentDate, 1000);

// WEEKLY CARDS
function getNextSevenDays() {
  const dates = [];
  const currentDate = new Date();

  // Iterate over the next 7 days
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);

    const nextDatesFormatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      // weekday: 'short'
    });

    const nextDayFormater = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    });

    const formattedNextDates = nextDatesFormatter.format(nextDate);
    const formattedNextDay = nextDayFormater.format(nextDate);

    // Extract the year, month, and day components
    // const year = nextDate.setDate();
    // const month = nextDate.getMonth() + 1; // Month is zero-based, so we add 1
    // const day = nextDate.getDate();

    // Format the date as yyyy-mm-dd
    // const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    // Push the formatted date into the dates array
    dates.push([formattedNextDates, formattedNextDay]);
  }

  return dates;
}
const nextSevenDays = getNextSevenDays();

const cardMonth = $(".weekly-weather-card-date").children(":first-child");
cardMonth.each(function (index) {
  const firstChild = $(this);

  // Change the text content based on the index or any other condition
  if (index === 0) {
    firstChild.text(nextSevenDays[0][0]);
  } else if (index === 1) {
    firstChild.text(nextSevenDays[1][0]);
  } else if (index === 2) {
    firstChild.text(nextSevenDays[2][0]);
  } else if (index === 3) {
    firstChild.text(nextSevenDays[3][0]);
  } else if (index === 4) {
    firstChild.text(nextSevenDays[4][0]);
  } else if (index === 5) {
    firstChild.text(nextSevenDays[5][0]);
  } else if (index === 6) {
    firstChild.text(nextSevenDays[6][0]);
  }
});

const cardDay = $(".weekly-weather-card-date").children(":last-child");
cardDay.each(function (index) {
  const firstChild = $(this);

  // Change the text content based on the index or any other condition
  if (index === 0) {
    firstChild.text(nextSevenDays[0][1]);
  } else if (index === 1) {
    firstChild.text(nextSevenDays[1][1]);
  } else if (index === 2) {
    firstChild.text(nextSevenDays[2][1]);
  } else if (index === 3) {
    firstChild.text(nextSevenDays[3][1]);
  } else if (index === 4) {
    firstChild.text(nextSevenDays[4][1]);
  } else if (index === 5) {
    firstChild.text(nextSevenDays[5][1]);
  } else if (index === 6) {
    firstChild.text(nextSevenDays[6][1]);
  }
});

// CURRENT LOCATION AND WEATHER STATS
// Step 1: Get user coordinates
function getCoordintes() {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    let crd = pos.coords;
    let lat = crd.latitude.toString();
    let lng = crd.longitude.toString();
    let coordinates = [lat, lng];
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);

    const apiKey = "f2de816e338f0089fd3a344183af0a5b";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        weatherIcon = data.weather[0].icon;
        imageUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

        todayTemp = $("#todayTemp");
        feels = $("#feels");
        weatherStatusToday = $(".today-weather-status h2");
        todayWeatherIcon = $(".today-weather-icon img");
        todayWindChance = $("#todayWindChance");

        todayTemp.text(data.main.temp + " °C");
        feels.text(data.main.feels_like + " °C");
        weatherStatusToday.text(
          capitalizeFirstLetter(data.weather[0].description)
        );
        todayWeatherIcon.attr("src", imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching weather", error);
      });

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        todayHumidityChance = $("#todayHumidityChance");
        todayHumidityChance.text(data.current.relative_humidity_2m);

        todayWindChance = $("#todayWindChance");
        todayWindChance.text(data.current.wind_speed_10m);

        todayPrecChance = $("#todayPrecipitationChance");
        todayPrecChance.text(data.current.precipitation);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m&timezone=auto&forecast_days=1`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        tempArray = [];
        humidityArray = [];
        windSpeedArray = [];
        precipitationArray = [];
        for (let index = 1; index < 24; index += 2) {
          tempArray.push(data.hourly.temperature_2m[index]);
          humidityArray.push(data.hourly.relative_humidity_2m[index]);
          windSpeedArray.push(data.hourly.wind_speed_10m[index]);
          precipitationArray.push(data.hourly.precipitation_probability[index]);
        }
        for (let index = 0; index < 12; index++) {
          let weatherStatistics = $(".date-weather-status-details").eq(index);
          weatherStatistics.text(`${tempArray[index]}°`);

          let state = 0;

          let tempHeader = $(".third-container-item h3:nth-child(1)");
          let windHeader = $(".third-container-item h3:nth-child(2)");
          let preciHeader = $(".third-container-item h3:nth-child(3)");
          let humidityHeader = $(".third-container-item h3:nth-child(4)");

          tempHeader.click(() => {
            state = 0;
            updateText();
          });
          windHeader.click(() => {
            state = 1;
            updateText();
          });
          preciHeader.click(() => {
            state = 2;
            updateText();
          });
          humidityHeader.click(() => {
            state = 3;
            updateText();
          });

          // Function to update text based on the current state
          function updateText() {
            if (state == 0) {
              weatherStatistics.text(`${tempArray[index]}°`);
            } else if (state == 1) {
              weatherStatistics.text(`${windSpeedArray[index]} km/h`); // Example text change
            } else if (state == 2) {
              weatherStatistics.text(`${precipitationArray[index]}%`); // Example text change
            } else {
              weatherStatistics.text(`${humidityArray[index]}%`); // Example text change
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,apparent_temperature_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const weatherDescriptions = {
          0: "Clear sky",
          1: "Mainly clear",
          2: "Partly cloudy",
          3: "Overcast",
          45: "Fog",
          48: "Depositing rime fog",
          51: "Drizzle: Light intensity",
          53: "Drizzle: Moderate intensity",
          55: "Drizzle: Dense intensity",
          56: "Freezing Drizzle: Light intensity",
          57: "Freezing Drizzle: Dense intensity",
          61: "Rain: Slight intensity",
          63: "Rain: Moderate intensity",
          65: "Rain: Heavy intensity",
          66: "Freezing Rain: Light intensity",
          67: "Freezing Rain: Heavy intensity",
          71: "Snow fall: Slight intensity",
          73: "Snow fall: Moderate intensity",
          75: "Snow fall: Heavy intensity",
          77: "Snow grains",
          80: "Rain showers: Slight intensity",
          81: "Rain showers: Moderate intensity",
          82: "Rain showers: Violent",
          85: "Snow showers: Slight",
          86: "Snow showers: Heavy",
          95: "Thunderstorm: Slight or moderate",
          96: "Thunderstorm with slight hail",
          99: "Thunderstorm with heavy hail",
        };

        const weeklyWeatherStatsHumidity = $(
          ".weekly-weather-card-stats p:nth-child(3)"
        );

        for (let index = 0; index < 7; index++) {
          const weeklyWeatherDesc = $(
            ".weekly-weather-card-details > p:nth-child(2)"
          ).eq(index);
          const weeklyWeatherTemp = $(
            ".weekly-weather-card-temp span:nth-child(1)"
          ).eq(index);
          const weeklyWeatherApparentTemp = $(
            ".weekly-weather-card-temp span:nth-child(2)"
          ).eq(index);
          const weeklyWeatherStatsWind = $(
            ".weekly-weather-card-stats p:nth-child(1) span"
          ).eq(index);
          const weeklyWeatherStatsPrec = $(
            ".weekly-weather-card-stats p:nth-child(2) span"
          ).eq(index);

          weeklyWeatherDesc.text(
            data.daily.weather_code.map((code) => weatherDescriptions[code])[
              index
            ]
          );
          weeklyWeatherTemp.text(
            Math.round(data.daily.temperature_2m_max[index]) + "°"
          );
          weeklyWeatherApparentTemp.text(
            Math.round(data.daily.apparent_temperature_max[index]) + "°"
          );
          weeklyWeatherStatsWind.text(
            data.daily.wind_speed_10m_max[index] + " km/h"
          );
          weeklyWeatherStatsPrec.text(
            data.daily.precipitation_probability_max[index] + "%"
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=relative_humidity_2m&timezone=auto`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let averageHumidityArray = [];
        for (let index = 0; index < 168; index += 24) {
          let newArray = data.hourly.relative_humidity_2m.slice(
            index,
            24 + index
          );
          const sum = newArray.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );
          let averageHumidity = Math.floor(sum / newArray.length);
          averageHumidityArray.push(averageHumidity);
        }

        for (let index = 0; index < 7; index++) {
          const weeklyWeatherStatsHumidity = $(
            ".weekly-weather-card-stats p:nth-child(3) span"
          ).eq(index);
          weeklyWeatherStatsHumidity.text(averageHumidityArray[index] + "%");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getCity(coordinates);
    return;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// // Step 2: Get city name
function getCity(coordinates) {
  let xhr = new XMLHttpRequest();
  let lat = coordinates[0];
  let lng = coordinates[1];

  // Paste your LocationIQ token below.
  xhr.open(
    "GET",
    `https://us1.locationiq.com/v1/reverse?key=pk.0f126d71f4406bb967167c3110d2ce35&lat=${lat}&lon=${lng}&format=json`,
    true
  );
  xhr.send();
  xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      let city = response.address.state.split(" ")[0];
      let country = response.address.country;
      let town = response.address.town;
      let locationInfo = $(".search-current-location");
      locationInfo.text(`${town || city}, ${country}`);
      return;
    }
  }
}
getCoordintes();

// FORM LOCATION AND WEATHER STATS

const formButton = $("button");
const inputField = $("input");
const suggBox = $(".autocom-box");
let lastFiveHidden = true;
let selectedLocation = ""; // Variable to store the selected location
let selectedLatitude = ""; // Variable to store the latitude of the selected location
let selectedLongitude = ""; // Variable to store the longitude of the selected location

function searchLocation(userInput) {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${userInput}&count=10&language=en&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      const suggestions = data.results.map(
        (result) => `${result.name}, ${result.country || ""}`
      );
      showSuggestions(suggestions.slice(0, 5)); // Only pass the first 5 suggestions
      // Store the latitude and longitude of the final location
      selectedLatitude = data.results[0].latitude;
      selectedLongitude = data.results[0].longitude;
    })
    .catch((err) => {
      console.error("Error fetching API", err);
    });
}

function showSuggestions(suggestions) {
  const suggestionList = suggestions
    .map((suggestion, index) => `<li data-index="${index}">${suggestion}</li>`)
    .join("");
  suggBox.html(suggestionList);
  lastFiveHidden = true; // Reset the flag when new suggestions are shown
}

inputField.keyup(function (e) {
  let userData = e.target.value.trim();
  if (userData) {
    searchLocation(userData);
  } else {
    suggBox.empty();
  }
});

// Clear suggestions when input field is focused
inputField.focus(function () {
  suggBox.empty();
});

// Handle click on suggested city
suggBox.on("click", "li", function () {
  selectedLocation = $(this).text();
  inputField.val(selectedLocation);
  suggBox.empty();
});

formButton.click(function (e) {
  console.log("Selected latitude:", selectedLatitude);
  console.log("Selected longitude:", selectedLongitude);
  getCoordinates(selectedLatitude, selectedLongitude);
  e.preventDefault();
  if (lastFiveHidden) {
    // Show the last 5 hidden cities
    suggBox.find("li:nth-last-child(-n+5)").show();
    lastFiveHidden = false;
  } else {
    // Hide the last 5 cities
    suggBox.find("li:nth-last-child(-n+5)").hide();
    lastFiveHidden = true;
  }
});

function getCoordinates(lat, lng) {
  const spanElement = $(".dynamic-location span:nth-child(2)");
  // Remove the existing span element
  spanElement.remove();

  // Select the existing h1 element
  const h2Element = $(".dynamic-location h2");

  // Create a new span element
  const newSpanElement = $("<span></span>").text(`(${inputField.val()})`); // Add content to the span if needed

  // Insert the new span element after the h1 element
  h2Element.after(newSpanElement);

  const apiKey = "f2de816e338f0089fd3a344183af0a5b";
  // Fetch current weather data
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Manipulate DOM with current weather data
      const weatherIcon = data.weather[0].icon;
      const imageUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      $("#todayTemp").text(data.main.temp + " °C");
      $("#feels").text(data.main.feels_like + " °C");
      $(".today-weather-status h2").text(
        capitalizeFirstLetter(data.weather[0].description)
      );
      $(".today-weather-icon img").attr("src", imageUrl);
    })
    .catch((error) => {
      console.error("Error fetching current weather", error);
    });

  // Fetch current forecast data
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`
  )
    .then((response) => response.json())
    .then((data) => {
      // Manipulate DOM with current forecast data
      $("#todayHumidityChance").text(data.current.relative_humidity_2m);
      $("#todayWindChance").text(data.current.wind_speed_10m);
      $("#todayPrecipitationChance").text(data.current.precipitation);
    })
    .catch((error) => {
      console.error("Error fetching current forecast", error);
    });

  // Fetch hourly forecast data
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m&timezone=auto&forecast_days=1`
  )
    .then((response) => response.json())
    .then((data) => {
      // Manipulate DOM with hourly forecast data
      const tempArray = [];
      const humidityArray = [];
      const windSpeedArray = [];
      const precipitationArray = [];
      for (let index = 1; index < 24; index += 2) {
        tempArray.push(data.hourly.temperature_2m[index]);
        humidityArray.push(data.hourly.relative_humidity_2m[index]);
        windSpeedArray.push(data.hourly.wind_speed_10m[index]);
        precipitationArray.push(data.hourly.precipitation_probability[index]);
      }
      // Update DOM elements with forecast data
      for (let index = 0; index < 12; index++) {
        const weatherStatistics = $(".date-weather-status-details").eq(index);
        weatherStatistics.text(`${tempArray[index]}°`);
        // ...
      }
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast", error);
    });

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,apparent_temperature_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light intensity",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light intensity",
        67: "Freezing Rain: Heavy intensity",
        71: "Snow fall: Slight intensity",
        73: "Snow fall: Moderate intensity",
        75: "Snow fall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight intensity",
        81: "Rain showers: Moderate intensity",
        82: "Rain showers: Violent",
        85: "Snow showers: Slight",
        86: "Snow showers: Heavy",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      const weeklyWeatherStatsHumidity = $(
        ".weekly-weather-card-stats p:nth-child(3)"
      );

      for (let index = 0; index < 7; index++) {
        const weeklyWeatherDesc = $(
          ".weekly-weather-card-details > p:nth-child(2)"
        ).eq(index);
        const weeklyWeatherTemp = $(
          ".weekly-weather-card-temp span:nth-child(1)"
        ).eq(index);
        const weeklyWeatherApparentTemp = $(
          ".weekly-weather-card-temp span:nth-child(2)"
        ).eq(index);
        const weeklyWeatherStatsWind = $(
          ".weekly-weather-card-stats p:nth-child(1) span"
        ).eq(index);
        const weeklyWeatherStatsPrec = $(
          ".weekly-weather-card-stats p:nth-child(2) span"
        ).eq(index);

        weeklyWeatherDesc.text(
          data.daily.weather_code.map((code) => weatherDescriptions[code])[
            index
          ]
        );
        weeklyWeatherTemp.text(
          Math.round(data.daily.temperature_2m_max[index]) + "°"
        );
        weeklyWeatherApparentTemp.text(
          Math.round(data.daily.apparent_temperature_max[index]) + "°"
        );
        weeklyWeatherStatsWind.text(
          data.daily.wind_speed_10m_max[index] + " km/h"
        );
        weeklyWeatherStatsPrec.text(
          data.daily.precipitation_probability_max[index] + "%"
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=relative_humidity_2m&timezone=auto`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let averageHumidityArray = [];
      for (let index = 0; index < 168; index += 24) {
        let newArray = data.hourly.relative_humidity_2m.slice(
          index,
          24 + index
        );
        const sum = newArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        let averageHumidity = Math.floor(sum / newArray.length);
        averageHumidityArray.push(averageHumidity);
      }

      for (let index = 0; index < 7; index++) {
        const weeklyWeatherStatsHumidity = $(
          ".weekly-weather-card-stats p:nth-child(3) span"
        ).eq(index);
        weeklyWeatherStatsHumidity.text(averageHumidityArray[index] + "%");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
