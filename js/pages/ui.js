
window.App = window.App || {};
App.ui = App.ui || {};
App.ui.currentAgent = null;




function getStatusBadge(metric, value) {
  
value = parseFloat(value);
if (isNaN(value)) return "";


  if (metric === "QA") {
    return value >= 98 ? "Excellent 🟢" : "Needs Improvement 🔴";
  }


if (metric === "AHT") {
  const { QPB, HCPO } = App.data.targets.AHT;

  if (value <= QPB) return "QPB Level 🟢";
  if (value <= HCPO) return "HCPO Level 🟡";
  return "Above Target 🔴";
}



  if (metric === "Attendance") {
    return value >= 95 ? "Good 🟢" : "Poor 🔴";
  }

  return ""; // ✅ proper fallback
}



function isValidPercent(value) {
  return /^\d{1,3}(\.\d{1,2})?$/.test(value); // allows 95 or 95.25
}



function isValidSeconds(value) {
  return /^\d+$/.test(value); // only numbers
}











// ✅ Trend arrow helper (POLISHED VERSION)
function getTrendArrow(current, previous, metric) {
  if (current == null || previous == null) return "";

  current = parseInt(current);
  previous = parseInt(previous);

if (isNaN(current) || isNaN(previous)) return "";

  let arrow = "";
  let color = "";

  if (metric === "AHT") {
    // LOWER is better
    if (current < previous) {
      arrow = "↓";
      color = "limegreen"; // improvement
    } else if (current > previous) {
      arrow = "↑";
      color = "red"; // worse
    } else {
      arrow = "→";
      color = "gray";
    }
  } else {
    // HIGHER is better
    if (current > previous) {
      arrow = "↑";
      color = "limegreen"; // improvement
    } else if (current < previous) {
      arrow = "↓";
      color = "red"; // worse
    } else {
      arrow = "→";
      color = "gray";
    }
  }

  return `<span style="color:${color}; font-weight:bold; margin-left:5px;">${arrow}</span>`;
}


// ✅ HARD RESET TL VIEW (FULL REFRESH SIMULATION)





// ✅ EXISTING FUNCTION






// ✅ QA






// ✅ Handle file selection

App.theme.apply();
App.theme.syncToggles();
App.theme.updateLabel();
App.theme.setupProfileToggle();
App.header.init();
App.profile.init();
App.leave.init();

  const agentSelect = document.getElementById("agent-select");
  const saveBtn = document.getElementById("save-stats-btn");

const dateInput = document.getElementById("input-date");
if (dateInput && !dateInput.value) {
  dateInput.value = new Date().toISOString().split("T")[0];
}


  if (agentSelect && saveBtn) {
    



agentSelect.addEventListener("change", () => {

  const email = agentSelect.value;

  // ✅ ✅ HARD GUARD (THIS FIXES EVERYTHING)

if (!email) {
  App.tl.resetTLView();
  return;
}


document.getElementById("tl-input-fields")?.classList.remove("hidden");


  App.ui.currentAgent = email;

  // ✅ SHOW UI ONLY AFTER SELECTION
  document.getElementById("lead-view")?.classList.remove("hidden");
  
  document.getElementById("selected-agent-stats")?.classList.remove("hidden");


  const member = App.data.users[email];
const finalQaGroup = document.getElementById("final-qa-group");
  const commercialGroup = document.getElementById("commercial-qa-group");
const commercialCountGroup = document.getElementById("commercial-count-group");

  // ✅ Show commercial input only for hybrid
  

// ✅ ALWAYS show Final QA
finalQaGroup?.classList.remove("hidden");

// ✅ Only show commercial fields for hybrid
if (!email || !member || member.qaType !== "hybrid") {

  commercialGroup?.classList.add("hidden");
  commercialCountGroup?.classList.add("hidden");


const qaComCountInput = document.getElementById("input-qa-commercial-count");

if (qaComCountInput) qaComCountInput.value = "";



} else {

  commercialGroup?.classList.remove("hidden");
  commercialCountGroup?.classList.remove("hidden");

}


  saveBtn.disabled = email === "";

  const selectedSection = document.getElementById("selected-agent-stats");

  if (!email) {
    selectedSection?.classList.add("hidden");
    document.getElementById("agent-history")?.classList.add("hidden");
    document.getElementById("selected-agent-title").textContent =
      "Selected Agent Performance";
    return;
  }

  // ✅ SHOW CHART
App.ui.showChart();

  // ✅ UPDATE CHART
  App.ui.updatePerformanceChart(email);

  const month =
    document.getElementById("input-date")?.value.slice(0, 7) ||
    new Date().toISOString().slice(0, 7);

  const agentName = App.data.users[email]?.name || "Selected Agent";

  document.getElementById("selected-agent-title").textContent =
    `${agentName}'s Performance`;

App.ui.updateChartTitle(agentName);


  
const latest = App.data.statsStore[email].current;


document.getElementById("selected-qa").innerHTML =
  (latest?.QA != null ? latest.QA + "%" : "—") +
  " " +
  getStatusBadge("QA", latest?.QA);



// ✅ SUB BOX DISPLAY
const subBox = document.getElementById("qa-sub-boxes");

if (member?.qaType === "hybrid") {

  subBox?.classList.remove("hidden");


document.getElementById("selected-qa-dis").textContent =
  "Count: " + (latest?.QA_Disability_Count ?? 0);

document.getElementById("selected-qa-com").textContent =
  "Count: " + (latest?.QA_Commercial_Count ?? 0);


} else {

  subBox?.classList.add("hidden");
}


document.getElementById("selected-aht").innerHTML =
  (latest?.AHT != null ? latest.AHT + "s" : "—") +
  `<br><small>QPB: ${App.data.targets.AHT.QPB}s | HCPO: ${App.data.targets.AHT.HCPO}s</small>` +
  " " +
  getStatusBadge("AHT", latest?.AHT);

document.getElementById("selected-attendance").innerHTML =
  (latest?.Attendance != null
    ? parseFloat(latest.Attendance).toFixed(2) + "%"
    : "—") +
  `<br><small>Target: ${App.data.targets.Attendance}%</small>` +
  " " +
  getStatusBadge("Attendance", latest?.Attendance);



  selectedSection.classList.remove("hidden");

  App.tl.renderHistory(email);
});

  }

  

const toggleBtn = document.getElementById("toggleRegisterPanel");
const registerBody = document.getElementById("register-body");

toggleBtn?.addEventListener("click", () => {
  registerBody.classList.toggle("open");

  const isOpen = registerBody.classList.contains("open");

  toggleBtn.classList.toggle("active", isOpen);
  toggleBtn.textContent = isOpen ? "−" : "+";
});


document
  .getElementById("registerEmployee")
  ?.addEventListener("click", App.tl.registerEmployee);

document
  .getElementById("save-stats-btn")
  ?.addEventListener("click", App.tl.saveEmployeeStats);


// ✅ Set default chart title for logged-in user




const currentEmail = App.currentUserEmail;

if (currentEmail) {
  const userName = App.data.users[currentEmail]?.name;

  if (userName) {
    App.ui.setDefaultChartTitle(userName);
  }
}



window.App = window.App || {};
window.App.ui = window.App.ui || {};

