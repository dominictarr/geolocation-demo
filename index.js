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
  position.push(flatten(e))
  //keep just one minute's worth of locations.
  if(e.timestamp < Date.now() - 60e3) // one minute
    positions.shift()

  var movement = position.map(function (_e) {
    return {
      distance: GreatCircle.distance(_e.latitude, _e.longitude, e.latitude, e.longitude, 'NM'),
      heading: GreatCircle.bearing(_e.latitude, _e.longitude, e.latitude, e.longitude)
    }
  })

  pre.textContent = JSON.stringify(flatten({current:e, movement: movement}), null, 2)
})

