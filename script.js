// Timer configuration
let timerCount = 1;
const maxTimers = 8;
const timerIntervals = {};
const timerValues = {};

// Audio setup
const beepSounds = {};
for (let i = 1; i <= 9; i++) {
    beepSounds[`beep${i}`] = new Audio(`./sounds/Beep ${i}.wav`);
}

// Initialize when the document loads
window.onload = function() {
    // First timer should show 2:00 initially
    timerValues[1] = 120; // 2 minutes in seconds
    document.querySelector('#timer-1 .timer-display').textContent = '02:00';
};

// Format seconds to MM:SS display string
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Start a timer countdown
function startTimer(timerId) {
    // Don't start if already running
    if (timerIntervals[timerId]) {
        return;
    }
    
    const timerDisplay = document.querySelector(`#timer-${timerId} .timer-display`);
    const timerContainer = document.getElementById(`timer-${timerId}`);
    
    // Clear any warning/danger classes from previous runs
    timerDisplay.classList.remove('warning', 'danger');
    timerContainer.style.animation = '';
    
    // Start the interval
    timerIntervals[timerId] = setInterval(function() {
        if (timerValues[timerId] > 0) {
            timerValues[timerId]--;
            timerDisplay.textContent = formatTime(timerValues[timerId]);
            
            // Add warning class when time is running low
            if (timerValues[timerId] <= 10 && timerValues[timerId] > 0) {
                timerDisplay.classList.add('warning');
                timerDisplay.classList.remove('danger');
            }
            
            // When timer reaches zero
            if (timerValues[timerId] === 0) {
                timerDisplay.classList.remove('warning');
                timerDisplay.classList.add('danger');
                timerContainer.style.animation = 'danger-flash 0.5s infinite';
                
                // Play sound if selected
                playAlarm(timerId);
                
                // Clear the interval
                clearInterval(timerIntervals[timerId]);
                timerIntervals[timerId] = null;
            }
        }
    }, 1000);
}

// Pause the timer
function pauseTimer(timerId) {
    if (timerIntervals[timerId]) {
        clearInterval(timerIntervals[timerId]);
        timerIntervals[timerId] = null;
    }
}

// Stop the timer completely (set to 0 and stop)
function stopTimer(timerId) {
    pauseTimer(timerId);
    
    const timerDisplay = document.querySelector(`#timer-${timerId} .timer-display`);
    const timerContainer = document.getElementById(`timer-${timerId}`);
    
    timerValues[timerId] = 0;
    timerDisplay.textContent = '00:00';
    
    // Remove animation and classes
    timerDisplay.classList.remove('warning', 'danger');
    timerContainer.style.animation = 'none';
    
    // Stop any sounds
    stopAllSounds();
}

// Reset timer to 2 minutes
function resetTimer(timerId) {
    pauseTimer(timerId);
    
    const timerDisplay = document.querySelector(`#timer-${timerId} .timer-display`);
    const timerContainer = document.getElementById(`timer-${timerId}`);
    
    timerValues[timerId] = 120; // 2 minutes
    timerDisplay.textContent = '02:00';
    
    // Remove animation and classes
    timerDisplay.classList.remove('warning', 'danger');
    timerContainer.style.animation = '';
    
    // Stop any sounds
    stopAllSounds();
}

// Set timer to a specific value (in seconds)
function setTimer(timerId, seconds) {
    pauseTimer(timerId);
    
    const timerDisplay = document.querySelector(`#timer-${timerId} .timer-display`);
    const timerContainer = document.getElementById(`timer-${timerId}`);
    
    timerValues[timerId] = seconds;
    timerDisplay.textContent = formatTime(seconds);
    
    // Remove animation and classes
    timerDisplay.classList.remove('warning', 'danger');
    timerContainer.style.animation = '';
    
    // Stop any sounds
    stopAllSounds();
}

// Add time to the current timer
function addTime(timerId, seconds) {
    const timerDisplay = document.querySelector(`#timer-${timerId} .timer-display`);
    const timerContainer = document.getElementById(`timer-${timerId}`);
    
    // Add the time
    timerValues[timerId] = (timerValues[timerId] || 0) + seconds;
    timerDisplay.textContent = formatTime(timerValues[timerId]);
    
    // If timer was showing danger, fix it
    if (timerValues[timerId] > 0) {
        timerDisplay.classList.remove('danger');
        timerContainer.style.animation = '';
        stopAllSounds();
    }
    
    // Add warning class if needed
    if (timerValues[timerId] <= 10 && timerValues[timerId] > 0) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }
}

