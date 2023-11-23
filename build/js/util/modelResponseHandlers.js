"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    constructor(res, data) {
        this.res = res;
        this.data = data;
        this.res = res;
        this.data = data;
    }
    postResponse() {
        if (this.data === null)
            return this.res.status(500).json({ err: "The post request was not succesfull" });
        return this.res.status(201).json({ msg: "Success", data: this.data });
    }
    getResponse() {
        if (this.data === null)
            return this.res.status(404).json({ err: `The following data id does not exist: ${this.data}` });
        return this.res.status(200).json({ msg: "Success", data: this.data });
    }
    updateResponse() {
        if (this.data === null)
            return this.res.status(500).json({ err: "An error occured during the update process..." });
        return this.res.status(200).json({ msg: "Success", data: this.data });
    }
    deleteResponse() {
        if (this.data === null)
            return this.res.status(500).json({ err: "An error occured during the deletion process..." });
        return this.res.status(200).json({ msg: "Success", data: this.data });
    }
}
exports.default = ResponseHandler;
