import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions/permissions.service';

export const RequirePermission = (
  permissions: bigint | bigint[],
  requireAll = true,
) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    SetMetadata('permissions', { perms: permsArray, requireAll })(target, propertyKey as string | symbol, descriptor as any);
    UseGuards(PermissionsGuard)(target, propertyKey as string | symbol, descriptor as any);
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // récupérer les permissions requises des métadonnées
    const metadata = this.reflector.get(
      'permissions',
      context.getHandler(),
    ) as { perms: bigint[]; requireAll: boolean } | undefined;

    if (!metadata) {
      // si aucune permission n'est requise, laisser passer
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.permissions === undefined) {
      throw new ForbiddenException('User permissions not found');
    }

    // vérifier les permissions
    const check = this.permissionsService.checkMultiplePermissions(
      user.permissions,
      metadata.perms,
      metadata.requireAll,
    );

    if (!check.hasPermissions) {
      const missingPerms = check.missingPermissions
        ?.map((perm) => `0x${perm.toString(16)}`)
        .join(', ');
      throw new ForbiddenException(
        `Insufficient permissions. Missing: ${missingPerms || 'unknown'}`,
      );
    }

    return true;
  }
}

export const DisplayPermissions = (permissions: bigint | bigint[]) => {
  const permsArray = Array.isArray(permissions) ? permissions : [permissions];
  return SetMetadata('displayPermissions', permsArray);
};
