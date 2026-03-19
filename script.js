/* ==================== درود — وەشانی تەواو ==================== */
'use strict';

// ==================== داتا ====================

// کاتی نوێژەکان
const PRAYER_TIMES = [
    { id: 'fajr', name: 'بەیانی', arabic: 'الفجر', time: '04:58', icon: '🌙', duration: 30 },
    { id: 'sunrise', name: 'ڕۆژهەڵاتن', arabic: 'الشروق', time: '06:20', icon: '🌅', duration: 0 },
    { id: 'dhuhr', name: 'نیوەرۆ', arabic: 'الظهر', time: '12:15', icon: '☀️', duration: 30 },
    { id: 'asr', name: 'عەسر', arabic: 'العصر', time: '15:35', icon: '⛅', duration: 30 },
    { id: 'maghrib', name: 'مەغریب', arabic: 'المغرب', time: '18:15', icon: '🌇', duration: 30 },
    { id: 'isha', name: 'عیشا', arabic: 'العشاء', time: '19:40', icon: '🌙', duration: 30 }
];

// دەنگەکانی بانگ
const SOUNDS = [
    { id: 'makkah', name: 'بانگی مەککە', desc: 'شێخ عەبدولرەحمان سودەیس', emoji: '🕋', url: 'https://www.islamcan.com/audio/adhan/azan1.mp3' },
    { id: 'madinah', name: 'بانگی مەدینە', desc: 'شێخ عەلی جابر', emoji: '🕌', url: 'https://www.islamcan.com/audio/adhan/azan2.mp3' },
    { id: 'kurdish', name: 'بانگی کوردی', desc: 'شێخ بوستان عەبدوڵڵا', emoji: '🏔️', url: 'https://www.islamcan.com/audio/adhan/azan3.mp3' },
    { id: 'simple', name: 'دەنگی سادە', desc: 'زەنگی سادە', emoji: '🔔', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
    { id: 'silent', name: 'بێدەنگ', desc: 'تەنها لەرزاندن', emoji: '🔇', url: null }
];

// زیکرەکان
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

// فەرمودەکان
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

// شارەکان
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

// زمانەکان
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

// ==================== فەنکشنی کات ====================

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock-status').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

function getCurrentTimeInMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTimeForDisplay(hours, minutes) {
    if (is24Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
        const period = hours >= 12 ? 'د.ن' : 'ب.ن';
        const hour12 = hours % 12 || 12;
        return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
}

function findNextPrayer() {
    const now = getCurrentTimeInMinutes();
    
    for (let prayer of PRAYER_TIMES) {
        const prayerTime = timeToMinutes(prayer.time);
        if (prayerTime > now) {
            return prayer;
        }
    }
    return PRAYER_TIMES[0]; // بەیانی سبەی
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
    
    document.getElementById('next-prayer-name').textContent = nextPrayer.name;
    document.getElementById('next-prayer-time').textContent = nextPrayer.time;
    document.getElementById('countdown').textContent = `${remaining.hours}:${remaining.minutes}:${remaining.seconds}`;
    document.getElementById('progress-fill').style.width = `${remaining.percent}%`;
    
    // ئامارەکان
    const completed = PRAYER_TIMES.filter(p => timeToMinutes(p.time) < getCurrentTimeInMinutes()).length;
    document.getElementById('completed-prayers').textContent = completed;
    document.getElementById('remaining-prayers').textContent = PRAYER_TIMES.length - completed;
    document.getElementById('next-prayer-in').textContent = `${remaining.hours}خ`;
    
    // نوێژەکان پیشان بدە
    renderPrayersList();
}
setInterval(updatePrayerDisplay, 1000);
updatePrayerDisplay();

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
    document.getElementById('gregorian-date').textContent = `${day}/${month}/${year}`;
    
    // هیجری (نزیکەیی)
    const hijriDate = getHijriDate(now);
    document.getElementById('hijri-date').textContent = hijriDate;
}
updateDate();

function getHijriDate(date) {
    // ئەمە تەنها بۆ نمونەیە — بۆ وەشانی ڕاستەقینە دەبێت API بەکاربهێنیت
    return '١٨ ڕەمەزان ١٤٤٧';
}

// ==================== گۆڕینی شاشەکان ====================

function switchScreen(screenId, btn) {
    // داخستنی هەموو شاشەکان
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');
    
    // نوێکردنەوەی دوگمەکانی navigation
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    currentScreen = screenId;
    
    // بارکردنی داتا بەپێی شاشە
    if (screenId === 'adhkar') {
        renderAdhkar('morning');
    } else if (screenId === 'dua') {
        renderDua('daily');
    }
}

// ==================== زیکرەکان ====================

let currentAdhkarTab = 'morning';
const adhkarCounters = {};

function switchAdhkarTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.parentElement?.parentElement?.id === 'screen-adhkar') {
            btn.classList.remove('active');
        }
    });
    event.target.classList.add('active');
    currentAdhkarTab = tab;
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
        document.getElementById(`counter-${key}`).textContent = adhkarCounters[key];
        
        if (adhkarCounters[key] >= max) {
            document.getElementById(`dhikr-${key}`).classList.add('completed');
        }
    }
}

