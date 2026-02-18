import { Injectable } from '@nestjs/common';
import { PERMISSIONS } from './permissions.constants';
import {
  IPermission,
  IPermissionCheck,
  IMultiPermissionCheck,
} from './permissions.interface';

@Injectable()
export class PermissionsService {
 
  addPermission(permissions: bigint, toAdd: bigint): bigint {
    return permissions | toAdd;
  }

  removePermission(permissions: bigint, toRemove: bigint): bigint {
    if ((permissions & toRemove) === 0n) {
      return permissions;
    }
    return permissions ^ toRemove;
  }

  checkPermission(permissions: bigint, required: bigint): IPermissionCheck {
    const hasPermission = (permissions & required) === required;
    return {
      hasPermission,
      permissions,
      required,
    };
  }

  checkMultiplePermissions(
    permissions: bigint,
    required: bigint[],
    requireAll = true,
  ): IMultiPermissionCheck {
    if (required.length === 0) {
      return {
        requireAll,
        permissions,
        required: [],
        hasPermissions: true,
      };
    }

    const missingPermissions: bigint[] = [];

    if (requireAll) {
      const hasPermissions = required.every((perm) => {
        if ((permissions & perm) === perm) {
          return true;
        }
        missingPermissions.push(perm);
        return false;
      });

      return {
        requireAll: true,
        permissions,
        required,
        hasPermissions,
        missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
      };
    } else {
      const hasPermissions = required.some((perm) => (permissions & perm) === perm);

      if (!hasPermissions) {
        missingPermissions.push(...required);
      }

      return {
        requireAll: false,
        permissions,
        required,
        hasPermissions,
        missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
      };
    }
  }

  invertPermissions(permissions: bigint): bigint {
    return ~permissions;
  }

  permissionsToBinary(permissions: bigint): string {
    return permissions.toString(2).padStart(16, '0');
  }

  getActivePermissions(permissions: bigint): string[] {
    const active: string[] = [];

    Object.entries(PERMISSIONS).forEach(([name, bit]) => {
      if ((permissions & bit) === bit) {
        active.push(name);
      }
    });

    return active;
  }

  createFromNames(names: (keyof typeof PERMISSIONS)[]): bigint {
    return names.reduce(
      (acc, name) => acc | PERMISSIONS[name],
      0n,
    );
  }

  addAllPermissionsForDomain(
    permissions: bigint,
    domain: 'AUTH' | 'ARTICLE' | 'AUTHOR' | 'CATEGORY' | 'MAILER',
  ): bigint {
    const domainPermissions: (keyof typeof PERMISSIONS)[] = [];

    Object.keys(PERMISSIONS).forEach((key) => {
      if (key.startsWith(domain)) {
        domainPermissions.push(key as keyof typeof PERMISSIONS);
      }
    });

    return this.createFromNames(domainPermissions);
  }

  removeAllPermissionsForDomain(
    permissions: bigint,
    domain: 'AUTH' | 'ARTICLE' | 'AUTHOR' | 'CATEGORY' | 'MAILER',
  ): bigint {
    const domainPermissions = this.addAllPermissionsForDomain(0n, domain);
    return permissions & ~domainPermissions;
  }

  isAdmin(permissions: bigint): boolean {
    return (
      (permissions & PERMISSIONS.AUTH_ADMIN) === PERMISSIONS.AUTH_ADMIN &&
      (permissions & PERMISSIONS.ARTICLE_ADMIN) === PERMISSIONS.ARTICLE_ADMIN &&
      (permissions & PERMISSIONS.AUTHOR_ADMIN) === PERMISSIONS.AUTHOR_ADMIN &&
      (permissions & PERMISSIONS.CATEGORY_ADMIN) === PERMISSIONS.CATEGORY_ADMIN
    );
  }
}
