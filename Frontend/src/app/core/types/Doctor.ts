export type Doctor = {
  doctorId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // date
  gender: string;
  email: string;
  address: string;
  licenseNumber: string;
  isProfileCompleted: boolean;
  experienceYears: number;
  rating : number;
  defaultExaminationFee: number;
  profilePicture?: string;
  qualification: string;
  phoneNumber: string;
  isActive: boolean;
  createdDate: string; // datetime
  updatedDate: string; // datetime
  userId: string;
  id: string;
  clinics?: Clinic[];
};

type DoctorClinic = {
  doctorId: number;
  clinicId: number;
  assignedDate: string; // datetime
};
export type Clinic = {
  id: number;
  clinicName: string;
  address: string;
};

export {};
