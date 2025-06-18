* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 25%, #FFFFBA 50%, #BAFFC9 75%, #BAE1FF 100%);
    min-height: 100vh;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
header {
    text-align: center;
    margin-bottom: 40px;
    color: #8B5A8B;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(139, 90, 139, 0.2);
}

header p {
    font-size: 1.1rem;
    color: #9B6B9B;
}

/* 新增心情區域 */
.add-mood-section {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.add-mood-section h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #8B5A8B;
    font-size: 1.5rem;
}

.mood-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
}

.mood-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    background: #FFF8DC;
    position: relative;
}

.mood-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 179, 186, 0.3);
}

.mood-item.selected {
    border-color: #FFB3BA;
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
    transform: scale(1.05);
}

.mood-item i {
    font-size: 2rem;
    margin-bottom: 8px;
}

.mood-item span {
    font-size: 0.9rem;
    font-weight: 500;
}

/* 便條區域 */
.note-section {
    margin-bottom: 20px;
}

.note-section h3 {
    color: #8B5A8B;
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: 600;
}

#moodNote {
    width: 100%;
    min-height: 100px;
    padding: 15px;
    border: 2px solid #FFE4E1;
    border-radius: 15px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    transition: border-color 0.3s ease;
    background: #FFF8DC;
}

#moodNote:focus {
    outline: none;
    border-color: #FFB3BA;
}

/* 新增按鈕 */
.add-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.add-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 179, 186, 0.4);
}

.add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 日期選擇器 */
.date-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
}

.date-btn {
    background: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.date-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(255, 179, 186, 0.3);
}

.date-btn i {
    color: #FFB3BA;
    font-size: 1.2rem;
}

#currentDate {
    color: #8B5A8B;
    font-size: 1.3rem;
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(139, 90, 139, 0.2);
}

/* 每日統計 */
.daily-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stats-card {
    background: white;
    border-radius: 20px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
    transition: transform 0.3s ease;
}

.stats-card:hover {
    transform: translateY(-5px);
}

.stats-card h4 {
    color: #8B5A8B;
    margin-bottom: 15px;
    font-size: 1.1rem;
}

.score-display, .count-display {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.score-display span {
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.count-display span {
    color: #FFB3BA;
}

.stats-card p {
    color: #9B6B9B;
    font-size: 0.9rem;
}

/* 時間軸 */
.timeline-section {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 40px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.timeline-section h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #8B5A8B;
    font-size: 1.5rem;
}

.timeline {
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #FFB3BA, #FFC0CB);
}

.empty-timeline {
    text-align: center;
    padding: 60px 20px;
    color: #9B6B9B;
}

.empty-timeline i {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-timeline p {
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.empty-timeline p:last-child {
    font-size: 0.9rem;
    opacity: 0.7;
}

/* 心情記錄項目 */
.mood-entry {
    position: relative;
    margin-bottom: 30px;
    padding-left: 80px;
    animation: slideIn 0.5s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.mood-entry::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 15px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 3px solid #FFB3BA;
    z-index: 1;
}

.mood-entry-content {
    background: #FFF8DC;
    border-radius: 15px;
    padding: 20px;
    border-left: 4px solid #FFB3BA;
    transition: all 0.3s ease;
}

.mood-entry-content:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(255, 179, 186, 0.2);
}

.mood-entry-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.mood-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mood-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mood-emoji {
    font-size: 1.5rem;
}

.mood-name {
    font-weight: 600;
    color: #8B5A8B;
}

.mood-time {
    color: #9B6B9B;
    font-size: 0.9rem;
}

.delete-btn {
    background: #FFB3BA;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.delete-btn:hover {
    background: #FF8FA3;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(255, 179, 186, 0.4);
}

.mood-score {
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.mood-note {
    margin-top: 10px;
    padding: 15px;
    background: white;
    border-radius: 10px;
    border-left: 3px solid #FFE4E1;
    font-style: italic;
    color: #8B5A8B;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    header h1 {
        font-size: 2rem;
    }
    
    .mood-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
    }
    
    .mood-item {
        padding: 12px 8px;
    }
    
    .mood-item i {
        font-size: 1.5rem;
    }
    
    .mood-item span {
        font-size: 0.8rem;
    }
    
    .daily-stats {
        grid-template-columns: 1fr;
    }
    
    .mood-entry {
        padding-left: 60px;
    }
    
    .mood-entry::before {
        left: 15px;
        width: 15px;
        height: 15px;
    }
}

/* 日曆視圖 */
.calendar-section {
    background: white;
    border-radius: 20px;
    padding: 15px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.calendar-section h3 {
    text-align: center;
    margin-bottom: 12px;
    color: #8B5A8B;
    font-size: 1.2rem;
}

.calendar-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 12px;
}

.calendar-btn {
    background: #FFB3BA;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.calendar-btn:hover {
    background: #FF8FA3;
    transform: scale(1.1);
}

#currentMonth {
    color: #8B5A8B;
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 120px;
    text-align: center;
}

.calendar-grid {
    border: 1px solid #FFE4E1;
    border-radius: 15px;
    overflow: hidden;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #FFF8DC;
    border-bottom: 1px solid #FFE4E1;
}

.calendar-header div {
    padding: 8px;
    text-align: center;
    font-weight: 600;
    color: #8B5A8B;
    font-size: 0.85rem;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #FFE4E1;
}

.calendar-day {
    min-height: 32px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    font-size: 0.85rem;
    color: #8B5A8B;
}

.calendar-day:hover {
    background: #FFF8DC;
}

.calendar-day.has-mood {
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
    font-weight: 600;
}

.calendar-day.has-mood:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 179, 186, 0.3);
}

