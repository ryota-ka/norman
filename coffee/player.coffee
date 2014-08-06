class Player

  constructor: (app, game, _sessionId, _seat) ->
    _points = 25000
    _declaredReady = false
    _isReady = false


    @init = ->
      _declaredReady = false
      _isReady = false


    @getSessionId = ->
      _sessionId


    @getUser = ->
      app.userRoomHandler.getUserBySessionId(_sessionId)


    @getSeat = ->
      _seat


    @getWind = ->
      (3 * (game.getRound() - 1) + _seat) % 4


    @getPoints = ->
      _points


    @addPoints = (amount) ->
      if _points + amount < 0
        all = _points
        _points = 0
        # @todo hako
        return -all
      else
        _points += diff
        return diff


    @declareReady = ->
      unless _declaredReady
        if _points >= 1000
          _declaredReady = true
          return true
        else
          # @todo send message 'you don't have enough points'
          return false
      else
        return false


    @completeReady = ->
      if _declaredReady
        _isReady = true
        _points -= 1000
        game.addDeposit()


    @send = (message, action) ->
      @getUser.sendToMe(message, action)
