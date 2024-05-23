import { SetMetadata } from '@nestjs/common';
export const PERMS_KEY = 'require-permission';
export const RequirePermission = (permissions: string[]) =>
  SetMetadata(PERMS_KEY, permissions);

// export function RequirePermission(permissions: string[]) {
//   return applyDecorators(
//     SetMetadata('require-permission', permissions),
//     UseGuards(PermissionGuard),
//     ApiBearerAuth(),
//     ApiUnauthorizedResponse({ description: 'Unauthorized' }),
//   );
// }
