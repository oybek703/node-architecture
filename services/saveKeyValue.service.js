import {homedir} from 'os'
import {join} from 'path'
import {writeFile, stat, readFile} from 'fs/promises'

const filePath = join(homedir(), 'weather-data.json')

export async function saveKeyValue(key, value) {
  let data = {}
  if (await isFileExists(filePath)) {
    data = JSON.parse(await readFile(filePath, 'utf-8'))
  }
  data[key] = value
  await writeFile(filePath, JSON.stringify(data))
}

export async function getKeyValue(key) {
  if (await isFileExists(filePath)) {
    return JSON.parse(await readFile(filePath, 'utf-8'))[key]
  }
  return undefined
}

async function isFileExists(path) {
  try {
    await stat(path)
    return true
  } catch (e) {
    return false
  }
}
