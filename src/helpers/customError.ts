import { Response } from "express";

type ErrorCodes = "400" | "404" | "500"

interface ICustomError{
    message: string;
    code: ErrorCodes;
}

// Extends the Error object by adding a code property
class CustomError extends Error {
    public readonly code: ErrorCodes;
    constructor({message,code}: ICustomError){
        super(message);
        this.code = code;
        this.name = "Custom Error"
    }
}

export function checkErrProperties(res: Response, err: Error | CustomError | string | {}){

    //Checks if there is an
    if(err instanceof CustomError){
        res.send(err.code).json({err: err.message});
    }
    else if(err instanceof Error){
        res.send(500).json({err: err.message});
    }else{
        res.send(500).json({err: err});
    }
}

export default CustomError;