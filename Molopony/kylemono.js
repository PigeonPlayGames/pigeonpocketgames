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
        { h3: "Someone stole your mobile", h4: "Pay $100", outcome: function() { adjustMoney(-100); }},
        { h3: "You found a rare collectible", h4: "Collect $50", outcome: function() { adjustMoney(50); }},
        { h3: "Your team lost the championship", h4: "Pay $30", outcome: function() { adjustMoney(-30); }},
        { h3: "Impress neighbours", h4: "Collect $50 in donations", outcome: function() { adjustMoney(50); }},
        { h3: "Win a prize at the fair", h4: "Collect $100 and a blue ribbon", outcome: function() { adjustMoney(100); }},
    ];

    function adjustMoney(amount) {
        player.money += amount;
        updatePlayerInfo();
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

    function rollDice(numDice) {
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
                alert(`Rolled ${diceValue}! The Van Is Fixed!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert("Arf Finally The Van is Fixed!");
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

        if (player.position === 30) {
            goToJail();
        }

        renderPlayer();
        checkPropertyTile();
        checkLotteryTile(); // Check if player landed on a lottery tile
        checkCacheTile(); // Check if player landed on a cache tile
        updatePlayerInfo();
    }

    function goToJail() {
        player.position = 10; // Assuming tile 10 is the jail
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Uh oh PotHole, cannot not collect $200.");
        updatePlayerInfo();
        renderPlayer();
    }

    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    function getPositionX(position) {
        if (position < 5) {
            return 570 - (position * 55);
        } else if (position >= 5 && position < 10) {
            return 570 - (position * 55);
        } else if (position >= 10 && position < 20) {
            return 50;
        } else if (position >= 20 && position < 30) {
            return 50 + ((position - 20) * 50);
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

    function buyProperty() {
        const purchaseCostText = document.getElementById('purchaseCost').textContent;
        const purchaseCost = parseInt(purchaseCostText.replace('$', '').trim(), 10);

        console.log("Attempting to buy property for: " + purchaseCost); // Debug output
        console.log("Player's current money: " + player.money); // Debug output

        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo();
            alert('Property purchased!');
            displayOwnedProperties();  // Call the updated display function
            hidePropertyDialog();
        } else {
            alert("Not enough money to buy this property!");
        }
    }

    // Updated function to handle display of owned properties
    function displayOwnedProperties() {
        const propertiesList = document.getElementById('propertiesList');
        propertiesList.innerHTML = ''; // Clear existing display

        // Sort and display properties by sets
        player.ownedProperties.sort((a, b) => findSetOrder(a) - findSetOrder(b)).forEach(propertyIndex => {
            displayOwnedProperty(propertyIndex);
        });
    }

    function findSetOrder(propertyIndex) {
        // Find the first set that includes the property and return its index
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

    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    function checkLotteryTile() {
        const lotteryTiles = [7, 22, 36];
        if (lotteryTiles.includes(player.position)) {
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'block';
            setRandomOutcome();
        } else {
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'none';
        }
    }
        
    function checkCacheTile() {
        const cacheTiles = [3, 17, 33];
        if (cacheTiles.includes(player.position)) {
            const cacheDialog = document.getElementById('cacheDialog');
            cacheDialog.style.display = 'block';
            setRandomOutcome();
        } else {
            const cacheDialog = document.getElementById('cacheDialog');
            cacheDialog.style.display = 'none';
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

    renderPlayer(); // Initial render of player token
});
