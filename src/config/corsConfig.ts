import { CorsOptions } from "cors";

const whiteListedDomains:string[] = ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:5173'];

const corsOptions: CorsOptions = {
    origin: (origin, callback) =>{
        if(whiteListedDomains.includes(origin as string) || !origin) return callback(null, true);
        callback(new Error("You have no acces for the resources provided by this server"),false);
    },
    optionsSuccessStatus: 200,
    credentials: true
}

export default corsOptions