class OpenMeld

  constructor: (_kind, _tiles, _wind, _from = null) ->

    @getKind = ->
      _kind


    @getTiles = ->
      _tiles


    @getWind = ->
      _wind


    @getFrom = ->
      _from


    @addedQuad = (addedTile) ->
      if _kind == 1
        _kind = 3
        _tiles.push(addedTile)
