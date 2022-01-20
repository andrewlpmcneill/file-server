const IP = '127.0.0.1';
const PORT = '9876';
const DIRECTORY = './example_files/';
const LSFILES = [];
const HELP = "Enter 'ls' to view the contents of the directory.\nEnter 'pwd' to print the current directory's filepath.\nEnter 'cp [serverFile] [pathToWriteFile]' to copy the specified file to your local system.\n";

module.exports = {
  IP,
  PORT,
  DIRECTORY,
  LSFILES,
  HELP,
};