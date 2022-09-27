import { IUsersRepository } from './usersRepository.interface'
import { User } from './user.entity'
import { UserModel } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { PrismaService } from '../database/database.service'

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	create({ email, name, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password
			}
		})
	}

	find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email
			}
		})
	}
}
