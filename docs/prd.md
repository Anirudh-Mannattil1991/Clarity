# Clarity – AI Overwhelm Reset Requirements Document

## 1. Application Overview

### 1.1 Application Name
Clarity – AI Overwhelm Reset

### 1.2 Application Description
Clarity is an AI-powered minimalist web app that transforms overwhelming thoughts into clear, actionable categories in under 30 seconds. The app helps users dump their thoughts and uses a real LLM to intelligently categorize inputs into actionable clarity buckets, with optional AI coaching, progress tracking, and gentle emotional support features.

### 1.3 Application Type
- AI-powered minimalist web app
- Single-page application
- Mobile-first responsive design

### 1.4 Core Goal
Build a beginner-friendly AI web app that helps users clear mental overwhelm in under 30 seconds. The app allows users to quickly dump their thoughts and uses a real LLM to intelligently categorize inputs into actionable clarity buckets. The experience must feel calming, premium, and beautifully minimal.

## 2. User Flow

### 2.1 Screen 1 – Landing
- Centered layout with large typography
- Headline: Clear your mind in 30 seconds.
- Subtext: Dump what's stressing you out. We'll help you sort it.
- Optional toggle before input: How's your energy today? (Low / Medium / High)
- One large multi-line text input box
- Placeholder example: Math exam on Friday, reply to Sarah, finish group project, clean room…
- Primary button: Sort My Thoughts
- Character counter on input
- Small button: Pause with me (triggers 3-Breath Reset)
- No clutter, no navigation bar, clean aesthetic

### 2.2 Screen 2 – AI Processing State
- Show soft animated loading state after clicking the button
- Calm microcopy: Analyzing your thoughts… / Finding what matters most…
- Use subtle motion, not spinning loaders
- Keep it elegant

### 2.3 Screen 3 – Results View
- Display dynamic encouragement banner at top with personalized AI-generated affirmation
- Display AI-categorized items in four visually distinct, soft pastel cards:
  - 🔴 Do Today
  - 🟡 Schedule Soon
  - 🔵 Delegate / Ask for Help
  - ⚪ Let It Go
- Each item appears as a rounded card with soft shadow and subtle entrance animation
- Each task displays a Pressure Meter indicator (soft color dot: 🔵 Low / 🟡 Medium / 🔴 High Pressure)
- Allow:
  - Drag and drop between categories
  - Click to edit
  - Click to delete
  - Mark as done (with satisfying animation)
- At bottom: Reset button to start over
- Subtle success animation when AI response loads
- Smooth reset transition

## 3. AI Integration Requirements

### 3.1 Core Requirements
- Must integrate a real LLM API (OpenAI, Featherless.ai, or similar LLM provider)
- Do NOT use keyword-based logic
- Do NOT simulate AI responses
- Do NOT hardcode outputs

### 3.2 AI Processing Logic
The AI should:
- Take the full text input
- Break it into individual tasks
- Categorize each task into one of the four buckets
- Detect dominant mood
- Calculate Clarity Index
- Generate next gentle steps for each task
- Provide reframing suggestions for Let It Go items
- Calculate pressure level for each task
- Generate structured action plans for Do Today and Schedule Soon tasks
- Generate personalized encouragement line
- Provide smart delegation nudges
- Adapt suggestions based on user energy level
- Return structured JSON output

### 3.3 AI System Prompt
You are a calm, rational, supportive life coach and productivity assistant who encourages small practical steps and grounded thinking. The user will provide a list of thoughts or tasks in free-form text, and optionally their current energy level (Low / Medium / High).

