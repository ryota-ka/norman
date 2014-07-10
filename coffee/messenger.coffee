class Messenger

  _app = null
  _io = null

  constructor: (app, io) ->
    _app = app
    _io = io


  init: ->
    _io.sockets.on 'connection', (socket) =>
      console.log "client #{socket.id} connected"
      _app.userRoomHandler.addUser(socket.id)

      socket.on 'disconnect', =>
        console.log "client #{socket.id} disconnected"
        _app.userRoomHandler.removeUser(socket.id)


  send: (sessionId, message, data) ->
    _io.sockets.socket(sessionId).emit message, data


  sendAll: (message, data) ->
    _io.sockets.emit message, data
