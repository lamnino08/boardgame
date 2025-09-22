import { App_Setting } from '@/constant/app';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const PrivacyPolicyPage = () => {
  const effectiveDate = "September 22, 2025";
  const contactEmail = "[your-contact-email@example.com]";

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 text-text-primary">
      <h1 className="text-xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4 text-text-secondary">Last Updated: {effectiveDate}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to {App_Setting.app_name}. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
          <p className="mb-2">We may collect, use, store, and transfer different kinds of personal data about you, including but not limited to:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Identity Data:</strong> Such as your name or username.</li>
            <li><strong>Contact Data:</strong> Such as your email address.</li>
            <li><strong>Technical Data:</strong> Such as your IP address, browser type, and device information.</li>
            <li><strong>Usage Data:</strong> Such as information about how you use our website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to personalize content, to communicate with you, and to ensure the security of our website.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold mb-2">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, but some parts of our service may not function properly without them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We use appropriate security measures to protect your data, but please be aware that no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Your Data Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. Please contact us to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Children's Privacy</h2>
          <p>
            Our service is not intended for children under the age of 13, and we do not knowingly collect data from them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: {contactEmail}.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
