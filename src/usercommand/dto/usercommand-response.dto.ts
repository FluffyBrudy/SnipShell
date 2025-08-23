
export class TagResponseDto {
    id: number;

    name: string;
}

export class UserCommandResponseDto {
    id: number;

    commandId: number;

    userId: number;

    arguments: string;

    note: object;

    createdAt: Date | null;

    tags: TagResponseDto[];
}

export class UserCommandsResponseDto {
    commands: UserCommandResponseDto[];
}
