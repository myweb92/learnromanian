import React from 'react';
import { BookOpen } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 bg-white rounded-3xl border border-slate-200 shadow-sm anim-fade-in">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">Terms of Service</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Learn with Niran, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">2. Description of Service</h2>
          <p>
            Learn with Niran provides language learning tools, including interactive scenarios, SRS flashcards, and progress tracking. We reserve the right to modify, suspend, or discontinue the service at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">3. User Accounts</h2>
          <p>
            You are responsible for safeguarding your account credentials. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">4. Advertising and Monetization</h2>
          <p>
            Our service is supported by advertising revenue. By using the service, you agree to the placement of advertisements (such as Google AdSense) within the application interface. The content of these ads is provided by third-party networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-800">5. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.
          </p>
        </section>
      </div>
    </div>
  );
}
