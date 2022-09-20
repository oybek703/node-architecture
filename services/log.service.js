import chalk from 'chalk'
import dedent from 'dedent-js'

export function printError(error) {
  console.log(`${chalk.bgRed.black(` ERROR `)} ${error}`)
}

export function printSuccess(message) {
  console.log(`${chalk.bgGreen.black(' SUCCESS ')} ${message}`)
}

export function printHelp() {
  console.log(
      dedent(
`${chalk.bgYellow.black(' HELP ')}
                 Without args  - log weather
                 -s [CITY] set city
                 -h log help
                 -t [API_KEY] save token
                `
      )
  )
}
