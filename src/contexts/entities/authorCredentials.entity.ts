import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { ArticleCredentialsEntity } from './articleCredentials.entity'; 

@Entity('author')
export class AuthorCredentialsEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
   

    @Column({name: 'autor_first_name', type:"varchar", length:255})
    autor_first_name:string;

    @Column({name: 'autor_last_name', type:"varchar", length:255})
    autor_last_name:string;
    

    @OneToMany(() => ArticleCredentialsEntity, (article) => article.author)
    articles: ArticleCredentialsEntity[];


    
}