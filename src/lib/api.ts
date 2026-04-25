
'use client';

import { kycIdDataExtraction } from '@/ai/flows/kyc-id-data-extraction-flow';
import { explainFraudAlert } from '@/ai/flows/fraud-alert-explanation-flow';
import { assessRisk } from '@/ai/flows/risk-assessment-flow';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const { firestore } = initializeFirebase();
const MOCK_COMPANY_ID = 'comp_default_01';

export interface KYCResult {
  id?: string;
  ocrData: {
    name: string;
    idNumber: string;
    dob: string;
    expiry: string;
    documentType: string;
    country: string;
  };
  faceMatchScore: number;
  livenessScore: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'VERIFIED' | 'SUSPICIOUS' | 'FAILED';
  timestamp: string;
  aiExplanation?: string;
  companyId?: string;
}

export interface AttendanceResult {
  id?: string;
  userId: string;
  userName: string;
  confidence: number;
  timestamp: string;
  companyId?: string;
  location?: { lat: number; lng: number };
}

export const api = {
  async verifyIdentity(idFront: string, idBack: string, selfie: string): Promise<KYCResult> {
    try {
      // 1. OCR Extraction
      const extracted = await kycIdDataExtraction({
        idFrontPhotoDataUri: idFront,
        idBackPhotoDataUri: idBack || undefined
      });

      // 2. Simulated Biometric Analysis
      const faceMatchScore = 75 + Math.random() * 25;
      const livenessScore = 80 + Math.random() * 20;

      // 3. AI Risk Assessment
      const riskResult = await assessRisk({
        livenessScore,
        faceMatchScore,
        documentType: extracted.documentType,
        country: extracted.issuingCountry,
        behavioralSignals: livenessScore < 85 ? ['Low blink rate'] : []
      });

      const status = riskResult.riskLevel === 'LOW' ? 'VERIFIED' : 'SUSPICIOUS';

      const result: KYCResult = {
        ocrData: {
          name: extracted.name,
          idNumber: extracted.idNumber,
          dob: extracted.dateOfBirth,
          expiry: extracted.expiryDate,
          documentType: extracted.documentType,
          country: extracted.issuingCountry,
        },
        faceMatchScore,
        livenessScore,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        status,
        timestamp: new Date().toISOString(),
        companyId: MOCK_COMPANY_ID,
        aiExplanation: riskResult.explanation
      };

      if (firestore) {
        const dataToSave = { ...result, createdAt: serverTimestamp() };
        addDoc(collection(firestore, 'verifications'), dataToSave)
          .catch(async () => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: 'verifications',
              operation: 'create',
              requestResourceData: dataToSave
            }));
          });
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  async recordLivenessCheck(score: number, status: 'SUCCESS' | 'FAILED') {
    if (!firestore) return;
    const data = {
      livenessScore: score,
      status,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
      companyId: MOCK_COMPANY_ID,
      ocrData: { name: "Biometric Session", idNumber: "N/A", dob: "N/A", expiry: "N/A", documentType: "Liveness", country: "Local" }
    };
    addDoc(collection(firestore, 'verifications'), data).catch(() => {});
  },

  async recognizeFace(image: string): Promise<AttendanceResult> {
    const result: AttendanceResult = {
      userId: 'emp_' + Math.floor(Math.random() * 1000),
      userName: 'Ngozi Okonjo',
      confidence: 98 + Math.random() * 2,
      timestamp: new Date().toISOString(),
      companyId: MOCK_COMPANY_ID,
      location: { lat: 6.5244, lng: 3.3792 }
    };

    if (firestore) {
      addDoc(collection(firestore, 'attendance'), { ...result, createdAt: serverTimestamp() }).catch(() => {});
    }
    return result;
  },

  async submitEnterpriseLead(lead: any) {
    if (!firestore) return;
    addDoc(collection(firestore, 'leads'), { ...lead, timestamp: new Date().toISOString(), createdAt: serverTimestamp() }).catch(() => {});
  }
};
