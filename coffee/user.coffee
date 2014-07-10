class User

  _sessionId = null
  _name = ''
  _room = 0

  constructor: (app, userRoomHandler, sessionId) ->
    @app = app
    @userRoomHandler = userRoomHandler
    _sessionId = sessionId


  getSessionId: ->
    return _sessionId


  getName: ->
    return _name


  setName: (name) ->
    _name = name if name.trim() != ''


  getRoom: ->
    return _name


  setRoom: (room) ->
    _room = room
    @sendToMe('room', room)


  sendToMe: (message, data) ->
    @app.messenger.send(_sessionId, message, data)



  getGame: ->
    return @userRoomHandler.getGameBySessionId(sessionId)
