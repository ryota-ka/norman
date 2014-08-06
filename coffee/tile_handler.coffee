class TileHandler

  constructor: (app, game) ->

    _kinds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 31, 31, 31, 31, 33, 33, 33, 33, 35, 35, 35, 35, 37, 37, 37, 37, 41, 41, 41, 41, 43, 43, 43, 43, 45, 45, 45, 45].shuffle()
    _tiles = []
    _wall = []
    _hands = [[], [], [], []]
    _discards = [[], [], [], []]
    _openMelds = [[], [], [], []]
    _supplementalTiles = []
    _doraIndicators = []
    _underneathDoraIndicators = []


    @init = ->
      dices = game.hand.getDices()
      diceSum = dices[0] + dices[1]
      offset = (512 - 32 * diceSum) % 136
      slicedTiles = _kinds.slice(offset)
      # @todo reorder tiles
      for i in [0...136]
        _tiles.push(new Tile(i, _kinds[i]))
      _wall = _tiles.slice(0, 122)

      _supplementalTiles = [_tiles[134], _tiles[135], _tiles[132], _tiles[133]]
      _doraIndicators = [_tiles[130]]
      _underneathDoraIndicators = [_tiles[131]]

      for i in [0...4]
        for j in [0...4]
          for k in [0...4]
            @draw(j)
      for i in [0...4]
        @draw(i)
        @sendHand(i)
        #game.hand.checkWaitedTiles(i) # @debug

      @sendDiscards()
      @sendOpenMelds()

      game.sendAll('doraIndicators', _doraIndicators)

      game.hand.setTurn(0)
      game.hand.setTurnStatus(1)
      @draw(0)


    @draw = (wind) ->
      wind = (game.hand.getTurn() + 1) % 4 if wind == null
      if app.util.isWind(wind)
        tile = _wall.shift()
        _hands[wind].push(tile)
        unless game.hand.getTurnStatus() == null
          game.hand.completeReady()
          game.send('drawTile', tile, wind)
          game.hand.setTurn(wind)
          game.hand.resetOverlooking(wind)
          game.hand.setTurnStatus(0)
          game.sendAll('wallNumber', @getWallNumber())
          game.hand.whatToDo()


    @getWallNumber = ->
      _wall.count()


    @addOpenMeld = (wind, kind, tileIds, isRon = false) ->
      if app.util.isWind(wind)
        tiles = []
        turn = game.hand.getTurn()
        switch kind
          when 0, 1, 2
            tiles.push _discards[turn].pop()
            for key of _hands[wind]
              if _hands[wind][key].getId() in tileIds
                tiles.push _hands[wind][key]
                delete _hands[wind][key]
            _openMelds[wind].push new OpenMeld(kind, tiles, wind, turn)
            @sendDiscards

          when 3
            tileId = tileIds.first()
            for key of _hands[wind]
              if _hands[wind][key].getId() == tileId
                addedTile = _hands[wind][key]
                for key_ of _openMelds[wind]
                  if _openMelds[wind][key_].getKind() == 1 && _openMelds[wind][key_].getTiles().first().getKind() == addedTile.getKind()
                    _openMelds[wind][key_].addedQuad(addedTile)
                    delete _hands[wind][key]
                    break
                break

          when 4
            for key of _hands[wind]
              if _hands[wind][key].getId() in tileId
                tiles.push _hands[wind][key]
                delete _hands[wind][key]
            _openMelds[wind].push new openMeld(4, tiles, wind)

        if !isRon && kind != 4
          _isClosed[wind] = false
          _isNagashiManganAvailable[turn] = false

        game.hand.completeReady()
        game.hand.disableOneShot()
        @sendHand(wind)
        @sendOpenMelds()


    @getSequencableTiles = (wind, kind) ->
      seq = []
      if app.util.isWind(wind) && kind < 30
          tiles = []
          for key of _hands[wind]
            tiles[_hands[wind][key].getId()] = _hands[wind].getKind()

          seq['right'] = [tiles.indexOf(kind - 1), tiles.indexOf(kind - 2)]
          seq['center'] = [tiles.indexOf(kind - 1), tiles.indexOf(kind + 1)]
          seq['left'] = [tiles.indexOf(kind + 1), tiles.indexOf(kind + 2)]

          for key of seq
            if -1 in seq[key]
              delete seq[key]
      return seq


    @getDuplicativeTiles = (wind) ->
      dupes = [[], [], [], [], []]
      if app.util.isWind(wind)
        for key of _hands[wind]
          id = _hands[wind][key].getId()
          kind = _hands[wind][key].getKind()
          if kind of dupes[3]
            dupes[4][kind] = dupes[3][kind]
            dupes[4][kind].push id
          else if kind of dupes[2]
            dupes[3][kind] = dupes[2][kind]
            dupes[3][kind].push id
          else if kind of dupes[1]
            dupes[2][kind] = dupes[1][kind]
            dupes[2][kind].push id
          else
            dupes[1][kind] = [id]
      return dupes


    @getOpenTripletsByWind = (wind) ->
      availables = []
      if app.util.isWind(wind)
        for key of _openMelds[wind]
          openMeld = _openMelds[wind][key]
          if openMeld.getKind() == 1
            tile = openMeld.getTiles().first()
            availables[tile.getKind()] = openMeld
      return availables


    @isClosed = (wind) ->
      if app.util.isWind(wind)
        _isClosed[wind]


    @getHandByWind = (wind) ->
      if app.util.isWind(wind)
        _hands[wind]


    @getDiscardsByWind = (wind) ->
      if app.util.isWind(wind)
        _discards[wind]


    @getOpenMeldsByWind = (wind) ->
      if app.util.isWind(wind)
        _openMelds[wind]


    @sendHand = (wind) ->
      if app.util.isWind(wind)
        game.send wind, 'hand', _hands[wind]


    @sendDiscards = () ->
      game.send 'discards', _discards


    @sendOpenMelds = () ->
      game.send 'open_melds', _openMelds
