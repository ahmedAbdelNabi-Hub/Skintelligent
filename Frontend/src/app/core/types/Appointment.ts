type Appointment = {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  appointmentDate: string; // datetime
  status: string;
  createdDate: string; // datetime
  updatedDate: string; // datetime
};

type AppointmentSlot = {
  slotId: number;
  doctorId: number;
  startTime: string; // datetime
  endTime: string; // datetime
  maxPatients: number;
  bookedPatients?: number;
  isAvailable: boolean;
  createdDate: string; // datetime
  updatedDate: string; // datetime
};
