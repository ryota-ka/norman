class PlayerHandler

  _players = null

  constructor: (app, userRoomHandler, game) ->
    @app = app
    @userRoomHandler = userRoomHandler
    @game = game
    _players = []

    sessionIds = @app.util.shuffle(@userRoomHandler.getSessionIdsByRoom(@game.getRoom()))

    for i in [0...4]
      _players.push(new Player(@app, @userRoomHandler, @game, @, sessionIds[i], i))


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
    if @app.util.isWind(seat)
      return _players[seat]

  getPlayerByWind: (wind) ->
    @getPlayerBySeat((wind + @game.getRound() - 1) % 4)
