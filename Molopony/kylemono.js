// JavaScript (script.js)

let canvas = document.getElementById("scratch");
let context = canvas.getContext("2d");

const init = () => {
    let gradientColor = context.createLinearGradient(0, 0, 135, 135);
    gradientColor.addColorStop(0, "#c3a3f1");
    gradientColor.addColorStop(1, "#6414e9");
    context.fillStyle = gradientColor;
    context.fillRect(0, 0, 200, 200);
};

// Initially mouse X and mouse Y positions are 0
let mouseX = 0;
let mouseY = 0;
let isDragged = false;

// Events for touch and mouse
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

// Detect touch device
const isTouchDevice = () => {
    try {
        // We try to create TouchEvent. It would fail for desktops and throw an error.
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

// Get left and top of canvas
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;

// Exact x and y position of mouse/touch
const getXY = (e) => {
    mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
    mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
};

isTouchDevice();

// Start Scratch
canvas.addEventListener(events[deviceType].down, (event) => {
    isDragged = true;
    // Get x and y position
    getXY(event);
    scratch(mouseX, mouseY);
});

// Mousemove/touchmove
canvas.addEventListener(events[deviceType].move, (event) => {
    if (!isTouchDevice()) {
        event.preventDefault();
    }
    if (isDragged) {
        getXY(event);
        scratch(mouseX, mouseY);
    }
});

// Stop drawing
canvas.addEventListener(events[deviceType].up, () => {
    isDragged = false;
});

// If mouse leaves the square
canvas.addEventListener("mouseleave", () => {
    isDragged = false;
});

const scratch = (x, y) => {
    // Destination-out draws new shapes behind the existing canvas content
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    // Arc makes circle - x,y,radius,start angle,end angle
    context.arc(x, y, 12, 0, 2 * Math.PI);
    context.fill();
};

window.onload = () => {
    init();
    // Hide the lottery dialog initially
    document.getElementById("lotteryDialog").style.display = "none";
    // Set random text initially
    setRandomText();
};

const textPairs = [
    { h3: "You left your van window open and someone stole your mobile", h4: "Pay v100" },
    { h3: "You found a rare collectible tea set at a village market. Sell it to collectors", h4: "Collect V50" },
    // Add more pairs here...
];

const setRandomText = () => {
    const randomIndex = Math.floor(Math.random() * textPairs.length);
    document.getElementById("h3Text").textContent = textPairs[randomIndex].h3;
    document.getElementById("h4Text").textContent = textPairs[randomIndex].h4;
};
