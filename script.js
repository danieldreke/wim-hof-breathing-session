// [1] YouTube IFrame API Code Example: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
// [2] Guided Wim Hof Breathing: https://youtu.be/tybOi4hjZFQ
// [3] Parameter playsinline: https://developers.google.com/youtube/player_parameters#Parameters

function onYouTubeIframeAPIReady() {
  createYouTubePlayer();
}

var ytplayer;
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
  playVideo();
  function checkCurrentTime() {
    if (ytplayer && ytplayer.getCurrentTime) {
      videotime = ytplayer.getCurrentTime();
      if (videotime > 600) {
        showElementById("replayround2");
        showElementById("replayround3");
      }
    }
  }
  timeupdater = setInterval(checkCurrentTime, 100);
}

function onPlayerStateChange(event) {
  isPlaying = event.data == YT.PlayerState.PLAYING;
  isPaused = event.data == YT.PlayerState.PAUSED;
  isPlayingOrPaused = isPlaying || isPaused;
  if (isPlayingOrPaused) updateControls();
}

function updateControls() {
  var pauseResume = document.getElementById("pauseresume");
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
  hideElementById("startsession");
  hideElementById("skipintro");
  showElementById("pauseresume");
  //showElementById("replayround2");
}

function skipIntro() {
  playVideoAtTime(12);
  hideElementById("startsession");
  hideElementById("skipintro");
  showElementById("pauseresume");
  //showElementById("replayround2");
}

function replayRound2() {
  hideElementById("replayround2");
  hideElementById("replayround3");
  playVideoAtTime(196);
}

function replayRound3() {
  hideElementById("replayround2");
  hideElementById("replayround3");
  playVideoAtTime(404);
}

// wording resume vs continue: https://ux.stackexchange.com/a/130248
function pauseResumeSession() {
  if (isSessionInProgress())
    pauseSession();
  else
    resumeSession();
}
