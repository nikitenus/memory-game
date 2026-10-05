(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});

  var TOTAL_PAIRS = 8;
  var MISMATCH_DELAY = 1000;

  function Game(options) {
    options = options || {};
    this.types = options.types || [];
    this.totalPairs = options.totalPairs || TOTAL_PAIRS;
    this.mismatchDelay = options.mismatchDelay || MISMATCH_DELAY;
    this.onChange = options.onChange || function () {};
    this.onWin = options.onWin || function () {};

    this.deck = [];
    this.firstIndex = null;
    this.secondIndex = null;
    this.mismatchTimer = null;
    this.moves = 0;
    this.found = 0;
    this.locked = false;
    this.gameOver = false;

    this.newGame();
  }

  Game.prototype.newGame = function () {
    this.cancelMismatch();
    this.deck = this.buildDeck();
    this.firstIndex = null;
    this.secondIndex = null;
    this.moves = 0;
    this.found = 0;
    this.locked = false;
    this.gameOver = false;
    this.notify();
  };

  Game.prototype.buildDeck = function () {
    var types = this.types.slice(0, this.totalPairs);
    var cards = [];

    types.forEach(function (type) {
      var card = {
        typeId: type.id,
        typeLabel: type.label,
        src: type.src,
        status: "hidden"
      };
      cards.push(card, {
        typeId: type.id,
        typeLabel: type.label,
        src: type.src,
        status: "hidden"
      });
    });

    return MG.shuffle(cards);
  };

  Game.prototype.flip = function (index) {
    if (this.locked || this.gameOver) {
      return;
    }

    var card = this.deck[index];
    if (!card || card.status !== "hidden") {
      return;
    }

    card.status = "up";

    if (this.firstIndex === null) {
      this.firstIndex = index;
      this.notify();
      return;
    }

    this.secondIndex = index;
    this.moves += 1;

    var first = this.deck[this.firstIndex];
    if (first.typeId === card.typeId) {
      first.status = "matched";
      card.status = "matched";
      this.found += 1;
      this.firstIndex = null;
      this.secondIndex = null;

      if (this.found === this.totalPairs) {
        this.gameOver = true;
      }

      this.notify();

      if (this.gameOver) {
        this.onWin(this.getState());
      }
      return;
    }

    this.locked = true;
    this.notify();
    this.scheduleClose();
  };

  Game.prototype.scheduleClose = function () {
    var self = this;
    this.mismatchTimer = global.setTimeout(function () {
      self.mismatchTimer = null;
      self.closeMismatch();
    }, this.mismatchDelay);
  };

  Game.prototype.closeMismatch = function () {
    if (this.firstIndex !== null && this.deck[this.firstIndex]) {
      this.deck[this.firstIndex].status = "hidden";
    }
    if (this.secondIndex !== null && this.deck[this.secondIndex]) {
      this.deck[this.secondIndex].status = "hidden";
    }
    this.firstIndex = null;
    this.secondIndex = null;
    this.locked = false;
    this.notify();
  };

  Game.prototype.cancelMismatch = function () {
    if (this.mismatchTimer !== null) {
      global.clearTimeout(this.mismatchTimer);
      this.mismatchTimer = null;
    }
  };

  Game.prototype.getState = function () {
    return {
      cards: this.deck,
      moves: this.moves,
      found: this.found,
      totalPairs: this.totalPairs,
      locked: this.locked,
      gameOver: this.gameOver
    };
  };

  Game.prototype.notify = function () {
    this.onChange(this.getState());
  };

  MG.Game = Game;
})(window);
