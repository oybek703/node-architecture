#!usr/bin/env node


import {getArgs} from './helpers/args.js'
import {printError, printHelp, printSuccess} from './services/log.service.js'

function initCLI() {
  const args = getArgs(process.argv)
  if (args.h) {
    printHelp()
  }
  if (args.s) {
    printSuccess()
  }
}

initCLI()
