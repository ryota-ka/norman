class UserRoomHandler

  _ = null
  _users = []
  _games = []
  _rooms = [0, 102, 103, 105, 201, 202, 203, 205, 301, 302, 303, 305, 401, 402, 403, 405]

  constructor: (app) ->
    _ = app


  addUser: (sessionId) ->
    _users[sessionId] = new User(_, sessionId)
    _users[sessionId].setRoom(205)


  removeUser: (sessionId) ->
    delete _users[sessionId]


  getUserBySessionId: (sessionId) ->
    return if _users[sessionId]? then _users[sessionId] else undefined


  getNameBySessionId: (clientId) ->
    return if _users[sessionId]? then _users[sessionId].name else undefined


  getRoomBySessionId: (sessionId) ->
    return if _users[sessionId]? then _users[sessionId].room else undefined


  getGameBySessionId: (sessionId) ->
    return if _users[sessionId]? && _games[_users[sessionId].room]? then _games[_users[sessionId].room] else undefined


  getSessionIdsByRoom: (room) ->
    sessionIds = []
    if _rooms[room]?
      for user in _users
        sessionIds.push _users.room if _users.room == room
      return sessionIds
    else
      return undefined


  setRoom: (sessionId, room) ->
    if _users[sessionId]? && _rooms.indexOf(room) && _users[sessionId].room != room
      user = _users[sessionId]
      oldRoom = user.room
      user.setRoom(room)
      @checkGameStart(room)
      @sendPopulation()
      # @todo send chat log
      # @todo send info to room members: entrance/exit


  setName: (sessionId, name) ->
    if _users[sessionId]?.name != name
      _users[sessionId].setName(name)


  finishGame: (room) ->
    if _games[room]
      # @todo ゲーム終了処理 結果表示など
      return


  clearGame: (room) ->
    if _games[room]?
      return # @todo implement


  sendPopulation: ->
    population = []
    for value, key in _rooms
      population[key] = 0
    for user in _users
      population[user.room]++


  checkGameStart: (room) ->
    if room != 0 && @getSessionIdsByRoom(room).length == 4
      # @todo clear existing game
      _games[room] = new Game(_, room)
      _games[room].start()
