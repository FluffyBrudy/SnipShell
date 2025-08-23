import { UserCommand } from '../../usercommand/entities/usercommand.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tags', { schema: 'public' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true, length: 50 })
  name: string;

  @ManyToMany(() => UserCommand, (userCommand) => userCommand.tags, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_commands_tags',
    joinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [
      { name: 'user_command_id', referencedColumnName: 'id' },
    ],
    schema: 'public',
  })
  userCommands: UserCommand[];
}
