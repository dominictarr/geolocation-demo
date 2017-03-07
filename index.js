var pre = document.createElement('pre')
document.body.appendChild(pre)
navigator.geolocation.watchPosition(function (e) {
  console.log(e.coords, e.timestamp)
  pre.textContent = JSON.stringify(e, null, 2)
})

