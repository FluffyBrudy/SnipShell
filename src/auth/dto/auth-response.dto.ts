
export class UserResponseDto {
    id: number;

    displayName: string;

    email: string;

    role: 'owner' | 'helper' | 'viewer' | null;
}

export class LoginResponseDto {
    accessToken: string;
}

export class RefreshTokenResponseDto {
    accessToken: string;
}
