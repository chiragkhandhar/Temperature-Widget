window.addEventListener("load", () => {
let searchInput = document.querySelector(".search-box");
  let errorBox = document.querySelector(".errorBox");
  errorBox.hidden = true;
  let lat, long;
  let locationName = document.querySelector(".location-name");
  let locationTimeZone = document.querySelector(".location-timezone");
  let locationLocalTime = document.querySelector(".location-localtime");
  let temperatureSection = document.querySelector(".temperature");
  let temperatureDegree = document.querySelector(".temperature-degree");
  let tempSymb = document.querySelector(".temperature-symb");
  let feelsLikeTemp = document.querySelector(".feelslike-degree");
  let feelslikeSymb = document.querySelector(".feelslike-symb");
  let celsiusTemp, fahreniteTemp, feelslikeCelTemp,feelslikeFahTemp;
  let tempFlag = 1; // 1 = Celsius : 0 = Fahrenite
  let weatherIcon = document.querySelector(".icon");
  let locationBtn = document.querySelector(".getLocation");
  let tempPill = document.querySelector(".tempPill");
  tempPill.textContent = "Fahrenite";
  let humidityLab = document.querySelector(".humidity");
  let cloudcoverLab = document.querySelector(".cloudcover");
  let precipLab = document.querySelector(".precip");
  
  searchInput.addEventListener("keypress", (evt) => {
    if (evt.keyCode == 13) {
      console.log("Enter Pressed" + "Text: " + searchInput.value);
      const url = `${proxy}http://api.weatherstack.com/current?access_key=${key}&query=${searchInput.value}&hourly=1`;
      callAPI(url);
      searchInput.value = "";
    }
  });

  temperatureSection.addEventListener("click", () => {
    if (tempFlag === 1) {
      temperatureDegree.textContent = Math.floor(fahreniteTemp);
      feelsLikeTemp.textContent = Math.floor(feelslikeFahTemp);
      tempSymb.textContent = "F";
      feelslikeSymb.textContent = tempSymb.textContent;
      tempPill.textContent = "Celsius";
      tempFlag = 0;
    } else if (tempFlag === 0) {
      temperatureDegree.textContent = celsiusTemp;
      feelsLikeTemp.textContent = feelslikeCelTemp;
      tempSymb.textContent = "C";
      feelslikeSymb.textContent = tempSymb.textContent;
      tempPill.textContent = "Fahrenite";
      tempFlag = 1;
    }
  });

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        long = position.coords.longitude;
        lat = position.coords.latitude;

        const url = `${proxy}http://api.weatherstack.com/current?access_key=${key}&query=${lat},${long}&hourly=1`;
        callAPI(url);
      });
    }
  };

  getGeoLocation();

  const key = "7834fd4e3be2f0300356603b771ee2db";
  const proxy= "https://cors-anywhere.herokuapp.com/";

  const callAPI = (api) => {
    console.log("callAPI clicked.");
    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        errorBox.hidden = true;
        const { temperature, weather_descriptions, weather_icons, humidity, cloudcover, feelslike, precip} = data.current;
        const { name, region, localtime, timezone_id } = data.location;
        celsiusTemp = temperature;
        feelslikeCelTemp = feelslike;

        temperatureDegree.textContent = celsiusTemp;
        feelsLikeTemp.textContent = feelslikeCelTemp;

        humidityLab.textContent = humidity + " %";
        cloudcoverLab.textContent = cloudcover + " %";
        precipLab.textContent = precip + " %";
        weatherIcon.innerHTML = `<figure class=\"figure\"><img class=\"figure-img img-fluid rounded\" src=\"${weather_icons}\" width=\"64px\" height=\"64px\"><figcaption class=\"figure-caption text-center\">${weather_descriptions}</figcaption></figure>`;

        locationName.textContent = name + ", " + region;
        locationLocalTime.textContent = localtime;
        locationTimeZone.textContent = timezone_id;

        fahreniteTemp = celsiusTemp * (9 / 5) + 32;
        feelslikeFahTemp = feelslikeCelTemp * (9/5) + 32;
      })
      .catch((err) => {
        console.log(`Error| ${err}`);
        errorBox.hidden = false;
      });
  };

  locationBtn.addEventListener("click", () => {
    getGeoLocation();
  });
});
