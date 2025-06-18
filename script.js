class MoodTracker {
    constructor() {
        this.moods = [];
        this.currentDate = new Date();
        this.selectedMood = null;
        this.init();
    }

    init() {
        this.loadMoods();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // 心情選擇
        document.querySelectorAll('.mood-item').forEach(item => {
            item.addEventListener('click', () => this.selectMood(item));
        });

        // 新增心情按鈕
        document.getElementById('addMoodBtn').addEventListener('click', () => this.addMood());

        // 日期導航
        document.getElementById('prevDay').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('nextDay').addEventListener('click', () => this.changeDate(1));

        // 日曆控制
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));

        // 統計標籤切換
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // 歷史記錄搜尋和篩選
        document.getElementById('historySearch').addEventListener('input', () => this.filterHistory());
        document.getElementById('historyFilter').addEventListener('change', () => this.filterHistory());

        // 檔案輸入事件監聽器
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.handleFileImport(e);
        });
    }

    selectMood(item) {
        // 移除之前的選擇
        document.querySelectorAll('.mood-item').forEach(i => i.classList.remove('selected'));
        
        // 選擇新的心情
        item.classList.add('selected');
        this.selectedMood = {
            name: item.dataset.mood,
            score: parseInt(item.dataset.score),
            emoji: item.querySelector('span').textContent
        };

        // 顯示便條區域
        document.querySelector('.note-section').style.display = 'block';

        // 啟用新增按鈕
        document.getElementById('addMoodBtn').disabled = false;
    }

    addMood() {
        if (!this.selectedMood) return;

        const note = document.getElementById('moodNote').value.trim();
        const now = new Date();
        
        const moodEntry = {
            id: Date.now(),
            name: this.selectedMood.name,
            score: this.selectedMood.score,
            emoji: this.selectedMood.emoji,
            note: note,
            timestamp: now.toISOString(),
            date: this.formatDate(now)
        };

        // 添加到心情列表
        this.moods.push(moodEntry);
        
        // 儲存到本地
        this.saveMoods();
        
        // 重置選擇
        this.resetSelection();
        
        // 更新UI
        this.updateUI();
        
        // 顯示成功訊息
        this.showNotification('心情記錄成功！', 'success');
    }

    resetSelection() {
        document.querySelectorAll('.mood-item').forEach(item => item.classList.remove('selected'));
        document.getElementById('moodNote').value = '';
        document.querySelector('.note-section').style.display = 'none';
        document.getElementById('addMoodBtn').disabled = true;
        this.selectedMood = null;
    }

    changeDate(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.updateUI();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getCurrentDateString() {
        const today = new Date();
        const currentDate = new Date(this.currentDate);
        
        if (this.formatDate(today) === this.formatDate(currentDate)) {
            return '今天';
        } else if (this.formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)) === this.formatDate(currentDate)) {
            return '昨天';
        } else if (this.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)) === this.formatDate(currentDate)) {
            return '明天';
        } else {
            return currentDate.toLocaleDateString('zh-TW', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
    }

    getMoodsForCurrentDate() {
        const currentDateStr = this.formatDate(this.currentDate);
        return this.moods.filter(mood => mood.date === currentDateStr);
    }

    updateUI() {
        this.updateDateDisplay();
        this.updateTimeline();
        this.updateStats();
        this.updateCalendar();
        this.updateStatsOverview();
        this.updateHistoryList();
    }

    updateDateDisplay() {
        document.getElementById('currentDate').textContent = this.getCurrentDateString();
    }

    updateTimeline() {
        const timeline = document.getElementById('moodTimeline');
        const currentMoods = this.getMoodsForCurrentDate();

        if (currentMoods.length === 0) {
            timeline.innerHTML = `
                <div class="empty-timeline">
                    <i class="fas fa-clock"></i>
                    <p>還沒有心情記錄</p>
                    <p>選擇上方的心情來開始記錄吧！</p>
                </div>
            `;
            return;
        }

        // 按時間排序（最新的在前）
        currentMoods.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        timeline.innerHTML = currentMoods.map(mood => this.createMoodEntryHTML(mood)).join('');
    }

    createMoodEntryHTML(mood) {
        const date = new Date(mood.timestamp);
        const timeStr = this.formatTime(date);
        const scoreText = mood.score > 0 ? `+${mood.score}` : mood.score;
        
        return `
            <div class="mood-entry" data-mood-id="${mood.id}">
                <div class="mood-entry-content">
                    <div class="mood-entry-header">
                        <div class="mood-info">
                            <span class="mood-emoji" style="font-size: 1.5rem;">${mood.emoji}</span>
                            <span class="mood-name">${mood.name}</span>
                        </div>
                        <div class="mood-actions">
                            <div class="mood-time">${timeStr}</div>
                            <button class="delete-btn" onclick="moodTracker.deleteMood(${mood.id})" title="刪除此記錄">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mood-score">${scoreText}</div>
                    ${mood.note ? `<div class="mood-note">${mood.note}</div>` : ''}
                </div>
            </div>
        `;
    }

    updateStats() {
        const currentMoods = this.getMoodsForCurrentDate();
        const totalScore = currentMoods.reduce((sum, mood) => sum + mood.score, 0);
        const count = currentMoods.length;

        // 更新分數顯示
        document.getElementById('dailyScore').textContent = totalScore;
        document.getElementById('moodCount').textContent = count;

        // 更新分數描述
        const scoreDescription = this.getScoreDescription(totalScore, count);
        document.getElementById('scoreDescription').textContent = scoreDescription;
    }

    getScoreDescription(score, count) {
        if (count === 0) return '尚未記錄心情';
        
        if (score >= 10) return '今天心情超棒！';
        if (score >= 5) return '今天心情不錯';
        if (score >= 0) return '今天心情平穩';
        if (score >= -5) return '今天心情有點低落';
        return '今天心情不太好，要加油喔！';
    }

    saveMoods() {
        localStorage.setItem('moodTracker', JSON.stringify(this.moods));
    }

    loadMoods() {
        const saved = localStorage.getItem('moodTracker');
        this.moods = saved ? JSON.parse(saved) : [];
    }

    showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自動移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    deleteMood(moodId) {
        // 確認刪除
        if (!confirm('確定要刪除此心情記錄嗎？')) {
            return;
        }

        // 從陣列中移除
        this.moods = this.moods.filter(mood => mood.id !== moodId);
        
        // 儲存到本地
        this.saveMoods();
        
        // 更新UI
        this.updateUI();
        
        // 顯示成功訊息
        this.showNotification('心情記錄已刪除', 'success');
    }

    // 日曆視圖功能
    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();
    }

    updateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 更新月份顯示
        document.getElementById('currentMonth').textContent = 
            `${year}年${month + 1}月`;
        
        // 生成日曆
        this.generateCalendarDays(year, month);
    }

    generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (currentDate.getFullYear() === todayYear && 
                currentDate.getMonth() === todayMonth && 
                currentDate.getDate() === todayDay) {
                dayElement.classList.add('today');
            }
            
            const dateString = this.formatDate(currentDate);
            const dayMoods = this.moods.filter(mood => mood.date === dateString);
            
            if (dayMoods.length > 0) {
                dayElement.classList.add('has-mood');
            }
            
            dayElement.textContent = currentDate.getDate();
            
            dayElement.addEventListener('click', () => {
                this.currentDate = new Date(currentDate);
                this.updateUI();
            });
            
            calendarDays.appendChild(dayElement);
        }
    }

    // 統計概覽功能
    switchTab(tabName) {
        // 更新標籤狀態
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 更新內容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Stats`).classList.add('active');
        
        this.updateStatsOverview();
    }

    updateStatsOverview() {
        this.updateWeeklyStats();
        this.updateMonthlyStats();
    }

    updateWeeklyStats() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const weeklyMoods = this.getMoodsInDateRange(weekStart, today);
        const totalScore = weeklyMoods.reduce((sum, mood) => sum + mood.score, 0);
        const avgScore = weeklyMoods.length > 0 ? (totalScore / weeklyMoods.length).toFixed(1) : 0;
        
        // 找出最佳心情日
        const dailyScores = {};
        weeklyMoods.forEach(mood => {
            if (!dailyScores[mood.date]) {
                dailyScores[mood.date] = { total: 0, count: 0 };
            }
            dailyScores[mood.date].total += mood.score;
            dailyScores[mood.date].count++;
        });
        
        let bestDay = '-';
        let bestScore = -Infinity;
        Object.entries(dailyScores).forEach(([date, data]) => {
            const avg = data.total / data.count;
            if (avg > bestScore) {
                bestScore = avg;
                bestDay = this.formatDisplayDate(date);
            }
        });
        
        document.getElementById('weeklyAvgScore').textContent = avgScore;
        document.getElementById('weeklyTotalCount').textContent = weeklyMoods.length;
        document.getElementById('weeklyBestDay').textContent = bestDay;
    }

    updateMonthlyStats() {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const monthlyMoods = this.getMoodsInDateRange(monthStart, today);
        const totalScore = monthlyMoods.reduce((sum, mood) => sum + mood.score, 0);
        const avgScore = monthlyMoods.length > 0 ? (totalScore / monthlyMoods.length).toFixed(1) : 0;
        
        // 找出最佳心情週
        const weeklyScores = {};
        monthlyMoods.forEach(mood => {
            const moodDate = new Date(mood.date);
            const weekStart = new Date(moodDate);
            weekStart.setDate(moodDate.getDate() - moodDate.getDay());
            const weekKey = this.formatDate(weekStart);
            
            if (!weeklyScores[weekKey]) {
                weeklyScores[weekKey] = { total: 0, count: 0 };
            }
            weeklyScores[weekKey].total += mood.score;
            weeklyScores[weekKey].count++;
        });
        
        let bestWeek = '-';
        let bestScore = -Infinity;
        Object.entries(weeklyScores).forEach(([weekKey, data]) => {
            const avg = data.total / data.count;
            if (avg > bestScore) {
                bestScore = avg;
                bestWeek = `第${this.getWeekNumber(weekKey)}週`;
            }
        });
        
        document.getElementById('monthlyAvgScore').textContent = avgScore;
        document.getElementById('monthlyTotalCount').textContent = monthlyMoods.length;
        document.getElementById('monthlyBestWeek').textContent = bestWeek;
    }

    getMoodsInDateRange(startDate, endDate) {
        return this.moods.filter(mood => {
            const moodDate = new Date(mood.date);
            return moodDate >= startDate && moodDate <= endDate;
        });
    }

    formatDisplayDate(dateStr) {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
    }

    getWeekNumber(dateStr) {
        const date = new Date(dateStr);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // 歷史記錄列表功能
    updateHistoryList() {
        const historyList = document.getElementById('historyList');
        
        if (this.moods.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-history"></i>
                    <p>還沒有歷史記錄</p>
                    <p>開始記錄心情來建立您的歷史吧！</p>
                </div>
            `;
            return;
        }
        
        // 按日期分組
        const groupedMoods = {};
        this.moods.forEach(mood => {
            if (!groupedMoods[mood.date]) {
                groupedMoods[mood.date] = [];
            }
            groupedMoods[mood.date].push(mood);
        });
        
        // 生成歷史記錄項目
        const historyItems = Object.entries(groupedMoods)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, moods]) => this.createHistoryItemHTML(date, moods))
            .join('');
        
        historyList.innerHTML = historyItems;
        
        // 添加點擊事件
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const date = item.dataset.date;
                this.currentDate = new Date(date);
                this.updateUI();
            });
        });
    }

    createHistoryItemHTML(date, moods) {
        const totalScore = moods.reduce((sum, mood) => sum + mood.score, 0);
        const avgScore = (totalScore / moods.length).toFixed(1);
        const displayDate = this.formatDisplayDate(date);
        
        // 找出主要情緒
        const moodCounts = {};
        moods.forEach(mood => {
            moodCounts[mood.name] = (moodCounts[mood.name] || 0) + 1;
        });
        const mainMood = Object.entries(moodCounts)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        return `
            <div class="history-item" data-date="${date}">
                <div class="history-item-header">
                    <span class="history-date">${displayDate}</span>
                    <span class="history-count">${moods.length} 筆記錄</span>
                </div>
                <div class="history-summary">
                    平均分數: ${avgScore} | 主要情緒: ${mainMood}
                </div>
            </div>
        `;
    }

    filterHistory() {
        const searchTerm = document.getElementById('historySearch').value.toLowerCase();
        const filterType = document.getElementById('historyFilter').value;
        
        const historyItems = document.querySelectorAll('.history-item');
        
        historyItems.forEach(item => {
            const date = item.dataset.date;
            const moods = this.moods.filter(mood => mood.date === date);
            
            // 搜尋篩選
            const matchesSearch = searchTerm === '' || 
                date.includes(searchTerm) || 
                moods.some(mood => mood.name.toLowerCase().includes(searchTerm));
            
            // 情緒類型篩選
            let matchesFilter = true;
            if (filterType !== 'all') {
                const hasMatchingMood = moods.some(mood => {
                    if (filterType === 'positive') return mood.score > 0;
                    if (filterType === 'negative') return mood.score < 0;
                    if (filterType === 'neutral') return mood.score === 0;
                    return true;
                });
                matchesFilter = hasMatchingMood;
            }
            
            item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
        });
    }

    // 備份資料功能
    exportData() {
        const data = {
            moods: this.moods,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.showNotification('資料備份成功！', 'success');
    }

    // 還原資料功能
    importData() {
        const fileInput = document.getElementById('importFile');
        fileInput.click();
    }

    // 處理檔案匯入
    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 檢查檔案類型
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            this.showNotification('請選擇有效的JSON檔案', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // 驗證資料格式
                if (!data.moods || !Array.isArray(data.moods)) {
                    this.showNotification('檔案格式不正確', 'error');
                    return;
                }
                
                // 確認是否要覆蓋現有資料
                if (this.moods.length > 0) {
                    if (!confirm('還原資料將會覆蓋現有的心情記錄，確定要繼續嗎？')) {
                        return;
                    }
                }
                
                // 匯入資料
                this.moods = data.moods;
                this.saveMoods();
                this.updateUI();
                
                // 清空檔案輸入
                e.target.value = '';
                
                this.showNotification('資料還原成功！', 'success');
                
            } catch (error) {
                console.error('解析檔案時發生錯誤:', error);
                this.showNotification('檔案解析失敗，請檢查檔案格式', 'error');
            }
        };
        
        reader.onerror = () => {
            this.showNotification('讀取檔案時發生錯誤', 'error');
        };
        
        reader.readAsText(file);
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
}); 
