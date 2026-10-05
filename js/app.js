(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});
  var el = MG.el;

  var elements = {};
  var game = null;
  var ready = false;

  function buildButton(className, text, attrs) {
    return el("button", {
      className: className,
      type: "button",
      text: text,
      attrs: attrs
    });
  }

  function buildHeader() {
    var newGameButton = buildButton("button", "New game", { id: "new-game" });
    var leaderboardButton = buildButton("button", "Leaderboard", {
      id: "leaderboard"
    });

    elements.newGame = newGameButton;
    elements.leaderboard = leaderboardButton;

    return el("header", { className: "header" }, [
      el("h1", { className: "header__title", text: "Memory" }),
      el("div", { className: "header__actions" }, [
        newGameButton,
        leaderboardButton
      ])
    ]);
  }

  function buildStats() {
    var moves = el("span", {
      className: "stats__item",
      attrs: { "data-stat": "moves" }
    });
    var pairs = el("span", {
      className: "stats__item",
      attrs: { "data-stat": "pairs" }
    });

    elements.moves = moves;
    elements.pairs = pairs;

    return el("p", { className: "stats" }, [moves, pairs]);
  }

  function buildCard(card, index) {
    var back = el("div", { className: "card__face card__face--back" });
    var image = el("img", {
      className: "card__image",
      src: card.src,
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
        attrs: {
          "aria-label": "Hidden card",
          "data-card-index": String(index)
        },
        on: {
          click: function () {
            game.flip(index);
          }
        }
      },
      [inner]
    );
  }

  function buildBoard() {
    var cards = game.getState().cards;
    elements.cardEls = cards.map(buildCard);
    return el("div", { className: "board" }, elements.cardEls);
  }

  function render(state) {
    if (!ready) {
      return;
    }

    elements.moves.textContent = "Moves: " + state.moves;
    elements.pairs.textContent =
      "Pairs: " + state.found + " / " + state.totalPairs;

    state.cards.forEach(function (card, index) {
      var node = elements.cardEls[index];
      if (!node) {
        return;
      }
      var open = card.status !== "hidden";
      node.classList.toggle("is-flipped", open);
      node.classList.toggle("is-matched", card.status === "matched");
      node.setAttribute("aria-label", open ? card.typeLabel : "Hidden card");
    });
  }

  function onWin() {}

  function init() {
    game = new MG.Game({
      types: MG.CARD_TYPES,
      onChange: render,
      onWin: onWin
    });

    var app = el("div", { className: "app" }, [
      buildHeader(),
      el("main", { className: "main" }, [buildStats(), buildBoard()])
    ]);

    document.body.appendChild(app);

    elements.newGame.addEventListener("click", function () {
      game.newGame();
    });

    ready = true;
    render(game.getState());
  }

  init();
})(window);
