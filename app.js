(function() {
  var App, Calling, Game, Hand, Messenger, OpenMeld, Player, PlayerHandler, Tile, TileHandler, User, UserRoomHandler, Util, app, css, fs, http, page, script, server, socketio,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Object.defineProperty(Array.prototype, 'diff', {
    value: function(arr) {
      return this.filter(function(i) {
        return __indexOf.call(arr, i) < 0;
      });
    }
  });

  Object.defineProperty(Array.prototype, 'keys', {
    value: function() {
      return Object.keys(this);
    }
  });

  Object.defineProperty(Array.prototype, 'count', {
    value: function() {
      return this.keys().length;
    }
  });

  Object.defineProperty(Object.prototype, 'empty', {
    value: function() {
      return this.count() === 0;
    }
  });

  Object.defineProperty(Array.prototype, 'first', {
    value: function() {
      var key;
      for (key in this) {
        return this[key];
      }
    }
  });

  Object.defineProperty(Array.prototype, 'last', {
    value: function() {
      var arr, keys;
      keys = this.keys();
      arr = this.clean();
      return arr[keys[keys.length] - 1];
    }
  });

  Object.defineProperty(Array.prototype, 'clean', {
    value: function() {
      var arr, elm, _i, _len;
      arr = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        elm = this[_i];
        if (elm != null) {
          arr.push(elm);
        }
      }
      return arr;
    }
  });

  Object.defineProperty(Array.prototype, 'shuffle', {
    value: function() {
      var i, j, t;
      i = this.count();
      while (i) {
        j = Math.floor(Math.random() * i);
        t = this[--i];
        this[i] = this[j];
        this[j] = t;
      }
      return this;
    }
  });

  Util = (function() {
    function Util() {}

    Util.prototype.isWind = function(val) {
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

    return Util;

  })();

  Tile = (function() {
    function Tile(_id, _kind) {
      this.getId = function() {
        return _id;
      };
      this.getKind = function() {
        return _kind;
      };
      this.setKind = function(kind) {
        return _kind = kind;
      };
    }

    return Tile;

  })();

  Calling = (function() {
    function Calling(_wind, _kind) {
      var _choices;
      _choices = [];
      this.getWind = function() {
        return _wind;
      };
      this.getKind = function() {
        return _kind;
      };
      this.getChoices = function() {
        return _choices.concat();
      };
    }

    return Calling;

  })();

  OpenMeld = (function() {
    function OpenMeld(_kind, _tiles, _wind, _from) {
      if (_from == null) {
        _from = null;
      }
      this.getKind = function() {
        return _kind;
      };
      this.getTiles = function() {
        return _tiles;
      };
      this.getWind = function() {
        return _wind;
      };
      this.getFrom = function() {
        return _from;
      };
      this.addedQuad = function(addedTile) {
        if (_kind === 1) {
          _kind = 3;
          return _tiles.push(addedTile);
        }
      };
    }

    return OpenMeld;

  })();

  TileHandler = (function() {
    function TileHandler(app, game) {
      var _discards, _doraIndicators, _hands, _kinds, _openMelds, _supplementalTiles, _tiles, _underneathDoraIndicators, _wall;
      _kinds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 31, 31, 31, 31, 33, 33, 33, 33, 35, 35, 35, 35, 37, 37, 37, 37, 41, 41, 41, 41, 43, 43, 43, 43, 45, 45, 45, 45].shuffle();
      _tiles = [];
      _wall = [];
      _hands = [[], [], [], []];
      _discards = [[], [], [], []];
      _openMelds = [[], [], [], []];
      _supplementalTiles = [];
      _doraIndicators = [];
      _underneathDoraIndicators = [];
      this.init = function() {
        var diceSum, dices, i, j, k, offset, slicedTiles, _i, _j, _k, _l, _m;
        dices = game.hand.getDices();
        diceSum = dices[0] + dices[1];
        offset = (512 - 32 * diceSum) % 136;
        slicedTiles = _kinds.slice(offset);
        for (i = _i = 0; _i < 136; i = ++_i) {
          _tiles.push(new Tile(i, _kinds[i]));
        }
        _wall = _tiles.slice(0, 122);
        _supplementalTiles = [_tiles[134], _tiles[135], _tiles[132], _tiles[133]];
        _doraIndicators = [_tiles[130]];
        _underneathDoraIndicators = [_tiles[131]];
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
        }
        this.sendDiscards();
        this.sendOpenMelds();
        game.sendAll('doraIndicators', _doraIndicators);
        game.hand.setTurn(0);
        game.hand.setTurnStatus(1);
        return this.draw(0);
      };
      this.draw = function(wind) {
        var tile;
        if (wind === null) {
          wind = (game.hand.getTurn() + 1) % 4;
        }
        if (app.util.isWind(wind)) {
          tile = _wall.shift();
          _hands[wind].push(tile);
          if (game.hand.getTurnStatus() !== null) {
            game.hand.completeReady();
            game.send('drawTile', tile, wind);
            game.hand.setTurn(wind);
            game.hand.resetOverlooking(wind);
            game.hand.setTurnStatus(0);
            game.sendAll('wallNumber', this.getWallNumber());
            return game.hand.whatToDo();
          }
        }
      };
      this.getWallNumber = function() {
        return _wall.count();
      };
      this.addOpenMeld = function(wind, kind, tileIds, isRon) {
        var addedTile, key, key_, tileId, tiles, turn, _ref, _ref1;
        if (isRon == null) {
          isRon = false;
        }
        if (app.util.isWind(wind)) {
          tiles = [];
          turn = game.hand.getTurn();
          switch (kind) {
            case 0:
            case 1:
            case 2:
              tiles.push(_discards[turn].pop());
              for (key in _hands[wind]) {
                if (_ref = _hands[wind][key].getId(), __indexOf.call(tileIds, _ref) >= 0) {
                  tiles.push(_hands[wind][key]);
                  delete _hands[wind][key];
                }
              }
              _openMelds[wind].push(new OpenMeld(kind, tiles, wind, turn));
              this.sendDiscards;
              break;
            case 3:
              tileId = tileIds.first();
              for (key in _hands[wind]) {
                if (_hands[wind][key].getId() === tileId) {
                  addedTile = _hands[wind][key];
                  for (key_ in _openMelds[wind]) {
                    if (_openMelds[wind][key_].getKind() === 1 && _openMelds[wind][key_].getTiles().first().getKind() === addedTile.getKind()) {
                      _openMelds[wind][key_].addedQuad(addedTile);
                      delete _hands[wind][key];
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            case 4:
              for (key in _hands[wind]) {
                if (_ref1 = _hands[wind][key].getId(), __indexOf.call(tileId, _ref1) >= 0) {
                  tiles.push(_hands[wind][key]);
                  delete _hands[wind][key];
                }
              }
              _openMelds[wind].push(new openMeld(4, tiles, wind));
          }
          if (!isRon && kind !== 4) {
            _isClosed[wind] = false;
            _isNagashiManganAvailable[turn] = false;
          }
          game.hand.completeReady();
          game.hand.disableOneShot();
          this.sendHand(wind);
          return this.sendOpenMelds();
        }
      };
      this.getSequencableTiles = function(wind, kind) {
        var key, seq, tiles;
        seq = [];
        if (app.util.isWind(wind) && kind < 30) {
          tiles = [];
          for (key in _hands[wind]) {
            tiles[_hands[wind][key].getId()] = _hands[wind].getKind();
          }
          seq['right'] = [tiles.indexOf(kind - 1), tiles.indexOf(kind - 2)];
          seq['center'] = [tiles.indexOf(kind - 1), tiles.indexOf(kind + 1)];
          seq['left'] = [tiles.indexOf(kind + 1), tiles.indexOf(kind + 2)];
          for (key in seq) {
            if (__indexOf.call(seq[key], -1) >= 0) {
              delete seq[key];
            }
          }
        }
        return seq;
      };
      this.getDuplicativeTiles = function(wind) {
        var dupes, id, key, kind;
        dupes = [[], [], [], [], []];
        if (app.util.isWind(wind)) {
          for (key in _hands[wind]) {
            id = _hands[wind][key].getId();
            kind = _hands[wind][key].getKind();
            if (kind in dupes[3]) {
              dupes[4][kind] = dupes[3][kind];
              dupes[4][kind].push(id);
            } else if (kind in dupes[2]) {
              dupes[3][kind] = dupes[2][kind];
              dupes[3][kind].push(id);
            } else if (kind in dupes[1]) {
              dupes[2][kind] = dupes[1][kind];
              dupes[2][kind].push(id);
            } else {
              dupes[1][kind] = [id];
            }
          }
        }
        return dupes;
      };
      this.getOpenTripletsByWind = function(wind) {
        var availables, key, openMeld, tile;
        availables = [];
        if (app.util.isWind(wind)) {
          for (key in _openMelds[wind]) {
            openMeld = _openMelds[wind][key];
            if (openMeld.getKind() === 1) {
              tile = openMeld.getTiles().first();
              availables[tile.getKind()] = openMeld;
            }
          }
        }
        return availables;
      };
      this.isClosed = function(wind) {
        if (app.util.isWind(wind)) {
          return _isClosed[wind];
        }
      };
      this.getHandByWind = function(wind) {
        if (app.util.isWind(wind)) {
          return _hands[wind];
        }
      };
      this.getDiscardsByWind = function(wind) {
        if (app.util.isWind(wind)) {
          return _discards[wind];
        }
      };
      this.getOpenMeldsByWind = function(wind) {
        if (app.util.isWind(wind)) {
          return _openMelds[wind];
        }
      };
      this.sendHand = function(wind) {
        if (app.util.isWind(wind)) {
          return game.send(wind, 'hand', _hands[wind]);
        }
      };
      this.sendDiscards = function() {
        return game.send('discards', _discards);
      };
      this.sendOpenMelds = function() {
        return game.send('open_melds', _openMelds);
      };
    }

    return TileHandler;

  })();

  Player = (function() {
    function Player(app, game, _sessionId, _seat) {
      var _declaredReady, _isReady, _points;
      _points = 25000;
      _declaredReady = false;
      _isReady = false;
      this.init = function() {
        _declaredReady = false;
        return _isReady = false;
      };
      this.getSessionId = function() {
        return _sessionId;
      };
      this.getUser = function() {
        return app.userRoomHandler.getUserBySessionId(_sessionId);
      };
      this.getSeat = function() {
        return _seat;
      };
      this.getWind = function() {
        return (3 * (game.getRound() - 1) + _seat) % 4;
      };
      this.getPoints = function() {
        return _points;
      };
      this.addPoints = function(amount) {
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
      this.declareReady = function() {
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
      this.completeReady = function() {
        if (_declaredReady) {
          _isReady = true;
          _points -= 1000;
          return game.addDeposit();
        }
      };
      this.send = function(message, action) {
        return this.getUser.sendToMe(message, action);
      };
    }

    return Player;

  })();

  PlayerHandler = (function() {
    function PlayerHandler(app, game, _sessionIds) {
      var i, _i, _players;
      _players = [];
      for (i = _i = 0; _i < 4; i = ++_i) {
        _players.push(new Player(app, game, _sessionIds[i], i));
      }
      this.init = function() {
        var player, _j, _len, _results;
        _results = [];
        for (_j = 0, _len = _players.length; _j < _len; _j++) {
          player = _players[_j];
          _results.push(player.init());
        }
        return _results;
      };
      this.getPlayers = function() {
        return _players;
      };
      this.getPlayerBySessionId = function(sessionId) {
        var player;
        for (player in _players) {
          if (player.getSessionId() === sessionId) {
            return player;
          }
        }
        return false;
      };
      this.getPlayerBySeat = function(seat) {
        if (app.util.isWind(seat)) {
          return _players[seat];
        }
      };
      this.getPlayerByWind = function(wind) {
        return this.getPlayerBySeat((wind + game.getRound() - 1) % 4);
      };
    }

    return PlayerHandler;

  })();

  Hand = (function() {
    function Hand(app, game) {
      var i, _availableCallings, _calling, _dices, _i, _isClosed, _oneShotAvailable, _readyDeclared, _readyDeclaredTurn, _sacredDiscard, _turn, _turnStatus, _waitedTiles, _whatTodo;
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
      _sacredDiscard = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]];
      _isClosed = [true, true, true, true];
      _dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
      this.tileHandler = new TileHandler(app, game);
      for (i = _i = 0; _i < 4; i = ++_i) {
        game.send(i, 'startHand', {
          wind: i,
          round: game.getRound(),
          deposits: game.getDeposits(),
          counters: game.getCounters(),
          dices: _dices
        });
      }
      game.playerHandler.init();
      this.start = function() {
        return this.tileHandler.init();
      };
      this.getDices = function() {
        return _dices;
      };
      this.getTurn = function() {
        return _turn;
      };
      this.setTurn = function(turn) {
        if (app.util.isWind(turn)) {
          return _turn = turn;
        }
      };
      this.getTurnStatus = function() {
        return _turnStatus;
      };
      this.setTurnStatus = function(status) {
        return _turnStatus = status;
      };
      this.draw = function() {
        this.completeReady();
        return _tileHandler.draw(_turn);
      };
      this.isReady = function(wind) {
        if (app.util.isWind(wind)) {
          return _readyDeclaredTurn[wind] !== null;
        }
      };
      this.declareReady = function(wind) {
        var _ref;
        if ((_ref = game.playerHandler.getPlayerByWind(wind)) != null ? _ref.declareReady() : void 0) {
          _readyDeclared[wind] = true;
          game.sendAll('declared ready', {
            wind: wind
          });
          this.setTurnStatus(5);
          return this.whatToDo;
        }
      };
      this.completeReady = function() {
        var _j, _k;
        for (i = _j = 0; _j < 4; i = ++_j) {
          if (!_sacredDiscard[i][1] && _sacredDiscard[i][3]) {
            if (this.isReady(i)) {
              _sacredDiscard[i][1] = true;
            } else {
              _sacredDiscard[i][2] = true;
            }
          }
        }
        for (i = _k = 0; _k < 4; i = ++_k) {
          if (_readyDeclared[i]) {
            game.playerHandler.getPlayerByWind(i).completeReady();
            game.sendAll('completed_ready', {
              wind: i
            });
            _readyDeclaredTurn = this.tileHandler.getDiscardsByWind(i).length - 1;
            _readyDeclared[i] = false;
            _oneShotAvailable = true;
            if (__indexOf.call(_readyDeclaredTurn, null) >= 0) {
              this.abotriveDraw(2);
              return;
            }
            _waitedTiles[i] = [];
          }
        }
      };
      this.getReadyDeclaredTurn = function(wind) {
        if (app.util.isWind(wind)) {
          return _readyDeclaredTurn[wind];
        }
      };
      this.checkOverlooking = function(tile) {
        var _j, _results;
        _results = [];
        for (i = _j = 0; _j < 4; i = ++_j) {
          if (i !== _turn && __indexOf.call(_waitedTiles[i], tile) >= 0) {
            _results.push(_sacredDiscard[i][3] = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      this.resetOverlooking = function(wind) {
        if (app.util.isWind(wind)) {
          _sacredDiscard[wind][2] = false;
          return _sacredDiscard[wind][3] = false;
        }
      };
      this.isSacredDiscard = function(wind) {
        if (app.util.isWind(wind)) {
          return _sacredDiscard[wind][0] || _sacredDiscard[wind][1] || _sacredDiscard[wind][2];
        }
      };
      this.checkWaitedTiles = function(wind) {
        if (app.util.isWind(wind) && !this.isReady[wind]) {

        }
      };
      this.getCalling = function() {
        return _calling;
      };
      this.setCalling = function(wind, kind) {
        if ((_calling == null) || _calling.getKind() === 0) {
          return _calling = new Calling(wind, kind);
        }
      };
      this.clearCalling = function() {
        return _calling = null;
      };
      this.processCalling = function(tilesIds) {
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
      this.tellToSelectTilesForCalling = function(choices) {
        var data, triplet, _j, _len, _ref;
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
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
              triplet = _ref[_j];
              data.sidewayIndices.push(3 - (triplet.getFrom() - _calling.getWind() + 4) % 4);
            }
          }
          game.send(_calling.getWind(), 'selectTilesForCalling', data);
          this.setTurnStatus(2);
          return this.whatToDo;
        }
      };
      this.isClosed = function(wind) {
        if (app.util.isWind(wind)) {
          return _isClosed[wind];
        }
      };
      this.exhaustiveDraw = function() {
        var isNagashiMangan, isTempai, _j, _results;
        isTempai = [false, false, false, false];
        isNagashiMangan = [];
        _results = [];
        for (i = _j = 0; _j < 4; i = ++_j) {
          _results.push(isNagashiMangan[i] = _tileHandler.isNagashiManganAvailable(i));
        }
        return _results;
      };
      this.abortiveDraw = function(type) {
        return game.sendAll('abortiveDraw', type);
      };
      this.whatToDo = function() {
        var availableClosedQuad, availableKinds, discards, duplicates, hand, handTiles, index, key, kind, lastDiscard, newWaitedTiles, openTripletKinds, quads, sequencableTiles, temp, terminalHonorKinds, whatToDo, _j, _k, _l, _len, _m, _n, _ref, _ref1, _ref2, _results;
        _availableCallings = [[], [], [], []];
        if (_turnStatus === null) {
          whatToDo = [[], [], [], []];
        } else if (_turnStatus === 0 || _turnStatus === 3 || _turnStatus === 4) {
          whatToDo = [[], [], [], []];
          if (_turnStatus === 0) {
            whatToDo[_turn].push('win_by_draw');
            if (!this.isReady[_turn]) {
              whatToDo[_turn].push('discard');
              if (game.playerHandler.getPlayerByWind(_turn).getPoints() >= 1000 && _isClosed[_turn] && this.tileHandler.getWallNumber() >= 4) {
                whatToDo[_turn].push('declareReady');
              }
              if (this.tileHandler.getOpenMeldsByWind(0).length === 0 & this.tileHandler.getOpenMeldsByWind(1).length === 0 && this.tileHandler.getOpenMeldsByWind(2).length === 0 && this.tileHandler.getOpenMeldsByWind(3).length === 0 && this.tileHandler.getDiscardsByWind(3).length === 0) {
                terminalHonorKinds = [1, 9, 11, 19, 21, 29, 31, 33, 35, 37, 41, 43, 45];
                hand = this.tileHandler.getHandByWind(_turn);
                for (key in hand) {
                  if ((index = terminalHonorKinds.indexOf(hand[key])) !== -1) {
                    delete terminalHonorKinds[index];
                  }
                }
                if (terminalHonorKinds.count() <= 4) {
                  whatToDo[_turn].push = 'kyushukyuhai';
                }
              }
            } else {
              whatToDo[_turn].push('discardOnlyDrawn');
            }
          } else {
            whatToDo[_turn].push('discard');
          }
          if (this.tileHandler.getWallNumber() > 0) {
            handTiles = this.tileHandler.getHandByWind(_turn);
            if (!this.isReady[_turn]) {
              openTripletKinds = this.tileHandler.getOpenTripletsByWind(_turn).keys();
              availableKinds = [];
              for (key in handTiles) {
                if ((_ref = handTiles[key].getKind(), __indexOf.call(openTripletKinds, _ref) >= 0) && (_ref1 = handTiles[key].getKind(), __indexOf.call(availableKinds, _ref1) >= 0)) {
                  availableKinds.push(handTiles[key].getKind());
                }
              }
              if (_turnStatus === 4) {
                availableKinds = availableKinds.diff([openTripletKinds.last()]);
              }
              if (availableKinds.count() !== 0) {
                _availableCallings[_turn][3] = availableKinds;
                whatToDo[_turn].push('kakan');
              }
            }
            quads = this.tileHandler.getDuplicativeTiles(_turn)[4];
            if (!quads.empty()) {
              if (this.isReady(_turn)) {
                availableClosedQuad = [];
                hand = [];
                for (key in handTiles) {
                  hand.push(handTiles[key].getKind());
                }
                _ref2 = quads.keys();
                for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
                  kind = _ref2[_j];
                  temp = hand.diff([kind, kind, kind, kind]);
                  newWaitedTiles = this.tileHandler.checkTempai(temp, true);
                  if (newWaitedTiles === _waitedTiles[_turn]) {
                    availableClosedQuad.push = kind;
                  }
                }
                if (!availableClosedQuad.empty()) {
                  _availableCallings[_turn][4] = availableClosedQuad;
                  whatToDo[_turn].push('ankan');
                }
              } else {
                _availableCallings[_turn][4] = quads.keys();
                whatToDo[_turn].push('ankan');
              }
            }
          }
        } else if (_turnStatus === 1) {
          whatToDo = ['win_by_discard', 'win_by_discard', 'win_by_discard', 'win_by_discard'];
          if (this.tileHandler.getWallNumber > 0) {
            discards = this.tileHandler.getDiscardsByWind(_turn);
            lastDiscard = discards.last();
            for (i = _k = 0; _k < 4; i = ++_k) {
              if (!this.isReady[i]) {
                duplicates = this.tileHandler.getDuplicativeTiles(i);
                if (i !== _turn && (duplicates[3][lastDiscard] != null)) {
                  whatToDo[i].push('daiminkan');
                  _availableCallings[i][2] = lastDiscard.getKind();
                  whatToDo[i].push('pon');
                  _availableCallings[i][1] = lastDiscard.getKind();
                } else if (i !== turn && ($duplicates[2][lastDiscard.getKind()] != null)) {
                  whatToDo[i].push('pon');
                  _availableCallings[i][1] = lastDiscard.getKind();
                }
              }
            }
            sequencableTiles = this.tileHandler.getSequencableTiles((_turn + 1) % 4, lastDiscard.getKind());
            if (!this.isReady[(_turn + 1) % 4] && !sequencableTiles.empty()) {
              _availableCallings[(_turn + 1) % 4][0] = sequencableTiles;
              whatToDo[(_turn + 1) % 4].push('chi');
            }
            whatToDo[(_turn + 1) % 4].push('draw');
          }
          whatToDo[_turn] = [];
        } else if (_turnStatus === 2) {
          whatToDo = [[], [], [], []];
          whatToDo[_turn].push('selectTilesForCalling');
          whatToDo[_turn].push('cancelCalling');
        } else if (_turnStatus === 5) {
          whatToDo = [[], [], [], []];
          whatToDo[_turn].push('discard');
        } else if (_turnStatus === 6) {
          whatToDo = [[], [], [], []];
          for (i = _l = 0; _l < 4; i = ++_l) {
            if (_winByDiscardDeclared[i] === null) {
              whatToDo[i].push('win_by_discard');
            }
          }
        } else if (_turnStatus === 7) {
          for (i = _m = 0; _m < 4; i = ++_m) {
            if (!_notChankanDeclared[i]) {
              whatToDo[i] = ['win_by_discard'];
            } else {
              whatToDo[i] = [];
            }
          }
        }
        _results = [];
        for (i = _n = 0; _n < 4; i = ++_n) {
          _results.push(game.send(i, 'what_to_do', {
            whatToDo: whatToDo[i],
            availableCallings: _availableCallings[i]
          }));
        }
        return _results;
      };
    }

    return Hand;

  })();

  Game = (function() {
    function Game(app, _room) {
      var _counters, _deposits, _round;
      _round = 1;
      _deposits = 0;
      _counters = 0;
      this.playerHandler = new PlayerHandler(app, this, app.userRoomHandler.getSessionIdsByRoom(_room));
      this.start = function() {
        var dices;
        dices = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
        this.hand = new Hand(app, this);
        return this.hand.start();
      };
      this.getRoom = function() {
        return _room;
      };
      this.getHand = function() {
        return this.hand;
      };
      this.getRound = function() {
        return _round;
      };
      this.getCounters = function() {
        return _counters;
      };
      this.addCounter = function() {
        return ++_counters;
      };
      this.resetCounters = function() {
        return _counters = 0;
      };
      this.getDeposits = function() {
        return _deposits;
      };
      this.addDeposit = function() {
        return ++_deposits;
      };
      this.resetDeposits = function() {
        _deposits = 0;
        return this.sendAll('deposits', 0);
      };
      this.transferDeposits = function(wind) {
        var points;
        if (_deposits !== 0) {
          if (app.util.isWind(wind)) {
            points = this.getDeposits * 1000;
            this.playerHandler.getPlayerByWind(wind).addPoints(points);
            this.resetDeposits;
            return points;
          }
        } else {
          return 0;
        }
      };
      this.finishHand = function() {};
      this.send = function(message, data, wind) {};
      this.sendAll = function(message, data) {};
    }

    return Game;

  })();

  Messenger = (function() {
    function Messenger(app, io) {
      var _users;
      _users = [];
      this.init = function() {
        return io.sockets.on('connection', (function(_this) {
          return function(socket) {
            console.log("client " + socket.id + " connected");
            app.userRoomHandler.addUser(socket.id);
            _users[socket.id] = app.userRoomHandler.getUserBySessionId(socket.id);
            socket.join(0);
            _this.sendToRoom(0, 'msg', 0);
            _this.sendToRoom(205, 'msg', 205);
            socket.on('disconnect', function() {
              console.log("client " + socket.id + " disconnected");
              app.userRoomHandler.removeUser(socket.id);
              return delete _users[socket.id];
            });
            socket.on('room', function(data) {
              var oldRoom, room, user;
              user = _users[socket.id];
              oldRoom = user.getRoom();
              if ((room = app.userRoomHandler.setRoom(socket.id, data)) !== false) {
                socket.leave(oldRoom);
                return socket.join(room);
              }
            });
            return socket.on('name', function(data) {
              return _users[socket.id].setName(data);
            });
          };
        })(this));
      };
      this.send = function(sessionId, message, data) {
        return io.sockets.connected[sessionId].emit(message, data);
      };
      this.sendToRoom = function(room, message, data) {
        return io.sockets.to(room).emit(message, data);
      };
      this.sendAll = function(message, data) {
        return io.sockets.emit(message, data);
      };
    }

    return Messenger;

  })();

  User = (function() {
    function User(app, _sessionId) {
      var _name, _room;
      _name = '';
      _room = 0;
      this.getSessionId = function() {
        return _sessionId;
      };
      this.getName = function() {
        return _name;
      };
      this.setName = function(name) {
        if (name.trim() !== '') {
          return _name = name;
        }
      };
      this.getRoom = function() {
        return _room;
      };
      this.setRoom = function(room) {
        _room = room;
        return this.sendToMe('room', room);
      };
      this.sendToMe = function(message, data) {
        return app.messenger.send(_sessionId, message, data);
      };
      this.getGame = function() {
        return app.userRoomHandler.getGameBySessionId(sessionId);
      };
    }

    return User;

  })();

  UserRoomHandler = (function() {
    function UserRoomHandler(app) {
      var _games, _rooms, _users;
      _users = [];
      _games = [];
      _rooms = [0, 102, 103, 105, 201, 202, 203, 205, 301, 302, 303, 305, 401, 402, 403, 405];
      this.addUser = function(sessionId) {
        return _users[sessionId] = new User(app, sessionId);
      };
      this.removeUser = function(sessionId) {
        if (_users[sessionId] != null) {
          return delete _users[sessionId];
        }
      };
      this.getUserBySessionId = function(sessionId) {
        if (_users[sessionId] != null) {
          return _users[sessionId];
        } else {
          return void 0;
        }
      };
      this.getNameBySessionId = function(clientId) {
        if (_users[sessionId] != null) {
          return _users[sessionId].getName();
        } else {
          return void 0;
        }
      };
      this.getRoomBySessionId = function(sessionId) {
        if (_users[sessionId] != null) {
          return _users[sessionId].getRoom();
        } else {
          return void 0;
        }
      };
      this.getGameBySessionId = function(sessionId) {
        if ((_users[sessionId] != null) && (_games[_users[sessionId].room] != null)) {
          return _games[_users[sessionId].getRoom()];
        } else {
          return void 0;
        }
      };
      this.getSessionIdsByRoom = function(room) {
        var key, sessionIds;
        console.log("checking room " + room);
        sessionIds = [];
        if (__indexOf.call(_rooms, room) >= 0) {
          for (key in _users) {
            console.log('  ' + key);
            console.log('    ' + _users[key].getSessionId());
            if (_users[key].getRoom() === room) {
              sessionIds.push(_users[key].getRoom());
            }
          }
          return sessionIds;
        } else {
          return void 0;
        }
      };
      this.setRoom = function(sessionId, room) {
        var oldRoom, user;
        if ((_users[sessionId] != null) && __indexOf.call(_rooms, room) >= 0 && _users[sessionId].room !== room) {
          user = _users[sessionId];
          oldRoom = user.getRoom();
          user.setRoom(room);
          this.check_gamestart(room);
          this.sendPopulation();
          return room;
        } else {
          return false;
        }
      };
      this.setName = function(sessionId, name) {
        var _ref;
        if (((_ref = _users[sessionId]) != null ? _ref.name : void 0) !== name) {
          return _users[sessionId].setName(name);
        }
      };
      this.finishGame = function(room) {
        if (_games[room]) {

        }
      };
      this.clearGame = function(room) {
        if (_games[room] != null) {

        }
      };
      this.sendPopulation = function() {
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
      this.check_gamestart = function(room) {
        var _ref;
        if (room !== 0 && ((_ref = this.getSessionIdsByRoom(room)) != null ? _ref.length : void 0) === 4) {
          _games[room] = new Game(app, room);
          return _games[room].start();
        }
      };
    }

    return UserRoomHandler;

  })();

  App = (function() {
    function App(io) {
      this.util = new Util();
      this.messenger = new Messenger(this, io);
      this.userRoomHandler = new UserRoomHandler(this);
      this.init = function() {
        return this.messenger.init();
      };
    }

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
