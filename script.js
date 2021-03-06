// [1] YouTube IFrame API Code Example: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
// [2] Guided Wim Hof Breathing: https://youtu.be/tybOi4hjZFQ
// [3] Parameter playsinline: https://developers.google.com/youtube/player_parameters#Parameters

const CHECK_VIDEOTIME_INTERVAL_IN_MILLISECONDS = 100;

const BUTTON_START_SESSION = "startsession";
const BUTTON_SKIP_INTRO = "skipintro";
const BUTTON_PAUSE_RESUME = "pauseresume";
const BUTTON_START_BREATHING_IN = "startbreathingin";
const BUTTON_REPLAY_ROUND_2 = "replayround2";
const BUTTON_REPLAY_ROUND_3 = "replayround3";
const CBOX_LABEL_AUTOPAUSE = "cboxlabel";
const AUTOPAUSE_COUNTER = "autopausecounter";

const STARTTIME_ROUND_2 = 196;
const STARTTIME_ROUND_3 = 404;
const STARTTIME_BREATHING_ROUND_1 = 176;
const STARTTIME_BREATHING_ROUND_2 = 385;
const STARTTIME_BREATHING_ROUND_3 = 593;

const STARTTIME_PAUSE_NOTE_ROUND_1 = 159;
const STARTTIME_PAUSE_NOTE_ROUND_2 = 372;
const STARTTIME_PAUSE_NOTE_ROUND_3 = 581;

const ENDTIME_INTRO = 11;
const ENDTIME_ROUND_1 = STARTTIME_BREATHING_ROUND_1 + 16;
const ENDTIME_ROUND_2 = STARTTIME_BREATHING_ROUND_2 + 16;
const ENDTIME_ROUND_3 = STARTTIME_BREATHING_ROUND_3 + 19;
const ENDTIME_SESSION = 630;

const AUTOPAUSE_TIME_ROUND_1 = STARTTIME_BREATHING_ROUND_1 - 8;
const AUTOPAUSE_TIME_ROUND_2 = STARTTIME_BREATHING_ROUND_2 - 3;
const AUTOPAUSE_TIME_ROUND_3 = STARTTIME_BREATHING_ROUND_3 - 2;

