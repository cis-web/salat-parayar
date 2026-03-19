/* ==================== درود — وەشانی تەواو (چاککراوە) ==================== */
'use strict';

// ==================== داتا ====================

const PRAYER_TIMES = [
    { id: 'fajr', name: 'بەیانی', arabic: 'الفجر', time: '04:58', icon: '🌙', duration: 30 },
    { id: 'sunrise', name: 'ڕۆژهەڵاتن', arabic: 'الشروق', time: '06:20', icon: '🌅', duration: 0 },
    { id: 'dhuhr', name: 'نیوەرۆ', arabic: 'الظهر', time: '12:15', icon: '☀️', duration: 30 },
    { id: 'asr', name: 'عەسر', arabic: 'العصر', time: '15:35', icon: '⛅', duration: 30 },
    { id: 'maghrib', name: 'مەغریب', arabic: 'المغرب', time: '18:15', icon: '🌇', duration: 30 },
    { id: 'isha', name: 'عیشا', arabic: 'العشاء', time: '19:40', icon: '🌙', duration: 30 }
];

const SOUNDS = [
    { id: 'makkah', name: 'بانگی مەککە', desc: 'شێخ عەبدولرەحمان سودەیس', emoji: '🕋', url: 'https://www.islamcan.com/audio/adhan/azan1.mp3' },
    { id: 'madinah', name: 'بانگی مەدینە', desc: 'شێخ عەلی جابر', emoji: '🕌', url: 'https://www.islamcan.com/audio/adhan/azan2.mp3' },
    { id: 'kurdish', name: 'بانگی کوردی', desc: 'شێخ بوستان عەبدوڵڵا', emoji: '🏔️', url: 'https://www.islamcan.com/audio/adhan/azan3.mp3' },
    { id: 'simple', name: 'دەنگی سادە', desc: 'زەنگی سادە', emoji: '🔔', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
    { id: 'silent', name: 'بێدەنگ', desc: 'تەنها لەرزاندن', emoji: '🔇', url: null }
];

const ADHKAR = {
    morning: [
        { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', translation: 'بەیانمان بوو و مافی پادشایەتی بۆ خوایە', count: 1 },
        { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا', translation: 'خوایە بە تۆوە بەیانمان بوو', count: 1 },
        { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translation: 'پاکی و ستایش بۆ خوا', count: 100 }
    ],
    evening: [
        { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', translation: 'ئێوارەمان بوو و مافی پادشایەتی بۆ خوایە', count: 1 },
        { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ نَحْيَا', translation: 'خوایە بە تۆوە ئێوارەمان بوو', count: 1 }
    ],
    night: [
        { arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي', translation: 'بە ناوی تۆوە پەروەردگارم لای خستم', count: 1 },
        { arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', translation: 'خوایە بمپارێزە لە سزای ڕۆژی دوایی', count: 3 }
    ],
    prayer: [
        { arabic: 'أَسْتَغْفِرُ اللَّهَ', translation: 'داوای لێخۆشبوون لە خوا دەکەم', count: 3 },
        { arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ', translation: 'خوایە تۆ سەلامی و سەلامەتی لە تۆوەیە', count: 1 }
    ]
};

const DUAS = {
    daily: [
        { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', translation: 'پەروەردگارمان لە دنیا و ئاخیرەت چاکەمان بدە', source: 'بەقەرە ٢٠١' },
        { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'پەروەردگارم دڵم فراوان بکە و کارم ئاسان بکە', source: 'تاکە ٢٥' }
    ],
    morning: [
        { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا', translation: 'خوایە داوای زانیاری سوودبەخش لێدەکەم', source: 'ئیبن ماجە' }
    ],
    evening: [],
    sleep: [],
    waking: [],
    food: [],
    travel: []
};

const CITIES = [
    { id: 'sulaymaniyah', name: 'سلێمانی', country: 'عێراق', flag: '🇮🇶' },
    { id: 'erbil', name: 'هەولێر', country: 'عێراق', flag: '🇮🇶' },
    { id: 'duhok', name: 'دهۆک', country: 'عێراق', flag: '🇮🇶' },
    { id: 'kirkuk', name: 'کەرکووک', country: 'عێراق', flag: '🇮🇶' },
    { id: 'baghdad', name: 'بەغدا', country: 'عێراق', flag: '🇮🇶' },
    { id: 'makkah', name: 'مەککە', country: 'عەرەبستان', flag: '🇸🇦' },
    { id: 'madinah', name: 'مەدینە', country: 'عەرەبستان', flag: '🇸🇦' },
    { id: 'istanbul', name: 'ئەستەمبوڵ', country: 'تورکیا', flag: '🇹🇷' }
];

const LANGUAGES = [
    { id: 'ckb', name: 'کوردی', native: 'Kurdî', flag: '🏔️' },
    { id: 'ar', name: 'عربي', native: 'العربية', flag: '🌙' },
    { id: 'en', name: 'English', native: 'English', flag: '🌍' }
];

// ==================== گۆڕاوە گشتییەکان ====================

let currentScreen = 'home';
let selectedSoundId = 'makkah';
let selectedCity = 'sulaymaniyah';
let selectedLang = 'ckb';
let is24Hour = false;
let notificationsEnabled = true;
let darkMode = true;

let currentAudio = null;
let isPlaying = false;
let autoTestRunning = false;
let testTimer = null;
let testCurrentIndex = 0;
let testLog = [];

const adhkarCounters = {};

// ==================== فەنکشنی کات ====================

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const clockEl = document.getElementById('clock-status');
    if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);

function getCurrentTimeInMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function findNextPrayer() {
    const now = getCurrentTimeInMinutes();
    
    for (let prayer of PRAYER_TIMES) {
        const prayerTime = timeToMinutes(prayer.time);
        if (prayerTime > now) {
            return prayer;
        }
    }
    return PRAYER_TIMES[0];
}

function getTimeRemaining(prayer) {
    const now = getCurrentTimeInMinutes();
    const prayerTime = timeToMinutes(prayer.time);
    
    let diff = prayerTime - now;
    if (diff < 0) diff += 24 * 60;
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    const seconds = 59 - new Date().getSeconds();
    
    return {
        total: diff * 60 + seconds,
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        percent: ((24*60 - diff) / (24*60)) * 100
    };
}

function updatePrayerDisplay() {
    const nextPrayer = findNextPrayer();
    const remaining = getTimeRemaining(nextPrayer);
    
    const nextNameEl = document.getElementById('next-prayer-name');
    const nextTimeEl = document.getElementById('next-prayer-time');
    const countdownEl = document.getElementById('countdown');
    const progressEl = document.getElementById('progress-fill');
    const completedEl = document.getElementById('completed-prayers');
    const remainingEl = document.getElementById('remaining-prayers');
    const nextInEl = document.getElementById('next-prayer-in');
    
    if (nextNameEl) nextNameEl.textContent = nextPrayer.name;
    if (nextTimeEl) nextTimeEl.textContent = nextPrayer.time;
    if (countdownEl) countdownEl.textContent = `${remaining.hours}:${remaining.minutes}:${remaining.seconds}`;
    if (progressEl) progressEl.style.width = `${remaining.percent}%`;
    
    const completed = PRAYER_TIMES.filter(p => timeToMinutes(p.time) < getCurrentTimeInMinutes()).length;
    if (completedEl) completedEl.textContent = completed;
    if (remainingEl) remainingEl.textContent = PRAYER_TIMES.length - completed;
    if (nextInEl) nextInEl.textContent = `${remaining.hours}خ`;
    
    renderPrayersList();
}
setInterval(updatePrayerDisplay, 1000);

function renderPrayersList() {
    const container = document.getElementById('prayers-list');
    if (!container) return;
    
    const now = getCurrentTimeInMinutes();
    const nextPrayer = findNextPrayer();
    
    container.innerHTML = PRAYER_TIMES.map(prayer => {
        const prayerTime = timeToMinutes(prayer.time);
        const isPassed = prayerTime < now;
        const isNext = prayer.id === nextPrayer.id;
        const isActive = isNext && !isPassed;
        
        return `
            <div class="prayer-item ${isPassed ? 'passed' : ''} ${isActive ? 'active' : ''}">
                <div class="prayer-icon">${prayer.icon}</div>
                <div class="prayer-info">
                    <div class="prayer-name">${prayer.name}</div>
                    <div class="prayer-arabic">${prayer.arabic}</div>
                </div>
                <div class="prayer-time-display">${prayer.time}</div>
                <div class="prayer-bell ${getNotificationState(prayer.id) ? 'on' : ''}" 
                     onclick="togglePrayerNotification('${prayer.id}')">
                    🔔
                </div>
            </div>
        `;
    }).join('');
}

function getNotificationState(prayerId) {
    return localStorage.getItem(`notif_${prayerId}`) !== 'false';
}

function togglePrayerNotification(prayerId) {
    const current = getNotificationState(prayerId);
    localStorage.setItem(`notif_${prayerId}`, (!current).toString());
    renderPrayersList();
}

// ==================== ڕێکەوت ====================

function updateDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    
    const gregorianEl = document.getElementById('gregorian-date');
    const hijriEl = document.getElementById('hijri-date');
    
    if (gregorianEl) gregorianEl.textContent = `${day}/${month}/${year}`;
    if (hijriEl) hijriEl.textContent = '١٨ ڕەمەزان ١٤٤٧';
}

// ==================== گۆڕینی شاشەکان ====================

function switchScreen(screenId, btn) {
    event?.preventDefault();
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) targetScreen.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    currentScreen = screenId;
    
    if (screenId === 'adhkar') {
        renderAdhkar('morning');
    } else if (screenId === 'dua') {
        renderDua('daily');
    }
}

// ==================== زیکرەکان ====================

function switchAdhkarTab(tab, btn) {
    event?.preventDefault();
    
    document.querySelectorAll('#screen-adhkar .tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAdhkar(tab);
}

function renderAdhkar(tab) {
    const container = document.getElementById('adhkar-container');
    if (!container) return;
    
    const items = ADHKAR[tab] || [];
    
    container.innerHTML = items.map((item, index) => {
        const key = `${tab}_${index}`;
        if (adhkarCounters[key] === undefined) adhkarCounters[key] = 0;
        const isCompleted = adhkarCounters[key] >= item.count;
        
        return `
            <div class="dhikr-card ${isCompleted ? 'completed' : ''}" id="dhikr-${key}">
                <div class="dhikr-arabic">${item.arabic}</div>
                <div class="dhikr-translation">${item.translation}</div>
                <div class="dhikr-footer">
                    <span class="dhikr-count-badge">${item.count} جار</span>
                    <div class="dhikr-counter">
                        <button class="counter-btn reset" onclick="resetDhikr('${key}')">↺</button>
                        <span class="counter-number" id="counter-${key}">${adhkarCounters[key]}</span>
                        <button class="counter-btn plus" onclick="incrementDhikr('${key}', ${item.count})">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function incrementDhikr(key, max) {
    if (adhkarCounters[key] < max) {
        adhkarCounters[key]++;
        const counterEl = document.getElementById(`counter-${key}`);
        if (counterEl) counterEl.textContent = adhkarCounters[key];
        
        if (adhkarCounters[key] >= max) {
            const cardEl = document.getElementById(`dhikr-${key}`);
            if (cardEl) cardEl.classList.add('completed');
        }
    }
}

function resetDhikr(key) {
    adhkarCounters[key] = 0;
    const counterEl = document.getElementById(`counter-${key}`);
    if (counterEl) counterEl.textContent = '0';
    
    const cardEl = document.getElementById(`dhikr-${key}`);
    if (cardEl) cardEl.classList.remove('completed');
}

// ==================== فەرمودەکان ====================

function switchDuaTab(tab, btn) {
    event?.preventDefault();
    
    document.querySelectorAll('#screen-dua .tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDua(tab);
}

function renderDua(tab) {
    const container = document.getElementById('dua-container');
    if (!container) return;
    
    const items = DUAS[tab] || [];
    
    container.innerHTML = items.map(dua => `
        <div class="dua-card">
            <div class="dua-arabic">${dua.arabic}</div>
            <div class="dua-translation">${dua.translation}</div>
            <div class="dua-source">📖 ${dua.source || 'فەرمودە'}</div>
        </div>
    `).join('');
    
    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary)">هیچ فەرمودەیەک نەدۆزرایەوە</div>';
    }
}

// ==================== دەنگ ====================

function openSoundModal() {
    renderSounds();
    openModal('modal-sound');
}

function renderSounds() {
    const container = document.getElementById('sound-options');
    if (!container) return;
    
    container.innerHTML = SOUNDS.map(sound => `
        <div class="sound-option ${sound.id === selectedSoundId ? 'selected' : ''}" id="sound-${sound.id}">
            <button class="sound-play-btn" onclick="playTestSound('${sound.id}')">
                ${sound.emoji}
            </button>
            <div class="sound-info" onclick="selectSound('${sound.id}')">
                <div class="sound-name">${sound.name}</div>
                <div class="sound-desc">${sound.desc}</div>
            </div>
            <div class="sound-radio" onclick="selectSound('${sound.id}')">
                <div class="sound-radio-dot"></div>
            </div>
        </div>
    `).join('');
}

function playTestSound(id) {
    const sound = SOUNDS.find(s => s.id === id);
    if (!sound || !sound.url) return;
    
    if (currentAudio) {
        currentAudio.pause();
    }
    
    currentAudio = new Audio(sound.url);
    currentAudio.volume = 0.5;
    currentAudio.play().catch(e => console.log('دەنگ نایەت:', e));
    
    const btn = document.querySelector(`#sound-${id} .sound-play-btn`);
    if (btn) {
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 2000);
    }
}

function selectSound(id) {
    const prev = document.getElementById(`sound-${selectedSoundId}`);
    if (prev) prev.classList.remove('selected');
    
    selectedSoundId = id;
    
    const current = document.getElementById(`sound-${id}`);
    if (current) current.classList.add('selected');
    
    const selectedSoundEl = document.getElementById('selected-sound');
    if (selectedSoundEl) {
        selectedSoundEl.textContent = SOUNDS.find(s => s.id === id)?.name || id;
    }
    
    localStorage.setItem('droood_sound', id);
    
    if (currentAudio) {
        currentAudio.pause();
    }
}

// ==================== شوێن ====================

function openLocationModal() {
    renderCities(CITIES);
    openModal('modal-location');
}

function renderCities(cities) {
    const container = document.getElementById('city-list');
    if (!container) return;
    
    container.innerHTML = cities.map(city => `
        <div class="city-option ${city.id === selectedCity ? 'selected' : ''}" onclick="selectCity('${city.id}')">
            <div class="city-icon">${city.flag}</div>
            <div>
                <div class="city-name">${city.name}</div>
                <div class="city-country">${city.country}</div>
            </div>
            <div class="city-check"></div>
        </div>
    `).join('');
}

function filterCities(query) {
    const filtered = CITIES.filter(c => 
        c.name.includes(query) || c.country.includes(query)
    );
    renderCities(filtered);
}

function selectCity(id) {
    selectedCity = id;
    const city = CITIES.find(c => c.id === id);
    
    const selectedCityEl = document.getElementById('selected-city');
    const locationNameEl = document.getElementById('location-name');
    
    if (selectedCityEl) selectedCityEl.textContent = `${city.name}، ${city.country}`;
    if (locationNameEl) locationNameEl.textContent = `${city.name}، ${city.country}`;
    
    renderCities(CITIES);
    closeModal('modal-location');
    localStorage.setItem('droood_city', id);
}

// ==================== زمان ====================

function openLanguageModal() {
    renderLanguages();
    openModal('modal-language');
}

function renderLanguages() {
    const container = document.getElementById('language-list');
    if (!container) return;
    
    container.innerHTML = LANGUAGES.map(lang => `
        <div class="lang-option ${lang.id === selectedLang ? 'selected' : ''}" onclick="selectLanguage('${lang.id}')">
            <div class="lang-name">${lang.name}</div>
            <div class="lang-native">${lang.native}</div>
            <div class="lang-check"></div>
        </div>
    `).join('');
}

function selectLanguage(id) {
    selectedLang = id;
    const lang = LANGUAGES.find(l => l.id === id);
    
    const selectedLangEl = document.getElementById('selected-language');
    if (selectedLangEl) selectedLangEl.textContent = lang.name;
    
    renderLanguages();
    closeModal('modal-language');
    localStorage.setItem('droood_lang', id);
}

// ==================== دەربارە ====================

function openAboutModal() {
    openModal('modal-about');
}

// ==================== مۆدالەکان ====================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
    
    if (id === 'modal-sound' && currentAudio) {
        currentAudio.pause();
    }
}

// ==================== ڕێکخستنەکان ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ئەپەکە بار دەبێت...');
    
    try {
        const savedSound = localStorage.getItem('droood_sound');
        if (savedSound) selectedSoundId = savedSound;
        
        const savedCity = localStorage.getItem('droood_city');
        if (savedCity) {
            selectedCity = savedCity;
            const city = CITIES.find(c => c.id === savedCity);
            if (city) {
                const selectedCityEl = document.getElementById('selected-city');
                const locationNameEl = document.getElementById('location-name');
                if (selectedCityEl) selectedCityEl.textContent = `${city.name}، ${city.country}`;
                if (locationNameEl) locationNameEl.textContent = `${city.name}، ${city.country}`;
            }
        }
        
        const savedLang = localStorage.getItem('droood_lang');
        if (savedLang) {
            selectedLang = savedLang;
            const lang = LANGUAGES.find(l => l.id === savedLang);
            if (lang) {
                const selectedLangEl = document.getElementById('selected-language');
                if (selectedLangEl) selectedLangEl.textContent = lang.name;
            }
        }
    } catch(e) {
        console.log('هەڵە لە بارکردنی پاشەکەوتکراوەکان:', e);
    }
    
    const selectedSoundEl = document.getElementById('selected-sound');
    if (selectedSoundEl) {
        selectedSoundEl.textContent = SOUNDS.find(s => s.id === selectedSoundId)?.name || 'بانگی مەککە';
    }
    
    const notifToggle = document.getElementById('notifications-toggle');
    if (notifToggle) {
        notifToggle.addEventListener('change', (e) => {
            notificationsEnabled = e.target.checked;
        });
    }
    
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
        darkToggle.addEventListener('change', (e) => {
            darkMode = e.target.checked;
        });
    }
    
    const timeToggle = document.getElementById('time-format-toggle');
    if (timeToggle) {
        timeToggle.addEventListener('change', (e) => {
            is24Hour = e.target.checked;
            const timeFormatLabel = document.getElementById('time-format-label');
            if (timeFormatLabel) {
                timeFormatLabel.textContent = is24Hour ? '٢٤ کاتژمێری' : '١٢ کاتژمێری';
            }
            updatePrayerDisplay();
        });
    }
    
    updateClock();
    updateDate();
    updatePrayerDisplay();
    renderAdhkar('morning');
    renderDua('daily');
    
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }
    }, 1000);
});

// ==================== تایبەتی بانگ ====================

function openTestPanel() {
    openModal('modal-test');
    resetTestPanel();
}

function resetTestPanel() {
    testCurrentIndex = 0;
    testLog = ['🟢 ئامادەیە...'];
    updateTestLog();
    
    const progressBar = document.getElementById('test-progress-bar');
    const startBtn = document.getElementById('test-start-btn');
    const stopBtn = document.getElementById('test-stop-btn');
    
    if (progressBar) progressBar.style.width = '0%';
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
}

function addTestLog(message) {
    testLog.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
    if (testLog.length > 8) testLog.pop();
    updateTestLog();
}

function updateTestLog() {
    const logEl = document.getElementById('test-log');
    if (logEl) {
        logEl.innerHTML = testLog.map(msg => `<div class="log-entry">${msg}</div>`).join('');
    }
}

function startAutoTest() {
    if (autoTestRunning) return;
    
    addTestLog('▶️ دەستپێکردنی تایبەت');
    autoTestRunning = true;
    testCurrentIndex = 0;
    
    const startBtn = document.getElementById('test-start-btn');
    const stopBtn = document.getElementById('test-stop-btn');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    
    runNextTestPrayer();
}

function stopAutoTest() {
    if (!autoTestRunning) return;
    
    addTestLog('⏹️ وەستاندنی تایبەت');
    autoTestRunning = false;
    
    if (testTimer) {
        clearTimeout(testTimer);
        testTimer = null;
    }
    
    if (currentAudio) {
        currentAudio.pause();
    }
    
    const startBtn = document.getElementById('test-start-btn');
    const stopBtn = document.getElementById('test-stop-btn');
    const progressBar = document.getElementById('test-progress-bar');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (progressBar) progressBar.style.width = '0%';
}

function runNextTestPrayer() {
    if (!autoTestRunning) return;
    
    if (testCurrentIndex >= PRAYER_TIMES.length) {
        addTestLog('🎉 تەواو بوو!');
        stopAutoTest();
        return;
    }
    
    const prayer = PRAYER_TIMES[testCurrentIndex];
    const progress = ((testCurrentIndex) / PRAYER_TIMES.length) * 100;
    
    const progressBar = document.getElementById('test-progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    addTestLog(`🕋 ${prayer.name} — بانگ دەدرێت`);
    
    const sound = SOUNDS.find(s => s.id === selectedSoundId);
    if (sound && sound.url) {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(sound.url);
        currentAudio.volume = 0.5;
        currentAudio.play().catch(e => addTestLog(`❌ هەڵە: ${e.message}`));
        
        setTimeout(() => {
            if (currentAudio) currentAudio.pause();
        }, 5000);
    }
    
    testCurrentIndex++;
    
    testTimer = setTimeout(runNextTestPrayer, 30000);
}

// ==================== PWA SUPPORT ====================

function isRunningAsApp() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

function adjustForAppMode() {
    if (isRunningAsApp()) {
        document.body.classList.add('app-mode');
        console.log('📱 ئەپ وەک standalone کراوەتەوە');
        
        const installBtn = document.getElementById('install-btn');
        if (installBtn) installBtn.style.display = 'none';
    }
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'flex';
    }
});

function installApp() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ ئەپ نصب کرا');
        }
        deferredPrompt = null;
    });
}

