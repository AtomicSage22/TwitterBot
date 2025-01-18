import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    format: format.combine(
      format.timestamp(),
      format.printf(({ level, message, timestamp }) => 
        `${timestamp} [${level.toUpperCase()}]: ${message}`
      )
    ),
    transports: [
      new transports.Console(),
      ...(process.env.NODE_ENV === 'production'
        ? [new transports.File({ filename: 'logs/errors.log', level: 'error' })]
        : []),
    ],
  });
  

export default logger;

