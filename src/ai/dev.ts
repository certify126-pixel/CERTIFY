
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-verification-results.ts';
import '@/ai/flows/add-certificate-flow.ts';
import '@/ai/flows/verify-certificate-flow.ts';
import '@/ai/flows/verify-certificate-with-ocr-flow.ts';
import '@/ai/flows/register-user-flow.ts';
import '@/ai/flows/login-user-flow.ts';
