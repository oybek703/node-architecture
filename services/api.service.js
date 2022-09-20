import {getKeyValue} from './saveKeyValue.service.js'
import {get} from 'https'

export async function getWeather(city) {
  const token = await getKeyValue('token')
  if (!token) throw new Error('API key is not set! Set it via -t [API_KEY] command.')
  const url = new URL('https://api.openweathermap.org/data/2.5/weather')
  url.searchParams.append('q', city)
  url.searchParams.append('appid', token)
  url.searchParams.append('lang', 'en')
  url.searchParams.append('units', 'metric')

  get(url, response => {
    let res = ''
    response.on('data', chunk => {
      res += chunk
    })
    response.on('end', function() {
      console.log(res)
    })
  })
}
