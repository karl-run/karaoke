export function raise(error: Error | string): never {
  throw typeof error === 'string' ? new Error(error) : error
}
