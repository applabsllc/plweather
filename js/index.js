
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

const setCityTitle = (title) => {
	document.getElementById('cityTitle').innerHTML = title;
}

const setForecast = (html) => {
	document.getElementById('forecastContainer').innerHTML = html;
}

const clearAll = () => {
		setCityTitle("");
		buildForecast([]);	
}

const searchCity = (str) => {
	
	if(str.length == 0)clearAll();
	
	if(str.length > 4){
	
		// 1) fetch general city info
		fetch('https://api.openweathermap.org/data/2.5/weather?q='+str+'&appid='+apiKey)
		.then(response => response.json())
		.then(cityData => {
			if(typeof cityData.sys !== 'undefined' && cityData.sys.type === 2 && cityData.cod !== "404"){//check to see if result found a city
	
				let cityId = cityData.id;
				let lat = cityData.coord.lat;
				let lng = cityData.coord.lon;
				
				handleCityResponse(cityData);
				
				// 2) then fetch forecast
				fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&appid='+apiKey)
				.then(response => response.json())
				.then(forecast => handleForecastResponse(forecast));
				
			}else clearAll();
		});
		
		
		
	}
	
}

const handleCityResponse = (data) => {
		let currentCity = data.name;
		setCityTitle(currentCity);
}

const handleForecastResponse = (data) => {
	console.log("forecast:",data);
	if(data.daily.length){//check to see if forecast available for that city
		setForecast(buildForecast(data.daily));
	}
}

const buildForecast = (list) => {
	
	let html = ``;
	const d = new Date();
	
	list.map((day,i) => {
		let currentDayOfWeek = d.getDay()+i < 7?d.getDay()+i > 6:0;
		
		html += `
		<div class='card'>Today</div>
		`;
	});
	
}