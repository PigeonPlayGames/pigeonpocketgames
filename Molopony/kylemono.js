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

    function getPositionX(position) {
        // Function logic remains the same as provided earlier
    }

    function getPositionY(position) {
        // Function logic remains the same as provided earlier
    }

    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

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

    function checkSpecialTiles() {
        if (player.position === 30) {
            sendToJail();
        }
    }

    function sendToJail() {
        player.position = 10; // Jail is at tile 10
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Woah Pothole! Gonna need to fix the Van!");
    }

    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    function checkPropertyTile() {
        // Same as your existing code
    }

    function checkChanceTile() {
        const chanceTiles = [7, 22, 36];
        if (chanceTiles.includes(player.position)) {
            showChanceDialog();
        }
    }

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

    function hidePropertyDialog() {
        const propertyDialog = document.getElementById('propertyDialog');
        propertyDialog.classList.remove('show-dialog');
    }

    function buyProperty() {
        // Same as your existing code
    }

    function rollDice(numDice) {
        // Same as your existing code
    }

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
