###
class Human extends User

  _sessionId = ''
  _name = ''
  _room = 0
  _isObserver = false
  _reconnectionId = ''


  constructor: (app, userRoomHandler, sessionId, name = undefined) ->
    _sessionId = sessionId
    _name = if name? then name else 'Guest' + (Math.floor(Math.random * 90000) + 10000)
    # @todo send reconnection id


  isObserver: ->
    _isObserver


  toggleObserver: ->
    _isObserver = !_isObserver


  sendToMe: (action, data) ->
    @app.messenger.send(_sessionId, action, data)
###
