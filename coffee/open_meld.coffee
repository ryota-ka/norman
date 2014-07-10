class OpenMeld

  _kind = null
  _tiles = null
  _wind = null
  _from = null

  constructor: (kind, tiles, wind, from = null) ->
    _kind = kind
    _tiles = tiles
    _wind = wind
    _from = from


  getKind: ->
    _kind


  getTiles: ->
    _tiles


  getWind: ->
    _wind


  getFrom: ->
    _from


  addedQuad: (addedTile) ->
    if _kind == 1
      _kind = 3
      _tiles.push(addedTile)

