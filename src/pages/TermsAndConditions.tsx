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
      By accessing or using any Fyxters services, including booking a repair, communicating with a technician,
      or using our website or platform, you agree to be bound by these Terms and Conditions. If you do not agree
      to these Terms, you may not use our services.
    </p>

    <h2>2. Service Description</h2>
    <p>
      Fyxters provides repair services for mobile phones, tablets, laptops, and other electronic devices. Services
      may include, but are not limited to: screen repairs, battery replacements, charging port repairs, diagnostic
      services, and on-site or in-shop repairs. Repairs may be performed by Fyxters technicians or independent
      technicians operating through the Fyxters platform.
    </p>

    <h2>3. Repair Guarantee</h2>
    <p>
      All eligible repairs include a 3-month limited warranty covering defects in parts and workmanship. This
      warranty does not cover physical damage after the repair, water or liquid exposure, misuse, accidental drops,
      or any tampering or third-party repairs performed after service by Fyxters. Warranty decisions are made at the
      discretion of Fyxters after inspection.
    </p>

    <h2>4. Diagnostic Services</h2>
    <p>
      A $30 diagnostic fee applies when you request a device evaluation. If you proceed with a repair, the fee is
      deducted from the final repair cost. If you choose not to repair the device, the diagnostic fee is
      non-refundable. Some issues may require extended testing, and you will be informed before additional steps
      are taken.
    </p>

    <h2>5. Payment and Fees</h2>
    <p>
      Payment is required before the repair begins unless otherwise indicated. All prices listed are in CAD (or
      local currency where applicable) and include standard labor and standard-quality parts. Premium or original
      parts may incur additional charges, which will be communicated before work begins. Fyxters reserves the right
      to cancel a repair if payment is not completed.
    </p>

    <h2>6. Data & Privacy</h2>
    <p>
      Because repairs may require opening or testing your device, Fyxters is not responsible for any data loss that
      may occur. We strongly recommend backing up your device before the repair. Any personal information collected
      by Fyxters is handled in compliance with our Privacy Policy.
    </p>

    <h2>7. Unclaimed Devices</h2>
    <p>
      Devices not picked up or responded to within 30 days of repair completion may be subject to storage fees,
      disposal, or recycling. Fyxters will attempt to contact the customer before any final action is taken.
    </p>

    <h2>8. Limitation of Liability</h2>
    <p>
      To the fullest extent permitted by law, Fyxters is not liable for indirect, incidental, or consequential
      damages; loss of data, profits, or revenue; device failures unrelated to the repair performed; or damages
      caused by pre-existing issues or hidden defects. Fyxters’ total liability for any claim is limited to the
      amount paid for the repair service.
    </p>

    <h2>9. Modifications to Terms</h2>
    <p>
      Fyxters may update or modify these Terms and Conditions at any time. Significant changes will be communicated
      through website announcements, email notifications, or platform updates. Continued use of Fyxters services
      after updates constitutes acceptance of the revised Terms.
    </p>

    <h2>10. Governing Law</h2>
    <p>
      These Terms and Conditions are governed by the laws of the jurisdiction in which Fyxters operates, without
      regard to conflict-of-law rules. Any disputes shall be resolved in the courts of that jurisdiction.
    </p>

    <h2>11. Platform Payments and Prohibited Off-Platform Transactions</h2>
    <p>
      All payments for Fyxters services must be made exclusively through the Fyxters platform. Customers may not pay
      technicians directly in cash, e-transfer, or any other method outside the platform unless expressly authorized
      in writing by Fyxters.
    </p>
    <p>
      Technicians are strictly prohibited from redirecting customers outside the Fyxters platform for the purpose of
      completing a repair, accepting payment, negotiating prices, or booking future services. Any attempt by a
      technician or customer to arrange off-platform payment or services without approval may result in cancellation
      of the repair, invalidation of warranties, suspension or removal of the technician, or refusal of future
      service to the customer.
    </p>
    <p>
      Fyxters is not responsible for any loss, damage, warranty issues, or disputes arising from services performed
      or payments made outside the Fyxters platform. Use of the platform implies agreement to complete all
      communication, booking, and payment through Fyxters only.
    </p>

  </div>
</div>
