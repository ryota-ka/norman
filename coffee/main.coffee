$ ->
  s = io.connect('http://localhost:3000')

  console.dir s

  s.on 'connect', ->
    return
  s.on 'disconnect', ->
    return


  $('#rooms').children().on 'click', ->
    console.log 'hello!'
    index = $('#rooms').children().index(@)
    list = [405, 403, 402, 401, 305, 303, 302, 301, 205, 203, 202, 201, 105, 103, 102]
    if index >= 0 && index <= 14
      s.emit 'room', list[index]
