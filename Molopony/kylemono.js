document.addEventListener('DOMContentLoaded', function() {
    // Define board size
    const boardSize = 40;
    const boardWidth = 600; // Width of the board in pixels
    const boardHeight = 600; // Height of the board in pixels
    const positionsPerSide = 10; // Number of positions per side of the board
    const tokenOffset = 30; // Offset to center the token within a cell

    // Define player object
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [], // Array to store owned properties
        poisonTurns: 0 // Counter for poison turns
    };

    // Get X position for the player's token
    function getPositionX(position) {
        if (position < positionsPerSide) { // Bottom row (right to left)
            return boardWidth - (position * (boardWidth / positionsPerSide)) - tokenOffset;
        } else if (position < positionsPerSide * 2) { // Right column (bottom to top)
            return tokenOffset;
        } else if (position < positionsPerSide * 3) { // Top row (left to right)
            return (position - positionsPerSide * 2) * (boardWidth / positionsPerSide) + tokenOffset;
        }
        return boardWidth - tokenOffset; // Left column (top to bottom)
    }

    // Get Y position for the player's token
    function getPositionY(position) {
        if (position < positionsPerSide) { // Bottom row
            return boardHeight - tokenOffset;
        } else if (position < positionsPerSide * 2) { // Right column
            return boardHeight - ((position - positionsPerSide) * (boardHeight / positionsPerSide)) - tokenOffset;
        } else if (position < positionsPerSide * 3) { // Top row
            return tokenOffset;
        }
        return (position - positionsPerSide * 3) * (boardHeight / positionsPerSide) + tokenOffset; // Left column
    }

    // Function to move player
    function movePlayer(spaces) {
        hidePropertyDialog();
        player.position = (player.position + spaces) % boardSize;
        if (player.position === 30 && player.poisonTurns === 0) {
            player.position = 10; // Move player to Jail
            player.poisonTurns = 3; // Start poison turns
            displayPoisonEffect();
        } else if (player.poisonTurns > 0) {
            player.poisonTurns--;
        }
        renderPlayer();
        checkPropertyTile();
        updatePlayerInfo();
    }

    // Function to render player's position on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    // Function to update player info display
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
        document.getElementById('poisonTurns').textContent = player.poisonTurns;
    }

    // Function to check if player landed on a property tile
    function checkPropertyTile() {
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5);
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = purchaseCost;
            propertyDialog.classList.add('show-dialog');
        }
    }

    // Function to hide the property dialog
    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog');
    }

    // Function to display poison effect message
    function displayPoisonEffect() {
        const poisonEffect = document.getElementById('poisonEffect');
        poisonEffect.classList.remove('hidden');
        setTimeout(function() {
            poisonEffect.classList.add('hidden');
        }, 3000);
    }

    // Function to roll the dice and move player
    function rollDice(numDice) {
        let diceValue = 0;
        for (let i = 0; i < numDice; i++) {
            diceValue += Math.floor(Math.random() * 6) + 1;
        }
        movePlayer(diceValue);
    }

    // Event listeners for dice rolls
    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(2);
    });

    document.getElementById('rollThreeDice').addEventListener('click', function() {
        rollDice(3);
    });

    // Initialize player position
    renderPlayer();
});
