import { Link } from 'react-router-dom';
import { companies, trendingRoles } from '../data/mockData';

export default function Landing() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 pb-20">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-[48px] font-semibold leading-tight tracking-tight mb-4">
          Your Journey Starts with
          <br />
          <span className="text-gradient">Global Leaders.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Align your trajectory with the industry's highest demand roles. We analyze millions of data points to optimize your career path.
        </p>
      </section>

      {/* Company Logos */}
      <section className="flex flex-wrap justify-center gap-4 md:gap-6 mb-20">
        {companies.map((company) => (
          <div
            key={company}
            className="px-8 py-3 border border-outline-variant/40 rounded-lg text-on-surface-variant text-lg font-medium hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-default"
          >
            {company}
          </div>
        ))}
      </section>

      {/* Trending Roles */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-on-background">Trending Roles for You</h2>
          <Link to="/discovery" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            View all paths <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRoles.map((role) => (
            <div
              key={role.title}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-level-2 border border-surface-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                  <span className="material-symbols-outlined">{role.icon}</span>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-surface-container-low px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  {role.growth}
                </span>
              </div>

              <h3 className="text-base font-semibold text-on-surface mb-2">{role.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{role.desc}</p>

              <div className="space-y-1 pt-4 border-t border-surface-container">
                <div className="flex justify-between text-[11px] tracking-wider">
                  <span className="text-on-surface-variant uppercase font-semibold">Salary Range</span>
                  <span className="font-bold text-on-surface">{role.salary}</span>
                </div>
                <div className="flex justify-between text-[11px] tracking-wider">
                  <span className="text-on-surface-variant uppercase font-semibold">Demand</span>
                  <span className={`font-bold ${role.demandColor}`}>{role.demand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
