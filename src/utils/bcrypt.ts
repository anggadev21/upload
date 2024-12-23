import { hash, compare } from "bcrypt";
const saltRounds = 10;

const hasPassword = async (password: string) => {
    const hased = await hash(password, saltRounds);
    return hased
}

const checkPassword = async (password: string, passwordDb: string) => {
    const password_valid = await compare(password, passwordDb);
    return password_valid;
}

export { hasPassword, checkPassword }