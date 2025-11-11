import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity } from './user.entity';
import { ObjectEntity } from './object.entity';
import { TaskEntity } from './task.entity';

@ObjectType()
@Entity('crews')
export class CrewEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => [UserEntity])
  @ManyToMany(() => UserEntity, (user) => user.crews)
  @JoinTable()
  members: UserEntity[];

  @Field(() => [ObjectEntity])
  @ManyToMany(() => ObjectEntity, (object) => object.crews)
  objects: ObjectEntity[];

  @Field(() => [TaskEntity])
  @OneToMany(() => TaskEntity, (task) => task.crew)
  tasks: TaskEntity[];

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  get memberCount(): number {
    return this.members ? this.members.length : 0;
  }

  get busyMembersCount(): number {
    // Логика для определения занятых членов бригады
    return this.members.filter(member => member.isActive).length;
  }
}