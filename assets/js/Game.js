'use strict';

import rand from "./rand.js";
import Timer from "./Timer.js";

export default class Game {

    static _timer = new Timer();
    static _pause = false;

    static config = {
        cellSize: 64,
        columns: 0,
        rows: 0
    }

    static _cells = [];
    static _fallingCells = [];

    static player = {
        x: 0,
        y: 0,
        score: 0,
        username: ''
    }

    /* Screens */
    static screenWelcome = document.querySelector("#screenWelcome");
    static screenGame    = document.querySelector("#screenGame");
    static screenRating  = document.querySelector("#screenRating");
    static screenLoss    = document.querySelector("#screenLoss");
    static gameField = document.querySelector("#gameField");

    static init() {

        this.screenWelcome.style.display = 'none';
        this.screenGame.style.display = 'flex';

        this._generateMap();
        this._listeners();
        this._updateHUD();
        this._physic();
        this._timer.start();

    }

    static _generateMap() {

        /* Create basic grid */
        this.config.columns = Math.floor(window.innerWidth / this.config.cellSize);
        this.config.rows    = Math.floor((window.innerHeight-100) / this.config.cellSize);

        this.gameField.style.gridTemplateColumns = `repeat(${ this.config.columns }, ${ this.config.cellSize }px )`;
        this.gameField.style.gridTemplateRows    = `repeat(${ this.config.rows }, ${ this.config.cellSize}px )`;

        /* Generate empty ground cells */
        for (let i = 0; i < this.config.columns * this.config.rows; i++) {

            const cell = document.createElement('div');
            cell.className = 'cell ground';

            this._cells.push(cell);
            this.gameField.append(cell);

        }

        /* Player */
        this._cells[0].classList = 'cell player';

        /* Stones */
        for (let i = 0; i < 10; i++) {

            const index = rand(1, this._cells.length-1);
            const cell  = this._cells[index];

            if (
                !cell.classList.contains('player') &&
                !cell.classList.contains('stone')  &&
                !cell.classList.contains('heart')
            ) {
                cell.className = 'cell stone';
            } else i--;

        }

        /* Hearts */
        for (let i = 0; i < 10; i++) {

            const index = rand(1, this._cells.length-1);
            const cell  = this._cells[index];

            if (
                !cell.classList.contains('player') &&
                !cell.classList.contains('stone')  &&
                !cell.classList.contains('heart')
            ) {
                cell.className = 'cell heart';
            } else i--;

        }

    }

    static _updateHUD() {
        
        const HUD = document.querySelector("#hud");
        
        const hudUsername = HUD.querySelector("#hudUsername");
        const hudTimer    = HUD.querySelector("#hudTimer");
        const hudHearts   = HUD.querySelector("#hudHearts");

        /* Static HUD properties */
        hudUsername.textContent = this.player.username;

        /* Dynamic HUD properties */
        setInterval( ()=>{
            hudHearts.textContent = this.player.score;
            hudTimer.textContent  = this._timer.getTime();
        }, 1000); /* Update HUD very 1 second  */
        
    }

    static control() {

        document.addEventListener('keydown', e => {

            const oldPosition = this.player.x + ( this.player.y * this.config.columns );

            this._cells[oldPosition].className = 'cell';

            switch (e.key) {
                case 'w':
                    if (this.player.y > 0 && !this._cells[ this.player.x + ( (this.player.y-1) * this.config.columns ) ].classList.contains('stone')  ) this.player.y--;
                    break;
                case 'a':
                    if (this.player.x > 0 && !this._cells[ (this.player.x-1) + ( this.player.y * this.config.columns ) ].classList.contains('stone')  ) this.player.x--;
                    break;
                case 's':
                    if (this.player.y+1 < this.config.rows  && !this._cells[ this.player.x + ( (this.player.y+1) * this.config.columns ) ].classList.contains('stone') ) this.player.y++;
                    break;
                case 'd':
                    if (this.player.x+1 < this.config.columns  && !this._cells[ (this.player.x+1) + ( this.player.y * this.config.columns ) ].classList.contains('stone') ) this.player.x++;
                    break;
            }

            for (let i = 0; i < this.player.y; i++) {


                const place = this.player.x + (this.config.columns * i);

                if (
                    (this._cells[place].classList.contains('stone') ||
                     this._cells[place].classList.contains('heart')) &&
                     !this._fallingCells.includes(place)
                ) {
                    this._fallingCells.push(place)
                }

            }

            /* Take heart */
            if ( this._cells[ this.player.x + ( this.player.y * this.config.columns ) ].classList.contains('heart') ) this.player.score++;
            if ( this.player.score >= 10 ) this.end();

            this._cells[ this.player.x + ( this.player.y * this.config.columns ) ].className = 'cell player';

        });

    }

    static _physic() {

        setInterval( ()=> {

            for (let i = 0; i < this._fallingCells.length; i++) {

                const newPlace =  this._fallingCells[i] + this.config.columns;
                const cellType =  this._cells[this._fallingCells[i]].className;

                /* If cell beyond the edges */
                if (newPlace > this._cells.length-1) {
                    this._fallingCells.splice(i, 1);
                    continue;
                }

                /* If hearts falling on player */
                if (
                    cellType === 'cell heart' &&
                    this._cells[newPlace].classList.contains('player')
                ) {
                    this._cells[this._fallingCells[i]].className = 'cell';
                    this._fallingCells.splice(i, 1);
                    this.player.score++;
                }

                /* If stone falling on player */
                if (
                    cellType === 'cell stone' &&
                    this._cells[newPlace].classList.contains('player')
                ) this.lose();

                /* Falling */
                if (this._cells[newPlace].className === 'cell') {
                    this._cells[this._fallingCells[i]].className = 'cell'; /* Remove from old place */
                    this._fallingCells[i] = newPlace; /* Update place */
                    this._cells[this._fallingCells[i]].className = cellType; /* Insert to new place*/
                }

            }

        }, 1000);

    }

    static _listeners() {

        this.control();

    }

    static end() {
        this.screenRating.style.display = 'block';
        this.screenGame.style.display = 'none';
    }

    static lose() {

        this.screenLoss.style.display = 'block';
        this.screenGame.style.display = 'none';

    }

    static restart() {
        window.location.reload();
    }

}