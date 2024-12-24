// creating  and defining variables

const search = document.querySelector("#search");
const searchField = document.querySelector("#city");
const searchbtn = document.querySelector("#searchbtn");
const searchbar = document.querySelector("#form");
const content = document.querySelector("#content");
const temp = document.querySelector("#temp");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind");
const location1 = document.querySelector("#location");
const day1 = document.querySelector("#d1");
const day2 = document.querySelector("#d2");
const day3 = document.querySelector("#d3");
const day4 = document.querySelector("#d4");
const day5 = document.querySelector("#d5");
const day6 = document.querySelector("#d6");
const day7 = document.querySelector("#d7");
const body = document.querySelector("#mainCard");
const condition = document.querySelector("#condition");
const recentCitiesDropdown = document.querySelector("#suggestionsContainer");
const showForecast = document.querySelector("#forecast");
const showForecastbtn = document.querySelector("#forecastbtn");
const hideForecastbtn = document.querySelector("#hideforecastbtn");
const mbody = document.querySelector("#body");
const currentLocation = document.querySelector("#btnLocation");
let day;

const APIkey = "ac11dfcacc35454b9b431512242412";
const URL = "https://api.weatherapi.com/v1/forecast.json?";


showForecastbtn.addEventListener("click", () => {
    showForecast.classList.remove("hidden");
    hideForecastbtn.classList.remove("hidden");
    showForecastbtn.classList.add("hidden");
})

hideForecastbtn.addEventListener("click", () => {
    showForecast.classList.add("hidden");
    hideForecastbtn.classList.add("hidden");
    showForecastbtn.classList.remove("hidden");
})

searchbtn.addEventListener("click", () => {
    searchbar.classList.remove("hidden");
})


content.innerHTML = `<div class="loader">Loading...</div>`;

// Geolocation-based weather on initial load

function liveLocation() {
    fetch("https://extreme-ip-lookup.com/json/?key=NsqPBZ1VB5InSuBUdUO8")
    .then(res => res.json())
    .then(data => {
        fetch(`${URL}key=${APIkey}&q=${data.lat},${data.lon}&days=8`)
        .then(res => res.json())
        .then(position => {
            sessionStorage.setItem(data.city, JSON.stringify(position));
            displayWeather(position);
        })
        .catch(error => console.error('Error fetching weather:', error));
    })
    .catch(error => {
        console.error('Error fetching geolocation:', error);
        content.innerHTML = "Unable to get your location.";
    });
}

liveLocation();
currentLocation.addEventListener('click',() => {
    content.innerHTML = `<div class="loader">Loading...</div>`;
    liveLocation();
})


// Display weather data
function displayWeather(data) {
    if (!data || !data.forecast || !data.forecast.forecastday || !data.forecast.forecastday[0]) {
        content.innerHTML = "Error fetching weather data. Please try again.";
        return; // Exit the function if required properties are missing
    }

    

    const currentDay = data.forecast.forecastday[0];

    

    // Displaying values on the webpage
    content.innerHTML = `<img src="https:${currentDay.day.condition.icon}"> City: ${data.location.name}`;
    temp.innerHTML = `<i class="wi wi-thermometer text-3xl"></i>${Math.round(data.current.temp_c)}°C`;
    humidity.innerHTML = `Humidity: ${data.current.humidity} %`;
    windSpeed.innerHTML = `Wind Speed: ${data.current.wind_kph} Kph`;
    location1.innerHTML = `Latitude: ${data.location.lat} <br> Longitude: ${data.location.lon}`;
    condition.innerHTML = `${currentDay.day.condition.text}`;

    // Updating forecast days
    const days = [day1, day2, day3, day4, day5, day6, day7];
    days.forEach((day, index) => {
        const forecastingOf = data.forecast.forecastday[index + 1];
        if (!forecastingOf) return; // Check if the forecast day exists
        day.innerHTML = `<img src="https:${forecastingOf.day.condition.icon}">
        <br> Forecast Date: <strong>${forecastingOf.date}</strong>
        <br> Avg Temp: <strong>${Math.round(forecastingOf.day.avgtemp_c)} °C </strong>
        <br> Max Wind: <strong>${forecastingOf.day.maxwind_kph} Kph </strong>
        <br> Avg Humidity: <strong>${forecastingOf.day.avghumidity} % </strong>
        <br> Condition: <strong>${forecastingOf.day.condition.text} </strong>`;
       
    });


}


