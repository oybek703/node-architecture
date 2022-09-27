import 'reflect-metadata'
import { Container } from 'inversify'
import { IConfigService } from '../config/config.interface'
import { IUserService } from './usersService.interface'
import { IUsersRepository } from './usersRepository.interface'
import { TYPES } from '../types'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { UserModel } from '@prisma/client'

const ConfigServiceMock: IConfigService = {
	get: jest.fn()
}

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn()
}

const container = new Container()
let configService: IConfigService
let usersService: IUserService
let usersRepository: IUsersRepository

beforeAll(function () {
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock)
	container.bind<IUserService>(TYPES.UserService).to(UsersService)
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock)
	configService = container.get<IConfigService>(TYPES.ConfigService)
	usersService = container.get<IUserService>(TYPES.UserService)
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository)
})

let createdUser: UserModel | null

describe('User Service', function () {
	it('should create user', async function () {
		configService.get = jest.fn().mockReturnValueOnce('1')
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1
			})
		)
		createdUser = await usersService.createUser({
			email: 'john@gmail.com',
			name: 'John',
			password: '1'
		})
		expect(createdUser?.id).toEqual(1)
		expect(createdUser?.email).not.toEqual('1')
	})
	it('should return true with valid password', async function () {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
		if (createdUser) {
			const result = await usersService.validateUser({
				email: 'john@gmail.com',
				password: '1'
			})
			expect(result).toBeTruthy()
			expect(result).toEqual(true)
		}
	})
	it('should return false with invalid password', async function () {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
		if (createdUser) {
			const result = await usersService.validateUser({
				email: 'john@gmail.com',
				password: '2'
			})
			expect(result).toBeFalsy()
		}
	})
	it('should return false if user is null', async function () {
		usersRepository.find = jest.fn().mockReturnValueOnce(null)
		if (createdUser) {
			const result = await usersService.validateUser({
				email: 'john@gmail.com',
				password: '2'
			})
			expect(result).toBeFalsy()
		}
	})
})
