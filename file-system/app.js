const fs = require("fs/promises");
const { Buffer } = require("buffer");
(async () => {
  const CREATE_FILE = "create a file";
  const RENAME_FILE = "rename the file";
  const DELETE_FILE = "delete the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    let existingFileHandle;
    try {
      existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();
      return console.log(`The file ${path} already exist`);
    } catch (error) {
      const newFileHandle = await fs.open(path, "w");
      console.log(`A new file successfully created`);
      newFileHandle.close();
    }

    existingFileHandle.close();
  };

  const deleteFile = async (path) => {
    console.log(`Deleting ${path}...`);
  };

  const renameFile = (oldPath, newPath) => {
    console.log(`Rename ${oldPath} to ${newPath}`);
  };

  const addToFile = (path, content) => {
    console.log(`Adding to ${path}`);
    console.log();
  };
  //commands
  const commandFileHandler = await fs.open("./command.txt");
  commandFileHandler.on("change", async () => {
    const size = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(size);

    const offset = 0;

    const length = buff.byteLength;

    const position = 0;

    await commandFileHandler.read(buff, offset, length, position);
    // console.log(buff.toString("utf-8"));
    const command = buff.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }

    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      // console.log("The file was changed");

      commandFileHandler.emit("change");

      //   const content = await commandFileHandler.read(Buffer.alloc(size));
      //   console.log(content);
    }
  }
})();
