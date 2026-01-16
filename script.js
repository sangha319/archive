// ===========================
// 한국식 POP 날짜 변환 함수
// ===========================
function formatKoreanDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(year, month - 1, day);
  
  const dayNames = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const dayName = dayNames[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${dayName}`;
}

// ===========================
// 최근 메시지 미리보기 (index.html)
// ===========================
fetch('messages.json')
  .then(res => res.json())
  .then(data => {
    const preview = document.getElementById('preview');

    if (!preview) return; // index.html이 아닐 때는 패스

    const recent = data.slice(0, 3); // 가장 최근 3개

    recent.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'preview-item';

      // 날짜 POP 스타일로 변환
      const formattedDate = formatKoreanDate(msg.date);

      div.innerHTML = `
        <p class="text">${msg.text}</p>
        <p class="date">${msg.date}</p>
        <p class="date">${formattedDate}</p>
      `;

      div.onclick = () => {
        window.location.href = `date-view.html?date=${msg.date}`;
      };

      preview.appendChild(div);
    });
  });

// ===========================
// 날짜별 화면(date-view.html)
// 날짜 표시 + 페이지 이동
// ===========================
const params = new URLSearchParams(window.location.search);
const selectedDate = params.get('date');

if (selectedDate && document.getElementById('date-title')) {
  document.getElementById('date-title').innerText = formatKoreanDate(selectedDate);
}

// ===========================
// ◀ ▶ 페이지 이동 기능 추가
// ===========================

// 현재 index.html에서 날짜 리스트를 페이지로 나눠서 보여준다는 가정
// date-list.js에서 page 번호를 넘겨줄 때 동작함
const currentPage = Number(params.get("page")) || 1;

function goToPage(page) {
  if (page < 1) return;
  window.location.href = `date-view.html?page=${page}`;
}

// 버튼이 존재할 때만 이벤트 적용
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");

if (prevBtn) {
  prevBtn.onclick = () => goToPage(currentPage - 1);
}

if (nextBtn) {
  nextBtn.onclick = () => goToPage(currentPage + 1);
}
// ===========================
// 답장 메시지 판별
// ===========================
function isReplyMessage(text) {
  return text && text.startsWith("SANGHA님의 답장");
}

// ===========================
// 답장 말풍선 HTML 생성
// ===========================
function createReplyBubble(text) {
  const lines = text.split("\n").filter(Boolean);

  // 예시 구조
  // SANGHA님의 답장
  // 너도 마라반 먹어봤어 ?
  // ↳ 먹어봤뜸!

  const original = lines[1] || "";
  const replyLine = lines.find(line => line.startsWith("↳"));
  const reply = replyLine ? replyLine.replace("↳", "").trim() : "";

  return `
    <div class="reply-box">
      <div class="reply-header">SANGHA님의 답장</div>
      <div class="reply-origin">${original}</div>
      <div class="reply-message">${reply}</div>
    </div>
  `;
}

