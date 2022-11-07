import { ResponseInterceptor } from "@core/interceptor/response.interceptor";
import { KafkaService } from "@modules/kafka/kafka.service";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { BaseController, Mediator } from "be-core";
import { Authorize, Roles } from "~/guard";
import { AddCommand, UpdateCommand } from "./command";
import { DeleteCommand } from "./command/delete.command";
import { ExampleQueries } from "./queries/example.queries";

@Controller('api/example')
@UseInterceptors(ResponseInterceptor)
export class ExampleController extends BaseController {
    constructor(
        private mediator: Mediator,
        private exampleQueries: ExampleQueries,
        private kafkaService: KafkaService
    ) {
        super();
    }


    @Post('producer')
    async producer(@Body() data: any[]) {
        await this.kafkaService.sendBatch('example.topic', data)
    }

    @UseGuards(Authorize('Example', Roles.Shop))
    @Post()
    async add(
        @Body() command: AddCommand
    ) {
        return this.mediator.send(command)
    }

    @UseGuards(Authorize('Example', Roles.Shop))
    @Get()
    async gets(
        @Query('pageNumber', ParseIntPipe) pageNumber: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ) {
        const [dataSource, totalRow] = await this.exampleQueries.findAndCount({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize
        })
        return {
            pageNumber,
            pageSize,
            totalRow,
            dataSource
        }
    }

    @UseGuards(Authorize('Example', Roles.Shop))
    @Get(':code')
    async get(
        @Param('code') code: string
    ) {
        return this.exampleQueries.findOne({ where: { code: code } });
    }

    @UseGuards(Authorize('Example', Roles.Shop))
    @Patch(':code')
    async update(
        @Param('code') code: string,
        @Body() command: UpdateCommand
    ) {
        command.code = code
        this.mediator.send(command)

    }

    @UseGuards(Authorize('Example', Roles.Shop))
    @Delete(':code')
    async delete(
        @Param('code') code: string
    ) {
        const command = new DeleteCommand(code)
        await this.mediator.send(command)
    }
}