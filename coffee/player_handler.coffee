class PlayerHandler

  _ = null
  _game = null

  _players = []

  constructor: (app, game) ->
    _ = app
    _game = game

    sessionIds = _.util.shuffle(_.userRoomHandler.getSessionIdsByRoom(_game.getRoom()))

    for i in [0...4]
      _players.push(new Player(_, _game, sessionIds[i], i))


  init: ->
    for player in _players
      player.init()


  getPlayers: ->
    _players


  getPlayerBySessionId: (sessionId) ->
    for player of _players
      if player.getSessionId() == sessionId
        return player
    return false


  getPlayerBySeat: (seat) ->
    if _.util.isWind(seat)
      return _players[seat]

  getPlayerByWind: (wind) ->
    @getPlayerBySeat((wind + _game.getRound() - 1) % 4)
