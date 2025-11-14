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
        <p class="date">${formattedDate}</p>
      `;

      div.onclick = () => {
        window.location.href = `all.html?id=${msg.id}`;
      };

      preview.appendChild(div);
    });
  });

// ===========================
// 날짜별 화면(date-view.html) 날짜 표시
// ===========================
const params = new URLSearchParams(window.location.search);
const selectedDate = params.get('date');

if (selectedDate && document.getElementById('date-title')) {
  document.getElementById('date-title').innerText = formatKoreanDate(selectedDate);
}

// ===========================
// 날짜별 POP 메시지 출력 (date-view.html)
// ===========================
if (selectedDate && document.getElementById('messages')) {

  fetch("messages.json?v=" + Date.now())  // 캐시 방지
    .then(res => res.json())
    .then(data => {
      const msgBox = document.getElementById("messages");

      // 선택된 날짜 메시지만 필터
      const filtered = data.filter(msg => msg.date === selectedDate);

      let prevMsg = null;

      filtered.forEach(msg => {
        const block = document.createElement("div");
        block.className = "message-block";

        const isContinuous =
          prevMsg &&
          prevMsg.time === msg.time;  // 🔥 같은 시간 → 연속 메시지

        // ================================
        // 1) 새로운 시간의 첫 메시지
        // ================================
        if (!isContinuous) {
          block.innerHTML = `
            <img class="avatar" src="SANGHA.jpg">
            <div class="msg-right">
              <div class="sender-line">
                <span class="name">SANGHA</span>
                <span class="time">${msg.time}</span>
              </div>
              <div class="bubble">${msg.text.replace(/\n/g, "<br>")}</div>
            </div>
          `;
        } 
        
        // ================================
        // 2) 연속 메시지 (프사/이름/시간 제거)
        // ================================
        else {
          block.innerHTML = `
            <div class="msg-right continuous">
              <div class="bubble">${msg.text.replace(/\n/g, "<br>")}</div>
            </div>
          `;
        }

        msgBox.appendChild(block);
        prevMsg = msg; // 다음 메시지 비교용 저장
      });
    });
}
