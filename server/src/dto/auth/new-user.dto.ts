import { IsIn, IsNotEmpty } from 'class-validator';
import { Roles } from 'src/enum/roles.enum';

export class NewUserDto {
  @IsIn([Roles.Main, Roles.Professional])
  role: Roles;

  @IsNotEmpty()
  uid: string;
}
