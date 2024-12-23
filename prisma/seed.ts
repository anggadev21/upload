const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const user = prisma.user;
const employee = prisma.employee;

const load = async () => {
	await employee.create({
		data: {
			id: "2b9d6bcs-bbfd-4b2d-9b5d-abcdefghijklwp",
			name: "Admin",
			nik: "01",
			divisi: "Admin",
			position: "Admin",
		},
	});
	await user.create({
		data: {
			id: "1b9d6bcs-bbfd-4b2d-9b5d-abcdefghijklwp",
			employee_id: "2b9d6bcs-bbfd-4b2d-9b5d-abcdefghijklwp",
			username: "admin",
			email: "",
			role: "Admin",
			password: "$2a$10$rMQNu4Nks2yAeaa.LMCMIOcPkYk9h.v3hy8SeSnb1GZuK9JymzwK6",
		},
	});
};

load();
