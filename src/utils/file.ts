import { google } from "googleapis";
import path from "path";
import { createReadStream, unlink } from "fs";
const KEY_FILE_PATH = path.join("service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const Folder = process.env["FOLDER_ID"] || "";

const auth = new google.auth.GoogleAuth({
	keyFile: KEY_FILE_PATH,
	scopes: SCOPES,
});

const uploadFile = async (file: any) => {
	try {
		const { data } = await google
			.drive({ version: "v3", auth: auth })
			.files.create({
				media: {
					mimeType: file.mimeType,
					body: createReadStream(file.path),
				},
				requestBody: {
					name: file.originalname,
					parents: [Folder],
				},
			});
		unlink(file.path, (err: any) => {
			if(err) throw err;
		});
		return data?.id;
	} catch (error) {
		console.log(error)
		return false;
	}
};

const deleteFile = async (id: any) => {
	try {
		const data = await google.drive({ version: "v3", auth: auth }).files.delete({fileId: id});
		return data;
	} catch (error) {
		console.log(error)
		return false
	}
}

export { uploadFile, deleteFile };