.calendar-day.other-month {
    color: #9B6B9B;
    background: #FFF8DC;
}

.calendar-day.today {
    border: 2px solid #FFB3BA;
    font-weight: 600;
}

/* 統計概覽 */
.stats-overview {
    background: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.stats-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    border-bottom: 2px solid #FFE4E1;
}

.tab-btn {
    background: none;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: #9B6B9B;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
}

.tab-btn.active {
    color: #FFB3BA;
    border-bottom-color: #FFB3BA;
}

.tab-btn:hover {
    color: #FFB3BA;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.tab-content h4 {
    text-align: center;
    margin-bottom: 20px;
    color: #8B5A8B;
    font-size: 1.2rem;
}

.chart-container {
    height: 200px;
    background: #FFF8DC;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: #9B6B9B;
    font-size: 1.1rem;
}

.weekly-summary, .monthly-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.summary-item {
    background: #FFF8DC;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
}

.summary-label {
    display: block;
    color: #9B6B9B;
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.summary-value {
    display: block;
    color: #8B5A8B;
    font-size: 1.2rem;
    font-weight: 600;
}

/* 資料備份還原 */
.backup-section {
    background: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.backup-section h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #8B5A8B;
    font-size: 1.3rem;
}

.backup-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.backup-btn {
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
    border: none;
    border-radius: 15px;
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 140px;
    justify-content: center;
}

.backup-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 179, 186, 0.4);
    background: linear-gradient(135deg, #FF8FA3, #FFB3BA);
}

.backup-btn i {
    font-size: 1.1rem;
}

/* 歷史記錄列表 */
.history-section {
    background: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(255, 179, 186, 0.2);
    border: 2px solid #FFE4E1;
}

.history-section h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #8B5A8B;
    font-size: 1.3rem;
}

.history-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-input, .filter-select {
    padding: 10px 15px;
    border: 2px solid #FFE4E1;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    background: #FFF8DC;
}

.search-input {
    flex: 1;
    min-width: 200px;
}

.search-input:focus, .filter-select:focus {
    outline: none;
    border-color: #FFB3BA;
}

.history-list {
    max-height: 400px;
    overflow-y: auto;
}

.empty-history {
    text-align: center;
    padding: 40px 20px;
    color: #9B6B9B;
}

.empty-history i {
    font-size: 3rem;
    margin-bottom: 15px;
    opacity: 0.5;
}

.empty-history p {
    margin-bottom: 8px;
    font-size: 1.1rem;
}

.empty-history p:last-child {
    font-size: 0.9rem;
    opacity: 0.7;
}

.history-item {
    background: #FFF8DC;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    border-left: 4px solid #FFB3BA;
    transition: all 0.3s ease;
    cursor: pointer;
}

.history-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(255, 179, 186, 0.2);
}

.history-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.history-date {
    font-weight: 600;
    color: #8B5A8B;
}

.history-count {
    background: #FFB3BA;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.history-summary {
    color: #9B6B9B;
    font-size: 0.9rem;
}

