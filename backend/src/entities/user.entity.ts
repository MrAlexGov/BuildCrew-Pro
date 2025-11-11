import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { ObjectEntity } from './object.entity';
import { CrewEntity } from './crew.entity';
import { TaskEntity } from './task.entity';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  FOREMAN = 'foreman',
  WORKER = 'worker',
}

@ObjectType()
@Entity('users')
export class UserEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  lastName: string;

  @Field()
  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WORKER,
  })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  specialization: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Связи
  @OneToMany(() => ObjectEntity, (object) => object.responsibleForeman)
  objects: ObjectEntity[];

  @ManyToMany(() => CrewEntity, (crew) => crew.members)
  crews: CrewEntity[];

  @OneToMany(() => TaskEntity, (task) => task.assignee)
  assignedTasks: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.creator)
  createdTasks: TaskEntity[];

  // Методы для хэширования пароля
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}