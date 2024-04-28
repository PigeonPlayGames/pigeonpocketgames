document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 40;
    const passGoMoney = 200; // Money awarded for passing 'Go'
    const player = {
        position: 0,
        money: 1500, // Starting money
        ownedProperties: [], // Array to store owned properties
        inJail: false, // Indicates if the player is currently in jail
        turnsInJail: 0 // Counts how many turns the player has been in jail
    };

    const canvas = document.getElementById('diceCanvas');
    const ctx = canvas.getContext('2d');

    function drawDice(number) {
        const size = 20; // Size of each die face
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

        for (let i = 0; i < number.length; i++) {
            const xOffset = 30 * i;
            ctx.strokeRect(10 + xOffset, 10, size, size);
            drawDieDots(10 + xOffset, 10, number[i]);
        }
    }

    function drawDieDots(x, y, num) {
        const dotPositions = [
            [],
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

        renderPlayer();
        checkPropertyTile();
        checkLotteryTile(); // Check if player landed on a lottery tile
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
        const purchaseCost = parseInt(document.getElementById('purchaseCost').textContent.replace('$', ''), 10);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo();
            alert('Property purchased!');
            displayOwnedProperty(player.position);
            hidePropertyDialog();
        } else {
            alert("Not enough money to buy this property!");
        }
    }

    function displayOwnedProperty(propertyIndex) {
        const propertiesList = document.getElementById('propertiesList');
        const propertyCard = document.createElement('div');
        propertyCard.className = 'ownedPropertyCard';
        propertyCard.textContent = `Property ${propertyIndex}`;
        propertiesList.appendChild(propertyCard);
    }

    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = player.money;
    }

    // Function to check if player has landed on a lottery tile
    function checkLotteryTile() {
        const lotteryTiles = [7, 22, 36];
        if (lotteryTiles.includes(player.position)) {
            // Player has landed on a lottery tile
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'block';
        } else {
            // Player has not landed on a lottery tile
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'none';
        }
    }

    // Call the setRandomText function after the window has loaded
    window.onload = () => {
        init();
        setRandomText();
    };

    // Function to set random text for the lottery card
    const setRandomText = () => {
        const textPairs = [
            { h3: "You left your van window open and someone stole your mobile", h4: "Pay v100" },
            { h3: "You found a rare collectible tea set at a village market. Sell it to collectors", h4: "Collect V50" },
            { h3: "Your favourite football team looses the championship.. you bet at the bookies lost!", h4: "Pay V30." },
            { h3: "Your garden party impresses your neighbours with your homemade scones.", h4: "Collect V50 in donations" },
            { h3: "Your homemade jam wins first prize at the fair.", h4: "Collect V100 and a blue ribbon" },
            { h3: "You attend university in Oxford because of your academic achievements.", h4: "Move forward 3 spaces" },
            { h3: "Your stuck in London traffic during rush hour.", h4: "Move back 3 spaces" },
            { h3: "You visit Stonehenge and experience its magic. For your spiritual journey.", h4: "Advance to launch!" },
            { h3: "Attend a traditional English tea ceremony at Harrods for a delightful afternoon treat.", h4: "Move forward three spaces" },
            { h3: "Take a scenic train ride through the Lake District and find a 50 Ven note on the train!", h4: "Collect V50!" },
            { h3: "Tea Import Duty: You've been caught with an illegal shipment of tea at the docks.", h4: "Pay V50 to each player as a customs duty!" },
            { h3: "Historic Castle Repair: One of your historic castles needs urgent repairs after a storm. Other players come to your aid with supplies and workers.", h4: "Pay V50 to each player!" },
            { h3: "You organize a fundraiser for the National Well-being Service (NWS). Healthcare services fee.", h4: "Collect V50 from each player!" },
            { h3: "You bump into a Local Celebrity, gain influence ", h4: "1 Free Pothole Repair" },
            { h3: "You Encounter a sudden downpour during a countryside stroll. You must seek shelter from the rain.", h4: "Move back 3 spaces" }
            // Add more pairs here...
        ];
        const randomIndex = Math.floor(Math.random() * textPairs.length);
        document.getElementById("h3Text").textContent = textPairs[randomIndex].h3;
        document.getElementById("h4Text").textContent = textPairs[randomIndex].h4;
    };

    // Event listeners for rolling dice and buying property
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
