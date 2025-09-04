
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">About CertiCheck Jharkhand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-foreground/80">
          <p>
            CertiCheck Jharkhand is a pioneering platform dedicated to revolutionizing academic certificate verification. 
            Our mission is to uphold academic integrity and combat the growing issue of certificate fraud across the state of Jharkhand.
          </p>
          <p>
            Leveraging cutting-edge technology, including AI-powered analysis, we provide a secure, fast, and reliable system for educational institutions, employers, and government agencies to verify the authenticity of academic credentials. 
            Our platform serves as a central repository, streamlining the verification process and eliminating the complexities of manual checks.
          </p>
          <p>
            We are committed to building a future where trust and transparency in academic achievements are paramount. By partnering with universities and colleges across Jharkhand, we are creating a robust ecosystem that protects the value of education and ensures that genuine qualifications are recognized and respected.
          </p>
          <h3 className="font-headline text-2xl pt-4">Our Vision</h3>
          <p>
            To be the gold standard for academic certificate verification in India, fostering a culture of authenticity and trust that empowers students, educational institutions, and employers alike.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
