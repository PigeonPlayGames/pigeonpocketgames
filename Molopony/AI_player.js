// AI Player properties
const aiPlayer = {
    position: 0,
    money: 2000,
    ownedProperties: [],
    inJail: false,
    turnsInJail: 0
};

// Function to simulate AI decisions and actions
function aiTurn() {
    rollDice(aiPlayer, 2); // AI rolls two dice
    setTimeout(() => {
        aiDecision(aiPlayer);
    }, 1000); // Simulate processing time
}

// AI decision-making logic
function aiDecision(aiPlayer) {
    // Decide whether to buy a property if landed on one
    let currentTile = aiPlayer.position;
    if (propertyTiles.includes(currentTile) && !aiPlayer.ownedProperties.includes(currentTile)) {
        if (aiPlayer.money > (propertyValues[currentTile] || 100)) {
            buyProperty(aiPlayer, currentTile);
        }
    }
}

// Export AI functions if using modules
export { aiPlayer, aiTurn, aiDecision };
