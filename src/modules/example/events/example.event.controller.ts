import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { log } from '@utils/debug/logger'

@Controller()
export class ExampleEventController {
  constructor() {
  }

  @EventPattern('example.topic')
  async consume( message: string): Promise<void> {
    try {
      // TODO implement
    } finally {
      log(`[event.example.topic] Receive message with message: ${JSON.stringify(message)}`)
    }
  }
}
