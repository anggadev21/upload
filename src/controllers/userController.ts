import { success, err } from "../config/payload_config";
import { create_user, get_user, get_user_by_id, update_user, change_password_user, delete_user } from "../libs";

const createUser = async (req: any, res: any) => {
    const result = await create_user(req.body)
    result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

const getUser = async (req: any, res: any) => {
    let page: number | undefined = parseInt(req.query.page) - 1 || undefined;
	let perpage: number | undefined = parseInt(req.query.perpage) || undefined;
	let search: string = req.query.search;
	const result = await get_user(page, perpage, search);
	result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

const getUserById = async (req: any, res: any) => {
	const result = await get_user_by_id(req.params.id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const updateUser = async (req: any, res: any) => {
	const result = await update_user(req.params.id, req.body);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const changePassword = async (req: any, res: any) => {
	const result = await change_password_user(req.params.id, req.body);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const deleteUser = async (req: any, res: any) => {
	const result = await delete_user(req.params.id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

export { createUser, getUser, getUserById, updateUser, changePassword, deleteUser }