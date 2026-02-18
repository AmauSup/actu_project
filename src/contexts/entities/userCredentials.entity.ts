import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from "typeorm"
import { DEFAULT_USER_PERMISSIONS } from "../../core/permissions/permissions.constants"

@Entity('user')
export class UserCredentialsEntity{
    @PrimaryGeneratedColumn()//clé unique auto-incrémentée
    id: number;
    
    @Column({name: 'password_h', type:"varchar", length:255})//colonne normal
    passwordHash:string;

    @Column({name: 'first_name', type:"varchar", length:255})//colonne normal
    first_name:string;

    @Column({name: 'last_name', type:"varchar", length:255})//colonne normal
    last_name:string;

    @Index({unique:true})// colonne unique
    @Column({name: 'email', type:"varchar", length:255})
    email:string;

    @CreateDateColumn({name:'created_at'})//colonne automatique
    createdAt:Date;

    @Column({
        name: 'permissions',
        type: 'bigint',
        default: () => DEFAULT_USER_PERMISSIONS.toString(),
        comment: 'BigInt bitmask pour stocker les permissions utilisateur'
    })
    permissions: bigint;
}