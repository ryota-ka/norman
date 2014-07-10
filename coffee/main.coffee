$ ->
  s = io.connect('http://localhost:3000')

  console.dir s

  s.on 'connect', ->
    return
  s.on 'disconnect', ->
    return
