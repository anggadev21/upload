import { PrismaClient } from "@prisma/client";
import { checkPassword, createToken, createUuid } from "../utils";
const prisma = new PrismaClient();
const user = prisma.user;
const session = prisma.session;

const login_user = async (data: any) => {
	try {
		const data_user = await user.findFirst({
			where: {
				username: data?.username,
				NOT: {
					deleted_at: { not: null },
				},
			},
			include: {
				employee: true
			}
		});
		if (data_user) {
			let passwordDb = data_user?.password || "";
			const check_password = await checkPassword(data?.password, passwordDb);
			if (check_password) {
				let data_token = createToken({
					user_id: data_user?.id,
					role: data_user?.role,
                    name: data_user?.employee?.name
				});
				await session.upsert({
					where: {
						user_id: data_user.id
					},
					update: {
						access_token: data_token,
					},
					create: {
						id: createUuid(),
						user_id: data_user.id,
						access_token: data_token,
					},
				});
				return {
					data: {
						id: data_user?.id,
						token: data_token,
						name: data_user?.employee?.name,
						role: data_user?.role
					},
				};
			} else {
				return { message: "EG01" };
			}
		} else {
			return { message: "EG01" };
		}
	} catch (e: any) {
		console.log(e);
		return { message: "EG01" };
	}
};

const logout_user = async (token: string) => {
	try {
		const data_session = await session.findFirst({
			where: {
				access_token: token.split(" ")[1]
			}
		})
		if(data_session){
			const remove_session = await session.delete({
				where: {
					id: data_session?.id
				}
			})
			if(remove_session){
				return { data: {message: "Logout Success"} }
			}else{
				return { message: "EG02"} 
			}
		}else{
			return { message: "EG02" };
		}
	} catch (e: any) {
		console.log(e);
		return { message: "EG02" };
	}
};

const getSessionByUser = async (user_id: string) => {
	try {
		const data_session = await session.findFirst({
			where: {
				user_id: user_id
			}
		})
		return data_session
	} catch (e: any) {
		
	}
}

export { login_user, logout_user, getSessionByUser };
