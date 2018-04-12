const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs");
const infoo = "./infoo.json";
const info = require(infoo);
let win

function createWindow () {
  win = new BrowserWindow({width: 1500, height: 1000})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => {
    win = null
  })
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('loaded')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit()}})

app.on('activate', () => {if (win === null) {createWindow()}})

ipcMain.on('done', (event, X) => {
  console.log(X)
})

ipcMain.on('confirmed-load', (event) => {
  console.log("App Loaded!")
  fs.watch("./infoo.json", (eventType, filename) => {
    try{
      let info = JSON.parse(fs.readFileSync('./infoo.json', 'utf8'));
      x = info[0]
      y = info[1]
      w = info[2]
      h = info[3]
      x = x + (w / 2)
      y = y + (h / 2)
      event.sender.send('newData', x, y, w, h)
      console.log(`CenterX:${x} -=- CenterY:${y} -=- Width:${w} -=- Height:${h}`)
    }
    catch (e) {
      console.log(e)
    }
  })
});