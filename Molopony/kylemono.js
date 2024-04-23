document.addEventListener('DOMContentLoaded', function() {
    // Define board size and game settings
    const boardSize = 40;

    // Define player object
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [], // Array to store owned properties
        inJail: false, // Indicates if the player is currently in jail
        turnsInJail: 0 // Counts how many turns the player has been in jail
    };

    // Function to get X and Y positions based on player position
    function getPositionX(position) {
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

    // Update the player's display on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    // Move player around the board, taking into account jail and lottery rules
    function movePlayer(spaces) {
        if (!player.inJail) {
            player.position = (player.position + spaces) % boardSize;
            checkSpecialTiles();
            checkLotteryTile(); // Check if landed on a lottery tile
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
        player.position = 10;
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Landed on tile 30! Gonna nned to get the van fixed");
    }

    // Check if the player has landed on a lottery tile
    function checkLotteryTile() {
        const lotteryTiles = [7, 22, 36];
        if (lotteryTiles.includes(player.position)) {
            showLotteryDialog();
        }
    }

    // Display a random lottery card
    function showLotteryDialog() {
        const lotteryNumber = Math.floor(Math.random() * 15) + 1; // Random number from 1 to 15
        const propertyDialog = document.getElementById('propertyDialog');
        const propertyImage = document.getElementById('propertyImage');

        propertyImage.src = `Images/lottery${lotteryNumber}.jpg`;
        propertyImage.alt = `Lottery Card ${lotteryNumber}`;

        document.getElementById('propertyNumber').textContent = "Lottery Ticket";
        document.getElementById('purchaseCost').textContent = "Good Luck!";

        propertyDialog.classList.add('show-dialog');
    }

    // Update the player info display (position, money)
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    function checkPropertyTile() {
        // Handling of normal properties, unchanged
    }

    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog');
    }

    function buyProperty() {
        // Buying a property functionality, unchanged
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
                alert(`Rolled a Phat ${diceValue}! Whey The Van's Fixed!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert("Finaly The Van's Fixed!");
                player.inJail = false;
                player.turnsInJail = 0;
            } else {
                alert(`Bummer The van's still broke. Rolled a ${diceValue}.`);
                return; // Skip moving if still in jail
            }
        }

        movePlayer(diceValue);
    }

    // Event listeners for dice rolls and other actions
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
