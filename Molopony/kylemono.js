document.addEventListener('DOMContentLoaded', function() {
    // Define board size
    const boardSize = 40;

    // Define player object
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [], // Array to store owned properties
        poisonTurns: 0 // Counter for poison turns
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
        if (player.position === 30 && player.poisonTurns === 0) {
            player.position = 10; // Move player to position 10 if they land on poison
            player.poisonTurns = 3; // Set poison turns counter
            displayPoisonEffect(); // Display poison effect message
        } else if (player.poisonTurns > 0) {
            player.poisonTurns--; // Decrease poison turns counter
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
        document.getElementById('poisonTurns').textContent = player.poisonTurns;
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
            propertyDialog.classList.add('show-dialog'); // Show the property dialog
        } else {
            hidePropertyDialog(); // Hide the dialog if the player didn't land on a property tile or property is already owned
        }
    }

    // Function to hide the property dialog
    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog'); // Hide the property dialog
    }

    // Function to display poison effect message
    function displayPoisonEffect() {
        const poisonEffect = document.getElementById('poisonEffect');
        poisonEffect.classList.remove('hidden');
        setTimeout(function() {
            poisonEffect.classList.add('hidden');
        }, 3000); // Hide message after 3 seconds
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
});
