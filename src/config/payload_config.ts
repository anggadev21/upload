import err_code from "./err_code.json";

const success = function (payload: any, message: string, res: any) {
	const datas = {
		success: true,
		statusCode: res.statusCode,
		message,
		payload,
	};
	res.json(datas);
	res.end();
};

const err = function (error: any, uri: string, statusCode: number, res: any) {
	const index = err_code.findIndex((result: any) => result.code == error);
	const data = {
		statusCode: statusCode,
		error: {
			message: err_code[index].message,
			code: error,
			uri,
		},
	};
	res.json(data);
	res.end();
};

const errAuthorize = function (values:any, res: any) {
	var data = {
		error: { message: values },
	};
	res.json(data);
	res.end();
};

export { success, err, errAuthorize }