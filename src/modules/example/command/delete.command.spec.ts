import { Test } from '@nestjs/testing';
import { ExampleQueries } from '../queries/example.queries';
import { ExampleRepository } from '../repositories/example.repositories';
import { DeleteCommand, DeleteCommandHandler } from './delete.command';


describe('Example delete command test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let handler: DeleteCommandHandler;

    const exampleRepository = {
        save: jest.fn(),
    };

    const exampleQueries = {
        findOne: jest.fn()
    }

    const exampleRepositoryProvider = {
        provide: ExampleRepository,
        useFactory: () => exampleRepository,
    };

    const exampleQueriesProvider = {
        provide: ExampleQueries,
        useFactory: () => exampleQueries,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                exampleRepositoryProvider,
                exampleQueriesProvider,
                DeleteCommandHandler
            ],
        }).compile();

        handler = await moduleRef.resolve<DeleteCommandHandler>(DeleteCommandHandler);
    });

    test('Run apply successfully. Should run as expected', async () => {

        exampleQueries.findOne.mockResolvedValue({
            name: 'name'
        })
        const data = new DeleteCommand('123');

        await handler.apply(data);

        expect(exampleQueries.findOne).toBeCalledTimes(1);
        expect(exampleQueries.findOne).toBeCalledWith({ where: { code: data.code } });

        expect(exampleRepository.save).toBeCalledTimes(1);
        expect(exampleRepository.save).toBeCalledWith({
            name: 'name'
        });
    });

    test('Run apply successfully with data deleted. Should run as expected', async () => {

        exampleQueries.findOne.mockResolvedValue({
            name: 'name',
            isDeleted: true
        })
        const data = new DeleteCommand('123');

        await handler.apply(data);

        expect(exampleQueries.findOne).toBeCalledTimes(1);
        expect(exampleQueries.findOne).toBeCalledWith({ where: { code: data.code } });

        expect(exampleRepository.save).toBeCalledTimes(0);
    });
});
