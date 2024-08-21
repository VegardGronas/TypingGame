const inputField = document.getElementById("inputField");
const wordToWriteDisplay = document.getElementById("word");
const timeDisplay = document.getElementById("time-display");
const delayStartDisplay = document.getElementById("start-time-delay");

const wordsDisplay = document.getElementById("words-display");
const wpmDisplay = document.getElementById("wpm-display");

let points = 0;
let started = false;
let startTime = 0;
let currentTime = 0;
let gameDuration = 60; // Game duration in seconds
let delayStartTime = 2; // Delay start time in seconds

function start() {
    points = 0;
    startTime = new Date().getTime();
    delayStart();
}

function delayStart() {
    if (started) return;

    // Calculate elapsed time in milliseconds
    const now = new Date().getTime();
    const elapsedTime = (now - startTime) / 1000; // Convert to seconds

    // Format the result as MM:SS
    const formattedTime = formatTime(elapsedTime);

    console.log(elapsedTime);

    delayStartDisplay.innerHTML = formattedTime;

    if (elapsedTime >= delayStartTime) {
        setRandomWord();
        started = true;
        startTime = new Date().getTime();
        update();
    } else {
        requestAnimationFrame(delayStart);
    }
}

function update() {
    if (!started) return;

    // Calculate elapsed time in milliseconds
    const now = new Date().getTime();
    currentTime = (now - startTime) / 1000; // Convert to seconds

    // Format the result as MM:SS
    const formattedTime = formatTime(currentTime);
    timeDisplay.innerHTML = formattedTime;

    const wpm = (points / (currentTime / 60)).toFixed(2);
    wpmDisplay.innerHTML = wpm;

    if (currentTime >= gameDuration) {
        started = false;
        // Optionally, you can add code here to handle end of game
    } else {
        requestAnimationFrame(update);
    }
}

function onInputEnter() {
    if (!started) return;

    // Access the value of the input field
    const inputValue = inputField.value.trim();
    const currentWord = word.innerHTML;

    if (inputValue === currentWord) {
        setRandomWord();
        wordCompleted();
        inputField.value = "";
    }
}

function setRandomWord() {
    fetch('/words')
        .then(response => response.json())
        .then(word => {
            wordToWriteDisplay.innerHTML = word;
        })
        .catch(error => {
            console.error('Error fetching word:', error);
        });
}


function wordCompleted() {
    points++;
    wordsDisplay.innerHTML = points;
    // Calculate WPM (Words Per Minute)
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
