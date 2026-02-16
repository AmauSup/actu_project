import { DomainError } from "src/core/errors/domaine-error"

export class PlayerNotFound extends DomainError {
    public readonly fields: Record<string, string[]>
    constructor(
        params : {
            fields:Record<string,string[]>;
        }
    ){
        super({
                code: 'Player_Not_Found',
                statusCode:400, message:'Player not found',
                fields:{slug:['']},
                details:{slug:['']}
            })

            this.fields=params.fields
    }
}