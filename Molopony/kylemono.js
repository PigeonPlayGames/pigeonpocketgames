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

// Function to get X position based on player position
function getPositionX(position) {
    if (position < 10) {
        return 570 - (position * 54);
    } else if (position >= 10 && position < 20) {
        return 50;
    } else if (position >= 20 && position < 30) {
        return 50 + ((position - 20) * 54);
    } else {
        return 570;
    }
}

// Function to get Y position based on player position
function getPositionY(position) {
    if (position < 10) {
        return 570;
    } else if (position >= 10 && position < 20) {
        return 570 - ((position - 10) * 54);
    } else if (position >= 20 && position < 30) {
        return 50;
    } else {
        return 50 + ((position - 30) * 54);
    }
}

// Function to roll the dice and move player
function rollDice() {
    const diceValue = Math.floor(Math.random() * 11) + 2; // Random number between 2 and 12
    movePlayer(diceValue);
}

// Event listener for rolling the dice
document.getElementById('rollDice').addEventListener('click', rollDice);

// Initialize player position
renderPlayer();
