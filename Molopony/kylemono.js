document.addEventListener('DOMContentLoaded', function() {
    // Define board size
    const boardSize = 40;

    // Define player object
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [] // Array to store owned properties
    };

    // Get X position for the player's token
    function getPositionX(position) {
        let segmentLength = 600 / 10; // Assuming each side of the board has 10 positions
        let segment = Math.floor(position / 10);
        let offset = (position % 10) * segmentLength;

        if (segment === 0) {
            return 600 - offset; // Bottom row, moving right to left
        } else if (segment === 1) {
            return 0; // Right column, moving upwards
        } else if (segment === 2) {
            return offset; // Top row, moving left to right
        } else {
            return 600; // Left column, moving downwards
        }
    }

    // Get Y position for the player's token
    function getPositionY(position) {
        let segmentLength = 600 / 10; // Assuming each side of the board has 10 positions
        let segment = Math.floor(position / 10);
        let offset = (position % 10) * segmentLength;

        if (segment === 0) {
            return 600; // Bottom row
        } else if (segment === 1) {
            return 600 - offset; // Right column, moving upwards
        } else if (segment === 2) {
            return 0; // Top row
        } else {
            return offset; // Left column, moving downwards
        }
    }

    // Function to move player
    function movePlayer(spaces) {
        hidePropertyDialog();
        player.position = (player.position + spaces) % boardSize;
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
    }

    // Function to check if player landed on a property tile
    function checkPropertyTile() {
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5); // Example cost calculation
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = purchaseCost;
            propertyDialog.classList.add('show-dialog');
        } else {
            hidePropertyDialog();
        }
    }

    // Function to hide the property dialog
    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog');
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
