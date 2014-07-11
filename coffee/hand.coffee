class Hand

  _ = null
  _game = null

  _dices = null
  _turn = 0
  _turnStatus = null
  _availableCallings = [[], [], [], []]
  _calling = null
  _readyDeclared = [false, false, false, false]
  _readyDeclaredTurn = [null, null, null, null]
  _waitedTiles = [[], [], [], []]
  _oneShotAvailable = [false, false, false, false]
  _whatTodo = [[], [], [], []]
  _sacredDiscard = [[false, false, false, false], [false, false, false, false], [false, false, false, false]]

  constructor: (app, userRoomHandler, game) ->
    _ = app
    _game = game

    _dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]

    @tileHandler = new TileHandler(_, _game)

    for i in [0...4]
      _game.sendByWind i, 'startHand',
        wind: i
        round: _game.getRound()
        deposits: _game.getDeposits()
        counters: _game.getCounters()
        dices: _dices

    _game.getPlayerHandler.init()


  start: ->
    _tileHandler.init()


  getTileHandler: ->
    _tileHandler


  getDices: ->
    _dices


  getTurn: ->
    _turn


  setTurn: (turn) ->
    _turn = turn if _.util.isWind(turn)

  draw: ->
    @completeReady()
    _tileHandler.draw(_turn)


  getCalling: ->
    _calling


  setCalling: (wind, kind) ->
    if !_calling? || _calling.getKind() == 0 # @fix ちゃんと動かないかも
      _calling = new Calling(wind, kind)


  clearCalling: ->
    _calling = null


  processCalling: (tilesIds) ->
    if !_calling?
      @completeReady()
      _tileHandler.addOpenMeld(_calling.getWind(), _calling.getKind(), tilesIds)
      _turn = _calling.getWind()

      if _calling.getKind() <= 1
        @setTurnStatus(3 + _calling.getWind)
        @whatToDo()
      else
        if _calling.getKind() == 3
          @setTurnStatus(7)
          # @todo chankan
          @whatToDo
        else
          _tileHandler.drawSupplementalTile()
      @clearCalling


  tellToSelectTilesForCalling: (choices) ->
    if _calling
      _calling.setChoices(choices)
      data =
        kind: _calling.getKind()
        choices: choices
      if _calling.getKind() == 0
        data.tile = _tileHandler.getDiscardsByWind(_turn).last().getKind()
      else if _calling.getKind() == 3
        data.sidewayIndices = []
        for triplet in _tileHandler.getOpenTripletsByWind(_calling.getWind())
          data.sidewayIndices.push(3 - (triplet.getFrom() - _calling.getWind() + 4) % 4)
      _game.sendByWind(_calling.getWind(), 'selectTilesForCalling', data)
      @setTurnStatus(2)
      @whatToDo


  exhaustiveDraw: ->
    isTempai = [false, false, false, false]
    isNagashiMangan = []

    for i in [0...4]
      isNagashiMangan[i] = _tileHandler.isNagashiManganAvailable(i)

    # @todo implement nagashi mangan
    #
    #
  abortiveDraw: (type) ->
    _game.sendAll('abortiveDraw', type)
    # @todo finish game
    #

