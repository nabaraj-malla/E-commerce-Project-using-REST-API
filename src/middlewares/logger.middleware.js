import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "winston_logs.txt" })],
});

const loggerMiddleware = (req, res, next) => {
  if (req.url.includes("signin")) {
    return next();
  }
  const logData = `${new Date()} \n${req.url} - req.body - ${JSON.stringify(
    req.body
  )}  \nreq.query - ${JSON.stringify(req.query)} `;
  logger.info(logData);
  next();
};

export default loggerMiddleware;

// import fs from "fs";

// const fsPromise = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} - ${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (error) {
//     console.log(error);
//   }
// }

// const loggerMiddleware = async (req, res, next) => {
//   // 1. Log request body
//   if (req.url.includes("signin")) {
//     return next();
//   }
//   const logData = `${req.url} - req.body - ${JSON.stringify(
//     req.body
//   )} \n  req.query - ${JSON.stringify(req.query)} `;
//   await log(logData);
//   next();
// };

// export default loggerMiddleware;
