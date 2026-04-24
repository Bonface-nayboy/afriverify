
'use client';

import { kycIdDataExtraction } from '@/ai/flows/kyc-id-data-extraction-flow';
import { explainFraudAlert } from '@/ai/flows/fraud-alert-explanation-flow';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

export interface KYCResult {
  id?: string;
  ocr: {
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
}

export interface AttendanceResult {
  id?: string;
  userId: string;
  userName: string;
  confidence: number;
  timestamp: string;
}

export const api = {
  async verifyIdentity(idFront: string, idBack: string, selfie: string): Promise<KYCResult> {
    try {
      // Attempt OCR extraction using the GenAI flow
      const extracted = await kycIdDataExtraction({
        idFrontPhotoDataUri: idFront,
        idBackPhotoDataUri: idBack || undefined
      });

      // Simulated logic for scores
      const faceMatchScore = 75 + Math.random() * 25;
      const livenessScore = 80 + Math.random() * 20;
      const status = faceMatchScore > 85 && livenessScore > 90 ? 'VERIFIED' : 'SUSPICIOUS';

      const result: KYCResult = {
        ocr: {
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
        timestamp: new Date().toISOString()
      };

      // If suspicious, get AI explanation
      if (status === 'SUSPICIOUS') {
        const explanation = await explainFraudAlert({
          verificationId: 'temp-' + Date.now(),
          ocrData: JSON.stringify(result.ocr),
          faceMatchScore,
          livenessScore,
          fraudFlags: faceMatchScore < 85 ? ['Low Face Match'] : ['Potential Spoofing'],
          riskScore: 100 - faceMatchScore,
          timestamp: result.timestamp
        });
        result.aiExplanation = explanation.explanation;
      }

      // Save to Firestore
      if (firestore) {
        const docRef = await addDoc(collection(firestore, 'verifications'), {
          ...result,
          createdAt: serverTimestamp()
        });
        result.id = docRef.id;
      }

      return result;
    } catch (error) {
      console.error('KYC Verification Error:', error);
      throw error;
    }
  },

  async recognizeFace(image: string): Promise<AttendanceResult> {
    try {
      // Simulation of face matching
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: AttendanceResult = {
        userId: 'emp_' + Math.floor(Math.random() * 1000),
        userName: 'Ngozi Okonjo',
        confidence: 98 + Math.random() * 2,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      if (firestore) {
        const docRef = await addDoc(collection(firestore, 'attendance'), {
          ...result,
          createdAt: serverTimestamp()
        });
        result.id = docRef.id;
      }

      return result;
    } catch (error) {
      console.error('Attendance Recognition Error:', error);
      throw error;
    }
  },

  async getRecentVerifications(count = 5): Promise<KYCResult[]> {
    if (!firestore) return [];
    const q = query(collection(firestore, 'verifications'), orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KYCResult));
  }
};
