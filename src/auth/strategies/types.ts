import { User } from '../../user/entities/user.entity';

export type TJwtPayloadSig<T> = T & { sub: User['id']; email: User['email'] };
