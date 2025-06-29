export interface IAdminDashboard {
    overview: {
        totalDoctors: number;
        totalPatients: number;
        totalClinics: number;
        totalAppointments: number;
    };
    doctorGrowth: { year: number; month: number; doctorCount: number }[];
    patientGrowth: { year: number; month: number; patientCount: number }[];
    appointmentVolume: { year: number; month: number; appointmentCount: number }[];
}