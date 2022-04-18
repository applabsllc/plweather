
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
	
/* 
this function takes a degree [0 -> 360] and converts 
it to a direction such as N, E, SE, NW, etc. 
*/

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


const setCityTitle = (title) => { //set city in title
	document.getElementById('cityTitle').innerHTML = title;
}

const setForecast = (html) => { //set html to forecast div
	document.getElementById('forecastContainer').innerHTML = html;
}

const clearAll = (err) => { //clear city and forecast
		setCityTitle("");
		setForecast("");	
		
		if(err)console.log(err);
}

const searchCity = (str) => {// search for city using API call
	
	clearAll();//clear previus results for new call
	
	if(str.length > 4){
	
		// 1) fetch general city info
		fetch('https://api.openweathermap.org/data/2.5/weather?q='+str+'&appid='+apiKey)
		.then((response) => {
				/*
				Check to see if response is OK or 404.
				Sometimes API returns 404 in header and others returns object with error code. This
				first check is to see if response is 404:
				*/
			  if (response.ok) {
				return response.json();
			  }
			  clearAll("404 response - City not found");
			})
		.then(cityData => {
			if(typeof cityData !== 'undefined' && typeof cityData.sys !== 'undefined' && cityData.sys.type > 0 && cityData.cod !== "404"){ //Second check to see if result is object and with a city (sys.type)
				
				let lat = cityData.coord.lat;
				let lng = cityData.coord.lon;
				
				// 2) then fetch forecast
				fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&appid='+apiKey+'&units=imperial ')
				.then(response => response.json())
				.then(forecast => handleForecastResponse(cityData.name , forecast));
				
			}else clearAll();
		})
		.catch((err) => clearAll(err));//catch for general fetch error
		
	}//end if
	
}

const handleForecastResponse = (city, forecast) => {
	
	setCityTitle(city); //set name of city
	
	if(forecast.daily.length){ //check to see if forecast available for that city
		setForecast(buildForecast(forecast.daily)); //set forcast based on daily array
	}else setForecast(""); //else set forecast to empty
}

const buildForecast = (list) => {
	
	let html = ``;
	
	list.map((day,i) => {
		
		const d = new Date();//get current date
		d.setDate(d.getDate() + i); //number  of days to add to current date
		
		//get day of week
		let currentDayOfWeek = daysOfWeek[d.getDay()];//get current num for day [0 Sun -> 6 Sat]
		
		//build date string
		let currentDate = (d.getMonth() + 1)+'/'+d.getDate()+'/'+d.getFullYear();
		
		//temperature
		let temp = parseInt(day.temp.day);
		
		//weather state
		let weatherState = day.weather[0] ? day.weather[0].main : "N/A";
		
		//wind icon
		let windIcon = './images/wind.png';

		//wind data
		let windInfo = windDirections(day.wind_deg)+ ' '+ parseInt(day.wind_speed) + 'mph ' ;
		
		//weather icon from API
		let weatherIcon = day.weather[0] ? 'http://openweathermap.org/img/wn/'+day.weather[0].icon+'@2x.png' : "N/A";
		
		html += `
		<div class='card'>
			<div class='dateWrapper'>
				<div class='dayHolder'>${currentDayOfWeek}</div>
				<div class='dateHolder'>${currentDate}</div>
			</div>
			<div class='tempWrapper'>
				${temp}&deg; 
			</div>
			<div class='weatherWrapper'>
				<div>${weatherState} </div>
				<div class='windHolder'>
					<img src='${windIcon}' class='windIcon' />
					<span class='windInfo'> ${windInfo}</span>
				</div>
			</div>
			<div class='iconWrapper'>
				<img src='${weatherIcon}' class='weatherIcon'>
			</div>
				
			
		</div>
		`;
	});
		
	return html;
}