import { success, err } from "../config/payload_config";
import {
	create_employee,
	get_employee,
	get_employee_by_id,
	update_employee,
	delete_employee,
} from "../libs";

const createEmployee = async (req: any, res: any) => {
	const result = await create_employee(req.body);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const getEmployee = async (req: any, res: any) => {
	let page: number | undefined = parseInt(req.query.page) - 1 || undefined;
	let perpage: number | undefined = parseInt(req.query.perpage) || undefined;
	let search: string = req.query.search;
	let isUser: any = req.query.isUser === "true" ? true : false;
	const result = await get_employee(page, perpage, search, isUser);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const getEmployeeById = async (req: any, res: any) => {
	const result = await get_employee_by_id(req.params.id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const updateEmployee = async (req: any, res: any) => {
	const result = await update_employee(req.params.id, req.body);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

const deleteEmployee = async (req: any, res: any) => {
	const result = await delete_employee(req.params.id);
	result.data
		? success(result, "Success", res)
		: err(result.message, req.originalUrl, 403, res);
};

export {
	createEmployee,
	getEmployee,
	getEmployeeById,
	updateEmployee,
	deleteEmployee,
};
