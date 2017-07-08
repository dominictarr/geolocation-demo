var GreatCircle = require('great-circle')

var pre = document.createElement('pre')
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

var positions = []

pre.textContent = 'waiting for position...'

navigator.geolocation.watchPosition(function (e) {
  console.log(e.coords, e.timestamp)
  positions.push(flatten(e))
  //keep just one minute's worth of locations.
  if(e.timestamp < Date.now() - 60e3) // one minute
    positions.shift()

  var lat = e.coords.latitude, long = e.coords.longitude
  var movement = positions.map(function (_e) {
    var _lat = _e.coords.latitude, _long = _e.coords.longitude
    return {
      distance: GreatCircle.distance(_lat, _long, lat, long, 'NM'),
      heading: GreatCircle.bearing(_lat, _long, lat, long)
    }
  })

  pre.textContent = JSON.stringify({current: flatten(e), movement: movement}, null, 2)
}, function (err) {
  pre.textContent = JSON.stringify({error:err.code, message: err.message}, null, 2)
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})

