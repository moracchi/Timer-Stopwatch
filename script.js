/**
 * デジタルタイマー＆ストップウォッチアプリケーション
 * 
 * このスクリプトでは、タイマーとストップウォッチの機能を実装しています。
 * - 初期画面でモード選択
 * - タイマー機能（分と10秒単位のボタンで時間を加算、カウントダウン）
 * - ストップウォッチ機能（計測、停止、リセット、ラップタイム記録）
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    // モード選択画面
    const modeSelectionScreen = document.getElementById('mode-selection');
    const timerScreen = document.getElementById('timer-mode');
    const stopwatchScreen = document.getElementById('stopwatch-mode');
    
    // タイマー関連の要素
    const timerDisplay = document.getElementById('timer-display');
    const selectedTimeDisplay = document.getElementById('selected-time-display');
    const addMinuteBtn = document.getElementById('add-minute');
    const addTenSecondsBtn = document.getElementById('add-ten-seconds');
    const resetTimeBtn = document.getElementById('reset-time');
    const timerStartBtn = document.getElementById('timer-start');
    const timerPauseBtn = document.getElementById('timer-pause');
    const timerResumeBtn = document.getElementById('timer-resume');
    const timerResetBtn = document.getElementById('timer-reset');
    const timerBackBtn = document.getElementById('timer-back');
    
    // ストップウォッチ関連の要素
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const stopwatchStartBtn = document.getElementById('stopwatch-start');
    const stopwatchLapBtn = document.getElementById('stopwatch-lap');
    const stopwatchResetBtn = document.getElementById('stopwatch-reset');
    const stopwatchBackBtn = document.getElementById('stopwatch-back');
    const lapTimesDisplay = document.getElementById('lap-times');
    
    // モード選択ボタン
    const timerSelectBtn = document.getElementById('timer-select');
    const stopwatchSelectBtn = document.getElementById('stopwatch-select');
    
    // タイマー変数
    let timerTotalSeconds = 0; // タイマーの合計秒数
    let timerInterval;
    let timerRemainingTime = 0;
    
    // ストップウォッチ変数
    let stopwatchTime = 0;
    let stopwatchInterval;
    let stopwatchRunning = false;
    let stopwatchStartTime;
    let lapTimes = []; // ラップタイムを保存する配列
    let lapCount = 1; // ラップカウンター
    
    // ============ モード選択 ============
    timerSelectBtn.addEventListener('click', function() {
        modeSelectionScreen.classList.add('hidden');
        timerScreen.classList.remove('hidden');
    });
    
    stopwatchSelectBtn.addEventListener('click', function() {
        modeSelectionScreen.classList.add('hidden');
        stopwatchScreen.classList.remove('hidden');
    });
    
    // 戻るボタン
    timerBackBtn.addEventListener('click', function() {
        resetTimer();
        timerScreen.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    });
    
    stopwatchBackBtn.addEventListener('click', function() {
        resetStopwatch();
        stopwatchScreen.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    });
    
    // ============ タイマー機能 ============
    // 「+1分」ボタンのイベントリスナー
    addMinuteBtn.addEventListener('click', function() {
        timerTotalSeconds += 60; // 60秒（1分）追加
        updateSelectedTimeDisplay();
    });
    
    // 「+10秒」ボタンのイベントリスナー
    addTenSecondsBtn.addEventListener('click', function() {
        timerTotalSeconds += 10; // 10秒追加
        updateSelectedTimeDisplay();
    });
    
    // 「リセット」ボタンのイベントリスナー
    resetTimeBtn.addEventListener('click', function() {
        timerTotalSeconds = 0; // 0にリセット
        updateSelectedTimeDisplay();
    });
    
    // 選択した時間の表示を更新する関数
    function updateSelectedTimeDisplay() {
        const minutes = Math.floor(timerTotalSeconds / 60);
        const seconds = timerTotalSeconds % 60;
        selectedTimeDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
        
        // メインタイマー表示も更新
        timerDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
    }
    
    // タイマー開始
    timerStartBtn.addEventListener('click', function() {
        if (timerTotalSeconds === 0) {
            alert('Please set a time for the timer');
            return;
        }
        
        timerRemainingTime = timerTotalSeconds;
        
        startTimer();
        
        // ボタン表示の切り替え
        timerStartBtn.classList.add('hidden');
        timerPauseBtn.classList.remove('hidden');
        timerResetBtn.classList.remove('hidden');
    });
    
    // タイマー一時停止
    timerPauseBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        
        // ボタン表示の切り替え
        timerPauseBtn.classList.add('hidden');
        timerResumeBtn.classList.remove('hidden');
    });
    
    // タイマー再開
    timerResumeBtn.addEventListener('click', function() {
        startTimer();
        
        // ボタン表示の切り替え
        timerResumeBtn.classList.add('hidden');
        timerPauseBtn.classList.remove('hidden');
    });
    
    // タイマーリセット
    timerResetBtn.addEventListener('click', function() {
        resetTimer();
    });
    
    // タイマースタート関数
    function startTimer() {
        timerInterval = setInterval(function() {
            timerRemainingTime--;
            updateTimerDisplay(timerRemainingTime);
            
            if (timerRemainingTime <= 0) {
                clearInterval(timerInterval);
                alert('Time\'s up!');
                resetTimer();
            }
        }, 1000);
    }
    
    // タイマーリセット関数
    function resetTimer() {
        clearInterval(timerInterval);
        timerTotalSeconds = 0;
        timerRemainingTime = 0;
        updateTimerDisplay(0);
        updateSelectedTimeDisplay();
        
        // ボタン状態をリセット
        timerStartBtn.classList.remove('hidden');
        timerPauseBtn.classList.add('hidden');
        timerResumeBtn.classList.add('hidden');
        timerResetBtn.classList.add('hidden');
    }
    
    // タイマー表示更新関数
    function updateTimerDisplay(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
    }
    
    // ============ ストップウォッチ機能 ============
    // ストップウォッチ開始/停止
    stopwatchStartBtn.addEventListener('click', function() {
        if (!stopwatchRunning) {
            // ストップウォッチ開始
            startStopwatch();
            stopwatchStartBtn.textContent = 'Stop';
            stopwatchLapBtn.classList.remove('hidden');
            stopwatchResetBtn.classList.remove('hidden');
        } else {
            // ストップウォッチ停止
            stopStopwatch();
            stopwatchStartBtn.textContent = 'Start';
        }
    });
    
    // ラップタイム記録
    stopwatchLapBtn.addEventListener('click', function() {
        if (stopwatchRunning) {
            // 現在のタイムをラップとして記録
            recordLap();
        }
    });
    
    // ストップウォッチリセット
    stopwatchResetBtn.addEventListener('click', function() {
        resetStopwatch();
    });
    
    // ストップウォッチスタート関数
    function startStopwatch() {
        stopwatchStartTime = Date.now() - stopwatchTime; // 前回の時間を考慮
        stopwatchInterval = setInterval(function() {
            stopwatchTime = Date.now() - stopwatchStartTime;
            updateStopwatchDisplay();
        }, 10); // 10ミリ秒ごとに更新（より滑らかな表示）
        
        stopwatchRunning = true;
    }
    
    // ストップウォッチ停止関数
    function stopStopwatch() {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    }
    
    // ストップウォッチリセット関数
    function resetStopwatch() {
        stopStopwatch();
        stopwatchTime = 0;
        updateStopwatchDisplay();
        stopwatchStartBtn.textContent = 'Start';
        stopwatchLapBtn.classList.add('hidden');
        stopwatchResetBtn.classList.add('hidden');
        
        // ラップタイムもリセット
        lapTimes = [];
        lapCount = 1;
        lapTimesDisplay.innerHTML = '';
    }
    
    // ラップタイム記録関数
    function recordLap() {
        // 最大3つまでのラップタイムを保持
        if (lapTimes.length >= 3) {
            // 最も古いラップを削除
            lapTimes.shift();
        }
        
        // 現在のタイムをフォーマットしてラップに追加
        const formattedTime = formatTime(stopwatchTime);
        lapTimes.push({
            number: lapCount,
            time: formattedTime
        });
        
        // ラップカウンターを更新
        lapCount++;
        
        // ラップタイム表示を更新
        updateLapTimesDisplay();
    }
    
    // ラップタイム表示更新関数
    function updateLapTimesDisplay() {
        // 表示をクリア
        lapTimesDisplay.innerHTML = '';
        
        // 全てのラップタイムを表示（新しいものから順に）
        lapTimes.slice().reverse().forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${lap.number}`;
            
            const lapTime = document.createElement('span');
            lapTime.className = 'lap-time';
            lapTime.textContent = lap.time;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTime);
            lapTimesDisplay.appendChild(lapItem);
        });
    }
    
    // ストップウォッチ表示更新関数
    function updateStopwatchDisplay() {
        const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
        const seconds = Math.floor((stopwatchTime / 1000) % 60);
        const minutes = Math.floor((stopwatchTime / (1000 * 60)) % 60);
        
        stopwatchDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds)}`;
    }
    
    // 時間フォーマット関数（ラップタイム用）
    function formatTime(time) {
        const milliseconds = Math.floor((time % 1000) / 10);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        
        return `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds)}`;
    }
    
    // ゼロ埋め関数（表示用）
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
});
