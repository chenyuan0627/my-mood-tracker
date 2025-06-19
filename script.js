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
        this.loadCustomMoods();
        this.updateUI();
    }

    setupEventListeners() {
        // 心情選擇
        document.querySelectorAll('.mood-item').forEach(item => {
            item.addEventListener('click', () => this.selectMood(item));
        });

        // 新增心情按鈕
        const addMoodBtn = document.getElementById('addMoodBtn');
        if (addMoodBtn) addMoodBtn.addEventListener('click', () => this.addMood());

        // 日期導航
        const prevDay = document.getElementById('prevDay');
        if (prevDay) prevDay.addEventListener('click', () => this.changeDate(-1));
        const nextDay = document.getElementById('nextDay');
        if (nextDay) nextDay.addEventListener('click', () => this.changeDate(1));

        // 日曆控制
        const prevMonth = document.getElementById('prevMonth');
        if (prevMonth) prevMonth.addEventListener('click', () => this.changeMonth(-1));
        const nextMonth = document.getElementById('nextMonth');
        if (nextMonth) nextMonth.addEventListener('click', () => this.changeMonth(1));

        // 統計標籤切換
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // 歷史記錄搜尋和篩選
        const historySearch = document.getElementById('historySearch');
        if (historySearch) historySearch.addEventListener('input', () => this.filterHistory());
        const historyFilter = document.getElementById('historyFilter');
        if (historyFilter) historyFilter.addEventListener('change', () => this.filterHistory());

        // 檔案輸入事件監聽器
        const importFile = document.getElementById('importFile');
        if (importFile) importFile.addEventListener('change', (e) => {
            this.handleFileImport(e);
        });

        // 自訂心情相關事件監聽器
        this.setupCustomMoodListeners();
    }

    setupCustomMoodListeners() {
        // Emoji選擇器
        document.querySelectorAll('.emoji-option').forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他選中的emoji
                document.querySelectorAll('.emoji-option').forEach(opt => opt.classList.remove('selected'));
                // 選中當前emoji
                option.classList.add('selected');
                // 更新顯示的emoji
                const selectedEmoji = document.getElementById('selectedEmoji');
                if (selectedEmoji) selectedEmoji.textContent = option.dataset.emoji;
            });
        });

        // 分數滑桿
        const scoreSlider = document.getElementById('customMoodScore');
        const scoreDisplay = document.getElementById('scoreDisplay');
        
        if (scoreSlider && scoreDisplay) {
            scoreSlider.addEventListener('input', () => {
                scoreDisplay.textContent = scoreSlider.value;
            });
        }

        // 預設選中第一個emoji
        const firstEmojiOption = document.querySelector('.emoji-option');
        if (firstEmojiOption) {
            firstEmojiOption.classList.add('selected');
        }
    }

    // 顯示自訂心情表單
    showCustomMoodForm() {
        const form = document.getElementById('customMoodForm');
        if (form) form.style.display = 'block';
        const name = document.getElementById('customMoodName');
        if (name) name.value = '';
        const score = document.getElementById('customMoodScore');
        if (score) score.value = '0';
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) scoreDisplay.textContent = '0';
        document.querySelectorAll('.emoji-option').forEach(opt => opt.classList.remove('selected'));
        const firstEmojiOption = document.querySelector('.emoji-option');
        if (firstEmojiOption) firstEmojiOption.classList.add('selected');
        const selectedEmoji = document.getElementById('selectedEmoji');
        if (selectedEmoji) selectedEmoji.textContent = '😊';
    }

    // 隱藏自訂心情表單
    hideCustomMoodForm() {
        const form = document.getElementById('customMoodForm');
        if (form) form.style.display = 'none';
    }

    // 新增自訂心情
    addCustomMood() {
        const name = document.getElementById('customMoodName').value.trim();
        const emoji = document.getElementById('selectedEmoji').textContent;
        const score = parseInt(document.getElementById('customMoodScore').value);

        // 驗證輸入
        if (!name) {
            this.showNotification('請輸入心情名稱', 'error');
            return;
        }

        if (name.length > 10) {
            this.showNotification('心情名稱不能超過10個字', 'error');
            return;
        }

        // 檢查是否已存在相同名稱的心情
        const existingMood = document.querySelector(`[data-mood="${name}"]`);
        if (existingMood) {
            this.showNotification('此心情名稱已存在', 'error');
            return;
        }

        // 創建新的心情選項
        const newMoodElement = document.createElement('div');
        newMoodElement.className = 'mood-item custom-mood-item';
        newMoodElement.dataset.mood = name;
        newMoodElement.dataset.score = score;
        newMoodElement.innerHTML = `
            <span style="font-size: 2rem;">${emoji}</span>
            <span>${name}</span>
            <button class="delete-mood-btn" onclick="moodTracker.deleteCustomMood('${name}')" title="刪除此心情">
                <i class="fas fa-times"></i>
            </button>
        `;

        // 添加點擊事件
        newMoodElement.addEventListener('click', (e) => {
            // 如果點擊的是刪除按鈕，不觸發選擇
            if (e.target.closest('.delete-mood-btn')) {
                return;
            }
            this.selectMood(newMoodElement);
        });

        // 根據分數排序插入到正確位置
        const moodGrid = document.querySelector('.mood-grid');
        const moodItems = Array.from(moodGrid.querySelectorAll('.mood-item:not(.custom-mood-btn)'));
        const customMoodBtn = document.querySelector('.custom-mood-btn');
        
        // 找到正確的插入位置
        let insertBeforeElement = customMoodBtn;
        for (let i = 0; i < moodItems.length; i++) {
            const itemScore = parseInt(moodItems[i].dataset.score);
            if (score > itemScore) {
                insertBeforeElement = moodItems[i];
                break;
            }
        }
        
        // 插入新心情
        moodGrid.insertBefore(newMoodElement, insertBeforeElement);

        // 儲存自訂心情到本地
        this.saveCustomMoods();

        // 隱藏表單
        this.hideCustomMoodForm();

        // 顯示成功訊息
        this.showNotification(`已新增心情：${name}`, 'success');
    }

    // 刪除自訂心情
    deleteCustomMood(moodName) {
        // 確認刪除
        if (!confirm(`確定要刪除心情「${moodName}」嗎？`)) {
            return;
        }

        // 移除DOM元素
        const moodElement = document.querySelector(`[data-mood="${moodName}"]`);
        if (moodElement) {
            moodElement.remove();
        }

        // 從本地儲存中移除
        this.saveCustomMoods();

        // 顯示成功訊息
        this.showNotification(`已刪除心情：${moodName}`, 'success');
    }

    // 儲存自訂心情到本地
    saveCustomMoods() {
        const customMoods = [];
        document.querySelectorAll('.mood-item.custom-mood-item').forEach(item => {
            const emojiSpan = item.querySelector('span');
            customMoods.push({
                name: item.dataset.mood,
                score: parseInt(item.dataset.score),
                emoji: emojiSpan.textContent
            });
        });
        localStorage.setItem('customMoods', JSON.stringify(customMoods));
    }

    // 載入自訂心情
    loadCustomMoods() {
        const saved = localStorage.getItem('customMoods');
        const customMoods = saved ? JSON.parse(saved) : [];

        // 重新建立自訂心情元素
        customMoods.forEach(mood => {
            const newMoodElement = document.createElement('div');
            newMoodElement.className = 'mood-item custom-mood-item';
            newMoodElement.dataset.mood = mood.name;
            newMoodElement.dataset.score = mood.score;
            newMoodElement.innerHTML = `
                <span style="font-size: 2rem;">${mood.emoji}</span>
                <span>${mood.name}</span>
                <button class="delete-mood-btn" onclick="moodTracker.deleteCustomMood('${mood.name}')" title="刪除此心情">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // 添加點擊事件
            newMoodElement.addEventListener('click', (e) => {
                // 如果點擊的是刪除按鈕，不觸發選擇
                if (e.target.closest('.delete-mood-btn')) {
                    return;
                }
                this.selectMood(newMoodElement);
            });

            // 根據分數排序插入到正確位置
            const moodGrid = document.querySelector('.mood-grid');
            const moodItems = Array.from(moodGrid.querySelectorAll('.mood-item:not(.custom-mood-btn)'));
            const customMoodBtn = document.querySelector('.custom-mood-btn');
            
            // 找到正確的插入位置
            let insertBeforeElement = customMoodBtn;
            for (let i = 0; i < moodItems.length; i++) {
                const itemScore = parseInt(moodItems[i].dataset.score);
                if (mood.score > itemScore) {
                    insertBeforeElement = moodItems[i];
                    break;
                }
            }
            
            // 插入自訂心情
            moodGrid.insertBefore(newMoodElement, insertBeforeElement);
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
        const noteSection = document.querySelector('.note-section');
        if (noteSection) noteSection.style.display = 'block';

        // 啟用新增按鈕
        const addMoodBtn = document.getElementById('addMoodBtn');
        if (addMoodBtn) addMoodBtn.disabled = false;
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
            date: this.formatDate(this.currentDate)
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
        const moodNote = document.getElementById('moodNote');
        if (moodNote) moodNote.value = '';
        const noteSection = document.querySelector('.note-section');
        if (noteSection) noteSection.style.display = 'none';
        const addMoodBtn = document.getElementById('addMoodBtn');
        if (addMoodBtn) addMoodBtn.disabled = true;
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
        setTimeout(() => this.updateMonthTrendSelect(), 0);
    }

    updateDateDisplay() {
        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) currentDateEl.textContent = this.getCurrentDateString();
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
        const dailyScore = document.getElementById('dailyScore');
        if (dailyScore) dailyScore.textContent = totalScore;
        const moodCount = document.getElementById('moodCount');
        if (moodCount) moodCount.textContent = count;

        // 更新分數描述
        const scoreDescription = this.getScoreDescription(totalScore, count);
        const scoreDescEl = document.getElementById('scoreDescription');
        if (scoreDescEl) scoreDescEl.textContent = scoreDescription;
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
        const currentMonth = document.getElementById('currentMonth');
        if (currentMonth) currentMonth.textContent = `${year}年${month + 1}月`;
        
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
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabBtn) tabBtn.classList.add('active');
        
        // 更新內容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const tabContent = document.getElementById(`${tabName}Stats`);
        if (tabContent) tabContent.classList.add('active');
        
        this.updateStatsOverview && this.updateStatsOverview();
    }

    updateStatsOverview() {
        this.updateMonthlyStats();
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
        Object.entries(weeklyScores).forEach(([week, data]) => {
            const avg = data.total / data.count;
            if (avg > bestScore) {
                bestScore = avg;
                bestWeek = this.formatDisplayDate(week);
            }
        });
        
        const monthlyAvgScore = document.getElementById('monthlyAvgScore');
        if (monthlyAvgScore) monthlyAvgScore.textContent = avgScore;
        const monthlyTotalCount = document.getElementById('monthlyTotalCount');
        if (monthlyTotalCount) monthlyTotalCount.textContent = monthlyMoods.length;
        const monthlyBestWeek = document.getElementById('monthlyBestWeek');
        if (monthlyBestWeek) monthlyBestWeek.textContent = bestWeek;
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
        if (fileInput) fileInput.click();
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

    updateMonthTrendSelect() {
        const select = document.getElementById('monthTrendSelect');
        if (!select) return;
        const months = this.getAllMonthsWithData();
        // 一定要有本月，且所有月份都要去重、排序新到舊
        const today = new Date();
        const thisMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        const set = new Set([thisMonth, ...months]);
        const allMonths = Array.from(set).sort((a, b) => b.localeCompare(a));
        this.fillMonthOptions(select, allMonths);
        // 若未選擇，預設選本月
        if (!this.selectedTrendMonth || !allMonths.includes(this.selectedTrendMonth)) {
            this.selectedTrendMonth = thisMonth;
        }
        select.value = this.selectedTrendMonth;
        // 監聽變化（只加一次）
        if (!select._trendListener) {
            select.addEventListener('change', () => {
                this.selectedTrendMonth = select.value;
                this.updateWeeklyStats();
            });
            select._trendListener = true;
        }
        // 每次都要刷新圖表（避免 updateUI 蓋掉）
        this.updateWeeklyStats();
    }

    fillMonthOptions(select, months) {
        select.innerHTML = '';
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            const [y, m] = month.split('-');
            option.textContent = `${y}年${m}月`;
            select.appendChild(option);
        });
    }

    getAllMonthsWithData() {
        // 回傳所有有紀錄的年月（yyyy-MM），新到舊
        const set = new Set();
        this.moods.forEach(mood => {
            if (mood.date) {
                const d = new Date(mood.date);
                const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                set.add(ym);
            }
        });
        return Array.from(set).sort((a, b) => b.localeCompare(a));
    }

    updateWeeklyStats() {
        // 依照 this.selectedTrendMonth 顯示該月
        let year, month;
        if (this.selectedTrendMonth) {
            const [y, m] = this.selectedTrendMonth.split('-');
            year = parseInt(y);
            month = parseInt(m) - 1;
        } else {
            const today = new Date();
            year = today.getFullYear();
            month = today.getMonth();
        }
        const monthStart = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // 取得該月所有心情
        const monthlyMoods = this.getMoodsInDateRange(monthStart, new Date(year, month, daysInMonth));
        const totalScore = monthlyMoods.reduce((sum, mood) => sum + mood.score, 0);
        const avgScore = monthlyMoods.length > 0 ? (totalScore / monthlyMoods.length).toFixed(1) : 0;
        // 找出最佳心情日
        const dailyScores = {};
        monthlyMoods.forEach(mood => {
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
        const weeklyAvgScore = document.getElementById('weeklyAvgScore');
        if (weeklyAvgScore) weeklyAvgScore.textContent = avgScore;
        const weeklyTotalCount = document.getElementById('weeklyTotalCount');
        if (weeklyTotalCount) weeklyTotalCount.textContent = monthlyMoods.length;
        const weeklyBestDay = document.getElementById('weeklyBestDay');
        if (weeklyBestDay) weeklyBestDay.textContent = bestDay;
        // ====== 心情趨勢圖（該月每日分數） ======
        const labels = [];
        const data = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dateStr = this.formatDate(date);
            labels.push((month + 1) + '/' + d);
            const moods = this.moods.filter(mood => mood.date === dateStr);
            const total = moods.reduce((sum, mood) => sum + mood.score, 0);
            const avg = moods.length ? (total / moods.length) : 0;
            data.push(avg);
        }
        const chartDiv = document.getElementById('weeklyChart');
        if (chartDiv) {
            const canvasWidth = Math.max(daysInMonth * 36, 900); // 每天36px，最小900px
            chartDiv.innerHTML = `<canvas id=\"weeklyChartCanvas\" width=\"${canvasWidth}\" height=\"220\"></canvas>`;
            const canvas = document.getElementById('weeklyChartCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (this.weeklyChart) this.weeklyChart.destroy();
                this.weeklyChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '每日平均分數',
                            data: data,
                            borderColor: '#4299e1',
                            backgroundColor: 'rgba(66,153,225,0.1)',
                            fill: true,
                            spanGaps: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks: { maxRotation: 0, minRotation: 0 },
                                title: { display: true, text: '日期' }
                            },
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true },
                            zoom: {
                                pan: { enabled: false },
                                zoom: { enabled: false }
                            }
                        }
                    }
                });
            }
        }
        // ====== 心情趨勢圖結束 ======
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
}); 
