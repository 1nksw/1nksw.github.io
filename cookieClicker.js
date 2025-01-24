let cookies = 0;
let multiplier = 1;
let autoClicks = 0;
let diamonds = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let dailyStreak = JSON.parse(localStorage.getItem("dailyStreak")) || 0;
let lastLogin = new Date(localStorage.getItem("lastLogin")) || new Date(0);

let dailyQuests = [
    { description: "Click the cookie 100 times", reward: 10, completed: false },
    { description: "Buy 1 Multiplier", reward: 5, completed: false },
    { description: "Earn 500 cookies", reward: 15, completed: false },
    { description: "Earn 20 diamonds", reward: 1, completed: false },
];

let weeklyQuests = [
    { description: "Click the cookie 1000 times", reward: 50, completed: false },
    { description: "Buy 5 Multipliers", reward: 25, completed: false },
    { description: "Earn 5000 cookies", reward: 75, completed: false },
    { description: "Earn 100 diamonds", reward: 20, completed: false },
];

function saveGameState() {
    localStorage.setItem('cookies', cookies);
    localStorage.setItem('multiplier', multiplier);
    localStorage.setItem('autoClicks', autoClicks);
    localStorage.setItem('diamonds', diamonds);
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
    localStorage.setItem('weeklyQuests', JSON.stringify(weeklyQuests));
}

function loadGameState() {
    cookies = parseInt(localStorage.getItem('cookies')) || 0;
    multiplier = parseInt(localStorage.getItem('multiplier')) || 1;
    autoClicks = parseInt(localStorage.getItem('autoClicks')) || 0;
    diamonds = parseInt(localStorage.getItem('diamonds')) || 0;
    dailyQuests = JSON.parse(localStorage.getItem('dailyQuests')) || dailyQuests;
    weeklyQuests = JSON.parse(localStorage.getItem('weeklyQuests')) || weeklyQuests;
    updateStats();
}

function updateStats() {
    document.getElementById("cookieCount").innerText = cookies;
    document.getElementById("multiplier").innerText = multiplier;
    document.getElementById("autoClicks").innerText = autoClicks;
    document.getElementById("diamondCount").innerText = diamonds;
    saveGameState();
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
    loadGameState();
    updateLeaderboard();
    loadQuests();
}

document.getElementById("cookie").addEventListener("click", function () {
    cookies += multiplier;
    updateStats();
    updateLeaderboard();
    checkQuests();
});

function buyMultiplier() {
    const messageElement = document.getElementById("multiplierMessage");
    const multiplierCost = parseInt(document.getElementById("multiplierCost").innerText);
    if (cookies >= multiplierCost) {
        cookies -= multiplierCost;
        multiplier++;
        document.getElementById("multiplierCost").innerText = Math.floor(multiplierCost * 1.5);
        messageElement.textContent = "";
        updateStats();
        updateLeaderboard();
        checkQuests();
    } else {
        messageElement.textContent = `You need ${multiplierCost - cookies} more cookies to buy a multiplier!`;
    }
}

