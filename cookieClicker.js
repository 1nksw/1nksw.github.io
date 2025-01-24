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
    const multiplierCost = document.getElementById("multiplierCost").innerText;
    if (cookies >= multiplierCost) {
        cookies -= multiplierCost;
        multiplier++;
        document.getElementById("multiplierCost").innerText = Math.floor(multiplierCost * 1.5);
        messageElement.textContent = "";
        updateStats();
        updateLeaderboard();
    } else {
        messageElement.textContent = `You need ${multiplierCost - cookies} more cookies to buy a multiplier!`;
    }
}

function buyAutoClicker() {
    const messageElement = document.getElementById("autoClickerMessage");
    const autoClickerCost = document.getElementById("autoClickerCost").innerText;
    if (cookies >= autoClickerCost) {
        cookies -= autoClickerCost;
        autoClicks++;
        document.getElementById("autoClickerCost").innerText = Math.floor(autoClickerCost * 2);
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
    const robloxUsername = document.getElementById('robloxUsername').value;
    const gamepassLink = document.getElementById('gamepassLink').value;

    if (robloxUsername && gamepassLink && diamonds >= 1000) {
        diamonds -= 1000;
        updateStats();

        // Webhook message
        const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';
        const message = {
            content: `${robloxUsername} has claimed a reward!`,
            embeds: [{
                title: "Reward Claimed",
                description: `Roblox Username: ${robloxUsername}\nGamepass Link: ${gamepassLink}`,
                color: 65280  // green color
            }]
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        }).then(response => console.log('Webhook message sent'))
        .catch(error => console.error('Error sending webhook message:', error));
    } else {
        alert('Please enter valid information and ensure you have enough diamonds.');
    }
}

function updateLeaderboard() {
    const playerName = localStorage.getItem("playerName");
    const playerIndex = leaderboard.findIndex(player => player.name === playerName);

    if (playerIndex > -1) {
        leaderboard[playerIndex].score = Math.floor(cookies);
    } else {
        leaderboard.push({ name: playerName, score: Math.floor(cookies) });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    const leaderboardList = document.getElementById("leaderboardList");
    if (leaderboardList) {
        leaderboardList.innerHTML = "";
        leaderboard.forEach(player => {
            const listItem = document.createElement("li");
            listItem.textContent = `${player.name}: ${player.score} cookies`;
            leaderboardList.appendChild(listItem);
        });
    }
}

function toggleHamburgerMenu() {
    const menuContent = document.querySelector(".hamburger-menu-content");
    if (menuContent.style.display === "block") {
        menuContent.style.display = "none";
    } else {
        menuContent.style.display = "block";
    }
}

setInterval(autoClick, 1000); // Auto clicks every second
