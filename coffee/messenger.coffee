class Messenger

  _io = null

  constructor: (app, io) ->
    @app = app
    _io = io


  init: ->
    _io.sockets.on 'connection', (socket) =>
      console.log "client #{socket.id} connected"
      @app.userRoomHandler.addUser(socket.id)
      socket.join(0)

      socket.on 'disconnect', =>
        console.log "client #{socket.id} disconnected"
        @app.userRoomHandler.removeUser(socket.id)


  send: (sessionId, message, data) ->
    _io.sockets.connected[sessionId].emit message, data


  sendToRoom: (room, message, data) ->
    _io.sockets.to(room).emit message, data


  sendAll: (message, data) ->
    _io.sockets.emit message, data
