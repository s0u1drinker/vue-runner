import type { AuthData } from "./authData"

export type RegistrationData = AuthData & {
  username: string,
}