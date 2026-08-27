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
  }

  function clearBootError() {
    var box = document.getElementById("boot-error");
    if (!box) return;
    box.textContent = "";
    box.style.display = "none";
  }

  function completeBoot() {
    hideLoading();
    clearBootError();
    stopMonitoringBoot();
  }

  function isExternalResourceError(event) {
    var target = event.target;
    var source =
      (target && target !== window && (target.src || target.href)) || event.filename || "";
    if (!source) return false;

    try {
      return new window.URL(source, window.location.href).origin !== window.location.origin;
    } catch {
      return false;
    }
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
    stopMonitoringBoot();
  };

  function handleBootError(event) {
    if (!monitoringBoot || isExternalResourceError(event)) return;
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

  window.__hideBootLoading = completeBoot;
})();
