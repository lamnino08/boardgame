import { Metadata } from 'next';
import { App_Setting } from '@/constant/app';
import React from 'react';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

const TermsOfServicePage = () => {
  const companyName = "[Your Company Name]";
  const effectiveDate = "September 22, 2025";

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 text-text-primary">
      <h1 className="text-xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="mb-4 text-text-secondary">Last Updated: {effectiveDate}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            Welcome to {App_Setting.app_name}. By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Content and Intellectual Property</h2>
          <p className="mb-2">
            All content on {App_Setting.app_name}, including articles, images, videos, logos, and trademarks, is the property of {companyName} or its content suppliers and is protected by international copyright and intellectual property laws.
          </p>
          <p>
            You may access the content for your personal, non-commercial use only. You may not copy, reproduce, distribute, publish, display, perform, modify, or create derivative works from any part of our service without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. User Conduct</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that could harm, disable, overburden, or impair the website. You agree not to post or transmit any material that is defamatory, obscene, threatening, invasive of privacy, or otherwise objectionable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. User-Generated Content</h2>
          <p>
            If you post comments or other content, you grant {companyName} a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and publish such content. You are solely responsible for the content you post and represent that you have the right to do so.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Disclaimers</h2>
          <p className="mb-2">
            The information provided on {App_Setting.app_name} is for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information. Any reliance you place on such information is strictly at your own risk.
          </p>
          <p>
            The service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Limitation of Liability</h2>
          <p>
            In no event shall {companyName}, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangibles, arising out of or in connection with your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites or services that are not owned or controlled by {companyName}. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at [your-contact-email@example.com].
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
