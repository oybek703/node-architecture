#!usr/bin/env node


import {getArgs} from './helpers/args.js'
import {printError, printHelp, printSuccess} from './services/log.service.js'
import {saveKeyValue} from './services/saveKeyValue.service.js'
import {getWeather} from './services/api.service.js'

async function saveToken(token) {
  try {
    await saveKeyValue('token', token)
    printSuccess('Token saved!')
  } catch (e) {
    printError(e.message)
  }
}

async function initCLI() {
  const args = getArgs(process.argv)
  if (args.h) {
    printHelp()
  }
  if (args.s) {
    printSuccess()
  }
  if (args.t) {
    await saveToken(args.t)
  }
  console.log(await getWeather('tashkent'))
}

(async () => {
  await initCLI()
})()
