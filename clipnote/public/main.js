const { app, BrowserWindow, clipboard, protocol } = require("electron");
const path = require("path");
const url = require("url");
const clipboardListener = require("clipboard-event");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 225,
    height: 250,
    minWidth: 225,
    frame: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const appUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: false,
        slashes: true,
      })
    : "http:/localhost:3000";
  win.setPosition(0, 0);
  win.loadURL(appUrl);
}
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
  clipboardListener.startListening();
  clipboardListener.on("change", (e) => {
    let text = clipboard.readText();
    console.log(text);
    if (text) {
      win.webContents.send("copyText", {
        text,
      });
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    clipboardListener.stopListening();
    app.quit();
  }
});
