import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Command } from 'src/command/entities/command.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_commands' })
export class UserCommand {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'command' })
  @Exclude()
  commandId: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @Column('text', { name: 'arguments' })
  arguments: string;

  @Column('text', { name: 'note', nullable: true, default: '' })
  note: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @ManyToOne(() => Command, (command) => command.userCommands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'command', referencedColumnName: 'id' })
  command: Command;

  @ManyToOne(() => User, (user) => user.userCommands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.userCommands)
  tags: Tag[];
}
