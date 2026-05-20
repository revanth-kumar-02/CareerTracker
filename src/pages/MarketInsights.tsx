import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMarketInsights, DynamicMarketData } from '../utils/aiService';
import { trendingRoles } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useProfile } from '../context/ProfileContext';

export default function MarketInsights() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [role, setRole] = useState('AI Engineer');
  const [experience, setExperience] = useState('L5 (Senior)');
  const [location, setLocation] = useState('San Francisco');
  const [selectedCategory, setSelectedCategory] = useState('All Roles');

  const [availableRoles, setAvailableRoles] = useState([
    'AI Engineer',
    'Cloud Architect',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager'
  ]);

  useEffect(() => {
    if (profile && profile.target_role) {
      const userRole = profile.target_role;
      setAvailableRoles(prev => {
        if (!prev.includes(userRole)) {
          return [...prev, userRole];
        }
        return prev;
      });
      setRole(userRole);
    }
  }, [profile]);

  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<DynamicMarketData>({
    salaryPercentiles: {
      whiskerBottom: '15%',
      whiskerHeight: '65%',
      boxHeight: '40%',
      boxBottom: '25%',
      medianTop: '45%',
      minSalary: 120000,
      maxSalary: 280000,
      medianSalary: 195000,
      p25Salary: 150000,
      p75Salary: 240000
    },
    skillPremiums: [
      { name: 'PyTorch / LLM Fine-tuning', percentage: '+28%', colorClass: 'bg-primary' },
      { name: 'Kubernetes & Orchestration', percentage: '+18%', colorClass: 'bg-secondary' },
      { name: 'Rust / System Dev', percentage: '+15%', colorClass: 'bg-tertiary-container' },
      { name: 'React / Next.js Frameworks', percentage: '+5%', colorClass: 'bg-outline' },
    ],
    marketHubs: [
      {
        city: 'SF Bay Area',
        delta: '+14%',
        trend: 'AI & GenAI roles',
        trendColor: 'text-primary',
        icon: 'local_fire_department',
      },
      {
        city: 'New York City',
        delta: '+5%',
        trend: 'FinTech steady',
        trendColor: 'text-on-surface-variant',
        icon: 'trending_flat',
      },
      {
        city: 'Austin Tech Hub',
        delta: '+22%',
        trend: 'Cloud & Security surge',
        trendColor: 'text-primary',
        icon: 'arrow_upward',
      },
    ]
  });

  const categories = [
    'All Roles',
    'Engineering',
    'AI/ML',
    'Cloud',
    'Cybersecurity',
    'Product',
    'Design',
    'Finance',
    'Marketing',
    'Data'
  ];

  const filteredRoles = trendingRoles.filter((item) => {
    if (selectedCategory === 'All Roles') return true;
    return item.category === selectedCategory;
  });

  // Dynamic salary benchmark generator based on dropdown states
  useEffect(() => {
    async function updateInsights() {
      setLoading(true);
      try {
        const data = await generateMarketInsights(role, experience, location);
        setMarketData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    updateInsights();
  }, [role, experience, location]);

  // Dynamic compensation whisker helper
  const salaryPercentiles = marketData?.salaryPercentiles || {};
  const minVal = salaryPercentiles.minSalary || 120000;
  const maxVal = salaryPercentiles.maxSalary || 280000;
  const medianVal = salaryPercentiles.medianSalary || 195000;
  const p25Val = salaryPercentiles.p25Salary || 150000;
  const p75Val = salaryPercentiles.p75Salary || 240000;

  // Let's establish a dynamic axis range
  const range = maxVal - minVal;
  const pad = range * 0.15 || 30000; // 15% padding
  const axisMin = Math.max(0, Math.floor(Math.max(0, minVal - pad) / 20000) * 20000);
  const axisMax = Math.ceil((maxVal + pad) / 20000) * 20000;
  const axisDiff = axisMax - axisMin || 1;

  // Now let's calculate perfect CSS bounds
  const whiskerBottomPct = `${((minVal - axisMin) / axisDiff) * 100}%`;
  const whiskerHeightPct = `${((maxVal - minVal) / axisDiff) * 100}%`;
  const boxBottomPct = `${((p25Val - axisMin) / axisDiff) * 100}%`;
  const boxHeightPct = `${((p75Val - p25Val) / axisDiff) * 100}%`;
  // medianTop is offset from the top of the box: top of box is p75Val, median is medianVal
  const medianTopPct = `${((p75Val - medianVal) / (p75Val - p25Val || 1)) * 100}%`;

  // Dynamic Y Axis labels
  const steps = 4;
  const labels: number[] = [];
  for (let i = steps - 1; i >= 0; i--) {
    labels.push(axisMin + (axisDiff * i) / (steps - 1));
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface mb-2">
          Market Insights &amp; Salary Analytics
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-3xl font-medium">
          Real-time compensation scales and dynamic hiring trends calibrated by AI models.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Market Pulse */}
        <section className="lg:col-span-8 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-bold">trending_up</span>
                Dynamic Market Pulse
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Hiring index speed based on your selected parameters</p>
            </div>
            <span className="px-3 py-1 bg-surface-container-high text-on-surface font-semibold text-[10px] rounded-full uppercase tracking-wider shrink-0">
              Live Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {marketData.marketHubs.map((hub) => (
              <div key={hub.city} className="bg-surface-container-low rounded-xl p-4 border border-surface-container hover:border-primary/45 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{hub.city}</span>
                  <span className={`material-symbols-outlined ${
                    hub.icon === 'local_fire_department' ? 'text-secondary' : 'text-primary'
                  } text-base shrink-0`}>
                    {hub.icon}
                  </span>
                </div>
                <div className="text-3xl font-black text-on-surface mb-0.5">{hub.delta}</div>
                <div className={`text-[10px] ${hub.trendColor} font-bold flex items-center gap-0.5 leading-tight`}>
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
        <section className="lg:col-span-4 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary font-bold">model_training</span>
              Skill Premium calibration
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Average total salary premium by core competence</p>
          </div>
          <div className="flex flex-col gap-3.5 my-4">
            {marketData.skillPremiums.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${skill.colorClass}`}></div>
                  <span className="text-xs text-on-surface group-hover:font-bold transition-all">{skill.name}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded border border-primary/10">
                  {skill.percentage}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Salary Benchmarking */}
        <section className="lg:col-span-12 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-bold">bar_chart</span>
                Compensation Benchmarking Whiskers
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Calibrating 10th to 90th percentile total compensation (USD)</p>
            </div>
            
            {/* Dynamic Interactive Selectors */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                {availableRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option>L4 (Mid-Level)</option>
                <option>L5 (Senior)</option>
                <option>L6 (Staff)</option>
              </select>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option>San Francisco</option>
                <option>Remote (US)</option>
                <option>New York City</option>
                <option>Seattle</option>
                <option>Austin</option>
              </select>
            </div>
          </div>

          {/* Whisker Box Chart Rendering with Dynamic Loading transition */}
          <div className="relative h-64 w-full flex items-end justify-around pb-8 border-b border-surface-container-high group/chart">
            {/* Absolute hover details overlay */}
            <div className="absolute right-4 top-4 bg-surface-container-high border border-outline-variant/40 rounded-xl p-3.5 shadow-premium text-xs text-on-surface font-semibold space-y-1.5 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300 pointer-events-none z-30 select-none max-w-xs">
              <div className="text-[10px] font-extrabold text-primary uppercase tracking-wider mb-1">Calibrated Compensation</div>
              <div className="flex justify-between gap-6">
                <span className="text-on-surface-variant font-medium">90th Percentile:</span>
                <span className="text-on-surface font-bold">${maxVal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-on-surface-variant font-medium">75th Percentile:</span>
                <span className="text-on-surface font-bold">${p75Val.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-primary font-bold">50th (Median):</span>
                <span className="text-primary font-black">${medianVal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-on-surface-variant font-medium">25th Percentile:</span>
                <span className="text-on-surface font-bold">${p25Val.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-on-surface-variant font-medium">10th Percentile:</span>
                <span className="text-on-surface font-bold">${minVal.toLocaleString()}</span>
              </div>
            </div>

            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-bold text-outline pr-3 w-14 text-right border-r border-surface-container-high shrink-0">
              {labels.map((val, idx) => (
                <span key={idx}>${Math.round(val / 1000)}k</span>
              ))}
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-20">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">autorenew</span>
              </div>
            ) : null}

            {/* Dynamic Wisker Chart */}
            <div className="ml-16 w-full flex justify-around items-end h-full relative pl-4 md:pl-12 pr-4">
              <div className="group relative flex flex-col items-center w-full max-w-[120px] h-full justify-end cursor-help">
                {/* Whisker Line (10th-90th) */}
                <div
                  className="absolute w-[3px] bg-primary/45 rounded-full z-0 transition-all duration-300"
                  style={{ bottom: whiskerBottomPct, height: whiskerHeightPct }}
                />
                {/* Box (25th-75th) */}
                <div
                  className="relative z-10 w-full bg-gradient-to-t from-primary to-primary/60 rounded-lg border border-primary/20 shadow-md transition-all duration-500 hover:-translate-y-0.5"
                  style={{ height: boxHeightPct, marginBottom: boxBottomPct }}
                >
                  {/* Median Line */}
                  <div className="absolute w-full h-[2.5px] bg-white shadow-sm" style={{ top: medianTopPct }}></div>
                </div>
                <div className="absolute -bottom-6 text-[10px] font-bold text-on-surface text-center whitespace-nowrap">
                  {role} Range
                </div>
              </div>
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
        <section className="lg:col-span-12 bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-on-primary flex flex-col md:flex-row justify-between items-center gap-6 shadow-md ai-glow">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined fill text-lg">auto_awesome</span>
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-primary-fixed-dim">
                Career Pathing Engine
              </span>
            </div>
            <h3 className="text-xl font-bold">Personalized Professional Roadmap</h3>
            <p className="text-xs text-on-primary-container max-w-2xl">
              We've prepared high-availability custom roadmap vectors calculated based on current market demands to transition into {role}.
            </p>
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="w-full md:w-auto px-6 py-3 bg-white text-primary rounded-xl text-xs font-bold shadow-md hover:bg-surface-container transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
          >
            View Career Roadmap
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </div>

      {/* Dynamic Role Category Explorer */}
      <section className="space-y-6 pt-10 border-t border-surface-container-highest">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold">explore</span>
              Complete AI Role Ecosystem
            </h3>
            <p className="text-xs text-on-surface-variant">Explore live career tracks, projected salary averages, and market demands dynamically</p>
          </div>
          <span className="text-[10px] font-bold text-on-surface bg-surface-container px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> Displaying {filteredRoles.length} active tracks
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-bold rounded-full cursor-pointer transition-all duration-300 shrink-0 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary text-on-primary shadow-md font-extrabold'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-surface-container hover:border-primary/45 hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid of Role Cards */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredRoles.map((role) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={role.title}
                className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="material-symbols-outlined text-lg">{role.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                      <span className="material-symbols-outlined text-xs fill">trending_up</span>
                      {role.growth}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {role.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6 font-medium">
                    {role.desc}
                  </p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-surface-container-low">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-on-surface-variant uppercase tracking-wider">Demand Score</span>
                      <span className="text-primary font-extrabold">{role.demandPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                        style={{ width: `${role.demandPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <div>
                      <span className="text-on-surface-variant block text-[9px] uppercase tracking-wider mb-0.5">Salary Average</span>
                      <span className="text-on-surface font-extrabold">{role.salary}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-on-surface-variant block text-[9px] uppercase tracking-wider mb-0.5">Hiring Trend</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold ${
                        role.hiringTrend === 'Surging' || role.hiringTrend === 'Hot'
                          ? 'bg-secondary/10 text-secondary border border-secondary/20'
                          : 'bg-primary/5 text-primary border border-primary/10'
                      }`}>
                        {role.hiringTrend}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
