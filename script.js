document.addEventListener('DOMContentLoaded', () => {
    // Create audio objects for all beep sounds
    const beepSounds = {
        beep1: new Audio('./sounds/Beep 1.wav'),
        beep2: new Audio('./sounds/Beep 2.wav'),
        beep3: new Audio('./sounds/Beep 3.wav'),
        beep4: new Audio('./sounds/Beep 4.wav'),
        beep5: new Audio('./sounds/Beep 5.wav'),
        beep6: new Audio('./sounds/Beep 6.wav'),
        beep7: new Audio('./sounds/Beep 7.wav'),
        beep8: new Audio('./sounds/Beep 8.wav'),
        beep9: new Audio('./sounds/Beep 9.wav')
    };
    
    // Current playing sounds
    let currentlyPlayingSound = null;
    
    // Track the timers
    const timers = {};
    let timerCount = 1;
    const maxTimers = 8;
    
    // Initialize the first timer
    initializeTimer(1);
    
    // Set up event listeners for dynamic timer creation and deletion
    document.getElementById('add-timer-btn').addEventListener('click', addNewTimer);
    
    // Add event delegation for delete buttons
    document.querySelector('.timers-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const timerIndex = parseInt(e.target.getAttribute('data-timer'));
            deleteTimer(timerIndex);
        }
    });
    
    // Function to add a new timer
    function addNewTimer() {
        // Check if we've reached the maximum number of timers
        if (Object.keys(timers).length >= maxTimers) {
            alert('Maximum number of timers reached (8)');
            return;
        }
        
        // Find the next available timer index
        let newIndex = timerCount + 1;
        while (document.getElementById(`timer-container-${newIndex}`)) {
            newIndex++;
        }
        timerCount = newIndex;
        
        // Create new timer HTML
        const newTimerHTML = createTimerHTML(newIndex);
        
        // Insert the new timer before the add button
        const addButton = document.getElementById('add-timer-btn');
        addButton.insertAdjacentHTML('beforebegin', newTimerHTML);
        
        // Initialize the new timer
        initializeTimer(newIndex);
        
        // Hide add button if max timers reached
        if (Object.keys(timers).length >= maxTimers) {
            document.getElementById('add-timer-btn').style.display = 'none';
        }
    }
    
    // Function to delete a timer
    function deleteTimer(index) {
        // Don't delete if it's the last timer
        if (Object.keys(timers).length <= 1) {
            alert('At least one timer must remain');
            return;
        }
        
        // Stop the timer if it's running
        if (timers[index] && timers[index].isRunning) {
            clearInterval(timers[index].timerId);
        }
        
        // Remove the timer from the DOM
        const timerElement = document.getElementById(`timer-container-${index}`);
        if (timerElement) {
            timerElement.remove();
        }
        
        // Remove the timer from our tracking object
        delete timers[index];
        
        // Show add button if it was hidden
        document.getElementById('add-timer-btn').style.display = 'flex';
    }
    
    // Function to create timer HTML
    function createTimerHTML(index) {
        return `
        <div class="container" id="timer-container-${index}" data-index="${index}">
            <div class="delete-btn-container">
                <button class="delete-btn" data-timer="${index}">×</button>
            </div>
            
            <div class="pc-name-container">
                <input type="text" class="pc-name" id="pc-name-${index}" placeholder="Character Name">
            </div>
            
            <div class="timer-display" id="timer-${index}">00:00</div>
            
            <div class="time-presets">
                <button class="preset-btn" data-time="60" data-timer="${index}">1 min</button>
                <button class="preset-btn" data-time="120" data-timer="${index}">2 min</button>
                <button class="preset-btn" data-time="180" data-timer="${index}">3 min</button>
                <button class="preset-btn" data-time="300" data-timer="${index}">5 min</button>
            </div>
            
            <div class="add-time">
                <button class="add-btn" data-add="30" data-timer="${index}">+30 sec</button>
            </div>
            
            <div class="custom-time">
                <input type="number" class="minutes" id="minutes-${index}" min="0" max="60" value="2">
                <label for="minutes-${index}">min</label>
                <input type="number" class="seconds" id="seconds-${index}" min="0" max="59" value="0">
                <label for="seconds-${index}">sec</label>
                <button class="btn set-custom-btn" data-timer="${index}">Set Time</button>
            </div>
            
            <div class="alarm-sound">
                <label for="sound-select-${index}">Alarm:</label>
                <select class="sound-select" id="sound-select-${index}" data-timer="${index}">
                    <option value="none" selected>None</option>
                    <option value="beep1">Beep 1</option>
                    <option value="beep2">Beep 2</option>
                    <option value="beep3">Beep 3</option>
                    <option value="beep4">Beep 4</option>
                    <option value="beep5">Beep 5</option>
                    <option value="beep6">Beep 6</option>
                    <option value="beep7">Beep 7</option>
                    <option value="beep8">Beep 8</option>
                    <option value="beep9">Beep 9</option>
                </select>
                <button class="btn test-sound-btn" data-timer="${index}">Test</button>
            </div>
            
            <div class="controls">
                <button class="btn start-btn large-btn" data-timer="${index}">Start</button>
                <button class="btn stop-btn" data-timer="${index}">Stop</button>
                <button class="btn pause-btn" data-timer="${index}">Pause</button>
                <button class="btn btn-danger reset-btn" data-timer="${index}">Reset</button>
            </div>
        </div>
        `;
    }

    // Create timer objects to store state for each timer
    const timers = {};
    
    // Initialize each timer
    for (let i = 1; i <= 5; i++) {
        initializeTimer(i);
    }
    
    // Function to initialize a single timer
    function initializeTimer(timerIndex) {
        // Create timer state object
        timers[timerIndex] = {
            timeLeft: 120, // Default 2 minutes
            timerId: null,
            isRunning: false
        };
        
        // DOM Elements
        const timerDisplay = document.getElementById(`timer-${timerIndex}`);
        const startBtn = document.querySelector(`.start-btn[data-timer="${timerIndex}"]`);
        const stopBtn = document.querySelector(`.stop-btn[data-timer="${timerIndex}"]`);
        const pauseBtn = document.querySelector(`.pause-btn[data-timer="${timerIndex}"]`);
        const resetBtn = document.querySelector(`.reset-btn[data-timer="${timerIndex}"]`);
        const presetBtns = document.querySelectorAll(`.preset-btn[data-timer="${timerIndex}"]`);
        const addTimeBtns = document.querySelectorAll(`.add-btn[data-timer="${timerIndex}"]`);
        const setCustomBtn = document.querySelector(`.set-custom-btn[data-timer="${timerIndex}"]`);
        const minutesInput = document.getElementById(`minutes-${timerIndex}`);
        const secondsInput = document.getElementById(`seconds-${timerIndex}`);
        const soundSelect = document.getElementById(`sound-select-${timerIndex}`);
        const testSoundBtn = document.querySelector(`.test-sound-btn[data-timer="${timerIndex}"]`);
        const container = document.getElementById(`timer-container-${timerIndex}`);
        
        // Format time as MM:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        }
        
        // Update timer display
        function updateDisplay() {
            timerDisplay.textContent = formatTime(timers[timerIndex].timeLeft);
            
            // Reset classes
            timerDisplay.classList.remove('warning', 'danger');
            container.style.animation = '';
            
            // Add warning class when time is below 10 seconds
            if (timers[timerIndex].timeLeft <= 10 && timers[timerIndex].timeLeft > 0) {
                timerDisplay.classList.add('warning');
            }
            
            // Add danger class when time is up
            if (timers[timerIndex].timeLeft === 0) {
                timerDisplay.classList.add('danger');
                container.style.animation = 'danger-flash 0.5s infinite';
                playAlarm();
            }
        }
        
        // Start the timer
        function startTimer() {
            if (!timers[timerIndex].isRunning) {
                timers[timerIndex].isRunning = true;
                timers[timerIndex].timerId = setInterval(() => {
                    if (timers[timerIndex].timeLeft > 0) {
                        timers[timerIndex].timeLeft--;
                        updateDisplay();
                    } else {
                        clearInterval(timers[timerIndex].timerId);
                        timers[timerIndex].isRunning = false;
                    }
                }, 1000);
            }
        }
        
        // Pause the timer
        function pauseTimer() {
            clearInterval(timers[timerIndex].timerId);
            timers[timerIndex].isRunning = false;
        }
        
        // Stop the timer (complete stop, not pause)
        function stopTimer() {
            pauseTimer();
            timers[timerIndex].timeLeft = 0;
            
            // Remove warning and danger classes to stop animation
            timerDisplay.classList.remove('warning', 'danger');
            container.style.animation = 'none';
            
            // Update display with zeros
            timerDisplay.textContent = "00:00";
            
            stopAlarm();
        }
        
        // Reset the timer
        function resetTimer() {
            pauseTimer();
            timers[timerIndex].timeLeft = 120; // Reset to default 2 minutes
            updateDisplay();
            container.style.animation = '';
            stopAlarm();
        }
        
        // Set timer to a preset value
        function setPresetTime(seconds) {
            pauseTimer();
            timers[timerIndex].timeLeft = seconds;
            updateDisplay();
            container.style.animation = '';
            stopAlarm();
        }
        
        // Add time to the current timer
        function addTime(seconds) {
            timers[timerIndex].timeLeft += seconds;
            updateDisplay();
            
            // If timer was at 0, it might need to be restarted
            if (timers[timerIndex].timeLeft > 0) {
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
                timers[timerIndex].timeLeft = totalSeconds;
                updateDisplay();
                container.style.animation = '';
                stopAlarm();
            }
        }
        
        // Play the selected alarm sound
        function playAlarm() {
            stopAllAlarms(); // Stop any currently playing alarms
            
            const selectedAlarm = soundSelect.value;
            if (selectedAlarm === 'none') return;
            
            if (beepSounds[selectedAlarm]) {
                // Set to play only once, not looping
                beepSounds[selectedAlarm].loop = false;
                beepSounds[selectedAlarm].play();
                currentlyPlayingSound = selectedAlarm;
            }
        }
        
        // Test the selected alarm sound
        function testSound() {
            stopAllAlarms();
            const selectedAlarm = soundSelect.value;
            if (selectedAlarm === 'none') return;
            
            if (beepSounds[selectedAlarm]) {
                beepSounds[selectedAlarm].loop = false;
                beepSounds[selectedAlarm].play();
            }
        }
        
        // Initialize timer display
        updateDisplay();
        
        // Event Listeners
        startBtn.addEventListener('click', startTimer);
        stopBtn.addEventListener('click', stopTimer);
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
    }
    
    // Function to stop all alarm sounds across all timers
    function stopAllAlarms() {
        // Stop all beep sounds
        for (const sound in beepSounds) {
            beepSounds[sound].pause();
            beepSounds[sound].currentTime = 0;
        }
        currentlyPlayingSound = null;
    }
});
