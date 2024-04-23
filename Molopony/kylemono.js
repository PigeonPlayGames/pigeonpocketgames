document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 40;
    const passGoMoney = 200; // Money awarded for passing 'Go'
    const player = {
        position: 0,
        money: 2000, // Starting money
        ownedProperties: [], // Array to store owned properties
        inJail: false, // Indicates if the player is currently in jail
        turnsInJail: 0 // Counts how many turns the player has been in jail
    };

    // Utility functions to get player's position on the board
    function getPositionX(position) {
        // Calculate horizontal position based on current player position
        if (position < 10) {
            return 570 - (position * 55);
        } else if (position >= 10 && position < 20) {
            return 50;
        } else if (position >= 20 && position < 30) {
            return 50 + ((position - 20) * 55);
        } else {
            return 570;
        }
    }

    function getPositionY(position) {
        // Calculate vertical position based on current player position
        if (position < 10) {
            return 570;
        } else if (position >= 10 && position < 20) {
            return 570 - ((position - 10) * 55);
        } else if (position >= 20 && position < 30) {
            return 50;
        } else {
            return 50 + ((position - 30) * 55);
        }
    }

    // Update player's token on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    // Moves player around the board and checks for passing 'Go'
    function movePlayer(spaces) {
        let oldPosition = player.position;
        player.position = (player.position + spaces) % boardSize;
        
        // Award $200 if player passes 'Go'
        if (oldPosition + spaces >= boardSize) {
            player.money += passGoMoney;
            alert("You passed GO! Collect $200.");
        }

        if (!player.inJail) {
            checkSpecialTiles();
            checkChanceTile();
        }
        renderPlayer();
        checkPropertyTile();
        updatePlayerInfo();
    }

    // Checks if the player has landed on special tiles like 'Go to Jail'
    function checkSpecialTiles() {
        if (player.position === 30) {
            sendToJail();
        }
    }

    // Send player to jail
    function sendToJail() {
        player.position = 10;
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Sent to jail!");
    }

    // Update display of player's information
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    // Check if the player has landed on a property and can buy it
    function checkPropertyTile() {
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5); // Example cost calculation
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = `$${purchaseCost}`;

            const propertyImage = document.getElementById('propertyImage');
            propertyImage.src = `Images/property${propertyNumber}.jpg`;
            propertyImage.alt = `Property ${propertyNumber}`;

            propertyDialog.style.display = 'block';
        } else {
            hidePropertyDialog();
        }
    }

    // Hide any open property or chance card dialog
    function hidePropertyDialog() {
        document.getElementById('propertyDialog').style.display = 'none';
        document.getElementById('chanceCardDialog').style.display = 'none';
    }

    // Checks if player lands on a chance card tile
    function checkChanceTile() {
        const chanceTiles = [7, 22, 36];
        if (chanceTiles.includes(player.position)) {
            showChanceDialog();
        }
    }

    // Show chance card dialog with a random card
    function showChanceDialog() {
        const chanceNumber = Math.floor(Math.random() * 15) + 1; // Get a random chance card number
        const chanceDialog = document.getElementById('chanceCardDialog');
        const chanceImage = document.getElementById('chanceCardImage');

        chanceImage.src = `Images/chancecard${chanceNumber}.jpg`;
        chanceImage.alt = `Chance Card ${chanceNumber}`;
        document.getElementById('chanceCardNumber').textContent = `Chance Card ${chanceNumber}`;

        chanceDialog.style.display = 'block';
    }

    // Handle property purchase interaction
    function buyProperty() {
        const purchaseCost = parseInt(document.getElementById('purchaseCost').textContent.replace('$', ''), 10);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo();
            alert('Property purchased!');
            hidePropertyDialog();
        } else {
            alert("Not enough money to buy this property!");
        }
    }

    // Simulate dice roll and move the player
    function rollDice(numDice) {
        let diceValue = 0;
        for (let i = 0; i < numDice; i++) {
            diceValue += Math.floor(Math.random() * 6) + 1;
        }

        if (player.inJail) {
            player.turnsInJail++;
            if (diceValue === 6 || diceValue === 7 || diceValue === 8) {
                alert(`Rolled ${diceValue}! You're free from jail!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert("You are released from jail after 3 turns!");
                player.inJail = false;
                player.turnsInJail = 0;
            } else {
                alert(`Still in jail. Rolled a ${diceValue}.`);
                return; // Skip moving if still in jail
            }
        }

        movePlayer(diceValue);
    }

    // Event listeners for user interactions
    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(2);
    });

    document.getElementById('rollThreeDice').addEventListener('click', function() {
        rollDice(3);
    });

    document.getElementById('buyProperty').addEventListener('click', buyProperty);
    document.getElementById('moveOn').addEventListener('click', hidePropertyDialog);

    renderPlayer();
});
