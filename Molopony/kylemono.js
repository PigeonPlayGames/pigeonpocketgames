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

    // Function to draw dice on the canvas
    function drawDice(number) {
        const size = 20; // Size of each die face
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

        for (let i = 0; i < number.length; i++) {
            const xOffset = 30 * i;
            ctx.strokeRect(10 + xOffset, 10, size, size);
            drawDieDots(10 + xOffset, 10, number[i]);
        }
    }

    // Helper function to draw dots on the dice
    function drawDieDots(x, y, num) {
        const dotPositions = [
            [],
            [[x + 10, y + 10]], // For 1
            [[x + 3, y + 3], [x + 17, y + 17]], // For 2
            [[x + 3, y + 3], [x + 10, y + 10], [x + 17, y + 17]], // For 3
            [[x + 3, y + 3], [x + 17, y + 3], [x + 3, y + 17], [x + 17, y + 17]], // For 4
            [[x + 3, y + 3], [x + 17, y + 3], [x + 10, y + 10], [x + 3, y + 17], [x + 17, y + 17]], // For 5
            [[x + 3, y + 3], [x + 17, y + 3], [x + 3, y + 10], [x + 17, y + 10], [x + 3, y + 17], [x + 17, y + 17]] // For 6
        ];

        ctx.fillStyle = 'black';
        dotPositions[num].forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot[0], dot[1], 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Function to handle dice rolling logic
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

    // Function to move the player around the board
    function movePlayer(spaces) {
        let oldPosition = player.position;
        player.position = (player.position + spaces) % boardSize;
        if (player.position < 0) player.position += boardSize; // Adjust for negative movement

        if (oldPosition > player.position && spaces > 0) {
            player.money += passGoMoney;
            alert("You passed GO! Collect £200.");
        }

        renderPlayer();
        checkPropertyTile();
        checkLotteryTile(); // Check if player landed on a lottery tile
        updatePlayerInfo();
    }

    // Function to update the rendering of the player's token on the board
    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    // Helper functions to calculate player's position
    function getPositionX(position) {
        if (position < 10) {
            return 570 - (position * 55);
        } else if (position >= 10 && position < 20) {
            return 50;
        } else if (position >= 20 and position < 30) {
            return 50 + ((position - 20) * 55);
        } else {
            return 570;
        }
    }

    function getPositionY(position) {
        if (position < 10) {
            return 570;
        } else if (position >= 10 and position < 20) {
            return 570 - ((position - 10) * 55);
        } else if (position >= 20 and position < 30) {
            return 50;
        } else {
            return 50 + ((position - 30) * 55);
        }
    }

    // Property checking logic
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

    // Function to handle property purchase
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

    // Display owned properties
    function displayOwnedProperty(propertyIndex) {
        const propertiesList = document.getElementById('propertiesList');
        const propertyCard = document.createElement('div');
        propertyCard.className = 'ownedPropertyCard';
        propertyCard.textContent = `Property ${propertyIndex}`;
        propertiesList.appendChild(propertyCard);
    }

    // Update player info on UI
    function updatePlayerInfo() {
        document.getElementById('playerPosition').textContent = player.position;
        document.getElementById('playerMoney').textContent = `£${player.money}`;
    }

    // Check for landing on lottery tiles
    function checkLotteryTile() {
        const lotteryTiles = [7, 22, 36];
        if (lotteryTiles.includes(player.position)) {
            // Player has landed on a lottery tile
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'block';
            setRandomText(); // Set random text for the lottery card
        } else {
            // Player has not landed on a lottery tile
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'none';
        }
    }

    // Set random text and effects for lottery cards
    const setRandomText = () => {
        const textPairs = [
            { h3: "You left your van window open and someone stole your mobile", h4: "Pay £100", effect: -100 },
            { h3: "You found a rare collectible tea set at a village market. Sell it to collectors", h4: "Collect £50", effect: 50 },
            { h3: "You attend university in Oxford because of your academic achievements.", h4: "Move forward 3 spaces", effect: 'moveForward3' },
            { h3: "Your stuck in London traffic during rush hour.", h4: "Move back 3 spaces", effect: 'moveBack3' },
            { h3: "You visit Stonehenge and experience its magic.", h4: "Advance to launch!", effect: 'goToLaunch' },
            // Add more pairs here...
        ];
        const randomIndex = Math.floor(Math.random() * textPairs.length);
        const selectedPair = textPairs[randomIndex];

        document.getElementById("h3Text").textContent = selectedPair.h3;
        document.getElementById("h4Text").textContent = selectedPair.h4;

        // Check if the effect is a number (financial change) or a string (special action)
        if (typeof selectedPair.effect === 'number') {
            player.money += selectedPair.effect;
            updatePlayerInfo();
        } else if (typeof selectedPair.effect === 'string') {
            handleSpecialEffect(selectedPair.effect);
        }
    };

    // Handle special effects like movement or going to a specific place
    function handleSpecialEffect(effect) {
        switch (effect) {
            case 'moveForward3':
                movePlayer(3);
                break;
            case 'moveBack3':
                movePlayer(-3); // Ensure movePlayer can handle negative values correctly
                break;
            case 'goToLaunch':
                player.position = 0; // Assuming position 0 is 'Launch'
                renderPlayer();
                break;
            default:
                console.log('No effect');
        }
    }

    // Event listeners for dice rolling and property actions
    document.getElementById('rollDice').addEventListener('click', function() {
        rollDice(2);
    });

    document.getElementById('rollThreeDice').addEventListener('click', function() {
        rollDice(3);
    });

    document.getElementById('buyProperty').addEventListener('click', buyProperty);
    document.getElementById('moveOn').addEventListener('click', hidePropertyDialog);

    renderPlayer(); // Render player token initially
});
