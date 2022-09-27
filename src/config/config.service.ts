import { IConfigService } from './config.interface'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config()
		if (result.error) {
			this.logger.error('[ConfigService] Cannot read file .env or file does not exist!')
		} else {
			this.logger.log('[ConfigService] .env configuration loaded.')
			this.config = result.parsed as DotenvParseOutput
		}
	}

	get<T extends string | number>(key: string): T {
		return this.config[key] as T
	}
}
