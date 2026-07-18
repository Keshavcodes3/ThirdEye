import { Types } from "mongoose"
import type { IUser } from "./auth.types.js"
import userModel from "./auth.model.js"
import { ApiError } from "../../utils/ApiError.js"

class AuthRepository {

  //?create user
  async createUser(payload: Partial<IUser>) {
    const user = await userModel.create(payload)
    return user
  }

  //?find By Email
  async findUserByEmail(email: string) {
    const user = await userModel.findOne({ email: email }).select('+password')
    if (!user) return null
    return user
  }

  //find by id
  async findById(userId: Types.ObjectId) {
    const user = await userModel.findById(userId)
    if (!user) throw new ApiError(404, "User Not found")
    return user
  }

  //do user exists
  async userExist(userId: Types.ObjectId) {
    const user= await userModel.findById(userId)
    if(user) return true
    return false
  }


}


const authRepository = new AuthRepository()
export default authRepository