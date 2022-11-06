import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { Example } from '../entities/example';
import { ExampleRepository } from '../repositories/example.repositories';

export class AddCommand extends BaseCommand<Example> {
    @Allow()
    @Type(() => Example)
    public data: Example;

    constructor(data: Example) {
        super();
        this.data = data;
    }
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, Example> {
    constructor(
        private exampleRepository: ExampleRepository
    ) {
        super();
    }

    public async apply(command: AddCommand): Promise<Example> {
        // TODO validation
        
        return await this.exampleRepository.save(command.data);
    }
}
