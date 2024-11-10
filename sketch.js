// Global Variables
let sampleSets = [[], [], []];
let animations = [];
let currentSetIndex = 0;
let animationPlayed = false; // Flag for animation state
let soundsLoaded = false; // Flag for sound loading state
let lastInteractionTime = 0; // For debouncing interactions

// Color Palettes and Backgrounds for different sets
const colorPalettes = [
  ["#CFEC9E", "#C77435", "#FF5A2C", "#A9A7E4", "#2E2828"], // Set 1
  ["#F4F6E1", "#CFEC9E", "#FF5A2C", "#A9A7E4", "#2E2828"], // Set 2
  ["#F4F6E1", "#C77435", "#FF5A2C", "#A9A7E4", "#CFEC9E"], // Set 3
];

const backgroundColors = [
  "#F4F6E1", // Light background for Set 1
  "#C77435", // Deep background for Set 2
  "#2E2828", // Dark background for Set 3
];

// Preload sound files for each set
function preload() {
  const loadSounds = (prefix, start, end, index) => {
    let loadedCount = 0;
    for (let i = start; i <= end; i++) {
      const sound = loadSound(
        `${prefix}_${i}.mp3`,
        () => {
          loadedCount++;
          if (loadedCount === (end - start + 1)) {
            console.log(`Loaded all ${prefix} sounds`);
            checkAllSoundsLoaded(); // Check if all sets are loaded
          }
        },
        (err) => console.error(`Failed to load ${prefix}_${i}.mp3`, err)
      );
      sampleSets[index].push(sound);
    }
  };

  loadSounds("1st", 0, 9, 0); // Load Set 1
  loadSounds("2nd", 11, 20, 1); // Load Set 2
  loadSounds("3rd", 21, 30, 2); // Load Set 3
}

function checkAllSoundsLoaded() {
  soundsLoaded = sampleSets.every(set => set.length > 0);
  if (soundsLoaded) {
    console.log("All sounds loaded.");
  }
}

// Setup canvas and initial settings
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB, 255);
  textAlign(CENTER, CENTER);
  textSize(24);
  frameRate(60); // Limit frame rate for performance on mobile
  resumeAudioContext(); // Ensure AudioContext is resumed

  if (!soundsLoaded) {
    console.log("Waiting for sounds to load...");
    return; // Prevent interaction until sounds are loaded
  }

  if (!animationPlayed) {
    playAnimation(0); // Play first animation on load
    animationPlayed = true;
  }
}

// Main draw loop
function draw() {
  background(backgroundColors[currentSetIndex]);
  animations.forEach(anim => anim.draw());
  animations = animations.filter(anim => !anim.isFinished()); // Remove finished animations

  if (animations.length > 10) {
    animations = animations.slice(0, 10); // Limit active animations
  }
}

// Interaction handlers (touch, mouse, keyboard)
function touchStarted() {
  handleInteraction(touches[0].x);
  resumeAudioContext(); // Ensure AudioContext is resumed on touch (iOS fix)
}

function mousePressed() {
  if (isComputer()) handleInteraction(mouseX);
  resumeAudioContext(); // Ensure AudioContext is resumed on mouse press (iOS fix)
}

function keyPressed() {
  if (key >= "0" && key <= "9") {
    const index = parseInt(key);
    playSound(index); // Handle sound playback
    playAnimation(index);
  } else if (keyCode === 32) {
    toggleAnimationSet(); // Toggle animation set on space bar press
  }
}

// Handle interaction based on x position (touch or mouse)
function handleInteraction(x) {
  const currentTime = millis();
  if (currentTime - lastInteractionTime < 150) {
    // Ignore interaction if it's too quick after the last one (debouncing)
    return;
  }
  lastInteractionTime = currentTime;

  // Map x to 11 blocks (10 sound blocks + 1 for toggling the set)
  const index = floor(map(x, 0, width, 0, 11)); // Now maps to 0-10

  if (index === 10) {
    toggleAnimationSet(); // Toggle animation set if touching the last block (index 10)
  } else if (index >= 0 && index < 10) {
    const sample = sampleSets[currentSetIndex][index];
    if (sample) {
      sample.play(); // Play sound if loaded
      playAnimation(index); // Play animation
    }
  }
}

// Play sound if available
function playSound(index) {
  const sample = sampleSets[currentSetIndex][index];
  if (sample) {
    sample.play();
  } else {
    console.error(`Sound at index ${index} is unavailable.`);
    // Optionally show feedback like a flashing red icon or text
  }
}

// Play animation based on the index
function playAnimation(index) {
  const colors = colorPalettes[currentSetIndex];
  const AnimationClass = Animations[index];
  if (AnimationClass) {
    const newAnim = new AnimationClass(random(colors)); // Use random color
    animations.push(newAnim);
    if (animations.length > 10) animations.shift(); // Limit active animations
  } else {
    console.error(`Animation class for index ${index} is undefined.`);
  }
}

