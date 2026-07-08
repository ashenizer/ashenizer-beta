document.addEventListener("DOMContentLoaded", () => {

  setupOrbitInteraction();

});

function setupOrbitInteraction() {

  const buttons = document.querySelectorAll(".orbit-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      const target = btn.dataset.panel;

      // ✅ Hide all panels
      document.querySelectorAll(".panel").forEach(p => {
        p.classList.add("hidden");
      });

      // ✅ Show selected panel
      document.getElementById("panel-" + target)
        ?.classList.remove("hidden");

    });
  });

}

document.querySelectorAll(".orbit-btn").forEach(btn => {

  const tooltip = btn.querySelector(".orbit-tooltip");
  const text = "> " + btn.dataset.label;

  let typingInterval;

  btn.addEventListener("mouseenter", () => {

    tooltip.textContent = "";  // reset

    let i = 0;

    clearInterval(typingInterval);

    typingInterval = setInterval(() => {

      tooltip.textContent = text.slice(0, i + 1);
      i++;

      if (i >= text.length) {
        clearInterval(typingInterval);

        // ✅ Add blinking cursor
        const cursor = document.createElement("span");
        cursor.textContent = "_";
        cursor.classList.add("blinker");

        tooltip.appendChild(cursor);
      }

    }, 40); // typing speed

  });

  btn.addEventListener("mouseleave", () => {
    clearInterval(typingInterval);
    tooltip.textContent = "";
  });

});