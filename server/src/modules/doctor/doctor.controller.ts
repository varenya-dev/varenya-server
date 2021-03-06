import { Specialization } from 'src/models/specialization.model';
import { AuthUser } from './../../decorators/auth-user.decorator';
import { DoctorService } from './doctor.service';
import { NewOrUpdatedDoctor } from 'src/dto/doctor/new-update-doctor.dto';
import { RoleAuthGuard } from './../../guards/role-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Doctor } from 'src/models/doctor.model';
import { FilterDoctorDto } from 'src/dto/doctor/filter-doctor.dto';

@Controller('doctor')
@UseGuards(RoleAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('specialization')
  @Role(Roles.Professional, Roles.Main)
  public async getSpecializations(): Promise<Specialization[]> {
    return await this.doctorService.getSpecializations();
  }

  @Get('title')
  @Role(Roles.Professional, Roles.Main)
  public async getJobTitles(): Promise<string[]> {
    return await this.doctorService.getJobTitles();
  }

  @Get('identity')
  @Role(Roles.Professional)
  public async getLoggedInDoctor(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<Doctor> {
    return await this.doctorService.getLoggedInDoctor(loggedInUser);
  }

  @Get('filter')
  @Role(Roles.Main)
  public async filterDoctor(
    @Query() filterDoctorDto: FilterDoctorDto,
  ): Promise<Doctor[]> {
    return await this.doctorService.filterDoctor(filterDoctorDto);
  }

  @Post('placeholder')
  @Role(Roles.Professional)
  public async createPlaceholder(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<Doctor> {
    return await this.doctorService.createPlaceholder(loggedInUser);
  }

  @Post()
  @Role(Roles.Professional)
  public async createDoctor(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() newDoctorDto: NewOrUpdatedDoctor,
  ): Promise<Doctor> {
    return await this.doctorService.createDoctor(loggedInUser, newDoctorDto);
  }

  @Put()
  @Role(Roles.Professional)
  public async updateDoctor(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() updateDoctor: NewOrUpdatedDoctor,
  ): Promise<Doctor> {
    return await this.doctorService.updateDoctor(loggedInUser, updateDoctor);
  }
}
