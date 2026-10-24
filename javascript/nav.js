
document.addEventListener("DOMContentLoaded", async () => {
  const sidebarContainer = document.getElementById("sidebar-container");

  if (!sidebarContainer) return;

  // Load the shared sidebar from the correct folder.
  const isInsidePages = window.location.pathname.includes("/pages/");
  const sidebarPath = isInsidePages
    ? "../components/sidebar.html"
    : "components/sidebar.html";

  try {
    const response = await fetch(sidebarPath);

    if (!response.ok) {
      throw new Error("Could not load the sidebar.");
    }

    sidebarContainer.innerHTML = await response.text();

    // Render Lucide icons after inserting the sidebar.
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Highlight the navigation item for the current page.
    const currentFile = window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

    const pageNames = {
      "index.html": "Home",
      "add-document.html": "Add Document",
      "all-documents.html": "All Documents",
      "favorites.html": "Favorites",
      "recent.html": "Recent",
      "shared.html": "Shared",
      "recycle-bin.html": "Recycle Bin",
      "settings.html": "Settings"
    };

    const currentPage = pageNames[currentFile] || "Home";

    sidebarContainer.querySelectorAll(".nav-item[data-page]")
      .forEach(item => {
        item.classList.toggle(
          "active",
          item.dataset.page === currentPage
        );
      });

    // Toggle the sidebar.
    const toggleButton = document.getElementById("sidebarToggle");
    const appShell = document.querySelector(".app-shell");

    toggleButton?.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        appShell.classList.toggle("mobile-sidebar-open");
      } else {
        appShell.classList.toggle("collapsed");
      }
    });

    // Add section button.
    document.getElementById("addSectionBtn")
      ?.addEventListener("click", () => {
        alert("Add section functionality can be added here.");
      });

  } catch (error) {
    console.error("Sidebar loading error:", error);
    sidebarContainer.textContent = "Unable to load navigation.";
  }
});
