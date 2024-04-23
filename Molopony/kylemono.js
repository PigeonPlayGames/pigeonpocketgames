document.addEventListener('DOMContentLoaded', function() {
    // Define board size and game settings
    const boardSize = 40;

    // Define player object
    const player = {
        position: 0,
        money: 2000, // Starting money
        ownedProperties: [], // Array to store owned properties
        inJail: false, // Indicates if the player is currently in jail
        turnsInJail: 0 // Counts how many turns the player has been in jail
    };

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

    // Update the player's display on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    // Move player around the board, taking into account jail rules
    function movePlayer(spaces) {
        if (!player.inJail) {
            player.position = (player.position + spaces) % boardSize;
            checkSpecialTiles();
            checkChanceTile();
        }
        renderPlayer();
        checkPropertyTile();
        updatePlayerInfo();
    }

    // Check for special tiles like "Go to Jail"
    function checkSpecialTiles() {
        if (player.position === 30) {
            sendToJail();
        }
    }

    // Send player to jail
    function sendToJail() {
        player.position = 10; // Jail is at tile 10
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Woah Pothole! Gonna need to fix the Van!");
    }

    // Check if the player has landed on a chance card tile
    function checkChanceTile() {
        const chanceTiles = [7, 22, 36];
        if (chanceTiles.includes(player.position)) {
            showChanceDialog();
        }
    }

    // Display a random chance card
    function showChanceDialog() {
        const chanceNumber = Math.floor(Math.random() * 15) + 1; // Generates a random number between 1 and 15
        const propertyDialog = document.getElementById('propertyDialog');
        const propertyImage = document.getElementById('propertyImage');

        propertyImage.src = `Images/chancecard${chanceNumber}.jpg`;
        propertyImage.alt = `Chance Card ${chanceNumber}`;

        document.getElementById('propertyNumber').textContent = "Chance Card";
        document.getElementById('purchaseCost').textContent = "What will happen?";

        propertyDialog.classList.add('show-dialog');
    }

    // Update the player info display (position, money)
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    // Check if the player has landed on a property
    function checkPropertyTile() {
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5);
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = purchaseCost;
            
            const propertyImage = document.getElementById('propertyImage');
            propertyImage.src = `Images/property${propertyNumber}.jpg`;
            propertyImage.alt = `Property ${propertyNumber}`;

            propertyDialog.classList.add('show-dialog');
        } else {
            hidePropertyDialog();
        }
    }

    // Hide the property dialog
    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog');
    }

    // Buy a property
    function buyProperty() {
        const purchaseCost = parseInt(document.getElementById('purchaseCost').textContent, 10);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo();
        }
        hidePropertyDialog();
    }

    // Roll dice and manage jail turns
    function rollDice(numDice) {
        let diceValue = 0;
        for (let i = 0; i < numDice; i++) {
            diceValue += Math.floor(Math.random() * 6) + 1;
        }

        if (player.inJail) {
            player.turnsInJail++;
            if (diceValue === 6 || diceValue === 7 || diceValue === 8) {
                alert(`Rolled a phat ${diceValue}! Whey the Van's Fixed!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert("Arf! Finally, the Van's Fixed");
                player.inJail = false;
                player.turnsInJail = 0;
            } else {
                alert(`Bugger, the van's still broke! Rolled a ${diceValue}.`);
                return; // Skip moving if still in jail
            }
        }

        movePlayer(diceValue);
    }

    // Event listeners for dice rolls and property interactions
    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(2);
    });

    document.getElementById('rollThreeDice').addEventListener('click', function() {
        rollDice(3);
    });

    document.getElementById('buyProperty').addEventListener('click', buyProperty);
    document.getElementById('moveOn').addEventListener('click', hidePropertyDialog);

    // Initialize the player's position on the board
    renderPlayer();
});