@media (max-width: 480px) {
    .mood-grid {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    }
    
    .mood-item {
        padding: 10px 5px;
    }
    
    .mood-item i {
        font-size: 1.2rem;
    }
    
    .mood-item span {
        font-size: 0.7rem;
    }

    .history-controls {
        flex-direction: column;
    }

    .search-input {
        min-width: auto;
    }

    .weekly-summary, .monthly-summary {
        grid-template-columns: 1fr;
    }
}

/* 自訂心情表單 */
.custom-mood-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 2px solid #FFE4E1;
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.custom-mood-form h3 {
    text-align: center;
    margin-bottom: 25px;
    color: #8B5A8B;
    font-size: 1.5rem;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #8B5A8B;
    font-weight: 600;
    font-size: 1rem;
}

.form-group input[type="text"] {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #FFE4E1;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    background: #FFF8DC;
}

.form-group input[type="text"]:focus {
    outline: none;
    border-color: #FFB3BA;
}

/* Emoji選擇器 */
.emoji-picker {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    margin-bottom: 15px;
    max-height: 200px;
    overflow-y: auto;
    padding: 10px;
    border: 2px solid #FFE4E1;
    border-radius: 10px;
    background: #FFF8DC;
}

.emoji-option {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.emoji-option:hover {
    border-color: #FFB3BA;
    transform: scale(1.1);
}

.emoji-option.selected {
    border-color: #FFB3BA;
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    transform: scale(1.1);
}

.selected-emoji-display {
    text-align: center;
    padding: 10px;
    background: #FFF8DC;
    border-radius: 10px;
    border: 2px solid #FFE4E1;
}

/* 分數滑桿 */
.score-slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #FFF8DC;
    border-radius: 10px;
    border: 2px solid #FFE4E1;
}

.score-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #FFE4E1;
    outline: none;
    -webkit-appearance: none;
}

.score-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 179, 186, 0.3);
}

.score-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(255, 179, 186, 0.3);
}

#scoreDisplay {
    font-size: 1.2rem;
    font-weight: 600;
    color: #8B5A8B;
    min-width: 30px;
    text-align: center;
}

/* 表單按鈕 */
.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
}

.add-custom-btn, .cancel-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.add-custom-btn {
    background: linear-gradient(135deg, #FFB3BA, #FFC0CB);
    color: white;
}

.add-custom-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 179, 186, 0.4);
}

.cancel-btn {
    background: #F0F0F0;
    color: #666;
}

.cancel-btn:hover {
    background: #E0E0E0;
    transform: translateY(-2px);
}

/* 自訂心情按鈕樣式 */
.custom-mood-btn {
    background: linear-gradient(135deg, #BAE1FF, #BAFFC9) !important;
    border: 2px dashed #8B5A8B !important;
    color: #8B5A8B !important;
    font-weight: 600;
}

.custom-mood-btn:hover {
    background: linear-gradient(135deg, #A8D8FF, #A8FFB8) !important;
    transform: translateY(-3px) scale(1.02);
}

/* 響應式設計 */
@media (max-width: 768px) {
    .custom-mood-form {
        width: 95%;
        padding: 20px;
    }
    
    .emoji-picker {
        grid-template-columns: repeat(6, 1fr);
    }
    
    .form-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .emoji-picker {
        grid-template-columns: repeat(5, 1fr);
    }
    
    .emoji-option {
        width: 35px;
        height: 35px;
        font-size: 1rem;
    }
}

/* 心情選項刪除按鈕 */
.delete-mood-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 107, 107, 0.9);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.8);
}

.mood-item:hover .delete-mood-btn {
    opacity: 1;
    transform: scale(1);
}

.delete-mood-btn:hover {
    background: rgba(255, 107, 107, 1);
    transform: scale(1.1);
}

/* 自訂心情選項樣式 */
.mood-item.custom-mood-item {
    position: relative;
    border: 2px dashed #8B5A8B;
    background: linear-gradient(135deg, #FFF8DC, #FFE4E1);
}

.mood-item.custom-mood-item:hover {
    border-color: #FFB3BA;
    background: linear-gradient(135deg, #FFE4E1, #FFB3BA);
}

/* 確保心情選項有相對定位 */
.mood-item {
    position: relative;
} 
