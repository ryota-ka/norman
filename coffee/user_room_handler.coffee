class UserRoomHandler

  _rooms = [0, 102, 103, 105, 201, 202, 203, 205, 301, 302, 303, 305, 401, 402, 403, 405]

  constructor: (app) ->
    @app = app
    @users = []
    @games = []


  addUser: (sessionId) ->
    @users[sessionId] = new User(@app, @, sessionId)


  removeUser: (sessionId) ->
    delete @users[sessionId]


  getUserBySessionId: (sessionId) ->
    return if @users[sessionId]? then @users[sessionId] else undefined


  getNameBySessionId: (clientId) ->
    return if @users[sessionId]? then @users[sessionId].name else undefined


  getRoomBySessionId: (sessionId) ->
    return if @users[sessionId]? then @users[sessionId].room else undefined


  getGameBySessionId: (sessionId) ->
    return if @users[sessionId]? && @games[@users[sessionId].room]? then @games[@users[sessionId].room] else undefined


  getSessionIdsByRoom: (room) ->
    sessionIds = []
    if _rooms[room]?
      for user in @users
        sessionIds.push @users.room if @users.room == room
      return sessionIds
    else
      return undefined


  setRoom: (sessionId, room) ->
    if @users[sessionId]? && _rooms.indexOf(room) && @users[sessionId].room != room
      user = @users[sessionId]
      oldRoom = user.room
      user.setRoom(room)
      @sendPopulation()
      # @todo send chat log
      # @todo send info to room members: entrance/exit


  setRoom: (sessionId, name) ->
    if @users[sessionId]?.name != name
      @users[sessionId].setName(name)


  finishGame: (room) ->
    if @games[room]
      # @todo ゲーム終了処理 結果表示など
      return


  clearGame: (room) ->
    if @games[room]?
      return

  sendPopulation: ->
    population = []
    for value, key in _rooms
      population[key] = 0
    for user in @users
      population[user.room]++

