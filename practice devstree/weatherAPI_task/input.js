
import readline from 'readline'
import dotenv from 'dotenv'
dotenv.config()


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
let userentername;

r1.question('Enter city name:',(city)=>{
userentername = city;
if(!userentername){
    console.log('please enter valid name')
}
const Api_Url = `https://api.openweathermap.org/data/2.5/weather?q=${userentername}&units=metric&appid=${process.env.API_KEY}`
fetch(Api_Url)
.then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Weather data for', data.name);
    console.log('Temperature:', data.main.temp,'°C');
    console.log('Description:', data.weather[0].description);
    console.log('Humidity:', data.main.humidity, '%');
    console.log('Wind Speed:', data.wind.speed, 'm/s');
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });
})






