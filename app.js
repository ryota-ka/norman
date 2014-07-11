(function() {
  var App, Calling, Game, Hand, Messenger, OpenMeld, Player, PlayerHandler, Tile, TileHandler, User, UserRoomHandler, Util, app, css, fs, http, page, script, server, socketio;

  Util = (function() {
    function Util() {}

    Util.isWind = function(val) {
      switch (val) {
        case 0:
        case 1:
        case 2:
        case 3:
          return true;
        default:
          return false;
      }
    };

    Util.shuffle = function(arr) {
      return arr;
    };

    return Util;

  })();

  Tile = (function() {
    var _id, _kind;

    _id = null;

    _kind = null;

    function Tile(id, kind) {
      _id = id;
      _kind = kind;
    }

    Tile.prototype.getId = function() {
      return _id;
    };

    Tile.prototype.getKind = function() {
      return _kind;
    };

    Tile.prototype.setKind = function(kind) {
      return _kind = kind;
    };

    return Tile;

  })();

  Calling = (function() {
    var _choices, _kind, _wind;

    _wind = null;

    _kind = null;

    _choices = [];

    function Calling(wind, kind) {
      _wind = wind;
      _kind = kind;
    }

    Calling.prototype.getWind = function() {
      return _wind;
    };

    Calling.prototype.getKind = function() {
      return _kind;
    };

    Calling.prototype.getChoices = function() {
      return _choices.concat();
    };

    return Calling;

  })();

  OpenMeld = (function() {
    var _from, _kind, _tiles, _wind;

    _kind = null;

    _tiles = null;

    _wind = null;

    _from = null;

    function OpenMeld(kind, tiles, wind, from) {
      if (from == null) {
        from = null;
      }
      _kind = kind;
      _tiles = tiles;
      _wind = wind;
      _from = from;
    }

    OpenMeld.prototype.getKind = function() {
      return _kind;
    };

    OpenMeld.prototype.getTiles = function() {
      return _tiles;
    };

    OpenMeld.prototype.getWind = function() {
      return _wind;
    };

    OpenMeld.prototype.getFrom = function() {
      return _from;
    };

    OpenMeld.prototype.addedQuad = function(addedTile) {
      if (_kind === 1) {
        _kind = 3;
        return _tiles.push(addedTile);
      }
    };

    return OpenMeld;

  })();

  TileHandler = (function() {
    var _, _game, _kinds, _tiles;

    _ = null;

    _game = null;

    _kinds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 31, 31, 31, 31, 33, 33, 33, 33, 35, 35, 35, 35, 37, 37, 37, 37, 41, 41, 41, 41, 43, 43, 43, 43, 45, 45, 45, 45];

    _tiles = [];

    function TileHandler(app, game) {
      _ = app;
      _game = game;
    }

    TileHandler.prototype.init = function() {
      var diceSum, dices, i, j, k, offset, slicedTiles, _i, _j, _k, _l, _m, _supplementalTiles, _wall;
      _kinds = _app.util.shuffle(_kinds);
      dices = _hand.getDices();
      diceSum = dices[0] + dice[1];
      offset = (512 - 32 * diceSum) % 136;
      slicedTiles = _kinds.slice(offset);
      for (i = _i = 0; _i < 136; i = ++_i) {
        _tiles.push(new Tile(i, _kinds[i]));
      }
      _wall = _tiles.slice(0, 122);
      _supplementalTiles = [_tiles[134], _tiles[135], _tiles[132], _tiles[133]];
      _doraIndicators.push(_tiles[130]);
      _underneathDoraIndicators.push(_tiles[131]);
      for (i = _j = 0; _j < 4; i = ++_j) {
        for (j = _k = 0; _k < 4; j = ++_k) {
          for (k = _l = 0; _l < 4; k = ++_l) {
            this.draw(j);
          }
        }
      }
      for (i = _m = 0; _m < 4; i = ++_m) {
        this.draw(i);
        this.sendHand(i);
        _hand.checkWaitedTiles(i);
      }
      this.sendDiscards();
      this.sendOpenMelds();
      _game.sendAll('doraIndicators', _doraIndicators);
      _hand.setTurn(0);
      _hand.setHandStatus(1);
      this.draw(0);
      return {
        draw: function(wind) {
          var tile;
          if (wind === null) {
            wind = (_hand.getTurn() + 1) % 4;
          }
          if (_app.util.isWind(wind)) {
            tile = _wall.unshift();
            _hands[wind].push(tile);
            if (_hand.getTurnStatus() !== null) {
              _hand.completeReady();
              _game.send('drawTile', tile, wind);
              _hand.setTurn(wind);
              _hand.resetOverLooking(wind);
              _hand.setTurnStatus(0);
              _game.sendAll('wallNumber', this.getWallNumber());
              return _hand.whatToDo();
            }
          }
        },
        getHandByWind: function(wind) {
          if (_app.util.isWind(wind)) {

          }
        }
      };
    };

    return TileHandler;

  })();

  Player = (function() {
    var _, _declaredReady, _game, _isReady, _points, _seat, _sessionId;

    _ = null;

    _game = null;

    _sessionId = null;

    _seat = null;

    _points = 25000;

    _declaredReady = false;

    _isReady = false;

    function Player(app, game, sessionId, seat) {
      _ = app;
      _game = game;
      _sessionId = sessionId;
      _seat = seat;
    }

    Player.prototype.init = function() {
      _declaredReady = false;
      return _isReady = false;
    };

    Player.prototype.getSessionId = _sessionId;

    Player.prototype.getUser = function() {
      return _.userRoomHandler.getUserBySessionId(_sessionId);
    };

    Player.prototype.getSeat = function() {
      return _seat;
    };

    Player.prototype.getWind = function() {
      return (3 * (_game.getRound() - 1) + _seat) % 4;
    };

    Player.prototype.getPoints = function() {
      return _points;
    };

    Player.prototype.addPoints = function(amount) {
      var all;
      if (_points + amount < 0) {
        all = _points;
        _points = 0;
        return -all;
      } else {
        _points += diff;
        return diff;
      }
    };

    Player.prototype.declareReady = function() {
      if (!_declaredReady) {
        if (_points >= 1000) {
          _declaredReady = true;
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    Player.prototype.completeReady = function() {
      if (_declaredReady) {
        _isReady = true;
        _points -= 1000;
        return _game.addDeposit();
      }
    };

    Player.prototype.send = function(message, action) {
      return this.getUser.sendToMe(message, action);
    };

    return Player;

  })();

  PlayerHandler = (function() {
    var _, _game, _players;

    _ = null;

    _game = null;

    _players = [];

    function PlayerHandler(app, game) {
      var i, sessionIds, _i;
      _ = app;
      _game = game;
      sessionIds = _.util.shuffle(_.userRoomHandler.getSessionIdsByRoom(_game.getRoom()));
      for (i = _i = 0; _i < 4; i = ++_i) {
        _players.push(new Player(_, _game, sessionIds[i], i));
      }
    }

    PlayerHandler.prototype.init = function() {
      var player, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = _players.length; _i < _len; _i++) {
        player = _players[_i];
        _results.push(player.init());
      }
      return _results;
    };

    PlayerHandler.prototype.getPlayers = function() {
      return _players;
    };

    PlayerHandler.prototype.getPlayerBySessionId = function(sessionId) {
      var player;
      for (player in _players) {
        if (player.getSessionId() === sessionId) {
          return player;
        }
      }
      return false;
    };

    PlayerHandler.prototype.getPlayerBySeat = function(seat) {
      if (_.util.isWind(seat)) {
        return _players[seat];
      }
    };

    PlayerHandler.prototype.getPlayerByWind = function(wind) {
      return this.getPlayerBySeat((wind + _game.getRound() - 1) % 4);
    };

    return PlayerHandler;

  })();

  Hand = (function() {
    var _, _availableCallings, _calling, _dices, _game, _oneShotAvailable, _readyDeclared, _readyDeclaredTurn, _sacredDiscard, _turn, _turnStatus, _waitedTiles, _whatTodo;

    _ = null;

    _game = null;

    _dices = null;

    _turn = 0;

    _turnStatus = null;

    _availableCallings = [[], [], [], []];

    _calling = null;

    _readyDeclared = [false, false, false, false];

    _readyDeclaredTurn = [null, null, null, null];

    _waitedTiles = [[], [], [], []];

    _oneShotAvailable = [false, false, false, false];

    _whatTodo = [[], [], [], []];

    _sacredDiscard = [[false, false, false, false], [false, false, false, false], [false, false, false, false]];

    function Hand(app, userRoomHandler, game) {
      var i, _i;
      _ = app;
      _game = game;
      _dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
      this.tileHandler = new TileHandler(_, _game);
      for (i = _i = 0; _i < 4; i = ++_i) {
        _game.sendByWind(i, 'startHand', {
          wind: i,
          round: _game.getRound(),
          deposits: _game.getDeposits(),
          counters: _game.getCounters(),
          dices: _dices
        });
      }
      _game.getPlayerHandler.init();
    }

    Hand.prototype.start = function() {
      return _tileHandler.init();
    };

    Hand.prototype.getTileHandler = function() {
      return _tileHandler;
    };

    Hand.prototype.getDices = function() {
      return _dices;
    };

    Hand.prototype.getTurn = function() {
      return _turn;
    };

    Hand.prototype.setTurn = function(turn) {
      if (_.util.isWind(turn)) {
        return _turn = turn;
      }
    };

    Hand.prototype.draw = function() {
      this.completeReady();
      return _tileHandler.draw(_turn);
    };

    Hand.prototype.getCalling = function() {
      return _calling;
    };

    Hand.prototype.setCalling = function(wind, kind) {
      if ((_calling == null) || _calling.getKind() === 0) {
        return _calling = new Calling(wind, kind);
      }
    };

    Hand.prototype.clearCalling = function() {
      return _calling = null;
    };

    Hand.prototype.processCalling = function(tilesIds) {
      if (_calling == null) {
        this.completeReady();
        _tileHandler.addOpenMeld(_calling.getWind(), _calling.getKind(), tilesIds);
        _turn = _calling.getWind();
        if (_calling.getKind() <= 1) {
          this.setTurnStatus(3 + _calling.getWind);
          this.whatToDo();
        } else {
          if (_calling.getKind() === 3) {
            this.setTurnStatus(7);
            this.whatToDo;
          } else {
            _tileHandler.drawSupplementalTile();
          }
        }
        return this.clearCalling;
      }
    };

    Hand.prototype.tellToSelectTilesForCalling = function(choices) {
      var data, triplet, _i, _len, _ref;
      if (_calling) {
        _calling.setChoices(choices);
        data = {
          kind: _calling.getKind(),
          choices: choices
        };
        if (_calling.getKind() === 0) {
          data.tile = _tileHandler.getDiscardsByWind(_turn).last().getKind();
        } else if (_calling.getKind() === 3) {
          data.sidewayIndices = [];
          _ref = _tileHandler.getOpenTripletsByWind(_calling.getWind());
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            triplet = _ref[_i];
            data.sidewayIndices.push(3 - (triplet.getFrom() - _calling.getWind() + 4) % 4);
          }
        }
        _game.sendByWind(_calling.getWind(), 'selectTilesForCalling', data);
        this.setTurnStatus(2);
        return this.whatToDo;
      }
    };

    Hand.prototype.exhaustiveDraw = function() {
      var i, isNagashiMangan, isTempai, _i, _results;
      isTempai = [false, false, false, false];
      isNagashiMangan = [];
      _results = [];
      for (i = _i = 0; _i < 4; i = ++_i) {
        _results.push(isNagashiMangan[i] = _tileHandler.isNagashiManganAvailable(i));
      }
      return _results;
    };

    Hand.prototype.abortiveDraw = function(type) {
      return _game.sendAll('abortiveDraw', type);
    };

    return Hand;

  })();

  Game = (function() {
    var _, _counters, _deposits, _room, _round;

    _ = null;

    _room = null;

    _round = 1;

    _deposits = 0;

    _counters = 0;

    function Game(app, room) {
      _ = app;
      _room = room;
      this.playerHandler = new PlayerHandler(_, this);
    }

    Game.prototype.start = function() {
      var dices;
      dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
      this.hand = new Hand(_, this);
      return this.hand.start();
    };

    Game.prototype.getRoom = function() {
      return _room;
    };

    Game.prototype.getHand = function() {
      return this.hand;
    };

    Game.prototype.getRound = function() {
      return _round;
    };

    Game.prototype.getCounters = function() {
      return _counters;
    };

    Game.prototype.addCounter = function() {
      return ++_counters;
    };

    Game.prototype.resetCounters = function() {
      return _counters = 0;
    };

    Game.prototype.getDeposits = function() {
      return _deposits;
    };

    Game.prototype.addDeposit = function() {
      return ++_deposits;
    };

    Game.prototype.resetDeposits = function() {
      _deposits = 0;
      return this.sendAll('deposits', 0);
    };

    Game.prototype.transferDeposits = function(wind) {
      var points;
      if (_deposits !== 0) {
        if (_.util.isWind(wind)) {
          points = this.getDeposits * 1000;
          this.playerHandler.getPlayerByWind(wind).addPoints(points);
          this.resetDeposits;
          return points;
        }
      } else {
        return 0;
      }
    };

    Game.prototype.finishHand = function() {};

    Game.prototype.send = function(message, data, wind) {};

    Game.prototype.sendAll = function(message, data) {};

    return Game;

  })();

  Messenger = (function() {
    var _io;

    _io = null;

    function Messenger(app, io) {
      this.app = app;
      _io = io;
    }

    Messenger.prototype.init = function() {
      return _io.sockets.on('connection', (function(_this) {
        return function(socket) {
          console.log("client " + socket.id + " connected");
          _this.app.userRoomHandler.addUser(socket.id);
          socket.join(0);
          return socket.on('disconnect', function() {
            console.log("client " + socket.id + " disconnected");
            return _this.app.userRoomHandler.removeUser(socket.id);
          });
        };
      })(this));
    };

    Messenger.prototype.send = function(sessionId, message, data) {
      return _io.sockets.connected[sessionId].emit(message, data);
    };

    Messenger.prototype.sendToRoom = function(room, message, data) {
      return _io.sockets.to(room).emit(message, data);
    };

    Messenger.prototype.sendAll = function(message, data) {
      return _io.sockets.emit(message, data);
    };

    return Messenger;

  })();

  User = (function() {
    var _, _name, _room, _sessionId;

    _ = null;

    _sessionId = null;

    _name = '';

    _room = 0;

    function User(app, sessionId) {
      _ = app;
      _sessionId = sessionId;
    }

    User.prototype.getSessionId = function() {
      return _sessionId;
    };

    User.prototype.getName = function() {
      return _name;
    };

    User.prototype.setName = function(name) {
      if (name.trim() !== '') {
        return _name = name;
      }
    };

    User.prototype.getRoom = function() {
      return _name;
    };

    User.prototype.setRoom = function(room) {
      _room = room;
      return this.sendToMe('room', room);
    };

    User.prototype.sendToMe = function(message, data) {
      return _.messenger.send(_sessionId, message, data);
    };

    User.prototype.getGame = function() {
      return _.userRoomHandler.getGameBySessionId(sessionId);
    };

    return User;

  })();

  UserRoomHandler = (function() {
    var _, _games, _rooms, _users;

    _ = null;

    _users = [];

    _games = [];

    _rooms = [0, 102, 103, 105, 201, 202, 203, 205, 301, 302, 303, 305, 401, 402, 403, 405];

    function UserRoomHandler(app) {
      _ = app;
    }

    UserRoomHandler.prototype.addUser = function(sessionId) {
      _users[sessionId] = new User(_, sessionId);
      return _users[sessionId].setRoom(205);
    };

    UserRoomHandler.prototype.removeUser = function(sessionId) {
      return delete _users[sessionId];
    };

    UserRoomHandler.prototype.getUserBySessionId = function(sessionId) {
      if (_users[sessionId] != null) {
        return _users[sessionId];
      } else {
        return void 0;
      }
    };

    UserRoomHandler.prototype.getNameBySessionId = function(clientId) {
      if (_users[sessionId] != null) {
        return _users[sessionId].name;
      } else {
        return void 0;
      }
    };

    UserRoomHandler.prototype.getRoomBySessionId = function(sessionId) {
      if (_users[sessionId] != null) {
        return _users[sessionId].room;
      } else {
        return void 0;
      }
    };

    UserRoomHandler.prototype.getGameBySessionId = function(sessionId) {
      if ((_users[sessionId] != null) && (_games[_users[sessionId].room] != null)) {
        return _games[_users[sessionId].room];
      } else {
        return void 0;
      }
    };

    UserRoomHandler.prototype.getSessionIdsByRoom = function(room) {
      var sessionIds, user, _i, _len;
      sessionIds = [];
      if (_rooms[room] != null) {
        for (_i = 0, _len = _users.length; _i < _len; _i++) {
          user = _users[_i];
          if (_users.room === room) {
            sessionIds.push(_users.room);
          }
        }
        return sessionIds;
      } else {
        return void 0;
      }
    };

    UserRoomHandler.prototype.setRoom = function(sessionId, room) {
      var oldRoom, user;
      if ((_users[sessionId] != null) && _rooms.indexOf(room) && _users[sessionId].room !== room) {
        user = _users[sessionId];
        oldRoom = user.room;
        user.setRoom(room);
        this.checkGameStart(room);
        return this.sendPopulation();
      }
    };

    UserRoomHandler.prototype.setName = function(sessionId, name) {
      var _ref;
      if (((_ref = _users[sessionId]) != null ? _ref.name : void 0) !== name) {
        return _users[sessionId].setName(name);
      }
    };

    UserRoomHandler.prototype.finishGame = function(room) {
      if (_games[room]) {

      }
    };

    UserRoomHandler.prototype.clearGame = function(room) {
      if (_games[room] != null) {

      }
    };

    UserRoomHandler.prototype.sendPopulation = function() {
      var key, population, user, value, _i, _j, _len, _len1, _results;
      population = [];
      for (key = _i = 0, _len = _rooms.length; _i < _len; key = ++_i) {
        value = _rooms[key];
        population[key] = 0;
      }
      _results = [];
      for (_j = 0, _len1 = _users.length; _j < _len1; _j++) {
        user = _users[_j];
        _results.push(population[user.room]++);
      }
      return _results;
    };

    UserRoomHandler.prototype.checkGameStart = function(room) {
      if (room !== 0 && this.getSessionIdsByRoom(room).length === 4) {
        _games[room] = new Game(_, room);
        return _games[room].start();
      }
    };

    return UserRoomHandler;

  })();

  App = (function() {
    function App(io) {
      this.util = new Util();
      this.messenger = new Messenger(this, io);
      this.userRoomHandler = new UserRoomHandler(this);
    }

    App.prototype.init = function() {
      return this.messenger.init();
    };

    return App;

  })();

  http = require('http');

  socketio = require('socket.io');

  fs = require('fs');

  page = fs.readFileSync('./index.html', 'utf-8');

  script = fs.readFileSync('./main.js', 'utf-8');

  css = fs.readFileSync('./css/style.css', 'utf-8');

  server = http.createServer(function(req, res) {
    var contentType, data;
    switch (req.url) {
      case '/':
      case '/index.html':
        data = page;
        contentType = 'text/html';
        break;
      case '/main.js':
        data = script;
        contentType = 'text/javascript';
        break;
      case '/css/style.css':
        data = css;
        contentType = 'text/css';
        break;
      default:
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
        res.end('404: Not Found');
        return;
    }
    res.writeHead(200, {
      'Content-Type': contentType
    });
    return res.end(data);
  });

  server.listen(process.env.PORT || 3000);

  app = new App(socketio.listen(server));

  app.init();

}).call(this);
