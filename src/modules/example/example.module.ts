import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CQRSModule, HttpModule } from 'be-core';
import { AddCommandHandler, DeleteCommandHandler, UpdateCommandHandler } from './command';
import { Example } from './entities/example';
import { ExampleController } from './example.controller';
import { ExampleQueries } from './queries/example.queries';
import { ExampleRepository } from './repositories/example.repositories';

const queries = [
    ExampleQueries
]
const repositories = [
    ExampleRepository
]
const entities = [
    Example
]
const commandHandlers = [
    AddCommandHandler,
    UpdateCommandHandler,
    DeleteCommandHandler,
]

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        CQRSModule,
        HttpModule.register({
            config: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        }),
    ],
    controllers: [ExampleController],
    providers: [
        ...queries,
        ...repositories,
        ...commandHandlers        
    ]
})
export class ExampleModule { }
