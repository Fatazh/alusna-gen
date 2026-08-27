/* global window, document */
(function () {
  "use strict";

  var monitoringBoot = true;

  function stopMonitoringBoot() {
    if (!monitoringBoot) return;
    monitoringBoot = false;
    window.removeEventListener("error", handleBootError);
    window.removeEventListener("unhandledrejection", handleBootRejection);
  }

  function hideLoading() {
    var loading = document.getElementById("boot-loading");
    if (loading) loading.style.display = "none";
    stopMonitoringBoot();
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

  function handleBootError(event) {
    if (!monitoringBoot) return;
    window.__showBootError(
      "Runtime error",
      (event.error && event.error.stack) || event.message || String(event),
    );
  }

  function handleBootRejection(event) {
    if (!monitoringBoot) return;
    var reason = event.reason;
    window.__showBootError(
      "Unhandled promise rejection",
      (reason && reason.stack) || (reason && reason.message) || String(reason),
    );
  }

  window.addEventListener("error", handleBootError);
  window.addEventListener("unhandledrejection", handleBootRejection);

  window.__hideBootLoading = hideLoading;
})();
