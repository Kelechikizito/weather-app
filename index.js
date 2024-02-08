function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// CURRENT DATE AND TIME
function getCurrentDateTime() {
    const date = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    const formattedDate = dateFormatter.format(date);
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const formattedTime = timeFormatter.format(date);
    
    return `${formattedDate}. ${formattedTime}`;
}

function updateCurrentDate() {
    let todayDate = $('.today-date');
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

        const nextDatesFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            // weekday: 'short'
        });

        const nextDayFormater = new Intl.DateTimeFormat('en-US', {weekday: 'short'});

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

const cardMonth = $('.weekly-weather-card-date').children(':first-child');
cardMonth.each(function(index) {
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

const cardDay = $('.weekly-weather-card-date').children(':last-child');
cardDay.each(function(index) {
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
		maximumAge: 0 
	}; 

	function success(pos) { 
		let crd = pos.coords; 
		let lat = crd.latitude.toString(); 
		let lng = crd.longitude.toString(); 
		let coordinates = [lat, lng]; 
		console.log(`Latitude: ${lat}, Longitude: ${lng}`); 

        const apiKey = 'f2de816e338f0089fd3a344183af0a5b';
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            weatherIcon = data.weather[0].icon;
            imageUrl =  `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`

            todayTemp = $('#todayTemp');
            feels = $('#feels');
            weatherStatusToday = $('.today-weather-status h2');
            todayWeatherIcon = $('.today-weather-icon img');
            todayWindChance = $('#todayWindChance');
            todayHumidityChance = $('#todayHumidityChance');


            todayTemp.text(data.main.temp + ' °C');
            feels.text(data.main.feels_like + ' °C');
            weatherStatusToday.text(capitalizeFirstLetter(data.weather[0].description));
            todayWeatherIcon.attr('src', imageUrl);
            todayWindChance.text(data.wind.speed);
            todayHumidityChance.text(data.main.humidity);

            // console.log(data);
        })
        .catch(error => {
            console.error('Error fetching weather', error);
        });



        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m&timezone=auto&forecast_days=1`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            tempArray = [];
            humidityArray = [];
            windSpeedArray = [];
            precipitationArray = [];
            for (let index = 1; index < 24; index+=2) {
               tempArray.push(data.hourly.temperature_2m[index]);
               humidityArray.push(data.hourly.relative_humidity_2m[index]);
               windSpeedArray.push(data.hourly.wind_speed_10m[index]);
               precipitationArray.push(data.hourly.precipitation_probability[index])
            }
            for (let index = 0; index < 12; index++) {
                let dd = $('.date-weather-status-details').eq(index);
                dd.text(`${tempArray[index]}°`);

                // let g = $('.third-container-item h3:nth-child(1)');
                // let h = $('.third-container-item h3:nth-child(2)');
                // let i = $('.third-container-item h3:nth-child(3)');
                // let j = $('.third-container-item h3:nth-child(4)');
                
                
                // function updateState(tabId) {
                //     dd.text(`${tabId[index]}°`);
                // }

                // g.click(updateState('tempArray'));
                // h.click(updateState('windSpeedArray'));
                // i.click(updateState('precipitationArray'));
                // j.click(updateState('humidityArray'));
                              
            }
            console.log(humidityArray)
            console.log(windSpeedArray)
            console.log(precipitationArray)
            
        })
        .catch(error => {
            console.error(error);
        })

        

		
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
    xhr.open('GET', `https://us1.locationiq.com/v1/reverse?key=pk.0f126d71f4406bb967167c3110d2ce35&lat=${lat}&lon=${lng}&format=json`, true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            let city = response.address.state.split(' ')[0];
            let country = response.address.country;
            let town = response.address.town;
            let locationInfo = $('.search-current-location');
            locationInfo.text(`${town || city}, ${country}`);
            return;
        }
    }
}
getCoordintes(); 




const state = {tab1:false, tab2:false, tab3:false, tab4:false};
