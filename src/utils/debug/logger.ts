import * as moment from 'moment'

export const log = (message: string, level?: string, requestId?: string) => {
  console.log(`[Go24] [${moment().format('YYYY-MM-DD HH:mm:ss,SSS')}]-[${(
      level ?? 'info'
    ).toUpperCase()}] [${requestId ?? 'Unknown'}] ${message.replace(/\n/g, ' => ')}`
  )
}
