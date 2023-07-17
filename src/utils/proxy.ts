const isKeyOf = <T extends object>(obj: T, key: keyof any): key is keyof T => {
  return key in obj;
};

export const proxy = <I extends object>(obj: I, patch: Partial<I> = {}) => {
  return new Proxy(obj, {
    get: (target: I, prop: string) => {
      return isKeyOf(patch, prop) ? patch[prop] : Reflect.get(target, prop);
    },
  });
};
