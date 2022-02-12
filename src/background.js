'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'


const Store = require('electron-store');

const schema = {
  theme: {
    type: 'string',
    default: 'light'
  },
  windowSize: {
    default: {
      x: 1366,
      y: 768
    }
  }
};

const store = new Store({ schema });



const path = require('path')
const Datastore = require('nedb');
let db;

let userData = app.getPath('userData');
if (isDevelopment) {
  db = new Datastore({ filename: './db/test.db', autoload: true });
}
else {
  db = new Datastore({ filename: userData + '/db/test.db', autoload: true });
}



ipcMain.on('addSong', (event, arg) => {
  console.log("EVENT: " + event);
  db.insert(arg, function (err, newDoc) {
    event.reply('addSongReply', newDoc._id);
  });
})

ipcMain.on('getSonglist', (event, arg) => {
  console.log(arg);
  db.find({}, { artist: 1, title: 1, _id: 1 }).sort({ title: 1 }).exec(function (err, docs) {
    event.reply('getSonglistReply', docs)
  });
})

ipcMain.on('getSong', (event, arg) => {
  console.log(arg);
  db.find({ _id: arg }, function (err, docs) {
    event.reply('getSongReply', docs)
  });
})

ipcMain.on('updateSong', (event, arg) => {
  db.update({ _id: arg._id }, { 'artist': arg.artist, 'title': arg.title, 'capo': arg.capo, 'bpm': arg.bpm, 'fullText': arg.fullText, 'charCount': arg.charCount, 'part': arg.part }, {}, function (err, numReplaced) {
    event.reply('updateSongReply', arg._id)
  });
})

ipcMain.on('deleteSong', (event, arg) => {
  console.log(arg);
  db.remove({ _id: arg }, {}, function (err, numRemoved) {
    event.reply('deleteSongReply', numRemoved)
  });
})

ipcMain.on('getTheme', (event, arg) => {
  console.log('getTheme');
  event.reply('getThemeReply', store.get('theme'))
})

ipcMain.on('setTheme', (event, arg) => {
  console.log('setTheme to: ' + arg);
  store.set('theme', arg)
  // maybe add a reply later, but currently not needed 
})

//testing
ipcMain.on('ping', (event, arg) => {
  console.log(arg) // prints "ping"
  setInterval(() => {
    event.returnValue = 'pong'
  }, 30000)
})

ipcMain.on('asynchronous-ping', (event, arg) => {
  console.log(arg) // prints "ping"
  setTimeout(() => {
    event.reply('asynchronous-pong', 'pong')
  }, 10000)
})


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: store.get('windowSize.x'),
    height: store.get('windowSize.y'),
    minWidth: 1366,
    minHeight: 768,
    autoHideMenuBar: true,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('resized', () => {
    let newSize = win.getSize()
    console.log('resized to: ' + newSize[0] + ', ' + newSize[1])
    store.set({ 'windowSize.x': newSize[0] })
    store.set({ 'windowSize.y': newSize[1] })
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}