
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p className="text-sm text-muted-foreground">Last updated: July 24, 2024</p>
          
          <h3 className="font-bold text-xl pt-2">1. Introduction</h3>
          <p>
            CertiCheck Jharkhand ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h3 className="font-bold text-xl pt-2">2. Information We Collect</h3>
          <p>
            We may collect personal identification information, including but not limited to, names, email addresses, and certificate details (student name, roll number, certificate ID) that you provide to us for verification purposes. We also collect data from institutions regarding issued certificates.
          </p>

          <h3 className="font-bold text-xl pt-2">3. How We Use Your Information</h3>
          <p>
            The information we collect is used solely for the purpose of verifying academic certificates. This includes:
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Processing verification requests.</li>
              <li>Communicating with users and institutions regarding verification status.</li>
              <li>Maintaining a secure and auditable log of verification activities.</li>
              <li>Analyzing verification data to identify patterns of potential fraud (as performed by our AI tools).</li>
            </ul>
          </p>

          <h3 className="font-bold text-xl pt-2">4. Data Security</h3>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. All data is stored on secure servers, and access is restricted to authorized personnel only.
          </p>

          <h3 className="font-bold text-xl pt-2">5. Data Sharing and Disclosure</h3>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. Verification results are shared only with the user who initiated the request. Anonymized and aggregated data may be used for statistical analysis and reporting.
          </p>

          <h3 className="font-bold text-xl pt-2">6. Your Consent</h3>
          <p>
            By using our platform, you consent to our privacy policy.
          </p>

          <h3 className="font-bold text-xl pt-2">7. Changes to Our Privacy Policy</h3>
          <p>
            If we decide to change our privacy policy, we will post those changes on this page.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
