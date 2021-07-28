const audioContext = new AudioContext();
const wow = new Audio(
  'https://www.soundboard.com/mediafiles/24/242810-970c4842-1fa1-40d4-9a79-346d93cbb375.mp3'
);

export const playSound = value => {
  const o = audioContext.createOscillator();
  const g = audioContext.createGain();
  o.type = 'sine';
  o.frequency.value = value * 10;

  o.connect(g);
  g.connect(audioContext.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);

  // Make sure to clean up the oscillator node
  setTimeout(() => {
    o.stop();
  }, 100);
};

export const playWow = () => {
  wow.play();
};
