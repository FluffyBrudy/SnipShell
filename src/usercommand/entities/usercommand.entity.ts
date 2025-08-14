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

@Entity('user_commands', { schema: 'public' })
export class UserCommand {
  @Column('text', { name: 'arguments' })
  arguments: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Command, (command) => command.userCommands)
  @JoinColumn([{ name: 'command', referencedColumnName: 'id' }])
  command: Command;

  @ManyToMany(() => Tag, (tag) => tag.userCommands)
  tags: Tag[];
}
