import { createUser, getUser, getUserById, updateUser, changePassword, deleteUser } from "../controllers";
import { checkPermission } from "../middleware";

const user_routes = (app: any) => {
	const route_api = '/api/v1';

	app.post(`${route_api}/user`, checkPermission("Admin"), createUser);
    app.get(`${route_api}/user`, getUser);
    app.get(`${route_api}/user/:id`, getUserById);
    app.put(`${route_api}/user/:id`, updateUser);
    app.put(`${route_api}/user/password`, changePassword);
    app.delete(`${route_api}/user/:id`, checkPermission("Admin"), deleteUser);
};

export { user_routes };
