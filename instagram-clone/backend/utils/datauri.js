import datauriParser from "datauri/parser.js";
import path from 'path';

const parser = new datauriParser();

const getdatauri = (file)=>{
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName , file.buffer).content;

};

export default getdatauri;
