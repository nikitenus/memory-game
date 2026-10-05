(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});
  var el = MG.el;

  var TOTAL_PAIRS = 8;

  function buildButton(className, text, attrs) {
    return el("button", {
      className: className,
      type: "button",
      text: text,
      attrs: attrs
    });
  }

  function buildHeader() {
    var newGame = buildButton("button", "New game", { id: "new-game" });
    var leaderboard = buildButton("button", "Leaderboard", {
      id: "leaderboard"
    });

    return el("header", { className: "header" }, [
      el("h1", { className: "header__title", text: "Memory" }),
      el("div", { className: "header__actions" }, [newGame, leaderboard])
    ]);
  }

  function buildStats() {
    var moves = el("span", {
      className: "stats__item",
      text: "Moves: 0",
      attrs: { "data-stat": "moves" }
    });
    var pairs = el("span", {
      className: "stats__item",
      text: "Pairs: 0 / " + TOTAL_PAIRS,
      attrs: { "data-stat": "pairs" }
    });

    return el("p", { className: "stats" }, [moves, pairs]);
  }

  function buildCard(type) {
    var back = el("div", { className: "card__face card__face--back" });
    var image = el("img", {
      className: "card__image",
      src: type.src,
      alt: "",
      attrs: { draggable: "false" }
    });
    var front = el("div", { className: "card__face card__face--front" }, [
      image
    ]);
    var inner = el("div", { className: "card__inner" }, [back, front]);

    return el(
      "button",
      {
        className: "card",
        type: "button",
        attrs: { "aria-label": "Hidden card", "data-card-type": type.id }
      },
      [inner]
    );
  }

  function buildDeck() {
    return MG.CARD_TYPES.reduce(function (deck, type) {
      deck.push(type, type);
      return deck;
    }, []);
  }

  function buildBoard() {
    return el("div", { className: "board" }, buildDeck().map(buildCard));
  }

  function buildApp() {
    return el("div", { className: "app" }, [
      buildHeader(),
      el("main", { className: "main" }, [buildStats(), buildBoard()])
    ]);
  }

  function init() {
    document.body.appendChild(buildApp());
  }

  init();
})(window);
