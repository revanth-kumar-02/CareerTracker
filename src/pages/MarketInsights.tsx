import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketHubs, skillPremiums, salaryBenchmarks } from '../data/mockData';

export default function MarketInsights() {
  const navigate = useNavigate();
  const [role, setRole] = useState('AI Engineer');
  const [experience, setExperience] = useState('L5 (Senior)');
  const [location, setLocation] = useState('San Francisco');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface mb-2">
          Market Insights &amp; Salary Analytics
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-3xl">
          Real-time compensation data and hiring trends powered by AI to optimize your career trajectory.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Pulse */}
        <section className="lg:col-span-8 glass-card rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                Market Pulse
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Real-time hiring velocity across major hubs</p>
            </div>
            <span className="px-3 py-1 bg-surface-container-high text-on-surface font-semibold text-[10px] rounded-full">
              Last 30 Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {marketHubs.map((hub) => (
              <div key={hub.city} className="bg-surface rounded-lg p-4 border border-outline-variant/20 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">{hub.city}</span>
                  <span className={`material-symbols-outlined ${hub.icon === 'local_fire_department' ? 'text-tertiary-container fill' : hub.icon === 'trending_flat' ? 'text-on-surface-variant' : 'text-primary'} text-sm`}>
                    {hub.icon}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-on-surface mb-0.5">{hub.delta}</div>
                <div className={`text-[10px] ${hub.trendColor} font-bold flex items-center gap-0.5`}>
                  <span className="material-symbols-outlined text-xs">
                    {hub.icon === 'trending_flat' ? 'arrow_forward' : 'arrow_upward'}
                  </span>
                  {hub.trend}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Premiums */}
        <section className="lg:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">model_training</span>
              Skill Premiums
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Average salary boost by core technology expertise</p>
          </div>
          <div className="flex flex-col gap-3.5 my-4">
            {skillPremiums.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${skill.colorClass} ${skill.colorClass === 'bg-primary' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-xs text-on-surface group-hover:font-semibold transition-all">{skill.name}</span>
                </div>
                <span className={`px-2 py-0.5 ${skill.colorClass === 'bg-primary' ? 'bg-primary/10 text-primary' : skill.colorClass === 'bg-secondary' ? 'bg-secondary-container/20 text-secondary' : skill.colorClass === 'bg-tertiary-container' ? 'bg-tertiary-container/20 text-tertiary-container' : 'bg-surface-container text-on-surface-variant'} font-bold text-[10px] rounded`}>
                  {skill.percentage}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Salary Benchmarking */}
        <section className="lg:col-span-12 glass-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Salary Benchmarking
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">10th to 90th percentile total compensation (USD)</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option>AI Engineer</option>
                <option>Cloud Architect</option>
                <option>Full Stack Developer</option>
              </select>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option>L4 (Mid-Level)</option>
                <option>L5 (Senior)</option>
                <option>L6 (Staff)</option>
              </select>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option>San Francisco</option>
                <option>Remote (US)</option>
                <option>New York City</option>
              </select>
            </div>
          </div>

          {/* Whisker Box Chart Rendering */}
          <div className="relative h-64 w-full flex items-end justify-around pb-8 border-b border-outline-variant/20">
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-outline pr-3 w-14 text-right border-r border-outline-variant/10">
              <span>$400k</span>
              <span>$300k</span>
              <span>$200k</span>
              <span>$100k</span>
            </div>

            {/* Chart Bars */}
            <div className="ml-16 w-full flex justify-around items-end h-full relative pl-4 md:pl-12 pr-4">
              {salaryBenchmarks.map((bar) => (
                <div key={bar.role} className="group relative flex flex-col items-center w-full max-w-[120px] h-full justify-end">
                  {/* Whisker Line (10th-90th) */}
                  <div
                    className={`absolute w-[3px] bg-outline-variant/40 rounded-full z-0 transition-colors ${
                      bar.role === 'AI Engineer'
                        ? 'group-hover:bg-primary/40'
                        : bar.role === 'Cloud Architect'
                        ? 'group-hover:bg-secondary/40'
                        : 'group-hover:bg-tertiary-container/40'
                    }`}
                    style={{ bottom: bar.whiskerBottom, height: bar.whiskerHeight }}
                  />
                  {/* Box (25th-75th) */}
                  <div
                    className={`relative z-10 w-full bg-gradient-to-t ${bar.colorFrom} ${bar.colorTo} rounded-lg border ${bar.borderColor} shadow-md transition-all duration-300 group-hover:-translate-y-1`}
                    style={{ height: bar.boxHeight, marginBottom: bar.boxBottom }}
                  >
                    {/* Median Line */}
                    <div className="absolute w-full h-[2.5px] bg-white shadow-sm" style={{ top: bar.medianTop }}></div>
                  </div>
                  <div className="absolute -bottom-6 text-[11px] font-bold text-on-surface text-center whitespace-nowrap">
                    {bar.role === 'Full Stack Dev' ? 'Full Stack Dev' : bar.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 border border-outline-variant/50 rounded bg-surface"></div>
              <span>Total Range (10th-90th)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-primary/60 rounded"></div>
              <span>Core Range (25th-75th)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-[2px] bg-on-surface"></div>
              <span>Median Salary</span>
            </div>
          </div>
        </section>

        {/* Transition Card to Career Roadmap */}
        <section className="lg:col-span-12 bg-gradient-to-r from-primary to-secondary p-6 rounded-xl text-on-primary flex flex-col md:flex-row justify-between items-center gap-6 shadow-md ai-glow">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined fill text-lg">auto_awesome</span>
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-primary-fixed-dim">
                Career Pathing Engine
              </span>
            </div>
            <h3 className="text-xl font-bold">Personalized Cloud Architecture Roadmap</h3>
            <p className="text-xs text-on-primary-container max-w-2xl">
              We've calculated a specialized roadmap based on current market trends to level up your career into a Senior Cloud Architect. Estimated timeline: 12-18 months.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="w-full md:w-auto px-6 py-3 bg-white text-primary rounded-lg text-xs font-semibold shadow-md hover:bg-surface-container transition-all flex items-center justify-center gap-1 shrink-0"
          >
            View Career Roadmap
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </div>
    </div>
  );
}
