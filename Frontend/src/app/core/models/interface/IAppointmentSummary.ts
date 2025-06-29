export interface IAppointmentSummary {
    appointmentId: number;
    patientName: string;
    appointmentStart: string;
    appointmentEnd: string;
    summaryJson: string;
    conversationId: number;
    imageBase64?: string;
    imageMimeType?: string;
}