export type ContextUser = {
  name: string
  userId: string
  sessionId: string
}

export type GqlContext = {
  user: ContextUser | null
}
