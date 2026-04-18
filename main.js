// jQuery: ハンバーガーメニュー
const hbmenu = document.getElementById('hb-menu');
const mainnav = document.getElementById('main-nav');

hbmenu.addEventListener('click', () => {
	hbmenu.classList.toggle('open');
	mainnav.classList.toggle('active');
});

// カレンダー生成
const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const startDate = new Date(year, month - 1, 1);
const endDate = new Date(year, month, 0); // 修正
const endDayCount = endDate.getDate();
const startDay = startDate.getDay();
let dayCount = 1;
let calendarHtml = '';
const holidays = [
  { month: 1, day: 1 },   // 元日
  { month: 2, day: 11 },  // 建国記念の日
];
// 🔽 localStorage に保存されたイベントがあれば読み込む
let events = {};
const savedEvents = localStorage.getItem('calendarEvents');
if (savedEvents) {
  events = JSON.parse(savedEvents);
} else {
// 初期データ（初回アクセス時のみ）
let events = {
  "2025-05-24": ["dominATE in Seattle"],
  "2025-05-28": ["dominATE in San Francisco"],
  "2025-05-31": ["dominATE in Los Angeles"],
  "2025-06-06": ["dominATE in Arlington"],
  "2025-06-10": ["dominATE in Atlanta"],
  "2025-06-14": ["dominATE in Orlando"]
  };
}

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1;

function renderCalendar(year, month) {
	document.getElementById('month-title').textContent = `${year}/${month}`;  // ← ここ追加

	const startDate = new Date(year, month - 1, 1);
	const endDate = new Date(year, month, 0);
	const endDayCount = endDate.getDate();
	const startDay = startDate.getDay();
	let dayCount = 1;
	let calendarHtml = '<table class="calendar-table">';
  
	// 曜日ヘッダー
	calendarHtml += '<tr>';
	for (let i = 0; i < weeks.length; i++) {
	  calendarHtml += '<th class="calendar-title">' + weeks[i] + '</th>';
	}
	calendarHtml += '</tr>';

// 日付セルを作るループ
	for (let w = 0; w < 6; w++) {
	calendarHtml += '<tr>';
	for (let d = 0; d < 7; d++) {
    if (w == 0 && d < startDay) {
      calendarHtml += '<td></td>';
    } else if (dayCount > endDayCount) {
      calendarHtml += '<td></td>';
    } else {
      const isToday = (year === today.getFullYear() && month === (today.getMonth() + 1) && dayCount === today.getDate());
      const isHoliday = holidays.some(h => h.month === month && h.day === dayCount);

      let className = '';
      if (isToday) className += ' today';
      if (isHoliday) className += ' holiday';

      // 日付文字列を作成 YYYY-MM-DD
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;

      // 全部の予定を表示
      const eventPreview = events[dateStr] ? events[dateStr].join('<br>') : '';

      calendarHtml += `<td class="${className.trim()} ${eventPreview ? 'has-event' : ''}" onclick="openEventInput('${dateStr}')">
        <div class="date-number">${dayCount}</div>
        <div class="event-preview">${eventPreview ? '📌 ' + eventPreview : ''}</div>
      </td>`;

      dayCount++;
    }
  }
  calendarHtml += '</tr>';
}

	calendarHtml += '</table>';

// 表示
document.querySelector('#calendar').innerHTML = calendarHtml;
}


// 「予定追加」モーダルを開く関数
function openEventInput(dateStr) {
	document.getElementById('selected-date').textContent = `予定追加・編集：${dateStr}`;
	document.getElementById('event-text').value = events[dateStr] ? events[dateStr].join(', ') : '';
	document.getElementById('event-input').style.display = 'block';

//　モーダル内のdata属性に日付を保存
	document.getElementById('event-input').dataset.date = dateStr;
}

//モーダルを閉じる関数
function closeEventInput() {
	document.getElementById('event-input').style.display = 'none';
}

//予定を追加・更新する関数
function addEvent() {
	const modal = document.getElementById('event-input');
	const dateStr = modal.dataset.date;
	const eventText = document.getElementById('event-text').value.trim();

	if (!eventText) {
		alert('予定を入力してください');
		return;
	}

	// カンマ区切りで複数予定を登録できる
	events[dateStr] = eventText.split(',').map(e => e.trim());

	closeEventInput();
	renderCalendar(currentYear, currentMonth);
	
	// 🔽 localStorage に保存
	localStorage.setItem('calendarEvents', JSON.stringify(events));

	closeEventInput();
	renderCalendar(currentYear, currentMonth);
}
// 月切り替え関数
function changeMonth(diff) {
	currentMonth += diff;
	if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
	} else if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
	}
	renderCalendar(currentYear, currentMonth);
}

// 初期表示
 renderCalendar (currentYear, currentMonth);
