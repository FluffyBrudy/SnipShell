import { UserCommand } from 'src/usercommand/entities/usercommand.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class User {
  @Column('character varying', { name: 'display_name', length: 32 })
  displayName: string;

  @Column('character varying', { name: 'email', unique: true, length: 32 })
  email: string;

  @Column('character varying', { name: 'password', length: 64 })
  password: string;

  @Column('enum', {
    name: 'role',
    nullable: true,
    enum: ['owner', 'helper', 'viewer'],
    default: () => "'owner'",
  })
  role: 'owner' | 'helper' | 'viewer' | null;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @OneToMany(() => UserCommand, (userCommand) => userCommand.user)
  userCommands: UserCommand[];
}
