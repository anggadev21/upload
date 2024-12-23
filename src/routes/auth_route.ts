import { logout } from "../controllers";

const auth_routes = (app: any) => {
	const route_api = '/api/v1';

	//auth
	app.post(`${route_api}/logout`, logout);
};

export { auth_routes };