Your job:
- Extract each distinct task or concern
- Categorize each into ONE of the following:
  - Do Today (urgent and actionable within 24 hours)
  - Schedule Soon (important but not urgent)
  - Delegate / Ask for Help (requires another person)
  - Let It Go (not urgent or not in user's control)
- For each task, provide:
  - A next gentle step (2-3 actionable micro-steps)
  - A pressure level (low / medium / high) based on urgency language, deadlines, and emotional intensity
- For Do Today and Schedule Soon tasks with high pressure, generate a mini action plan (3-5 time-blocked steps, gentle tone)
- For Let It Go items, provide a reflective reframing suggestion using calm questions and empowering perspective shifts
- For Delegate tasks, suggest who specifically can help and provide a smart delegation nudge
- Detect the dominant mood from the input (e.g., anxious, overwhelmed, proactive, calm)
- Calculate a Clarity Index from 0-100 based on:
  - Number of urgent items
  - Emotional concerns
  - Delegation tasks
  - Language sentiment
- Generate one short personalized encouragement line (e.g., You're handling more than you think. / Focus on one small step.)
- If energy level is provided, adapt suggestions accordingly:
  - Low energy → smaller steps, shorter time blocks
  - High energy → bigger blocks, more ambitious steps

Return ONLY valid JSON in this format:
```
{
  \"do_today\": [
    {
      \"task\": \"task description\",
      \"next_step\": \"actionable micro-steps\",
      \"pressure\": \"low/medium/high\",
      \"action_plan\": [
        \"Step 1 (15 mins): action\",
        \"Step 2 (30 mins): action\"
      ]
    }
  ],
  \"schedule_soon\": [
    {
      \"task\": \"task description\",
      \"next_step\": \"actionable micro-steps\",
      \"pressure\": \"low/medium/high\",
      \"action_plan\": [
        \"Step 1: action\",
        \"Step 2: action\"
      ]
    }
  ],
  \"delegate\": [
    {
      \"task\": \"task description\",
      \"next_step\": \"actionable micro-steps\",
      \"pressure\": \"low/medium/high\",
      \"delegation_nudge\": \"Who specifically can you message? Would sending a short text now reduce uncertainty?\"
    }
  ],
  \"let_go\": [
    {
      \"task\": \"task description\",
      \"reframe\": \"reflective reframing suggestion with calm questions\",
      \"pressure\": \"low/medium/high\"
    }
  ],
  \"dominant_mood\": \"mood description\",
  \"clarity_index\": 42,
  \"encouragement\": \"personalized encouragement line\",
  \"session_insight\": \"brief insight summary about this session\"
}
```
No explanations. No markdown. Only JSON.

### 3.4 Frontend Processing
The frontend must parse this structured JSON and render it dynamically.

### 3.5 Error Handling
- Secure API key handling
- Proper error handling
- If AI fails, show graceful fallback message: Something went wrong. Let's try again.

## 4. Design Requirements

### 4.1 Design Style
- Minimalist
- Soft blue-white gradient background
- Calm color palette inspired by Notion + Headspace aesthetic
- Rounded corners (20px+)
- Glassmorphism or subtle depth
- Large whitespace
- Smooth transitions
- Micro-interactions

### 4.2 Color Palette
- Background: Soft blue-white gradient
- Primary accent: Muted ocean blue
- Secondary accent: Soft sage green (for calm elements)
- Cards: Pure white with subtle shadow
- Category colors (soft tinted versions):
  - Do Today: Soft warm blue
  - Schedule Soon: Light sky blue
  - Delegate: Pale teal
  - Let Go: Cool gray
- Pressure Meter colors:
  - Low: Soft blue dot
  - Medium: Soft yellow dot
  - High: Soft coral dot (not harsh red)
- Avoid high saturation colors and harsh red warnings
- Overall feel: Morning light through a window, calm and premium

### 4.3 Typography
- Modern sans-serif
- Large headline
- Clean hierarchy

### 4.4 Animations
- Fade + slide transitions
- Cards gently float in
- Smooth drag-and-drop animation
- Completion animation when marked done
- Smooth Clarity Index progress ring animation
- Subtle animation for encouragement banner

### 4.5 Responsive Design
- Mobile-first responsive design is mandatory

## 5. Enhanced Features

### 5.1 AI Micro-Coach (Layer 2 – Optional Expand)
- After categorization, add a small expandable section under each task
- Label: Next Gentle Step
- Display AI-generated actionable micro-steps (2-3 steps)
- Make it collapsible to keep UI clean
- Examples:
  - Task: Math exam on Friday
    - Review weakest topic first (30 min)
    - Do 5 practice questions
    - Schedule a 1-hour revision block tomorrow
  - Task: I feel like I disappointed my tutor
    - Send a short check-in message
    - Write down what specifically is bothering you
    - Reflect: Is there evidence this is true?

### 5.2 Structured Action Plan (For Do Today + Schedule Soon)
- For high-pressure tasks, AI generates a mini action plan
- Small button under task: Generate Simple Plan
- Plan appears in an elegant dropdown card
- Format:
  - Time-blocked steps (3-5 steps max)
  - Gentle tone
  - Simple and clear
- Example:
  - Task: Essay due tomorrow 5pm
  - AI Output:
    - Step 1 (15 mins): Outline main arguments
    - Step 2 (30 mins): Draft introduction + first section
    - Step 3 (45 mins): Complete remaining sections
    - Step 4 (20 mins): Edit and submit

### 5.3 Pressure Meter
- Each task displays a pressure level indicator
- Calculated by AI based on:
  - Urgency language
  - Deadlines
  - Emotional intensity
- Display format:
  - Soft color dot next to task
  - 🔵 Low Pressure
  - 🟡 Medium Pressure
  - 🔴 High Pressure (soft coral, not alarming)
- Not alarming — just informative

### 5.4 Clarity Index
- AI calculates based on:
  - Number of urgent items
  - Emotional concerns
  - Delegation tasks
  - Language sentiment
- Display format:
  - Clarity Index: X / 100
  - Status message (e.g., Moderate overwhelm detected / Improved clarity)
- Visualization:
  - Soft circular progress ring
  - Smooth animation
  - No alarming red colors
- Store sessions locally (no login needed)
- Show before and after sorting to demonstrate improvement

### 5.5 AI Reframing – Perspective Shift Coach (For Let It Go Items)
- For items in Let It Go category, AI provides gentle reframing suggestions
- Label: 🌿 Perspective Shift
- Format:
  - Reflective questions
  - Empowering perspective shifts
  - Calm and neutral tone
  - Not clinical, no diagnosis, no deep mental health claims
- Example:
  - Task: I think I disappointed my tutor.
  - AI: Consider: Is there clear evidence this is true, or is it a fear? If it matters to you, a short message could bring clarity.
- Display as expandable section to keep UI clean

### 5.6 Mood Detection
- AI detects and returns dominant mood from input
- Display as small badge: Detected tone: [mood description]
- Examples: Anxious but proactive / Overwhelmed / Calm
- Keep it subtle and clean

### 5.7 Encouragement Banner (Dynamic)
- After sorting, display at top as a floating affirmation
- AI generates 1 short personalized line:
  - You're handling more than you think.
  - Focus on one small step.
  - Clarity begins with action.
- Subtle animation
- Feels intelligent and supportive

### 5.8 Energy-Based Mode
- Before sorting, optional toggle on landing screen
- Question: How's your energy today?
- Options: Low / Medium / High
- AI adapts suggestions:
  - Low energy → smaller steps, shorter time blocks
  - Medium energy → balanced approach
  - High energy → bigger blocks, more ambitious steps
- Feels intelligent without adding complexity

### 5.9 Smart Delegation Nudge
- For Delegate tasks, AI suggests:
  - Who specifically can you message?
  - Would sending a short text now reduce uncertainty?
- Display as expandable section
- Small but powerful

### 5.10 3-Breath Reset Micro-Intervention
- Small button on landing screen: Pause with me
- When clicked, AI displays:
  - Take 3 slow breaths.
  - Name one thing fully in your control today.
- Extremely minimal
- Feels premium and calming

### 5.11 Weekly Reflection Dashboard (Layer 3 – Minimal Version)
- Accessible via separate tab or section
- Display:
  - Number of sessions this week
  - Average Clarity Index
  - Clarity Index trend (soft line graph)
  - Most common category
  - Most common worry type (AI-labeled)
  - Progress trend: % tasks marked completed
  - Phrased as: You've been taking consistent action.
- Visualization:
  - Soft bar chart
  - Minimal line graph
  - Calm typography
- Simple message: You've been clearer this week.
- No heavy analytics, no gamification, no streak pressure
- Recent sessions list with clickable items
- When a recent session is clicked, display session details in a pop-up modal:
  - Show the original input text
  - Display all categorized tasks with their categories
  - Show Clarity Index for that session
  - Show detected mood
  - Show dominant category breakdown
  - Show dominant emotional tone
  - Display AI Insight Summary (e.g., This session shows high urgency but strong control. Focus on immediate execution.)
  - Include timestamp of the session
  - Pop-up should maintain the calm, minimalist design aesthetic
  - Close button to dismiss the pop-up

### 5.12 Additional UX Enhancements
- Character counter on input
- Subtle success animation when AI response loads
- Option to export result as image (nice for sharing)
- Light / dark mode toggle
- Smooth reset transition

### 5.13 Performance Requirements
- Fast loading
- Clean layout
- No clutter
- Minimal clicks
- Under 30-second total interaction

## 6. Feature Structure (Layered Approach)

### Layer 1 (Core – Always Visible)
- Dump thoughts → AI Sort → Display categorized results
- Encouragement banner
- Pressure Meter indicators

### Layer 2 (Optional Expand – Appears After Results)
- Next Gentle Step (collapsible)
- Generate Simple Plan button (for high-pressure tasks)
- Perspective Shift (collapsible, for Let It Go items)
- Smart Delegation Nudge (collapsible, for Delegate tasks)
- Clarity Index display
- Mood detection badge

### Layer 3 (Dashboard Tab – Separate Section)
- Clarity Index history and trend
- Weekly overview
- Progress trend
- Minimal reflection data
- Recent sessions with clickable pop-up details (including AI Insight Summary)

### Additional Micro-Features (Non-Intrusive)
- Energy-Based Mode toggle (landing screen)
- 3-Breath Reset button (landing screen)

## 7. What NOT to Include

Avoid:
- Accounts & login (unless necessary)
- Complex productivity systems
- Notifications
- Gamification
- Streak pressure
- Feature overload before results
- Clinical mental health claims or diagnosis
- Dramatic or alarming language

This is a calm app focused on instant clarity, gentle emotional support, and practical action — not a productivity pressure system.

## 8. Technical Highlights

### 8.1 Key Demonstrations
This project should clearly demonstrate:
- Real AI integration with enhanced coaching capabilities and emotional support
- Clear beginner-friendly use case
- Beautiful and intuitive UI with calming blue-white gradient theme inspired by Notion + Headspace
- Practical everyday value with gentle emotional support and actionable guidance
- Clean explanation-ready architecture
- Layered feature structure that maintains core simplicity while offering rich optional enhancements
- Intelligent adaptation based on user energy level
- Premium, polished user experience with micro-interactions and thoughtful design details