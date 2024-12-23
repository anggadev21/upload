import { PrismaClient } from "@prisma/client";
import { hasPassword, createUuid } from "../utils";
const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 60000,
		timeout: 60000,
	},
});
const user = prisma.user;

const create_user = async (data: any) => {
	try {
		const res = await prisma.$transaction(async (tx: any) => {
			let password = await hasPassword(data?.password);
			const data_user = await tx.user.create({
				data: {
					id: createUuid(),
					employee_id: data?.employee_id,
					username: data?.username,
					email: data?.email,
					password: password,
					role: data?.role,
				},
			});
			return data_user;
		});
		return res ? { data: res } : { message: "EG04" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG04" };
	}
};

const get_user = async (page: any, perpage: any, search: string) => {
	try {
		const skip = page ? page * perpage : page;
		const data_user = await user.findMany({
			skip: skip,
			take: perpage,
			where: {
				AND: [
					{
						OR: [
							{
								employee: {
									name: {
										contains: search,
										mode: "insensitive"
									}
								}
							},
							{
								email: {
									contains: search,
									mode: "insensitive",
								},
							},
						],
						NOT: {
							deleted_at: { not: null },
						},
					},
				],
			},
			include: {
				employee: true
			}
		});
		const count_user = await user.count({
			where: {
				AND: [
					{
						OR: [
							{
								employee: {
									name: {
										contains: search,
										mode: "insensitive"
									}
								}
							},
							{
								email: {
									contains: search,
									mode: "insensitive",
								},
							},
						],
						NOT: {
							deleted_at: { not: null },
						},
					},
				],
			},
		});
		return data_user
			? { data: data_user, total_data: count_user }
			: { message: "EG03" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const get_user_by_id = async (id: string) => {
    try {
        const data_user = await user.findFirst({
			where: {
				id: id,
				NOT: {
					deleted_at: { not: null },
				},
			},
			include: {
				employee: true
			}
		});
        return data_user ? { data: data_user } : { message: "EG03" }
    } catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const get_user_by_role = async (role: any) => {
    try {
        const data_user = await user.findMany({
			where: {
				role: role,
				NOT: {
					deleted_at: { not: null },
				},
			},
		});
        return data_user
    } catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const update_user = async (id: string, data: any) => {
    try {
        const res = await prisma.$transaction(async (tx: any) => {
            const data_user = await tx.user.update({
                where:{
                    id: id
                },
                data: {
                    username: data?.username,
					email: data?.email,
					role: data?.role,
                }
            });
            return data_user
        });
        return res ? { data: res } : { message: "EG05" }
    } catch (err: any) {
		console.log(err);
		return { message: "EG05" };
	}
};

const change_password_user = async (id: string, data: any) => {
    try {
        const res = await prisma.$transaction(async (tx: any) => {
            let password = await hasPassword(data?.password);
            const data_user = await tx.user.update({
                where:{
                    id: id
                },
                data: {
                    password: password
                }
            });
            return data_user
        });
        return res ? { data: res } : { message: "EG05" }
    } catch (err: any) {
		console.log(err);
		return { message: "EG05" };
	}
};

const delete_user = async (id: string) => {
    try {
        const data_user = await user.update({
			where: {
				id: id,
			},
			data: {
				deleted_at: new Date(),
			},
		});
		return { data: data_user };
    } catch (e: any) {
		console.log(e);
		return { message: "EG06" };
	}
};

export { create_user, get_user, get_user_by_id, get_user_by_role, update_user, change_password_user, delete_user };