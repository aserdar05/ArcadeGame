//The score property
let score = 0;
//The movement counter
let movement = 0;

//// Enemies our player must avoid
//var Enemy = function(x, y, speed) {
//    // Variables applied to each of our instances go here,
//    // we've provided one for you to get started

//    // The image/sprite for our enemies, this uses
//    // a helper we've provided to easily load images
//    this.sprite = 'images/enemy-bug.png';
//    //The x coordiane of enemiy on board
//    this.x = x;
//    //The y coordiane of enemiy on board
//    this.y = y;
//    //The movememt speed variable of enemy
//    this.speed = speed;
//};

//// Update the enemy's position, required method for game
//// Parameter: dt, a time delta between ticks
//Enemy.prototype.update = function (dt) {
//    // You should multiply any movement by the dt parameter
//    // which will ensure the game runs at the same speed for
//    // all computers.
//    this.x = this.x + dt * this.speed;
//};

//// Draw the enemy on the screen, required method for game
//Enemy.prototype.render = function () {
//    ctx.drawImage(Resources.get(this.sprite), calculateXCoordinate(this.x), calculateYCoordinate(this.y));
//};

class GameObject {
    constructor(x, y, sprite) {
        this.x = calculateXCoordinate(x);
        this.y = calculateYCoordinate(y);
        this.sprite = sprite;
    }

    // Draw the game object on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Enemy extends GameObject {
    constructor(x, y, sprite, speed) {
        super(x, y, sprite);
        this.speed = speed;
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt) {
        this.x = this.x + dt * this.speed;
    };
}

class Player extends GameObject {
    constructor(x, y, sprite) {
        super(x, y, sprite);
    }
    update() {
        this.render();
        this.handleEnemyCrash();
        this.handleComplete();
    }
    //Handles input key press on board
    handleInput(pressedKey) {
        if (pressedKey != undefined) {
            if (pressedKey == 'right') {
                this.x = this.x + 100;
                this.update();
            }
            else if (pressedKey == 'left') {
                this.x = this.x - 100;
                this.update();
            }
            else if (pressedKey == 'down') {
                this.y = this.y + 83;
                this.update();
            }
            else if (pressedKey == 'up') {
                this.y = this.y - 83;
                this.update();
            }
            //Rerender the player position
            this.render();
            movement += 1;//Increase movement count
            score -= 10;//Decrease score by 10 for every movement
            document.querySelector('.movement').innerHTML = movement;
            document.querySelector('.score').innerHTML = score;
        }
    }

    //Controls if the player crashes enemy or not
    handleEnemyCrash() {
        let playerXOrder = calculateXOrder(this.x);
        let playerYOrder = calculateYOrder(this.y);
        let player = this;
        if (playerXOrder != -1 && playerYOrder != -1) {
            allEnemies.forEach(function (enemy) {
                let enemyXOrder = calculateXOrder(enemy.x);
                let enemyYOrder = calculateYOrder(enemy.y);
                if (enemyXOrder == playerXOrder && enemyYOrder == playerYOrder) {
                    player.x = calculateXCoordinate(2);
                    player.y = calculateYCoordinate(5);
                    score -= 100;
                    document.querySelector('.score').innerHTML = score;
                }
            });
        }
    }

    //Controls if player reached the water or not
    handleComplete() {
        if (calculateYOrder(this.y) == 0)
        {
            player.x = calculateXCoordinate(2);
            player.y = calculateYCoordinate(5);
            score += 500;
            document.querySelector('.score').innerHTML = score;
            showGameCompleted();
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemyBugImage = 'images/enemy-bug.png';
let player = new Player(2, 5, 'images/char-boy.png');
let enemy1 = new Enemy(0, 1, enemyBugImage, 200);
let enemy2 = new Enemy(2, 2, enemyBugImage, 200);
let enemy3 = new Enemy(3, 3, enemyBugImage, 300);
let allEnemies = [enemy1, enemy2, enemy3];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//Show choose character modal
chooseCharacters();
document.querySelector('#btn-change-character').addEventListener('click', function () {
    //Change character button click
    chooseCharacters();
});

document.querySelector('#btn-continue').addEventListener('click', function () {
    hideGameCompleted();
});

//Calculate x coordinate from box order
function calculateXCoordinate(x) {
    return x * 100 + 1;
}
//Calculate y coordinate from box order
function calculateYCoordinate(y) {
    return y * 83 - 21;
}

//Calculate x box order from x coordinate
function calculateXOrder(x) {
    let axis = (x - 1) / 100;
    if (axis < 0 || axis > 4)
        return -1;
    else return Math.round(axis);
}
//Calculate y box order from y coordinate
function calculateYOrder(y) {
    let axis = (y + 21) / 83;
    if (axis < 0 || axis > 4)
        return -1;
    else return Math.round(axis);
}


//Opens a character choosel dialog
function chooseCharacters() {
    playerElements = document.querySelectorAll('.player')
    playerElements.forEach(function (player) {
        player.addEventListener('click', playerSelected);
    });
    document.querySelector('#materialModal').className = 'show';
}

//Opens a game completed info dialog
function showGameCompleted() {
    document.querySelector('#materialModalCompleted').className = 'show';
}
//Opens a game completed info dialog
function hideGameCompleted() {
    document.querySelector('#materialModalCompleted').className = 'hide';
}

//Handle player selected event
function playerSelected(e) {
    let selectedClass = e.target.classList[1];
    player.sprite = 'images/' + selectedClass + '.png';
    document.querySelector('#materialModal').className = 'hide';
}

