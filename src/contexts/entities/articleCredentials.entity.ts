import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn} from "typeorm"
import  { AuthorCredentialsEntity } from './authorCredentials.entity';
@Entity('article')
export class ArticleCredentialsEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({name: 'categorie', type:"varchar", length:255})
    categorie:string;

    @Column({name: 'name', type:"varchar", length:255})
    name :string;
    
    @ManyToOne(() => AuthorCredentialsEntity, (user) => user.articles)
    author: AuthorCredentialsEntity;
    

    @Column({name: 'description', type:"varchar", length:255})
    descrition:string;

    @Column({ type: 'text' })
    content: string;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @Column({ nullable: true })
    imageUrl: string;

    
    
}