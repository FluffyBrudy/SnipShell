import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class FavouriteUsercommandDto {
  @Type(() => Number)
  @IsNumber()
  usercommandId: User['id'];
}
