
'use server';

/**
 * @fileOverview A flow for registering a new user in Firestore.
 *
 * - registerUser - A function that handles new user registration.
 * - RegisterUserInput - The input type for the registerUser function.
 * - RegisterUserOutput - The return type for the registerUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createHash } from 'crypto';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';


const RegisterUserInputSchema = z.object({
  email: z.string().email().describe("The user's email address."),
  password: z.string().min(8).describe("The user's password (at least 8 characters)."),
  role: z.enum(["User", "Institution", "Super Admin"]).describe("The role of the user."),
});
export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

const RegisterUserOutputSchema = z.object({
  success: z.boolean().describe("Whether the registration was successful."),
  message: z.string().describe("A message indicating the result of the operation."),
});
export type RegisterUserOutput = z.infer<typeof RegisterUserOutputSchema>;

function hashPassword(password: string): string {
    const sha256 = createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}


export async function registerUser(input: RegisterUserInput): Promise<RegisterUserOutput> {
  return registerUserFlow(input);
}

const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: RegisterUserOutputSchema,
  },
  async ({ email, password, role }) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'A user with this email address already exists.',
      };
    }

    const hashedPassword = hashPassword(password);

    const newUser = {
      email,
      password: hashedPassword,
      role,
      createdAt: serverTimestamp(),
    };
    
    await addDoc(usersRef, newUser);

    return {
      success: true,
      message: 'User registered successfully. You can now log in.',
    };
  }
);
