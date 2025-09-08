
'use server';

/**
 * @fileOverview A flow for logging in a user against Firestore.
 *
 * - loginUser - A function that handles user login.
 * - LoginUserInput - The input type for the loginUser function.
 * - LoginUserOutput - The return type for the loginUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createHash } from 'crypto';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


const LoginUserInputSchema = z.object({
  email: z.string().email().describe("The user's email address."),
  password: z.string().describe("The user's password."),
});
export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;

const LoginUserOutputSchema = z.object({
  success: z.boolean().describe("Whether the login was successful."),
  message: z.string().describe("A message indicating the result of the operation."),
  user: z.object({
      id: z.string(),
      email: z.string(),
      role: z.string(),
  }).optional(),
});
export type LoginUserOutput = z.infer<typeof LoginUserOutputSchema>;

function hashPassword(password: string): string {
    const sha256 = createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}


export async function loginUser(input: LoginUserInput): Promise<LoginUserOutput> {
  return loginUserFlow(input);
}

const loginUserFlow = ai.defineFlow(
  {
    name: 'loginUserFlow',
    inputSchema: LoginUserInputSchema,
    outputSchema: LoginUserOutputSchema,
  },
  async ({ email, password }) => {
    // Super Admin special login
    if (email === 'admin@qcertify.com' && password === '123456789') {
        return {
            success: true,
            message: 'Super Admin login successful.',
            user: {
                id: 'super-admin',
                email: 'admin@qcertify.com',
                role: 'Super Admin',
            }
        };
    }
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }
    
    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    const hashedPassword = hashPassword(password);
    
    if (user.password !== hashedPassword) {
        return {
            success: false,
            message: 'Invalid email or password.',
        };
    }

    return {
      success: true,
      message: 'Login successful.',
      user: {
        id: userDoc.id,
        email: user.email,
        role: user.role,
      }
    };
  }
);
