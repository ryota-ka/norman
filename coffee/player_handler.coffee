class PlayerHandler


  constructor: (app, game, _sessionIds) ->

    _players = []

    for i in [0...4]
      _players.push(new Player(app, game, _sessionIds[i], i))


    @init = ->
      for player in _players
        player.init()


    @getPlayers = ->
      _players


    @getPlayerBySessionId = (sessionId) ->
      for player of _players
        if player.getSessionId() == sessionId
          return player
      return false


    @getPlayerBySeat = (seat) ->
      if app.util.isWind(seat)
        return _players[seat]


    @getPlayerByWind = (wind) ->
      @getPlayerBySeat((wind + game.getRound() - 1) % 4)
