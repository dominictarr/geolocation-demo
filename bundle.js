(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

module.exports = function (canvas) {
  var ctx = canvas.getContext('2d')
  return function (movement) {
    var tl = {x: 0, y: 0}
    var br = {x: canvas.width, y: canvas.height}
    var center = {x: (tl.x + br.x)/2, y: (tl.y + br.y)/2}
    ctx.fillStyle = 'white'
    ctx.fillRect(tl.x, tl.y, br.x, br.y)
    ctx.beginPath()
    ctx.moveTo(center.x, tl.y)
    ctx.lineTo(center.x, br.y)
    ctx.moveTo(tl.x, center.y)
    ctx.lineTo(br.x, center.y)
    var radius = Math.min(center.x, center.y)
    var scale = radius/10
    ctx.ellipse(center.x, center.y, radius, radius, 0, 0, Math.PI*2)

    var ago = [0] //, 60, 5*60, 15*60,60*60]
//    var names = ['10s', 'min', '5min', '15min','hour']
    for(var i = 0; i < movement.length && ago.length; i++)
      if(movement[i].time >= ago[0] - 1) {
        ctx.moveTo(center.x, center.y)
        var radians = (movement[i].heading/360) * Math.PI*2
        ctx.lineTo(
          center.x + (Math.sin(radians) * scale * movement[i].speed),
          center.y + (Math.cos(radians) * scale * movement[i].speed)
        )

    //    s += names[0] + ': ' + round(movement[i].speed || 0, 2) + ' ' + round(movement[i].heading, 2) + DEGREE_SYMBOL +'\n'
  //      ago.shift()
//        names.shift()
      }
    ctx.stroke()

  }
}

},{}],2:[function(require,module,exports){
var GreatCircle = require('great-circle')

var pre = document.createElement('pre')
var speed = document.createElement('h1')
var position = document.createElement('h3')
var average = document.createElement('div')
var version = document.createElement('div')
version.textContent = '10'
var canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 400
document.body.appendChild(canvas)
var compass = require('./compass')(canvas)
compass([]) //initial drawing...

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

  s = ''
  var ago = [10, 60, 5*60, 15*60,60*60]
  var names = ['10s', 'min', '5min', '15min','hour']
  for(var i = 0; i < movement.length && ago.length; i++)
    if(movement[i].time >= ago[0] - 1) {
      s += names[0] + ': ' + round(movement[i].speed || 0, 2) + ' ' + round(movement[i].heading, 2) + DEGREE_SYMBOL +'\n'
      ago.shift()
      names.shift()
    }

  average.textContent = s
  pre.textContent = JSON.stringify(movement, null, 2)
  compass(movement)
}, function (err) {
  console.log('error', new Date(), ERR = err)
  pre.textContent = JSON.stringify({error:err.code, message: err.message, time: new Date.toString()}, null, 2)
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})

},{"./compass":1,"great-circle":3}],3:[function(require,module,exports){
var GreatCircle = {

    validateRadius: function(unit) {
        var r = {'M': 6371009, 'KM': 6371.009, 'MI': 3958.761, 'NM': 3440.070, 'YD': 6967420, 'FT': 20902260};
        if ( unit in r ) return r[unit];
        else return unit;
    },

    distance: function(lat1, lon1, lat2, lon2, unit) {
        if ( unit === undefined ) unit = 'KM';
        var r = this.validateRadius(unit); 
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lon2 *= Math.PI / 180;
        var lonDelta = lon2 - lon1;
        var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
        var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
        var angle = Math.atan2(Math.sqrt(a) , b);
        
        return angle * r;
    },
    
    bearing: function(lat1, lon1, lat2, lon2) {
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lon2 *= Math.PI / 180;
        var lonDelta = lon2 - lon1;
        var y = Math.sin(lonDelta) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
        var brng = Math.atan2(y, x);
        brng = brng * (180 / Math.PI);
        
        if ( brng < 0 ) { brng += 360; }
        
        return brng;
    },
    
    destination: function(lat1, lon1, brng, dt, unit) {
        if ( unit === undefined ) unit = 'KM';
        var r = this.validateRadius(unit);
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dt / r) + Math.cos(lat1) * Math.sin(dt / r) * Math.cos( brng * Math.PI / 180 ));
        var lon3 = lon1 + Math.atan2(Math.sin( brng * Math.PI / 180 ) * Math.sin(dt / r) * Math.cos(lat1) , Math.cos(dt / r) - Math.sin(lat1) * Math.sin(lat3));
        
        return {
            'LAT': lat3 * 180 / Math.PI,
            'LON': lon3 * 180 / Math.PI
        };
    }

}

if (typeof module != 'undefined' && module.exports) {
    module.exports = GreatCircle;
} else {
    window['GreatCircle'] = GreatCircle;
}

},{}]},{},[2]);
