import { UserRegisterDto } from './dto/userRegister.dto'
import { UserLoginDto } from './dto/userLogin.dto'
import { UserModel } from '@prisma/client'

export interface IUserService {
	createUser(dto: UserRegisterDto): Promise<UserModel | null>
	validateUser(dto: UserLoginDto): Promise<boolean>
}
