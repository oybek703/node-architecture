import {getKeyValue} from './saveKeyValue.service.js'
import {printError} from './log.service.js'
import axios from 'axios'

export async function getWeather() {
  const token = process.env.TOKEN ?? await getKeyValue('token')
  const city = process.env.CITY ?? await getKeyValue('city')
  if (!token) {
    return printError('API key is not set! Set it via -t [API_KEY] command.')
  }
  if (!city) {
    return printError('City is not set! Set it via -s [CITY] command.')
  }
  try {
    const {data} = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: city,
            appid: token,
            lang: 'en',
            units: 'metric'
          }
        })
    return data
  } catch (e) {
    const {response = {}} = e
    const {data = {}} = response
    const {message = e.message} = data
    printError(message)
  }
}
