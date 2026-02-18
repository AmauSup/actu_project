import { UserCredentialsEntity } from "../entities/userCredentials.entity"
export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY')

export interface IAuthRepository{
  
    createUser(userData: Partial<UserCredentialsEntity>): Promise<UserCredentialsEntity>
    deleteUserById(id: number): Promise<boolean>
    findCredentialByEmail(email:string): Promise<UserCredentialsEntity | null>
    findCredentialById(id: number): Promise<UserCredentialsEntity | null>
    findAllUsers(): Promise<UserCredentialsEntity[]>
    findAllUsersPaginated(page: number, pageSize: number): Promise<{ items: UserCredentialsEntity[]; total: number }>
    updateUser(id: number, userData: Partial<UserCredentialsEntity>): Promise<UserCredentialsEntity>
    }