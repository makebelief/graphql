import { login } from "./components/templates/login.js";
import { leftSidebar } from "./components/templates/dashboard.js";
import { handleLogin } from "./auth.js";
import { fetchGraphQL } from "./queries.js";
import { topBar, statsCards, scores } from "./components/templates/main_content.js";
import { generateXPGraph } from "./graphs.js";
import { AuditRatio, skills } from "./components/templates/rightSidebar.js";
import { updateMetrics } from "./utils.js";

let app;
let currentUser = null;
let response;
let goProjects;
let jsProjects;
let rustProjects;
let skillTypes;
let audits;

let rank = [
  "Aspiring Developer",
  "Beginner Developer",
  "Apprentice Developer",
  "Assistant Developer",
  "Basic Developer",
  "Junior Developer",
];

document.addEventListener("DOMContentLoaded", () => {
  app = document.getElementById("app");
  const token = localStorage.getItem("authToken");
  
  // For testing, you can uncomment the line below to skip login
  // renderDashboard("test-token");
  
  if (token) {
    renderDashboard(token);
  } else {
    renderLogin();
  }
});

function updateUI(done) {
  const goProjectsRatio = document.getElementById("go-projects");
  const jsProjectsRatio = document.getElementById("js-projects");
  const rsProjectsRatio = document.getElementById("rs-projects");
  const xpValue = document.getElementById("xp-metric-value");
  const levelValue = document.getElementById("level-metric-value");
  const gradeValue = document.getElementById("grade-metric-value");
  const chartContainer = document.getElementById("chart-container");
  const topicList = document.getElementById("topic-list");
  
  if (!goProjectsRatio || !jsProjectsRatio || !rsProjectsRatio || !xpValue || !levelValue || !gradeValue || !topicList) {
    console.error("Required elements not found");
    return;
  }

  goProjectsRatio.innerHTML = done.go.ratio;
  jsProjectsRatio.innerHTML = done.js.ratio;
  rsProjectsRatio.innerHTML = done.rust.ratio;
  
  const totalXP = currentUser.transactions.reduce((totalXP, transaction) => {
    return transaction.type === "xp" ? totalXP + transaction.amount : totalXP;
  }, 0);

  const totalGrade = currentUser.progresses.reduce((totalGrade, progress) => {
    return progress.grade !== null ? totalGrade + progress.grade : totalGrade;
  }, 0);
  
  gradeValue.innerHTML = totalGrade.toFixed(2);

  const [value, unit] = formatXP(totalXP);
  xpValue.innerHTML = value + '<span id="xp-metric-unit" class="metric-unit">' + unit + "</span>";
  
  levelValue.innerHTML = currentUser.events[0].level + '<span id="xp-metric-unit" class="metric-unit">' + rank[Math.floor(currentUser.events[0].level / 10)] + "</span>";
  
  // Generate and display the XP chart
  if (chartContainer) {
    chartContainer.innerHTML = generateXPGraph(
      currentUser.transactions,
      response.data.event[0].startAt,
      response.data.event[0].endAt
    );
  }
  
  // Display skills
  DisplaySkills(topicList);

  updateMetrics(currentUser);
}
function PopulateAuditDropdown() {
  const auditItemsContainer = document.querySelector(".audit-items");

  if (audits.length === 0) {
    auditItemsContainer.innerHTML =
      '<p class="no-audits">No audit notifications</p>';
    return;
  }
  audits.forEach((audit) => {
    const { captainLogin, members } = audit.group;
    const filteredMembers = members.filter(
      (member) => member.userLogin !== captainLogin
    );

    auditItemsContainer.innerHTML += `
    <div class="audit-item">
      <div class="audit-header">
        <span class="project-name">${audit.group.path.replace(
          "/kisumu/module/",
          ""
        )}</span>
        <span class="audit-code">CODE: ${audit.private.code}</span>
      </div>
      <div class="audit-details">
        <p><strong>Group Leader: </strong>${captainLogin}</p>
        ${
          filteredMembers.length > 0
            ? `
        <p><strong>Group Members:</strong></p>
        <div class="member-tags">
          ${filteredMembers
            .map(
              (member) => `<span class="member-tag">${member.userLogin}</span>`
            )
            .join("")}
        </div>`
            : ""
        }
      </div>
    </div>`;
  });
}
function DisplaySkills(topicList) {
  if (!topicList || !skillTypes || skillTypes.length === 0) {
    console.error("Skills data not available");
    return;
  }

  // Clear existing content
  topicList.innerHTML = '';
  
  const topFiveSkills = skillTypes
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((skill) => ({
      type: skill.type
        .replace("skill_", "")
        .replace(/^prog$/, "programming")
        .replace(/^(\w)/, (match) => match.toUpperCase()),
      amount: skill.amount,
    }));

  for (let i = 0; i < topFiveSkills.length; i++) {
    let skill = topFiveSkills[i];
    topicList.innerHTML += `
      <li class="topic-item">
        <div class="topic-info">
          <div class="topic-number">0${i + 1}</div>
          <div class="topic-name">${skill.type}</div>
        </div>
        <div class="topic-score high">${skill.amount}%</div>
      </li>
    `;
  }
}

