document.addEventListener('DOMContentLoaded', () => {
    // Audio elements for alarms
    const alarm1 = new Audio();
    const alarm2 = new Audio();
    const alarm3 = new Audio();
    
    // Set up alarm sounds using base64 data
    alarm1.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAJrQBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dX///////////8AAAA5TEFNRTMuOTlyAm4AAAAALgkAABRGJAN7TgAARgAACa3SsOqYAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
    alarm2.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAMAAAThwAUFBQUFBQsLCwsLCxERERERERmZmZmZmaGhoaGhoampqampqbFxcXFxcXi4uLi4uL///////////////////8AAAA5TEFNRTMuOTlyAm4AAAAALiEAABRGJAOmTgAARgAAE4c+M9qQAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
    alarm3.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAKAAAKYgAbGxsbGxsfHx8fHx8zMzMzMzNGRkZGRkZtbW1tbW15eXl5eXl5iYmJiYmJubm5ubm5ucnJycnJyfLy8vLy8v///////////wAAADJMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMQAAAGkAAAAAAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const addTimeBtns = document.querySelectorAll('.add-btn');
    const setCustomBtn = document.getElementById('set-custom');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const soundSelect = document.getElementById('sound-select');
    const testSoundBtn = document.getElementById('test-sound');
    const container = document.querySelector('.container');
    
    // Timer variables
    let timeLeft = 120; // Default 2 minutes
    let timerId;
    let isRunning = false;
    
    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Update timer display
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        
        // Reset classes
        timerDisplay.classList.remove('warning', 'danger');
        container.style.animation = '';
        
        // Add warning class when time is below 10 seconds
        if (timeLeft <= 10 && timeLeft > 0) {
            timerDisplay.classList.add('warning');
        }
        
        // Add danger class when time is up
        if (timeLeft === 0) {
            timerDisplay.classList.add('danger');
            container.style.animation = 'danger-flash 0.5s infinite';
            playAlarm();
        }
    }
    
    // Start the timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerId);
                    isRunning = false;
                }
            }, 1000);
        }
    }
    
    // Pause the timer
    function pauseTimer() {
        clearInterval(timerId);
        isRunning = false;
    }
    
    // Reset the timer
    function resetTimer() {
        pauseTimer();
        timeLeft = 120; // Reset to default 2 minutes
        updateDisplay();
        container.style.animation = '';
        stopAlarm();
    }
    
    // Set timer to a preset value
    function setPresetTime(seconds) {
        pauseTimer();
        timeLeft = seconds;
        updateDisplay();
        container.style.animation = '';
        stopAlarm();
    }
    
    // Add time to the current timer
    function addTime(seconds) {
        timeLeft += seconds;
        updateDisplay();
        
        // If timer was at 0, it might need to be restarted
        if (timeLeft > 0) {
            container.style.animation = '';
            stopAlarm();
        }
    }
    
    // Set custom time
    function setCustomTime() {
        const mins = parseInt(minutesInput.value) || 0;
        const secs = parseInt(secondsInput.value) || 0;
        const totalSeconds = (mins * 60) + secs;
        
        if (totalSeconds > 0) {
            pauseTimer();
            timeLeft = totalSeconds;
            updateDisplay();
            container.style.animation = '';
            stopAlarm();
        }
    }
    
    // Play the selected alarm sound
    function playAlarm() {
        stopAlarm(); // Stop any currently playing alarms
        
        const selectedAlarm = soundSelect.value;
        if (selectedAlarm === 'none') return;
        
        if (selectedAlarm === 'alarm1') {
            alarm1.loop = true;
            alarm1.play();
        } else if (selectedAlarm === 'alarm2') {
            alarm2.loop = true;
            alarm2.play();
        } else if (selectedAlarm === 'alarm3') {
            alarm3.loop = true;
            alarm3.play();
        }
    }
    
    // Stop all alarm sounds
    function stopAlarm() {
        alarm1.pause();
        alarm1.currentTime = 0;
        alarm2.pause();
        alarm2.currentTime = 0;
        alarm3.pause();
        alarm3.currentTime = 0;
    }
    
    // Test the selected alarm sound
    function testSound() {
        stopAlarm();
        const selectedAlarm = soundSelect.value;
        if (selectedAlarm === 'none') return;
        
        if (selectedAlarm === 'alarm1') {
            alarm1.loop = false;
            alarm1.play();
        } else if (selectedAlarm === 'alarm2') {
            alarm2.loop = false;
            alarm2.play();
        } else if (selectedAlarm === 'alarm3') {
            alarm3.loop = false;
            alarm3.play();
        }
    }
    
    // Initialize timer display
    updateDisplay();
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = parseInt(btn.getAttribute('data-time'));
            setPresetTime(time);
        });
    });
    
    addTimeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = parseInt(btn.getAttribute('data-add'));
            addTime(time);
        });
    });
    
    setCustomBtn.addEventListener('click', setCustomTime);
    testSoundBtn.addEventListener('click', testSound);
});
