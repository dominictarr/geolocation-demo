var GreatCircle = require('great-circle')

var pre = document.createElement('pre')
var speed = document.createElement('h1')
var position = document.createElement('h3')
document.body.appendChild(speed)
document.body.appendChild(position)
document.body.appendChild(pre)

function flatten (p) {
  var o = {}
  for(var k in p)
    if(p[k] && 'object' === typeof p[k])
      o[k] = flatten(p[k])
    else
      o[k] = p[k]
  return o
}

var DEGREE_SYMBOL = '\u00b0'

function decimalTudeToMinutes (tude) {
  return ~~tude.toString()+DEGREE_SYMBOL+Math.abs((tude - ~~(tude))*60)
}

var positions = []

pre.textContent = 'waiting for position...'

navigator.geolocation.watchPosition(function (e) {
  positions.push(flatten(e))
  //keep just one minute's worth of locations.

  while(positions.length && positions[0].timestamp < Date.now() - 60e3) // one minute
    positions.shift()

  var lat = e.coords.latitude, long = e.coords.longitude
  var movement = positions.map(function (_e) {
    var _lat = _e.coords.latitude, _long = _e.coords.longitude
    var time = e.timestamp - _e.timestamp
    return {
      distance: GreatCircle.distance(_lat, _long, lat, long, 'NM'),
      heading: GreatCircle.bearing(_lat, _long, lat, long),
      speed: GreatCircle.distance(_lat, _long, lat, long, 'NM') / (time / (1000*60*60))
      time: e.timestamp - _e.timestamp
    }
  })

  e = flatten(e)
  position.textContent = (
    decimalTudeToMinutes(e.coords.latitude)
    + ', ' +
    decimalTudeToMinutes(e.coords.latitude)
  )
  //meters_per_hour
  var metersPerHour = e.speed*3600
  var metersPerNauticalMile = 1852.001
  var knots = metersPerHour/metersPerNauticalMile
  speed.textContent = knots

  pre.textContent = JSON.stringify(movement, null, 2)
}, function (err) {
  pre.textContent = JSON.stringify({error:err.code, message: err.message}, null, 2)
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})










