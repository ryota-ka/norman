class UserRoomHandler

  constructor: (app) ->

    _users = []
    _games = []
    _rooms = [0, 102, 103, 105, 201, 202, 203, 205, 301, 302, 303, 305, 401, 402, 403, 405]


    @addUser = (sessionId) ->
      _users[sessionId] = new User(app, sessionId)


    @removeUser = (sessionId) ->
      delete _users[sessionId] if _users[sessionId]?


    @getUserBySessionId = (sessionId) ->
      return if _users[sessionId]? then _users[sessionId] else undefined


    @getNameBySessionId = (clientId) ->
      return if _users[sessionId]? then _users[sessionId].getName() else undefined


    @getRoomBySessionId = (sessionId) ->
      return if _users[sessionId]? then _users[sessionId].getRoom() else undefined


    @getGameBySessionId = (sessionId) ->
      return if _users[sessionId]? && _games[_users[sessionId].room]? then _games[_users[sessionId].getRoom()] else undefined


    @getSessionIdsByRoom = (room) ->
      console.log "checking room #{room}" # @debug
      sessionIds = []
      if room in _rooms
        for key of _users
          console.log '  ' + key # @debug
          console.log '    ' + _users[key].getSessionId() # @debug
          sessionIds.push _users[key].getRoom() if _users[key].getRoom() == room
        return sessionIds
      else
        return undefined


    @setRoom = (sessionId, room) ->
      if _users[sessionId]? && room in _rooms && _users[sessionId].room != room
        user = _users[sessionId]
        oldRoom = user.getRoom()
        user.setRoom(room)
        @check_gamestart(room)
        @sendPopulation()
        # @todo send chat log
        # @todo send info to room members: entrance/exit
        return room
      else
        return false


    @setName = (sessionId, name) ->
      if _users[sessionId]?.name != name
        _users[sessionId].setName(name)


    @finishGame = (room) ->
      if _games[room]
        # @todo ゲーム終了処理 結果表示など
        return


    @clearGame = (room) ->
      if _games[room]?
        return # @todo implement


    @sendPopulation = ->
      population = []
      for value, key in _rooms
        population[key] = 0
      for user in _users
        population[user.room]++


    @check_gamestart = (room) ->
      if room != 0 && @getSessionIdsByRoom(room)?.length == 4
        # @todo clear existing game
        _games[room] = new Game(app, room)
        _games[room].start()