// Add a city to sessionStorage for recent searches
function addCityToStorage(cityName) {
    let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];

    if (!cities.includes(cityName)) {
        cities.push(cityName);
        sessionStorage.setItem('recentCities', JSON.stringify(cities));
        updateDropdown(); // Update the suggestions dropdown
    }
}

// Show the dropdown when the search bar is focused and recent cities are available
searchField.addEventListener('focus', () => {
    let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        recentCitiesDropdown.classList.remove('hidden'); // Show the dropdown
        updateDropdown(); // Call the function to update the dropdown content
    }
});

// Hide the dropdown when the search bar loses focus (after a small delay to allow for selection)
searchField.addEventListener('blur', () => {
    setTimeout(() => {
        recentCitiesDropdown.classList.add('hidden'); // Hide the dropdown
    }, 200); // Small delay to allow clicking on a suggestion
});

// Function to update the dropdown with recent cities
function updateDropdown() {
    let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];
    recentCitiesDropdown.innerHTML = ''; // Clear the existing list

    if (cities.length > 0) {
        cities.forEach(city => {
            let li = document.createElement('li');
            li.textContent = city;
            li.classList.add('cursor-pointer', 'p-2', 'hover:bg-gray-200');
            li.addEventListener('click', () => {
                searchField.value = city; // Set the input to the clicked city
                search.click(); // Trigger the search button
                searchField.value = ""; // Clear the search field after selection
                recentCitiesDropdown.classList.add('hidden'); // Hide dropdown after selecting
            });
            recentCitiesDropdown.appendChild(li);
        });
    }
}


// Trigger recent search suggestions as the user enters data
searchField.addEventListener('input', () => {
    const query = searchField.value.toLowerCase();
    let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];

    if (query.length > 0) {
        const filteredCities = cities.filter(city => city.toLowerCase().includes(query));
        displayFilteredSuggestions(filteredCities);
    } else {
        updateDropdown();
    }
});

// Display filtered city suggestions
function displayFilteredSuggestions(cities) {
    recentCitiesDropdown.innerHTML = ''; 

    if (cities.length > 0) {
        recentCitiesDropdown.classList.remove('hidden');
        cities.forEach(city => {
            let li = document.createElement('li');
            li.textContent = city;
            li.classList.add('cursor-pointer', 'p-2', 'hover:bg-gray-200');
            li.addEventListener('click', () => {
                searchField.value = city;
                search.click();
                recentCitiesDropdown.classList.remove('hidden');
                searchField.value = '';
            });
            recentCitiesDropdown.appendChild(li);
        });
    } else {
        recentCitiesDropdown.classList.add('hidden');
    }
}

// code for the functionality 
search.addEventListener('click', (event) => {
    event.preventDefault();
    content.innerHTML = `<div class="loader">Loading...</div>`;
    const city = searchField.value;
    const storedData = sessionStorage.getItem(city);
    searchField.value = '';

    if (city === '') {
        alert("Please enter a city name");
    } 
    else if (!/^[a-zA-Z\s]+$/.test(city)) {
        alert("City name shouldn't contain any special characters");
    } 
    else if (storedData) {
        const data = JSON.parse(storedData);
        displayWeather(data);
    } 
    else {
        const apiUrl = `${URL}key=${APIkey}&q=${city}&days=8&aqi=no&alerts=no`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem(city, JSON.stringify(data));
                addCityToStorage(city); // Add city to recent searches
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error:', error);
                content.innerHTML = `Unable to find weather for "${searchField.value}"`;
                temp.innerHTML = `Not available !!!`;
                humidity.innerHTML = `Not available !!!`;
                windSpeed.innerHTML = `Not available !!!`;
                location1.innerHTML = `Not available !!!`;
                condition.innerHTML = `Not available !!!`;
                const days = [day1, day2, day3, day4, day5, day6, day7];
                days.forEach((day) => {
                    day.innerHTML = `Not available !!!`;
                    day.style.background = "linear-gradient(to top, blue, white)";
                    body.style.background = "linear-gradient(to top, white, blue)";
                });
            });
    }
});

// Update suggestions on page load
window.onload = updateDropdown;