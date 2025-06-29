export interface IAppointmentWithPatient {
    patientName: string;
    phone: string;
    patientImage: string;
    age: number;
    timeStart: string; // ISO date string from backend
    timeEnd: string;
}
