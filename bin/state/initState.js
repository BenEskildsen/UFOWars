'use strict';

var initState = function initState() {
  return {
    game: null,
    players: [],
    games: { '0': { id: '0', players: [], started: false } },
    modal: null
  };
};

module.exports = { initState: initState };