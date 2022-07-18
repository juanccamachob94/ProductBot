const { transports, format, createLogger } = require('winston');
module.exports = createLogger({
  format: format.combine(
    format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'ProductBot.log' })
  ]
});
