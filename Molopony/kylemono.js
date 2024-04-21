document.addEventListener('DOMContentLoaded', function() {
    // Define board size
    const boardSize = 40;

    // Define player object
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [] // Array to store owned properties
    };

    // Function to move player
    function movePlayer(spaces) {
        // Hide property dialog before moving player
        hidePropertyDialog();
        player.position += spaces;
        player.position %= boardSize; // Ensure player wraps around the board
        // Check if player passed Go (position 0) and award $200
        if (player.position < spaces) {
            player.money += 200;
        }
        renderPlayer();
        checkPropertyTile();
        updatePlayerInfo();
    }

    // Function to render player's position on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        const positionX = getPositionX(player.position);
        const positionY = getPositionY(player.position);
        playerToken.style.left = `${positionX}px`;
        playerToken.style.top = `${positionY}px`;
    }

    // Function to update player info display
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    // Function to check if player landed on a property tile
    function checkPropertyTile() {
        // List of property tiles
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5); // Calculate purchase cost based on property number
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = purchaseCost;
            propertyDialog.classList.remove('hidden');
            // Show buy and move on buttons
            document.getElementById('buyProperty').classList.remove('hidden');
            document.getElementById('moveOn').classList.remove('hidden');
        } else {
            hidePropertyDialog(); // Hide the dialog if the player didn't land on a property tile or property is already owned
        }
    }

    // Function to handle buying a property
    function buyProperty(propertyNumber, purchaseCost) {
        // Deduct purchase cost from player's money
        player.money -= purchaseCost;
        // Add property to player's owned properties
        player.ownedProperties.push(propertyNumber);
        // Additional logic for property ownership can be added here
        hidePropertyDialog();
        updatePlayerInfo(); // Update player info after buying
    }

    // Function to hide the property dialog and buttons
    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.add('hidden');
        // Hide buy and move on buttons
        document.getElementById('buyProperty').classList.add('hidden');
        document.getElementById('moveOn').classList.add('hidden');
    }

    // Function to get X position based on player position
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

    // Hide the property dialog and buttons initially
    hidePropertyDialog();
});
