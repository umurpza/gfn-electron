//  All the Node.js APIs are available in the preload process. It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

(function mockChromeUserAgent() {
  let originalVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.getVoices = function () {
    return [
      {
        voiceURI: "Google US English",
        name: "Google US English",
        lang: "en-US",
        localService: false,
        default: false,
      },
    ];
  };

  //wait some arbitrary time before cleaning up the mess we did previously
  setTimeout(() => {
    window.speechSynthesis.getVoices = function () {
      return originalVoices;
    };
  }, 10_000);

  if (navigator.userAgent.includes("Windows")) {
    Object.defineProperty(navigator, "platform", {
      get: function () {
        return "Win32";
      },
      set: function (a) {},
    });

    // If let unchecked it will report the kernel version
    // as a Windows version.
    // 6.1.2 (linux) < 10.0.19041+ (Windows)
    // Minimum supported is 8+
    Object.defineProperty(navigator, "userAgentData", {
      get: function () {
        return null;
      },
      set: function (a) {},
    });
  }
})();
