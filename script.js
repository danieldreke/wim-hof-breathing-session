// [1] YouTube IFrame API Code Example: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
// [2] Guided Wim Hof Breathing: https://youtu.be/tybOi4hjZFQ
// [3] Parameter playsinline: https://developers.google.com/youtube/player_parameters#Parameters

const BUTTON_START_SESSION = "startsession";
const BUTTON_SKIP_INTRO = "skipintro";
const BUTTON_PAUSE_RESUME = "pauseresume";
const BUTTON_START_BREATHING_IN = "startbreathingin";
const BUTTON_REPLAY_ROUND_2 = "replayround2";
const BUTTON_REPLAY_ROUND_3 = "replayround3";

const STARTTIME_BREATHING_ROUND_1 = 176;
const STARTTIME_BREATHING_ROUND_2 = 385;
const STARTTIME_BREATHING_ROUND_3 = 593;
const ENDTIME_ROUND_1 = STARTTIME_BREATHING_ROUND_1 + 16;
const ENDTIME_ROUND_2 = STARTTIME_BREATHING_ROUND_2 + 16;
const ENDTIME_ROUND_3 = STARTTIME_BREATHING_ROUND_3 + 16;

var ytplayer;

function onYouTubeIframeAPIReady() {
  createYouTubePlayer();
}

function createYouTubePlayer() {
  ytplayer = new YT.Player('ytplayer', {
    height: '270',
    width: '480',
    videoId: 'tybOi4hjZFQ', // Guided Wim Hof Breathing [2]
    playerVars: {
      'autoplay': 0,
      'playsinline': 1, // Play video inline on iOS [3]
      'controls': 0,
      'modestbranding' : 1
    },
    events: {
      'onReady': onYouTubePlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function getVideoTime() {
  videotime = ytplayer.getCurrentTime();
  return videotime;
}

function isCloseToEndOfRetention() {
  var videotime = getVideoTime();
  var isCloseToEndOfRetention1 = videotime >= 159 && videotime <= 177;
  var isCloseToEndOfRetention2 = videotime >= 372 && videotime <= 386;
  var isCloseToEndOfRetention3 = videotime >= 581 && videotime <= 595;
  var isCloseToEndOfRetention_ = isCloseToEndOfRetention1 || isCloseToEndOfRetention2 || isCloseToEndOfRetention3;
  return isCloseToEndOfRetention_;
}

function onYouTubePlayerReady(event) {
  pauseVideo();
  showElementById(BUTTON_START_SESSION);
  function checkCurrentTime() {
    if (ytplayer && ytplayer.getCurrentTime) {
      var videotime = getVideoTime();
      var isIntroFinished = videotime >= 12;
      var isCloseToEndOfRetention_ = isCloseToEndOfRetention();
      var isEndOfRound3 = videotime >= 611 && videotime <= 631;
      if (isIntroFinished) {
        hideElementById(BUTTON_SKIP_INTRO);
      }
      if (isCloseToEndOfRetention_) {
        showElementById(BUTTON_PAUSE_RESUME);
      }
      else {
        hideElementById(BUTTON_PAUSE_RESUME);
        hideElementById(BUTTON_START_BREATHING_IN);
      }
      if (isEndOfRound3) {
        showElementById(BUTTON_REPLAY_ROUND_2);
        showElementById(BUTTON_REPLAY_ROUND_3);
      }
      else {
        hideElementById(BUTTON_REPLAY_ROUND_2);
        hideElementById(BUTTON_REPLAY_ROUND_3);
      }
    }
  }
  timeupdater = setInterval(checkCurrentTime, 200);
}

function onPlayerStateChange(event) {
  isPlaying = event.data == YT.PlayerState.PLAYING;
  isPaused = event.data == YT.PlayerState.PAUSED;
  isPlayingOrPaused = isPlaying || isPaused;
  if (isPlayingOrPaused) updateControls();
}

function updateControls() {
  var pauseResume = document.getElementById(BUTTON_PAUSE_RESUME);
  if (isVideoPlaying()) {
    pauseResume.innerHTML = "Pause Video";
  } else {
    pauseResume.innerHTML = "Resume Video";
  }
}

function resumeVideo() {
  playVideo();
}

function playVideo() {
  ytplayer.playVideo();
}

function pauseVideo() {
  ytplayer.pauseVideo();
  var isCloseToEndOfRetention_ = isCloseToEndOfRetention();
  if (isCloseToEndOfRetention_) {
    showElementById(BUTTON_START_BREATHING_IN);
  }
}

function isVideoPlaying() {
  var isVideoPlaying = ytplayer.getPlayerState() == 1;
  return isVideoPlaying;
}

function playVideoAtTime(timeInSeconds) {
  ytplayer.seekTo(timeInSeconds);
  playVideo();
}

function hideElementById(elementId) {
  document.getElementById(elementId).style.display = "none";
}

function showElementById(elementId) {
  document.getElementById(elementId).style.display = "inline-block";
}

function startSession() {
  playVideoAtTime(0);
  hideElementById(BUTTON_START_SESSION);
  showElementById(BUTTON_SKIP_INTRO);
}

function skipIntro() {
  hideElementById(BUTTON_SKIP_INTRO);
  playVideoAtTime(12);
}

function startBreathingIn() {
  videotime = getVideoTime();
  isRound1 = videotime <= ENDTIME_ROUND_1;
  isRound2 = videotime > ENDTIME_ROUND_1 && videotime <= ENDTIME_ROUND_2;
  isRound3 = videotime > ENDTIME_ROUND_2 && videotime <= ENDTIME_ROUND_3;
  if (isRound1) {
    playVideoAtTime(STARTTIME_BREATHING_ROUND_1);
  }
  else if (isRound2) {
    playVideoAtTime(STARTTIME_BREATHING_ROUND_2);
  }
  else if (isRound3) {
    playVideoAtTime(STARTTIME_BREATHING_ROUND_3);
  }
  hideElementById(BUTTON_START_BREATHING_IN);
}

function replayRound2() {
  hideElementById(BUTTON_REPLAY_ROUND_2);
  hideElementById(BUTTON_REPLAY_ROUND_3);
  playVideoAtTime(196);
}

function replayRound3() {
  hideElementById(BUTTON_REPLAY_ROUND_2);
  hideElementById(BUTTON_REPLAY_ROUND_3);
  playVideoAtTime(404);
}

// wording resume vs continue: https://ux.stackexchange.com/a/130248
function pauseResumeVideo() {
  if (isVideoPlaying())
    pauseVideo();
  else
    resumeVideo();
}
