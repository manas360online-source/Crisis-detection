
import { RiskLevel, AssessmentData, RiskAnalysis, PHQ9Response } from '../types';

export const calculateTotalScore = (responses: PHQ9Response): number => {
  return Object.values(responses).reduce((a, b) => a + b, 0);
};

export const calculateRisk = (data: AssessmentData, aiSentiment: number): RiskAnalysis => {
  const phq9Norm = (data.phq9Score / 27) * 100;
  const gad7Norm = (data.gad7Score / 21) * 100;
  
  const behaviorChangeScore = data.previousScore !== undefined && (data.phq9Score - data.previousScore > 5) ? 100 : 20;
  
  const rawRisk = (phq9Norm * 0.4) + (gad7Norm * 0.3) + (aiSentiment * 0.2) + (behaviorChangeScore * 0.1);
  const finalScore = Math.min(100, Math.max(0, rawRisk));

  let level = RiskLevel.LOW;
  const indicators: string[] = [];

  if (finalScore > 70) level = RiskLevel.CRITICAL;
  else if (finalScore >= 50) level = RiskLevel.HIGH;
  else if (finalScore >= 30) level = RiskLevel.MEDIUM;

  if (data.phq9Score > 20) indicators.push("Severe Depression (PHQ-9 > 20)");
  if (data.gad7Score > 15) indicators.push("Severe Anxiety (GAD-7 > 15)");
  if (data.responses.q9 > 0) indicators.push("Suicidal Ideation Detected (Q9)");
  if (data.lastContactDays > 30) indicators.push("No contact in >30 days");
  
  const keywords = ["suicide", "self-harm", "end it all", "hopeless", "kill"];
  if (keywords.some(k => data.textResponse.toLowerCase().includes(k))) {
    indicators.push("Crisis Keywords Detected");
  }

  return {
    score: Math.round(finalScore),
    level,
    indicators,
    sentimentScore: aiSentiment,
    behaviorScore: behaviorChangeScore,
    timestamp: new Date().toISOString()
  };
};

export const getResponseActions = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.CRITICAL:
      return [
        "Alert therapist immediately via SMS + Call",
        "Send crisis resources to patient",
        "Log incident in emergency registry",
        "Mandatory 24h follow-up scheduled"
      ];
    case RiskLevel.HIGH:
      return [
        "In-app therapist alert triggered",
        "Email sent to primary care provider",
        "Send crisis resources to patient",
        "Schedule urgent session within 48h"
      ];
    case RiskLevel.MEDIUM:
      return ["Flag for therapist routine review", "Send supportive message"];
    default:
      return ["Normal care protocol"];
  }
};
