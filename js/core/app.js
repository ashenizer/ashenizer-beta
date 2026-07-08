
document.addEventListener("DOMContentLoaded", () => {

  FirebaseService.auth.onAuthStateChanged(async (firebaseUser) => {

    if (!firebaseUser) return;

    const email = firebaseUser.email;
    const user = await App.data.getUser(email);

    if (!user) return;

    App.currentUser = user;
    App.currentUserEmail = email;

// ✅ INIT CHART FIRST
App.ui.initPerformanceChart();

const stats = document.getElementById("section-dashboard");

if (user.role === "teamlead") {
  stats?.classList.add("hidden");
}

App.data.users[email] = {
  ...App.data.users[email],
  ...user
};

const members = await App.data.getTeamMembers(user.team);

members.forEach(member => {
  App.data.users[member.email] = {
    ...App.data.users[member.email],
    ...member
  };
});

await App.data.loadStatsFromFirestore();


// ✅ LOAD DROPDOWN
await App.tl.populateAgentDropdown();

// ✅ update ranking after everything loads
// App.ranking.updateRanking();

// ✅ hide personal stats initially
document.getElementById("section-dashboard")?.classList.add("hidden");

// ✅ hide chart initially
App.ui.hideChart();


// 👑 GOD MODE PANEL
if (user.role === "god") {

  const adminPanel = document.getElementById("admin-panel");

  adminPanel?.classList.remove("hidden");

  // ✅ load password reset requests
  App.admin.loadPasswordRequests();

}


    // ✅ HEADER
    const welcome = document.getElementById("welcome");
    const roleBadge = document.getElementById("role-badge");

    if (welcome) {
      welcome.textContent = `Welcome, ${user.name}`;
    }

    if (roleBadge) {
      roleBadge.textContent =
        user.role === "teamlead" ? "Team Lead" : "Employee";
    }

    // ✅ VIEWS
    const employeeView = document.getElementById("employee-view");
    const leadView = document.getElementById("lead-view");

    

if (user.role === "teamlead") {

  employeeView?.classList.remove("hidden"); 

App.ranking.updateRanking();
  

  // ✅ TL sees their own UI when dashboard is clicked
  leadView?.classList.add("hidden");
  document.querySelector(".tl-input-panel")?.classList.add("hidden");

  // 🔽 PASTE THIS EXACT LINE RIGHT HERE 🔽
  await App.tl.loadTeamPerformance();

} else {

  // ✅ Employee sees employee UI
  employeeView?.classList.remove("hidden");

  // ✅ Hide TL stuff
  leadView?.classList.add("hidden");
  document.querySelector(".tl-input-panel")?.classList.add("hidden");

// ✅ EMPLOYEE VIEW
if (App.currentUser?.role === "employee") {

  App.employee.updatePersonalStats(email);

  App.employee.renderEmployeeHistory(email);

  App.ui.updatePerformanceChart(email);

  App.incentives.loadEmployeeIncentives(email);

  App.ranking.updateRanking();

  setMetric("QA");
}

}



    // ✅ DEFAULT VIEW STATE
    document.getElementById("ranking-section")?.classList.remove("hidden");
    document.getElementById("bulletin-section")?.classList.add("hidden");
    document.getElementById("performance-chart-section")?.classList.add("hidden");
    document.getElementById("section-dashboard")?.classList.add("hidden");


    // ✅ LOAD DATA
    App.ui.updatePerformanceChart(email);

const menuButtons = document.querySelectorAll(".menu-btn");

    menuButtons.forEach(btn => {
      btn.addEventListener("click", () => {

        menuButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const section = btn.dataset.section;

const ranking = document.getElementById("ranking-section");
const bulletin = document.getElementById("bulletin-section");
const stats = document.getElementById("section-dashboard");
const leave = document.getElementById("section-leave");

        

if (ranking) {
  ranking.style.display = "none";

  // ✅ ALSO hide children (force it)
  ranking.querySelectorAll("*").forEach(child => {
    child.style.display = "none";
  });
}


        bulletin?.classList.add("hidden");
        stats?.classList.add("hidden");
        App.ui.hideChart();
        leave?.classList.add("hidden");

        
if (section === "leave") {

  App.leave.initLeaveCalendar();

}

        


if (section === "dashboard") {

  // ✅ EMPLOYEE VIEW
  if (App.currentUser?.role === "employee") {
    stats?.classList.remove("hidden");
    ranking?.classList.add("hidden"); // ✅ force hide ranking

    App.employee.updatePersonalStats(App.currentUserEmail);
    App.employee.renderEmployeeHistory(App.currentUserEmail);
  }


// ✅ TEAM LEAD VIEW (FIXED)
if (App.currentUser?.role === "teamlead") {

  stats?.classList.add("hidden");
  ranking?.classList.add("hidden");

  
  // ✅ ADD THIS BACK
  document.querySelector(".tl-input-panel")?.classList.remove("hidden");


  // ✅ HIDE OTHER SECTIONS
  document.getElementById("lead-view")?.classList.add("hidden");
  document.getElementById("selected-agent-stats")?.classList.add("hidden");

  // ✅ HIDE CHART
  App.ui.hideChart();

  const select = document.getElementById("agent-select");
  if (select) select.value = "";
}


}
 else if (section === "news") {
          bulletin?.classList.remove("hidden");

        } else if (section === "leave") {
          leave?.classList.remove("hidden");

        


} else if (section === "ranking") {
  if (ranking) {
    ranking.style.display = "block";

    // ✅ restore children display
    ranking.querySelectorAll("*").forEach(child => {
      child.style.display = "";
    });
  }
}





        if (section !== "dashboard") {

  document.getElementById("lead-view")?.classList.add("hidden");

  document.getElementById("selected-agent-stats")
    ?.classList.add("hidden");

  document.getElementById("agent-history")
    ?.classList.add("hidden");

  document.querySelector(".tl-input-panel")
    ?.classList.add("hidden");

  App.ui.hideChart();

}

        console.log("✅ Dashboard loaded for:", email);

      });
    });


  });

});

