const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 860,
    minWidth: 360,
    title: "Orari i Punës",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    backgroundColor: "#121817",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  // Excel ruhet direkt te Downloads, pa pyet
  win.webContents.session.on("will-download", (e, item) => {
    const dest = path.join(app.getPath("downloads"), item.getFilename());
    item.setSavePath(dest);
    item.once("done", (ev, state) => { if (state === "completed") shell.showItemInFolder(dest); });
  });
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.loadFile(path.join(__dirname, "..", "www", "index.html"));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
