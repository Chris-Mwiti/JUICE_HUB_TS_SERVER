import CustomError from "../../helpers/customError";

//For implemantation one needs to provide the data object to be checked
//and the entries of the data type.
//In order to get the entries of the data type you can create a mock data object containing default values.

function typeValidator(dataObject:any,entries:any[][]){
   return entries.every(([key,value]) => {
        if(key in dataObject || value == undefined){
            if(typeof value !== dataObject[key]) throw new CustomError({
                message: "The following inputed value is not acceptable: " + value,
                code: "400"
            })
            return true;
        }else {
            throw new CustomError({
                message: "The following key is missing " + key,
                code:"400"
            })
        }
   })
}

export default typeValidator;