function updateOnlineStatus() {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    if (navigator.onLine) {
        statusEl.textContent = '🔵 ئۆنلاین';
        statusEl.style.color = '#4caf50';
    } else {
        statusEl.textContent = '🔴 ئۆفلاین';
        statusEl.style.color = '#f44336';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

adjustForAppMode();

// ==================== ڕاگەیاندنی فەنکشنەکان بۆ جیهانی (ئەمە زۆر گرنگە) ====================

window.switchScreen = switchScreen;
window.switchAdhkarTab = switchAdhkarTab;
window.switchDuaTab = switchDuaTab;
window.incrementDhikr = incrementDhikr;
window.resetDhikr = resetDhikr;
window.openSoundModal = openSoundModal;
window.openLocationModal = openLocationModal;
window.openLanguageModal = openLanguageModal;
window.openAboutModal = openAboutModal;
window.openTestPanel = openTestPanel;
window.closeModal = closeModal;
window.playTestSound = playTestSound;
window.selectSound = selectSound;
window.selectCity = selectCity;
window.selectLanguage = selectLanguage;
window.filterCities = filterCities;
window.togglePrayerNotification = togglePrayerNotification;
window.startAutoTest = startAutoTest;
window.stopAutoTest = stopAutoTest;
window.installApp = installApp;

console.log('✅ هەموو فەنکشنەکان ڕاگەیەندران!');
