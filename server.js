const net = require('net');
const fs = require('fs');
const { PORT, DIRECTORY, LSFILES, HELP, } = require('./constants');

const server = net.createServer();
server.on('connection', (client) => {

  console.log('New client connected.');
  client.setEncoding('utf8'); // interpret data as text

  // 'ls' data callback
  client.on('data', (data) => {
    if (data === 'ls') {
      console.log('Directory list requested.');
      fs.readdir(DIRECTORY, (err, files) => {
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(file => {
          LSFILES.push(file);
        });
        client.write(JSON.stringify(LSFILES).replace('[', '').replace(']', '').replaceAll('"', '').replaceAll(',', '    '));
      });
    }
    LSFILES.length = 0;
  });

  // 'pwd' data callback
  client.on('data', (data) => {
    if (data === 'pwd') {
      console.log('Print working directory requested.');
      client.write(`/Server${DIRECTORY.slice(1)}`);
    }
  });

  // 'help' data callback
  client.on('data', (data) => {
    if (data === 'help') {
      console.log('Help requested.');
      client.write(HELP);
    }
  });

  // 'cp' data callback
  client.on('data', (data) => {
    if (data.slice(0,2) === 'cp') {
      console.log('Copy file requested.');
      const cpArgs = data.split(' ');
      const localPath = `./example_files/${cpArgs[1]}`;
      const remotePath = cpArgs[2];
      fs.readFile(localPath, 'utf8', (err, data) => {
        client.write(`%%${remotePath}%%${data}`);
      });
    }
    // If input is not a recognized command:
    if (data !== 'ls' && data !== 'pwd' && data !== 'help' && data.slice(0,2) !== 'cp') {
      client.write("For a list of commands, enter 'help'.");
    }
  });

  
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});