function buyAutoClicker() {
    const messageElement = document.getElementById("autoClickerMessage");
    const autoClickerCost = parseInt(document.getElementById("autoClickerCost").innerText);
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

function loadQuests() {
    const dailyQuestContainer = document.getElementById("dailyQuests");
    const weeklyQuestContainer = document.getElementById("weeklyQuests");

    dailyQuests.forEach(quest => {
        const questItem = document.createElement("li");
        questItem.textContent = `${quest.description} - Reward: ${quest.reward} diamonds`;
        dailyQuestContainer.appendChild(questItem);
    });

    weeklyQuests.forEach(quest => {
        const questItem = document.createElement("li");
        questItem.textContent = `${quest.description} - Reward: ${quest.reward} diamonds`;
        weeklyQuestContainer.appendChild(questItem);
    });
}

function checkQuests() {
    dailyQuests.forEach(quest => {
        if (!quest.completed && checkQuestCondition(quest.description)) {
            quest.completed = true;
            diamonds += quest.reward;
            alert(`Daily Quest Completed: ${quest.description}! You've earned ${quest.reward} diamonds!`);
            updateStats();
        }
    });

    weeklyQuests.forEach(quest => {
        if (!quest.completed && checkQuestCondition(quest.description)) {
            quest.completed = true;
            diamonds += quest.reward;
            alert(`Weekly Quest Completed: ${quest.description}! You've earned ${quest.reward} diamonds!`);
            updateStats();
        }
    });
}

function checkQuestCondition(description) {
    if (description.includes("Click the cookie")) {
        const times = parseInt(description.match(/\d+/)[0]);
        return cookies >= times;
    }
    if (description.includes("Buy")) {
        const times = parseInt(description.match(/\d+/)[0]);
        if (description.includes("Multiplier")) {
            return multiplier >= times;
        }
    }
    if (description.includes("Earn")) {
        const amount = parseInt(description.match(/\d+/)[0]);
        return cookies >= amount;
    }
    return false;
}

function toggleHamburgerMenu() {
    const menuContent = document.querySelector(".hamburger-menu-content");
    if (menuContent.style.display === "block") {
        menuContent.style.display = "none";
    } else {
        menuContent.style.display = "block";
    }
}
function loadQuests() {
    const dailyQuestContainer = document.getElementById("dailyQuests");
    const weeklyQuestContainer = document.getElementById("weeklyQuests");

    dailyQuestContainer.innerHTML = '';
    weeklyQuestContainer.innerHTML = '';

    dailyQuests.forEach(quest => {
        const questItem = document.createElement("li");
        questItem.textContent = `${quest.description} - Reward: ${quest.reward} diamonds`;
        if (quest.completed) {
            questItem.style.textDecoration = "line-through";
        }
        dailyQuestContainer.appendChild(questItem);
    });

    weeklyQuests.forEach(quest => {
        const questItem = document.createElement("li");
        questItem.textContent = `${quest.description} - Reward: ${quest.reward} diamonds`;
        if (quest.completed) {
            questItem.style.textDecoration = "line-through";
        }
        weeklyQuestContainer.appendChild(questItem);
    });
}
function showSignup() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
}

function showLogin() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('signupContainer').style.display = 'none';
}

function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const signupError = document.getElementById('signupError');

    if (!username || !password) {
        signupError.textContent = "Please fill in both fields.";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        signupError.textContent = "Username already exists.";
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    showLogin();
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginError = document.getElementById('loginError');

    if (!username || !password) {
        loginError.textContent = "Please fill in both fields.";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
        alert('Login successful!');
        // Store the logged in user in localStorage
        localStorage.setItem('loggedInUser', username);
        // Hide the login/signup form and show the game
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('signupContainer').style.display = 'none';
        document.getElementById('game').style.display = 'block';
    } else {
        loginError.textContent = "Invalid username or password.";
    }
}
function saveGameState() {
    const username = localStorage.getItem('loggedInUser');
    if (username) {
        localStorage.setItem(`cookies_${username}`, cookies);
        localStorage.setItem(`multiplier_${username}`, multiplier);
        localStorage.setItem(`autoClicks_${username}`, autoClicks);
        localStorage.setItem(`diamonds_${username}`, diamonds);
        localStorage.setItem(`dailyQuests_${username}`, JSON.stringify(dailyQuests));
        localStorage.setItem(`weeklyQuests_${username}`, JSON.stringify(weeklyQuests));
    }
}

function loadGameState() {
    const username = localStorage.getItem('loggedInUser');
    if (username) {
        cookies = parseInt(localStorage.getItem(`cookies_${username}`)) || 0;
        multiplier = parseInt(localStorage.getItem(`multiplier_${username}`)) || 1;
        autoClicks = parseInt(localStorage.getItem(`autoClicks_${username}`)) || 0;
        diamonds = parseInt(localStorage.getItem(`diamonds_${username}`)) || 0;
        dailyQuests = JSON.parse(localStorage.getItem(`dailyQuests_${username}`)) || dailyQuests;
        weeklyQuests = JSON.parse(localStorage.getItem(`weeklyQuests_${username}`)) || weeklyQuests;
    }
    updateStats();
}


// Ensure game state is saved every second to avoid data loss
setInterval(saveGameState, 1000);
setInterval(autoClick, 1000); // Auto clicks every second

// Load the game state when the page loads
window.onload = loadGameState;


