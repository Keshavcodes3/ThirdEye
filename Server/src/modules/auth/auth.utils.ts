import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import { ENV } from '../../config/env.js';
class authUtils {
   
    hashPassword(password: string) {
        return bcrypt.hash(password, 10)
    }
    comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }

    setCookies(res: any,token:string) {
        
        res.cookie('token', token, { httpOnly: true });
    }
}


const authutils = new authUtils()

export default authutils    