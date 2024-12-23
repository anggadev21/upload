import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errAuthorize } from "./config/payload_config";
import { checkValidToken } from "./utils";
import {
	routes,
	auth_routes,
	user_routes,
	file_routes,
	employee_routes
} from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Without Bearer
routes(app);

app.use(async (req: any, res: any, next: any) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] == "Bearer"
	) {
		var setBearer = req.headers.authorization.split(" ")[1];
		if (!setBearer) {
			return errAuthorize("UnAuthorized Permission Denied", res.status(500));
		} else {
			const valid_token = await checkValidToken(setBearer);
			if (valid_token) {
				next();
			} else {
				return errAuthorize("UnAuthorized Permission Denied", res.status(500));
			}
		}
	} else {
		return errAuthorize("UnAuthorized Permission Denied", res.status(500));
	}
});

//WithBearer
auth_routes(app);
user_routes(app);
file_routes(app);
employee_routes(app);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
