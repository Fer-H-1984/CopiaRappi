export class CreateVendorDto {
    readonly name: string;
    readonly address: string;
    readonly phone: string;
    readonly isActive?: boolean;
}