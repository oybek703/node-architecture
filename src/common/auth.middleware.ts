import { IMiddleware } from './middleware.interface'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next()
				} else if (payload) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					req.user = payload.email
					next()
				}
			})
		} else {
			next()
		}
	}
}
