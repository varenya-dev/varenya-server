export const fetchDefaultDoctorShiftStart = (): Date => {
  const newDate = new Date();
  newDate.setHours(9, 0, 0);

  return newDate;
};

export const fetchDefaultDoctorShiftEnd = (): Date => {
  const newDate = new Date();
  newDate.setHours(17, 0, 0);

  return newDate;
};
