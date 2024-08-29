export async function mockify(pathOrUrl: string): Promise<any> {
  console.info(`Mocking ${pathOrUrl}`)

  return {
    debug: true,
  }
}
