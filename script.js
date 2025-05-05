// Timer data storage - maps timer IDs to their data
const timers = {};
let nextTimerId = 2; // Start at 2 since we begin with timer ID 1
const maxTimers = 8;

// Sound setup
const beepSounds = {};
for (let i = 1; i <= 9; i++) {
    beepSounds[`beep${i}`] = new Audio(`./sounds/Beep ${i}.wav`);
}

// Initialize when the page is loaded
window.onload = function() {
    // Set the initial timer to 2 minutes (120 seconds)
    initializeTimer(1);
};

// Create a new timer with the given ID
function initializeTimer(timerId) {
    // Initialize the timer data
    timers[timerId] = {
        timeLeft: 120, // 2 minutes default
        timerId: null,
        isRunning: false
    };
    
    // Update the display to show 2 minutes
    updateTimerDisplay(timerId);
}

// Format seconds as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Update the timer display for a specific timer
function updateTimerDisplay(timerId) {
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (!timerContainer) return;
    
    const timerDisplay = timerContainer.querySelector('.timer-display');
    
    // Update the time display
    timerDisplay.textContent = formatTime(timers[timerId].timeLeft);
    
    // Reset visual classes
    timerDisplay.classList.remove('warning', 'danger');
    timerContainer.style.animation = '';
    
    // Apply warning class for low time
    if (timers[timerId].timeLeft <= 10 && timers[timerId].timeLeft > 0) {
        timerDisplay.classList.add('warning');
    }
    
    // Apply danger class and play sound when time is up
    if (timers[timerId].timeLeft === 0) {
        timerDisplay.classList.add('danger');
        timerContainer.style.animation = 'danger-flash 0.5s infinite';
        playAlarmSound(timerId);
    }
}

// Start a timer
function startTimer(timerId) {
    if (!timers[timerId] || timers[timerId].isRunning) return;
    
    timers[timerId].isRunning = true;
    timers[timerId].timerId = setInterval(function() {
        if (timers[timerId].timeLeft > 0) {
            timers[timerId].timeLeft--;
            updateTimerDisplay(timerId);
        } else {
            clearInterval(timers[timerId].timerId);
            timers[timerId].isRunning = false;
        }
    }, 1000);
}

// Pause a timer
function pauseTimer(timerId) {
    if (!timers[timerId]) return;
    
    clearInterval(timers[timerId].timerId);
    timers[timerId].isRunning = false;
}

// Stop a timer completely (set to 0 and stop)
function stopTimer(timerId) {
    if (!timers[timerId]) return;
    
    pauseTimer(timerId);
    timers[timerId].timeLeft = 0;
    
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (timerContainer) {
        const timerDisplay = timerContainer.querySelector('.timer-display');
        
        // Clear warning/danger classes
        timerDisplay.classList.remove('warning', 'danger');
        timerContainer.style.animation = 'none';
        
        // Update display to 00:00
        timerDisplay.textContent = "00:00";
        
        // Stop any playing alarms
        stopAllAlarms();
    }
}

// Reset a timer to 2 minutes
function resetTimer(timerId) {
    if (!timers[timerId]) return;
    
    pauseTimer(timerId);
    timers[timerId].timeLeft = 120; // 2 minutes
    
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (timerContainer) {
        timerContainer.style.animation = '';
    }
    
    updateTimerDisplay(timerId);
    stopAllAlarms();
}

// Set a timer to a preset time value
function setPresetTime(timerId, seconds) {
    if (!timers[timerId]) return;
    
    pauseTimer(timerId);
    timers[timerId].timeLeft = seconds;
    
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (timerContainer) {
        timerContainer.style.animation = '';
    }
    
    updateTimerDisplay(timerId);
    stopAllAlarms();
}

// Add time to a timer
function addTime(timerId, seconds) {
    if (!timers[timerId]) return;
    
    timers[timerId].timeLeft += seconds;
    
    // If timer was at 0, stop alert effects
    if (timers[timerId].timeLeft > 0) {
        const timerContainer = document.getElementById(`timer-${timerId}`);
        if (timerContainer) {
            timerContainer.style.animation = '';
        }
        stopAllAlarms();
    }
    
    updateTimerDisplay(timerId);
}

// Set a custom time from inputs
function setCustomTime(timerId) {
    if (!timers[timerId]) return;
    
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (!timerContainer) return;
    
    const minutesInput = timerContainer.querySelector('.minutes-input');
    const secondsInput = timerContainer.querySelector('.seconds-input');
    
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalSeconds = (minutes * 60) + seconds;
    
    if (totalSeconds > 0) {
        pauseTimer(timerId);
        timers[timerId].timeLeft = totalSeconds;
        timerContainer.style.animation = '';
        updateTimerDisplay(timerId);
        stopAllAlarms();
    }
}

