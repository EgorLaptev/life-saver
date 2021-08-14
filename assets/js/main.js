'use strict';

import Game from "./Game.js";

const restartWin  = document.querySelector("#restartWin");
const restartLose = document.querySelector("#restartLose");

restartWin.addEventListener('click', Game.restart );
restartLose.addEventListener('click', Game.restart );

/* Welcome screen */
const startButton   = document.querySelector("#startButton");
const usernameField = document.querySelector("#usernameField");

usernameField.addEventListener('input', e => startButton.disabled = !usernameField.value.trim() );

startButton.addEventListener('click', e => {

    e.preventDefault();

    Game.player.username = usernameField.value.trim();
    Game.init();

});

