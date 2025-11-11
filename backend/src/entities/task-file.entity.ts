import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { TaskEntity } from './task.entity';

@ObjectType()
@Entity('task_files')
export class TaskFileEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 200 })
  filename: string;

  @Field()
  @Column({ length: 500 })
  originalName: string;

  @Field()
  @Column({ length: 100 })
  mimeType: string;

  @Field()
  @Column()
  size: number;

  @Field()
  @Column()
  url: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => ID)
  @ManyToOne(() => TaskEntity, (task) => task.files)
  task: TaskEntity;

  @Field()
  @Column()
  taskId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deletedAt: Date;
}