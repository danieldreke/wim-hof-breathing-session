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
}

function onPlayerStateChange(event) {
  isPlaying = event.data == YT.PlayerState.PLAYING;
  isPaused = event.data == YT.PlayerState.PAUSED;
  isPlayingOrPaused = isPlaying || isPaused;
  if (isPlayingOrPaused) updateControls();
}

function updateControls() {
  var pauseContinue = document.getElementById("pausecontinue");
  if (isVideoPlaying()) {
    pauseContinue.innerHTML = "Pause Session";
  } else {
    pauseContinue.innerHTML = "Continue Session";
  }
}

function playVideo() {
  ytplayer.playVideo()
}

function pauseVideo() {
  ytplayer.pauseVideo()
}

function isVideoPlaying() {
  var isPlaying = ytplayer.getPlayerState() == 1;
  return isPlaying;
}

function seekToVideoTime(timeInSeconds) {
  ytplayer.seekTo(timeInSeconds);
  if (!isVideoPlaying()) playVideo();
}

function startSession() {
  seekToVideoTime(0);
}

function pauseContinueSession() {
  if (isVideoPlaying())
    pauseVideo();
  else
    playVideo();
}
