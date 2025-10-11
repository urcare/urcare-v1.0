import React from "react";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Legal: React.FC = () => {
  const effectiveDate = formatDate(new Date());

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Legal</h1>

        {/* Ownership Information */}
        <section className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium">
              UrCare is owned by AAKARSHAK SAINI
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Privacy Policy
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Effective Date: {effectiveDate}
          </p>

          <div className="prose prose-gray max-w-none">
            <h3>1. Information We Collect</h3>
            <ul>
              <li>
                Account information (name, email address, phone number, date of
                birth)
              </li>
              <li>
                Health information (medical history, current conditions,
                symptoms, lifestyle habits)
              </li>
              <li>
                Usage data (app interactions, feature usage, progress tracking)
              </li>
              <li>
                Device information (device type, operating system, unique device
                identifiers)
              </li>
              <li>Communication preferences and feedback</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <ul>
              <li>
                Provide personalized lifestyle recommendations and health
                guidance
              </li>
              <li>
                Track your progress and adjust recommendations accordingly
              </li>
              <li>Communicate with you about your account and app updates</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>

            <h3>3. Information Sharing and Disclosure</h3>
            <p>
              We do not sell, rent, or trade your personal health information.
              We may share your information only:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>
                To protect the rights, property, or safety of our company,
                users, or others
              </li>
              <li>
                With service providers who assist in operating our app (under
                strict confidentiality agreements)
              </li>
              <li>In aggregated, anonymized form for research purposes</li>
            </ul>

            <h3>4. Data Security</h3>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>
                Limited access to personal information on a need-to-know basis
              </li>
              <li>Secure data centers with physical and digital protection</li>
            </ul>

            <h3>5. Your Rights and Choices</h3>
            <ul>
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of non-essential communications</li>
              <li>Request restrictions on data processing</li>
            </ul>

            <h3>6. Data Retention</h3>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide services. After account deletion, we may
              retain certain information as required by law or for legitimate
              business purposes.
            </p>

            <h3>7. Children's Privacy</h3>
            <p>
              Our app is not intended for children under 13. We do not knowingly
              collect information from children under 13. If we discover such
              information, we will promptly delete it.
            </p>

            <h3>8. Changes to This Policy</h3>
            <p>
              We may update this policy periodically. We will notify you of
              material changes via email or app notification.
            </p>

            <h3>9. Contact Information</h3>
            <p>
              For privacy-related questions or concerns, contact us at:{" "}
              <a href="mailto:privacy@yourapp.com">privacy@yourapp.com</a>
            </p>
          </div>
        </section>

        <hr className="my-10" />

        {/* Terms and Conditions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Terms and Conditions
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Effective Date: {effectiveDate}
          </p>

          <div className="prose prose-gray max-w-none">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using our healthcare app, you agree to be bound by
              these Terms and Conditions. If you do not agree, please do not use
              our services.
            </p>

            <h3>2. Service Description</h3>
            <p>
              Our app provides educational information and lifestyle guidance
              for managing and potentially reversing certain health conditions
              through natural methods. We focus on lifestyle modifications
              including diet, exercise, sleep, and stress management.
            </p>

            <h3>3. Medical Disclaimer</h3>
            <p>
              Our app provides general health information and is not a
              substitute for professional medical advice, diagnosis, or
              treatment. Always consult with qualified healthcare providers
              before making changes to your health regimen. In case of medical
              emergencies, contact emergency services immediately.
            </p>

            <h3>4. User Responsibilities</h3>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Use the app only for lawful purposes</li>
              <li>Not share your account credentials with others</li>
              <li>Follow recommendations at your own discretion and risk</li>
              <li>
                Consult healthcare providers before implementing significant
                lifestyle changes
              </li>
            </ul>

            <h3>5. Intellectual Property</h3>
            <p>
              All content, features, and functionality of the app are owned by
              us and protected by intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our
              written permission.
            </p>

            <h3>6. Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms, provide false information, engage in fraudulent
              activity, or misuse the app or its features.
            </p>

            <h3>7. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of the app. Our total liability
              shall not exceed the amount paid by you for the services in the
              past 12 months.
            </p>

            <h3>8. Indemnification</h3>
            <p>
              You agree to indemnify and hold us harmless from any claims,
              damages, or expenses arising from your use of the app or violation
              of these terms.
            </p>

            <h3>9. Governing Law</h3>
            <p>
              These terms shall be governed by the laws of your jurisdiction,
              without regard to conflict of law principles.
            </p>

            <h3>10. Modifications</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the app after changes constitutes acceptance of the
              modified terms.
            </p>

            <h3>11. Contact Information</h3>
            <p>
              For questions about these terms, contact us at:{" "}
              <a href="mailto:urcarein@gmail.com">urcarein@gmail.com</a>
            </p>
          </div>
        </section>

        <hr className="my-10" />

        {/* Refund Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Refund Policy
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Effective Date: {effectiveDate}
          </p>

          <div className="prose prose-gray max-w-none">
            <h3>1. 30-Day Results Guarantee</h3>
            <p>
              We offer a 30-day refund guarantee for users who do not achieve
              measurable health improvements despite consistent app usage and
              adherence to recommendations.
            </p>

            <h3>2. Eligibility Requirements</h3>
            <ul>
              <li>Have used the app for a minimum of 30 consecutive days</li>
              <li>
                Provide proof of daily app usage (minimum 15 minutes per day)
              </li>
              <li>
                Complete all recommended daily activities at least 80% of the
                time
              </li>
              <li>
                Submit progress tracking data showing compliance with lifestyle
                recommendations
              </li>
              <li>
                Provide documentation of no measurable improvement in targeted
                health metrics
              </li>
            </ul>

            <h3>3. Proof of Continuous Usage</h3>
            <p>
              Acceptable proof includes app usage logs, completed daily
              check-ins, food diary entries (if applicable), exercise logs (if
              applicable), sleep tracking data (if applicable), and before/after
              health metrics from qualified healthcare providers.
            </p>

            <h3>4. Refund Process</h3>
            <ul>
              <li>
                Submit a refund request within 35 days of initial purchase
              </li>
              <li>
                Provide all required documentation of app usage and compliance
              </li>
              <li>
                Include a statement explaining which recommendations were
                followed
              </li>
              <li>Allow up to 10 business days for review of your request</li>
            </ul>

            <h3>5. Refund Determination</h3>
            <p>
              Our team will review your submission to verify consistent usage,
              genuine effort, accuracy of documentation, and absence of
              contraindications that would prevent success.
            </p>

            <h3>6. Partial Refunds</h3>
            <p>
              We may offer partial refunds for partial compliance (50-79%
              adherence), verified technical issues, or documented medical
              conditions that emerged during the program.
            </p>

            <h3>7. Non-Refundable Circumstances</h3>
            <ul>
              <li>Failure to use the app consistently</li>
              <li>Non-compliance with lifestyle recommendations</li>
              <li>Unrealistic expectations or timeframes</li>
              <li>Pre-existing conditions not disclosed at signup</li>
              <li>Users who achieved some improvement but expected more</li>
              <li>Requests made after 35 days from purchase</li>
            </ul>

            <h3>8. Refund Method</h3>
            <p>
              Approved refunds will be processed to the original payment method
              within 5-10 business days, minus any transaction fees if
              applicable. App access will terminate immediately upon approval.
            </p>

            <h3>9. One-Time Policy</h3>
            <p>
              Each user is eligible for only one refund. Previous refund
              recipients cannot re-subscribe to the service.
            </p>

            <h3>10. Dispute Resolution</h3>
            <p>
              If your refund request is denied and you disagree with our
              decision, you may request a secondary review with additional
              documentation, seek resolution through our customer support team,
              or pursue dispute resolution as outlined in our Terms and
              Conditions.
            </p>

            <h3>11. Contact Information</h3>
            <p>
              For refund requests and inquiries, contact us at:{" "}
              <a href="mailto:urcarein@gmail.com">urcarein@gmail.com</a>
            </p>

            <h3>Copyright and Ownership</h3>
            <p className="text-gray-500 text-xs">
            This website is owned by AAKARSHAK SAINI
          </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Legal;
