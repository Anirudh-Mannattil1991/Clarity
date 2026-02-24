# Clarity

**An AI-Powered Overwhelm Reset Companion**

Clear your mind in 30 seconds. Dump what's stressing you. Clarity helps you sort it.

---

## Overview

Clarity is a minimalist AI-powered web application that transforms overwhelming thoughts into structured, actionable categories in under 30 seconds.

Instead of managing complex to-do lists or productivity systems, users write what's on their mind — and Clarity uses a real LLM to extract tasks, categorize them intelligently, generate gentle action steps, offer perspective shifts, and track clarity trends over time.

**The goal:** Reduce mental clutter. Increase calm.

---

## The Problem

Students and young professionals often feel overwhelmed by deadlines, group projects, personal responsibilities, emotional worries, and decision fatigue.

Most productivity tools require heavy setup, manual organization, and ongoing maintenance. Clarity removes friction by making the experience fast, intelligent, calm, and beautiful.

---

## Features

### AI Thought Sorting
Users paste free-form text (a brain dump). A real LLM extracts distinct tasks and categorizes them into:

| Category | Description |
|---|---|
| Do Today | Urgent, high-priority items |
| Schedule Soon | Important but not immediate |
| Delegate / Ask for Help | Items to hand off or seek support on |
| Let It Go | Things outside your control |

The model returns structured JSON — no hardcoded logic.

### Clarity Index
An AI-calculated score based on urgency, emotional intensity, and task distribution. Displayed as a soft animated progress indicator to help users track improvement over time.

### Structured Action Plans
For high-pressure tasks, users can generate time-blocked mini plans, 3–5 clear execution steps, and gentle prioritization guidance.

### Perspective Shift
For "Let It Go" items, Clarity adopts a calm life-coach persona to provide reflective reframing, grounded encouragement, and gentle cognitive prompts. No diagnosis. No therapy. Just supportive clarity.

### Session Dashboard
Users can review recent sessions, Clarity Index trends, category breakdowns, and AI-generated session insights.

---

## AI Integration

Clarity uses a real LLM API — no hardcoded responses. The AI parses unstructured input, extracts tasks, categorizes them, and produces coaching-style micro-guidance.

**Example LLM response format:**

```json
{
  "do_today": [],
  "schedule_soon": [],
  "delegate": [],
  "let_go": [],
  "clarity_index": 72,
  "dominant_mood": "anxious but proactive"
}
```

All frontend rendering is dynamically powered by AI responses.

---

## How It Works

1. User enters thoughts as free-form text.
2. App sends input to the LLM.
3. LLM returns structured JSON.
4. UI renders categorized cards.
5. Optional enhancements generate action plans, perspective shifts, and encouragement.
6. Session saved locally for dashboard insights.

**Total interaction time: under 30 seconds.**

---

## Design Philosophy

Clarity is intentionally designed to feel calm, minimal, safe, and uncluttered.

- Soft blue and white palette
- Generous whitespace
- Rounded card layouts
- Subtle animations and micro-interactions
- Mobile-first responsiveness

No gamification. No streak pressure. No complexity.

---

## Tech Stack

- Responsive web interface
- Real LLM API integration
- JSON-based dynamic rendering
- Secure API key handling

---

## Ethical Considerations

- No clinical diagnosis or mental health treatment claims
- Supportive, non-invasive tone throughout
- Graceful error handling
- Beginner-friendly UX

---

## Roadmap

- Export as shareable summary image
- Weekly AI-generated reflection report
- Personalization tuning
- Voice input

---

## Demo

> Screenshots, demo video, and live link coming soon.
