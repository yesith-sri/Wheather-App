document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector('.weather-app');
    const temp = document.querySelector('.temp');
    const dateOutput = document.querySelector('.date');
    const timeOutput = document.querySelector('.time');
    const conditionOutput = document.querySelector('.condition');
    const nameOutput = document.querySelector('.name');
    const icon = document.querySelector('.icon');
    const cloudOutput = document.querySelector('.cloud');
    const humidityOutput = document.querySelector('.humidity');
    const windOutput = document.querySelector('.wind');
    const form = document.getElementById('locationInput');
    const search = document.querySelector('.search');
    const btn = document.querySelector('.submit');
    const cities = document.querySelectorAll('.city');

    let cityInput = "London";

    cities.forEach((city) => {
        city.addEventListener('click', (e) => {
            cityInput = e.currentTarget.innerHTML;
            fetchWeatherData();
            app.style.opacity = "0";
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        cityInput = search.value;
        fetchWeatherData();
        search.value = '';
        app.style.opacity = "0";
    });

    function dayOfTheWeek(day, month, year) {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const adjustedMonth = month - 1;
        return weekday[new Date(year, adjustedMonth, day).getDay()];
    }

    async function fetchWeatherData() {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=9f714c1ef3d74ef1898192634242503&q=${cityInput}`);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();
            console.log(data);
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d} / ${m} / ${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length);
            icon.src = "./icons" + iconId;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            let timeOfDay = data.current.is_day ? "day" : "night";
            const code = data.current.condition.code;

            // Check for clear weather
            if (code == 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                btn.style.background = data.current.is_day ? "#e5ba92" : "#181e27";
            } 
            // Check for cloudy weather
            else if ([1003, 1006, 1009,  1030,  1069, 1087, 1135, 1273,  1276,  1279, 1282].includes(code)) {
                    app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                    btn.style.background = "#fa6d1b";
                    if (!data.current.is_day) {
                        btn.style.background = "#181e27";
                    }
                } 
            // Check for rainy weather
            else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = data.current.is_day ? "#647d75" : "#325c80";
            } 
            // Check for snowy weather
            else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1261, 1264, 1279, 1282].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = data.current.is_day ? "#4d72aa" : "#1b1b1b";
            }

            app.style.opacity = "1";
        } catch (error) {
            alert('City not found, please try again');
            app.style.opacity = "1";
        }
    }

    fetchWeatherData();
    app.style.opacity = "1";
});
