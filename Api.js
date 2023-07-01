const express = require('express')
const https = require('https')
const bodyParse = require('body-parser')
const { urlencoded } = require('body-parser')
const ejs = require('ejs')
const app = express()
app.use(bodyParse.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/weather.html')
})
var weatherdata
var temp
var icon
var imgURL
var weatherdisc
var city
app.post('/', function (req, res) {
  city = req.body.cityName
  const appKey = 'e46678f66cca103468818a90a7af50a8'
  const url =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    city +
    '&appid=' +
    appKey +
    '&units=metric#downloadJSON=true'
  https.get(url, function (response) {
    response.on('data', function (data) {
      try
      {
        weatherdata = JSON.parse(data)
        temp = weatherdata.main.temp
        icon = weatherdata.weather[0].icon
        imgURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
        weatherdisc = weatherdata.weather[0].description
        res.redirect('/weather')
      }
      catch(err)
      {
        res.redirect("/invalid");
      }
      // res.write('<p>The weather is ' + weatherdisc + '</p>')
      // res.write('<img  class="w-16" src=' + imgURL + '>')
      // res.write('<h1>The temprature of ' + city + ' is ' + temp + ' °C</h1>')
      
    })
  })
})
app.get('/weather', function (req, res) {
  res.render('details', {
    weatherdisc: weatherdisc,
    imgURL: imgURL,
    city: city,
    temp: temp,
  })
})
app.get('/invalid', function (req, res) {
  res.render('invalid')
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Hi I am port 3000')
})
