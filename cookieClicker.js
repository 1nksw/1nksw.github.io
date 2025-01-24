let cookies = 0;
let multiplier = 1;
let autoClicks = 0;
let diamonds = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let dailyStreak = JSON.parse(localStorage.getItem("dailyStreak")) || 0;
let lastLogin = new Date(localStorage.getItem("lastLogin")) || new Date(0);

function updateStats() {
    document.getElementById("cookieCount").innerText = cookies;
    document.getElementById("multiplier").innerText = multiplier;
    document.getElementById("autoClicks").innerText = autoClicks;
    document.getElementById("diamondCount").innerText = diamonds;
}

function startGame() {
    const playerName = document.getElementById("playerName").value.trim();
    if (!playerName) {
        alert("Please enter a name to start the game.");
        return;
    }
    localStorage.setItem("playerName", playerName);
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("game").style.display = "block";
    dailyLogin();
    updateStats();
    updateLeaderboard();
}

document.getElementById("cookie").addEventListener("click", function () {
    cookies += multiplier;
    updateStats();
    updateLeaderboard();
});

function buyMultiplier() {
    const messageElement = document.getElementById("multiplierMessage");
    if (cookies >= multiplierCost) {
        cookies -= multiplierCost;
        multiplier++;
        multiplierCost = Math.floor(multiplierCost * 1.5);
        messageElement.textContent = "";
        updateStats();
        updateLeaderboard();
    } else {
        messageElement.textContent = `You need ${multiplierCost - cookies} more cookies to buy a multiplier!`;
    }
}

function buyAutoClicker() {
    const messageElement = document.getElementById("autoClickerMessage");
    if (cookies >= autoClickerCost) {
        cookies -= autoClickerCost;
        autoClicks++;
        autoClickerCost = Math.floor(autoClickerCost * 2);
        messageElement.textContent = "";
        updateStats();
        updateLeaderboard();
    } else {
        messageElement.textContent = `You need ${autoClickerCost - cookies} more cookies to buy an auto clicker!`;
    }
}

function autoClick() {
    cookies += autoClicks * 0.1;
    updateStats();
    updateLeaderboard();
}

function dailyLogin() {
    const now = new Date();
    const timeDiff = now - lastLogin;
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDiff >= oneDay) {
        dailyStreak++;
        lastLogin = now;
        localStorage.setItem("dailyStreak", dailyStreak);
        localStorage.setItem("lastLogin", now);
        const dailyReward = 10 + dailyStreak * 0.1;
        diamonds += dailyReward;
        alert(`You've received ${dailyReward} diamonds for your daily login!`);
        updateStats();
    }
}

function claimReward() {
[_{{{CITATION{{{_1{](https://github.com/RyanMichaelNasalinas/PHP_Cheat_Sheet/tree/1552294aaa4820206fcc61a004128ec5c2aba7ba/Lesson3%2Fcookie_test.php)
