document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 40;
    const passGoMoney = 200;
    const player = {
        position: 0,
        money: 2000,
        ownedProperties: [],
        inJail: false,
        turnsInJail: 0
    };

    // Define AI player with similar structure
    const aiPlayer = {
        position: 0,
        money: 2000,
        ownedProperties: [],
        inJail: false,
        turnsInJail: 0
    };

    const propertySets = {
        "Brown": [1, 3],
        "Light Blue": [6, 8, 9],
        "Pink": [11, 13, 14],
        "Orange": [16, 18, 19],
        "Red": [21, 23, 24],
        "Yellow": [26, 27, 29],
        "Green": [31, 32, 34],
        "Dark Blue": [37, 39]
    };

    const canvas = document.getElementById('diceCanvas');
    const ctx = canvas.getContext('2d');

    const textPairs = [
        { h3: "Someone stole your mobile", h4: "Pay $100", outcome: function() { adjustMoney(player, -100); }},
        { h3: "You found a rare collectible", h4: "Collect $50", outcome: function() { adjustMoney(player, 50); }},
        { h3: "Your team lost the championship", h4: "Pay $30", outcome: function() { adjustMoney(player, -30); }},
        { h3: "Impress neighbours", h4: "Collect $50 in donations", outcome: function() { adjustMoney(player, 50); }},
        { h3: "Win a prize at the fair", h4: "Collect $100 and a blue ribbon", outcome: function() { adjustMoney(player, 100); }},
    ];

    function adjustMoney(player, amount) {
        player.money += amount;
        updatePlayerInfo(player);
    }

    const setRandomOutcome = () => {
        const randomIndex = Math.floor(Math.random() * textPairs.length);
        const pair = textPairs[randomIndex];
        document.getElementById("h3Text").textContent = pair.h3;
        document.getElementById("h4Text").textContent = pair.h4;
        pair.outcome();
    };

    function drawDice(number) {
        const size = 20;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < number.length; i++) {
            const xOffset = 30 * i;
            ctx.strokeRect(10 + xOffset, 10, size, size);
            drawDieDots(10 + xOffset, 10, number[i]);
        }
    }

    function drawDieDots(x, y, num) {
        const dotPositions = [
            [],
            [[x+10, y+10]],
            [[x+3, y+3], [x+17, y+17]],
            [[x+3, y+3], [x+10, y+10], [x+17, y+17]],
            [[x+3, y+3], [x+17, y+3], [x+3, y+17], [x+17, y+17]],
            [[x+3, y+3], [x+17, y+3], [x+10, y+10], [x+3, y+17], [x+17, y+17]],
            [[x+3, y+3], [x+17, y+3], [x+3, y+10], [x+17, y+10], [x+3, y+17], [x+17, y+17]],
        ];
        ctx.fillStyle = 'black';
        dotPositions[num].forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot[0], dot[1], 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function rollDice(player, numDice) {
        let diceValue = 0;
        let diceRolls = [];
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceRolls.push(roll);
            diceValue += roll;
        }

        drawDice(diceRolls);

        if (player.inJail) {
            player.turnsInJail++;
            if (diceValue === 6 || diceValue === 7 || diceValue === 8) {
                alert(`Rolled ${diceValue}! ${player === aiPlayer ? "AI" : "You"} are free from jail!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert(`${player === aiPlayer ? "AI" : "You"} are free from jail finally!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else {
                alert(`${player === aiPlayer ? "AI" : "You"} are still in jail. Rolled a ${diceValue}.`);
                return; // Skip moving if still in jail
            }
        }

        movePlayer(player, diceValue);
    }

        function movePlayer(player, spaces) {
        let oldPosition = player.position;
        player.position = (player.position + spaces) % boardSize;

        if (oldPosition + spaces >= boardSize) {
            player.money += passGoMoney;
            alert(`${player === aiPlayer ? "AI" : "You"} passed GO! Collect $200.`);
        }

        if (player.position === 30) {
            goToJail(player);
        }

        renderPlayer(player);
        checkPropertyTile(player);
        checkLotteryTile(player);
        checkCacheTile(player);
        updatePlayerInfo(player);
    }

    function goToJail(player) {
        player.position = 10;
        player.inJail = true;
        player.turnsInJail = 0;
        alert(`${player === aiPlayer ? "AI" : "You"} hit a pothole! Going to jail, cannot collect $200.`);
        updatePlayerInfo(player);
        renderPlayer(player);
    }

    function renderPlayer(player) {
        const playerToken = document.getElementById(player === aiPlayer ? 'aiToken' : 'playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    function checkPropertyTile(player) {
        const propertyTiles = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
        if (propertyTiles.includes(player.position) && !player.ownedProperties.includes(player.position)) {
            if (player === aiPlayer) {
                // AI decision logic for buying properties
                aiDecideToBuyProperty(player);
            } else {
                const propertyDialog = document.getElementById('propertyDialog');
                const propertyNumber = player.position;
                const purchaseCost = 100 + (propertyNumber * 5);
                document.getElementById('propertyNumber').textContent = propertyNumber;
                document.getElementById('purchaseCost').textContent = `$${purchaseCost}`;
                const propertyImage = document.getElementById('propertyImage');
                propertyImage.src = `Images/property${propertyNumber}.jpg`;
                propertyImage.alt = `Property ${propertyNumber}`;
                propertyDialog.style.display = 'block';
            }
        }
    }

    function aiDecideToBuyProperty(player) {
        const propertyNumber = player.position;
        const purchaseCost = 100 + (propertyNumber * 5);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            console.log("AI bought property " + propertyNumber);
        }
    }

    function buyProperty() {
        const purchaseCostText = document.getElementById('purchaseCost').textContent;
        const purchaseCost = parseInt(purchaseCostText.replace('$', '').trim(), 10);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo(player);
            alert('Property purchased!');
            displayOwnedProperties(); // Call the updated display function
            hidePropertyDialog();
        } else {
            alert("Not enough money to buy this property!");
        }
    }

    function displayOwnedProperties() {
        const propertiesList = document.getElementById('propertiesList');
        propertiesList.innerHTML = '';
        player.ownedProperties.sort((a, b) => findSetOrder(a) - findSetOrder(b)).forEach(propertyIndex => {
            displayOwnedProperty(propertyIndex);
        });
    }

    function findSetOrder(propertyIndex) {
        for (const [set, properties] of Object.entries(propertySets)) {
            if (properties.includes(propertyIndex)) {
                return properties[0];
            }
        }
        return Infinity; // Return a large number if property is not found in any set
    }

    function displayOwnedProperty(propertyIndex) {
        const propertiesList = document.getElementById('propertiesList');
        const propertyCard = document.createElement('div');
        propertyCard.className = 'ownedPropertyCard';
        const propertyImage = document.createElement('img');
        propertyImage.src = `Images/property${propertyIndex}.jpg`;
        propertyImage.alt = `Property ${propertyIndex}`;
        propertyImage.style.width = "100%";
        propertyImage.style.height = "auto";
        const propertyText = document.createElement('p');
        propertyText.textContent = `Property ${propertyIndex}`;
        propertyCard.appendChild(propertyImage);
        propertyCard.appendChild(propertyText);
        propertiesList.appendChild(propertyCard);
    }

    function updatePlayerInfo(player) {
        const positionDisplay = document.getElementById(player === aiPlayer ? 'aiPosition' : 'playerPosition');
        const moneyDisplay = document.getElementById(player === aiPlayer ? 'aiMoney' : 'playerMoney');
        positionDisplay.textContent = player.position;
        moneyDisplay.textContent = player.money;
    }

    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(player, 2);
        setTimeout(() => rollDice(aiPlayer, 2), 1000); // Simulate AI's turn after the player's turn
    });

    renderPlayer(player);
    renderPlayer(aiPlayer);
});