var ytplayer;
var pausedDueToEndOfSession = false;
var videoAutoPaused = false;
var startBreathingInClicked = false;
var sessionStarted = false;

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
      'modestbranding': 1,
      'cc_lang_pref': 'en',
      //'cc_load_policy': 0,
      'rel': 0 // only show related videos
    },
    events: {
      'onReady': onYouTubePlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function getVideoTime() {
  videotime = parseInt(ytplayer.getCurrentTime());
  return videotime;
}

function isCloseToEndOfRetention() {
  var videotime = getVideoTime();
  var isCloseToEndOfRetention1 = videotime >= STARTTIME_PAUSE_NOTE_ROUND_1 && videotime < STARTTIME_BREATHING_ROUND_1;
  var isCloseToEndOfRetention2 = videotime >= STARTTIME_PAUSE_NOTE_ROUND_2 && videotime < STARTTIME_BREATHING_ROUND_2;
  var isCloseToEndOfRetention3 = videotime >= STARTTIME_PAUSE_NOTE_ROUND_3 && videotime < STARTTIME_BREATHING_ROUND_3;
  var isCloseToEndOfRetention_ = isCloseToEndOfRetention1 || isCloseToEndOfRetention2 || isCloseToEndOfRetention3;
  return isCloseToEndOfRetention_;
}

function isAutoPauseChecked() {
  var isChecked = document.getElementById("autopause").checked;
  return isChecked;
}

function updateCounter(secondsUntilAutopause) {
  var counter = document.getElementById(AUTOPAUSE_COUNTER);
  var status = `Video will pause in ${secondsUntilAutopause} seconds`;
  counter.innerHTML = status;
}

function onYouTubePlayerReady(event) {
  showElementById(BUTTON_START_SESSION);
  showElementById(CBOX_LABEL_AUTOPAUSE);
  function checkCurrentTime() {
    //return;
    if (ytplayer && ytplayer.getCurrentTime && sessionStarted) {
      var videotime = getVideoTime();
      var isIntroFinished = videotime > ENDTIME_INTRO;
      var isCloseToEndOfRetention_ = isCloseToEndOfRetention();
      var isEndOfRound3 = videotime > ENDTIME_ROUND_3; // && videotime < ENDTIME_SESSION;
      if (isIntroFinished) {
        hideElementById(BUTTON_SKIP_INTRO);
      }
      if (isCloseToEndOfRetention_) {
        if (!startBreathingInClicked) {
          if (isAutoPauseChecked()) {
            showElementById(AUTOPAUSE_COUNTER);
            //var secondsUntilAutopause = 173 - videotime;
            //updateCounter(secondsUntilAutopause);
          }
          else {
            showElementById(BUTTON_PAUSE_RESUME);
          }
          showElementById(BUTTON_START_BREATHING_IN);
        }
      }
      else {
        hideElementById(BUTTON_PAUSE_RESUME);
        hideElementById(BUTTON_START_BREATHING_IN);
        hideElementById(AUTOPAUSE_COUNTER);
        if (videotime > 0) {
          hideElementById(CBOX_LABEL_AUTOPAUSE);
        }
        startBreathingInClicked = false;
      }
      var isAutoPauseTime =
        (videotime == AUTOPAUSE_TIME_ROUND_1)
        || (videotime == AUTOPAUSE_TIME_ROUND_2)
        || (videotime == AUTOPAUSE_TIME_ROUND_3);
      if (isAutoPauseTime) {
        var pausevideo = isAutoPauseChecked() && !videoAutoPaused;
        if (pausevideo) {
          ytplayer.pauseVideo();
          videoAutoPaused = true;
          var pauseStatus = "Video is autopaused";
          document.getElementById(AUTOPAUSE_COUNTER).innerHTML = pauseStatus;
        }
      }
      else {
        videoAutoPaused = false;
        document.getElementById(AUTOPAUSE_COUNTER).innerHTML = "Video will autopause";
      }
      if (isEndOfRound3) {
        showElementById(BUTTON_REPLAY_ROUND_2);
        showElementById(BUTTON_REPLAY_ROUND_3);
      }
      else {
        hideElementById(BUTTON_REPLAY_ROUND_2);
        hideElementById(BUTTON_REPLAY_ROUND_3);
      }
      var pauseAtEndOfSession = videotime == ENDTIME_SESSION && !pausedDueToEndOfSession;
      if (pauseAtEndOfSession) {
        ytplayer.pauseVideo();
        pausedDueToEndOfSession = true;
      }
    }
  }
  timeupdater = setInterval(checkCurrentTime, CHECK_VIDEOTIME_INTERVAL_IN_MILLISECONDS);
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
  var isVideoPlaying = ytplayer.getPlayerState() == YT.PlayerState.PLAYING;
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
  document.getElementById(elementId).style.display = "block";
}

function startSession() {
  playVideoAtTime(0);
  sessionStarted = true;
  hideElementById(BUTTON_START_SESSION);
  hideElementById(CBOX_LABEL_AUTOPAUSE);
  showElementById(BUTTON_SKIP_INTRO);
  document.getElementById("ytplayer").classList.remove("disabled-events");
}

function skipIntro() {
  hideElementById(BUTTON_SKIP_INTRO);
  playVideoAtTime(12);
}

function startBreathingIn() {
  hideElementById(BUTTON_START_BREATHING_IN);
  hideElementById(AUTOPAUSE_COUNTER);
  startBreathingInClicked = true;
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
}

function replayRound2() {
  hideElementById(BUTTON_REPLAY_ROUND_2);
  hideElementById(BUTTON_REPLAY_ROUND_3);
  playVideoAtTime(STARTTIME_ROUND_2);
}

function replayRound3() {
  hideElementById(BUTTON_REPLAY_ROUND_2);
  hideElementById(BUTTON_REPLAY_ROUND_3);
  playVideoAtTime(STARTTIME_ROUND_3);
}

// wording resume vs continue: https://ux.stackexchange.com/a/130248
function pauseResumeVideo() {
  if (isVideoPlaying())
    pauseVideo();
  else
    resumeVideo();
}
