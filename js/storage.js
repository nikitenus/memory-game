(function (global) {
  "use strict";

  var MG = (global.MG = global.MG || {});

  var STORAGE_KEY = "memory-game.leaderboard";
  var MAX_RESULTS = 10;

  function isValid(entry) {
    return (
      entry !== null &&
      typeof entry === "object" &&
      typeof entry.moves === "number" &&
      typeof entry.date === "number"
    );
  }

  function compare(a, b) {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }
    return a.date - b.date;
  }

  function load() {
    var raw;
    try {
      raw = global.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return [];
    }

    if (!raw) {
      return [];
    }

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return [];
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValid).sort(compare).slice(0, MAX_RESULTS);
  }

  function save(results) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      return;
    }
  }

  function addResult(moves, date) {
    var results = load();
    results.push({ moves: moves, date: date || Date.now() });
    results.sort(compare);
    results = results.slice(0, MAX_RESULTS);
    save(results);
    return results;
  }

  function getTop() {
    return load();
  }

  MG.storage = {
    load: load,
    save: save,
    addResult: addResult,
    getTop: getTop,
    STORAGE_KEY: STORAGE_KEY,
    MAX_RESULTS: MAX_RESULTS
  };
})(window);
