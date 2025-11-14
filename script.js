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
@@ -20,3 +42,13 @@ fetch('messages.json')
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
