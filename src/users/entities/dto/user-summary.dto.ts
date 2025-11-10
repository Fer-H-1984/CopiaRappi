import { PickType } from "@nestjs/mapped-types";
import { UserResponseDto } from "./user-response.dto";
/**
 * Dto para enviar datos del usuario, usado por otras clases
 */
export class UserSummaryDto extends PickType(UserResponseDto, ['name', 'email'] as const) {}
