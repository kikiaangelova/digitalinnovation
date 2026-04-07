## Part 1: AI-Generated Challenge System

### Database
- Create `challenges` table (type, title, scenario, options, correct_reasoning, difficulty, xp_reward, time_limit_seconds, generated_at)
- Create `challenge_responses` table (user_id, challenge_id, selected_option, feedback, xp_earned, responded_at)
- RLS policies for both tables

### Edge Function: `generate-challenge`
- Uses Lovable AI to generate scenario-based challenges
- 4 types: daily (quick, +10 XP), weekly (complex, +25 XP), crisis (time pressure, +20 XP), strategic (long-term, +30 XP)
- Each challenge includes: scenario, 3-4 options with trade-offs, uncertainty element, AI feedback on chosen option

### UI Components
- `ChallengeHub` - main widget showing available challenges
- `ChallengeCard` - individual challenge with scenario, options, timer (for crisis), feedback
- Replace existing `DailyChallenge` quiz with the new AI-powered system
- Integrate into StudentDashboard

### Flow
1. User opens challenge → edge function generates scenario based on type + user progress
2. User reads scenario with uncertainty, selects decision
3. AI provides personalized feedback + XP awarded
4. Weekly challenges contribute to leaderboard

## Part 2: Female Avatar Styles (18 new images)
- Generate: female-student (1-6), female-founder (1-6), female-innovator (1-6)
- Update AvatarPicker to show 6 style options
- Update PlayerAvatar mapping
