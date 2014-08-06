class Tile

  constructor: (_id, _kind) ->

    @getId = ->
      _id


    @getKind = ->
      _kind


    @setKind = (kind) -> # @debug
      _kind = kind
