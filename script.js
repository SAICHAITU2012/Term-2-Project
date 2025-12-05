const sounds = {
    dog: "dogsound.wav",
    clap: "clap.wav",
    pop: "pop.wav",
    laugh: "laugh.mp3",
    bell: "bells.wav",
    drum: "drums.mp3"
};

let currentAudio = null;
let isMuted = false;
let lastVolume = 0.7;

const soundButtons = document.querySelectorAll(".sound-btn");
const volumeSlider = document.getElementById("volume-slider");
const muteButton = document.getElementById("mute-btn");
const stopButton = document.getElementById("stop-btn");
const currentSoundText = document.getElementById("current-sound-text");
const soundStatus = document.getElementById("sound-status");

function playSound(soundName) {
    try {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        const button = document.querySelector(`[data-sound="${soundName}"]`);
        button.classList.remove("error");
        button.classList.add("active");
        
        soundStatus.textContent = "Loading sound...";
        soundStatus.style.color = "#fbbf24";
        
        currentAudio = new Audio();
        currentAudio.src = sounds[soundName];
        
        if (isMuted) {
            currentAudio.volume = 0;
        } else {
            currentAudio.volume = volumeSlider.value;
        }
        
        const soundNames = {
            dog: "Dog Bark",
            clap: "Clap Sound",
            pop: "Pop Sound",
            laugh: "Laugh Track",
            bell: "Bell Ring",
            drum: "Drum Beat"
        };
        
        currentAudio.play().then(() => {
            currentSoundText.textContent = `Now playing: ${soundNames[soundName]}`;
            soundStatus.textContent = "Sound playing successfully";
            soundStatus.style.color = "#10b981";
            
            currentAudio.onended = function() {
                button.classList.remove("active");
                currentSoundText.textContent = "No sound playing";
                soundStatus.textContent = "Ready to play sounds";
                soundStatus.style.color = "#94a3b8";
            };
            
            currentAudio.onerror = function() {
                button.classList.remove("active");
                button.classList.add("error");
                currentSoundText.textContent = "Error playing sound";
                soundStatus.textContent = "Could not load sound. Trying fallback...";
                soundStatus.style.color = "#ef4444";
                
                setTimeout(() => {
                    playFallbackSound(soundName, button);
                }, 500);
            };
            
        }).catch(error => {
            button.classList.remove("active");
            button.classList.add("error");
            currentSoundText.textContent = "Error playing sound";
            soundStatus.textContent = "Could not play sound. Trying fallback...";
            soundStatus.style.color = "#ef4444";
            
            setTimeout(() => {
                playFallbackSound(soundName, button);
            }, 500);
        });
        
    } catch (error) {
        console.log("Error in playSound:", error);
        playFallbackSound(soundName, document.querySelector(`[data-sound="${soundName}"]`));
    }
}

function playFallbackSound(soundName, button) {
    const fallbackSounds = {
        dog: "https://www.soundjay.com/misc/sounds/bark.wav",
        clap: "https://www.soundjay.com/human/sounds/applause-01.wav",
        pop: "https://www.soundjay.com/mechanical/sounds/bubble-pop-1.wav",
        laugh: "https://www.soundjay.com/human/sounds/audience-laugh-01.wav",
        bell: "https://www.soundjay.com/misc/sounds/bell-ring-02.wav",
        drum: "https://www.soundjay.com/misc/sounds/drum-roll-01.wav"
    };
    
    try {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        button.classList.remove("error");
        button.classList.add("active");
        
        soundStatus.textContent = "Trying fallback sound source...";
        soundStatus.style.color = "#f59e0b";
        
        currentAudio = new Audio(fallbackSounds[soundName]);
        
        if (isMuted) {
            currentAudio.volume = 0;
        } else {
            currentAudio.volume = volumeSlider.value;
        }
        
        const soundNames = {
            dog: "Dog Bark",
            clap: "Clap Sound",
            pop: "Pop Sound",
            laugh: "Laugh Track",
            bell: "Bell Ring",
            drum: "Drum Beat"
        };
        
        currentAudio.play().then(() => {
            currentSoundText.textContent = `Now playing: ${soundNames[soundName]} (fallback)`;
            soundStatus.textContent = "Fallback sound playing";
            soundStatus.style.color = "#10b981";
            
            currentAudio.onended = function() {
                button.classList.remove("active");
                currentSoundText.textContent = "No sound playing";
                soundStatus.textContent = "Ready to play sounds";
                soundStatus.style.color = "#94a3b8";
            };
            
        }).catch(error => {
            button.classList.remove("active");
            button.classList.add("error");
            currentSoundText.textContent = "Cannot play sound";
            soundStatus.textContent = "Both sources failed. Check your internet connection.";
            soundStatus.style.color = "#ef4444";
        });
        
    } catch (error) {
        button.classList.remove("active");
        button.classList.add("error");
        currentSoundText.textContent = "Sound error";
        soundStatus.textContent = "Cannot play sounds at this time";
        soundStatus.style.color = "#ef4444";
    }
}

soundButtons.forEach(button => {
    button.addEventListener("click", function() {
        const soundName = this.getAttribute("data-sound");
        playSound(soundName);
    });
});

volumeSlider.addEventListener("input", function() {
    if (currentAudio && !isMuted) {
        currentAudio.volume = this.value;
    }
    
    if (this.value > 0 && isMuted) {
        isMuted = false;
        muteButton.innerHTML = '<i class="fas fa-volume-xmark"></i> Mute All';
        muteButton.style.backgroundColor = "#ef4444";
        
        if (currentAudio) {
            currentAudio.volume = this.value;
        }
    }
});

muteButton.addEventListener("click", function() {
    isMuted = !isMuted;
    
    if (isMuted) {
        lastVolume = volumeSlider.value;
        volumeSlider.value = 0;
        this.innerHTML = '<i class="fas fa-volume-low"></i> Unmute';
        this.style.backgroundColor = "#10b981";
        
        if (currentAudio) {
            currentAudio.volume = 0;
        }
    } else {
        volumeSlider.value = lastVolume;
        this.innerHTML = '<i class="fas fa-volume-xmark"></i> Mute All';
        this.style.backgroundColor = "#ef4444";
        
        if (currentAudio) {
            currentAudio.volume = lastVolume;
        }
    }
});

stopButton.addEventListener("click", function() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentSoundText.textContent = "No sound playing";
        soundStatus.textContent = "Sound stopped";
        soundStatus.style.color = "#94a3b8";
        
        soundButtons.forEach(button => {
            button.classList.remove("active");
            button.classList.remove("error");
        });
    }
});

document.addEventListener("keydown", function(event) {
    const keyMap = {
        "1": "dog",
        "2": "clap",
        "3": "pop",
        "4": "laugh",
        "5": "bell",
        "6": "drum"
    };
    
    if (keyMap[event.key]) {
        playSound(keyMap[event.key]);
    }
    
    if (event.key === "m" || event.key === "M") {
        muteButton.click();
    }
    
    if (event.key === "s" || event.key === "S") {
        stopButton.click();
    }
});

soundStatus.textContent = "Ready to play sounds. Click any button!";