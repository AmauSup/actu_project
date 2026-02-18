import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('category')
export class CategoryCredentialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ name: 'slug', type: 'varchar', length: 120 })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string | null;

}
