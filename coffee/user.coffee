class User

  constructor: (app, _sessionId) ->

    _name = ''
    _room = 0


    @getSessionId = ->
      _sessionId


    @getName = ->
      _name


    @setName = (name) ->
      _name = name if name.trim() != ''


    @getRoom = ->
      _room


    @setRoom = (room) ->
      _room = room
      @sendToMe('room', room)


    @sendToMe = (message, data) ->
      app.messenger.send(_sessionId, message, data)


    @getGame = ->
      app.userRoomHandler.getGameBySessionId(sessionId)