// Toggle between animation sets
function toggleAnimationSet() {
  currentSetIndex = (currentSetIndex + 1) % 3;
  animations.forEach(anim => anim.fadeOut()); // Fade out all current animations
}

// Base Animation Class
class BaseAnimation {
  constructor(color) {
    this.color = color;
    this.alpha = 255;
    this.fadeRate = 2;
  }

  fadeOut() {
    this.alpha = max(0, this.alpha - this.fadeRate);
  }

  isFinished() {
    return this.alpha <= 0; // Explicit check if the animation is completely faded
  }

  fillWithAlpha() {
    fill(`${this.color}${hex(this.alpha, 2)}`);
  }
}

// Animation Classes (individual animation behavior)
class Anim_0 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 20;
    this.angle = random(TWO_PI);
  }

  draw() {
    this.fillWithAlpha();
    const x = width / 2 + 100 * cos(this.angle);
    const y = height / 2 + 100 * sin(this.angle);
    ellipse(x, y, this.size, this.size);
    this.size += 5;
    this.angle += 0.1;
    this.fadeOut();
  }
}

class Anim_1 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 20;
  }

  draw() {
    this.fillWithAlpha();
    rect(width / 4, height / 2 - 25, this.size, 100);
    this.size += 5;
    this.fadeOut();
  }
}

class Anim_2 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.angle = 0;
    this.size = 300;
  }

  draw() {
    this.fillWithAlpha();
    push();
    translate(width / 2, height / 2);
    rotate(this.angle);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
    this.angle += 0.1;
    this.fadeOut();
  }
}

class Anim_3 extends BaseAnimation {
  constructor(color) {
    super(color);
  }

  draw() {
    this.fillWithAlpha();
    rect(0, 0, width, height);
    this.fadeOut();
  }
}

class Anim_4 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.posy = height + 50;
  }

  draw() {
    this.fillWithAlpha();
    rect(0, this.posy - 50, width, 70);
    this.posy *= 0.9;
    this.fadeOut();
  }
}

class Anim_5 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.posy = height + 50;
  }

  draw() {
    this.fillWithAlpha();
    rect(0, this.posy - 50, width, 50);
    rect(0, height - this.posy, width, 50);
    this.posy *= 0.95;
    this.fadeOut();
  }
}

class Anim_6 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.size = 80;
    this.x = random(width);
    this.y = random(height);
  }

  draw() {
    this.fillWithAlpha();
    ellipse(this.x, this.y, this.size, this.size);
    this.fadeOut();
  }
}

class Anim_7 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.angle = 0;
    this.size = 100;
    this.amplitude = 50;
  }

  draw() {
    this.fillWithAlpha();
    const x = width / 2 + this.size * cos(this.angle);
    const y = height / 2 + this.size * sin(this.angle) + this.amplitude * sin(frameCount * 0.1);
    ellipse(x, y, this.size * 1.5, this.size * 1.5);
    this.angle += 0.1;
    this.size += 0.5;
    this.fadeOut();
  }
}

class Anim_8 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.height = 0;
  }

  draw() {
    this.fillWithAlpha();
    noStroke();
    rect(0, height / 2 - this.height / 2, width, this.height);
    this.height = min(this.height + 6, height);
    this.fadeOut();
  }
}

class Anim_9 extends BaseAnimation {
  constructor(color) {
    super(color);
    this.x = -width;
    this.speed = 70;
    this.alpha = 255;
    this.hasCovered = false;
    this.isActive = true;
  }

  draw() {
    if (!this.isActive) return;

    noStroke();
    this.fillWithAlpha();

    if (!this.hasCovered) {
      rect(this.x, 0, width, height);
      this.x += this.speed * 0.1;
      if (this.x >= 0) {
        this.hasCovered = true;
      }
    }

    if (this.hasCovered) {
      this.alpha = max(0, this.alpha - 3);
      rect(0, 0, width, height);
    }

    this.fadeOut();
  }
}

// Animation class mapping
const Animations = {
  0: Anim_0,
  1: Anim_1,
  2: Anim_2,
  3: Anim_3,
  4: Anim_4,
  5: Anim_5,
  6: Anim_6,
  7: Anim_7,
  8: Anim_8,
  9: Anim_9,
};

// Resize canvas when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Detect if the user is on a computer
function isComputer() {
  return !/Mobi|Android/i.test(navigator.userAgent);
}

// iOS audio context workaround
function resumeAudioContext() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume().then(() => {
      console.log("Audio Context resumed on iOS");
    });
  }
}
