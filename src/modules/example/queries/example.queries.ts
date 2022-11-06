import { Injectable, Scope } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseMongoRepository } from 'be-core';
import { EntityManager, Repository } from 'typeorm';
import { Example } from '../entities/example';

@Injectable({ scope: Scope.DEFAULT })
export class ExampleQueries extends BaseMongoRepository<Example> {
    constructor(
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(Example)
        readonly repository: Repository<Example>
    ) {
        super(entityManager, Example);
    }
}
