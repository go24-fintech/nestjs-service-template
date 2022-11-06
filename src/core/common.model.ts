import { BaseEntity } from 'be-core';
import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class AuditEntity extends BaseEntity {
    @Exclude()
    @Column({ name: 'isDeleted' })
    isDeleted: boolean;

    @Column({ name: 'createdDate' })
    createdDate: Date;

    @Column({ name: 'createdBy' })
    createdBy: string;

    @Column({ name: 'modifiedDate' })
    modifiedDate?: Date;

    @Column({ name: 'modifiedBy' })
    modifiedBy?: string;
    constructor() {
        super()
        this.isDeleted = false;
        this.createdBy = '';
        this.createdDate = new Date();
        this.modifiedBy = undefined;
        this.modifiedDate = undefined;
    }
}
export class PagedResult<T> {
    totalItems: number;
    pageIndex: number;
    pageSize: number;
    items: Array<T>;
    constructor(data: Partial<PagedResult<T>>) {
        Object.assign(this, data)
    }
}
