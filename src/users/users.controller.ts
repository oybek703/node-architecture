import { BaseController } from '../common/base.controller'
import { LoggerService } from '../logger/logger.service'
import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../errors/httpError'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/userLogin.dto'
import { UserRegisterDto } from './dto/userRegister.dto'
import { IUserController } from './usersContoller.interface'
import { ValidateMiddleware } from '../common/validate.middleware'
import { sign } from 'jsonwebtoken'
import { IConfigService } from '../config/config.interface'
import { AuthMiddleware } from '../common/auth.guard'
import { UsersService } from './users.service'

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.UserService) private userService: UsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super(loggerService)
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)]
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)]
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthMiddleware()]
			}
		])
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.validateUser(body)
		if (!result) return next(new HttpError(401, 'Authorization error!', 'login'))
		const token = await this.signJWT(body.email, this.configService.get('SECRET'))
		this.ok(res, { token })
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.createUser(body)
		if (!result) return next(new HttpError(422, 'User already exists!', 'UserController'))
		this.ok(res, { email: result.email, name: result.name, id: result.id, _password: undefined })
	}

	async info({ user }: Request<{}, {}, UserRegisterDto>, res: Response): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user)
		this.ok(res, { email: userInfo?.email, id: userInfo?.id })
	}

	private async signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now())
				},
				secret,
				{
					algorithm: 'HS256'
				},
				(error, token) => {
					if (error) reject(error)
					resolve(token as string)
				}
			)
		})
	}
}
