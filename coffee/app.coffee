class App

  constructor: (io) ->
    @util = new Util()
    @messenger = new Messenger(@, io)
    @userRoomHandler = new UserRoomHandler()


  init: ->
    @messenger.init()
