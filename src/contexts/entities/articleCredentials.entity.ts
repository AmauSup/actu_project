import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { AuthorCredentialsEntity } from './authorCredentials.entity';
import { CategoryCredentialsEntity } from './categoryCredentials.entity';
@Entity('article')
export class ArticleCredentialsEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    

    @Column({name: 'name', type:"varchar", length:255})
    name :string;
    
    @ManyToOne(() => AuthorCredentialsEntity, (user) => user.articles)
    author: AuthorCredentialsEntity;
    

    @Column({name: 'description', type:"varchar", length:255})
    description:string;

    @Column({ type: 'text' })
    content: string;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @Column({ nullable: true })
    imageUrl: string;

    @ManyToMany(() => CategoryCredentialsEntity)
    @JoinTable({
        name: 'article_category',
        joinColumn: { name: 'article_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories?: CategoryCredentialsEntity[];

    
    
}