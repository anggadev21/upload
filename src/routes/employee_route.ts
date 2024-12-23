import { 	createEmployee,
	getEmployee,
	getEmployeeById,
	updateEmployee,
	deleteEmployee, } from "../controllers";
import { checkPermission } from "../middleware";

const employee_routes = (app: any) => {
	const route_api = '/api/v1';

	app.post(`${route_api}/employee`, checkPermission("Admin"), createEmployee);
    app.get(`${route_api}/employee`, checkPermission("Admin"), getEmployee);
    app.get(`${route_api}/employee/:id`, checkPermission("Admin"), getEmployeeById);
    app.put(`${route_api}/employee/:id`, checkPermission("Admin"), updateEmployee);
    app.delete(`${route_api}/employee/:id`, checkPermission("Admin"), deleteEmployee);
};

export { employee_routes };
