/* global window, document */
(function () {
  "use strict";

  function hideLoading() {
    var loading = document.getElementById("boot-loading");
    if (loading) loading.style.display = "none";
  }

  window.__showBootError = function (title, detail) {
    var box = document.getElementById("boot-error");
    if (!box) return;

    box.textContent = "";
    var heading = document.createElement("h1");
    heading.textContent = title || "Error";
    var body = document.createElement("div");
    body.textContent = detail || "No details available.";
    box.appendChild(heading);
    box.appendChild(body);
    box.style.display = "block";
    hideLoading();
  };

  window.addEventListener("error", function (event) {
    window.__showBootError(
      "Runtime error",
      (event.error && event.error.stack) || event.message || String(event),
    );
  });

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    window.__showBootError(
      "Unhandled promise rejection",
      (reason && reason.stack) || (reason && reason.message) || String(reason),
    );
  });

  window.__hideBootLoading = hideLoading;
})();
