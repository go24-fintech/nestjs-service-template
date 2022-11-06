
import { Nullable } from '@type/common.type';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { Example } from '../entities/example';
import { ExampleQueries } from '../queries/example.queries';
import { ExampleRepository } from '../repositories/example.repositories';

export class DeleteCommand extends BaseCommand<Example> {
    code: string
    constructor(code: string) {
        super()
        this.code = code;
    }
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, Nullable<Example>> {
    constructor(
        private exampleRepository: ExampleRepository,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }

    async apply(command: DeleteCommand) {
        let data = await this.exampleQueries.findOne({
           where: { code: command.code}
        });
        if (data && !data.isDeleted) {
            await this.exampleRepository.remove(data);
        }
        return data;
    }
}
