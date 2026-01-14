// soundManager.js
const SoundManager = {
  correct: new Audio("./sound/sus_1.mp3"),
  wrong: new Audio("./sound/fall_1.wav"),

  playCorrect() {
    this.correct.currentTime = 0;
    this.correct.play();
  },

  playWrong() {
    speechSynthesis.cancel(); // 이전 말 중단
    speak("다시생각해봐");
    //this.wrong.currentTime = 0;
    //this.wrong.play();
  },

  speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = 1.3;
    u.pitch = 1.2;
    speechSynthesis.cancel(); // 겹침 방지
    speechSynthesis.speak(u);
  }
  
};


export default SoundManager;
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";   // 한국어
  utter.rate = 1.0;       // 말하는 속도
  utter.pitch = 1.0;      // 음 높이
  speechSynthesis.speak(utter);
}