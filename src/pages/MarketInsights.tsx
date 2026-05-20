import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProfile } from '../context/ProfileContext';
import { RoleData, SkillItem, ROLES, SKILLS } from '../data/rolesData';

export default function MarketInsights() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  
  // State
  const [selectedRole, setSelectedRole] = useState<RoleData>(ROLES[0]);
  const [activeTab, setActiveTab] = useState<'All' | 'Engineering' | 'Design' | 'AI & Data' | 'Security'>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [matchingGoal, setMatchingGoal] = useState<string | null>(null);
  const [compareRoleA, setCompareRoleA] = useState<string>('frontend-dev');
  const [compareRoleB, setCompareRoleB] = useState<string>('uiux-designer');
  
  // New Preview Card Tab state
  const [previewTab, setPreviewTab] = useState<'syllabus' | 'stack' | 'specs'>('syllabus');

  const filteredRoles = activeTab === 'All' 
    ? ROLES 
    : ROLES.filter(r => r.category === activeTab);

  // Career Matching Logic
  const getMatchingRecommendation = () => {
    if (!matchingGoal) return null;
    switch (matchingGoal) {
      case 'design':
        return ROLES.filter(r => r.category === 'Design');
      case 'code-backend':
        return ROLES.filter(r => r.id === 'fullstack-dev' || r.id === 'devops-engineer' || r.id === 'cloud-engineer');
      case 'beginner-visual':
        return ROLES.filter(r => r.friendliness === 'Beginner-Friendly');
      case 'ai-data':
        return ROLES.filter(r => r.category === 'AI & Data');
      case 'security':
        return ROLES.filter(r => r.id === 'cybersecurity-analyst');
      default:
        return ROLES;
    }
  };

  const matchingResults = getMatchingRecommendation();

  // Load user target role as initial selected role
  useEffect(() => {
    if (profile && profile.target_role) {
      const match = ROLES.find(r => r.title.toLowerCase() === profile.target_role.toLowerCase());
      if (match) {
        setSelectedRole(match);
      }
    }
  }, [profile]);

  const handleLaunchTargetRole = async (targetTitle: string) => {
    try {
      await updateProfile({ target_role: targetTitle });
      window.dispatchEvent(new Event('profile-updated'));
      navigate('/roadmap/generator');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspectRoleFromSkill = (roleName: string) => {
    const match = ROLES.find(r => r.title.toLowerCase() === roleName.toLowerCase());
    if (match) {
      setSelectedRole(match);
      // Smooth scroll back to top of the preview section
      const previewElement = document.getElementById('role-discovery-container');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const roleAData = ROLES.find(r => r.id === compareRoleA) || ROLES[0];
  const roleBData = ROLES.find(r => r.id === compareRoleB) || ROLES[1];

  return (
    <div className="space-y-[48px] md:space-y-[72px] animate-fade-in pb-[72px] max-w-7xl mx-auto font-sans px-4 md:px-8">
      
      {/* Hero Section */}
      <header className="py-6 border-b border-surface-container/60">
        <h1 className="text-3xl md:text-[40px] font-black text-on-surface tracking-tight leading-tight mb-4">
          Career Exploration &amp; Discovery Hub
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl font-medium leading-relaxed">
          Discover high-demand technology tracks, preview detailed syllabus milestones, map out core competencies, and compare career pathways side-by-side.
        </p>
      </header>

      {/* Grid: Role Cards left, Preview Right */}
      <div id="role-discovery-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Trending Career Roles (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-surface-container">
            <div>
              <h2 className="text-lg font-black text-on-surface tracking-tight">Trending Career Roles</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Explore active roles in the modern SaaS ecosystem</p>
            </div>
            
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {(['All', 'Engineering', 'Design', 'AI & Data', 'Security'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow ${
                    activeTab === tab 
                      ? 'bg-primary text-on-primary font-extrabold shadow-md'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredRoles.map(role => {
              const isSelected = selectedRole.id === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[250px] relative group overflow-hidden ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-premium ring-1 ring-primary'
                      : 'bg-surface-container-lowest border-surface-container hover:border-primary/45 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface text-primary group-hover:bg-primary group-hover:text-on-primary'
                      }`}>
                        <span className="material-symbols-outlined text-[22px]">{role.icon}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-md uppercase tracking-wider">
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed line-clamp-3 mb-4">
                      {role.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-container flex justify-between items-center text-[10px] font-bold text-outline">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider font-extrabold text-on-surface-variant">Duration</span>
                      <span className="text-on-surface font-black">{role.duration}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider font-extrabold text-on-surface-variant">Difficulty</span>
                      <span className={`font-black ${
                        role.difficulty === 'Hard' ? 'text-error' : role.difficulty === 'Medium' ? 'text-secondary' : 'text-success'
                      }`}>{role.difficulty}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider font-extrabold text-on-surface-variant">Aesthetics</span>
                      <span className="text-on-surface font-black">{role.creativityScale}/10</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Role Learning Preview (5 columns, Tabbed Content) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-premium flex flex-col justify-between min-h-[660px]">
          
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-4 border-b border-surface-container">
              <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined" style={{fontSize:'22px'}}>{selectedRole.icon}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-on-surface leading-tight truncate">{selectedRole.title}</h2>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-black rounded uppercase tracking-wider inline-block mt-1">
                  {selectedRole.category}
                </span>
              </div>
            </div>

            {/* Tab Swapper */}
            <div className="flex bg-surface-container rounded-xl p-1 border border-surface-container-high gap-0.5">
              {[
                { id: 'syllabus', label: 'Syllabus', icon: 'route' },
                { id: 'stack', label: 'Stack', icon: 'construction' },
                { id: 'specs', label: 'Specs', icon: 'bar_chart' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id as any)}
                  className={`flex-1 py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-1 cursor-pointer leading-none ${
                    previewTab === tab.id
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{fontSize:'14px',lineHeight:1}}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[340px] max-h-[395px] overflow-y-auto overflow-x-hidden custom-scrollbar" style={{paddingRight:'4px'}}>
              <AnimatePresence mode="wait">
                {previewTab === 'syllabus' && (
                  <motion.div
                    key="tab-syllabus"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-0"
                  >
                    {selectedRole.phases.map((phase, idx) => (
                      <div key={idx} className="flex gap-3">
                        {/* Left column: dot + connector line — stretches to match right column height */}
                        <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-surface-container-lowest flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          </div>
                          {idx < selectedRole.phases.length - 1 && (
                            <div className="w-0.5 bg-surface-container-high flex-1 mt-1.5 mb-0"></div>
                          )}
                        </div>

                        {/* Right column: content — pb-5 creates spacing the line extends through */}
                        <div className="flex-1 pb-5 min-w-0">
                          <h4 className="text-[11px] font-black text-on-surface leading-snug mb-1">{phase.title}</h4>
                          <p className="text-[10.5px] text-on-surface-variant font-medium leading-relaxed mb-2">
                            {phase.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {phase.topics.map(topic => (
                              <span key={topic} className="px-2 py-0.5 bg-surface-container text-on-surface-variant border border-surface-container-high rounded text-[9px] font-semibold">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {previewTab === 'stack' && (
                  <motion.div
                    key="tab-stack"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] text-outline font-extrabold uppercase tracking-widest block">Key Technologies &amp; Tools</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.tools.map(tool => (
                          <span key={tool} className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/15 rounded-lg text-[10px] font-bold">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-outline font-extrabold uppercase tracking-widest block">Capstone Projects</span>
                      <ul className="space-y-2">
                        {selectedRole.projects.map((proj, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-on-surface-variant leading-relaxed">
                            <span className="material-symbols-outlined text-secondary flex-shrink-0" style={{fontSize:'14px', lineHeight:'18px'}}>check_circle</span>
                            {proj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'specs' && (
                  <motion.div
                    key="tab-specs"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container p-3.5 rounded-xl border border-surface-container-high">
                        <span className="text-[9px] text-outline font-extrabold uppercase tracking-widest block mb-1">Duration</span>
                        <span className="text-xs font-black text-on-surface">{selectedRole.duration}</span>
                      </div>
                      <div className="bg-surface-container p-3.5 rounded-xl border border-surface-container-high">
                        <span className="text-[9px] text-outline font-extrabold uppercase tracking-widest block mb-1">Beginner Friendly</span>
                        <span className="text-xs font-black text-on-surface">{selectedRole.friendliness}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold text-on-surface">
                          <span>Coding Intensity</span>
                          <span className="text-primary">{selectedRole.codingScale}/10</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${selectedRole.codingScale * 10}%` }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold text-on-surface">
                          <span>Visual Creativity</span>
                          <span className="text-secondary">{selectedRole.creativityScale}/10</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${selectedRole.creativityScale * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Launch Target Button */}
          <button
            onClick={() => handleLaunchTargetRole(selectedRole.title)}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-on-primary rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-5"
          >
            <span className="material-symbols-outlined flex-shrink-0" style={{fontSize:'16px'}}>route</span>
            Generate Custom Pathway Blueprint
            <span className="material-symbols-outlined flex-shrink-0" style={{fontSize:'16px'}}>arrow_forward</span>
          </button>
        </div>

      </div>

      {/* Explore Skills Section */}
      <section className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 lg:p-8 shadow-premium space-y-6">
        <div>
          <h2 className="text-lg font-black text-on-surface tracking-tight">Skill Explorer</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">Select a core competency to analyze related pathways, tool sets, and difficulty profiles</p>
        </div>

        {/* Skill Node Grid */}
        <div className="flex flex-wrap gap-2.5 justify-center py-2">
          {SKILLS.map(skill => {
            const isSelected = selectedSkill?.name === skill.name;
            return (
              <button
                key={skill.name}
                onClick={() => setSelectedSkill(isSelected ? null : skill)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-secondary text-on-secondary border-secondary shadow-[0_0_12px_rgba(132,85,239,0.4)] scale-105' 
                    : 'bg-surface border-surface-container-high hover:border-secondary/40 text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {skill.category.includes('Design') ? 'palette' : skill.category.includes('Data') ? 'insights' : 'code'}
                </span>
                {skill.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Selection Output details */}
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-surface rounded-2xl p-6 border border-surface-container-high grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-on-surface">{selectedSkill.name}</h3>
                  <span className="px-2.5 py-0.5 bg-secondary/15 text-secondary text-[9px] font-black rounded uppercase tracking-wider">
                    {selectedSkill.category}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  {selectedSkill.matters}
                </p>
                
                <div className="pt-2">
                  <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider block mb-2">Where is it used?</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.whereUsed.map(w => (
                      <span key={w} className="px-2.5 py-1 bg-surface-container border border-surface-container-high text-[10px] rounded-lg font-semibold text-on-surface">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider block mb-2">Related Career Roles (Click to Preview)</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.roles.map(role => (
                      <button
                        key={role}
                        onClick={() => handleInspectRoleFromSkill(role)}
                        className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px] font-bold">visibility</span>
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-surface-container text-[10px] font-bold text-outline">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-on-surface-variant">Difficulty</span>
                    <span className="text-on-surface font-black">{selectedSkill.difficulty}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-on-surface-variant">Coder Friendly</span>
                    <span className="text-on-surface font-black">{selectedSkill.friendliness}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-on-surface-variant">Connected Techs</span>
                    <span className="text-on-surface font-black">{selectedSkill.relatedTechs.join(', ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-6 text-xs text-on-surface-variant font-medium bg-surface/50 border border-dashed border-surface-container rounded-2xl">
              💡 Tip: Click any skill above to reveal connected roles, technologies, and pathways.
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Grid: Matcher & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Career Matching Section (5 columns) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 lg:p-8 shadow-premium flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-on-surface tracking-tight">AI Career Matching Helper</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Find the path suited for your background and goals</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-outline font-extrabold uppercase tracking-wider block mb-1">What describes you best?</label>
              
              {[
                { id: 'design', label: '🎨 I love design, user interfaces, and visuals.' },
                { id: 'code-backend', label: '💻 I like logic, backend databases, and API engineering.' },
                { id: 'beginner-visual', label: '🚀 I am a total beginner and want an easy route.' },
                { id: 'ai-data', label: '🧠 I love artificial intelligence, algorithms, and math.' },
                { id: 'security', label: '🛡️ I want to focus on network defenses and cybersecurity.' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMatchingGoal(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    matchingGoal === opt.id 
                      ? 'bg-primary/10 border-primary text-primary font-black shadow-sm' 
                      : 'bg-surface border-surface-container hover:border-primary/30 text-on-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-surface-container mt-6">
            {matchingResults ? (
              <div className="space-y-3">
                <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider block">Recommended Careers ({matchingResults.length})</span>
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                  {matchingResults.map(r => (
                    <div 
                      key={r.id} 
                      onClick={() => handleInspectRoleFromSkill(r.title)}
                      className="p-3 bg-surface border border-surface-container rounded-xl flex items-center justify-between hover:border-primary cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">{r.icon}</span>
                        <span className="text-xs font-bold text-on-surface">{r.title}</span>
                      </div>
                      <span className="text-[9px] px-2.5 py-0.5 bg-primary/10 text-primary font-bold rounded">
                        {r.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-on-surface-variant font-medium text-center py-4">
                Select your interest profile above to unlock custom matching suggestions.
              </p>
            )}
          </div>
        </div>

        {/* Role Comparison System (7 columns) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 lg:p-8 shadow-premium space-y-6">
          <div>
            <h2 className="text-lg font-black text-on-surface tracking-tight">Side-by-Side Role Comparison System</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Compare coding, creativity, duration, and stacks side-by-side</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-outline font-extrabold uppercase tracking-wider block mb-1.5">Select Role A</label>
              <select
                value={compareRoleA}
                onChange={(e) => setCompareRoleA(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-bold text-on-surface focus:border-primary cursor-pointer outline-none transition-all"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === compareRoleB}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] text-outline font-extrabold uppercase tracking-wider block mb-1.5">Select Role B</label>
              <select
                value={compareRoleB}
                onChange={(e) => setCompareRoleB(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-xs font-bold text-on-surface focus:border-primary cursor-pointer outline-none transition-all"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === compareRoleA}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="border border-surface-container rounded-2xl overflow-hidden bg-surface">
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-surface-container text-[10px] font-extrabold text-outline uppercase tracking-wider">
              <span>Metric</span>
              <span className="text-primary">{roleAData.title}</span>
              <span className="text-secondary">{roleBData.title}</span>
            </div>

            {/* Coding Level */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-surface-container text-xs font-bold items-center">
              <span className="text-on-surface-variant font-medium">Coding Intensity</span>
              <div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-primary" style={{ width: `${roleAData.codingScale * 10}%` }}></div>
                </div>
                <span className="text-[9px]">{roleAData.codingScale}/10</span>
              </div>
              <div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-secondary" style={{ width: `${roleBData.codingScale * 10}%` }}></div>
                </div>
                <span className="text-[9px]">{roleBData.codingScale}/10</span>
              </div>
            </div>

            {/* Creativity Level */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-surface-container text-xs font-bold items-center">
              <span className="text-on-surface-variant font-medium">Visual Creativity</span>
              <div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-primary" style={{ width: `${roleAData.creativityScale * 10}%` }}></div>
                </div>
                <span className="text-[9px]">{roleAData.creativityScale}/10</span>
              </div>
              <div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-secondary" style={{ width: `${roleBData.creativityScale * 10}%` }}></div>
                </div>
                <span className="text-[9px]">{roleBData.creativityScale}/10</span>
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-surface-container text-xs font-bold">
              <span className="text-on-surface-variant font-medium">Learning Duration</span>
              <span className="text-on-surface">{roleAData.duration}</span>
              <span className="text-on-surface">{roleBData.duration}</span>
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-surface-container text-xs font-bold">
              <span className="text-on-surface-variant font-medium">Roadmap Difficulty</span>
              <span className={roleAData.difficulty === 'Hard' ? 'text-error' : 'text-success'}>{roleAData.difficulty}</span>
              <span className={roleBData.difficulty === 'Hard' ? 'text-error' : 'text-success'}>{roleBData.difficulty}</span>
            </div>

            {/* Technologies */}
            <div className="grid grid-cols-3 gap-2 p-4 text-xs font-bold">
              <span className="text-on-surface-variant font-medium">Primary Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {roleAData.techs.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px]">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {roleBData.techs.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[9px]">{t}</span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
