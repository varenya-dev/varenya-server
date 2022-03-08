export class PatientDto {
  public id: string;
  public fullName: string;
  public imageUrl: string;

  constructor(id: string, fullName: string, imageUrl: string) {
    this.id = id;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
  }
}
