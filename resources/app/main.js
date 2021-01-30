const electron = require('electron');
const url = require('url');
const path = require('path');
var cmd = require('node-cmd');
var fs = require('fs');

const mp3LocationData = './data/mp3data.txt';
const mp4LocationData = './data/mp4data.txt';
const channelLocationData = './data/channeldata.txt';
var locamp3;
var locamp4;
var locachannel;

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron;

let mainWindow;

// ready
app.on('ready', function() {
  // Create new main window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  //Load html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file',
    slashes: true
  }));
  //quit app full
  mainWindow.on('closed', function() {
    app.quit();
  });

  //adds temp
  const mainMenu = Menu.buildFromTemplate(mainWindowTemplate);

  Menu.setApplicationMenu(mainMenu);
});

//Gets location data from text file
//mp3
var locamp3 = fs.readFileSync(mp3LocationData, 'utf8');
console.log('MP3 file location set to ' + locamp3);
//mp4
var locamp4 = fs.readFileSync(mp4LocationData, 'utf8');
console.log('MP4 file location set to ' + locamp4);
//channel
var locachannel = fs.readFileSync(channelLocationData, 'utf8');
console.log('Channel file location set to ' + locachannel);

//If location is updated on settings page its saved to text file
//mp3
ipcMain.on('item:mp3loca', function(e, item) {
  fs.writeFile(mp3LocationData, item + '/%(title)s.%(ext)s ', (err) => {
    console.log('MP3 location updated ' + item);
  });
});
//mp4
ipcMain.on('item:mp4loca', function(e, item) {
  fs.writeFile(mp4LocationData, item + '/%(title)s.%(ext)s ', (err) => {
    console.log('MP4 location updated ' + item);
  });
});
//channel
ipcMain.on('item:chanlocanew', function(e, item) {
  fs.writeFile(channelLocationData, item + '/%(uploader)s/%(title)s.%(ext)s ', (err) => {
    console.log('Channel location updated ' + item);
  });
});

//Gets URL, gets location data from text file, runs youtube-dl program
//mp3
ipcMain.on('item:mp3', function(e, item) {
  var locamp3 = fs.readFileSync(mp3LocationData, 'utf8');
  cmd.run('start cmd /c youtube-dl --config-location ./data/youtube-conf-mp4.conf -f bestaudio --extract-audio --audio-format mp3 --audio-quality 192K -o ' + locamp3 + item);
});
//mp4
ipcMain.on('item:mp4', function(e, item) {
  var locamp4 = fs.readFileSync(mp4LocationData, 'utf8');
  cmd.run('start cmd /c youtube-dl --config-location ./data/youtube-conf-mp4.conf -o ' + locamp4 + item);
});
//channel
ipcMain.on('item:channel', function(e, item) {
  var locachannel = fs.readFileSync(channelLocationData, 'utf8');
  cmd.run('start cmd /c youtube-dl --config-location ./data/youtube-conf-channels.conf -o ' + locachannel + item);
});

//menu temp
const mainWindowTemplate = [{
  label: 'Settings',
  submenu: [{
    label: 'Quit',
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }]
}];

//mac support
if (process.platform == "darwin") {
  mainMenuTemp.unshift({});
}

//dev tool
if (process.env.NODE_ENV !== 'production') {
  mainWindowTemplate.push({
    label: "Dev Tools",
    submenu: [{
        label: 'Toggle Devtools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
