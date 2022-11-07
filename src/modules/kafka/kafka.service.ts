import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Kafka, Producer, ProducerBatch, Message, TopicMessages } from 'kafkajs'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common/services/logger.service'
import { KafkaLogger } from '@nestjs/microservices/helpers/kafka-logger'
import { log } from '@utils/debug/logger'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private producer: Producer

    constructor(private configService: ConfigService) {
        this.producer = this.createProducer()
    }


    public async sendBatch(topic: string, messages: Array<any>): Promise<void> {
        if (!this.producer) {
            log('There is no producer, unable to send message.', 'error')
            return
        }
        const kafkaMessages: Array<Message> = messages.map((message) => {
            return {
                value: JSON.stringify(message),
            }
        })

        const topicMessages: TopicMessages = {
            topic,
            messages: kafkaMessages,
        }

        const batch: ProducerBatch = {
            topicMessages: [topicMessages],
        }

        await this.producer.sendBatch(batch)
    }

    async onModuleInit(): Promise<void> {
        await this.connect()
    }

    async onModuleDestroy(): Promise<void> {
        await this.disconnect()
    }

    public async connect(): Promise<void> {
        await this.producer.connect()
    }

    public async disconnect(): Promise<void> {
        await this.producer.disconnect()
    }
    private createProducer(): Producer {
        const kafkaConfig = this.configService.get('kafka')
        const kafka = new Kafka({
            ...kafkaConfig,
            logCreator: KafkaLogger.bind(null, log),
        })

        return kafka.producer()
    }
}