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

    const canvas = document.getElementById('diceCanvas');
    const ctx = canvas.getContext('2d');

    function drawDice(number) {
        const size = 20; // Size of each die face
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

        // Determine how many dice to draw based on number
        for (let i = 0; i < number.length; i++) {
            const xOffset = 30 * i;
            // Draw each die
            ctx.strokeRect(10 + xOffset, 10, size, size);
            // Draw dots based on the roll
            drawDieDots(10 + xOffset, 10, number[i]);
        }
    }

    function drawDieDots(x, y, num) {
        const dotPositions = [
            [], // No zero index
            [[x+10, y+10]], // For 1
            [[x+3, y+3], [x+17, y+17]], // For 2
            [[x+3, y+3], [x+10, y+10], [x+17, y+17]], // For 3
            [[x+3, y+3], [x+17, y+3], [x+3, y+17], [x+17, y+17]], // For 4
            [[x+3, y+3], [x+17, y+3], [x+10, y+10], [x+3, y+17], [x+17, y+17]], // For 5
            [[x+3, y+3], [x+17, y+3], [x+3, y+10], [x+17, y+10], [x+3, y+17], [x+17, y+17]], // For 6
        ];

        ctx.fillStyle = 'black';
        dotPositions[num].forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot[0], dot[1], 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function rollDice(numDice) {
        let diceValue = 0;
        let diceRolls = []; // Array to keep track of each dice roll
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceRolls.push(roll);
            diceValue += roll;
        }

        drawDice(diceRolls); // Draw the rolled dice on the canvas

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

    function movePlayer(spaces) {
        let oldPosition = player.position;
        player.position = (player.position + spaces) % boardSize;
        
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

    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

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

    function checkSpecialTiles() {
        if (player.position === 30) {
            sendToJail();
        }
    }

    function sendToJail() {
        player.position = 10;
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Sent to jail!");
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

    function hidePropertyDialog() {
        document.getElementById('propertyDialog').style.display = 'none';
    }

    function checkChanceTile() {
        const chanceTiles = [7, 22, 36];
        if (chanceTiles.includes(player.position)) {
            showChanceDialog();
        }
    }

    function showChanceDialog() {
        const chanceNumber = Math.floor(Math.random() * 15) + 1; // Get a random chance card number
        const chanceDialog = document.getElementById('chanceCardDialog');
        const chanceImage = document.getElementById('chanceCardImage');

        chanceImage.src = `Images/chancecard${chanceNumber}.jpg`;
        chanceImage.alt = `Chance Card ${chanceNumber}`;
        document.getElementById('chanceCardNumber').textContent = `Chance Card ${chanceNumber}`;

        chanceDialog.style.display = 'block';
    }

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
