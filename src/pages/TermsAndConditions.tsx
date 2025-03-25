import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Fyxters services, you agree to be bound by these Terms and Conditions. 
            If you disagree with any part of the terms, you may not access or use our services.
          </p>

          <h2>2. Service Description</h2>
          <p>
            Fyxters provides mobile device repair services, including but not limited to screen repairs, 
            battery replacements, and diagnostics. Our technicians may perform these services at our repair centers 
            or at your location through our on-site service.
          </p>

          <h2>3. Repair Guarantees</h2>
          <p>
            All repairs come with a standard 3-month guarantee covering defects in parts and workmanship. 
            This guarantee does not cover damage resulting from accidents, misuse, or further damage to the device 
            after the repair service has been completed.
          </p>

          <h2>4. Diagnostic Services</h2>
          <p>
            The $30 diagnostic fee is applied when you choose our diagnostic service. If you proceed with 
            a repair after diagnosis, this fee will be deducted from the total repair cost. The diagnostic fee is 
            non-refundable if you decide not to proceed with the recommended repairs.
          </p>

          <h2>5. Payment and Fees</h2>
          <p>
            Payment is required before the repair service begins. All prices quoted are in USD and include standard parts 
            and labor. Additional charges may apply for premium parts or services, which will be clearly communicated before 
            any work begins.
          </p>

          <h2>6. Data and Privacy</h2>
          <p>
            Fyxters is not responsible for any data loss that may occur during the repair process. We recommend backing up 
            your device before submitting it for repair. Any personal information collected will be handled in accordance with 
            our Privacy Policy.
          </p>

          <h2>7. Unclaimed Devices</h2>
          <p>
            Devices left unclaimed for more than 30 days after the repair is completed may be subject to storage fees or 
            disposed of in accordance with local regulations.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Fyxters shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
            or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            Fyxters reserves the right to modify these terms at any time. We will provide notice of significant changes 
            by posting an announcement on our website. Your continued use of our services after such modifications will 
            constitute your acknowledgment and acceptance of the modified terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which 
            Fyxters operates, without regard to its conflict of law principles.
          </p>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <p className="text-gray-600 text-sm">
            Last updated: June 15, 2025
          </p>
        </div>
      </div>
    </div>
  );
}