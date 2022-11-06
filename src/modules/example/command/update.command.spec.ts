import { Test } from '@nestjs/testing';
import { BusinessException } from 'be-core';
import { Example } from '../entities/example';
import { ExampleQueries } from '../queries/example.queries';
import { ExampleRepository } from '../repositories/example.repositories';
import { UpdateCommand, UpdateCommandHandler } from './update.command';


describe('Example update command test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let handler: UpdateCommandHandler;

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
                UpdateCommandHandler
            ],
        }).compile();

        handler = await moduleRef.resolve<UpdateCommandHandler>(UpdateCommandHandler);
    });

    test('Run apply successfully. Should run as expected', async () => {

        exampleQueries.findOne.mockResolvedValue({
            name: 'name'
        })
        const data = new UpdateCommand({
            name: 'name',
        } as Example);

        await handler.apply(data);

        expect(exampleQueries.findOne).toBeCalledTimes(1);
        expect(exampleQueries.findOne).toBeCalledWith({ where: { code: data.data.code } });
        expect(exampleRepository.save).toBeCalledTimes(1);
        expect(exampleRepository.save).toBeCalledWith(data.data);
    });

    test('Run apply fail with data not exists. Should run as expected', async () => {

        exampleQueries.findOne.mockResolvedValue(null)
        const data = new UpdateCommand({
            name: 'name',
        } as Example);

        try {
            await handler.apply(data);
        } catch (error) {
            expect(error).toEqual(new BusinessException('Dữ liệu không tồn tại'))
        }

        expect(exampleQueries.findOne).toBeCalledTimes(1);
        expect(exampleQueries.findOne).toBeCalledWith({where: {code : data.data.code}});
        expect(exampleRepository.save).toBeCalledTimes(0);
    });
});
