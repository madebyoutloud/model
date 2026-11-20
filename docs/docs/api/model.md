# Model

## Static Methods

### create
Creates Model from values.
```ts
create(values: ModelValues<Model>): Model;
```

### fromJSON
Creates Model from plain data, pairs with `toJSON()`. An instance of the Model is returned as it is, `null` and `undefined` return `null`.
```ts
fromJSON(values: Record<string, any>): Model;
fromJSON(values: Record<string, any> | null | undefined): Model | null;
```

### fromArray
Creates Model from each item. `null` and `undefined` return an empty array.
```ts
fromArray(items: Record<string, any>[] | null | undefined): Model[];
```

### mapperJSON
Returns a function that creates Model from data, with the same `null` handling as `fromJSON`.
```ts
mapperJSON(): {
  (data: Record<string, any>): Model;
  (data: Record<string, any> | null | undefined): Model | null;
};
```

### mapperArray
Returns a function that creates Model from each item.
```ts
mapperArray(): (data: Record<string, any>[] | null | undefined) => Model[];
```

## Methods

### merge
Updates Model data partially with preserving existing values. Keys that only have a getter on the Model are skipped.
```ts
merge(values: ModelValues<this>): this;
```

### toJSON()
Returns the Model as plain data: columns serialized, relations as plain objects.
```ts
toJSON(): Record<string, any>
```

### clone()
Clone model to new instance.
```ts
clone(): Model
```
