const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const currentPlayerEl = document.getElementById("currentPlayer");
const winnerMessage = document.getElementById("winnerMessage");
const restartBtn = document.getElementById("restartBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const confettiContainer = document.getElementById("confetti-container");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scoreX = 0;
let scoreO = 0;

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            highlightWinner(combo);
            break;
        }
    }

    if (roundWon) {
        winnerMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
        if (currentPlayer === "X") scoreX++; else scoreO++;
        scoreXEl.textContent = scoreX;
        scoreOEl.textContent = scoreO;
        gameActive = false;
        triggerConfetti();
        return;
    }

    if (!gameState.includes("")) {
        winnerMessage.textContent = "It's a Draw! 🤝";
        gameActive = false;
        shakeBoard();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerEl.textContent = currentPlayer;
}

function highlightWinner(combo) {
    combo.forEach(i => cells[i].classList.add("winner"));
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    winnerMessage.textContent = "";
    currentPlayerEl.textContent = currentPlayer;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
    confettiContainer.innerHTML = "";
    board.style.transform = "";
}

function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-piece");
        confetti.style.backgroundColor = `hsl(${Math.random() * 360},70%,60%)`;
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.animationDuration = (2 + Math.random() * 2) + "s";
        confettiContainer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

function shakeBoard() {
    board.style.transition = "transform 0.1s";
    board.style.transform = "translateX(-10px)";
    setTimeout(() => board.style.transform = "translateX(10px)", 100);
    setTimeout(() => board.style.transform = "translateX(0px)", 200);
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
