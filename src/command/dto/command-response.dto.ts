
export class CommandResponseDto {
    id: number;

    command: string;
}

export class CommandsResponseDto {
    commands: CommandResponseDto[];
}
