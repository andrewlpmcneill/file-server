const net = require('net');
const fs = require('fs');
const readline = require('readline');
const { IP, PORT } = require('./constants');

const rl = readline.createInterface({
  input: process.stdin
});

const conn = net.createConnection({
  host: IP, // change to IP address of computer or ngrok host if tunneling
  port: PORT // or change to the ngrok port if tunneling
});

conn.setEncoding('utf8'); // interpret data as text

conn.on('data', (data) => {
  // For regular messages:
  if (data.slice(0,2) !== '%%' || data.slice(0,1) !== '%') console.log(data);
  // When the client wants to copy a file from the server, we need special logic to occur:
  if (data.slice(0,2) === '%%') {
    const dataArr = data.split('%%');
    const filePath = dataArr[1];
    const body = dataArr[2];
    fs.writeFile(filePath, body, err => {
      if (err) throw err;
      console.log(`Downloaded and saved ${body.length} bytes to ${filePath}.`);
    });
  }
});

conn.on('connect', () => {
  console.log(`Connected to a Node.js demo file-server written by Andrew McNeill.\nIP: ${IP}  PORT: ${PORT}\n`);
  conn.write('A client has connected.');
});

rl.on('line', (input) => {
  conn.write(`${input}`);
  // If input is for a copy command, we have special logic:
  if (input.slice(0,2) === 'cp') {
    console.log('Does this ever happen?');
    const cpArgs = input.split(' ');
    const path = cpArgs[2];
    fs.writeFile(path, '', err => {
      if (err) throw err;
    });
  }
  
});

conn.on("end", () => {
  console.log('You have been disconnected from the server');
  rl.close();
});