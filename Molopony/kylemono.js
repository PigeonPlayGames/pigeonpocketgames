document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 40;
    const passGoMoney = 200; // Money collected when passing 'Go'
    const player = {
        position: 0,
        money: 2000, // Starting money
        ownedProperties: [], // Array to store owned properties
        inJail: false, // Indicates if the player is currently in jail
        turnsInJail: 0 // Counts how many turns the player has been in jail
    };

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

    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    function movePlayer(spaces) {
        const oldPosition = player.position;
        player.position = (player.position + spaces) % boardSize;
        
        // Check if player passes 'Go'
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
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            const propertyDialog = document.getElementById('propertyDialog');
            const propertyNumber = player.position;
            const purchaseCost = 100 + (propertyNumber * 5);
            document.getElementById('propertyNumber').textContent = propertyNumber;
            document.getElementById('purchaseCost').textContent = `\$${purchaseCost}`;

            const propertyImage = document.getElementById('propertyImage');
            propertyImage.src = `Images/property${propertyNumber}.jpg`;
            propertyImage.alt = `Property ${propertyNumber}`;

            propertyDialog.style.display = 'block';
        } else {
            hidePropertyDialog();
        }
    }

    function hidePropertyDialog() {
        document.getElementById('propertyDialog').style.display = 'none';
        document.getElementById('chanceCardDialog').style.display = 'none';
    }

    function checkChanceTile() {
        const chanceTiles = [7, 22, 36];
        if (chanceTiles.includes(player.position)) {
            showChanceDialog();
        }
    }

    function showChanceDialog() {
        const chanceNumber = Math.floor(Math.random() * 15) + 1;
        const chanceDialog = document.getElementById('chanceCardDialog');
        const chanceImage = document.getElementById('chanceCardImage');

        chanceImage.src = `Images/lottery${chanceNumber}.jpg`;
        chanceImage.alt = `Chance Card ${chanceNumber}`;

        document.getElementById('chanceCardNumber').textContent = `Chance Card ${chanceNumber}`;
        chanceDialog.style.display = 'block';
    }

    function buyProperty() {
        const purchaseCost = parseInt(document.getElementById('purchaseCost').textContent, 10);
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

    function rollDice(numDice) {
        let diceValue = 0;
        for (let i = 0; i < numDice; i++) {
            diceValue += Math.floor(Math.random() * 6) + 1;
        }

        if (player.inJail) {
            player.turnsInJail++;
            if (diceValue === 6 || diceValue === 7 || diceValue === 8) {
                alert(`Rolled a ${diceValue}! Whey the Van's Fixed!`);
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

    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(2);
    });

    document.getElementById('rollThreeDice').addEventListener('click', function() {
        rollDice(3);
    });

    document.getElementById('buyProperty').addEventListener('click', buyProperty);
    document.getElementById('moveOn').addEventListener('click', function() {
        hidePropertyDialog();
    });

    renderPlayer();
});
