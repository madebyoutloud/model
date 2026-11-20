# Model

## Static Methods

### create
Creates Model from values.
```ts
create(values: ModelValues<Model>): Model;
```

### fromJSON
Creates Model from plain data, pairs with `toJSON()`. An instance of the Model is returned as it is.
```ts
fromJSON(values: Record<string, any>): Model;
```

### fromArray
Creates Model from each item.
```ts
fromArray(items: Record<string, any>[]): Model[];
```

### mapperJSON
Returns a function that creates Model from data.
```ts
mapperJSON(): (data: Record<string, any>) => Model;
```

### mapperArray
Returns a function that creates Model from each item.
```ts
mapperArray(): (data: Record<string, any>[]) => Model[];
```

## Methods

### fill
Fill Model data with values.
```ts
fill(values: ModelValues<this>): this;
```

### merge
Updates Model data partially with preserving existing values.
```ts
merge(values: ModelValues<this>): this;
```

### serialize()
Serialize model to plain object.
```ts
serialize(): Record<string, any>
```

### clone()
Clone model to new instance.
```ts
clone(): Model
```
