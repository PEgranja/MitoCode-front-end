import { Patient } from "./patient";

export class VitalSign {
  idVitalSign: number;
  patient: Patient;
  dateSelected: string;
  temperature: string;
  pulse: string;
  respiratoryRate: string;
}
