# Model

## Static Methods

### create
Creates Model from values.
```ts
create(values: ModelValues<Model>): Model;
```

### fromJSON
Creates Model from unknown JSON.
```ts
fromJSON(values: Record<string, any>): Model;
```

### map
Maps data to Model or array of Models.
```ts
map(data: any, toArray?: boolean): Model | Model[] | null;
```

### mapper
Creates mapper for future mapping of data to Models.
```ts
mapper(format: 'array' | 'model' | 'nullable'): (data: any) => Model | Model[] | null;
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
