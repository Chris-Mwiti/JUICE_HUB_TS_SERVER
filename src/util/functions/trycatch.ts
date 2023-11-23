const trycatchHelper = async <DataType>(func: Function) => {
    let data = null;
    let error = null;
    try {
        const result: DataType = await func();
        data = result;
    }catch(UnknownError){
        console.error(UnknownError);
        error = UnknownError
    }

    return {data, error}
}

export default trycatchHelper;