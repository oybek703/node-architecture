import { IUserService } from './usersService.interface'
import { UserRegisterDto } from './dto/userRegister.dto'
import { User } from './user.entity'
import { UserLoginDto } from './dto/userLogin.dto'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.interface'
import { IUsersRepository } from './usersRepository.interface'
import { UserModel } from '@prisma/client'

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name)
		const salt = Number(this.configService.get<string>('SALT'))
		await newUser.setPassword(password, salt)
		const existingUser = await this.usersRepository.find(email)
		if (existingUser) return null
		return this.usersRepository.create(newUser)
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existingUser = await this.usersRepository.find(email)
		if (!existingUser) return false
		const newUser = new User(existingUser.email, existingUser.name, existingUser.password)
		return newUser.comparePassword(password)
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email)
	}
}
