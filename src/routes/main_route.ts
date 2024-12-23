import { index, main, login } from "../controllers";

const routes = (app: any) => {
	const route_api = '/api/v1';

	app.get("/", index);
	app.get(`${route_api}`, main);
	app.post(`${route_api}/login`, login);
};

export { routes };
