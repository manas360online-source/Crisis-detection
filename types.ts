
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum PortalType {
  HOME = 'home',
  PATIENT = 'patient',
  THERAPIST = 'therapist'
}

export interface PHQ9Response {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
}

export interface DailyLogData {
  hoursOfSleep: number;
  sleepQuality: number;
  energyLevel: number;
  stressIntensity: number;
}

export interface AssessmentData {
  responses: PHQ9Response;
  dailyLog?: DailyLogData;
  phq9Score: number;
  gad7Score: number;
  textResponse: string;
  previousScore?: number;
  lastContactDays: number;
  timestamp: string;
}

export interface RiskAnalysis {
  score: number;
  level: RiskLevel;
  indicators: string[];
  sentimentScore: number;
  behaviorScore: number;
  timestamp: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age?: string;
  dob?: string;
  assessments: AssessmentData[];
  latestAnalysis?: RiskAnalysis;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  level: RiskLevel;
  message: string;
  timestamp: string;
  isRead: boolean;
}
