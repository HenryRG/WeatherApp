const log = console.log;
//input Part
const box = document.querySelector('.box'),
inputField = document.querySelector("input"),
apiKey = `f852a1e9b3dbc771290a4f04e7d7d3a1`,
infoTxt = document.querySelector(".text_info"),
locationBtn = document.getElementById("locationBtn"),
weatherImg = document.querySelector('.weather_part img'),
backIntoInput = document.querySelector('.box .back-app');

// log(backIntoInput)

// log(infoTxt)
inputField.addEventListener("keyup", e =>{
    //if press enter and input value it's not equal to empty 
    if(e.key == "Enter" && inputField.value != ""){
        requestAPI(inputField.value)
    }
});

locationBtn.addEventListener('click', () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)//geting current position into functions Suc and Err
    } else{
        alert("Your browser not support geolocation api")
    }
});
const onSuccess = (userAcept) =>{
    const {latitude, longitude} = userAcept.coords; //target lat and long from coords 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`; //passing coords data into api
    fetchData();
}
const onError = (userDenied) =>{
    infoTxt.innerText = userDenied.message;
    infoTxt.classList.add('error')
}


const requestAPI = (city) =>{
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}  

const fetchData = () =>{
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    
    fetch(api) 
        .then(res => res.json())
          .then(req => weatherLocationDetailFunc(req));
}

const weatherLocationDetailFunc = (cityTarget) => { 
    if(cityTarget.cod == "404"){
        infoTxt.classList.replace('pending', 'error');
        infoTxt.innerText = `${inputField.value} ins't a valid city name`;
    } else{
        //target the data
        const city = cityTarget.name;
        const country = cityTarget.sys.country;
        const {temp, feels_like, humidity} = cityTarget.main;
        const {id, description} = cityTarget.weather[0];

        log(id)
        if(id == 800){
            weatherImg.src="./images/clear.svg";
        } else if(id >= 801){
            weatherImg.src = "./images/cloud.svg";
        } else if(id == 721) {
            weatherImg.src = "./images/haze.svg";
        } else if(id >= 600 && id <= 622) {
            weatherImg.src = "./images/snow.svg";
        }  else if(id >= 500 && id <= 531) {
            weatherImg.src = "./images/rain.svg";
        } else {
            weatherImg.src = "./images/storm.svg";
        }  
        
        //display data into DOM
        document.querySelector('.num').innerText = Math.floor(temp),
        document.querySelector('.weather').innerText = description,
        document.querySelector('.location span').innerText = `${city}, ${country}`,
        document.querySelector('.numb_2').innerText = Math.floor(feels_like),
        document.querySelector('.numb').innerText  = `${humidity}%`;

        //remove pending and error class
        infoTxt.classList.remove('pending', 'error');
        //add active class to box div
        box.classList.add("active");
    }
};
backIntoInput.addEventListener('click', ()=>{
    box.classList.remove('active');
    inputField.value = "";
})