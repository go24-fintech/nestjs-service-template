
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { Example } from '../entities/example';
import { ExampleQueries } from '../queries/example.queries';
import { ExampleRepository } from '../repositories/example.repositories';

export class UpdateCommand extends BaseCommand<Example> {
    @Allow()
    code: string;
    @Allow()
    @Type(() => Example)
    public data: Example;

    constructor(data: Example) {
        super();
        this.data = data;
    }
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, Example> {
    constructor(
        private exampleRepository: ExampleRepository,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<Example> {

        let example = await this.exampleQueries.findOne({ where: { code: command.data.code } })

        if (!example) {
            throw new BusinessException('Dữ liệu không tồn tại');
        }
        example.name = command.data.name;
        return await this.exampleRepository.save(example);
    }
}
