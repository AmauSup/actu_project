import { PERMISSIONS } from './permissions.constants';


export interface IPermission {
  name: string;
  bit: bigint;
  domain: 'AUTH' | 'ARTICLE' | 'AUTHOR' | 'CATEGORY' | 'MAILER';
  level: 'USE' | 'WRITE' | 'ADMIN';
  description: string;
}


export interface IPermissionOperation {
  success: boolean;
  permissions: bigint;
  message: string;
}

export interface IPermissionCheck {
  hasPermission: boolean;
  permissions: bigint;
  required: bigint;
}

export interface IMultiPermissionCheck {
  requireAll: boolean;
  permissions: bigint;
  required: bigint[];
  hasPermissions: boolean;
  missingPermissions?: bigint[];
}
