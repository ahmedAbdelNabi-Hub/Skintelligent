export interface IPatient {
    id: number;
    appointmentId: number;
    firstName: string;
    lastName: string;
    startTime: string;
    endTime: string;
    phoneNumber: string;
    isCanceled: boolean;
    isCompleted: boolean;
    profilePicture: string;
    email: string;

}

export interface IPatientSchedule {
    day: number;
    patients: IPatient[];
}
