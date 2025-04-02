export default class Timer {
  constructor(root) {
    root.innerHTML = Timer.getHTML();
    
    // Get reference to the audio element at initialization
    this.alarmSound = document.getElementById("alarmSound");
    // Log whether the audio element was found
    if (!this.alarmSound) {
      console.error("Audio element 'alarmSound' not found!");
    } else {
      console.log("Audio element found and initialized");
      console.log("Audio src path:", this.alarmSound.src);
    }

    this.el = {
      minutes: root.querySelector(".timer__part--minutes"),
      seconds: root.querySelector(".timer__part--seconds"),
      control: root.querySelector(".timer__btn--control"),
      reset: root.querySelector(".timer__btn--reset"),
    };

    this.interval = null;
    this.remainingSeconds = 0;

    this.el.control.addEventListener("click", () => {
      if (this.interval === null) {
        this.start();
      } else {
        this.stop();
      }
    });

    this.el.reset.addEventListener("click", () => {
      const inputMinutes = prompt("Enter number of minutes:");

      if (!isNaN(inputMinutes) && inputMinutes > 0 && inputMinutes < 60) {
        this.stop();
        this.remainingSeconds = inputMinutes * 60;
        this.updateInterfaceTime();
      }
    });
  }

  updateInterfaceTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    this.el.minutes.textContent = minutes.toString().padStart(2, "0");
    this.el.seconds.textContent = seconds.toString().padStart(2, "0");
  }

  updateInterfaceControls() {
    if (this.interval === null) {
      this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
      this.el.control.classList.add("timer__btn--start");
      this.el.control.classList.remove("timer__btn--stop");
    } else {
      this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
      this.el.control.classList.add("timer__btn--stop");
      this.el.control.classList.remove("timer__btn--start");
    }
  }

  start() {
    if (this.remainingSeconds === 0) return;

    // Add a test sound play when starting the timer to check if audio works
    // This helps work around browsers requiring user interaction to play sounds
    if (this.alarmSound) {
      this.alarmSound.volume = 0.1;  // Set to low volume for test
      this.alarmSound.currentTime = 0;
      this.alarmSound.play().then(() => {
        this.alarmSound.pause();  // Stop the test sound
        this.alarmSound.volume = 1.0;  // Reset volume
        console.log("Audio test successful");
      }).catch(error => {
        console.error("Audio test failed:", error);
        console.log("Attempting to load audio from:", this.alarmSound.src);
      });
    }

    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateInterfaceTime();

      if (this.remainingSeconds === 0) {
        this.stop();
        this.playAlarm();
      }
    }, 1000);

    this.updateInterfaceControls();
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.updateInterfaceControls();
  }

  playAlarm() {
    console.log("Attempting to play alarm sound");
    if (this.alarmSound) {
      // Reset the audio before playing
      this.alarmSound.currentTime = 0;
      this.alarmSound.volume = 1.0;
      
      // Try to play the sound with proper error handling
      this.alarmSound.play().then(() => {
        console.log("Alarm sound played successfully");
      }).catch(error => {
        console.error("Audio playback failed:", error);
        console.log("Audio src path:", this.alarmSound.src);
        alert("Timer finished!"); 
      });
    } else {
      console.error("Alarm sound element not found");
      alert("Timer finished!"); 
    }
  }

  static getHTML() {
    return `
      <span class="timer__part timer__part--minutes">00</span>
      <span class="timer__part">:</span>
      <span class="timer__part timer__part--seconds">00</span>
      <button type="button" class="timer__btn timer__btn--control timer__btn--start">
        <span class="material-icons">play_arrow</span>
      </button>
      <button type="button" class="timer__btn timer__btn--reset">
        <span class="material-icons">timer</span>
      </button>
    `;
  }
}