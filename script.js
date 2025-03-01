const gameArea = document.getElementById('game-area');
const river = document.getElementById('river');
const frog = document.getElementById('frog');
const inputBox = document.getElementById('input-box');
const scoreDisplay = document.getElementById('score');
const correctDisplay = document.getElementById('correct');
const wrongDisplay = document.getElementById('wrong');
const totalDisplay = document.getElementById('total');
const timeUsedDisplay = document.getElementById('time-used');
let score = 0;
let correct = 0;
let wrong = 0;
let total = 0;
let currentLeaf = null;
let gameSpeed = 2000; // Initial speed of leaves (2 seconds)
let startTime = null; // Track start time
let timerInterval = null; // Timer interval

// Sound effects
const correctSound = new Audio('correct.mp3'); // Add a correct sound file
const wrongSound = new Audio('wrong.mp3'); // Add a wrong sound file

function generateMathProblem() {
    const type = Math.random() > 0.5 ? 'multiplication' : 'division';
    if (type === 'multiplication') {
        const num1 = Math.floor(Math.random() * 90) + 10; // Random number between 10 and 99
        const num2 = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
        return {
            problem: `${num1} × ${num2}`,
            answer: num1 * num2
        };
    } else {
        let num1, num2, answer;
        do {
            num1 = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
            num2 = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
            answer = num1 / num2;
        } while (!Number.isInteger(answer)); // Ensure division is exact
        return {
            problem: `${num1} ÷ ${num2}`,
            answer: answer
        };
    }
}

function createLeaf() {
    if (total >= 30) {
        endGame();
        return;
    }

    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    const { problem, answer } = generateMathProblem();
    leaf.textContent = problem;
    leaf.dataset.answer = answer; // Store the correct answer in a data attribute
    leaf.style.left = `${Math.random() * (gameArea.offsetWidth - 150)}px`;
    leaf.style.top = '0';
    river.appendChild(leaf);

    // Move leaf down
    const fallInterval = setInterval(() => {
        const top = parseInt(leaf.style.top, 10);
        if (top >= gameArea.offsetHeight - 50) {
            clearInterval(fallInterval);
            leaf.style.top = `${gameArea.offsetHeight - 50}px`; // Stop at the bottom
        } else {
            leaf.style.top = `${top + 5}px`;
        }
    }, 100);

    currentLeaf = leaf;
    total++;
    totalDisplay.textContent = total;
}

function checkInput(event) {
    if (event.key !== 'Enter') return; // Only proceed if Enter key is pressed

    const userAnswer = parseInt(inputBox.value.trim(), 10);
    const correctAnswer = parseInt(currentLeaf.dataset.answer, 10);
    if (userAnswer === correctAnswer) {
        score++;
        correct++;
        scoreDisplay.textContent = score;
        correctDisplay.textContent = correct;
        currentLeaf.classList.add('correct');
        correctSound.play(); // Play correct sound
        setTimeout(() => {
            river.removeChild(currentLeaf);
            moveFrog();
            increaseDifficulty();
            createLeaf();
        }, 500); // Wait for color change animation
    } else {
        wrong++;
        wrongDisplay.textContent = wrong;
        currentLeaf.classList.add('wrong');
        wrongSound.play(); // Play wrong sound
    }
    inputBox.value = '';
}

function moveFrog() {
    const leafLeft = parseInt(currentLeaf.style.left, 10);
    frog.style.left = `${leafLeft + 75}px`;
}

function increaseDifficulty() {
    if (score % 3 === 0 && gameSpeed > 500) {
        gameSpeed -= 200;
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const timeUsed = Math.floor((Date.now() - startTime) / 1000);
        timeUsedDisplay.textContent = timeUsed;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval); // Stop the timer
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    alert(`Game Over!\nCorrect: ${correct}\nWrong: ${wrong}\nTime Used: ${timeUsed} seconds`);
    resetGame();
}

function resetGame() {
    score = 0;
    correct = 0;
    wrong = 0;
    total = 0;
    scoreDisplay.textContent = score;
    correctDisplay.textContent = correct;
    wrongDisplay.textContent = wrong;
    totalDisplay.textContent = total;
    timeUsedDisplay.textContent = 0;
    gameSpeed = 2000;
    frog.style.left = '50%';
    river.innerHTML = '';
    inputBox.value = '';
    startTimer(); // Restart the timer
    createLeaf();
}

inputBox.addEventListener('keypress', checkInput);
document.addEventListener('DOMContentLoaded', () => {
    startTimer(); // Start the timer when the game loads
    createLeaf();
});