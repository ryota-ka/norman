class Tile

  _id = null
  _kind = null


  constructor: (id, kind) ->
    _id = id
    _kind = kind


  getId: ->
    _id


  getKind: ->
    _kind


  setKind: (kind) -> # @debug
    _kind = kind
