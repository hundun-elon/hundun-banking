// Hundun Banking Platform - CTF Challenge Logic

// Challenge Configuration
const challenges = [
  {
    id: 1,
    name: "4-Digit PIN Crack",
    username: "hundun",
    password: "1337",
    description:
      "Challenge #1: The user 'hundun' has a 4-digit PIN. Can you break in?",
    hint: "Try using a brute force approach with 4 digits (0000-9999).",
    flag: "WitsCTF{BR3AKING_S1MPL3_P1NS_1337}",
    completed: false,
  },
  {
    id: 2,
    name: "Alphabetic Password",
    username: "hundun",
    password: "bank", // Simple alphabetic password
    description:
      "Challenge #2: For increased security, Hundun has switched to using a password with only letters. Can you still break in?",
    hint: "Lowercase English alphabet only. Try common banking terms.",
    flag: "WitsCTF{W34K_4LPH4_P4SSW0RDS_4R3_B4D}",
    completed: false,
  },
  {
    id: 3,
    name: "Dictionary Attack",
    username: "hundun",
    password: "finance123", // Common password
    description:
      "Challenge #3: Hundun now uses a common password. Can you perform a dictionary attack?",
    hint: "Common passwords often combine words with numbers.",
    flag: "WitsCTF{D1CT10N4RY_4TT4CKS_4R3_3FF3CT1V3}",
    completed: false,
  },
  {
    id: 4,
    name: "Hash Breaking",
    username: "hundun",
    // The actual hash will be checked via a different mechanism
    password: "5ecur1ty!",
    description:
      "Challenge #4: Passwords are now hashed! Can you still break in?",
    hint: "MD5 hashes can be reversed using rainbow tables.",
    flag: "WitsCTF{H4SH3S_4R3_N0T_3N0UGH}",
    completed: false,
  },
  {
    id: 5,
    name: "Advanced Security",
    username: "hundun",
    password: "Hundun@Banking#2025",
    description:
      "Challenge #5: Hundun implemented advanced security measures. Can you still find a way in?",
    hint: "Even complex passwords can be vulnerable to advanced techniques.",
    flag: "WitsCTF{M4ST3R_0F_CRYPT0_CH4LL3NG3S}",
    completed: false,
  },
];

// Global state
let currentChallengeId = 1;
let flagModalInstance = null;

// DOM Elements
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap components
  const flagModal = document.getElementById("flagModal");
  flagModalInstance = new bootstrap.Modal(flagModal);

  // Set up event listeners
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document
    .getElementById("start-next-challenge")
    .addEventListener("click", startNextChallenge);
  document
    .getElementById("next-challenge-modal-btn")
    .addEventListener("click", startNextChallengeFromModal);

  // Initialize the first challenge
  updateChallengeInfo(currentChallengeId);
  updateProgressBar();
});

// Handle login attempts
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const currentChallenge = challenges.find((c) => c.id === currentChallengeId);

  if (!currentChallenge) return;

  if (
    username === currentChallenge.username &&
    checkPassword(password, currentChallenge)
  ) {
    // Successful login
    currentChallenge.completed = true;
    showFlagCaptured(currentChallenge.flag);
    updateProgressBar();

    // Show dashboard
    switchScreen("dashboard-screen");

    // Update completed challenges list
    updateCompletedChallengesList();

    // Enable next challenge button if not the last challenge
    if (currentChallengeId < challenges.length) {
      document.getElementById("start-next-challenge").disabled = false;
    }
  } else {
    // Failed login
    showLoginError();
  }
}

// Check password based on challenge type
function checkPassword(password, challenge) {
  if (challenge.id === 4) {
    // For the hash breaking challenge, we check the hash
    return md5Hash(password) === "a3ce66e6fd6339972b523609a47694cd"; // hash of "5ecur1ty!"
  }
  return password === challenge.password;
}

// Simple MD5 hash function placeholder (would use a real implementation in production)
function md5Hash(string) {
  // This is just a placeholder - in a real app you'd use a proper MD5 library
  // For challenge purposes, we're just checking against a hardcoded hash
  if (string === "5ecur1ty!") {
    return "a3ce66e6fd6339972b523609a47694cd";
  }
  return "unknown_hash";
}

// Show flag captured modal
function showFlagCaptured(flag) {
  document.getElementById("modal-flag").textContent = flag;
  document.getElementById("captured-flag").textContent = flag;
  document.getElementById("challenge-complete-alert").style.display = "block";
  flagModalInstance.show();
}

// Show login error
function showLoginError() {
  const passwordInput = document.getElementById("password");
  passwordInput.classList.add("is-invalid");

  // Remove the error class after a short delay
  setTimeout(() => {
    passwordInput.classList.remove("is-invalid");
  }, 1500);
}

// Switch between screens
function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

// Handle logout
function handleLogout(event) {
  event.preventDefault();
  switchScreen("login-screen");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// Start next challenge
function startNextChallenge() {
  if (currentChallengeId < challenges.length) {
    currentChallengeId++;
    updateChallengeInfo(currentChallengeId);
    switchScreen("login-screen");
  }
}

// Start next challenge from modal
function startNextChallengeFromModal() {
  flagModalInstance.hide();
  startNextChallenge();
}

// Update challenge information
function updateChallengeInfo(challengeId) {
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) return;

  document.getElementById("current-challenge-hint").textContent =
    challenge.description;
  document.getElementById(
    "next-challenge-title"
  ).textContent = `Challenge #${challenge.id}: ${challenge.name}`;
  document.getElementById("next-challenge-description").textContent =
    challenge.hint;
}

// Update progress bar
function updateProgressBar() {
  const completedCount = challenges.filter((c) => c.completed).length;
  const totalChallenges = challenges.length;
  const progressPercentage = (completedCount / totalChallenges) * 100;

  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.textContent = `${Math.round(progressPercentage)}%`;
  progressBar.setAttribute("aria-valuenow", progressPercentage);

  // Update badges
  const badges = document.querySelectorAll(".challenge-progress .badge");
  challenges.forEach((challenge, index) => {
    if (challenge.completed) {
      badges[index].classList.add("completed");
      badges[index].classList.remove("bg-secondary");
    } else if (challenge.id === currentChallengeId) {
      badges[index].classList.add("active");
      badges[index].classList.remove("bg-secondary");
    }
  });
}

// Update completed challenges list
function updateCompletedChallengesList() {
  const completedList = document.getElementById("completed-challenges-list");
  completedList.innerHTML = "";

  const completedChallenges = challenges.filter((c) => c.completed);

  if (completedChallenges.length === 0) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item text-muted";
    listItem.textContent = "No challenges completed yet";
    completedList.appendChild(listItem);
    return;
  }

  completedChallenges.forEach((challenge) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${challenge.id}. ${challenge.name}`;

    const icon = document.createElement("i");
    icon.className = "fas fa-check-circle text-success";

    listItem.appendChild(nameSpan);
    listItem.appendChild(icon);
    completedList.appendChild(listItem);
  });
}
