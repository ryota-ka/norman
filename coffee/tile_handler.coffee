class TileHandler

  _ = null
  _game = null

  _kinds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 31, 31, 31, 31, 33, 33, 33, 33, 35, 35, 35, 35, 37, 37, 37, 37, 41, 41, 41, 41, 43, 43, 43, 43, 45, 45, 45, 45]
  _tiles = []


  constructor: (app, game) ->
    _ = app
    _game = game


  init: ->
    _kinds = _app.util.shuffle(_kinds)
    dices = _hand.getDices()
    diceSum = dices[0] + dice[1]
    offset = (512 - 32 * diceSum) % 136
    slicedTiles = _kinds.slice(offset)
    # @todo reorder tiles
    for i in [0...136]
      _tiles.push(new Tile(i, _kinds[i]))
    _wall = _tiles.slice(0, 122)

    _supplementalTiles = [_tiles[134], _tiles[135], _tiles[132], _tiles[133]]
    _doraIndicators.push(_tiles[130])
    _underneathDoraIndicators.push(_tiles[131])

    for i in [0...4]
      for j in [0...4]
        for k in [0...4]
          @draw(j)
    for i in [0...4]
      @draw(i)
      @sendHand(i)
      _hand.checkWaitedTiles(i)

    @sendDiscards()
    @sendOpenMelds()

    _game.sendAll('doraIndicators', _doraIndicators)

    _hand.setTurn(0)
    _hand.setHandStatus(1)
    @draw(0)


    draw: (wind) ->
      wind = (_hand.getTurn() + 1) % 4 if wind == null
      if _app.util.isWind(wind)
        tile = _wall.unshift()
        _hands[wind].push(tile)
        unless _hand.getTurnStatus() == null
          _hand.completeReady()
          _game.send('drawTile', tile, wind)
          _hand.setTurn(wind)
          _hand.resetOverLooking(wind)
          _hand.setTurnStatus(0)
          _game.sendAll('wallNumber', @getWallNumber())
          _hand.whatToDo()


    getHandByWind: (wind) ->
      if _app.util.isWind(wind)
        return 

