import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE = 'isPublic';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_ROUTE, true);
