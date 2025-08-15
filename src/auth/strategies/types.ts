import { User } from 'src/user/entities/user.entity';

export type TJwtPayloadSig<T> = T & { sub: User['id']; email: User['email'] };
