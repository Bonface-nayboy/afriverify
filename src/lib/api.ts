import { kycIdDataExtraction } from '@/ai/flows/kyc-id-data-extraction-flow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface KYCResult {
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
}

export interface LivenessResult {
  isLive: boolean;
  score: number;
  session_id: string;
}

export interface AttendanceResult {
  userId: string;
  userName: string;
  confidence: number;
  timestamp: string;
}

export const api = {
  async verifyIdentity(idFront: string, idBack: string, selfie: string): Promise<KYCResult> {
    try {
      // Simulate backend delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Attempt OCR extraction using the GenAI flow
      const extracted = await kycIdDataExtraction({
        idFrontPhotoDataUri: idFront,
        idBackPhotoDataUri: idBack || undefined
      });

      // Mocking face matching and additional verification logic
      const faceMatchScore = 85 + Math.random() * 10;
      const livenessScore = 92 + Math.random() * 5;
      
      return {
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
        status: faceMatchScore > 80 ? 'VERIFIED' : 'SUSPICIOUS',
      };
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data if AI flow or endpoint fails
      return {
        ocr: {
          name: 'Kwame Mensah',
          idNumber: 'GHA-123456789-0',
          dob: '1988-05-15',
          expiry: '2028-12-31',
          documentType: 'Passport',
          country: 'Ghana',
        },
        faceMatchScore: 94.5,
        livenessScore: 98.2,
        status: 'VERIFIED',
      };
    }
  },

  async startLivenessSession(): Promise<{ sessionId: string }> {
    return { sessionId: Math.random().toString(36).substring(7) };
  },

  async submitLivenessFrame(sessionId: string, frame: string): Promise<LivenessResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      isLive: true,
      score: 95.5,
      session_id: sessionId
    };
  },

  async recognizeFace(image: string): Promise<AttendanceResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      userId: 'emp_001',
      userName: 'Ngozi Okonjo',
      confidence: 99.2,
      timestamp: new Date().toISOString()
    };
  }
};