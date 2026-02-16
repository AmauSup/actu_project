export class DomainError extends Error{
    public readonly code:string;
    public readonly statusCode:number;
    public readonly fields?:Record<string,string[]>;
    public readonly details?:Record<string, unknown>;

    constructor(params:{
        code :string;
        message:string;
        statusCode: number;
        fields?:Record<string,string[]>;
        details?:Record<string,unknown>
    }){
        super(params.message)//pour bypass erreur de base et utiliser notre version de gestion d'erreur

        this.code=params.code;
        this.statusCode = params.statusCode;
        this.fields=params.fields;
        this.details=params.details;

        Object.setPrototypeOf(this,new.target.prototype)
    }

}