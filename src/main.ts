import { LoggerService } from './logger/logger.service'
import { Container, ContainerModule } from 'inversify'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { IExceptionFilter } from './errors/exceptionFilter.interface'
import { ExceptionFilter } from './errors/exception.filter'
import { App } from './app'
import { IUserService } from './users/usersService.interface'
import { UsersService } from './users/users.service'
import { IUserController } from './users/usersContoller.interface'
import { UserController } from './users/users.controller'
import { IConfigService } from './config/config.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/database.service'
import { IUsersRepository } from './users/usersRepository.interface'
import { UsersRepository } from './users/users.repository'

interface IBootstrapReturn {
	appContainer: Container
	app: App
}

export const appBindings = new ContainerModule(function (bind) {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<IUserController>(TYPES.UserController).to(UserController)
	bind<IUserService>(TYPES.UserService).to(UsersService)
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope()
	bind<App>(TYPES.Application).to(App)
})

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	await app.init()
	return { app, appContainer }
}

export const boot = bootstrap()
