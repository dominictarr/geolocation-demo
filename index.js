var GreatCircle = require('great-circle')

var pre = document.createElement('pre')
var speed = document.createElement('h1')
var position = document.createElement('h3')
var average = document.createElement('div')
var version = document.createElement('div')
version.textContent = '5'
document.body.appendChild(position)
document.body.appendChild(speed)
document.body.appendChild(version)
document.body.appendChild(average)
document.body.appendChild(pre)
average.textContent = 'averages:'
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

  e.timestamp = Date.now() //fix timestamp

  //keep 15 minute's worth of locations.
  while(positions.length && positions[0].timestamp < Date.now() - 15*60e3) // 15 minutes
    positions.pop()

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
  }).filter(Boolean)

  positions.unshift(flatten(e))

  position.textContent = (
    decimalTudeToMinutes(e.coords.latitude)
    + ', ' +
    decimalTudeToMinutes(e.coords.longitude)
  )

//  var _e = movement.find(function (e) {
//    return e.time 
//  })
  E = e
  var instant = movement[Math.min(10, movement.length-1)] || {speed: 0, heading: NaN}
  speed.textContent = round(instant.speed || 0, 2) + ' ' + round(instant.heading, 2) + DEGREE_SYMBOL

  averages = ''
  var ago = [10, 60, 5*60, 15*60,60*60]
  var names = ['10s', 'min', '5min', '15min','hour']
  for(var i = 0; i < movement.length && ago.length; i++)
    if(movement[i].time >= ago[0] - 1) {
      averages += names[0] + ':' + round(instant.speed || 0, 2) + ' ' + round(instant.heading, 2) + DEGREE_SYMBOL +'\n'
      ago.shift()
      names.shift()
    }
  pre.textContent = JSON.stringify(movement, null, 2)
}, function (err) {
  console.log('error', new Date(), ERR = err)
  pre.textContent = JSON.stringify({error:err.code, message: err.message, time: new Date.toString()}, null, 2)
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})