function resetDhikr(key) {
    adhkarCounters[key] = 0;
    document.getElementById(`counter-${key}`).textContent = '0';
    document.getElementById(`dhikr-${key}`).classList.remove('completed');
}

// ==================== فەرمودەکان ====================

function switchDuaTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.parentElement?.parentElement?.id === 'screen-dua') {
            btn.classList.remove('active');
        }
    });
    event.target.classList.add('active');
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
    
    // پێشاندانی ئەنیمەیشن
    const btn = document.querySelector(`#sound-${id} .sound-play-btn`);
    btn.classList.add('playing');
    setTimeout(() => btn.classList.remove('playing'), 2000);
}

function selectSound(id) {
    const prev = document.getElementById(`sound-${selectedSoundId}`);
    if (prev) prev.classList.remove('selected');
    
    selectedSoundId = id;
    
    const current = document.getElementById(`sound-${id}`);
    if (current) current.classList.add('selected');
    
    document.getElementById('selected-sound').textContent = SOUNDS.find(s => s.id === id)?.name || id;
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
    
    document.getElementById('selected-city').textContent = `${city.name}، ${city.country}`;
    document.getElementById('location-name').textContent = `${city.name}، ${city.country}`;
    
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
    
    document.getElementById('selected-language').textContent = lang.name;
    
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
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    
    if (id === 'modal-sound' && currentAudio) {
        currentAudio.pause();
    }
}

// ==================== ڕێکخستنەکان ====================

document.addEventListener('DOMContentLoaded', () => {
    // بارکردنی پاشەکەوتکراوەکان
    try {
        const savedSound = localStorage.getItem('droood_sound');
        if (savedSound) selectedSoundId = savedSound;
        
        const savedCity = localStorage.getItem('droood_city');
        if (savedCity) {
            selectedCity = savedCity;
            const city = CITIES.find(c => c.id === savedCity);
            if (city) {
                document.getElementById('selected-city').textContent = `${city.name}، ${city.country}`;
                document.getElementById('location-name').textContent = `${city.name}، ${city.country}`;
            }
        }
        
        const savedLang = localStorage.getItem('droood_lang');
        if (savedLang) {
            selectedLang = savedLang;
            const lang = LANGUAGES.find(l => l.id === savedLang);
            if (lang) document.getElementById('selected-language').textContent = lang.name;
        }
    } catch(e) {}
    
    document.getElementById('selected-sound').textContent = SOUNDS.find(s => s.id === selectedSoundId)?.name || 'بانگی مەککە';
    
    // تۆگڵەکان
    document.getElementById('notifications-toggle').addEventListener('change', (e) => {
        notificationsEnabled = e.target.checked;
    });
    
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        darkMode = e.target.checked;
    });
    
    document.getElementById('time-format-toggle').addEventListener('change', (e) => {
        is24Hour = e.target.checked;
        document.getElementById('time-format-label').textContent = is24Hour ? '٢٤ کاتژمێری' : '١٢ کاتژمێری';
        updatePrayerDisplay();
    });
    
    // زیکر و فەرمودە پیشان بدە
    renderAdhkar('morning');
    renderDua('daily');
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
    document.getElementById('test-progress-bar').style.width = '0%';
    document.getElementById('test-start-btn').disabled = false;
    document.getElementById('test-stop-btn').disabled = true;
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
    
    document.getElementById('test-start-btn').disabled = true;
    document.getElementById('test-stop-btn').disabled = false;
    
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
    
    document.getElementById('test-start-btn').disabled = false;
    document.getElementById('test-stop-btn').disabled = true;
    document.getElementById('test-progress-bar').style.width = '0%';
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
    document.getElementById('test-progress-bar').style.width = `${progress}%`;
    
    addTestLog(`🕋 ${prayer.name} — بانگ دەدرێت`);
    
    // لێدانی دەنگ
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
    
    testTimer = setTimeout(runNextTestPrayer, 30000); // ٣٠ چرکە
}

// پێشاندانی فەنکشنەکان بۆ جیهانی
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
// ==================== PWA SUPPORT ====================

// پشکنین ئایا وەک ئەپ کراوەتەوە
function isRunningAsApp() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// ڕێکخستنی status bar بۆ ئەپ
function adjustForAppMode() {
    if (isRunningAsApp()) {
        document.body.classList.add('app-mode');
        console.log('📱 ئەپ وەک standalone کراوەتەوە');
    }
}

// پێشنیاری نصبکردنی ئەپ بۆ ئەندرۆید/دێسکتۆپ
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // پیشاندانی دوگمەی نصب (ئەگەر ویستت)
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

// پشکنینی دۆخی ئۆفلاین/ئۆنلاین
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

// بانگەوە لە سەرەتادا
adjustForAppMode();