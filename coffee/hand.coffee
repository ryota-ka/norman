class Hand

  constructor: (app, game) ->
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
    _sacredDiscard = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]]
    _isClosed = [true, true, true, true]

    _dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]

    @tileHandler = new TileHandler(app, game)

    for i in [0...4]
      game.send i, 'startHand',
        wind: i
        round: game.getRound()
        deposits: game.getDeposits()
        counters: game.getCounters()
        dices: _dices

    game.playerHandler.init()


    @start = ->
      @tileHandler.init()


    @getDices = ->
      _dices


    @getTurn = ->
      _turn


    @setTurn = (turn) ->
      _turn = turn if app.util.isWind(turn)


    @getTurnStatus = ->
      _turnStatus


    @setTurnStatus = (status) ->
      _turnStatus = status


    @draw = ->
      @completeReady()
      _tileHandler.draw(_turn)


    @isReady = (wind) ->
      if app.util.isWind(wind)
        return _readyDeclaredTurn[wind] != null


    @declareReady = (wind) ->
      if game.playerHandler.getPlayerByWind(wind)?.declareReady()
        _readyDeclared[wind] = true
        game.sendAll 'declared ready', {wind: wind}
        @setTurnStatus(5)
        @whatToDo


    @completeReady = ->
      for i in [0...4]
        if !_sacredDiscard[i][1] && _sacredDiscard[i][3]
          if @isReady(i)
            _sacredDiscard[i][1] = true
          else
            _sacredDiscard[i][2] = true
      for i in [0...4]
        if _readyDeclared[i]
          game.playerHandler.getPlayerByWind(i).completeReady()
          game.sendAll 'completed_ready', {wind: i}
          _readyDeclaredTurn = @tileHandler.getDiscardsByWind(i).length - 1
          _readyDeclared[i] = false
          _oneShotAvailable = true
          if null in _readyDeclaredTurn
            @abotriveDraw(2)
            return
          _waitedTiles[i] = []


    @getReadyDeclaredTurn = (wind) ->
      if app.util.isWind(wind)
        _readyDeclaredTurn[wind]


    @checkOverlooking = (tile) ->
      for i in [0...4]
        if i != _turn && tile in _waitedTiles[i]
          _sacredDiscard[i][3] = true


    @resetOverlooking = (wind) ->
      if app.util.isWind(wind)
        _sacredDiscard[wind][2] = false
        _sacredDiscard[wind][3] = false


    @isSacredDiscard = (wind) ->
      if app.util.isWind(wind)
        return _sacredDiscard[wind][0] || _sacredDiscard[wind][1] || _sacredDiscard[wind][2]


    @checkWaitedTiles = (wind) ->
        if app.util.isWind(wind) && !@isReady[wind]
          return


    @getCalling = ->
      _calling


    @setCalling = (wind, kind) ->
      if !_calling? || _calling.getKind() == 0 # @fix ちゃんと動かないかも
        _calling = new Calling(wind, kind)


    @clearCalling = ->
      _calling = null


    @processCalling = (tilesIds) ->
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


    @tellToSelectTilesForCalling = (choices) ->
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
        game.send(_calling.getWind(), 'selectTilesForCalling', data)
        @setTurnStatus(2)
        @whatToDo


    @isClosed = (wind) ->
      if app.util.isWind(wind)
        _isClosed[wind]


    @exhaustiveDraw = ->
      isTempai = [false, false, false, false]
      isNagashiMangan = []

      for i in [0...4]
        isNagashiMangan[i] = _tileHandler.isNagashiManganAvailable(i)

      # @todo implement nagashi mangan
      #
      #
    @abortiveDraw = (type) ->
      game.sendAll('abortiveDraw', type)
      # @todo finish game
      #

    @whatToDo = ->
      _availableCallings = [[], [], [], []]

      if _turnStatus == null
        whatToDo = [[], [], [], []]

      else if _turnStatus == 0 || _turnStatus == 3 || _turnStatus == 4
        whatToDo = [[], [], [], []]
        if _turnStatus == 0
          whatToDo[_turn].push 'win_by_draw'
          if !@isReady[_turn]
            whatToDo[_turn].push 'discard'

            if game.playerHandler.getPlayerByWind(_turn).getPoints() >= 1000 && _isClosed[_turn] && @tileHandler.getWallNumber() >= 4
              whatToDo[_turn].push 'declareReady'

            if @tileHandler.getOpenMeldsByWind(0).length == 0 & @tileHandler.getOpenMeldsByWind(1).length == 0 && @tileHandler.getOpenMeldsByWind(2).length == 0 && @tileHandler.getOpenMeldsByWind(3).length == 0 && @tileHandler.getDiscardsByWind(3).length == 0
              terminalHonorKinds = [1, 9, 11, 19, 21, 29, 31, 33, 35, 37, 41, 43, 45]
              hand = @tileHandler.getHandByWind(_turn)
              for key of hand
                if (index = terminalHonorKinds.indexOf(hand[key])) != -1
                  delete terminalHonorKinds[index]

              if terminalHonorKinds.count() <= 4
                whatToDo[_turn].push = 'kyushukyuhai'
          else
            whatToDo[_turn].push 'discardOnlyDrawn'
        else
          whatToDo[_turn].push 'discard'

        if @tileHandler.getWallNumber() > 0
          handTiles = @tileHandler.getHandByWind(_turn)

          # 加槓
          if !@isReady[_turn]
            openTripletKinds = @tileHandler.getOpenTripletsByWind(_turn).keys()
            availableKinds = []
            for key of handTiles
              if handTiles[key].getKind() in openTripletKinds && handTiles[key].getKind() in availableKinds
                availableKinds.push handTiles[key].getKind()
            if _turnStatus == 4
              availableKinds = availableKinds.diff([openTripletKinds.last()])
            if availableKinds.count() != 0
              _availableCallings[_turn][3] = availableKinds
              whatToDo[_turn].push 'kakan'
          # 加槓

          # 暗槓
          quads = @tileHandler.getDuplicativeTiles(_turn)[4]
          if !quads.empty()
            if @isReady(_turn)
              availableClosedQuad = []
              hand = []
              for key of handTiles
                hand.push handTiles[key].getKind()
              for kind in quads.keys()
                temp = hand.diff([kind, kind, kind, kind])
                newWaitedTiles = @tileHandler.checkTempai(temp, true)
                if newWaitedTiles == _waitedTiles[_turn]
                  availableClosedQuad.push = kind
              if !availableClosedQuad.empty()
                _availableCallings[_turn][4] = availableClosedQuad
                whatToDo[_turn].push 'ankan'
            else
              _availableCallings[_turn][4] = quads.keys()
              whatToDo[_turn].push 'ankan'
          # 暗槓

      else if _turnStatus == 1
        whatToDo = ['win_by_discard', 'win_by_discard', 'win_by_discard', 'win_by_discard']

        if @tileHandler.getWallNumber > 0
          discards = @tileHandler.getDiscardsByWind(_turn)
          lastDiscard = discards.last()

          for i in [0...4]
            if !@isReady[i]
              duplicates = @tileHandler.getDuplicativeTiles(i)
              if i != _turn && duplicates[3][lastDiscard]?
                whatToDo[i].push 'daiminkan'
                _availableCallings[i][2] = lastDiscard.getKind()
                whatToDo[i].push 'pon'
                _availableCallings[i][1] = lastDiscard.getKind()
              else if i != turn && $duplicates[2][lastDiscard.getKind()]?
                whatToDo[i].push 'pon'
                _availableCallings[i][1] = lastDiscard.getKind()

          sequencableTiles = @tileHandler.getSequencableTiles((_turn + 1) % 4, lastDiscard.getKind())
          if !@isReady[(_turn + 1) % 4] && !sequencableTiles.empty()
            _availableCallings[(_turn + 1) % 4][0] = sequencableTiles
            whatToDo[(_turn + 1) % 4].push 'chi'

          whatToDo[(_turn + 1) % 4].push 'draw'
        whatToDo[_turn] = []

      else if _turnStatus == 2
        whatToDo = [[], [], [], []]
        whatToDo[_turn].push 'selectTilesForCalling'
        whatToDo[_turn].push 'cancelCalling'

      else if _turnStatus == 5
        whatToDo = [[], [], [], []]
        whatToDo[_turn].push 'discard'

      else if _turnStatus == 6
        whatToDo = [[], [], [], []]
        for i in [0...4]
          if _winByDiscardDeclared[i] == null
            whatToDo[i].push 'win_by_discard'

      else if _turnStatus == 7
        for i in [0...4]
          if !_notChankanDeclared[i]
            whatToDo[i] = ['win_by_discard']
          else
            whatToDo[i] = []

      for i in [0...4]
        game.send i, 'what_to_do', {whatToDo: whatToDo[i], availableCallings: _availableCallings[i]}