// Play the selected alarm sound
function playAlarmSound(timerId) {
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (!timerContainer) return;
    
    const soundSelect = timerContainer.querySelector('.sound-select');
    const selectedSound = soundSelect.value;
    
    if (selectedSound !== 'none' && beepSounds[selectedSound]) {
        stopAllAlarms(); // Stop any currently playing sounds
        beepSounds[selectedSound].currentTime = 0;
        beepSounds[selectedSound].loop = false;
        beepSounds[selectedSound].play();
    }
}

// Test a sound
function testSound(timerId) {
    const timerContainer = document.getElementById(`timer-${timerId}`);
    if (!timerContainer) return;
    
    const soundSelect = timerContainer.querySelector('.sound-select');
    const selectedSound = soundSelect.value;
    
    if (selectedSound !== 'none' && beepSounds[selectedSound]) {
        stopAllAlarms(); // Stop any currently playing sounds
        beepSounds[selectedSound].currentTime = 0;
        beepSounds[selectedSound].loop = false;
        beepSounds[selectedSound].play();
    }
}

// Stop all alarm sounds
function stopAllAlarms() {
    for (const sound in beepSounds) {
        beepSounds[sound].pause();
        beepSounds[sound].currentTime = 0;
    }
}

// Add a new timer
function addNewTimer() {
    // Check if we've reached the maximum number of timers
    if (Object.keys(timers).length >= maxTimers) {
        alert('Maximum number of timers reached (8)');
        return;
    }
    
    const timerId = nextTimerId++;
    
    // Create the HTML for the new timer
    const timerHTML = `
    <div class="timer-container" id="timer-${timerId}">
        <div class="delete-btn-container">
            <button class="delete-btn" onclick="deleteTimer(${timerId})">×</button>
        </div>
        
        <div class="pc-name-container">
            <input type="text" class="pc-name" placeholder="Character Name">
        </div>
        
        <div class="timer-display">00:00</div>
        
        <div class="time-presets">
            <button class="preset-btn" onclick="setPresetTime(${timerId}, 60)">1 min</button>
            <button class="preset-btn" onclick="setPresetTime(${timerId}, 120)">2 min</button>
            <button class="preset-btn" onclick="setPresetTime(${timerId}, 180)">3 min</button>
            <button class="preset-btn" onclick="setPresetTime(${timerId}, 300)">5 min</button>
        </div>
        
        <div class="add-time">
            <button class="add-btn" onclick="addTime(${timerId}, 30)">+30 sec</button>
        </div>
        
        <div class="custom-time">
            <input type="number" class="minutes-input" min="0" max="60" value="2">
            <label>min</label>
            <input type="number" class="seconds-input" min="0" max="59" value="0">
            <label>sec</label>
            <button class="btn set-custom-btn" onclick="setCustomTime(${timerId})">Set Time</button>
        </div>
        
        <div class="alarm-sound">
            <label>Alarm:</label>
            <select class="sound-select">
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
            <button class="btn test-sound-btn" onclick="testSound(${timerId})">Test</button>
        </div>
        
        <div class="controls">
            <button class="btn start-btn large-btn" onclick="startTimer(${timerId})">Start</button>
            <button class="btn stop-btn" onclick="stopTimer(${timerId})">Stop</button>
            <button class="btn pause-btn" onclick="pauseTimer(${timerId})">Pause</button>
            <button class="btn btn-danger reset-btn" onclick="resetTimer(${timerId})">Reset</button>
        </div>
    </div>
    `;
    
    // Add the new timer before the add button
    const addButton = document.getElementById('add-timer-btn');
    addButton.insertAdjacentHTML('beforebegin', timerHTML);
    
    // Initialize the timer
    initializeTimer(timerId);
    
    // Hide add button if maximum is reached
    if (Object.keys(timers).length >= maxTimers) {
        addButton.style.display = 'none';
    }
}

// Delete a timer
function deleteTimer(timerId) {
    // Prevent deleting the last timer
    if (Object.keys(timers).length <= 1) {
        alert('At least one timer must remain');
        return;
    }
    
    // Stop the timer if it's running
    if (timers[timerId] && timers[timerId].isRunning) {
        pauseTimer(timerId);
    }
    
    // Remove from the DOM
    const timerElement = document.getElementById(`timer-${timerId}`);
    if (timerElement) {
        timerElement.remove();
    }
    
    // Remove from tracking
    delete timers[timerId];
    
    // Show the add button if it was hidden
    document.getElementById('add-timer-btn').style.display = 'flex';
}
