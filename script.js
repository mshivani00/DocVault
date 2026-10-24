const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const appShell = $('.app-shell');
const sidebar = $('#sidebar');
const toast = $('#toast');
const fileInput = $('#fileInput');
const modalBackdrop = $('#modalBackdrop');
const selectedFiles = $('#selectedFiles');
let pendingFiles = [];
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function drawActivityChart() {
  const svg = $('#activityChart');
  const values = [5,12,10,22,17,12,28,16,22,30,24,31,41,31,43];
  const w = 720, h = 192, max = 50;
  const x = i => 7 + i * (w - 14) / (values.length - 1);
  const y = v => h - (v / max) * (h - 10);
  let line = '';
  values.forEach((v, i) => line += `${i ? ' L' : 'M'} ${x(i)} ${y(v)}`);
  const area = `${line} L ${x(values.length - 1)} ${h} L ${x(0)} ${h} Z`;
  let grid = '';
  for (let i = 0; i <= 5; i++) {
    const gy = i * (h / 5);
    grid += `<line class="chart-grid" x1="0" y1="${gy}" x2="${w}" y2="${gy}"/>`;
  }
  let points = values.map((v, i) => `<circle class="chart-point" cx="${x(i)}" cy="${y(v)}" r="4.3"><title>Day ${i * 2 + 1}: ${v} activities</title></circle>`).join('');
  svg.innerHTML = `<defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5869f5" stop-opacity=".28"/><stop offset="100%" stop-color="#5869f5" stop-opacity=".02"/></linearGradient></defs>${grid}<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${points}`;
}
drawActivityChart();
if (window.lucide) lucide.createIcons();

$('#sidebarToggle').addEventListener('click', () => {
  if (window.innerWidth <= 900) appShell.classList.toggle('mobile-sidebar-open');
  else appShell.classList.toggle('collapsed');
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) appShell.classList.remove('mobile-sidebar-open');
});

function openUploadModal() {
  pendingFiles = [];
  selectedFiles.innerHTML = '';
  modalBackdrop.classList.remove('hidden');
}
function closeUploadModal() {
  modalBackdrop.classList.add('hidden');
}
function chooseFiles() {
  fileInput.click();
}
$('#addDocumentBtn').addEventListener('click', openUploadModal);
$('#addDropdownBtn').addEventListener('click', e => {
  e.stopPropagation();
  $('#addPopover').classList.toggle('hidden');
});
$('#uploadFromMenu').addEventListener('click', () => {
  $('#addPopover').classList.add('hidden');
  openUploadModal();
});
$('#createNoteBtn').addEventListener('click', () => {
  $('#addPopover').classList.add('hidden');
  const name = prompt('Enter a title for your note:');
  if (name && name.trim()) {
    addActivity(`You created ${name.trim()}.txt`, 'Just now', 'file-text', 'blue-bg');
    updateDocCount();
    notify('Note placeholder created in this demo.');
  }
});
$('#browseFilesBtn').addEventListener('click', chooseFiles);
$('#dropZone').addEventListener('click', e => {
  if (e.target.closest('button')) return;
  chooseFiles();
});
fileInput.addEventListener('change', () => {
  pendingFiles = [...fileInput.files];
  renderPendingFiles();
});
function renderPendingFiles() {
  selectedFiles.innerHTML = pendingFiles.map(f => `<div>📄 ${escapeHtml(f.name)} <span>(${formatSize(f.size)})</span></div>`).join('');
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function addActivity(name, time, icon = 'file-text', color = 'blue-bg') {
  const row = document.createElement('div');
  row.className = 'activity-row';
  row.innerHTML = `<div class="activity-icon ${color}"><i data-lucide="${icon}"></i></div><div><strong>${escapeHtml(name)}</strong><span>${time}</span></div><button class="more-button" aria-label="More options">⋮</button>`;
  $('#activityList').prepend(row);
  if (window.lucide) lucide.createIcons();
}
function updateDocCount() {
  const count = Number($('#totalDocs').textContent) + 1;
  $('#totalDocs').textContent = count;
}
$('#confirmUpload').addEventListener('click', () => {
  if (!pendingFiles.length) {
    notify('Please select at least one file first.');
    return;
  }
  pendingFiles.forEach(file => {
    addActivity(`You added ${file.name}`, 'Just now');
    updateDocCount();
  });
  notify(`${pendingFiles.length} file(s) selected. Demo only: files are not securely stored yet.`);
  closeUploadModal();
  fileInput.value = '';
});
$('#closeModal').addEventListener('click', closeUploadModal);
$('#cancelUpload').addEventListener('click', closeUploadModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeUploadModal(); });
$('#dropZone').addEventListener('dragover', e => { e.preventDefault(); $('#dropZone').style.background = '#edf2ff'; });
$('#dropZone').addEventListener('dragleave', () => $('#dropZone').style.background = '');
$('#dropZone').addEventListener('drop', e => {
  e.preventDefault();
  $('#dropZone').style.background = '';
  pendingFiles = [...e.dataTransfer.files];
  renderPendingFiles();
});

