import { LoggerService } from '../logger/logger.service'
import { NextFunction, Request, Response } from 'express'
import { IExceptionFilter } from './exceptionFilter.interface'
import { HttpError } from './httpError'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ERROR ${err.statusCode}: ${err.message}`)
			res.status(err.statusCode).send({ err: err.message })
		} else {
			this.logger.error(err.message)
			res.status(500).send({ err: err.message })
		}
	}
}
