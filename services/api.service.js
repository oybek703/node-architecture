import {getKeyValue} from './saveKeyValue.service.js'
import {printError} from './log.service.js'
import axios from 'axios'

export async function getWeather(city) {
  const token = await getKeyValue('token')
  if (!token) throw new Error('API key is not set! Set it via -t [API_KEY] command.')
  try {
    const {data} = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
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
    const {message = 'CLI error!'} = data
    printError(message)
  }
}
