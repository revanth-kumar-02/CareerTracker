/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function App() {
  const [activeView, setActiveView] = useState('resume');

  return (
    <div className="flex h-screen bg-surface p-4 font-sans text-on-surface">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-8 bg-surface-container rounded-xl ml-4">
        {activeView === 'resume' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold">Resume Lab</h1>
            <p className="text-xl text-on-surface-variant">Optimize your CV for modern ATS and hiring managers.</p>
            <div className="border-4 border-dashed border-outline-variant p-20 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors">
              <span className="text-primary text-4xl mb-4">⇪</span>
              <h3 className="text-xl font-semibold">Drop your resume for AI optimization</h3>
              <p className="text-outline">Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>
          </div>
        )}
        {activeView === 'dashboard' && <h1 className="text-4xl font-bold">Dashboard</h1>}
        {activeView === 'discovery' && <h1 className="text-4xl font-bold">Discovery</h1>}
        {activeView === 'interview' && <h1 className="text-4xl font-bold">Interview Prep</h1>}
      </main>
    </div>
  );
}
