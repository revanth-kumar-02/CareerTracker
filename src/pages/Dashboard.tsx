import { Link } from 'react-router-dom';
import CircularProgress from '../components/ui/CircularProgress';
import {
  userProfile,
  dashboardRoadmap,
  dashboardInterviewScore,
  marketPulseList,
  activityStreak,
  recentMilestones,
} from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-[48px] font-semibold leading-tight tracking-tight mb-2">
          Welcome back, {userProfile.name}
        </h1>
        <p className="text-lg text-on-surface-variant">{userProfile.briefing}</p>
      </div>

      {/* Top Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Career Roadmap Progress */}
        <Link to="/roadmap" className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Career Roadmap Progress</h3>
              <p className="text-sm text-on-surface-variant">Target: {dashboardRoadmap.targetRole}</p>
            </div>
            <div className="text-2xl font-bold text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/20">
              {dashboardRoadmap.percentage}%
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {dashboardRoadmap.skills.map((skill) => (
              <div key={skill.name} className="flex-1 min-w-[120px]">
                <span className={`text-xs font-medium block mb-1.5 ${skill.inProgress ? 'text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded inline-block' : 'text-on-surface-variant'}`}>
                  {skill.name}
                </span>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${skill.completed || skill.inProgress ? 'bg-primary' : 'bg-surface-container-highest'}`}
                    style={{ width: skill.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* AI Interview Score */}
        <Link to="/interview" className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
          <div className="relative">
            <CircularProgress
              value={dashboardInterviewScore.score}
              max={dashboardInterviewScore.max}
              size={100}
              strokeWidth={6}
              color="#6b38d4"
              trackColor="#e5eeff"
            >
              <span className="text-2xl font-bold text-on-surface">{dashboardInterviewScore.score}</span>
            </CircularProgress>
            <span className="material-symbols-outlined text-secondary absolute -top-1 -right-1 text-[18px]">auto_awesome</span>
          </div>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest mt-3 mb-3">AI Interview Score</p>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            Ready to practice
          </button>
        </Link>
      </div>

      {/* Bottom Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Pulse */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
          <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
            Market Pulse
          </h3>
          <div className="space-y-4">
            {marketPulseList.map((item) => (
              <div key={item.skill} className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.skill}</p>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
                <span className="text-sm font-bold text-primary">{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Streak */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
          <h3 className="text-base font-semibold text-on-surface mb-4">Activity Streak</h3>
          <div className="flex items-end justify-center gap-2 h-28 mb-4">
            {activityStreak.heights.map((h, i) => (
              <div
                key={i}
                className={`w-6 rounded-t transition-all duration-500 ${i === 4 ? 'bg-primary' : 'bg-surface-container-high'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Current: <strong className="text-on-surface">{activityStreak.currentStreak} Days</strong></span>
            <span>Best: <strong className="text-on-surface">{activityStreak.bestStreak} Days</strong></span>
          </div>
        </div>

        {/* Recent Milestones */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container">
          <h3 className="text-base font-semibold text-on-surface mb-4">Recent Milestones</h3>
          <div className="space-y-4">
            {recentMilestones.map((m) => (
              <div key={m.label} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${m.color}`} />
                <div>
                  <p className="text-sm font-medium text-on-surface">{m.label}</p>
                  <p className="text-xs text-on-surface-variant">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
