const { app, BrowserWindow, globalShortcut, clipboard } = require("electron");
const path = require("path");
const clipboardListener = require("clipboard-event");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setPosition(0, 0);
  win.loadURL("http://localhost:3001");
}

app.whenReady().then(() => {
  createWindow();
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
