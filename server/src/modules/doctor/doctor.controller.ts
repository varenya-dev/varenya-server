import { AuthUser } from './../../decorators/auth-user.decorator';
import { DoctorService } from './doctor.service';
import { NewOrUpdatedDoctor } from 'src/dto/doctor/new-update-doctor.dto';
import { RoleAuthGuard } from './../../guards/role-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Doctor } from 'src/models/doctor.model';

@Controller('doctor')
@UseGuards(RoleAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @Role(Roles.Professional)
  public async createDoctor(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() newDoctorDto: NewOrUpdatedDoctor,
  ): Promise<Doctor> {
    return await this.doctorService.createDoctor(loggedInUser, newDoctorDto);
  }
}
