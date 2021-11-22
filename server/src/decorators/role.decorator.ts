import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/enum/roles.enum';

export const Role = (...args: Roles[]) => SetMetadata('roles', args);
