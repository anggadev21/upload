"use client"

import { PrismaClient } from "@prisma/client";
import { createUuid } from "../utils";
const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 60000,
		timeout: 60000,
	},
});
const employee = prisma.employee;

const create_employee = async (data: any) => {
	try {
		const res = await prisma.$transaction(async (tx: any) => {
			const data_employee = await tx.employee.create({
				data: {
					id: createUuid(),
					name: data?.name,
					nik: data?.nik,
					divisi: data?.divisi,
					position: data?.position,
				},
			});
			return data_employee;
		});
		return res ? { data: res } : { message: "EG04" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG04" };
	}
};

const get_employee = async (page: any, perpage: any, search: string, isUser: boolean) => {
	try {
		const skip = page ? page * perpage : page;
		const data_employee = await employee.findMany({
			skip: skip,
			take: perpage,
			where: {
				AND: [
					{
						OR: [
							{
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
							},
							{
								nik: {
									contains: search,
									mode: "insensitive",
								},
							},
                            {
								divisi: {
									contains: search,
									mode: "insensitive",
								},
							},
                            {
								position: {
									contains: search,
									mode: "insensitive",
								},
							},
						],
						user: isUser ? null : undefined ,
						NOT: {
							deleted_at: { not: null },
						},
					},
				],
			},
            include: {
                user: true
            },
			orderBy: {
				name: "asc"
			}
		});
		const count_employee = await employee.count({
			where: {
				AND: [
					{
						OR: [
							{
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
							},
							{
								nik: {
									contains: search,
									mode: "insensitive",
								},
							},
                            {
								divisi: {
									contains: search,
									mode: "insensitive",
								},
							},
                            {
								position: {
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
		return data_employee
			? { data: data_employee, total_data: count_employee }
			: { message: "EG03" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const get_employee_by_id = async (id: string) => {
	try {
		const data_employee = await employee.findFirst({
			where: {
				id: id,
				NOT: {
					deleted_at: { not: null },
				},
			},
		});
		return data_employee ? { data: data_employee } : { message: "EG03" };
	} catch (e: any) {
		console.log(e);
		return { message: "EG03" };
	}
};

const update_employee = async (id: string, data: any) => {
	try {
		const res = await prisma.$transaction(async (tx: any) => {
			const data_employee = await tx.employee.update({
				where: {
					id: id,
				},
				data: {
					name: data?.name,
					nik: data?.nik,
					divisi: data?.divisi,
					position: data?.position,
				},
			});
			return data_employee;
		});
		return res ? { data: res } : { message: "EG05" };
	} catch (err: any) {
		console.log(err);
		return { message: "EG05" };
	}
};

const delete_employee = async (id: string) => {
	try {
		const data_employee = await employee.update({
			where: {
				id: id,
			},
			data: {
				deleted_at: new Date(),
			},
		});
		return { data: data_employee };
	} catch (e: any) {
		console.log(e);
		return { message: "EG06" };
	}
};

export {
	create_employee,
	get_employee,
	get_employee_by_id,
	update_employee,
	delete_employee,
};
