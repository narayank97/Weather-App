"strict mode";

// Do a CORS request to get Davis weather hourly forecast

let imageArray = []  // global variable to hold stack of images for animation 
let count = 0;          // global var
let myCount = 0;
function animation() {
	setInterval( function(){
		if(myCount % 10 > 0)
		{
			document.getElementById('img'+((myCount % 10)-1)).style.display="none";
		}
		else if(myCount % 10 === 0)
		{
			document.getElementById('img'+9).style.display="none";
		}
		if(document.getElementById('img'+((myCount % 10)-1)) === null)
		{
			console.log((myCount % 10));
		}
		document.getElementById('img'+((myCount % 10))).style.display="inline";
		myCount++;
		
	}, 500);
}
function callAnimation()
{
	window.setInterval( animation(), 1000);
}

function addToArray(newImage) {
	if (count < 10) {
		newImage.id = "doppler_"+count;
		newImage.style.display = "none";
		imageArray.push(newImage);
		count = count+1;
		if (count >= 10) {
			console.log("Got 10 doppler images");
			for(i = 0; i < 10; i++)
			{
        console.log("hello");
				document.getElementById('myImg'+i).src=imageArray[i].src;
      }
      
		}
		
	}
}


function tryToGetImage(dateObj) {
	let dateStr = dateObj.getUTCFullYear();
	dateStr += String(dateObj.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
	dateStr += String(dateObj.getUTCDate()).padStart(2, '0');

	let timeStr = String(dateObj.getUTCHours()).padStart(2,'0')
	timeStr += String(dateObj.getUTCMinutes()).padStart(2,'0');

	let filename = "DAX_"+dateStr+"_"+timeStr+"_N0R.gif";
	let newImage = new Image();
	newImage.onload = function () {
		//console.log("got image "+filename);
		addToArray(newImage);
	}
	newImage.onerror = function() {
		// console.log("failed to load "+filename);
	}
	console.log(imageArray.length);
	newImage.src = "https://radar.weather.gov/ridge/RadarImg/N0R/DAX/"+filename;
}


function getTenImages() {
	let dateObj = new Date();  // defaults to current date and time
	// if we try 150 images, and get one out of every 10, we should get enough
	for (let i = 0; i < 150; i++) {
		newImage = tryToGetImage(dateObj);
		dateObj.setMinutes( dateObj.getMinutes()-1 ); // back in time one minute
	}

}

function calcDist(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	if (d>1) return Math.round(d);
	else if (d<=1) return Math.round(d*1000);
	return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLhttpsRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
  // let firstPath = "https://api.openweathermap.org/data/2.5/forecast/hourly?";
  let firstPath = "httpss://api.openweathermap.org/data/2.5/forecast?";
  let city = document.getElementById("city").value;
  let newCity = "";
  if(isNaN(city) == false)
  {
    newCity = "zip=" + city;
  }
  if(isNaN(city) == true)
  {
    newCity = "q=" + city;
  }
  // let restAPI = "&units=imperial&APPID=0049cffb9117913c6c97fd0d70ac3044";
  let restAPI = "&units=imperial&APPID=68b49a5a966f1ef3db2cdb1a918a59b7";
  let url = firstPath + newCity+",ca,us" + restAPI;
  console.log(url);

  let xhr = createCORSRequest('GET', url);

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Load some functions into response handlers.
  xhr.onload = function() {
      let davisLat = 38.5816;
      let davisLon = -121.4944; 
      let responseStr = xhr.responseText;  // get the JSON string 
      console.log("This is my response string "+responseStr);
      let object = JSON.parse(responseStr);  // turn it into an object
      let lat = parseFloat(JSON.stringify(object.city.coord.lat, undefined, 2));
      let lon = parseFloat(JSON.stringify(object.city.coord.lon, undefined, 2));
      console.log(typeof(lat));
      console.log("THIS IS MY LAT AND LONG -----> "+lat+ " , "+lon);
      
      console.log(calcDist(davisLat,davisLon,lat,lon));
      if(calcDist(davisLat,davisLon,lat,lon) > 150)
      {
        window.alert("Location not found!");
      }
      else
      {
      //console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
        for (i = 0; i < 6; i++) { 
          // let i = 3;
            let tempStr = JSON.stringify(object.list[i].main.temp, undefined, 2);
            let jsonTime = JSON.stringify(object.list[i].dt, undefined, 2);
            
            let myTime = new Date(parseInt(jsonTime,10)*1000);
            let hours = myTime.getHours();
            let minutes = "0" + myTime.getMinutes();
            let dd = "AM";
            if (hours >= 12) {
              hours = hours - 12;
              dd = "PM";
            }
            if (hours == 0) {
              hours = 12;
              dd = "PM";
            }
            let formattedTime = hours + ':' + minutes.substr(-2) +" "+ dd;
            let tempInput = "temp"+i;
            let timeInput = "time"+i;
            if(i == 0)
            {
                formattedTime = hours + " "+dd;
            }

            let myIcon = JSON.stringify(object.list[i].weather[0].icon, undefined, 2).trim();
            // console.log(JSON.stringify(object.list[i].weather[0].icon, undefined, 2));
            //console.log(JSON.stringify(object.list[i].weather., undefined, 2));
            

            // let img = document.createElement("IMG"+i);
            //change the pictures
            if(myIcon === '"04d"' || myIcon === '"04n"')
            {
              document.getElementById('image'+i).src = "assets/brokencloud.svg";
            }

            if(myIcon === '"01n"')
            {
              document.getElementById('image'+i).src = "assets/clear-night.svg";
            }

            if(myIcon === '"01d"')
            {
              document.getElementById('image'+i).src = "assets/clearsky.svg";
            }
            if(myIcon === '"02d"')
            {
              document.getElementById('image'+i).src = "assets/fewclouds-day.svg";
            }
            if(myIcon === '"02n"')
            {
              document.getElementById('image'+i).src = "assets/fewclouds-night.svg";
            }
            if(myIcon === '"50d"' || myIcon === '"50n"')
            {
              document.getElementById('image'+i).src = "assets/mist.svg";
            }
            if(myIcon === '"10d"')
            {
              document.getElementById('image'+i).src = "assets/rain-day.svg";
            }
            if(myIcon === '"10n"')
            {
              document.getElementById('image'+i).src = "assets/rain-night.svg";
            }
            if(myIcon === '"03d"' || myIcon === '"03n"')
            {
              document.getElementById('image'+i).src = "assets/scatteredclouds.svg";
            }
            if(myIcon === '"09d"' || myIcon === '"09n"')
            {
              document.getElementById('image'+i).src = "assets/showerrain.svg";
            }
            if(myIcon === '"13d"' || myIcon === '"13n"')
            {
              document.getElementById('image'+i).src = "assets/snow.svg";
            }
            if(myIcon === '"11d"' || myIcon === '"11n"')
            {
              document.getElementById('image'+i).src = "assets/thunderstorms.svg";
            }

            document.getElementById(tempInput).innerHTML = tempStr.substring(0, 2) + "°";
            if(timeInput === "time0")
            {
                document.getElementById(timeInput).innerHTML = "current<br>"+formattedTime;
            }
            else
            {
                document.getElementById(timeInput).innerHTML = formattedTime;
            }
               
        }
    }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();
}

// run this code to make request when this script file gets executed 

getTenImages();
animation();
makeCorsRequest();