export interface FilterModel {
    field: string
    type:
      | 'OR'
      | 'AND'
      | 'EQUAL'
      | 'NOT_EQUAL'
      | 'LIKE'
      | 'GT'
      | 'GTE'
      | 'LT'
      | 'LTE'
      | 'IN'
      | 'NOT_IN'
      | 'BETWEEN'
      | 'EQUAL_WITH_FIELD'
      | 'NOT_EQUAL_WITH_FIELD'
      | 'GT_WITH_FIELD'
      | 'GTE_WITH_FIELD'
      | 'LT_WITH_FIELD'
      | 'LTE_WITH_FIELD'
    data?: any[]
    nestedConditions?: FilterModel[]
  }
  
  export const typeMongoMapper = {
    OR: '$or',
    AND: '$and',
    EQUAL: '$eq',
    NOT_EQUAL: '$ne',
    LIKE: '$regex',
    GT: '$gt',
    GTE: '$gte',
    LT: '$lt',
    LTE: '$lte',
    EQUAL_WITH_FIELD: ['$expr', '$eq'],
    NOT_EQUAL_WITH_FIELD: ['$expr', '$ne'],
    GT_WITH_FIELD: ['$expr', '$gt'],
    GTE_WITH_FIELD: ['$expr', '$gte'],
    LT_WITH_FIELD: ['$expr', '$lt'],
    LTE_WITH_FIELD: ['$expr', '$lte'],
    IN: '$in',
    NOT_IN: '$nin',
  }
  
  const buildValue = (filter: FilterModel): FilterModel => {
    if (filter.field) {
      if (filter.field.endsWith('Date')) {
        filter.data = filter.data?.map((data) => new Date(data))
      } else {
        filter.data = filter.data?.map((data) =>
          typeof data === 'boolean' ? +data : data
        )
      }
    }
  
    return filter
  }
  
  export const buildMongoQuery = (filter: FilterModel) => {
    filter = buildValue(filter)
    if (filter.type === 'OR' || filter.type === 'AND') {
      return {
        [typeMongoMapper[filter.type]]:
          filter.nestedConditions?.map(buildMongoQuery),
      }
    } else if (Array.isArray(filter.data)) {
      // 'EQUAL' | 'NOT_EQUAL' | 'LIKE' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'IN' | 'NOT_IN']
      if (filter.type !== 'BETWEEN') {
        const type = typeMongoMapper[filter.type]
        if (typeof type === 'string') {
          return {
            [filter.field]: {
              [type]: ['IN', 'NOT_IN'].includes(filter.type)
                ? filter.data
                : filter.data[0],
            },
          }
        } else if (Array.isArray(type) && type.length === 2) {
          return {
            [type[0]]: {
              [type[1]]: [`$${filter.field}`, `$${filter.data[0]}`],
            },
          }
        }
      }
      // BETWEEN
      return {
        $and: [
          {[filter.field]: {[typeMongoMapper['GTE']]: filter.data[0]}},
          {[filter.field]: {[typeMongoMapper['TTE']]: filter.data[1]}},
        ],
      }
    }
  }
  