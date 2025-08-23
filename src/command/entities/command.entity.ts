import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCommand } from '../../usercommand/entities/usercommand.entity';

@Entity('commands', { schema: 'public' })
export class Command {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'command', unique: true, length: 20 })
  command: string;

  @OneToMany(() => UserCommand, (userCommand) => userCommand.command)
  userCommands: UserCommand[];
}
