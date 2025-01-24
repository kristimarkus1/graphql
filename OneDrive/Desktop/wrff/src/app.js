import { getUserData } from "./queries.js";
import { queryAPI } from "./graphql.js";
import { drawXpGraph, drawAuditGraph } from "./charts.js";
import { login, logout } from "./auth.js";

// DOM Elements
const userName = document.getElementById("user-name");
const userXpLabel = document.getElementById("xp");
const userLevelLabel = document.getElementById("level");
const userAuditLabel = document.getElementById("tasks");

// Page Load Logic
window.addEventListener("load", async () => {
  const token = localStorage.getItem("jwt");

  if (token) {
    try {
      const data = await queryAPI(getUserData);
      processData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      redirectToLogin();
    }
  } else {
    redirectToLogin();
  }
});

// Redirect to Login Page
function redirectToLogin() {
  window.location.href = "../login.html"; // Redirect to login page
}

// Process GraphQL Data
function processData(data) {
  if (!data || !data.user || data.user.length === 0) {
    console.error("No user data found:", data);
    return;
  }

  const user = data.user[0];
  userName.innerText = user.login || "Unknown User";

  // Calculate Total XP
  const totalXp = data.xp?.aggregate?.sum?.amount || 0;
  if (totalXp > 1000000) {
    userXpLabel.innerText = `Gained XP: ${(totalXp / 1000000).toFixed(2)}MB`;
  } else if (totalXp > 1000) {
    userXpLabel.innerText = `Gained XP: ${(totalXp / 1000).toFixed(2)}kB`;
  } else {
    userXpLabel.innerText = `Gained XP: ${totalXp}`;
  }

  // Display Current Level
  const level = data.level?.[0]?.amount || "N/A";
  userLevelLabel.innerText = `Current Level: ${level}`;

  // Display Audit Ratio
  const auditRatio = user.auditRatio?.toFixed(2) || "N/A";
  userAuditLabel.innerText = `Audit Ratio: ${auditRatio}`;

  // Prepare data for charts
  drawXpGraph(user.transactions || []);
  drawAuditGraph(user.audits || []);

  // Debug Logs
  console.log("User Data Processed:", {
    user,
    transactions: user.transactions,
    audits: user.audits,
  });
}

// Logout Button Functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
});

