import { IMiddleware } from './middleware.interface'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { HttpError } from '../errors/httpError'

export class AuthMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next()
		} else {
			next(new HttpError(403, 'Access denied!', 'AuthMiddleware'))
		}
	}
}
