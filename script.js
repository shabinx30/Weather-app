let currentIndex = -1
async function fetchData() {
    try {

        const name = document.getElementById('cityInput').value.trim()
        if (name == '') {
            return null
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=2e3485daa0504cb75b5b050b4ed98533`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status ${response.status}`);
        }

        const result = await response.json()


        //animation things 

        document.getElementById('noWeather').style.display = 'none'
        document.getElementById('weatherDis').style.animation = 'errorS .75s ease'
        document.getElementById('weatherDis').style.display = 'flex'
        document.getElementById('detailsDis').style.animation = 'errorS .75s ease'
        document.getElementById('detailsDis').style.display = 'flex'
        // document.getElementById('main').style.animation = 'expand .75s ease'

        console.log(result);
        document.getElementById('temp').textContent = Math.round(result.main.temp - 273) + '°C'
        document.getElementById('city').textContent = result.name
        document.getElementById('humidity').textContent = (result.main.humidity + '%')
        document.getElementById('wind').textContent = (result.wind.speed + ' km/h')

        document.getElementById('weather_image').src = `assets/${result.weather[0].main}.png`
    } catch (error) {
        console.error(error.message);
    }
}

async function getCitySuggestions() {
    currentIndex = -1
    const query = document.getElementById("cityInput").value;
    const apiKey = '2e3485daa0504cb75b5b050b4ed98533';

    if (query.length < 2) {
        document.getElementById("suggestionsList").innerHTML = ''; // Clear suggestions for short inputs
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
        const data = await response.json();

        displaySuggestions(data);
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
    }
}

function displaySuggestions(data) {
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    data.forEach((city, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${city.name}, ${city.country}`;

        listItem.onclick = function () {
            document.getElementById("cityInput").value = listItem.textContent;
            suggestionsList.innerHTML = ''; // Clear suggestions after selection
            performSearch(listItem.textContent); // Trigger search on selection
        };

        suggestionsList.appendChild(listItem);
    });
}

document.getElementById("cityInput").addEventListener("keydown", function (event) {
    const suggestionsList = document.getElementById("suggestionsList");
    const items = suggestionsList.getElementsByTagName("li");

    if (event.key === "ArrowDown") {
        // Move selection down
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateSelection(items);
        }
    } else if (event.key === "ArrowUp") {
        // Move selection up
        if (currentIndex > 0) {
            currentIndex--;
            updateSelection(items);
        }
    } else if (event.key === "Enter") {
        // Select the highlighted item if there is one
        if (currentIndex >= 0 && items[currentIndex]) {
            document.getElementById("cityInput").value = items[currentIndex].textContent;
            suggestionsList.innerHTML = ''; // Clear suggestions after selection
            performSearch(items[currentIndex].textContent);
        } else {
            // Perform search with the input field's text if no item is selected
            performSearch(document.getElementById("cityInput").value);
        }
    }
});

function updateSelection(items) {
    // Clear any previous selection
    Array.from(items).forEach(item => item.classList.remove("selected"));

    // Highlight the current selection
    if (items[currentIndex]) {
        items[currentIndex].classList.add("selected");
    }
}

function performSearch(query) {
    if (query) {
        const suggestionsList = document.getElementById("suggestionsList");
        suggestionsList.innerHTML = '';
        fetchData()
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', function (event) {
    const suggestionsList = document.getElementById("suggestionsList");
    if (!document.getElementById("cityInput").contains(event.target)) {
        suggestionsList.innerHTML = '';
    }
});