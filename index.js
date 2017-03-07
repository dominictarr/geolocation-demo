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

navigator.geolocation.watchPosition(function (e) {
  console.log(e.coords, e.timestamp)
  pre.textContent = JSON.stringify(flatten(e), null, 2)
})


