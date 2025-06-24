import configuration from '../helpers/api-config.config';

export type EnvironmentVariables = ReturnType<typeof configuration>;

export type Leaves<T> = T extends object
  ? keyof T extends string
    ? {
        [K in keyof T & string]: K | `${K}.${Leaves<T[K]>}`;
      }[keyof T & string]
    : never
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;
