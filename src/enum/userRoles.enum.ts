export enum UserRoles {
  superUser = '1000',
  admin = '2000',

  doctorsAdmin = '3011',
  doctorsHL = '3012',
  doctorsML = '3013',
  doctorsLL = '3014',

  patientsAdmin = '3021',
  patientsHL = '3022',
  patientsML = '3023',
  patientsLL = '3024',
}

export const allRolesList = Object.values(UserRoles);
