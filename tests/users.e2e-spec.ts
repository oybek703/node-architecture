import { boot } from '../src/main'
import { App } from '../src/app'
import request from 'supertest'

let application: App

beforeAll(async function () {
	const { app } = await boot
	application = app
})

describe('Users e2e', function () {
	it('should not register if user already exists', async function () {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@gmail.com',
			password: '1'
		})
		expect(res.status).toBe(422)
	})
	it('should not sign if invalid password provided', async function () {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: '0'
		})
		expect(res.statusCode).toEqual(401)
		expect(res.body.err).toBeDefined()
	})
	it('should return jwt token with valid user credentials', async function () {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: 'test123456'
		})
		expect(res.statusCode).toEqual(200)
		expect(res.body.token).toBeDefined()
	})
	it('should return user info if request have valid token', async function () {
		const { body } = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: 'test123456'
		})
		const res = await request(application.app)
			.get('/users/info')
			.send()
			.set('Authorization', `Bearer ${body.token}`)
		expect(res.body.email).toEqual('test@gmail.com')
		expect(res.body.id).toEqual(1)
		expect(res.body.password).toBeUndefined()
		expect(res.statusCode).toEqual(200)
	})

	it('should return 403 if token is not provided', async function () {
		const res = await request(application.app).get('/users/info').send()
		expect(res.statusCode).toEqual(403)
		expect(res.body.err).toBeDefined()
		expect(res.body.err).toEqual('Access denied!')
	})
})

afterEach(function () {
	application.close()
})
