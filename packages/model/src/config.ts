export const config = {
  date: {
    parse: (value: Date) => value as any,
    format: (value: any) => value as Date,
  },
}

type Config = typeof config

export function configure(options: Partial<Record<keyof Config, Partial<Config[keyof Config]>>>) {
  for (const key in options) {
    Object.assign(config[key as keyof typeof options], options[key as keyof typeof options])
  }
}
