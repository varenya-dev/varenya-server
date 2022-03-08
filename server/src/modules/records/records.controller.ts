import { PatientDto } from 'src/dto/patient.dto';
import { Doctor } from 'src/models/doctor.model';
import { RoleAuthGuard } from './../../guards/role-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';

@Controller('records')
@UseGuards(RoleAuthGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  @Role(Roles.Main, Roles.Professional)
  public async fetchRecords(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<Doctor[] | PatientDto[]> {
    if (loggedInUser.databaseUser.role === Roles.Main)
      return await this.recordsService.fetchLinkedDoctors(loggedInUser);
    else return await this.recordsService.fetchLinkedPatients(loggedInUser);
  }
}
