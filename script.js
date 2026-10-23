// 1in8b.life - Birth Country Picker
(function () {
  'use strict';

  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const COUNTRIES_EN = {
    "AFG": "Afghanistan", "DZA": "Algeria", "AGO": "Angola", "ARG": "Argentina", "AUS": "Australia",
    "AUT": "Austria", "AZE": "Azerbaijan", "BGD": "Bangladesh", "BLR": "Belarus", "BEL": "Belgium",
    "BEN": "Benin", "BOL": "Bolivia", "BWA": "Botswana", "BRA": "Brazil", "BGR": "Bulgaria",
    "BFA": "Burkina Faso", "BDI": "Burundi", "KHM": "Cambodia", "CMR": "Cameroon", "CAN": "Canada",
    "CAF": "Central African Republic", "TCD": "Chad", "CHL": "Chile", "CHN": "China", "COL": "Colombia",
    "COG": "Congo", "CRI": "Costa Rica", "CIV": "Côte d'Ivoire", "CUB": "Cuba", "CZE": "Czechia",
    "COD": "Democratic Republic of the Congo", "DNK": "Denmark", "DOM": "Dominican Republic", "ECU": "Ecuador", "EGY": "Egypt",
    "SLV": "El Salvador", "GNQ": "Equatorial Guinea", "ERI": "Eritrea", "ETH": "Ethiopia", "FIN": "Finland",
    "FRA": "France", "GAB": "Gabon", "GMB": "Gambia", "GEO": "Georgia", "DEU": "Germany",
    "GHA": "Ghana", "GRC": "Greece", "GTM": "Guatemala", "GIN": "Guinea", "GNB": "Guinea-Bissau",
    "HTI": "Haiti", "HND": "Honduras", "HUN": "Hungary", "IND": "India", "IDN": "Indonesia",
    "IRN": "Iran", "IRQ": "Iraq", "IRL": "Ireland", "ISR": "Israel", "ITA": "Italy",
    "JAM": "Jamaica", "JPN": "Japan", "JOR": "Jordan", "KAZ": "Kazakhstan", "KEN": "Kenya",
    "KWT": "Kuwait", "KGZ": "Kyrgyzstan", "LAO": "Laos", "LBN": "Lebanon", "LSO": "Lesotho",
    "LBR": "Liberia", "LBY": "Libya", "MDG": "Madagascar", "MWI": "Malawi", "MYS": "Malaysia",
    "MLI": "Mali", "MRT": "Mauritania", "MEX": "Mexico", "MNG": "Mongolia", "MAR": "Morocco",
    "MOZ": "Mozambique", "MMR": "Myanmar", "NAM": "Namibia", "NPL": "Nepal", "NLD": "Netherlands",
    "NZL": "New Zealand", "NIC": "Nicaragua", "NER": "Niger", "NGA": "Nigeria", "PRK": "North Korea",
    "NOR": "Norway", "OMN": "Oman", "PAK": "Pakistan", "PSE": "Palestine", "PAN": "Panama",
    "PNG": "Papua New Guinea", "PRY": "Paraguay", "PER": "Peru", "PHL": "Philippines", "POL": "Poland",
    "PRT": "Portugal", "QAT": "Qatar", "ROU": "Romania", "RUS": "Russia", "RWA": "Rwanda",
    "SAU": "Saudi Arabia", "SEN": "Senegal", "SRB": "Serbia", "SLE": "Sierra Leone", "SGP": "Singapore",
    "SVK": "Slovakia", "SOM": "Somalia", "ZAF": "South Africa", "KOR": "South Korea", "SSD": "South Sudan",
    "ESP": "Spain", "LKA": "Sri Lanka", "SDN": "Sudan", "SWE": "Sweden", "CHE": "Switzerland",
    "SYR": "Syria", "TWN": "Taiwan", "TJK": "Tajikistan", "TZA": "Tanzania", "THA": "Thailand",
    "TGO": "Togo", "TUN": "Tunisia", "TUR": "Turkey", "TKM": "Turkmenistan", "UGA": "Uganda",
    "UKR": "Ukraine", "ARE": "United Arab Emirates", "GBR": "United Kingdom", "USA": "United States", "URY": "Uruguay",
    "UZB": "Uzbekistan", "VEN": "Venezuela", "VNM": "Vietnam", "YEM": "Yemen", "ZMB": "Zambia",
    "ZWE": "Zimbabwe", "HKG": "Hong Kong", "HRV": "Croatia", "PRI": "Puerto Rico", "BIH": "Bosnia and Herzegovina",
    "MDA": "Moldova", "ARM": "Armenia", "LTU": "Lithuania", "ALB": "Albania", "SVN": "Slovenia",
    "LVA": "Latvia", "MKD": "North Macedonia", "XKX": "Kosovo", "BHR": "Bahrain", "TTO": "Trinidad and Tobago",
    "TLS": "Timor-Leste", "EST": "Estonia", "CYP": "Cyprus", "MUS": "Mauritius", "SWZ": "Eswatini",
    "DJI": "Djibouti", "FJI": "Fiji", "COM": "Comoros", "GUY": "Guyana", "SLB": "Solomon Islands",
    "BTN": "Bhutan"
  };

  win._selectedCountryIso = 'USA';

  function applyGameHook() {
    if (typeof win.newLife === 'function' && !win.newLife._hooked) {
      const origNewLife = win.newLife;
      win.newLife = function (mode, paceMin, forceIso, o) {
        if (win._selectedCountryIso) forceIso = win._selectedCountryIso;
        return origNewLife.call(this, mode, paceMin, forceIso, o);
      };
      win.newLife._hooked = true;
    }

    if (typeof win.chooseCountry === 'function' && !win.chooseCountry._hooked) {
      const origChooseCountry = win.chooseCountry;
      win.chooseCountry = function (mode, yr) {
        if (win._selectedCountryIso && typeof win.CBY !== 'undefined' && win.CBY[win._selectedCountryIso]) {
          return win.CBY[win._selectedCountryIso];
        }
        return origChooseCountry.call(this, mode, yr);
      };
      win.chooseCountry._hooked = true;
    }
  }

  applyGameHook();
  setInterval(applyGameHook, 500);

  const countries = Object.entries(COUNTRIES_EN)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  const old = document.getElementById('c-picker-container');
  if (old) old.remove();

  const container = document.createElement('div');
  container.id = 'c-picker-container';
  container.style.cssText = 'position:fixed;top:14px;right:16px;z-index:10000;font-family:system-ui,-apple-system,sans-serif;font-size:13px;';

  const pill = document.createElement('button');
  pill.id = 'c-picker-pill';
  pill.type = 'button';
  pill.style.cssText = 'display:none;align-items:center;gap:6px;background:var(--card,#F7FAF8);color:var(--ink,#13212A);border:1px solid var(--rule,#C7D2CE);border-radius:20px;padding:6px 12px;font-size:12.5px;font-family:inherit;box-shadow:0 2px 8px rgba(19,33,42,0.08);cursor:pointer;user-select:none;';
  pill.innerHTML = '<span style="color:var(--ink3,#5F6E72);font-size:11.5px;">Country:</span><b id="c-pill-text" style="color:var(--accent,#8C1D3C);font-weight:600;">United States</b><span style="color:var(--ink3,#5F6E72);font-size:10px;margin-left:2px;">▾</span>';

  const panel = document.createElement('div');
  panel.id = 'c-picker-panel';
  panel.style.cssText = 'width:290px;background:var(--card,#F7FAF8);color:var(--ink,#13212A);border:1px solid var(--rule,#C7D2CE);border-radius:6px;padding:12px;box-shadow:0 8px 24px rgba(19,33,42,0.16);box-sizing:border-box;';
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink3,#5F6E72);">Birth Country</span>
      <button id="c-btn-minimize" title="Minimize" type="button" style="background:none;border:none;color:var(--ink3,#5F6E72);cursor:pointer;padding:2px 6px;font-size:12px;">✕</button>
    </div>
    <div style="position:relative;margin-bottom:10px;">
      <input id="c-search-input" type="text" value="United States" placeholder="Search country..." autocomplete="off" style="
        width:100%;padding:7px 10px;font-size:13px;font-family:inherit;background:var(--card2,#F0F4F2);color:var(--ink,#13212A);border:1px solid var(--rule,#C7D2CE);border-radius:4px;box-sizing:border-box;outline:none;
      " />
      <div id="c-suggestions-box" style="
        display:none;position:absolute;top:100%;left:0;right:0;max-height:210px;overflow-y:auto;background:var(--card,#F7FAF8);border:1px solid var(--rule,#C7D2CE);border-radius:0 0 4px 4px;box-shadow:0 8px 18px rgba(0,0,0,0.14);z-index:10001;margin-top:2px;
      "></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:12px;">
      <span style="color:var(--ink3,#5F6E72);">Selected:</span>
      <strong id="c-current-label" style="color:var(--accent,#8C1D3C);font-weight:600;">United States (USA)</strong>
    </div>
    <div style="display:flex;gap:6px;">
      <button id="c-btn-start" type="button" style="flex:2;background:var(--accent,#8C1D3C);color:#FFF;border:none;border-radius:4px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer;">Start</button>
      <button id="c-btn-reset" type="button" style="flex:1;background:transparent;color:var(--ink2,#4A5A61);border:1px solid var(--rule,#C7D2CE);border-radius:4px;padding:8px 8px;font-size:12px;cursor:pointer;">Random</button>
    </div>
  `;

  container.appendChild(pill);
  container.appendChild(panel);
  document.body.appendChild(container);

  const input = document.getElementById('c-search-input');
  const suggestBox = document.getElementById('c-suggestions-box');
  const currentLabel = document.getElementById('c-current-label');
  const pillText = document.getElementById('c-pill-text');
  const btnStart = document.getElementById('c-btn-start');
  const btnReset = document.getElementById('c-btn-reset');
  const btnMinimize = document.getElementById('c-btn-minimize');

  function setCollapsed(collapse) {
    if (collapse) {
      panel.style.display = 'none';
      suggestBox.style.display = 'none';
      pill.style.display = 'inline-flex';
    } else {
      pill.style.display = 'none';
      panel.style.display = 'block';
      input.focus();
      input.select();
    }
  }

  btnMinimize.onclick = () => setCollapsed(true);
  pill.onclick = () => setCollapsed(false);

  function renderSuggestions(filterText = '') {
    const q = filterText.toLowerCase().trim();
    const matched = countries.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    if (matched.length === 0) {
      suggestBox.innerHTML = '<div style="padding:8px 10px;color:var(--ink3,#888);font-size:12px;">No country found</div>';
      suggestBox.style.display = 'block';
      return;
    }
    suggestBox.innerHTML = matched.map(c => `
      <div class="c-item" data-id="${c.id}" data-name="${c.name}" style="padding:7px 10px;cursor:pointer;border-bottom:1px solid var(--rule2,#DCE4E1);display:flex;justify-content:space-between;font-size:12.5px;">
        <span>${c.name}</span>
        <span style="font-family:monospace;color:var(--ink3,#5F6E72);font-size:11px;">${c.id}</span>
      </div>
    `).join('');
    suggestBox.style.display = 'block';
    suggestBox.querySelectorAll('.c-item').forEach(el => {
      el.onmouseenter = () => el.style.background = 'var(--card2,#F0F4F2)';
      el.onmouseleave = () => el.style.background = 'transparent';
      el.onmousedown = (e) => {
        e.preventDefault();
        selectCountry(el.dataset.id, el.dataset.name);
      };
    });
  }

  function selectCountry(id, name) {
    win._selectedCountryIso = id;
    input.value = name;
    currentLabel.textContent = `${name} (${id})`;
    currentLabel.style.color = 'var(--accent,#8C1D3C)';
    pillText.textContent = name;
    suggestBox.style.display = 'none';
  }

  input.oninput = () => renderSuggestions(input.value);
  input.onfocus = () => renderSuggestions(input.value);
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      const first = suggestBox.querySelector('.c-item');
      if (first) selectCountry(first.dataset.id, first.dataset.name);
    } else if (e.key === 'Escape') {
      suggestBox.style.display = 'none';
    }
  };

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) suggestBox.style.display = 'none';
  });

  btnStart.onclick = () => {
    applyGameHook();
    setCollapsed(true);
    if (typeof win.startNewLife === 'function') {
      win.startNewLife();
    } else {
      const b = document.getElementById('startBtn') || document.getElementById('againBtn') || document.getElementById('dfAgain');
      if (b) b.click();
    }
  };

  btnReset.onclick = () => {
    win._selectedCountryIso = null;
    input.value = '';
    currentLabel.textContent = 'Random';
    currentLabel.style.color = 'var(--ink3,#5F6E72)';
    pillText.textContent = 'Random';
    suggestBox.style.display = 'none';
  };
})();
