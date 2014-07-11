class Player

  _ = null
  _game = null

  _sessionId = null
  _seat = null
  _points = 25000
  _declaredReady = false
  _isReady = false

  constructor: (app, game, sessionId, seat) ->
    _ = app
    _game = game
    _sessionId = sessionId
    _seat = seat


  init: ->
    _declaredReady = false
    _isReady = false


  getSessionId:
    _sessionId


  getUser: ->
    _.userRoomHandler.getUserBySessionId(_sessionId)


  getSeat: ->
    _seat


  getWind: ->
    (3 * (_game.getRound() - 1) + _seat) % 4


  getPoints: ->
    _points


  addPoints: (amount) ->
    if _points + amount < 0
      all = _points
      _points = 0
      # @todo hako
      return -all
    else
      _points += diff
      return diff


  declareReady: ->
    unless _declaredReady
      if _points >= 1000
        _declaredReady = true
        return true
      else
        # @todo send message 'you don't have enough points'
        return false
    else
      return false


  completeReady: ->
    if _declaredReady
      _isReady = true
      _points -= 1000
      _game.addDeposit()


  send: (message, action) ->
    @getUser.sendToMe(message, action)
