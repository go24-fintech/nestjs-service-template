import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./exeption.filters";


@Module({
    imports: [],
    providers: [
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      },
    ],
    exports: [],
  })
  export class ExeptionFilterModule { }