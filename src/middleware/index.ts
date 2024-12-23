import { decodeToken } from '../utils';

const checkPermission = (role: string) => {
    return (req: any, res: any, next:any) => {
        let isPermission = false;
        const dataToken = decodeToken(req.headers.authorization.split(" ")[1]);
        if(dataToken?.data?.role === role){
            isPermission = true
        }
        if(isPermission){
            next()
        }else{
            return res.status(403).json({ error: 'Access denied' });
        }
    }
}

export { checkPermission }