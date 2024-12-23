import { PrismaClient } from "@prisma/client";
import { createUuid, uploadFile, deleteFile } from "../utils";
import { get_user_by_role } from "./user";
const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 60000,
		timeout: 60000,
	},
});
const file = prisma.file;
const file_visible = prisma.file_visible;

const upload_file = async (data: any, file: any, token: any) => {
	const upload = await uploadFile(file);
	try {
		if (upload) {
			const res = await prisma.$transaction(async (tx: any) => {
				const data_file = await tx.file.create({
					data: {
						id: createUuid(),
						url: `https://drive.google.com/file/d/${upload}/view`,
						url_preview: `https://drive.google.com/file/d/${upload}/preview`,
						file_id: upload,
						name: file?.originalname,
						size: file?.size,
						type: file?.mimetype,
						user_id: token?.data?.user_id,
					},
				});
				if (data_file) {
					let data_user_visible: any = [];
					let user_admin: any = await get_user_by_role("Admin");
					user_admin?.map((res: any) => {
						data_user_visible.push({
							id: createUuid(),
							user_id: res?.id,
							file_id: data_file?.id,
						});
					});
					JSON.parse(data?.user).map((res: any) => {
						data_user_visible.push({
							id: createUuid(),
							user_id: res.user_id,
							file_id: data_file?.id,
						});
					});

					await tx.file_visible.createMany({
						data: data_user_visible,
					});

					return data_file;
				} else {
					deleteFile(upload);
					return { message: "EG04" };
				}
			});
			return res ? { data: res } : { message: "EG04" };
		} else {
			deleteFile(upload);
			return { message: "EG04" };
		}
	} catch (e: any) {
		console.log(e);
		deleteFile(upload);
		return { message: "EG04" };
	}
};

const get_file = async (
	page: any,
	perpage: any,
	search: string,
	token: any
) => {
	try {
		const skip = page ? page * perpage : page;
		const data_file = await file_visible.findMany({
			skip: skip,
			take: perpage,
			where: {
				AND: [
					{
						OR: [
							{
								file: {
									name: {
										contains: search,
										mode: "insensitive",
									},
								},
							},
							{
								file: {
									created_by: {
										employee : {
											name: {
												contains: search,
												mode: "insensitive",
											}
										}
									}
								}
							},
						],
						user_id: token?.data?.user_id,
						NOT: {
							deleted_at: { not: null },
						},
					},
				],
			},
			orderBy: {
				created_at: "desc"
			},
			include: {
				file: {
					include: {
						created_by: {
							include: {
								employee: true
							}
						},
						file_visible: {
							include: {
								user: {
									include: {
										employee: true
									}
								},
							}
						}
					}
				},
				user: true,
			},
		});

		const count_file = await file_visible.count({
			where: {
				AND: [
					{
						OR: [
							{
								file: {
									name: {
										contains: search,
										mode: "insensitive",
									},
								},
							},
							{
								file: {
									created_by: {
										employee : {
											name: {
												contains: search,
												mode: "insensitive",
											}
										}
									}
								}
							},
						],
						user_id: token?.data?.user_id,
						NOT: {
							deleted_at: { not: null },
						},
					},
				],
			},
		});
		return data_file
			? { data: data_file, total_data: count_file }
			: { message: "EG03" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const get_file_by_id = async (id: string) => {
	try {
		const data_user = await file.findFirst({
			where: {
				id: id,
				NOT: {
					deleted_at: { not: null },
				},
			},
			include: {
				created_by: true,
				file_visible: {
					include: {
						user: true,
					},
				},
			},
		});
		return data_user ? { data: data_user } : { message: "EG03" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const update_file = async (id: string, data: any, file: any) => {
	try {
		let upload: any = null;
		if (file) {
			upload = await uploadFile(file);
		}
		const res = await prisma.$transaction(async (tx: any) => {
			let data_user_visible: any = [];
			let user_admin: any = await get_user_by_role("Admin");

			user_admin?.map((res: any) => {
				data_user_visible.push({
					id: createUuid(),
					user_id: res.id,
					file_id: id,
				});
			});

			data?.map((res: any) => {
				data_user_visible.push({
					id: createUuid(),
					user_id: res.user_id,
					file_id: id,
				});
			});

			await tx.file_visible.deleteMany({
				where: {
					file_id: id,
				},
			});

			const data_file = await tx.file_visible.createMany({
				data: data_user_visible,
			});
			if(data_file){
				return data_file;
			}else{
				return false;
			}
		});
		return res ? { data: res } : { message: "EG05" };
	} catch (err: any) {
		console.log(err);
		return { message: "EG05" };
	}
};

const delete_file = async (id: string, file_id: string) => {
	try {
        const res = await prisma.$transaction(async (tx: any) => {
			const delete_file = await tx.file.delete({
				where: {
					id: id
				},
				include: {
					file_visible: true
				}
			});
			if (delete_file) {
                deleteFile(file_id);
				return delete_file;
			} else {
				return { message: "EG06" };
			}
		});
		return res ? { data: res } : { message: "EG06" };
	} catch (e) {
        console.log(e);
		return { message: "EG06" };
    }
};

export { upload_file, get_file, get_file_by_id, update_file, delete_file };
