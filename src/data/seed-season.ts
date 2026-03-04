import { SimulationSeason, KPIs } from '@/types/simulator';

export const INITIAL_KPIS: KPIs = {
  users_total: 500,
  active_users: 200,
  churn_rate: 0.08,
  conversion_rate: 0.03,
  cac: 45,
  arpu: 12,
  revenue: 2400,
  burn_rate: 15000,
  runway_months: 14,
  nps: 30,
  product_quality: 60,
  tech_debt: 20,
  brand_trust: 50,
  compliance_risk: 10,
};

export const SEED_SEASON: SimulationSeason = {
  id: 'season-circular-commerce',
  theme: 'Circular Commerce Marketplace',
  description: 'Build and scale a peer-to-peer marketplace for pre-owned and refurbished goods. Navigate sustainability regulations, build trust, and find product-market fit in the circular economy.',
  start_date: '2026-03-01',
  weeks: 8,
  difficulty: 'medium',
  volatility: 0.1,
  scoring_weights: {
    decision_quality: 0.3,
    evidence_use: 0.2,
    experiment_discipline: 0.15,
    strategic_coherence: 0.2,
    reflection_quality: 0.15,
  },
  created_by: 'admin',
  rounds: [
    {
      id: 'round-1',
      season_id: 'season-circular-commerce',
      week_number: 1,
      narrative: `Welcome to CircleMarket — a peer-to-peer marketplace for pre-owned and refurbished goods. You've just closed a €200K pre-seed round. Your MVP is live with basic listings, messaging, and payments. Early traction shows promise: 500 registered users, 200 monthly actives, but conversion is low at 3%. Your challenge this week: define your target segment and decide on your initial product priorities. The circular commerce space is heating up — two competitors launched last month.`,
      baseline_kpis: INITIAL_KPIS,
      decisions: [
        {
          id: 'r1d1',
          round_id: 'round-1',
          title: 'Target Segment Selection',
          description: 'Which customer segment should CircleMarket focus on first?',
          type: 'strategy',
          format: 'multiple_choice',
          options: [
            { id: 'r1d1a', label: 'Gen-Z Fashion', description: 'Trend-conscious 18-25 year olds trading streetwear and vintage clothing' },
            { id: 'r1d1b', label: 'Eco-Conscious Families', description: 'Parents seeking affordable, sustainable kids items and home goods' },
            { id: 'r1d1c', label: 'Tech Enthusiasts', description: 'Users buying/selling refurbished electronics and gadgets' },
            { id: 'r1d1d', label: 'Broad Market', description: 'Keep targeting everyone — don\'t limit the addressable market' },
          ],
          rubric: [
            { criterion: 'Market sizing reasoning', max_score: 5, description: 'Did the team justify segment size and growth?' },
            { criterion: 'Fit with capabilities', max_score: 5, description: 'Does the choice align with current platform strengths?' },
          ],
          rules: [
            { option_id: 'r1d1a', deltas: { conversion_rate: 0.015, active_users: 80, brand_trust: 8, nps: 5 } },
            { option_id: 'r1d1b', deltas: { conversion_rate: 0.01, active_users: 50, arpu: 3, brand_trust: 10 } },
            { option_id: 'r1d1c', deltas: { conversion_rate: 0.012, arpu: 8, active_users: 40, tech_debt: 5 } },
            { option_id: 'r1d1d', deltas: { conversion_rate: -0.005, active_users: 20, cac: 10, burn_rate: 2000 } },
          ],
        },
        {
          id: 'r1d2',
          round_id: 'round-1',
          title: 'MVP Feature Priority',
          description: 'Which feature should the team build next?',
          type: 'product',
          format: 'multiple_choice',
          options: [
            { id: 'r1d2a', label: 'Quality Verification', description: 'Photo AI + seller rating system to build buyer trust' },
            { id: 'r1d2b', label: 'Social Features', description: 'Follow sellers, share listings, community feed' },
            { id: 'r1d2c', label: 'Smart Pricing', description: 'AI-powered price suggestions based on item condition and market' },
            { id: 'r1d2d', label: 'Shipping Integration', description: 'Built-in label generation and tracking for seamless delivery' },
          ],
          rubric: [
            { criterion: 'User need alignment', max_score: 5, description: 'Does feature address biggest user pain?' },
            { criterion: 'Build vs impact tradeoff', max_score: 5, description: 'Is effort justified by expected impact?' },
          ],
          rules: [
            { option_id: 'r1d2a', deltas: { product_quality: 12, nps: 8, conversion_rate: 0.01, tech_debt: 3, burn_rate: 1000 } },
            { option_id: 'r1d2b', deltas: { active_users: 60, nps: 3, churn_rate: -0.01, tech_debt: 5, burn_rate: 800 } },
            { option_id: 'r1d2c', deltas: { conversion_rate: 0.008, arpu: 2, product_quality: 5, tech_debt: 8, burn_rate: 1500 } },
            { option_id: 'r1d2d', deltas: { nps: 10, conversion_rate: 0.012, product_quality: 8, burn_rate: 2000 } },
          ],
        },
        {
          id: 'r1d3',
          round_id: 'round-1',
          title: 'Growth Channel Bet',
          description: 'Where should you spend your first marketing budget?',
          type: 'growth',
          format: 'multiple_choice',
          options: [
            { id: 'r1d3a', label: 'TikTok/Instagram Creators', description: 'Partner with micro-influencers in sustainability niche' },
            { id: 'r1d3b', label: 'SEO & Content', description: 'Build a blog and guides around circular living' },
            { id: 'r1d3c', label: 'Referral Program', description: 'Give credit for inviting friends — viral loop' },
            { id: 'r1d3d', label: 'University Partnerships', description: 'Launch campus ambassador program at 5 universities' },
          ],
          rubric: [
            { criterion: 'Channel-segment fit', max_score: 5, description: 'Does the channel reach the target segment?' },
            { criterion: 'Cost efficiency reasoning', max_score: 5, description: 'Did they consider CAC impact?' },
          ],
          rules: [
            { option_id: 'r1d3a', deltas: { users_total: 200, active_users: 80, cac: -5, brand_trust: 5, burn_rate: 3000 } },
            { option_id: 'r1d3b', deltas: { users_total: 60, active_users: 30, cac: -15, brand_trust: 8 } },
            { option_id: 'r1d3c', deltas: { users_total: 150, active_users: 90, cac: -10, burn_rate: 1500 } },
            { option_id: 'r1d3d', deltas: { users_total: 120, active_users: 70, cac: -8, brand_trust: 6, nps: 3 } },
          ],
        },
        {
          id: 'r1d4',
          round_id: 'round-1',
          title: 'Data Collection Strategy',
          description: 'What user data should you start collecting from day one?',
          type: 'data_ai',
          format: 'multiple_choice',
          options: [
            { id: 'r1d4a', label: 'Behavioral Analytics', description: 'Track browsing, search, and purchase patterns — privacy-friendly' },
            { id: 'r1d4b', label: 'Full User Profiling', description: 'Detailed surveys + browsing + social connections for personalization' },
            { id: 'r1d4c', label: 'Minimal — Privacy First', description: 'Only essential transaction data; build trust through transparency' },
            { id: 'r1d4d', label: 'A/B Testing Framework', description: 'Focus on experiment infrastructure over raw data collection' },
          ],
          rubric: [
            { criterion: 'Privacy-value balance', max_score: 5, description: 'Did they weigh data value vs. user trust?' },
            { criterion: 'Long-term data strategy', max_score: 5, description: 'Is there a roadmap for data use?' },
          ],
          rules: [
            { option_id: 'r1d4a', deltas: { product_quality: 5, compliance_risk: 3, tech_debt: 2 } },
            { option_id: 'r1d4b', deltas: { product_quality: 8, compliance_risk: 12, brand_trust: -5, tech_debt: 6 } },
            { option_id: 'r1d4c', deltas: { brand_trust: 10, compliance_risk: -3, product_quality: 2 } },
            { option_id: 'r1d4d', deltas: { product_quality: 6, tech_debt: 4, burn_rate: 500 } },
          ],
        },
      ],
    },
    {
      id: 'round-2',
      season_id: 'season-circular-commerce',
      week_number: 2,
      narrative: `Week 2: Your segment strategy is taking shape. Early metrics show promise but your churn is concerning — users browse but don't return. A sustainability blog picked up your story, driving a traffic spike. Your investors want to see improved retention before the next funding conversation. Meanwhile, the EU announced stricter rules on second-hand electronics sales starting Q3.`,
      decisions: [
        {
          id: 'r2d1', round_id: 'round-2', title: 'Retention Strategy', description: 'How will you tackle the churn problem?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r2d1a', label: 'Push Notifications & Email Drip', description: 'Automated re-engagement campaigns' },
            { id: 'r2d1b', label: 'Loyalty Program', description: 'Points for buying/selling, redeemable for discounts' },
            { id: 'r2d1c', label: 'Personalized Feed', description: 'ML-driven recommendations based on browsing history' },
            { id: 'r2d1d', label: 'Community Building', description: 'Forums, sustainability challenges, user stories' },
          ],
          rubric: [
            { criterion: 'Root cause analysis', max_score: 5, description: 'Did they diagnose why users churn?' },
            { criterion: 'Measurability', max_score: 5, description: 'Can they measure the retention impact?' },
          ],
          rules: [
            { option_id: 'r2d1a', deltas: { churn_rate: -0.015, active_users: 30, nps: -2, burn_rate: 500 } },
            { option_id: 'r2d1b', deltas: { churn_rate: -0.02, active_users: 40, arpu: -1, burn_rate: 1000 } },
            { option_id: 'r2d1c', deltas: { churn_rate: -0.025, active_users: 50, conversion_rate: 0.005, tech_debt: 6, burn_rate: 2000 } },
            { option_id: 'r2d1d', deltas: { churn_rate: -0.01, active_users: 35, nps: 8, brand_trust: 6 } },
          ],
        },
        {
          id: 'r2d2', round_id: 'round-2', title: 'Pricing Model', description: 'How should CircleMarket monetize?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r2d2a', label: '10% Commission', description: 'Take a cut of every transaction' },
            { id: 'r2d2b', label: 'Freemium + Promoted Listings', description: 'Free to list, pay for visibility' },
            { id: 'r2d2c', label: 'Subscription Tiers', description: 'Monthly plans for power sellers with perks' },
            { id: 'r2d2d', label: 'Stay Free', description: 'Grow first, monetize later — focus on volume' },
          ],
          rubric: [
            { criterion: 'Revenue sustainability', max_score: 5, description: 'Will this model sustain the business?' },
            { criterion: 'User impact assessment', max_score: 5, description: 'How does pricing affect user growth?' },
          ],
          rules: [
            { option_id: 'r2d2a', deltas: { revenue: 3000, arpu: 4, users_total: -30, conversion_rate: -0.005 } },
            { option_id: 'r2d2b', deltas: { revenue: 1500, arpu: 2, users_total: 20, active_users: 15 } },
            { option_id: 'r2d2c', deltas: { revenue: 2000, arpu: 6, users_total: -15, active_users: 10 } },
            { option_id: 'r2d2d', deltas: { users_total: 100, active_users: 50, burn_rate: 3000, runway_months: -1 } },
          ],
        },
        {
          id: 'r2d3', round_id: 'round-2', title: 'Compliance Response', description: 'How do you respond to the new EU electronics regulations?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r2d3a', label: 'Proactive Compliance', description: 'Hire a compliance consultant, implement checks immediately' },
            { id: 'r2d3b', label: 'Wait and See', description: 'Regulations don\'t take effect until Q3 — focus on growth' },
            { id: 'r2d3c', label: 'Pivot Away', description: 'Drop electronics category, focus on fashion/home goods' },
            { id: 'r2d3d', label: 'Industry Coalition', description: 'Join an industry group lobbying for startup-friendly rules' },
          ],
          rubric: [
            { criterion: 'Risk assessment quality', max_score: 5, description: 'Did they evaluate regulatory risk properly?' },
            { criterion: 'Strategic flexibility', max_score: 5, description: 'Does the response preserve future options?' },
          ],
          rules: [
            { option_id: 'r2d3a', deltas: { compliance_risk: -8, burn_rate: 2000, brand_trust: 5, product_quality: 3 } },
            { option_id: 'r2d3b', deltas: { compliance_risk: 5, brand_trust: -3 } },
            { option_id: 'r2d3c', deltas: { compliance_risk: -5, users_total: -40, revenue: -500, arpu: -2 } },
            { option_id: 'r2d3d', deltas: { compliance_risk: -3, brand_trust: 4, burn_rate: 500 } },
          ],
        },
        {
          id: 'r2d4', round_id: 'round-2', title: 'Hiring Decision', description: 'You can afford one key hire. Who do you bring on?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r2d4a', label: 'Full-Stack Engineer', description: 'Speed up feature development' },
            { id: 'r2d4b', label: 'Growth Marketer', description: 'Drive user acquisition and optimize funnels' },
            { id: 'r2d4c', label: 'Community Manager', description: 'Build and nurture the user community' },
            { id: 'r2d4d', label: 'Data Analyst', description: 'Turn your data into actionable insights' },
          ],
          rubric: [
            { criterion: 'Bottleneck identification', max_score: 5, description: 'Does the hire address the biggest constraint?' },
            { criterion: 'Team balance', max_score: 5, description: 'Does this round out the team well?' },
          ],
          rules: [
            { option_id: 'r2d4a', deltas: { product_quality: 8, tech_debt: -5, burn_rate: 5000 } },
            { option_id: 'r2d4b', deltas: { users_total: 100, cac: -8, burn_rate: 4500 } },
            { option_id: 'r2d4c', deltas: { nps: 8, churn_rate: -0.01, brand_trust: 5, burn_rate: 3500 } },
            { option_id: 'r2d4d', deltas: { product_quality: 5, conversion_rate: 0.005, burn_rate: 4000 } },
          ],
        },
      ],
    },
    {
      id: 'round-3',
      season_id: 'season-circular-commerce',
      week_number: 3,
      narrative: `Week 3: Traffic doubled this week! A viral TikTok about "thrifting online" mentioned your platform. But your infrastructure is straining — page load times increased 40%. Customer support tickets tripled. Two power sellers are complaining about fraudulent buyers. Your board is pushing for faster revenue growth.`,
      decisions: [
        {
          id: 'r3d1', round_id: 'round-3', title: 'Infrastructure Response', description: 'How do you handle the traffic surge?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r3d1a', label: 'Emergency Scaling', description: 'Upgrade servers, add CDN, optimize queries — sprint mode' },
            { id: 'r3d1b', label: 'Feature Freeze', description: 'Stop new features, focus entirely on performance and stability' },
            { id: 'r3d1c', label: 'Selective Scaling', description: 'Optimize the most critical paths only, accept some degradation' },
            { id: 'r3d1d', label: 'Rate Limiting', description: 'Cap new signups temporarily to protect existing user experience' },
          ],
          rubric: [
            { criterion: 'Technical judgment', max_score: 5, description: 'Is the approach technically sound?' },
            { criterion: 'User impact consideration', max_score: 5, description: 'How does it affect current users vs growth?' },
          ],
          rules: [
            { option_id: 'r3d1a', deltas: { product_quality: 10, tech_debt: -5, burn_rate: 4000, nps: 5 } },
            { option_id: 'r3d1b', deltas: { product_quality: 15, tech_debt: -10, nps: 3, users_total: -20 } },
            { option_id: 'r3d1c', deltas: { product_quality: 5, tech_debt: 3, burn_rate: 1500, nps: -2 } },
            { option_id: 'r3d1d', deltas: { product_quality: 8, users_total: -80, nps: -5, active_users: -20 } },
          ],
        },
        {
          id: 'r3d2', round_id: 'round-3', title: 'Trust & Safety', description: 'How will you combat fraud on the platform?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r3d2a', label: 'Escrow + Verification', description: 'Hold payments until buyer confirms; verify seller identity' },
            { id: 'r3d2b', label: 'AI Fraud Detection', description: 'Build ML model to flag suspicious accounts and transactions' },
            { id: 'r3d2c', label: 'Community Moderation', description: 'Empower trusted users to flag and review suspicious activity' },
            { id: 'r3d2d', label: 'Insurance Program', description: 'Offer buyer protection guarantee funded by a small fee' },
          ],
          rubric: [
            { criterion: 'Scalability of solution', max_score: 5, description: 'Will this scale as the platform grows?' },
            { criterion: 'Trust building', max_score: 5, description: 'Does it increase user confidence?' },
          ],
          rules: [
            { option_id: 'r3d2a', deltas: { brand_trust: 12, compliance_risk: -4, conversion_rate: -0.005, burn_rate: 1500 } },
            { option_id: 'r3d2b', deltas: { brand_trust: 8, compliance_risk: -3, tech_debt: 7, burn_rate: 3000 } },
            { option_id: 'r3d2c', deltas: { brand_trust: 6, nps: 4, compliance_risk: -2 } },
            { option_id: 'r3d2d', deltas: { brand_trust: 10, conversion_rate: 0.008, arpu: -1, burn_rate: 2000 } },
          ],
        },
        {
          id: 'r3d3', round_id: 'round-3', title: 'Revenue Acceleration', description: 'Board wants faster revenue. What\'s your move?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r3d3a', label: 'B2B Channel', description: 'Partner with retailers to sell their returns/overstock' },
            { id: 'r3d3b', label: 'Premium Services', description: 'Professional photography, authentication for high-value items' },
            { id: 'r3d3c', label: 'Geographic Expansion', description: 'Launch in 3 new EU markets simultaneously' },
            { id: 'r3d3d', label: 'Double Down Organic', description: 'Invest in SEO/content, wait for compounding growth' },
          ],
          rubric: [
            { criterion: 'Revenue potential', max_score: 5, description: 'Is the revenue upside realistic?' },
            { criterion: 'Execution risk', max_score: 5, description: 'Can the team execute this given resources?' },
          ],
          rules: [
            { option_id: 'r3d3a', deltas: { revenue: 5000, users_total: 50, arpu: 5, burn_rate: 2000, compliance_risk: 3 } },
            { option_id: 'r3d3b', deltas: { revenue: 3000, arpu: 8, product_quality: 5, burn_rate: 1500 } },
            { option_id: 'r3d3c', deltas: { users_total: 200, revenue: 2000, burn_rate: 6000, compliance_risk: 5, tech_debt: 4 } },
            { option_id: 'r3d3d', deltas: { users_total: 40, cac: -10, brand_trust: 3 } },
          ],
        },
        {
          id: 'r3d4', round_id: 'round-3', title: 'Support Scaling', description: 'Customer support is overwhelmed. What do you do?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r3d4a', label: 'AI Chatbot', description: 'Deploy conversational AI to handle common queries' },
            { id: 'r3d4b', label: 'Self-Service Hub', description: 'Build comprehensive FAQ, how-to guides, and knowledge base' },
            { id: 'r3d4c', label: 'Outsource', description: 'Hire an external support team for 24/7 coverage' },
            { id: 'r3d4d', label: 'Hire In-House', description: 'Bring on 2 dedicated support agents' },
          ],
          rubric: [
            { criterion: 'Cost efficiency', max_score: 5, description: 'Is this solution cost-effective at scale?' },
            { criterion: 'Quality of support', max_score: 5, description: 'Will user satisfaction improve?' },
          ],
          rules: [
            { option_id: 'r3d4a', deltas: { nps: 3, tech_debt: 4, burn_rate: 1000, product_quality: 3 } },
            { option_id: 'r3d4b', deltas: { nps: 5, burn_rate: 500, product_quality: 4 } },
            { option_id: 'r3d4c', deltas: { nps: 2, burn_rate: 4000, brand_trust: -2 } },
            { option_id: 'r3d4d', deltas: { nps: 8, burn_rate: 5000, brand_trust: 3 } },
          ],
        },
      ],
    },
    {
      id: 'round-4',
      season_id: 'season-circular-commerce',
      week_number: 4,
      narrative: `Week 4: SHOCK EVENT — A major competitor just launched "ReLoop," backed by €5M in funding. They're offering zero fees for the first 6 months and have started poaching your top sellers with sign-up bonuses. Your NPS dropped as users compare features. The press is covering the "circular commerce wars." How do you respond?`,
      shock_event: {
        title: 'Competitor Launch: ReLoop',
        description: 'A well-funded competitor launches with aggressive zero-fee pricing and seller incentives.',
        kpi_effects: { nps: -5, churn_rate: 0.02, users_total: -30, brand_trust: -5 },
      },
      decisions: [
        {
          id: 'r4d1', round_id: 'round-4', title: 'Competitive Response', description: 'How do you respond to ReLoop\'s aggressive launch?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r4d1a', label: 'Price Match', description: 'Temporarily drop fees to match and retain sellers' },
            { id: 'r4d1b', label: 'Differentiate on Trust', description: 'Double down on verification, sustainability creds, community' },
            { id: 'r4d1c', label: 'Exclusive Partnerships', description: 'Lock in key brands/sellers with exclusive deals' },
            { id: 'r4d1d', label: 'Ignore & Innovate', description: 'Focus on building features they can\'t easily copy' },
          ],
          rubric: [
            { criterion: 'Competitive analysis', max_score: 5, description: 'Did they assess competitor strengths/weaknesses?' },
            { criterion: 'Sustainability of response', max_score: 5, description: 'Is this a long-term viable strategy?' },
          ],
          rules: [
            { option_id: 'r4d1a', deltas: { revenue: -3000, churn_rate: -0.015, users_total: 20, burn_rate: 2000 } },
            { option_id: 'r4d1b', deltas: { brand_trust: 12, nps: 8, churn_rate: -0.01, burn_rate: 1500 } },
            { option_id: 'r4d1c', deltas: { churn_rate: -0.02, revenue: 2000, burn_rate: 3000, compliance_risk: 2 } },
            { option_id: 'r4d1d', deltas: { product_quality: 10, tech_debt: 5, churn_rate: 0.005, active_users: -15 } },
          ],
        },
        {
          id: 'r4d2', round_id: 'round-4', title: 'Seller Retention', description: 'Top sellers are considering ReLoop. What do you offer?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r4d2a', label: 'Seller Success Program', description: 'Personal account managers, analytics dashboard, growth tips' },
            { id: 'r4d2b', label: 'Revenue Sharing', description: 'Reduce commission for high-volume sellers' },
            { id: 'r4d2c', label: 'Seller Tools', description: 'Bulk listing, inventory management, cross-platform sync' },
            { id: 'r4d2d', label: 'Seller Community', description: 'Exclusive forum, meetups, co-creation of features' },
          ],
          rubric: [
            { criterion: 'Seller-centric thinking', max_score: 5, description: 'Does this address seller pain points?' },
            { criterion: 'Retention effectiveness', max_score: 5, description: 'Will this actually prevent churn?' },
          ],
          rules: [
            { option_id: 'r4d2a', deltas: { churn_rate: -0.015, nps: 6, burn_rate: 3000 } },
            { option_id: 'r4d2b', deltas: { churn_rate: -0.02, revenue: -1500, arpu: -2 } },
            { option_id: 'r4d2c', deltas: { churn_rate: -0.01, product_quality: 5, tech_debt: 5, burn_rate: 2000 } },
            { option_id: 'r4d2d', deltas: { churn_rate: -0.012, nps: 5, brand_trust: 4, burn_rate: 1000 } },
          ],
        },
        {
          id: 'r4d3', round_id: 'round-4', title: 'PR & Narrative', description: 'The press wants your take on the "circular commerce wars."',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r4d3a', label: 'David vs Goliath', description: 'Position as the authentic, community-driven underdog' },
            { id: 'r4d3b', label: 'Sustainability Leader', description: 'Focus on environmental impact, carbon offset data' },
            { id: 'r4d3c', label: 'Stay Quiet', description: 'Don\'t feed the narrative — let your product speak' },
            { id: 'r4d3d', label: 'Partnership Announcement', description: 'Time a strategic partnership announcement to counter the news' },
          ],
          rubric: [
            { criterion: 'Narrative quality', max_score: 5, description: 'Is the story compelling and authentic?' },
            { criterion: 'Strategic timing', max_score: 5, description: 'Is the approach well-timed?' },
          ],
          rules: [
            { option_id: 'r4d3a', deltas: { brand_trust: 8, users_total: 40, nps: 3 } },
            { option_id: 'r4d3b', deltas: { brand_trust: 10, users_total: 25, compliance_risk: -2 } },
            { option_id: 'r4d3c', deltas: { brand_trust: -2, users_total: -10 } },
            { option_id: 'r4d3d', deltas: { brand_trust: 6, users_total: 50, burn_rate: 1000 } },
          ],
        },
        {
          id: 'r4d4', round_id: 'round-4', title: 'Product Moat', description: 'What feature will be hardest for competitors to copy?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r4d4a', label: 'Sustainability Score', description: 'Rate every transaction by environmental impact with verified data' },
            { id: 'r4d4b', label: 'AI Style Matching', description: 'Match buyers with items based on style preferences and history' },
            { id: 'r4d4c', label: 'Circular Rewards', description: 'Track and reward users\' cumulative environmental impact' },
            { id: 'r4d4d', label: 'Local Hubs', description: 'Physical drop-off/pick-up locations with item verification' },
          ],
          rubric: [
            { criterion: 'Defensibility', max_score: 5, description: 'Is this truly hard to replicate?' },
            { criterion: 'User value', max_score: 5, description: 'Do users actually want this?' },
          ],
          rules: [
            { option_id: 'r4d4a', deltas: { brand_trust: 10, nps: 5, product_quality: 8, tech_debt: 5, burn_rate: 2000 } },
            { option_id: 'r4d4b', deltas: { conversion_rate: 0.01, active_users: 30, tech_debt: 8, burn_rate: 2500 } },
            { option_id: 'r4d4c', deltas: { nps: 8, churn_rate: -0.01, brand_trust: 6, burn_rate: 1000 } },
            { option_id: 'r4d4d', deltas: { brand_trust: 12, nps: 10, burn_rate: 5000, compliance_risk: 3 } },
          ],
        },
      ],
    },
    {
      id: 'round-5',
      season_id: 'season-circular-commerce',
      week_number: 5,
      narrative: `Week 5: The dust is settling from ReLoop's launch. Your retention strategy is showing results. Revenue is stabilizing. However, your tech debt is accumulating — the codebase is getting harder to maintain, and a junior engineer accidentally exposed some user emails in a debug log. Your investors have scheduled a mid-term review next week.`,
      decisions: [
        {
          id: 'r5d1', round_id: 'round-5', title: 'Technical Debt', description: 'How do you address growing tech debt?',
          type: 'product', format: 'multiple_choice',
          options: [
            { id: 'r5d1a', label: 'Dedicated Sprint', description: 'One full sprint of pure refactoring and testing' },
            { id: 'r5d1b', label: '20% Rule', description: 'Allocate 20% of each sprint to tech debt going forward' },
            { id: 'r5d1c', label: 'Rewrite Core', description: 'Rebuild the most problematic modules from scratch' },
            { id: 'r5d1d', label: 'Hire Senior Dev', description: 'Bring in a senior engineer to own architecture' },
          ],
          rubric: [
            { criterion: 'Technical reasoning', max_score: 5, description: 'Is the approach technically sound?' },
            { criterion: 'Business impact awareness', max_score: 5, description: 'Did they balance tech needs with business?' },
          ],
          rules: [
            { option_id: 'r5d1a', deltas: { tech_debt: -12, product_quality: 5, users_total: -10 } },
            { option_id: 'r5d1b', deltas: { tech_debt: -5, product_quality: 3 } },
            { option_id: 'r5d1c', deltas: { tech_debt: -20, product_quality: 10, burn_rate: 3000, users_total: -20 } },
            { option_id: 'r5d1d', deltas: { tech_debt: -8, product_quality: 8, burn_rate: 6000 } },
          ],
        },
        {
          id: 'r5d2', round_id: 'round-5', title: 'Privacy Incident Response', description: 'User emails were exposed in a debug log. What do you do?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r5d2a', label: 'Full Disclosure', description: 'Notify all affected users, publish incident report, implement fixes' },
            { id: 'r5d2b', label: 'Quiet Fix', description: 'Fix the bug, assess actual exposure risk, notify only if necessary' },
            { id: 'r5d2c', label: 'Security Audit', description: 'Hire external security firm for full audit before disclosing' },
            { id: 'r5d2d', label: 'Bug Bounty Launch', description: 'Fix the issue and launch a bug bounty program to find others' },
          ],
          rubric: [
            { criterion: 'Ethical reasoning', max_score: 5, description: 'Is the response ethically sound?' },
            { criterion: 'Risk mitigation', max_score: 5, description: 'Does it prevent future incidents?' },
          ],
          rules: [
            { option_id: 'r5d2a', deltas: { brand_trust: 8, compliance_risk: -5, nps: -3, users_total: -15 } },
            { option_id: 'r5d2b', deltas: { compliance_risk: 5, brand_trust: -3 } },
            { option_id: 'r5d2c', deltas: { compliance_risk: -8, brand_trust: 3, burn_rate: 3000, tech_debt: -3 } },
            { option_id: 'r5d2d', deltas: { compliance_risk: -6, brand_trust: 5, burn_rate: 1500, product_quality: 5 } },
          ],
        },
        {
          id: 'r5d3', round_id: 'round-5', title: 'Investor Pitch Focus', description: 'What narrative do you lead with for your mid-term review?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r5d3a', label: 'Growth Metrics', description: 'Lead with user growth, GMV, and market share gains' },
            { id: 'r5d3b', label: 'Unit Economics', description: 'Show improving CAC, LTV, and path to profitability' },
            { id: 'r5d3c', label: 'Vision & Moat', description: 'Focus on sustainable competitive advantages being built' },
            { id: 'r5d3d', label: 'Impact Story', description: 'Lead with environmental impact — tons of waste diverted, CO2 saved' },
          ],
          rubric: [
            { criterion: 'Investor understanding', max_score: 5, description: 'What matters to these investors?' },
            { criterion: 'Data-driven storytelling', max_score: 5, description: 'Are claims backed by metrics?' },
          ],
          rules: [
            { option_id: 'r5d3a', deltas: { burn_rate: -1000, brand_trust: 2 } },
            { option_id: 'r5d3b', deltas: { burn_rate: -2000, revenue: 1000 } },
            { option_id: 'r5d3c', deltas: { brand_trust: 5, product_quality: 3 } },
            { option_id: 'r5d3d', deltas: { brand_trust: 8, nps: 3, users_total: 20 } },
          ],
        },
        {
          id: 'r5d4', round_id: 'round-5', title: 'AI Feature Timing', description: 'When should you launch your first AI-powered feature?',
          type: 'data_ai', format: 'multiple_choice',
          options: [
            { id: 'r5d4a', label: 'Now — Quick Win', description: 'Launch AI pricing suggestions using existing data' },
            { id: 'r5d4b', label: 'Next Month — Polish', description: 'Take time to get accuracy right, beta test with power users' },
            { id: 'r5d4c', label: 'After Funding', description: 'Wait until you can invest properly in ML infrastructure' },
            { id: 'r5d4d', label: 'Partner Instead', description: 'Integrate a third-party AI service rather than building in-house' },
          ],
          rubric: [
            { criterion: 'Timing judgment', max_score: 5, description: 'Is the timing right for this feature?' },
            { criterion: 'Resource awareness', max_score: 5, description: 'Do they have the resources to execute?' },
          ],
          rules: [
            { option_id: 'r5d4a', deltas: { conversion_rate: 0.005, product_quality: 3, tech_debt: 6, nps: 2 } },
            { option_id: 'r5d4b', deltas: { conversion_rate: 0.008, product_quality: 6, tech_debt: 3, burn_rate: 1000 } },
            { option_id: 'r5d4c', deltas: { tech_debt: -2 } },
            { option_id: 'r5d4d', deltas: { conversion_rate: 0.006, product_quality: 4, burn_rate: 1500, tech_debt: 2 } },
          ],
        },
      ],
    },
    {
      id: 'round-6',
      season_id: 'season-circular-commerce',
      week_number: 6,
      narrative: `Week 6: SHOCK EVENT — A data privacy incident hits the news. A major platform (not yours) suffered a massive user data breach, and regulators are now scrutinizing all marketplace platforms. Your compliance risk just became a board-level concern. Meanwhile, your metrics are trending well — you're approaching 2,000 users and your community is buzzing. An acquisition offer comes in from a large retail group.`,
      shock_event: {
        title: 'Industry Privacy Scandal',
        description: 'A major marketplace platform suffers a data breach, triggering regulatory scrutiny across the industry.',
        kpi_effects: { compliance_risk: 8, brand_trust: -3, users_total: -20 },
      },
      decisions: [
        {
          id: 'r6d1', round_id: 'round-6', title: 'Regulatory Response', description: 'Regulators are knocking. How do you prepare?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r6d1a', label: 'GDPR+ Overhaul', description: 'Go beyond minimum compliance — become the privacy standard' },
            { id: 'r6d1b', label: 'Legal Counsel', description: 'Hire a data protection officer and legal team' },
            { id: 'r6d1c', label: 'Transparency Report', description: 'Publish a public transparency report on data practices' },
            { id: 'r6d1d', label: 'Minimal Compliance', description: 'Meet minimum requirements, don\'t over-invest in compliance' },
          ],
          rubric: [
            { criterion: 'Regulatory understanding', max_score: 5, description: 'Do they understand regulatory landscape?' },
            { criterion: 'Brand positioning', max_score: 5, description: 'Does response strengthen market position?' },
          ],
          rules: [
            { option_id: 'r6d1a', deltas: { compliance_risk: -12, brand_trust: 12, burn_rate: 3000, product_quality: 5 } },
            { option_id: 'r6d1b', deltas: { compliance_risk: -8, burn_rate: 4000, brand_trust: 5 } },
            { option_id: 'r6d1c', deltas: { compliance_risk: -5, brand_trust: 10, nps: 5 } },
            { option_id: 'r6d1d', deltas: { compliance_risk: -2, brand_trust: -3 } },
          ],
        },
        {
          id: 'r6d2', round_id: 'round-6', title: 'Acquisition Offer', description: 'A retail group offers to acquire CircleMarket for €2M. What do you do?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r6d2a', label: 'Accept', description: 'Take the deal — guaranteed outcome for the team' },
            { id: 'r6d2b', label: 'Negotiate Higher', description: 'Counter at €4M, citing growth trajectory' },
            { id: 'r6d2c', label: 'Strategic Partnership', description: 'Decline acquisition but propose a partnership instead' },
            { id: 'r6d2d', label: 'Decline Politely', description: 'You believe the business will be worth much more — keep building' },
          ],
          rubric: [
            { criterion: 'Valuation reasoning', max_score: 5, description: 'Can they justify their valuation logic?' },
            { criterion: 'Stakeholder consideration', max_score: 5, description: 'Did they consider team, investors, users?' },
          ],
          rules: [
            { option_id: 'r6d2a', deltas: { runway_months: 24, brand_trust: -5, nps: -3 } },
            { option_id: 'r6d2b', deltas: { runway_months: 6, brand_trust: 2 } },
            { option_id: 'r6d2c', deltas: { revenue: 3000, brand_trust: 5, users_total: 50, burn_rate: -1000 } },
            { option_id: 'r6d2d', deltas: { brand_trust: 3, nps: 2 } },
          ],
        },
        {
          id: 'r6d3', round_id: 'round-6', title: 'Marketplace Expansion', description: 'What new category should you add?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r6d3a', label: 'Furniture & Home', description: 'High average order value, logistics challenge' },
            { id: 'r6d3b', label: 'Books & Media', description: 'Easy to ship, low margins, high volume' },
            { id: 'r6d3c', label: 'Sports & Outdoor', description: 'Seasonal demand, passionate community' },
            { id: 'r6d3d', label: 'No Expansion Yet', description: 'Deepen existing categories before expanding' },
          ],
          rubric: [
            { criterion: 'Market opportunity', max_score: 5, description: 'Is the category opportunity real?' },
            { criterion: 'Operational readiness', max_score: 5, description: 'Can the team handle expansion?' },
          ],
          rules: [
            { option_id: 'r6d3a', deltas: { users_total: 60, arpu: 10, burn_rate: 3000, tech_debt: 4 } },
            { option_id: 'r6d3b', deltas: { users_total: 80, active_users: 40, arpu: -2, burn_rate: 1000 } },
            { option_id: 'r6d3c', deltas: { users_total: 50, active_users: 30, arpu: 5, burn_rate: 1500 } },
            { option_id: 'r6d3d', deltas: { product_quality: 5, nps: 3, conversion_rate: 0.005 } },
          ],
        },
        {
          id: 'r6d4', round_id: 'round-6', title: 'Sustainability Certification', description: 'Should you pursue a sustainability certification?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r6d4a', label: 'B-Corp Certification', description: 'Full certification process — significant investment' },
            { id: 'r6d4b', label: 'Self-Assessed ESG Report', description: 'Publish your own sustainability metrics and goals' },
            { id: 'r6d4c', label: 'Carbon Neutral Pledge', description: 'Offset all platform emissions — marketing-friendly' },
            { id: 'r6d4d', label: 'Skip For Now', description: 'Too early — focus on building the business first' },
          ],
          rubric: [
            { criterion: 'Authenticity', max_score: 5, description: 'Is this genuine or performative?' },
            { criterion: 'Business value', max_score: 5, description: 'Does this create business value?' },
          ],
          rules: [
            { option_id: 'r6d4a', deltas: { brand_trust: 15, nps: 5, burn_rate: 3000, compliance_risk: -3 } },
            { option_id: 'r6d4b', deltas: { brand_trust: 8, nps: 3, burn_rate: 500 } },
            { option_id: 'r6d4c', deltas: { brand_trust: 6, nps: 2, burn_rate: 1500 } },
            { option_id: 'r6d4d', deltas: {} },
          ],
        },
      ],
    },
    {
      id: 'round-7',
      season_id: 'season-circular-commerce',
      week_number: 7,
      narrative: `Week 7: You're in the home stretch. Your platform has matured significantly. Key metrics are stabilizing, and you've built a loyal community. However, runway is a concern — you need to decide whether to raise a Seed round or push toward profitability. ReLoop is struggling with quality issues. A major tech blog wants to feature your story.`,
      decisions: [
        {
          id: 'r7d1', round_id: 'round-7', title: 'Fundraising Decision', description: 'Should you raise a Seed round?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r7d1a', label: 'Raise €1M Seed', description: 'Standard Seed round to fuel 18 months of growth' },
            { id: 'r7d1b', label: 'Revenue-Based Financing', description: 'Non-dilutive funding based on recurring revenue' },
            { id: 'r7d1c', label: 'Bootstrap to Profitability', description: 'Cut costs, focus on revenue — own 100%' },
            { id: 'r7d1d', label: 'Strategic Investment', description: 'Take money from a retail/sustainability strategic investor' },
          ],
          rubric: [
            { criterion: 'Financial reasoning', max_score: 5, description: 'Is the funding strategy sound?' },
            { criterion: 'Dilution awareness', max_score: 5, description: 'Do they understand equity implications?' },
          ],
          rules: [
            { option_id: 'r7d1a', deltas: { runway_months: 18, burn_rate: 3000, users_total: 100 } },
            { option_id: 'r7d1b', deltas: { runway_months: 8, revenue: -2000 } },
            { option_id: 'r7d1c', deltas: { burn_rate: -5000, users_total: -30, product_quality: -3 } },
            { option_id: 'r7d1d', deltas: { runway_months: 12, users_total: 80, brand_trust: 5, burn_rate: 2000 } },
          ],
        },
        {
          id: 'r7d2', round_id: 'round-7', title: 'Platform Governance', description: 'How should platform rules be decided?',
          type: 'data_ai', format: 'multiple_choice',
          options: [
            { id: 'r7d2a', label: 'Community Council', description: 'Elected user representatives help set policies' },
            { id: 'r7d2b', label: 'Expert Advisory Board', description: 'External experts on sustainability, privacy, and commerce' },
            { id: 'r7d2c', label: 'Data-Driven Rules', description: 'Algorithms set rules based on marketplace data' },
            { id: 'r7d2d', label: 'Founder-Led', description: 'You decide — move fast, iterate based on feedback' },
          ],
          rubric: [
            { criterion: 'Governance maturity', max_score: 5, description: 'Is this an appropriate governance model?' },
            { criterion: 'Stakeholder inclusion', max_score: 5, description: 'Are key stakeholders represented?' },
          ],
          rules: [
            { option_id: 'r7d2a', deltas: { brand_trust: 8, nps: 6, compliance_risk: -3, burn_rate: 500 } },
            { option_id: 'r7d2b', deltas: { brand_trust: 5, compliance_risk: -5, burn_rate: 1500 } },
            { option_id: 'r7d2c', deltas: { product_quality: 5, compliance_risk: 2, tech_debt: 4 } },
            { option_id: 'r7d2d', deltas: { compliance_risk: 2, brand_trust: -2 } },
          ],
        },
        {
          id: 'r7d3', round_id: 'round-7', title: 'International Expansion', description: 'Is it time to go international?',
          type: 'growth', format: 'multiple_choice',
          options: [
            { id: 'r7d3a', label: 'Nordics First', description: 'Strong sustainability culture, high purchasing power' },
            { id: 'r7d3b', label: 'DACH Region', description: 'Large market, German engineering mindset for refurbished' },
            { id: 'r7d3c', label: 'UK Market', description: 'English-speaking, large second-hand culture' },
            { id: 'r7d3d', label: 'Stay Domestic', description: 'Perfect the home market before expanding' },
          ],
          rubric: [
            { criterion: 'Market analysis', max_score: 5, description: 'Is the market analysis thorough?' },
            { criterion: 'Execution plan', max_score: 5, description: 'Is the expansion plan realistic?' },
          ],
          rules: [
            { option_id: 'r7d3a', deltas: { users_total: 100, revenue: 2000, burn_rate: 4000, compliance_risk: 3 } },
            { option_id: 'r7d3b', deltas: { users_total: 150, revenue: 3000, burn_rate: 5000, compliance_risk: 4 } },
            { option_id: 'r7d3c', deltas: { users_total: 120, revenue: 2500, burn_rate: 4500, compliance_risk: 2 } },
            { option_id: 'r7d3d', deltas: { product_quality: 5, nps: 5, conversion_rate: 0.005 } },
          ],
        },
        {
          id: 'r7d4', round_id: 'round-7', title: 'Tech Blog Feature', description: 'A major tech blog wants to feature your story. What angle?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r7d4a', label: 'Founder Journey', description: 'Personal story of building a sustainability startup' },
            { id: 'r7d4b', label: 'Tech Deep Dive', description: 'How you built the AI verification and matching systems' },
            { id: 'r7d4c', label: 'Impact Report', description: 'Hard numbers on environmental impact and user stories' },
            { id: 'r7d4d', label: 'Decline Coverage', description: 'Too risky — don\'t want competitor attention' },
          ],
          rubric: [
            { criterion: 'Strategic communication', max_score: 5, description: 'Does the angle serve business goals?' },
            { criterion: 'Audience awareness', max_score: 5, description: 'Who reads this blog and what do they care about?' },
          ],
          rules: [
            { option_id: 'r7d4a', deltas: { brand_trust: 8, users_total: 80, nps: 3 } },
            { option_id: 'r7d4b', deltas: { brand_trust: 5, users_total: 40, product_quality: 3 } },
            { option_id: 'r7d4c', deltas: { brand_trust: 12, users_total: 100, nps: 5 } },
            { option_id: 'r7d4d', deltas: { brand_trust: -2 } },
          ],
        },
      ],
    },
    {
      id: 'round-8',
      season_id: 'season-circular-commerce',
      week_number: 8,
      narrative: `Week 8 — Final Round: It's demo day. You need to present CircleMarket's journey, key decisions, and future roadmap to investors, mentors, and peers. ReLoop has announced they're pivoting away from circular commerce. Your platform has grown significantly. This is your chance to set the strategic direction for the next 12 months and reflect on what you've learned.`,
      decisions: [
        {
          id: 'r8d1', round_id: 'round-8', title: '12-Month Vision', description: 'What\'s the north star for the next year?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r8d1a', label: 'Category Leader', description: 'Become #1 in your primary category in your home market' },
            { id: 'r8d1b', label: 'Platform Play', description: 'Evolve from marketplace to platform — enable third-party services' },
            { id: 'r8d1c', label: 'Sustainability Ecosystem', description: 'Build a full circular economy ecosystem — repair, recycle, resell' },
            { id: 'r8d1d', label: 'Profitable Niche', description: 'Forget scale — become profitable in a focused, defensible niche' },
          ],
          rubric: [
            { criterion: 'Vision clarity', max_score: 5, description: 'Is the vision compelling and clear?' },
            { criterion: 'Feasibility', max_score: 5, description: 'Can they realistically achieve this?' },
          ],
          rules: [
            { option_id: 'r8d1a', deltas: { users_total: 200, revenue: 5000, burn_rate: 3000 } },
            { option_id: 'r8d1b', deltas: { product_quality: 10, revenue: 3000, tech_debt: 5, burn_rate: 4000 } },
            { option_id: 'r8d1c', deltas: { brand_trust: 15, nps: 10, users_total: 100, burn_rate: 5000 } },
            { option_id: 'r8d1d', deltas: { revenue: 4000, burn_rate: -3000, users_total: -20 } },
          ],
        },
        {
          id: 'r8d2', round_id: 'round-8', title: 'Team Scaling Plan', description: 'How do you plan to grow the team?',
          type: 'ops_risk', format: 'multiple_choice',
          options: [
            { id: 'r8d2a', label: 'Aggressive Hiring', description: 'Double the team — engineering, sales, marketing, ops' },
            { id: 'r8d2b', label: 'Key Hires Only', description: '3-4 strategic hires in highest-impact roles' },
            { id: 'r8d2c', label: 'Contractors & Agencies', description: 'Stay lean, use flexible talent for bursts' },
            { id: 'r8d2d', label: 'Promote & Train', description: 'Develop existing team members into new roles' },
          ],
          rubric: [
            { criterion: 'Scaling judgment', max_score: 5, description: 'Is the hiring plan appropriate for the stage?' },
            { criterion: 'Culture consideration', max_score: 5, description: 'Will this preserve company culture?' },
          ],
          rules: [
            { option_id: 'r8d2a', deltas: { burn_rate: 10000, product_quality: 5, users_total: 50 } },
            { option_id: 'r8d2b', deltas: { burn_rate: 5000, product_quality: 8, tech_debt: -5 } },
            { option_id: 'r8d2c', deltas: { burn_rate: 3000, product_quality: 3, tech_debt: 3 } },
            { option_id: 'r8d2d', deltas: { burn_rate: 1000, nps: 3, brand_trust: 3 } },
          ],
        },
        {
          id: 'r8d3', round_id: 'round-8', title: 'Technology Roadmap', description: 'What\'s the biggest technology bet for next year?',
          type: 'data_ai', format: 'multiple_choice',
          options: [
            { id: 'r8d3a', label: 'AI-First Platform', description: 'Invest heavily in AI/ML for every aspect of the marketplace' },
            { id: 'r8d3b', label: 'Mobile-Native', description: 'Build native iOS and Android apps for better UX' },
            { id: 'r8d3c', label: 'API & Integrations', description: 'Open APIs for third-party developers and service providers' },
            { id: 'r8d3d', label: 'Infrastructure & Security', description: 'Invest in reliability, security, and performance' },
          ],
          rubric: [
            { criterion: 'Technical vision', max_score: 5, description: 'Is the technology vision forward-looking?' },
            { criterion: 'Resource planning', max_score: 5, description: 'Can they resource this properly?' },
          ],
          rules: [
            { option_id: 'r8d3a', deltas: { product_quality: 12, conversion_rate: 0.01, tech_debt: 8, burn_rate: 5000 } },
            { option_id: 'r8d3b', deltas: { active_users: 100, nps: 8, burn_rate: 4000, tech_debt: 5 } },
            { option_id: 'r8d3c', deltas: { revenue: 3000, product_quality: 5, tech_debt: 3, burn_rate: 2000 } },
            { option_id: 'r8d3d', deltas: { tech_debt: -15, product_quality: 10, compliance_risk: -5, burn_rate: 3000 } },
          ],
        },
        {
          id: 'r8d4', round_id: 'round-8', title: 'Legacy & Impact', description: 'What do you want CircleMarket to be remembered for?',
          type: 'strategy', format: 'multiple_choice',
          options: [
            { id: 'r8d4a', label: 'Environmental Impact', description: 'Measurable reduction in waste and carbon emissions' },
            { id: 'r8d4b', label: 'Economic Empowerment', description: 'Enabling micro-entrepreneurs and side hustles' },
            { id: 'r8d4c', label: 'Technology Innovation', description: 'Pushing the boundaries of marketplace technology' },
            { id: 'r8d4d', label: 'Community & Culture', description: 'Building a movement around conscious consumption' },
          ],
          rubric: [
            { criterion: 'Vision authenticity', max_score: 5, description: 'Does this align with their decisions throughout?' },
            { criterion: 'Stakeholder value', max_score: 5, description: 'Does this create value for all stakeholders?' },
          ],
          rules: [
            { option_id: 'r8d4a', deltas: { brand_trust: 10, nps: 5 } },
            { option_id: 'r8d4b', deltas: { users_total: 50, active_users: 30, nps: 5 } },
            { option_id: 'r8d4c', deltas: { product_quality: 8, tech_debt: -3 } },
            { option_id: 'r8d4d', deltas: { brand_trust: 8, nps: 8, churn_rate: -0.01 } },
          ],
        },
      ],
    },
  ],
};
