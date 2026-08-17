import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-sm anim-fade-in">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Privacy Policy</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">1. Information We Collect</h2>
          <p>
            When you use Learn with Niran, we collect information you provide directly to us (such as when you create an account) and information about your use of the service (such as your learning progress, completed scenarios, and XP gained).
          </p>
          <p>
            <strong>For AdSense:</strong> Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and improve our services, track your learning progress, and personalize your experience. We may also use the information to serve you relevant advertisements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">3. Third-Party Services & Ads</h2>
          <p>
            We use Google AdSense to display advertisements. AdSense uses cookies to serve ads based on your visits to our site. You may opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" className="text-indigo-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Ads Settings</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information. Your learning progress is securely stored using Google Cloud Firebase infrastructure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through the provided support channels in the application.
          </p>
        </section>
      </div>
    </div>
  );
}