// Set custom time
function setCustomTimer(timerId) {
    const minutesInput = document.getElementById(`minutes-${timerId}`);
    const secondsInput = document.getElementById(`seconds-${timerId}`);
    
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    if (minutes === 0 && seconds === 0) {
        return; // Don't set to zero
    }
    
    const totalSeconds = (minutes * 60) + seconds;
    setTimer(timerId, totalSeconds);
}

// Play the selected alarm sound
function playAlarm(timerId) {
    const soundSelect = document.getElementById(`sound-select-${timerId}`);
    const sound = soundSelect.value;
    
    if (sound !== 'none' && beepSounds[sound]) {
        stopAllSounds();
        beepSounds[sound].currentTime = 0;
        beepSounds[sound].play();
    }
}

// Test the sound
function testSound(timerId) {
    const soundSelect = document.getElementById(`sound-select-${timerId}`);
    const sound = soundSelect.value;
    
    if (sound !== 'none' && beepSounds[sound]) {
        stopAllSounds();
        beepSounds[sound].currentTime = 0;
        beepSounds[sound].play();
    }
}

// Stop all sounds
function stopAllSounds() {
    for (const sound in beepSounds) {
        beepSounds[sound].pause();
        beepSounds[sound].currentTime = 0;
    }
}

// Add a new timer
function addNewTimer() {
    // Check if we've reached the maximum
    if (timerCount >= maxTimers) {
        alert('Maximum number of timers reached (8)');
        return;
    }
    
    // Increment timer count
    timerCount++;
    
    // Create the HTML for the new timer
    const newTimerId = timerCount;
    const newTimerHTML = `
    <div class="timer-container" id="timer-${newTimerId}">
        <div class="delete-btn-container">
            <button class="delete-btn" onclick="deleteTimer(${newTimerId})">×</button>
        </div>
        
        <div class="pc-name-container">
            <input type="text" class="pc-name" placeholder="Character Name">
        </div>
        
        <div class="timer-display">02:00</div>
        
        <div class="time-presets">
            <button class="preset-btn" onclick="setTimer(${newTimerId}, 60)">1 min</button>
            <button class="preset-btn" onclick="setTimer(${newTimerId}, 120)">2 min</button>
            <button class="preset-btn" onclick="setTimer(${newTimerId}, 180)">3 min</button>
            <button class="preset-btn" onclick="setTimer(${newTimerId}, 300)">5 min</button>
        </div>
        
        <div class="add-time">
            <button class="add-btn" onclick="addTime(${newTimerId}, 30)">+30 sec</button>
        </div>
        
        <div class="custom-time">
            <input type="number" id="minutes-${newTimerId}" min="0" max="60" value="2">
            <label for="minutes-${newTimerId}">min</label>
            <input type="number" id="seconds-${newTimerId}" min="0" max="59" value="0">
            <label for="seconds-${newTimerId}">sec</label>
            <button class="btn" onclick="setCustomTimer(${newTimerId})">Set Time</button>
        </div>
        
        <div class="alarm-sound">
            <label for="sound-select-${newTimerId}">Alarm:</label>
            <select id="sound-select-${newTimerId}">
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
            <button class="btn" onclick="testSound(${newTimerId})">Test</button>
        </div>
        
        <div class="controls">
            <button class="btn start-btn large-btn" onclick="startTimer(${newTimerId})">Start</button>
            <button class="btn stop-btn" onclick="stopTimer(${newTimerId})">Stop</button>
            <button class="btn pause-btn" onclick="pauseTimer(${newTimerId})">Pause</button>
            <button class="btn btn-danger reset-btn" onclick="resetTimer(${newTimerId})">Reset</button>
        </div>
    </div>
    `;
    
    // Insert the new timer before the add button
    const addButton = document.getElementById('add-timer-btn');
    addButton.insertAdjacentHTML('beforebegin', newTimerHTML);
    
    // Initialize the timer value
    timerValues[newTimerId] = 120; // 2 minutes
    
    // Hide add button if at max
    if (timerCount >= maxTimers) {
        addButton.style.display = 'none';
    }
}

// Delete a timer
function deleteTimer(timerId) {
    // Can't delete the first timer
    if (timerId === 1) {
        alert('Cannot delete the first timer');
        return;
    }
    
    // Stop the timer if running
    pauseTimer(timerId);
    
    // Remove the timer element
    const timerElement = document.getElementById(`timer-${timerId}`);
    if (timerElement) {
        timerElement.remove();
    }
    
    // Clean up
    delete timerIntervals[timerId];
    delete timerValues[timerId];
    
    // Show the add button if it was hidden
    document.getElementById('add-timer-btn').style.display = 'flex';
}
