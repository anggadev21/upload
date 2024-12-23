import { success, err } from "../config/payload_config";
import { login_user, logout_user } from "../libs";

const login = async (req: any, res: any) => {
    const result = await login_user(req.body)
    result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

const logout = async (req: any, res: any) => {
	const result = await logout_user(req.headers.authorization);
	result.data ? success(result, 'Success', res) : err(result.message, req.originalUrl, 403, res)
};

export { login, logout }