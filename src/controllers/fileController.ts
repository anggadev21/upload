import { success, err } from "../config/payload_config";
import { upload_file, get_file, get_file_by_id, update_file, delete_file } from "../libs";
import { decodeToken } from "../utils";

const uploadFile = async (req: any, res: any) => {
    let data_token: any = null;
	if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
		let token = req.headers.authorization.split(" ")[1];
		data_token = await decodeToken(token);
	}
    const result = await upload_file(req.body,req.file, data_token);
    result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

const getFile = async (req: any, res: any) => {
    let page: number | undefined = parseInt(req.query.page) - 1 || undefined;
	let perpage: number | undefined = parseInt(req.query.perpage) || undefined;
	let search: string = req.query.search;
	let data_token: any = null;
	if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
		let token = req.headers.authorization.split(" ")[1];
		data_token = await decodeToken(token);
	}
	const result = await get_file(page, perpage, search, data_token);
	result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

const getFileById = async (req: any, res: any) => {
	const result = await get_file_by_id(req.params.id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const updateFile = async (req: any, res: any) => {
	const result = await update_file(req.params.id, req.body, req.file);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const deleteFile = async (req: any, res: any) => {
	const result = await delete_file(req.params.id, req.params.file_id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

export { uploadFile, getFile, getFileById, updateFile, deleteFile }