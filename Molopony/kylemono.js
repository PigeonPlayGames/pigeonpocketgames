// Define board size
const boardSize = 40;

// Define player object
const player = {
    position: 0,
    money: 1500, // Starting money
};

// Function to move player
function movePlayer(spaces) {
    player.position += spaces;
    player.position %= boardSize; // Ensure player wraps around the board
    // Check if player passed Go (position 0) and award $200
    if (player.position < spaces) {
        player.money += 200;
    }
    renderPlayer();
}

// Function to render player's position on the board
function renderPlayer() {
    const playerToken = document.getElementById('playerToken');
    const positionX = getPositionX(player.position);
    const positionY = getPositionY(player.position);
    playerToken.style.left = `${positionX}px`;
    playerToken.style.top = `${positionY}px`;
    updatePlayerInfo();
}

// Function to update player info display
function updatePlayerInfo() {
    document.getElementById('playerPosition').textContent = player.position;
    document.getElementById('playerMoney').textContent = player.money;
}

function getPositionX(position) {
    if (position < 5) {
        return 550 - (position * 55);
    } else if (position >= 5 && position < 10) {
        return 570 - (position * 55);
    } else if (position >= 10 && position < 20) {
        return 50;
    } else if (position >= 20 && position < 30) {
        return 50 + ((position - 20) * 48);
    } else {
        return 570;
    }
}

// Function to get Y position based on player position
function getPositionY(position) {
    if (position < 10) {
        return 570;
    } else if (position >= 10 && position < 20) {
        return 570 - ((position - 10) * 55);
    } else if (position >= 20 && position < 30) {
        return 50;
    } else {
        return 50 + ((position - 30) * 50);
    }
}


// Function to roll the dice and move player
function rollDice(numDice) {
    let diceValue = 0;
    for (let i = 0; i < numDice; i++) {
        diceValue += Math.floor(Math.random() * 6) + 1; // Roll a single six-sided die
    }
    movePlayer(diceValue);
}

// Event listener for rolling two dice
document.getElementById('rollDice').addEventListener('click', function() {
    rollDice(2);
});

// Event listener for rolling three dice
document.getElementById('rollThreeDice').addEventListener('click', function() {
    rollDice(3);
});

// Initialize player position
renderPlayer();
