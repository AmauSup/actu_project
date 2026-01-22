import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from "typeorm"

@Entity('user')
export class UserCredentialsEntity{
    @PrimaryGeneratedColumn('uuid')//clé unique
    id: string;
    
    @Column({name: 'password_h', type:"varchar", length:255})//colonne normal
    passwordHash:string;

    @Index({unique:true})// colonne unique
    @Column({name: 'email', type:"varchar", length:255})
    email:string;

    @CreateDateColumn({name:'created_at'})//colonne automatique
    createdAt:Date;
}