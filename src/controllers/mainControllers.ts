import { success } from "../config/payload_config";

const index = (req: any, res: any) => {
	success({ data: "API driveweb v1 Ready!" }, "OK", res);
};

const main = (req: any, res: any) => {
	success(
		{
			data: {
				version: "driveweb v1 || dev/1.0-preprod",
				requirements: "bearer authorization",
			},
		},
		"Connect to API",
		res
	);
};

export { index, main };
