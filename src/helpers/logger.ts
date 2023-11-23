import fs, {promises as fsPromises} from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import {format} from 'date-fns'
import { NextFunction, Request, Response } from 'express';

class LoggerHelper {
    public static async Logger(message: string, filename: string){
        // Constructs date format of when the request was made and the file item structure
        const dateTime = format(new Date(), "yyMMdd\tHH:mm:ss");
        const fileItem = `${dateTime}\t${randomUUID()}\t${message}`;

        try{
            await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), fileItem);
        }catch (UnknownError){
            console.error(UnknownError);
        }
    }

    public static RequestLogger(req:Request,res: Response,next: NextFunction){
        // @TODO: Research more on express requests and response objects

        LoggerHelper.Logger(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requests.txt');
        next();
    }

    public static ErrorLogger(error:Error,filename:string){
        LoggerHelper.Logger(`${error.name}\t${error.message}\n`, filename);
    }
}

export default LoggerHelper