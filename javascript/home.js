document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  toggle?.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      sidebar.classList.toggle("mobile-open");
    } else {
      sidebar.classList.toggle("collapsed");
    }
  });

  document.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 700px)").matches &&
        sidebar.classList.contains("mobile-open") &&
        !sidebar.contains(event.target) && !toggle.contains(event.target)) {
      sidebar.classList.remove("mobile-open");
    }
  });

  const globalSearch = document.getElementById("globalSearch");
  globalSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && globalSearch.value.trim()) {
      window.location.href = `all-documents.html?search=${encodeURIComponent(globalSearch.value.trim())}`;
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      globalSearch?.focus();
    }
    if (event.key === "Escape") {
      sidebar.classList.remove("mobile-open");
      globalSearch?.blur();
    }
  });

  const folderInput = document.getElementById("folderInput");
  document.getElementById("importFolderBtn")?.addEventListener("click", () => folderInput?.click());
  folderInput?.addEventListener("change", () => {
    const count = folderInput.files?.length || 0;
    showToast(count ? `${count} file${count === 1 ? "" : "s"} selected. Import needs backend setup.` : "No files selected.");
  });

  document.getElementById("driveBtn")?.addEventListener("click", () => {
    showToast("Google Drive sync needs Google API setup.");
  });
  document.getElementById("scanBtn")?.addEventListener("click", () => {
    showToast("Document scanning is a placeholder until scanner integration is added.");
  });
  document.getElementById("syncButton")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.innerHTML = '<i data-lucide="loader-circle"></i> Syncing…';
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = '<i data-lucide="refresh-cw"></i> Sync Now';
      if (window.lucide) lucide.createIcons();
      showToast("Demo sync complete. Connect storage to sync real files.");
    }, 1000);
  });

  function addSection() {
    const name = prompt("Enter a name for your new document section:");
    if (!name || !name.trim()) return;
    showToast(`“${name.trim()}” section UI requested. Save it through your backend to keep it permanently.`);
  }
  document.getElementById("addSectionBtn")?.addEventListener("click", addSection);
  document.getElementById("addSectionCard")?.addEventListener("click", addSection);

  document.querySelectorAll(".more-button").forEach(button => {
    button.addEventListener("click", () => showToast("Document actions will be available when document records are connected."));
  });
  document.getElementById("profileButton")?.addEventListener("click", () => {
    showToast("Profile menu can be connected to your account settings.");
  });
});
