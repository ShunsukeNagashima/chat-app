export interface DataClassDef<T> {
  defaultValues?: Partial<T>;
}

export type DataClassInit<T, Def extends DataClassDef<T>> = {
  -readonly [K in Exclude<keyof T, keyof Def['defaultValues']>]?: T[K];
} & {
  -readonly [K in keyof Def['defaultValues']]?: T[K];
};

export type Modifier<T> = {
  -readonly [K in keyof T]?: T[K];
};

export interface DataClass<T, Def extends DataClassDef<T>> {
  create: (init: DataClassInit<T, Def>) => T;
  clone: (data: T, modifier?: Modifier<T>) => T;
}

export interface AbstractDataClass<T> {
  def: <Def extends DataClassDef<T> = {}>(definition?: Def) => DataClass<T, Def>;
}

export const dataclass = <T>(): AbstractDataClass<T> => {
  const def = <Def extends DataClassDef<T> = {}>(definition?: Def): DataClass<T, Def> => {
    const create = (init: DataClassInit<T, Def>): T => {
      return Object.freeze(Object.assign({}, definition?.defaultValues, init)) as T;
    };
    const clone = (data: T, modifier: Modifier<T> = {}): T => {
      return Object.freeze(Object.assign({}, data, modifier));
    };
    return { create, clone };
  };

  return { def };
};
