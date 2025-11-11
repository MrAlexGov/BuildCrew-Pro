import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity } from './user.entity';
import { CrewEntity } from './crew.entity';
import { TaskEntity } from './task.entity';

@ObjectType()
@Entity('objects')
export class ObjectEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 200 })
  name: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field()
  @Column({ length: 500 })
  address: string;

  @Field()
  @Column({ length: 200 })
  client: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Field()
  @Column({ type: 'date' })
  startDate: string;

  @Field()
  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => ID)
  @ManyToOne(() => UserEntity, (user) => user.objects)
  responsibleForeman: UserEntity;

  @Field()
  @Column()
  responsibleForemanId: string;

  @Field(() => [CrewEntity])
  @ManyToMany(() => CrewEntity)
  @JoinTable()
  crews: CrewEntity[];

  @Field(() => [TaskEntity])
  @OneToMany(() => TaskEntity, (task) => task.object)
  tasks: TaskEntity[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  get progress(): number {
    if (!this.tasks || this.tasks.length === 0) return 0;
    
    const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / this.tasks.length) * 100);
  }

  get isOverdue(): boolean {
    return this.endDate ? new Date() > new Date(this.endDate) : false;
  }
}