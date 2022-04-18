
const apiKey = "086c5a0b75d6020a1259dc06decc77cf";
const daysOfWeek = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	];



const windDirections = (deg) => {

let winDir = "";

	switch(true) {
		case deg > 348.75 || deg <= 11.25:
			winDir = "N";
			break;
		case deg > 11.25 && deg <= 33.75:
			winDir = "NNE";
			break;
		case deg > 33.75 && deg <= 56.25:
			winDir = "NE";
			break;
		case deg > 56.25 && deg <= 78.75:
			winDir = "ENE";
			break;
		case deg > 78.75 && deg <= 101.25:
			winDir = "E";
			break;
		case deg > 101.25 && deg <= 123.75:
			winDir = "ESE";
			break;
		case deg > 123.75 && deg <= 146.25:
			winDir = "SE";
			break;
		case deg > 146.25 && deg <= 168.75:
			winDir = "SSE";
			break;
		case deg > 168.75 && deg <= 191.25:
			winDir = "S";
			break;
		case deg > 191.25 && deg <= 213.75:
			winDir = "SSW";
			break;
		case deg > 213.75 && deg <= 236.25:
			winDir = "SW";
			break;
		case deg > 236.25 && deg <= 258.75:
			winDir = "WSW";
			break;
		case deg > 258.75 && deg <= 281.25:
			winDir = "W";
			break;
		case deg > 281.25 && deg <= 303.75:
			winDir = "WNW";
			break;
		case deg > 303.75 && deg <= 326.25:
			winDir = "NW";
			break;
		case deg > 326.25 && deg <= 348.75:
			winDir = "NNW";
			break;
	}
	
	return winDir ? winDir : "N/A";

}


const setCityTitle = (title) => {
	document.getElementById('cityTitle').innerHTML = title;
}

const setForecast = (html) => {
	document.getElementById('forecastContainer').innerHTML = html;
}

const clearAll = (err) => {
		setCityTitle("");
		setForecast([]);	
		
		if(err)console.log(err);
}

const searchCity = (str) => {
	
	clearAll();//clear previus results for new call
	
	if(str.length > 4){
	
		// 1) fetch general city info
		fetch('https://api.openweathermap.org/data/2.5/weather?q='+str+'&appid='+apiKey)
		.then((response) => {
			  if (response.ok) {
				return response.json();
			  }
			  clearAll("404 response - City not found");
			})
		.then(cityData => {
			if(typeof cityData !== 'undefined' && typeof cityData.sys !== 'undefined' && cityData.sys.type > 0 && cityData.cod !== "404"){//check to see if result found a city

				let lat = cityData.coord.lat;
				let lng = cityData.coord.lon;
				
				handleCityResponse(cityData);
				
				// 2) then fetch forecast
				fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&appid='+apiKey+'&units=imperial ')
				.then(response => response.json())
				.then(forecast => handleForecastResponse(forecast));
				
			}else clearAll();
		})
		.catch((err) => clearAll(err));
		
	}//end if
	
}

const handleCityResponse = (data) => {
		let currentCity = data.name;
		setCityTitle(currentCity);
}

const handleForecastResponse = (data) => {
	console.log("forecast:",data);
	if(data.daily.length){//check to see if forecast available for that city
		setForecast(buildForecast(data.daily));
	}else setForecast("");
}

const buildForecast = (list) => {
	
	let html = ``;
	const d = new Date();
	
	list.map((day,i) => {
		var d = new Date();
		d.setDate(d.getDate() + i); //number  of days to add to current date
		
		//get day of week
		let currentDayOfWeek = daysOfWeek[d.getDay()];//get current num for day [0 Sun -> 6 Sat]
		
		//build date
		let currentDate = d.getDate()+' '+(d.getMonth() + 1)+' '+d.getFullYear();
		
		//temperature
		let temp = day.temp.day;
		
		//weather state
		let weatherState = day.weather[0] ? day.weather[0].main : "N/A";
		
		//wind data
		let windInfo = 'Wind Speed: ' +day.wind_speed+ 'mph @ ' + windDirections(day.wind_deg);
		
		//icon
		let weatherIcon = day.weather[0] ? 'http://openweathermap.org/img/wn/'+day.weather[0].icon+'@2x.png' : "N/A";
		
		html += `
		<div class='card'>
			${currentDayOfWeek}
			${currentDate}
			${temp}
			${weatherState}
			${windInfo}
			<img src='${weatherIcon}' class='weatherIcon'>
		</div>
		`;
	});
		
	return html;
}