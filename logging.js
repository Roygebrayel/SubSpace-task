import winston from "winston";


const combineLoggingFile = 'logs/combine.log';
const errorLoggingFile = 'logs/error.log';



const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);





//  winston Logger
export const Logger = winston.createLogger({
    level: 'silly', 
    format: logFormat,

    transports: [

        new winston.transports.Console(),
        new winston.transports.File({ filename: errorLoggingFile , level : 'error'}),
        new winston.transports.File({ filename: combineLoggingFile})
    ],
});



