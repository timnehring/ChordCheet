import { contextBridge, ipcRenderer } from 'electron'


// Expose ipcRenderer to the client
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    let validChannels = ['nameOfClientChannel', 'ping','asynchronous-ping', 'addSong', 'getSonglist', 'getSong', 'deleteSong', 'updateSong', 'getTheme', 'setTheme'] // <-- Array of all ipcRenderer Channels used in the client
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = ['nameOfElectronChannel', 'pong', 'asynchronous-pong', 'getSonglistReply', 'getSongReply'] // <-- Array of all ipcMain Channels used in the electron
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, args) => {func(args)})
    }
  },
  once: (channel, func) => {
    let validChannels = ['nameOfElectronChannel', 'pong', 'asynchronous-pong', 'getSonglistReply', 'getSongReply', 'deleteSongReply', 'addSongReply', 'updateSongReply', 'getThemeReply'] // <-- Array of all ipcMain Channels used in the electron
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, args) => {func(args)})
    }
  },
  //own testing
  invoke: (channel, data) => {
    ipcRenderer.invoke(channel, data).then((result) => {
      console.log("RESULT: " + result)
    })
  },
  sendSync: (channel, data) => {
    return ipcRenderer.sendSync(channel, data)
  },
})
//my own testing stuff
contextBridge.exposeInMainWorld('myAPI', {
  version: process.getSystemVersion()
})
