import { ResponseInterceptor } from "@core/interceptor/response.interceptor";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { BaseController, Mediator, Paginated } from "be-core";
import { AuthAuthorize } from "~/guard";
import { AddCommand, UpdateCommand } from "./command";
import { DeleteCommand } from "./command/delete.command";
import { Example } from "./entities/example";
import { ExampleQueries } from "./queries/example.queries";

@Controller('api/example')
@UseGuards(AuthAuthorize)
@UseInterceptors(ResponseInterceptor)
export class ExampleController extends BaseController {
    constructor(
        private mediator: Mediator,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }
    @Post()
    async add(
        @Body() command: AddCommand
    ) {
        return this.mediator.send(command)
    }
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

    @Get(':code')
    async get(
        @Param('code') code: string
    ) {
        return this.exampleQueries.findOne({ where: { code: code } });
    }

    @Patch(':code')
    async update(
        @Param('code') code: string,
        @Body() command: UpdateCommand
    ) {
        command.code = code
        this.mediator.send(command)

    }

    @Delete(':code')
    async delete(
        @Param('code') code: string
    ) {
        const command = new DeleteCommand(code)
        await this.mediator.send(command)
    }
}