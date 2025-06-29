export interface IChatMessage {
    from: string;
    role: 'clinic' | 'doctor';
    clinicId?: number;
    username? : string ;
    message: string;
    timestamp: string;
    isSelf? : boolean;
}