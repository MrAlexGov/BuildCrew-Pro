import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity } from './user.entity';
import { ObjectEntity } from './object.entity';
import { CrewEntity } from './crew.entity';
import { TaskFileEntity } from './task-file.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@ObjectType()
@Entity('tasks')
export class TaskEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 200 })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => TaskStatus)
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Field(() => TaskPriority)
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Field(() => ID)
  @ManyToOne(() => ObjectEntity, (object) => object.tasks)
  object: ObjectEntity;

  @Field()
  @Column()
  objectId: string;

  @Field(() => ID, { nullable: true })
  @ManyToOne(() => CrewEntity, (crew) => crew.tasks)
  crew: CrewEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  crewId: string;

  @Field(() => ID, { nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.assignedTasks)
  assignee: UserEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assigneeId: string;

  @Field(() => ID)
  @ManyToOne(() => UserEntity, (user) => user.createdTasks)
  creator: UserEntity;

  @Field()
  @Column()
  creatorId: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Field({ nullable: true })
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  estimatedHours: number;

  @Field({ nullable: true })
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  actualHours: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  completionComment: string;

  @Field(() => [TaskFileEntity])
  @OneToMany(() => TaskFileEntity, (file) => file.task)
  files: TaskFileEntity[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  get isOverdue(): boolean {
    return this.dueDate ? new Date() > new Date(this.dueDate) && this.status !== TaskStatus.COMPLETED : false;
  }

  get progress(): number {
    switch (this.status) {
      case TaskStatus.PENDING:
        return 0;
      case TaskStatus.IN_PROGRESS:
        return 50;
      case TaskStatus.COMPLETED:
        return 100;
      default:
        return 0;
    }
  }
}