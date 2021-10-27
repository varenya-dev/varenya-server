export class DoctorDto {
  public id: string;
  public clinicAddress: string;
  public cost: number;
  public fullName: string;
  public imageUrl: string;
  public jobTitle: string;
  public specializations: string[];

  constructor(
    id: string,
    clinicAddress: string,
    cost: number,
    fullName: string,
    imageUrl: string,
    jobTitle: string,
    specializations: string[],
  ) {
    this.id = id;
    this.clinicAddress = clinicAddress;
    this.cost = cost;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
    this.jobTitle = jobTitle;
    this.specializations = specializations;
  }
}
