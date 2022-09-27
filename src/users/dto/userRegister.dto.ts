import { IsEmail, IsString } from 'class-validator'

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email!' })
	email: string

	@IsString({ message: 'Password is not valid!' })
	password: string

	@IsString({ message: 'Username is invalid!' })
	name: string
}
