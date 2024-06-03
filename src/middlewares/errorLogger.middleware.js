import fs from "fs";

const fsPromise = fs.promises;

async function logError(reqURL, errorData) {
  try {
    const err = `\nreqURL: ${reqURL} - error: ${errorData.message}`;
    await fsPromise.appendFile("errors.txt", err);
  } catch (error) {
    console.log(error);
  }
}

export default logError;
