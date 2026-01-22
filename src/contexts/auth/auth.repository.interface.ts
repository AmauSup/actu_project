import { UserCredentialsEntity } from "../entities/userCredentials.entity"
export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY')

export interface IAuthRepository{
  
    createUser(userData: Partial<UserCredentialsEntity>): Promise<UserCredentialsEntity>
    deleteUserByEmail(email: string): Promise<boolean>
    findCredentialByEmail(email:string): Promise<UserCredentialsEntity | null>
    }