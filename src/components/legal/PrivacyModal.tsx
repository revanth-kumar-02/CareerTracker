import React from 'react';
import LegalOverlayLayout from './LegalOverlayLayout';
import LegalSection from './LegalSection';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <LegalOverlayLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      subtitle="Last updated: May 20, 2026 • How we protect and respect your data"
      icon="shield"
      acknowledgment="By entering this career workspace, you consent to the secure collection and privacy practices outlined in this policy."
      copyright="© 2026 CareerTrack AI · Built on a foundation of user trust"
    >
      <div className="space-y-4">
        {/* Intro */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-2xl p-5 mb-2">
          <p className="text-xs md:text-[13px] text-on-surface leading-relaxed font-semibold">
            At <strong className="text-primary">CareerTrack AI</strong>, your privacy and trust are paramount. We believe in transparency and absolute data ownership. This policy explains what information we process, how we keep it safe, and the robust choices you have over your data.
          </p>
        </div>

        {/* Section 1 */}
        <LegalSection number={1} title="Information We Collect" icon="database" isOpen={true}>
          <p>
            To guide your career journey and provide personalized coaching, we process specific inputs that you voluntarily provide while interacting with our platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Your account credentials (email and full name).</li>
            <li>Profile metadata (your target career role, learning goals, and briefing notes).</li>
            <li>ATS resume text, uploaded files, and mock interview transcripts.</li>
          </ul>
        </LegalSection>

        {/* Section 2 */}
        <LegalSection number={2} title="Authentication Data" icon="key">
          <p>
            When you create an account, log in, or sign up, your credentials are processed via our high-reliability **Cloud Infrastructure**.
          </p>
          <p>
            We enforce modern, industry-standard authentication protocols. Your passwords are encrypted at the client level and are never visible to our administrators, developers, or any unauthorized third parties.
          </p>
        </LegalSection>

        {/* Section 3 */}
        <LegalSection number={3} title="Learning Progress Data" icon="insights">
          <p>
            To keep you motivated and celebrate your achievements, we collect performance analytics and career growth metrics.
          </p>
          <p>
            This includes tracking your active learning streaks, daily challenge check-ins, earned XP, generated career roadmaps, and completed simulator milestones. This data is exclusively used to visualize your progress.
          </p>
        </LegalSection>

        {/* Section 4 */}
        <LegalSection number={4} title="Resume & Interview Data" icon="description">
          <p>
            Any text, resume documents, or career history drafts you submit in the **Resume Lab** are processed to provide immediate feedback on ATS compatibility and formatting.
          </p>
          <p>
            Similarly, raw audio transcripts and scores from your **Interview Simulator** are analyzed to suggest coaching tips and communication upgrades. This data belongs exclusively to you.
          </p>
        </LegalSection>

        {/* Section 5 */}
        <LegalSection number={5} title="Cookies & Sessions" icon="cookie">
          <p>
            We use minimal cookies and secure local storage mechanisms within your browser context to enhance your onboarding and navigation experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>**Session Tokens**: Keep you logged in securely so you don't have to retype details.</li>
            <li>**Theme Preferences**: Remember your preference between light mode and dark mode.</li>
            <li>**Offline Backups**: Cache profile details locally to enable quick page loads and offline fallback support.</li>
          </ul>
        </LegalSection>

        {/* Section 6 */}
        <LegalSection number={6} title="How Data Is Used" icon="psychology">
          <p>
            Your information is processed for sole purpose of fueling your personalized career workspace. We do **not** sell, rent, or trade your personal profile data to advertisers or marketers.
          </p>
          <p>
            Specifically, your data is utilized to generate personalized career paths, tailor interview questions, compute ATS scores, and send important service alerts (like security notifications).
          </p>
        </LegalSection>

        {/* Section 7 */}
        <LegalSection number={7} title="Cloud Storage & Security" icon="cloud">
          <p>
            All account rows, profiles, and learning files are stored securely within advanced **Cloud Infrastructure** servers.
          </p>
          <p>
            We implement multiple layers of security to protect against unauthorized access, alteration, or disclosure. This includes full encryption for data in transit (via SSL/TLS) and data at rest on cloud servers.
          </p>
        </LegalSection>

        {/* Section 8 */}
        <LegalSection number={8} title="Third-Party Integrations" icon="hub">
          <p>
            To generate advanced resume feedback, career roadmaps, and realistic mock interview questions, our platform securely sends prompt requests to verified **LLM Services**.
          </p>
          <p>
            When making these secure calls, we mask personally identifiable credentials to safeguard your identity. The LLM Services process this data in compliance with strict privacy guidelines and do not use your information to train their public models.
          </p>
        </LegalSection>

        {/* Section 9 */}
        <LegalSection number={9} title="User Rights" icon="settings_accessibility">
          <p>
            You hold total control over your career intelligence data. You can access, export, or permanently erase your workspace history:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>**Access & Export**: Download or review your resume analyses and roadmaps anytime.</li>
            <li>**Immediate Updates**: Modify your profile details, target role, and name in Settings.</li>
            <li>**Right to Erasure**: Delete your entire account and workspace rows permanently by submitting a request.</li>
          </ul>
        </LegalSection>

        {/* Section 10 */}
        <LegalSection number={10} title="Contact Information" icon="mail">
          <p>
            For any queries regarding your data privacy, details handling, or to request permanent account erasure, contact our security team:
          </p>
          <div className="mt-3 p-3 bg-surface-container rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[18px]">security</span>
            <span className="font-mono text-xs select-all text-on-surface">privacy@careertrack.ai</span>
          </div>
        </LegalSection>
      </div>
    </LegalOverlayLayout>
  );
}
