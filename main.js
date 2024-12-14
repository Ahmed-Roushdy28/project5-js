// https://api.weatherapi.com/v1/forecast.json?key=240ed20d98da4632abd221551241312&q=07112&days=3
// keyUp

let lastSearchedCity = "Alexandria"; // Default city
///////////////////////////////////////////////////////

async function searchForcast(search) {
   try {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=240ed20d98da4632abd221551241312&q=${search}&days=3`, {
         method: "GET",
      });

      const result = await response.json();
      if (response.ok) {
         lastSearchedCity = result.location.name;
         const forecastData = result.forecast.forecastday.map(day => ({
            date: day.date,
            dayOfWeek: new Date(day.date).toLocaleDateString("en-US", { weekday: "long" }),
            location: result.location.name,
            temperature: day.day.avgtemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
            chanceOfRain: day.day.daily_chance_of_rain,
            windSpeed: day.day.maxwind_kph,
            windDirection: day.day.wind_dir || "East",
         }));
         displayProduct(forecastData);
      } else {
         console.warn(`Invalid city "${search}" entered.`);
      }
   } catch (error) {
      console.error("An error occurred:", error);
      document.getElementById("rowData").innerHTML = `<p class="text-danger">Unable to fetch data. Please try again later.</p>`;
   }
}

function displayProduct(list) {
   const rowData = document.getElementById("rowData");
   let display = ``;
   list.forEach(item => {
      display += `
         <div class="forcast">
            <div class="forcast-header d-flex justify-content-between">
               <div>${item.dayOfWeek}</div>
               <div>${item.date}</div>
            </div>
            <div class="forcast-content">
               <div class="location">${item.location}</div>
               <div class="degree">
                  <div class="num">${item.temperature}<sup>°</sup>C</div>
                  <div class="forcast-icon"><img src="${item.icon}" alt="${item.condition}" width="90"></div>
               </div>
               <div class="custom">${item.condition}</div>
               <span class="me-2 fs-5"><i class="fa-solid fa-umbrella"></i> ${item.chanceOfRain}%</span>
               <span class="me-2 fs-5"><i class="fa-solid fa-wind"></i> ${item.windSpeed} km/h</span>
               <span class="me-2 fs-5"><i class="fa-solid fa-compass"></i> ${item.windDirection}</span>
            </div>
         </div>`;
   });

   rowData.innerHTML = display;
}
document.getElementById("search").addEventListener("input", (event) => {
   const searchInput = event.target.value.trim();
   if (searchInput.length >= 3) {
      searchForcast(searchInput);
   } else if (searchInput.length === 0) {
      searchForcast(lastSearchedCity);
   }
});

window.addEventListener("DOMContentLoaded", () => {
   searchForcast(lastSearchedCity);
});
