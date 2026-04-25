
import { config } from 'dotenv';
config();

import '@/ai/flows/kyc-id-data-extraction-flow.ts';
import '@/ai/flows/fraud-alert-explanation-flow.ts';
import '@/ai/flows/risk-assessment-flow.ts';
import '@/ai/flows/support-chat-flow.ts';
