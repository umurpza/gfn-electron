const { app, BrowserWindow } = require('electron');

let isFullScreen = false;
let isGameStreamingScreen = false;

function toggleFullscreen(state) {
  const window = BrowserWindow.getAllWindows()[0];
  const actualState = window.isFullScreen();
  if (isFullScreen != state || actualState != state) {
    if (state || !isGameStreamingScreen) {
      window.setFullScreen(state);
      isFullScreen = state;
      console.log("Fullscreen state changed to: " + state);

      if (state) {
        focusWindow();
      }
    }
  }
}

function toggleGameStreamingMode(state) {
  if (isGameStreamingScreen != state) {
    isGameStreamingScreen = state;
    console.log("Game streaming mode state changed to: " + state);
  }

  toggleFullscreen(isGameStreamingScreen);

  if (state) {
    focusWindow();
  }
}

function switchFullscreenState() {
  if (isFullScreen) {
    toggleFullscreen(false);
  } else {
    toggleFullscreen(true);
  }
}

function focusWindow() {
  BrowserWindow.getAllWindows()[0].focus();
}

app.on("browser-window-created", async function (event, window) {
  window.on("leave-full-screen", async function (event, window) {
    event.preventDefault();
    if (isGameStreamingScreen) {
      toggleFullscreen(true);
    }
  });
  window.on("page-title-updated", async function (event, title) {
    toggleGameStreamingMode(title.includes("on GeForce NOW"));
  });
});

module.exports = { toggleFullscreen, switchFullscreenState };
