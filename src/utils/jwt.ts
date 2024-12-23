import { sign, decode} from "jsonwebtoken";
import { getSessionByUser } from "../libs";
const secret = process.env.SECRET_KEY || "secret"

const createToken = (data: any) => {
	const token = sign({ data }, secret);
	return token;
};

const decodeToken = (token: string) => {
	const data_token: any = decode(token);
	return data_token;
};

const checkValidToken = async (token: string) => {
	const data_token: any = decode(token);
	const session = await getSessionByUser(data_token?.data?.user_id);
	return session ? true : false;
};

export { createToken, decodeToken, checkValidToken }
