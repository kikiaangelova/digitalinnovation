import { SimulationSeason, KPIs } from '@/types/simulator';

export const INITIAL_KPIS: KPIs = {
  users_total: 0,
  active_users: 0,
  churn_rate: 0,
  conversion_rate: 0,
  cac: 0,
  arpu: 0,
  revenue: 0,
  burn_rate: 5000,
  runway_months: 12,
  nps: 0,
  product_quality: 30,
  tech_debt: 5,
  brand_trust: 20,
  compliance_risk: 5,
};

export const SEED_SEASON: SimulationSeason = {
  id: 'season-startup-lab',
  theme: 'Digital Startup Lab',
  description: 'Build a digital startup from scratch over 6 weeks. Identify a problem, design a solution, build a business model, and pitch your startup idea.',
  start_date: '2026-03-01',
  weeks: 6,
  difficulty: 'medium',
  volatility: 0.08,
  scoring_weights: {
    decision_quality: 0.3,
    evidence_use: 0.2,
    experiment_discipline: 0.15,
    strategic_coherence: 0.2,
    reflection_quality: 0.15,
  },
  created_by: 'admin',
  rounds: [
    // ── Week 1: Identify a Problem and Opportunity ──
    {
      id: 'round-1',
      season_id: 'season-startup-lab',
      week_number: 1,
      narrative: `Welcome to Digital Startup Lab! You and your team are aspiring entrepreneurs. Your mission: build a digital startup from an idea to a launch-ready plan in 6 weeks.\n\nThis week you need to identify a real problem worth solving. Look around — what frustrates people? What could technology make easier, faster, or more accessible? Great startups begin with a clear problem and a passionate founder.\n\nYour budget: €50,000 in seed funding. Your runway: 12 months. Make every decision count.`,
      baseline_kpis: INITIAL_KPIS,
      decisions: [
        {
          id: 'r1d1',
          round_id: 'round-1',
          title: 'Problem Selection',
          description: 'Which problem area will your startup focus on?',
          type: 'strategy',
          format: 'multiple_choice',
          options: [
            { id: 'r1d1a', label: 'Student Life', description: 'Help students find affordable housing, study groups, or campus services' },
            { id: 'r1d1b', label: 'Local Commerce', description: 'Help small local businesses sell online and reach new customers' },
            { id: 'r1d1c', label: 'Sustainability', description: 'Help people reduce waste, recycle, or make eco-friendly choices' },
            { id: 'r1d1d', label: 'Health & Wellness', description: 'Help young people track fitness, mental health, or healthy habits' },
          ],
          rubric: [
            { criterion: 'Problem clarity', max_score: 5, description: 'Is the problem clearly defined and real?' },
            { criterion: 'Market potential', max_score: 5, description: 'Is there a large enough market for this?' },
          ],
          rules: [
            { option_id: 'r1d1a', deltas: { users_total: 100, active_users: 40, brand_trust: 10, nps: 15 } },
            { option_id: 'r1d1b', deltas: { users_total: 60, active_users: 30, revenue: 500, arpu: 8, brand_trust: 12 } },
            { option_id: 'r1d1c', deltas: { users_total: 80, active_users: 35, brand_trust: 15, nps: 20 } },
            { option_id: 'r1d1d', deltas: { users_total: 120, active_users: 50, nps: 10, conversion_rate: 0.02 } },
          ],
        },
        {
          id: 'r1d2',
          round_id: 'round-1',
          title: 'Target Customer',
          description: 'Who is your primary customer?',
          type: 'strategy',
          format: 'multiple_choice',
          options: [
            { id: 'r1d2a', label: 'Teenagers (15-18)', description: 'Digital natives who spend hours on mobile apps' },
            { id: 'r1d2b', label: 'University Students', description: 'Budget-conscious, tech-savvy, social media active' },
            { id: 'r1d2c', label: 'Young Professionals', description: 'Working adults 22-30 with disposable income' },
            { id: 'r1d2d', label: 'Small Business Owners', description: 'Local shop owners who want to go digital' },
          ],
          rubric: [
            { criterion: 'Customer understanding', max_score: 5, description: 'Do they understand their target customer?' },
            { criterion: 'Segment-problem fit', max_score: 5, description: 'Does this customer have the problem they chose?' },
          ],
          rules: [
            { option_id: 'r1d2a', deltas: { users_total: 80, active_users: 50, cac: 5, churn_rate: 0.05 } },
            { option_id: 'r1d2b', deltas: { users_total: 60, active_users: 35, cac: 8, conversion_rate: 0.03 } },
            { option_id: 'r1d2c', deltas: { users_total: 40, active_users: 25, arpu: 10, revenue: 400 } },
            { option_id: 'r1d2d', deltas: { users_total: 20, active_users: 15, arpu: 25, revenue: 500, brand_trust: 8 } },
          ],
        },
        {
          id: 'r1d3',
          round_id: 'round-1',
          title: 'Research Method',
          description: 'How will you validate that this problem is real?',
          type: 'data_ai',
          format: 'multiple_choice',
          options: [
            { id: 'r1d3a', label: 'Online Surveys', description: 'Send a quick survey to 100+ potential customers' },
            { id: 'r1d3b', label: 'Interviews', description: 'Talk to 10 potential customers face-to-face' },
            { id: 'r1d3c', label: 'Social Media Analysis', description: 'Analyze complaints and trends on social platforms' },
            { id: 'r1d3d', label: 'Competitor Research', description: 'Study what existing solutions are doing wrong' },
          ],
          rubric: [
            { criterion: 'Validation quality', max_score: 5, description: 'Will this method give reliable insights?' },
            { criterion: 'Cost efficiency', max_score: 5, description: 'Is this affordable with limited budget?' },
          ],
          rules: [
            { option_id: 'r1d3a', deltas: { product_quality: 5, burn_rate: 200 } },
            { option_id: 'r1d3b', deltas: { product_quality: 10, nps: 5, burn_rate: 100 } },
            { option_id: 'r1d3c', deltas: { product_quality: 6, brand_trust: 3, burn_rate: 50 } },
            { option_id: 'r1d3d', deltas: { product_quality: 8, brand_trust: 5, burn_rate: 150 } },
          ],
        },
        {
          id: 'r1d4',
          round_id: 'round-1',
          title: 'Team Formation',
          description: 'What kind of co-founder do you need most?',
          type: 'ops_risk',
          format: 'multiple_choice',
          options: [
            { id: 'r1d4a', label: 'Technical Co-founder', description: 'Someone who can build the app or website' },
            { id: 'r1d4b', label: 'Marketing Expert', description: 'Someone who knows how to reach customers' },
            { id: 'r1d4c', label: 'Design Thinker', description: 'Someone focused on user experience and product design' },
            { id: 'r1d4d', label: 'Business Strategist', description: 'Someone who understands money, strategy, and partnerships' },
          ],
          rubric: [
            { criterion: 'Team balance', max_score: 5, description: 'Does this fill a critical skill gap?' },
            { criterion: 'Stage appropriateness', max_score: 5, description: 'Is this the right hire for this stage?' },
          ],
          rules: [
            { option_id: 'r1d4a', deltas: { product_quality: 10, tech_debt: -3, burn_rate: 2000 } },
            { option_id: 'r1d4b', deltas: { users_total: 50, cac: -5, burn_rate: 1500 } },
            { option_id: 'r1d4c', deltas: { product_quality: 8, nps: 8, conversion_rate: 0.01, burn_rate: 1500 } },
            { option_id: 'r1d4d', deltas: { revenue: 300, brand_trust: 5, burn_rate: 1800 } },
          ],
        },
      ],
    },
    // ── Week 2: Define Customer Segments and Value Proposition ──
    {
      id: 'round-2',
      season_id: 'season-startup-lab',
      week_number: 2,
      narrative: `Week 2: You've identified your problem area and target customer. Now it's time to go deeper. What exactly is your value proposition? Why would customers choose YOUR solution over alternatives?\n\nRemember: a great value proposition answers three questions:\n1. What problem do you solve?\n2. How do you solve it differently?\n3. Why should the customer care?\n\nYour first users are starting to show interest. Keep them engaged!`,
      shock_event: {
        title: 'Economic Uncertainty Rising',
        description: 'Global markets show signs of instability. Consumer confidence drops and early adopters become more cautious with new products.',
        kpi_effects: { users_total: -10, cac: 5, brand_trust: -2 },
        category: 'market_crash',
        severity: 1,
        concept_lesson: '💡 Chaotics Principle: Turbulence is the new normal. Early-stage startups must build resilience into their DNA from day one.',
        concept_lesson_bg: '💡 Принцип Chaotics: Турбулентността е новата нормалност. Стартъпите в ранен етап трябва да вградят устойчивост от първия ден.',
      },
      decisions: [
        {
          id: 'r2d1', round_id: 'round-2', title: 'Value Proposition', description: 'What is your key differentiator?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r2d1a', label: 'Cheapest Option', description: 'Undercut competitors on price — be the affordable choice' },
            { id: 'r2d1b', label: 'Best Experience', description: 'Focus on beautiful design and seamless user experience' },
            { id: 'r2d1c', label: 'Community-Driven', description: 'Build a community where users help each other' },
            { id: 'r2d1d', label: 'AI-Powered', description: 'Use AI to personalize and automate the service' },
          ],
          rubric: [
            { criterion: 'Differentiation clarity', max_score: 5, description: 'Is the value proposition unique and clear?' },
            { criterion: 'Feasibility', max_score: 5, description: 'Can they actually deliver on this promise?' },
          ],
          rules: [
            { option_id: 'r2d1a', deltas: { users_total: 80, arpu: -3, conversion_rate: 0.02, burn_rate: 500 } },
            { option_id: 'r2d1b', deltas: { nps: 12, conversion_rate: 0.015, product_quality: 8, burn_rate: 1000 } },
            { option_id: 'r2d1c', deltas: { users_total: 50, nps: 15, churn_rate: -0.02, brand_trust: 8 } },
            { option_id: 'r2d1d', deltas: { conversion_rate: 0.02, product_quality: 6, tech_debt: 5, burn_rate: 1500 } },
          ],
        },
        {
          id: 'r2d2', round_id: 'round-2', title: 'Customer Channels', description: 'How will you reach your customers?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r2d2a', label: 'Instagram & TikTok', description: 'Short videos and visual content for young audiences' },
            { id: 'r2d2b', label: 'School Partnerships', description: 'Partner with schools and universities for direct access' },
            { id: 'r2d2c', label: 'Word of Mouth', description: 'Referral program — invite friends, get rewards' },
            { id: 'r2d2d', label: 'Local Events', description: 'Attend markets, fairs, and meetups to meet customers' },
          ],
          rubric: [
            { criterion: 'Channel-segment fit', max_score: 5, description: 'Does this channel reach the target segment?' },
            { criterion: 'Scalability', max_score: 5, description: 'Can this scale as the business grows?' },
          ],
          rules: [
            { option_id: 'r2d2a', deltas: { users_total: 100, active_users: 40, cac: 8, burn_rate: 800 } },
            { option_id: 'r2d2b', deltas: { users_total: 60, active_users: 30, brand_trust: 10, burn_rate: 300 } },
            { option_id: 'r2d2c', deltas: { users_total: 70, active_users: 45, cac: -5, churn_rate: -0.01 } },
            { option_id: 'r2d2d', deltas: { users_total: 30, active_users: 20, brand_trust: 12, nps: 8, burn_rate: 500 } },
          ],
        },
        {
          id: 'r2d3', round_id: 'round-2', title: 'Revenue Model', description: 'How will your startup make money?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r2d3a', label: 'Subscription', description: 'Monthly fee for premium features (€5-10/month)' },
            { id: 'r2d3b', label: 'Freemium', description: 'Free basic version, paid upgrades for power users' },
            { id: 'r2d3c', label: 'Commission', description: 'Take a small percentage of each transaction' },
            { id: 'r2d3d', label: 'Advertising', description: 'Free for users, show relevant ads from partners' },
          ],
          rubric: [
            { criterion: 'Revenue sustainability', max_score: 5, description: 'Will this generate sustainable revenue?' },
            { criterion: 'User impact', max_score: 5, description: 'How does the model affect user experience?' },
          ],
          rules: [
            { option_id: 'r2d3a', deltas: { revenue: 1500, arpu: 7, users_total: -20, churn_rate: 0.02 } },
            { option_id: 'r2d3b', deltas: { revenue: 800, arpu: 3, users_total: 40, conversion_rate: 0.01 } },
            { option_id: 'r2d3c', deltas: { revenue: 1000, arpu: 5, conversion_rate: -0.005 } },
            { option_id: 'r2d3d', deltas: { revenue: 600, users_total: 60, nps: -5, brand_trust: -3 } },
          ],
        },
        {
          id: 'r2d4', round_id: 'round-2', title: 'Customer Feedback', description: 'Early users are giving feedback. What do you prioritize?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r2d4a', label: 'Fix Bugs First', description: 'Users report crashes and slow loading — fix stability' },
            { id: 'r2d4b', label: 'Add Features', description: 'Users want more features — build what they ask for' },
            { id: 'r2d4c', label: 'Improve Onboarding', description: 'New users are confused — simplify the first experience' },
            { id: 'r2d4d', label: 'Focus on Core', description: 'Ignore feature requests — perfect the one core function' },
          ],
          rubric: [
            { criterion: 'Prioritization skill', max_score: 5, description: 'Did they choose the highest-impact action?' },
            { criterion: 'User empathy', max_score: 5, description: 'Do they understand user needs?' },
          ],
          rules: [
            { option_id: 'r2d4a', deltas: { product_quality: 10, tech_debt: -5, nps: 5 } },
            { option_id: 'r2d4b', deltas: { product_quality: 3, tech_debt: 8, users_total: 20, nps: -3 } },
            { option_id: 'r2d4c', deltas: { conversion_rate: 0.02, active_users: 30, nps: 8, churn_rate: -0.02 } },
            { option_id: 'r2d4d', deltas: { product_quality: 12, nps: 10, churn_rate: -0.01 } },
          ],
        },
      ],
    },
    // ── Week 3: Build the Business Model ──
    {
      id: 'round-3',
      season_id: 'season-startup-lab',
      week_number: 3,
      narrative: `Week 3: Your startup is taking shape! You have a problem, a customer, and a value proposition. Now it's time to build a complete business model.\n\nThink about the Business Model Canvas:\n• Key Partners — who helps you?\n• Key Activities — what do you do?\n• Key Resources — what do you need?\n• Cost Structure — what does it cost?\n• Revenue Streams — how do you earn?\n\nYour early users are growing, but costs are rising. Time to think strategically about sustainability.`,
      decisions: [
        {
          id: 'r3d1', round_id: 'round-3', title: 'Key Partnership', description: 'Which strategic partner would help your startup the most?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r3d1a', label: 'Technology Partner', description: 'A tech company providing infrastructure (cloud, APIs, tools)' },
            { id: 'r3d1b', label: 'Distribution Partner', description: 'A company with access to your target customers' },
            { id: 'r3d1c', label: 'Content Partner', description: 'An influencer or media company to build awareness' },
            { id: 'r3d1d', label: 'Mentor/Accelerator', description: 'A startup accelerator providing guidance and connections' },
          ],
          rubric: [
            { criterion: 'Strategic value', max_score: 5, description: 'Does this partnership address a key weakness?' },
            { criterion: 'Feasibility', max_score: 5, description: 'Is this partnership realistic?' },
          ],
          rules: [
            { option_id: 'r3d1a', deltas: { product_quality: 8, tech_debt: -5, burn_rate: -500 } },
            { option_id: 'r3d1b', deltas: { users_total: 100, active_users: 40, cac: -8 } },
            { option_id: 'r3d1c', deltas: { users_total: 80, brand_trust: 10, burn_rate: 600 } },
            { option_id: 'r3d1d', deltas: { brand_trust: 8, product_quality: 5, burn_rate: -300, revenue: 200 } },
          ],
        },
        {
          id: 'r3d2', round_id: 'round-3', title: 'Cost Management', description: 'Your costs are growing. What do you cut?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r3d2a', label: 'Reduce Marketing', description: 'Spend less on ads, rely on organic growth' },
            { id: 'r3d2b', label: 'Use Free Tools', description: 'Switch to free alternatives for design, hosting, analytics' },
            { id: 'r3d2c', label: 'Outsource Development', description: 'Hire freelancers instead of full-time developers' },
            { id: 'r3d2d', label: 'Focus Spending', description: 'Cut everything except the one activity driving growth' },
          ],
          rubric: [
            { criterion: 'Financial discipline', max_score: 5, description: 'Does the choice extend runway wisely?' },
            { criterion: 'Growth preservation', max_score: 5, description: 'Can they still grow while cutting costs?' },
          ],
          rules: [
            { option_id: 'r3d2a', deltas: { burn_rate: -1500, users_total: -30, cac: 5 } },
            { option_id: 'r3d2b', deltas: { burn_rate: -1000, product_quality: -3, tech_debt: 3 } },
            { option_id: 'r3d2c', deltas: { burn_rate: -800, tech_debt: 5, product_quality: -2 } },
            { option_id: 'r3d2d', deltas: { burn_rate: -2000, users_total: 20, active_users: 15 } },
          ],
        },
        {
          id: 'r3d3', round_id: 'round-3', title: 'Business Model Type', description: 'Which business model best fits your startup?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r3d3a', label: 'Platform/Marketplace', description: 'Connect buyers and sellers, take a commission' },
            { id: 'r3d3b', label: 'SaaS (Software)', description: 'Sell software as a monthly subscription' },
            { id: 'r3d3c', label: 'Direct-to-Consumer', description: 'Sell products or services directly to end users' },
            { id: 'r3d3d', label: 'Ecosystem/Freemium', description: 'Build a free ecosystem, monetize with premium features' },
          ],
          rubric: [
            { criterion: 'Model-problem fit', max_score: 5, description: 'Does the model fit the problem they\'re solving?' },
            { criterion: 'Scalability', max_score: 5, description: 'Can this model scale to thousands of users?' },
          ],
          rules: [
            { option_id: 'r3d3a', deltas: { revenue: 1200, users_total: 50, compliance_risk: 3 } },
            { option_id: 'r3d3b', deltas: { revenue: 2000, arpu: 10, churn_rate: 0.01, product_quality: 5 } },
            { option_id: 'r3d3c', deltas: { revenue: 1500, arpu: 12, burn_rate: 800 } },
            { option_id: 'r3d3d', deltas: { users_total: 100, active_users: 50, revenue: 500, churn_rate: -0.01 } },
          ],
        },
        {
          id: 'r3d4', round_id: 'round-3', title: 'Competitive Advantage', description: 'What will make your startup hard to copy?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r3d4a', label: 'Network Effects', description: 'More users = more value for everyone (like social networks)' },
            { id: 'r3d4b', label: 'Proprietary Data', description: 'Unique data that improves your product over time' },
            { id: 'r3d4c', label: 'Brand & Community', description: 'Strong brand identity and loyal user community' },
            { id: 'r3d4d', label: 'Speed of Execution', description: 'Move faster than competitors — first mover advantage' },
          ],
          rubric: [
            { criterion: 'Defensibility', max_score: 5, description: 'Is this truly hard to replicate?' },
            { criterion: 'Sustainability', max_score: 5, description: 'Will this advantage last over time?' },
          ],
          rules: [
            { option_id: 'r3d4a', deltas: { users_total: 60, active_users: 30, churn_rate: -0.015, product_quality: 5 } },
            { option_id: 'r3d4b', deltas: { product_quality: 10, conversion_rate: 0.01, tech_debt: 4 } },
            { option_id: 'r3d4c', deltas: { brand_trust: 15, nps: 10, churn_rate: -0.02 } },
            { option_id: 'r3d4d', deltas: { users_total: 40, product_quality: 3, tech_debt: 6, burn_rate: 500 } },
          ],
        },
      ],
    },
    // ── Week 4: Design the MVP ──
    {
      id: 'round-4',
      season_id: 'season-startup-lab',
      week_number: 4,
      narrative: `Week 4: It's time to build your Minimum Viable Product (MVP)! An MVP is the simplest version of your product that lets you test your idea with real users.\n\nRemember: an MVP is NOT a finished product. It's the fastest way to learn whether your idea works. Think: What is the ONE thing users must be able to do?\n\nSHOCK EVENT: A competitor just launched a similar app! They have more funding but a generic approach. How do you respond?`,
      shock_event: {
        title: 'Competitor Launches Similar App',
        description: 'A well-funded team launches an app solving a similar problem. They have a bigger budget but less focus.',
        kpi_effects: { nps: -3, churn_rate: 0.01, users_total: -15, brand_trust: -3 },
      },
      decisions: [
        {
          id: 'r4d1', round_id: 'round-4', title: 'MVP Approach', description: 'How will you build your MVP?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r4d1a', label: 'Landing Page + Waitlist', description: 'Simple website that explains the idea and collects signups' },
            { id: 'r4d1b', label: 'No-Code App', description: 'Build a working prototype using no-code tools (fast but limited)' },
            { id: 'r4d1c', label: 'Mobile App', description: 'Develop a basic mobile app with core features' },
            { id: 'r4d1d', label: 'Manual Service', description: 'Deliver the service manually first to validate demand' },
          ],
          rubric: [
            { criterion: 'Speed to market', max_score: 5, description: 'How fast can they launch and learn?' },
            { criterion: 'Learning potential', max_score: 5, description: 'Will this approach generate real user insights?' },
          ],
          rules: [
            { option_id: 'r4d1a', deltas: { users_total: 50, conversion_rate: 0.01, burn_rate: 200, product_quality: 2 } },
            { option_id: 'r4d1b', deltas: { product_quality: 8, active_users: 30, burn_rate: 500, tech_debt: 3 } },
            { option_id: 'r4d1c', deltas: { product_quality: 12, active_users: 40, burn_rate: 2000, tech_debt: 5 } },
            { option_id: 'r4d1d', deltas: { nps: 15, conversion_rate: 0.03, active_users: 15, burn_rate: 300 } },
          ],
        },
        {
          id: 'r4d2', round_id: 'round-4', title: 'Core Feature', description: 'What is the ONE core feature of your MVP?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r4d2a', label: 'Search & Discovery', description: 'Help users find exactly what they need quickly' },
            { id: 'r4d2b', label: 'Social Connection', description: 'Connect users with each other around the problem' },
            { id: 'r4d2c', label: 'Booking/Ordering', description: 'Let users book, order, or request the service' },
            { id: 'r4d2d', label: 'Tracking & Analytics', description: 'Help users track their progress or activities' },
          ],
          rubric: [
            { criterion: 'Problem-feature fit', max_score: 5, description: 'Does this feature solve the core problem?' },
            { criterion: 'User value', max_score: 5, description: 'Will users love this feature?' },
          ],
          rules: [
            { option_id: 'r4d2a', deltas: { conversion_rate: 0.02, active_users: 25, product_quality: 6 } },
            { option_id: 'r4d2b', deltas: { active_users: 40, churn_rate: -0.02, nps: 8 } },
            { option_id: 'r4d2c', deltas: { revenue: 800, conversion_rate: 0.015, arpu: 5 } },
            { option_id: 'r4d2d', deltas: { nps: 10, product_quality: 8, churn_rate: -0.015 } },
          ],
        },
        {
          id: 'r4d3', round_id: 'round-4', title: 'Competitor Response', description: 'A competitor launched! How do you react?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r4d3a', label: 'Ignore & Focus', description: 'Stay focused on your users — don\'t get distracted' },
            { id: 'r4d3b', label: 'Differentiate', description: 'Double down on what makes you unique' },
            { id: 'r4d3c', label: 'Move Faster', description: 'Speed up development to launch before they gain traction' },
            { id: 'r4d3d', label: 'Partner Up', description: 'Approach the competitor about a potential partnership' },
          ],
          rubric: [
            { criterion: 'Strategic thinking', max_score: 5, description: 'Is this a mature competitive response?' },
            { criterion: 'Execution focus', max_score: 5, description: 'Does this keep the team productive?' },
          ],
          rules: [
            { option_id: 'r4d3a', deltas: { product_quality: 5, nps: 3 } },
            { option_id: 'r4d3b', deltas: { brand_trust: 10, nps: 8, conversion_rate: 0.01 } },
            { option_id: 'r4d3c', deltas: { product_quality: -3, tech_debt: 8, users_total: 30, burn_rate: 1000 } },
            { option_id: 'r4d3d', deltas: { brand_trust: 5, users_total: 40, compliance_risk: 3 } },
          ],
        },
        {
          id: 'r4d4', round_id: 'round-4', title: 'User Testing', description: 'How will you test your MVP with users?',
          type: 'data_ai', format: 'multiple_choice',
          options: [
            { id: 'r4d4a', label: 'Beta Program', description: 'Invite 20 users to test, collect detailed feedback' },
            { id: 'r4d4b', label: 'A/B Testing', description: 'Show different versions to different users, measure which works' },
            { id: 'r4d4c', label: 'Public Launch', description: 'Launch to everyone and see what happens' },
            { id: 'r4d4d', label: 'Focus Group', description: 'Gather a small group, watch them use the product, ask questions' },
          ],
          rubric: [
            { criterion: 'Learning quality', max_score: 5, description: 'Will this generate actionable insights?' },
            { criterion: 'Risk management', max_score: 5, description: 'Does it limit downside risk?' },
          ],
          rules: [
            { option_id: 'r4d4a', deltas: { product_quality: 8, nps: 5, conversion_rate: 0.01 } },
            { option_id: 'r4d4b', deltas: { conversion_rate: 0.015, product_quality: 5, tech_debt: 3 } },
            { option_id: 'r4d4c', deltas: { users_total: 80, active_users: 30, churn_rate: 0.03, nps: -5 } },
            { option_id: 'r4d4d', deltas: { product_quality: 10, nps: 10 } },
          ],
        },
      ],
    },
    // ── Week 5: Growth and Marketing Strategy ──
    {
      id: 'round-5',
      season_id: 'season-startup-lab',
      week_number: 5,
      narrative: `Week 5: Your MVP is live and getting real user feedback! Now it's time to think about growth. How do you get from your first 100 users to 1,000? And then to 10,000?\n\nGrowth is not just about marketing — it's about creating a product people want to share. Think about:\n• Acquisition — how do new users find you?\n• Activation — do they have a great first experience?\n• Retention — do they come back?\n• Revenue — do they pay?\n• Referral — do they tell friends?`,
      decisions: [
        {
          id: 'r5d1', round_id: 'round-5', title: 'Growth Strategy', description: 'Which growth approach will you prioritize?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r5d1a', label: 'Viral Marketing', description: 'Create shareable content that spreads naturally' },
            { id: 'r5d1b', label: 'Paid Advertising', description: 'Invest in Instagram/TikTok ads targeting your audience' },
            { id: 'r5d1c', label: 'Community Building', description: 'Build a loyal community that grows through word of mouth' },
            { id: 'r5d1d', label: 'Partnerships', description: 'Partner with established brands or platforms for distribution' },
          ],
          rubric: [
            { criterion: 'Growth potential', max_score: 5, description: 'Can this approach drive significant growth?' },
            { criterion: 'Sustainability', max_score: 5, description: 'Is this growth sustainable long-term?' },
          ],
          rules: [
            { option_id: 'r5d1a', deltas: { users_total: 150, active_users: 60, brand_trust: 5, burn_rate: 500 } },
            { option_id: 'r5d1b', deltas: { users_total: 200, active_users: 50, cac: 12, burn_rate: 2500 } },
            { option_id: 'r5d1c', deltas: { users_total: 80, active_users: 60, nps: 12, churn_rate: -0.02, brand_trust: 10 } },
            { option_id: 'r5d1d', deltas: { users_total: 120, active_users: 45, brand_trust: 8, burn_rate: 800 } },
          ],
        },
        {
          id: 'r5d2', round_id: 'round-5', title: 'Pricing Decision', description: 'How much should you charge?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r5d2a', label: 'Free Forever', description: 'Keep it free to maximize user growth' },
            { id: 'r5d2b', label: 'Low Price (€3/mo)', description: 'Affordable price that most students can pay' },
            { id: 'r5d2c', label: 'Premium (€10/mo)', description: 'Higher price for serious users who see real value' },
            { id: 'r5d2d', label: 'Pay What You Want', description: 'Let users choose what to pay — builds goodwill' },
          ],
          rubric: [
            { criterion: 'Pricing strategy', max_score: 5, description: 'Is the pricing aligned with value delivered?' },
            { criterion: 'Market fit', max_score: 5, description: 'Will the target audience pay this?' },
          ],
          rules: [
            { option_id: 'r5d2a', deltas: { users_total: 100, active_users: 50, revenue: -500, burn_rate: 500 } },
            { option_id: 'r5d2b', deltas: { revenue: 1500, arpu: 3, users_total: 30, churn_rate: 0.01 } },
            { option_id: 'r5d2c', deltas: { revenue: 2500, arpu: 10, users_total: -20, churn_rate: 0.02 } },
            { option_id: 'r5d2d', deltas: { revenue: 800, brand_trust: 8, nps: 5, users_total: 20 } },
          ],
        },
        {
          id: 'r5d3', round_id: 'round-5', title: 'Retention Focus', description: 'Users are signing up but some leave after a week. What do you do?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r5d3a', label: 'Email Onboarding', description: 'Send helpful emails during the first week' },
            { id: 'r5d3b', label: 'Gamification', description: 'Add points, badges, and streaks to keep users engaged' },
            { id: 'r5d3c', label: 'Personalization', description: 'Customize the experience based on user preferences' },
            { id: 'r5d3d', label: 'Customer Support', description: 'Offer quick personal support via chat for new users' },
          ],
          rubric: [
            { criterion: 'Retention impact', max_score: 5, description: 'Will this meaningfully reduce churn?' },
            { criterion: 'Implementation effort', max_score: 5, description: 'Is this feasible with current resources?' },
          ],
          rules: [
            { option_id: 'r5d3a', deltas: { churn_rate: -0.015, active_users: 20, burn_rate: 200 } },
            { option_id: 'r5d3b', deltas: { churn_rate: -0.02, active_users: 30, nps: 5, tech_debt: 3 } },
            { option_id: 'r5d3c', deltas: { churn_rate: -0.025, conversion_rate: 0.01, tech_debt: 5, burn_rate: 1000 } },
            { option_id: 'r5d3d', deltas: { churn_rate: -0.01, nps: 10, brand_trust: 5, burn_rate: 800 } },
          ],
        },
        {
          id: 'r5d4', round_id: 'round-5', title: 'Data Strategy', description: 'What data will you use to make better decisions?',
          type: 'data_ai', format: 'multiple_choice',
          options: [
            { id: 'r5d4a', label: 'User Analytics', description: 'Track what users do, where they drop off, what they love' },
            { id: 'r5d4b', label: 'Customer Surveys', description: 'Ask users directly what they want and need' },
            { id: 'r5d4c', label: 'Market Data', description: 'Monitor competitor moves, market trends, and industry reports' },
            { id: 'r5d4d', label: 'Financial Metrics', description: 'Focus on revenue, costs, and unit economics' },
          ],
          rubric: [
            { criterion: 'Data-driven thinking', max_score: 5, description: 'Are they using data to make decisions?' },
            { criterion: 'Actionability', max_score: 5, description: 'Can they act on these insights?' },
          ],
          rules: [
            { option_id: 'r5d4a', deltas: { product_quality: 8, conversion_rate: 0.01, tech_debt: 2 } },
            { option_id: 'r5d4b', deltas: { nps: 8, product_quality: 5, brand_trust: 3 } },
            { option_id: 'r5d4c', deltas: { brand_trust: 5, product_quality: 3 } },
            { option_id: 'r5d4d', deltas: { revenue: 500, burn_rate: -500, arpu: 2 } },
          ],
        },
      ],
    },
    // ── Week 6: Final Startup Pitch and Results ──
    {
      id: 'round-6',
      season_id: 'season-startup-lab',
      week_number: 6,
      narrative: `Week 6: FINAL WEEK! It's time to present your startup to investors. You need to prepare your final pitch and make your last strategic decisions.\n\nYour pitch must include:\n• The problem you're solving\n• Your solution and MVP\n• Your business model\n• Traction and KPIs\n• Growth strategy\n• What you need to succeed\n\nSHOCK EVENT: A potential investor offers €200K but wants 40% of the company. Meanwhile, a startup accelerator offers €50K for 8% equity plus mentorship. What do you choose?`,
      shock_event: {
        title: 'Investment Offers',
        description: 'Two investment offers arrive: a large investor (€200K for 40%) or an accelerator (€50K for 8% + mentorship).',
        kpi_effects: { brand_trust: 5, nps: 3 },
      },
      decisions: [
        {
          id: 'r6d1', round_id: 'round-6', title: 'Investment Decision', description: 'Which investment offer do you accept?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r6d1a', label: 'Big Investor (€200K/40%)', description: 'More money but you lose significant control' },
            { id: 'r6d1b', label: 'Accelerator (€50K/8%)', description: 'Less money but mentorship and connections' },
            { id: 'r6d1c', label: 'Bootstrap', description: 'Reject both — grow with your own revenue' },
            { id: 'r6d1d', label: 'Negotiate', description: 'Counter-offer: €100K for 20% from the big investor' },
          ],
          rubric: [
            { criterion: 'Financial reasoning', max_score: 5, description: 'Did they evaluate the tradeoffs properly?' },
            { criterion: 'Long-term thinking', max_score: 5, description: 'Does this set up the company for future success?' },
          ],
          rules: [
            { option_id: 'r6d1a', deltas: { runway_months: 8, burn_rate: 1000, brand_trust: -5, product_quality: 5 } },
            { option_id: 'r6d1b', deltas: { runway_months: 3, brand_trust: 10, product_quality: 8, nps: 5 } },
            { option_id: 'r6d1c', deltas: { brand_trust: 5, runway_months: -1 } },
            { option_id: 'r6d1d', deltas: { runway_months: 5, brand_trust: 3, burn_rate: 500 } },
          ],
        },
        {
          id: 'r6d2', round_id: 'round-6', title: 'Final Product Decision', description: 'What is the most important thing to build before your pitch?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r6d2a', label: 'Polish the MVP', description: 'Make the existing product smooth and bug-free' },
            { id: 'r6d2b', label: 'Add Key Feature', description: 'Build the #1 most-requested feature' },
            { id: 'r6d2c', label: 'Build Demo', description: 'Create an impressive demo for the pitch presentation' },
            { id: 'r6d2d', label: 'Gather Testimonials', description: 'Get video testimonials from happy early users' },
          ],
          rubric: [
            { criterion: 'Pitch readiness', max_score: 5, description: 'Does this make the pitch stronger?' },
            { criterion: 'Product maturity', max_score: 5, description: 'Does this show the product is viable?' },
          ],
          rules: [
            { option_id: 'r6d2a', deltas: { product_quality: 12, tech_debt: -5, nps: 5 } },
            { option_id: 'r6d2b', deltas: { product_quality: 5, active_users: 30, conversion_rate: 0.01, tech_debt: 4 } },
            { option_id: 'r6d2c', deltas: { brand_trust: 8, nps: 3, burn_rate: 500 } },
            { option_id: 'r6d2d', deltas: { brand_trust: 12, nps: 10, conversion_rate: 0.005 } },
          ],
        },
        {
          id: 'r6d3', round_id: 'round-6', title: 'Growth Plan', description: 'What is your 12-month growth plan?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r6d3a', label: 'Aggressive Expansion', description: 'Launch in 5 new cities, hire 10 people, spend big on marketing' },
            { id: 'r6d3b', label: 'Focused Growth', description: 'Perfect one market first, then expand methodically' },
            { id: 'r6d3c', label: 'Product-Led Growth', description: 'Let the product sell itself — invest in features, not marketing' },
            { id: 'r6d3d', label: 'Partnership-Driven', description: 'Grow through strategic partnerships and integrations' },
          ],
          rubric: [
            { criterion: 'Ambition vs realism', max_score: 5, description: 'Is the plan ambitious but achievable?' },
            { criterion: 'Resource awareness', max_score: 5, description: 'Do they have the resources to execute?' },
          ],
          rules: [
            { option_id: 'r6d3a', deltas: { users_total: 300, burn_rate: 5000, compliance_risk: 5, tech_debt: 8 } },
            { option_id: 'r6d3b', deltas: { users_total: 100, active_users: 60, nps: 8, brand_trust: 8 } },
            { option_id: 'r6d3c', deltas: { product_quality: 10, conversion_rate: 0.02, users_total: 80, churn_rate: -0.01 } },
            { option_id: 'r6d3d', deltas: { users_total: 150, brand_trust: 10, revenue: 1000, burn_rate: 500 } },
          ],
        },
        {
          id: 'r6d4', round_id: 'round-6', title: 'Impact Vision', description: 'How will your startup make the world better?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r6d4a', label: 'Environmental Impact', description: 'Reduce waste, carbon emissions, or resource consumption' },
            { id: 'r6d4b', label: 'Social Impact', description: 'Improve education, health, or community connections' },
            { id: 'r6d4c', label: 'Economic Impact', description: 'Create jobs, support small businesses, reduce inequality' },
            { id: 'r6d4d', label: 'Innovation Impact', description: 'Push technology forward, inspire new ways of thinking' },
          ],
          rubric: [
            { criterion: 'Vision clarity', max_score: 5, description: 'Is the impact vision clear and inspiring?' },
            { criterion: 'Authenticity', max_score: 5, description: 'Does it align with their business model?' },
          ],
          rules: [
            { option_id: 'r6d4a', deltas: { brand_trust: 12, nps: 8 } },
            { option_id: 'r6d4b', deltas: { brand_trust: 10, nps: 10, active_users: 20 } },
            { option_id: 'r6d4c', deltas: { brand_trust: 8, revenue: 500, users_total: 30 } },
            { option_id: 'r6d4d', deltas: { brand_trust: 8, product_quality: 8, nps: 5 } },
          ],
        },
      ],
    },
  ],
};
