<script>
  /* ===============================
      날짜 변환 함수 (YYYY-MM-DD → 한글 날짜)
  =============================== */
  function formatKoreanDate(dateStr) {
    const [y, m, d] = dateStr.split("-");
    const date = new Date(y, m - 1, d);
    const dayNames = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
    return `${y}년 ${Number(m)}월 ${Number(d)}일 ${dayNames[date.getDay()]}`;
  }

  /* URL 파라미터에서 날짜 읽기 */
  const params = new URLSearchParams(window.location.search);
  const selectedDate = params.get("date");

  document.getElementById("date-title").innerText = formatKoreanDate(selectedDate);

  /* ===============================
      메시지 불러오기 + 연속 메시지 처리
  =============================== */
  fetch("messages.json?v=" + Date.now())
    .then(res => res.json())
    .then(data => {
      const msgBox = document.getElementById("messages");
      const filtered = data.filter(msg => msg.date === selectedDate);

      let prevMsg = null; // 이전 메시지 저장

      filtered.forEach(msg => {
        const block = document.createElement("div");
        block.className = "message-block";

        const isContinuous =
          prevMsg &&
          prevMsg.time === msg.time; // 🔥 같은 시간이면 연속 메시지!

        /* ======================
            1) 연속이 아닌 메시지
        ====================== */
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

        /* ======================
            2) 연속 메시지 (프로필/이름/시간 제거)
        ====================== */
        else {
          block.innerHTML = `
            <div class="msg-right continuous">
              <div class="bubble">${msg.text.replace(/\n/g, "<br>")}</div>
            </div>
          `;
        }

        msgBox.appendChild(block);
        prevMsg = msg; // 현재 메시지를 다음 비교용으로 저장
      });
    });
</script>
