document.addEventListener("DOMContentLoaded", () => {

  FirebaseService.auth.onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const doc = await FirebaseService.db
      .collection("users")
      .doc(user.email)
      .get();

    const data = doc.data();

    if (data.role !== "god") {
      window.location.href = "ui.html";
      return;
    }

    loadRequests();
  });

 const logoutBtn = document.getElementById("god-logout");

console.log("Logout button:", logoutBtn);

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {

    console.log("Logout clicked");

    await FirebaseService.auth.signOut();

    console.log("✅ Logged out");

    window.location.href = "login.html";

  });
}


  });


async function loadRequests() {

  const container = document.getElementById("god-requests");

  const snapshot = await FirebaseService.db
    .collection("passwordRequests")
    .orderBy("createdAt", "desc")
    .get();

  container.innerHTML = snapshot.docs.map(doc => {

    const data = doc.data();

    return `
      <div class="request-card">
        <p>${data.email}</p>
        <p>New Password: ${data.newPassword}</p>

        <button onclick="approve('${doc.id}')">
          ✔ Approve
        </button>
      </div>
    `;

  }).join("");
}


window.approve = async function(id) {

  await FirebaseService.db
    .collection("passwordRequests")
    .doc(id)
    .update({ status: "done" });

  alert("✅ Updated");
  loadRequests();
};

