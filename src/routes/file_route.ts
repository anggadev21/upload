import { uploadFile, getFile, getFileById, updateFile, deleteFile } from "../controllers";
import multer from "multer";
const upload = multer({ dest: './public' });

const file_routes = (app: any) => {
	const route_api = '/api/v1';

	app.post(`${route_api}/file`, upload.single("file"), uploadFile);
    app.get(`${route_api}/file`, getFile);
    app.get(`${route_api}/file/:id`, getFileById);
    app.put(`${route_api}/file/:id`, upload.single("file"), updateFile);
    app.delete(`${route_api}/file/:id/:file_id`, deleteFile);
};

export { file_routes };
