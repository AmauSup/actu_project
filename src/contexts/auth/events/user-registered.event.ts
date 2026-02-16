export const AUTH_USER_REGISTERED_EVENT = 'auth.user.registered'

export class UserRegisteredEvent{
    static eventName = AUTH_USER_REGISTERED_EVENT

    static create(payload:any): { name: string, payload: any } {
        return {
            name:UserRegisteredEvent.eventName,
            payload
        }
    }
}