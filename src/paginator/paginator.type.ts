import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationParamsDto } from './paginator.dto';

export enum DefaultSortableFields {
  CREATED_DATE_FIELD = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum FilterOp {
  BETWEEN = 'between',
  CONTAINS = 'contains',
  IS = 'is',
  NOT = 'not',
  EQUALS = 'equals',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_ANY_OF = 'isAnyOf',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  AFTER = 'after',
  ON_OR_AFTER = 'onOrAfter',
  BEFORE = 'before',
  ON_OR_BEFORE = 'onOrBefore',
}

export type FilterOpLiteral = string | FilterOp | null | undefined;

export interface BasePaginationParams {
  sortField?: string;
  sortOrder?: SortOrder;
  offset?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedList<resultsType> extends BasePaginationParams {
  currentResults: number;
  totalResults: number;
  results: resultsType[];
}

export interface ProcessedParams {
  filterField: string[];
  filterOp: FilterOp[];
  filter: string[];
}

export interface RelationParam {
  relation: string;
  alias: string;
  joins?: RelationParam[];
}

export interface EntityFilteredListOptions<Entity extends ObjectLiteral> {
  repository: Repository<Entity>;
  queryFilter: PaginationParamsDto;
  searchFields?: string[];
  isAndCondition?: boolean;
  relations?: RelationParam[];
  pkName?: string;
  withDeleted?: boolean;
  filterOptions?: JoinTableFilterParams[];
}

export type EntityFilteredListResults<Entity> = Promise<[Entity[], number, number]>;

interface JoinTableFilterParams {
  field: string;
  fieldAlias?: string;
  tableAlias: string;
}

interface CommonMultiFilterOptions {
  filterSeparator?: string;
}

type ConditionalMultiFilterOptions =
  | {
      filterOnJoinTable?: JoinTableFilterParams[];
      mainTableAlias?: string;
    }
  | {
      filterOnJoinTable?: never;
      mainTableAlias?: never;
    };

export type SqlMultiFilterOptions = CommonMultiFilterOptions & ConditionalMultiFilterOptions;
