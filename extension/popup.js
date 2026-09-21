// Gemini Cookie Exporter for go-gemini-web2api

const TARGET_COOKIES = [
  '__Secure-1PSID',
  '__Secure-1PSIDTS',
  'SAPISID',
  '__Secure-1PSIDCC'
];

let extractedCookies = {};
let activeTab = 'raw';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initButtons();
  fetchCookies();
  checkApiServer();
});

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderOutput();
    });
  });
}

function initButtons() {
  document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
  document.getElementById('btn-download').addEventListener('click', downloadCookieFile);
  document.getElementById('btn-open-gemini').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://gemini.google.com/' });
  });
  document.getElementById('btn-test-api').addEventListener('click', checkApiServer);
}

async function fetchCookies() {
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');

  try {
    // Ambil cookies dari https://gemini.google.com/ dan .google.com
    const [geminiCookies, googleCookies] = await Promise.all([
      chrome.cookies.getAll({ url: 'https://gemini.google.com/' }),
      chrome.cookies.getAll({ domain: '.google.com' })
    ]);

    const all = [...(geminiCookies || []), ...(googleCookies || [])];
    const map = {};
    for (const c of all) {
      if (TARGET_COOKIES.includes(c.name) && !map[c.name]) {
        map[c.name] = c.value;
      }
    }
    extractedCookies = map;

    // Evaluasi status cookie
    updateCookieItem('psid', '__Secure-1PSID', map['__Secure-1PSID']);
    updateCookieItem('psidts', '__Secure-1PSIDTS', map['__Secure-1PSIDTS']);
    updateCookieItem('sapisid', 'SAPISID', map['SAPISID']);
    updateCookieItem('psidcc', '__Secure-1PSIDCC', map['__Secure-1PSIDCC']);

    const hasPSID = Boolean(map['__Secure-1PSID']);
    const hasTS = Boolean(map['__Secure-1PSIDTS']);
    const hasSAPI = Boolean(map['SAPISID']);

    statusPill.className = 'status-badge';
    if (hasPSID && hasTS && hasSAPI) {
      statusPill.classList.add('ready');
      statusText.textContent = 'Siap Digunakan';
    } else if (hasPSID && !hasTS) {
      statusPill.classList.add('checking');
      statusText.textContent = 'Perlu Refresh Gemini';
    } else {
      statusPill.classList.add('error');
      statusText.textContent = 'Belum Login';
    }

    renderOutput();
  } catch (err) {
    statusPill.className = 'status-badge error';
    statusText.textContent = 'Gagal Membaca';
    document.getElementById('output-box').value = 'Error membaca cookie: ' + err.message;
  }
}

function updateCookieItem(idPrefix, name, value) {
  const el = document.getElementById(`item-${idPrefix}`);
  if (!el) return;

  const stateEl = el.querySelector('.cookie-state');
  if (value) {
    el.classList.remove('missing');
    el.classList.add('found');
    stateEl.textContent = 'Ditemukan';
    stateEl.style.color = '#3fb950';
  } else {
    el.classList.remove('found');
    el.classList.add('missing');
    stateEl.textContent = 'Tidak Ada';
    stateEl.style.color = '#f85149';
  }
}

function buildCookieString() {
  const parts = [];
  for (const name of TARGET_COOKIES) {
    if (extractedCookies[name]) {
      parts.push(`${name}=${extractedCookies[name]}`);
    }
  }
  return parts.join('; ');
}

function renderOutput() {
  const box = document.getElementById('output-box');
  const cookieStr = buildCookieString();

  if (!cookieStr) {
    box.value = '# Cookie tidak ditemukan. Silakan login terlebih dahulu di gemini.google.com';
    return;
  }

  if (activeTab === 'raw') {
    box.value = cookieStr;
  } else if (activeTab === 'env') {
    box.value = `GEMINI_COOKIE="${cookieStr}"\nGEMINI_COOKIE_REFRESH_MIN=9`;
  } else if (activeTab === 'txt') {
    box.value = cookieStr;
  }
}

function copyToClipboard() {
  const box = document.getElementById('output-box');
  if (!box.value || box.value.startsWith('#')) {
    showToast('Cookie belum tersedia!');
    return;
  }

  navigator.clipboard.writeText(box.value).then(() => {
    showToast('Berhasil disalin ke clipboard!');
  }).catch(() => {
    box.select();
    document.execCommand('copy');
    showToast('Berhasil disalin!');
  });
}

function downloadCookieFile() {
  const cookieStr = buildCookieString();
  if (!cookieStr) {
    showToast('Tidak ada cookie untuk didownload!');
    return;
  }

  const blob = new Blob([cookieStr + '\n'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cookie.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('File cookie.txt didownload!');
}

async function checkApiServer() {
  const dot = document.getElementById('api-dot');
  const text = document.getElementById('api-text');
  text.textContent = 'Mengecek...';

  try {
    const res = await fetch('http://127.0.0.1:8081/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      dot.className = 'mini-dot online';
      text.textContent = `Server Aktif (v${data.version || '0.1.0'})`;
    } else {
      dot.className = 'mini-dot offline';
      text.textContent = `Server Respon HTTP ${res.status}`;
    }
  } catch (e) {
    dot.className = 'mini-dot offline';
    text.textContent = 'Server Offline (127.0.0.1:8081)';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}
