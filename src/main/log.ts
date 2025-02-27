import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[ NWAB ] [ ${level.toUpperCase()} ] ${new Date(
    timestamp as string
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  ).toLocaleString()} ${message}`;
});

export const log = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    new transports.Console({
      level: 'info',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  log.add(
    new transports.Console({
      level: 'debug',
    })
  );
}
