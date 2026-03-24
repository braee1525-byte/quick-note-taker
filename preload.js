const { contextBridnp,ge, ipcRenderer } = require('electron' );

contextBridge. exposeInMainWorld('electronAPI', {
saveNote: (text) => ipcRenderer. invoke('save-note', text),
loadNote: () => ipcRenderer. invoke('load-note' )

});
