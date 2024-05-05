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

    // Define the array of text pairs with outcomes
    const textPairs = [
        { h3: "Someone stole your mobile", h4: "Pay $100", outcome: function() { adjustMoney(-100); } },
        { h3: "You found a rare collectible", h4: "Collect $50", outcome: function() { adjustMoney(50); } },
        { h3: "Your team lost the championship", h4: "Pay $30", outcome: function() { adjustMoney(-30); } },
        { h3: "Impress neighbours", h4: "Collect $50 in donations", outcome: function() { adjustMoney(50); } },
        { h3: "Win a prize at the fair", h4: "Collect $100 and a blue ribbon", outcome: function() { adjustMoney(100); } },
        // Add more pairs as needed
    ];

    // Function to adjust player money
    function adjustMoney(amount) {
        player.money += amount;
        updatePlayerInfo();
    }

    // Modified function to set random text and execute outcome
    const setRandomOutcome = () => {
        const randomIndex = Math.floor(Math.random() * textPairs.length);
        const pair = textPairs[randomIndex];
        document.getElementById("h3Text").textContent = pair.h3;
        document.getElementById("h4Text").textContent = pair.h4;
        pair.outcome(); // Execute the outcome function
    };

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
                alert(`Rolled ${diceValue}! The Van Is Fixed!`);
                player.inJail = false;
                player.turnsInJail = 0;
            } else if (player.turnsInJail >= 3) {
                alert("Arf Finaly The Van is Fixed!");
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

    // Check for passing 'Go'
    if (oldPosition + spaces >= boardSize) {
        player.money += passGoMoney;
        alert("You passed GO! Collect $200.");
    }

    // Check if landed on the 'Go to Jail' tile, which is tile 30
    if (player.position === 30) {
        goToJail();
    }

    renderPlayer();
    checkPropertyTile();
    checkLotteryTile(); // Check if player landed on a lottery tile
    updatePlayerInfo();
    }

    // Function to handle the 'Go to Jail' event
    function goToJail() {
        player.position = 10; // Assuming tile 10 is the jail
        player.inJail = true;
        player.turnsInJail = 0;
        alert("Uh oh PotHole, cannot not collect $200.");
        updatePlayerInfo(); // Refresh player info display
        renderPlayer(); // Update player token position
    }


    function renderPlayer() {
        const playerToken = document.getElementById('playerToken');
        playerToken.style.left = `${getPositionX(player.position)}px`;
        playerToken.style.top = `${getPositionY(player.position)}px`;
    }

    function getPositionX(position) {
        if (position < 10) {
            return 570 - (position * 50);
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
        const purchaseCost = parseInt(document.getElementById('purchaseCost').textContent.replace('$', ''), 10);
        if (player.money >= purchaseCost) {
            player.money -= purchaseCost;
            player.ownedProperties.push(player.position);
            updatePlayerInfo();
            alert('Property purchased!');
            displayOwnedProperty(player.position);
            hidePropertyDialog();
        } else {
            alert("Not enough money to buy this Cheif!");
        }
    }

    function displayOwnedProperty(propertyIndex) {
        const propertiesList = document.getElementById('propertiesList');
        const propertyCard = document.createElement('div');
        propertyCard.className = 'ownedPropertyCard';

    // Create an image element for the property
        const propertyImage = document.createElement('img');
        propertyImage.src = `Images/property${propertyIndex}.jpg`; // Ensure the path matches your images directory
        propertyImage.alt = `Property ${propertyIndex}`;
        propertyImage.style.width = "100%"; // Make the image fit the card
        propertyImage.style.height = "auto"; // Maintain aspect ratio

    // Add a caption or any additional text if needed
        const propertyText = document.createElement('p');
        propertyText.textContent = `Property ${propertyIndex}`;

    // Append the image and text to the property card
        propertyCard.appendChild(propertyImage);
        propertyCard.appendChild(propertyText);

    // Append the property card to the list of owned properties
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
            setRandomOutcome(); // Set random outcome for the lottery card
        } else {
            // Player has not landed on a lottery tile
            const lotteryDialog = document.getElementById('lotteryDialog');
            lotteryDialog.style.display = 'none';
        }
    }

    // Event listeners for buttons
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
