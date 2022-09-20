#!/usr/bin/env node


import {getArgs} from './helpers/args.js'
import {printError, printHelp, printSuccess, printWeather} from './services/log.service.js'
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

async function saveCity(city) {
  try {
    await saveKeyValue('city', city)
    printSuccess('City saved!')
  } catch (e) {
    printError(e.message)
  }
}

async function getForecast() {
  try {
    const weather = await getWeather()
    if (weather) printWeather(weather)
  } catch (e) {
    printError(e.message)
  }
}

async function initCLI() {
  const args = getArgs(process.argv)
  if (args.h) {
    return printHelp()
  }
  if (args.s) {
    return await saveCity(args.s)
  }
  if (args.t) {
    return await saveToken(args.t)
  }
  await getForecast()
}

(async () => {
  await initCLI()
})()
