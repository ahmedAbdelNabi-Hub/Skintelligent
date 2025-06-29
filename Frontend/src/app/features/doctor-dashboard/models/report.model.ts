export interface Report {
  id: string;
  name: string;
  date: Date | string; // Allow string for initial data, convert to Date object in service/component
  patientId: string;
  doctorId: string;
  pdfUrl?: string; // Optional, as it might be generated or fetched on demand
  chatSessionId?: string; // Optional, to link to a specific chat session
  // Add any other relevant fields for a report
  patientName?: string; // Potentially useful for display
  patientPictureUrl?: string; // URL for patient's picture
  summary?: string; // A brief summary of the report
}
