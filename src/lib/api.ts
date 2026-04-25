
'use client';

import { kycIdDataExtraction } from '@/ai/flows/kyc-id-data-extraction-flow';
import { explainFraudAlert } from '@/ai/flows/fraud-alert-explanation-flow';
import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const { firestore } = initializeFirebase();

// Mock company ID for multi-tenancy demonstration
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
}

export const api = {
  async verifyIdentity(idFront: string, idBack: string, selfie: string): Promise<KYCResult> {
    try {
      const extracted = await kycIdDataExtraction({
        idFrontPhotoDataUri: idFront,
        idBackPhotoDataUri: idBack || undefined
      });

      const faceMatchScore = 75 + Math.random() * 25;
      const livenessScore = 80 + Math.random() * 20;
      const status = faceMatchScore > 85 && livenessScore > 90 ? 'VERIFIED' : 'SUSPICIOUS';

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
        status,
        timestamp: new Date().toISOString(),
        companyId: MOCK_COMPANY_ID
      };

      if (status === 'SUSPICIOUS') {
        const explanation = await explainFraudAlert({
          verificationId: 'temp-' + Date.now(),
          ocrData: JSON.stringify(result.ocrData),
          faceMatchScore,
          livenessScore,
          fraudFlags: faceMatchScore < 85 ? ['Low Face Match'] : ['Potential Spoofing'],
          riskScore: 100 - faceMatchScore,
          timestamp: result.timestamp
        });
        result.aiExplanation = explanation.explanation;
      }

      if (firestore) {
        const dataToSave = {
          ...result,
          createdAt: serverTimestamp()
        };
        addDoc(collection(firestore, 'verifications'), dataToSave)
          .catch(async (error) => {
            const permissionError = new FirestorePermissionError({
              path: 'verifications',
              operation: 'create',
              requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
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
      companyId: MOCK_COMPANY_ID
    };
    addDoc(collection(firestore, 'verifications'), {
      ...data,
      ocrData: { name: "Biometric Session", idNumber: "N/A", dob: "N/A", expiry: "N/A", documentType: "Liveness", country: "Local" }
    }).catch(async () => {
       const permissionError = new FirestorePermissionError({
          path: 'verifications',
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  },

  async recognizeFace(image: string): Promise<AttendanceResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: AttendanceResult = {
        userId: 'emp_' + Math.floor(Math.random() * 1000),
        userName: 'Ngozi Okonjo',
        confidence: 98 + Math.random() * 2,
        timestamp: new Date().toISOString(),
        companyId: MOCK_COMPANY_ID
      };

      if (firestore) {
        const dataToSave = {
          ...result,
          createdAt: serverTimestamp()
        };
        addDoc(collection(firestore, 'attendance'), dataToSave)
          .catch(async () => {
            const permissionError = new FirestorePermissionError({
              path: 'attendance',
              operation: 'create',
              requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  async submitEnterpriseLead(lead: { userId: string; email: string; company: string; featureOfInterest: string }) {
    if (!firestore) return;
    const data = {
      ...lead,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    addDoc(collection(firestore, 'leads'), data)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'leads',
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }
};
