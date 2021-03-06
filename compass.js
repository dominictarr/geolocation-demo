
module.exports = function (canvas) {
  var ctx = canvas.getContext('2d')
  return function (movement) {
    var tl = {x: 0, y: 0}
    var br = {x: canvas.width, y: canvas.height}
    var center = {x: (tl.x + br.x)/2, y: (tl.y + br.y)/2}
    ctx.fillStyle = 'white'
    ctx.fillRect(tl.x, tl.y, br.x, br.y)
    ctx.beginPath()
    ctx.strokeStyle = 'lightgray'
    ctx.moveTo(center.x, tl.y)
    ctx.lineTo(center.x, br.y)
    ctx.moveTo(tl.x, center.y)
    ctx.lineTo(br.x, center.y)
    var radius = Math.min(center.x, center.y)
    var scale = radius/10
    ctx.ellipse(center.x, center.y, radius, radius, 0, 0, Math.PI*2)

    var ago = [0, 10, 30, 60, 5*60] //, 60, 5*60, 15*60,60*60]
    var colours = ['black', 'darkgray', 'lightgray', 'darkblue', 'lightblue']
//    var names = ['10s', 'min', '5min', '15min','hour']

    ctx.stroke()

    for(var i = 0; i < movement.length && (ago.length > 0); i++)
      if(movement[i].time >= ago[0] - 0.1) {
        ago.shift()
        ctx.beginPath()
        ctx.strokeStyle = colours.shift()
        ctx.moveTo(center.x, center.y)
        var radians = (movement[i].heading/360) * Math.PI*2
        ctx.lineTo(
          center.x + (Math.sin(radians) * scale * movement[i].speed),
          center.y - (Math.cos(radians) * scale * movement[i].speed)
        )
    ctx.stroke()

    //    s += names[0] + ': ' + round(movement[i].speed || 0, 2) + ' ' + round(movement[i].heading, 2) + DEGREE_SYMBOL +'\n'
//        names.shift()
      }

    ctx.stroke()

  }
}
