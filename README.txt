# DocVault Dashboard

## Run it
1. Extract the ZIP.
2. Open `index.html` in a modern browser, or open the folder in Visual Studio Code and use the Live Server extension.
3. The dashboard is responsive. Use the panel button at the top to collapse/expand the sidebar.

## Included interactions
- Responsive sidebar toggle
- Search box (filters recent activity rows)
- Upload-file modal and drag-and-drop selection
- Demo profile editing, section adding, chart range changes, and activity notices

## Important security note
This is a frontend UI prototype. It does **not** upload or securely store selected files, authenticate users, or encrypt documents. The file picker only reads file names/sizes for display; files are not sent anywhere. For real secure document storage, add a backend with authentication, authorization, encrypted storage, secure key management, audit logging, and protected download endpoints. Do not describe this frontend prototype as production-secure.


Initial navigation state: no sidebar item is highlighted when the dashboard first opens, as requested. The dashboard itself opens from index.html. Clicking a navigation item highlights that item during the current view.