function renderLogin() {
  app.innerHTML = `
    <div id="login-container">
      <div>
        <div id="error-message" style="display: none; color: red; margin-bottom: 10px;"></div>
        <h2>Welcome Back</h2>
        <form id="login-form">
          <div class="form-group">
            <input type="text" id="username" name="username" placeholder="Username or email" required />
          </div>
          <div class="form-group">
            <input type="password" id="password" name="password" placeholder="Password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  `;

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleLogin(event, null, null, null, app);
    });
  }
}

export async function renderDashboard(token) {
  app.style.display = "block";
  response = await fetchGraphQL(token);
  currentUser = response.data.user[0];
  goProjects = response.data.goItems;
  jsProjects = response.data.jsItems;
  rustProjects = response.data.rustItems;
  skillTypes = response.data.skill_types[0].transactions_aggregate.nodes;
  audits = currentUser.audits;

  const totalUp = currentUser.transactions.reduce((totalXP, transaction) => {
    return transaction.type === "up" ? totalXP + transaction.amount : totalXP;
  }, 0);
  const totalDown = currentUser.transactions.reduce((totalXP, transaction) => {
    return transaction.type === "down" ? totalXP + transaction.amount : totalXP;
  }, 0);

  app.innerHTML = `
    <div class="container">
      <div class="profile-card-wide">
        ${leftSidebar(currentUser)}
      </div>
      
      <div class="notifications-card">
        <div class="notifications-title">Notifications</div>
        <div class="notifications-empty">No notifications available</div>
      </div>
      
      <div class="dashboard-card">
        <div class="section-title">Done Projects</div>
        ${statsCards()}
      </div>
      
      <div class="dashboard-card">
        <div class="section-title">Performance Dashboard</div>
        ${scores()}
      </div>
      
      <div class="dashboard-card">
        <div class="section-title">XP Progression</div>
        <div id="chart-container"></div>
      </div>
      
      <div class="dashboard-bottom-row">
        <div class="dashboard-card dashboard-skills">${skills()}</div>
        <div class="dashboard-card dashboard-audit">${AuditRatio(totalUp, totalDown, currentUser.auditRatio)}</div>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  let done = doneProjectsCount();
  updateUI(done);
}

function handleLogout() {
  localStorage.removeItem("authToken");
  currentUser = null;
  renderLogin();
}

function formatXP(bytes) {
  if (bytes >= 1_000_000) {
    return [(bytes / 1_000_000).toFixed(2), "MB"];
  } else if (bytes >= 1_000) {
    return [(bytes / 1_000).toFixed(2), "KB"];
  } else {
    return [bytes, "Bytes"];
  }
}

function doneProjectsCount() {
  let transactions = currentUser.transactions.filter(
    (transaction) => transaction.type === "xp"
  );

  // Create sets of completed project names for fast lookup
  let completedProjects = new Set();

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].object && transactions[i].object.name) {
      completedProjects.add(transactions[i].object.name);
    }
  }

  let goDone = 0;
  let goTotal = goProjects.length;
  for (let i = 0; i < goTotal; i++) {
    if (completedProjects.has(goProjects[i].name)) {
      goDone++;
    }
  }

  let jsDone = 0;
  let jsTotal = jsProjects.length;
  for (let i = 0; i < jsTotal; i++) {
    if (completedProjects.has(jsProjects[i].name)) {
      jsDone++;
    }
  }

  let rustDone = 0;
  let rustTotal = rustProjects.length;
  for (let i = 0; i < rustTotal; i++) {
    if (completedProjects.has(rustProjects[i].name)) {
      rustDone++;
    }
  }

  const goRatio = `${goDone}/${goTotal}`;
  const jsRatio = `${jsDone}/${jsTotal}`;
  const rustRatio = `${rustDone}/${rustTotal}`;

  const totalDone = goDone + jsDone + rustDone;
  const totalProjects = goTotal + jsTotal + rustTotal;
  const totalRatio = `${totalDone}/${totalProjects}`;

  return {
    go: {
      done: goDone,
      total: goTotal,
      ratio: goRatio,
    },
    js: {
      done: jsDone,
      total: jsTotal,
      ratio: jsRatio,
    },
    rust: {
      done: rustDone,
      total: rustTotal,
      ratio: rustRatio,
    },
    total: {
      done: totalDone,
      total: totalProjects,
      ratio: totalRatio,
    },
  };
}
