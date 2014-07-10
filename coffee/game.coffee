class Game

  _room = null
  _round = 1
  _deposits = 0
  _counters = 0

  constructor: (app, userRoomHandler, room) ->
    @app = app
    @userRoomHandler = userRoomHandler
    _room = room
    @playerHandler = new PlayerHandler(@app, @userRoomHandler, @)


  start: ->
    dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]
    # @todo tell users game has started
    @hand = new Hand(@app, @userRoomHandler, @)
    @hand.start()


  getRoom: ->
    _room


  getHand: ->
    @hand


  getRound: ->
    _round


  getCounters: ->
    _counters


  addCounter: ->
    ++_counters


  resetCounters: ->
    _counters = 0


  getDeposits: ->
    _deposits


  addDeposit: ->
    ++_deposits


  resetDeposits: ->
    _deposits = 0
    @sendAll('deposits', 0)


  transferDeposits: (wind) ->
    unless _deposits == 0
      if @app.util.isWind(wind)
        points = @getDeposits * 1000
        @playerHandler.getPlayerByWind(wind).addPoints(points)
        @resetDeposits
        return points
    else
      return 0


  finishHand: ->
    return


  send: (message, data, wind)->
    return


  sendAll: (message, data) ->
    return