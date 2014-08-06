class Messenger

  constructor: (app, io) ->
    _users = []

    @init = ->
      io.sockets.on 'connection', (socket) =>
        console.log "client #{socket.id} connected"
        app.userRoomHandler.addUser(socket.id)
        _users[socket.id] = app.userRoomHandler.getUserBySessionId(socket.id)
        socket.join(0)
        @sendToRoom(0, 'msg', 0)
        @sendToRoom(205, 'msg', 205)

        socket.on 'disconnect', =>
          console.log "client #{socket.id} disconnected"
          app.userRoomHandler.removeUser(socket.id)
          delete _users[socket.id]

        socket.on 'room', (data) =>
          user = _users[socket.id]
          oldRoom = user.getRoom()
          if (room = app.userRoomHandler.setRoom(socket.id, data)) != false
            socket.leave(oldRoom)
            socket.join(room)

        socket.on 'name', (data) =>
          _users[socket.id].setName(data)


    @send = (sessionId, message, data) ->
      io.sockets.connected[sessionId].emit message, data


    @sendToRoom = (room, message, data) ->
      io.sockets.to(room).emit message, data


    @sendAll = (message, data) ->
      io.sockets.emit message, data
