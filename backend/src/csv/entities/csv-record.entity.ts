import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('csv_records')
export class CsvRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  s3Key!: string;

  @Column()
  fileName!: string;

  @Column('jsonb')
  data!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}