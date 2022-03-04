// [1] YouTube IFrame API Code Example: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
// [2] Guided Wim Hof Breathing: https://youtu.be/tybOi4hjZFQ
// [3] Parameter playsinline: https://developers.google.com/youtube/player_parameters#Parameters

const BUTTON_START_SESSION = "startsession";
const BUTTON_SKIP_INTRO = "skipintro";
const BUTTON_PAUSE_RESUME = "pauseresume";
const BUTTON_REPLAY_ROUND_2 = "replayround2";
const BUTTON_REPLAY_ROUND_3 = "replayround3";

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

function onYouTubePlayerReady(event) {
  //playVideo();
  function checkCurrentTime() {
    if (ytplayer && ytplayer.getCurrentTime) {
      videotime = ytplayer.getCurrentTime();
      isIntroFinished = videotime >= 12;
      isEndOfRound3 = videotime > 612;
      isEndOfRound1Retention = videotime >= 159 && videotime <= 177;
      isEndOfRound2Retention = videotime >= 372 && videotime <= 386;
      isEndOfRound3Retention = videotime >= 581 && videotime <= 595;
      isEndOfRetention = isEndOfRound1Retention || isEndOfRound2Retention || isEndOfRound3Retention;
      if (isIntroFinished) {
        hideElementById(BUTTON_SKIP_INTRO);
      }
      if (isEndOfRound3) {
        showElementById(BUTTON_REPLAY_ROUND_2);
        showElementById(BUTTON_REPLAY_ROUND_3);
      }
      else {
        hideElementById(BUTTON_REPLAY_ROUND_2);
        hideElementById(BUTTON_REPLAY_ROUND_3);
      }
      if (isEndOfRetention) {
        showElementById(BUTTON_PAUSE_RESUME);
      }
      else {
        hideElementById(BUTTON_PAUSE_RESUME);
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
  if (isSessionInProgress()) {
    pauseResume.innerHTML = "Pause Session";
  } else {
    pauseResume.innerHTML = "Resume Session";
  }
}

function resumeSession() {
  playVideo();
}

function playVideo() {
  ytplayer.playVideo();
}

function pauseSession() {
  ytplayer.pauseVideo();
}

function isSessionInProgress() {
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
function pauseResumeSession() {
  if (isSessionInProgress())
    pauseSession();
  else
    resumeSession();
}
