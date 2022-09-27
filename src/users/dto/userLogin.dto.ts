import { IsEmail, IsString } from 'class-validator'

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid email!' })
	email: string

	@IsString({ message: 'Password is not valid!' })
	password: string
}
