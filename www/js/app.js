// 显示提示消息
function showMsg(message) {
    const msgEl = document.getElementById('msg');
    msgEl.innerText = message;
    msgEl.style.display = 'block';
    setTimeout(() => { msgEl.style.display = 'none'; }, 2000);
  }
  
  // 显示弹窗
  function showAdd() { document.getElementById('addPopup').style.display = 'block'; }
  function showSub() { document.getElementById('subPopup').style.display = 'block'; }
  function closePopup(id) { document.getElementById(id).style.display = 'none'; }
  
  // 加分操作：使用 fetch 调用后端接口
  function addPoints() {
    const addText = document.getElementById('addText').value.trim();
    if (!addText) { showMsg('请输入加分数据'); return; }
    const lines = addText.split('\n');
    
    // 遍历每一行提交数据
    lines.forEach(line => {
      if (!line.trim()) return;
      const [id, score] = line.trim().split(/\s+/);
      // 可添加数据格式验证代码
      fetch('http://你的服务器公网IP:3000/addPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: parseInt(id),
          score: parseInt(score)
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(`学号 ${id} 加分成功`);
        } else {
          showMsg('加分失败：' + data.message);
        }
      })
      .catch(error => showMsg('请求失败：' + error.message));
    });
    
    showMsg('加分操作已提交');
    closePopup('addPopup');
    document.getElementById('addText').value = '';
  }
  
  // 扣分操作：类似加分
  function subPoints() {
    const subText = document.getElementById('subText').value.trim();
    if (!subText) { showMsg('请输入扣分数据'); return; }
    const lines = subText.split('\n');
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const [id, score] = line.trim().split(/\s+/);
      fetch('http://你的服务器公网IP:3000/subPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: parseInt(id),
          score: parseInt(score)
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(`学号 ${id} 扣分成功`);
        } else {
          showMsg('扣分失败：' + data.message);
        }
      })
      .catch(error => showMsg('请求失败：' + error.message));
    });
    
    showMsg('扣分操作已提交');
    closePopup('subPopup');
    document.getElementById('subText').value = '';
  }
  
  // 查询积分操作
  function queryPoints() {
    fetch('http://你的服务器公网IP:3000/query')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const result = data.data.map(row => `学号: ${row.student_id}, 积分: ${row.score}`).join('\n');
          document.getElementById('queryText').value = result;
          document.getElementById('queryResult').style.display = 'block';
        } else {
          showMsg('查询失败：' + data.message);
        }
      })
      .catch(error => showMsg('请求失败：' + error.message));
  }
  
  // 清空积分操作
  function clearPoints() {
    fetch('http://你的服务器公网IP:3000/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showMsg('积分已清空');
      } else {
        showMsg('操作失败：' + data.message);
      }
    })
    .catch(error => showMsg('请求失败：' + error.message));
  }