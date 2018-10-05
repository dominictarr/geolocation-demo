var GreatCircle = require('great-circle')

var pre = document.createElement('pre')
var speed = document.createElement('h1')
var position = document.createElement('h3')
var version = document.createElement('div')
version.textContent = '2'
document.body.appendChild(speed)
document.body.appendChild(position)
document.body.appendChild(pre)
document.body.appendChild(version)

console.log('loaded geolocation demo')

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
  return ~~tude.toString()+DEGREE_SYMBOL+Math.abs((tude - ~~(tude))*60).toPrecision(4)
}

var positions = []

pre.textContent = 'waiting for position...'

function round(r, n) {
  var f = Math.pow(10, n)
  return Math.round(r*f)/f
}

navigator.geolocation.watchPosition(function (e) {
  positions.push(flatten(e))

  //keep 15 minute's worth of locations.
  while(positions.length && positions[0].timestamp < Date.now() - 15*60e3) // one minute
    positions.shift()

  var lat = e.coords.latitude, long = e.coords.longitude
  var movement = positions.map(function (_e, i) {
    var _lat = _e.coords.latitude, _long = _e.coords.longitude
    var time = e.timestamp - _e.timestamp
    if (positions[i+1]) {
      return {
        distance: GreatCircle.distance(_lat, _long, lat, long, 'NM'),
        heading: GreatCircle.bearing(_lat, _long, lat, long),
        speed: GreatCircle.distance(_lat, _long, lat, long, 'NM') / (time / (1000*60*60)),
        time: (e.timestamp - _e.timestamp)/1000
      }
    }
  })

  position.textContent = (
    decimalTudeToMinutes(e.coords.latitude)
    + ', ' +
    decimalTudeToMinutes(e.coords.longitude)
  )

  E = e
//  var metersPerSecond = e.coords.speed || 0
//  var metersPerHour = metersPerSecond*3600
//  var metersPerNauticalMile = 1852.001
//  var knots = metersPerHour/metersPerNauticalMile
  
//  var _lat = positions[1] ? positions[1].latitude : lat, _long = positions[1] ? positions[1].longitude : long
//  var instant = {
//    heading: GreatCircle.bearing(_lat, _long, lat, long),
//    speed: GreatCircle.distance(_lat, _long, lat, long, 'NM') / (positions[1] ? positions[0].timestame - positions[1].timestamp : 0 / (1000*60*60)),
//  }
//

  instant = movement[0] || {speed: 0, heading: NaN}
  speed.textContent = round(instant.speed || 0, 2) + ' ' + round(instant.heading, 2) + DEGREE_SYMBOL

  pre.textContent = JSON.stringify(movement, null, 2)
}, function (err) {
  console.log('error', new Date(), ERR = err)
  pre.textContent = JSON.stringify({error:err.code, message: err.message, time: new Date.toString()}, null, 2)
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})