$('#profileBtn').addEventListener('click', e => {
  e.stopPropagation();
  $('#profilePopover').classList.toggle('hidden');
});
document.addEventListener('click', e => {
  if (!e.target.closest('#profilePopover') && !e.target.closest('#profileBtn')) $('#profilePopover').classList.add('hidden');
  if (!e.target.closest('#addPopover') && !e.target.closest('#addDropdownBtn')) $('#addPopover').classList.add('hidden');
});
$('#editProfileBtn').addEventListener('click', () => {
  $('#profilePopover').classList.add('hidden');
  const name = prompt('Enter the display name:', $('#profileName').textContent);
  if (name && name.trim()) {
    $('#profileName').textContent = name.trim();
    $('#avatarInitial').textContent = name.trim()[0].toUpperCase();
    $('#pageTitle').innerHTML = `Good evening, ${escapeHtml(name.trim())} <span class="wave">👋</span>`;
    notify('Profile display updated for this session.');
  }
});
$('#signOutBtn').addEventListener('click', () => notify('Sign-out needs to be connected to an authentication system.'));
$('#notificationBtn').addEventListener('click', () => notify('You are all caught up on notifications.'));
$('#addSectionBtn').addEventListener('click', () => {
  const name = prompt('Enter a new section name:');
  if (!name || !name.trim()) return;
  const button = document.createElement('button');
  button.className = 'nav-item';
  button.innerHTML = `<i class="section-color purple" data-lucide="folder"></i><span>${escapeHtml(name.trim())}</span>`;
  $('.section-nav').append(button);
  if (window.lucide) lucide.createIcons();
  notify(`Section "${name.trim()}" added to this view.`);
});
$$('[data-page]').forEach(button => button.addEventListener('click', () => {
  const page = button.dataset.page;
  $$('.nav-item').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  if (page === 'Add Document') { openUploadModal(); return; }
  $('#pageTitle').innerHTML = `${escapeHtml(page)} <span class="wave">📁</span>`;
  $('#pageSubtitle').textContent = page === 'Home' ? 'Your documents are safe, organized and encrypted.' : `Browse and manage your ${page.toLowerCase()} workspace.`;
  if (page !== 'Home' && page !== 'All Documents') notify(`${page} selected. Connect a backend to load its documents.`);
}));
$('#globalSearch').addEventListener('input', e => {
  const query = e.target.value.toLowerCase().trim();
  let shown = 0;
  $$('.activity-row').forEach(row => {
    const match = row.textContent.toLowerCase().includes(query);
    row.style.display = match ? 'flex' : 'none';
    if (match) shown++;
  });
  if (query && shown === 0) notify('No matching recent activity. Full document search requires stored document metadata.');
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    $('#globalSearch').focus();
  }
  if (e.key === 'Escape') {
    closeUploadModal();
    $('#profilePopover').classList.add('hidden');
    $('#addPopover').classList.add('hidden');
  }
});
$('#activityRange').addEventListener('change', e => {
  const ranges = {'Last 30 days':[5,12,10,22,17,12,28,16,22,30,24,31,41,31,43],'Last 7 days':[8,13,11,19,24,18,30,22,27,34,28,37,32,42,46],'Last 12 months':[12,18,16,25,21,29,24,35,30,38,33,43,39,46,48]};
  const values = ranges[e.target.value];
  const svg = $('#activityChart'), w=720,h=192,max=50;
  const x=i=>7+i*(w-14)/(values.length-1), y=v=>h-(v/max)*(h-10);
  let line=''; values.forEach((v,i)=>line+=`${i?' L':'M'} ${x(i)} ${y(v)}`);
  const area=`${line} L ${x(values.length-1)} ${h} L ${x(0)} ${h} Z`;
  let grid=''; for(let i=0;i<=5;i++) grid+=`<line class="chart-grid" x1="0" y1="${i*h/5}" x2="${w}" y2="${i*h/5}"/>`;
  let points=values.map((v,i)=>`<circle class="chart-point" cx="${x(i)}" cy="${y(v)}" r="4.3"/>`).join('');
  svg.innerHTML=`<defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5869f5" stop-opacity=".28"/><stop offset="100%" stop-color="#5869f5" stop-opacity=".02"/></linearGradient></defs>${grid}<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${points}`;
  notify(`Activity chart updated: ${e.target.value.toLowerCase()}.`);
});
$('#viewActivityBtn').addEventListener('click', () => notify('Showing recent activity in this dashboard.'));
$('#manageStorageBtn').addEventListener('click', () => notify('Storage provider settings need a backend integration.'));
$$('.more-button').forEach(btn => btn.addEventListener('click', () => notify('Activity options are a visual demo.')));
