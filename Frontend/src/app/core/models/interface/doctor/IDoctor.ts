export interface IDoctor {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    aboutMe: string;
    defaultExaminationFee: number;
    defaultConsultationFee: number;
    dateOfBirth: string;
    gender: string;
    address: string;

    rating: number;
    reviews: string[];
    email : string;
    licenseNumber: string;
    experienceYears: number;
    profilePicture?: string; 
    qualification: string;
}