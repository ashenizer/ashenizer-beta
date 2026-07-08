
window.App = window.App || {};
App.forgot = {};

App.forgot.submitRequest = async function () {

  const email = document.getElementById("fp-email").value.trim();
  const current = document.getElementById("fp-current").value.trim();
  const newPass = document.getElementById("fp-new").value.trim();
  const confirm = document.getElementById("fp-confirm").value.trim();

  if (!email || !current || !newPass || !confirm) {
    alert("Fill all fields ❌");
    return;
  }

  if (newPass !== confirm) {
    alert("Passwords do not match ❌");
    return;
  }

  try {

    // ✅ SAVE RESET REQUEST TO FIRESTORE
    await FirebaseService.db.collection("passwordRequests").add({
      email: email,
      currentPassword: current,  // ⚠️ only ok since it's internal
      newPassword: newPass,
      status: "pending",
      createdAt: new Date()
    });

    alert("✅ Request sent! Contact admin.");
    
  } catch (error) {
    alert(error.message);
  }
};


const openBtn = document.getElementById("forgot-password");
const modal = document.getElementById("forgot-modal");

openBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.remove("hidden");
});

document.getElementById("fp-close")?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

document.getElementById("fp-submit")?.addEventListener("click", () => {
  App.forgot.submitRequest();
});

