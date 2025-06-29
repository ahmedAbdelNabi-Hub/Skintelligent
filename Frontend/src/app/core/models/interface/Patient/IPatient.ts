export interface IPatient {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string; 
    gender: string;
    address: string;
    lastVisitDate?: string; 
    profilePicture?: string;
    createdDate: string; 
    updatedDate: string; 
    userId: string;
    email: string;
    phone: string;
};