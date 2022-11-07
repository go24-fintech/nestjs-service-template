import {log} from './logger'

export function withTime(key: string, func: Function) {
  return async function (...args): Promise<any> {
    const begin = new Date()
    try {
      return await func(...args)
    } finally {
      const endDate = new Date()
      log(`[${key}] ${Math.round(endDate.getTime() - begin.getTime())}ms`)
    }
  }
}
