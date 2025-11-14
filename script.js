fetch('messages.json')
  .then(res => res.json())
  .then(data => {
    const preview = document.getElementById('preview');

    const recent = data.slice(0, 3); // 가장 최근 3개

    recent.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <p class="text">${msg.text}</p>
        <p class="date">${msg.date}</p>
      `;

      div.onclick = () => {
        window.location.href = `all.html?id=${msg.id}`;
      };

      preview.appendChild(div);
    });
  });
