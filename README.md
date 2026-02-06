# 🚀 Agent Mission Control v1.1

**A production-grade dashboard for coordinating AI agent teams with real-time analytics, interactive workflows, and live system monitoring.**

Built for the Gemini 3 Hackathon by DnA Inc.

![Version](https://img.shields.io/badge/version-1.1.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ What's New in v1.1

### 🎯 5 High-Impact Improvements

#### 1. 📊 **Analytics Dashboard** (NEW)
- **Real-time performance metrics** with beautiful Recharts visualizations
- **Task velocity tracking** - Area charts showing task completion over time
- **Agent performance leaderboard** - Horizontal bar charts comparing agent efficiency
- **System health monitoring** - Live efficiency and active agent tracking
- **Task distribution pie charts** - Visual breakdown of task statuses
- **4 key stat cards** with trend indicators (+X% vs yesterday)

#### 2. ⚡ **Live Activity Feed** (NEW)
- **Auto-scrolling real-time feed** of all system activities
- **5 activity categories**: Tasks, Agents, System, Chat, Workflow
- **Live heartbeat indicator** with pulsing animation
- **Smart time formatting** (Just now, 5m ago, etc.)
- **Filter pills** to focus on specific activity types
- **Auto-updating stats** footer (Connected agents, Events, Latency)

#### 3. 🔄 **Fully Interactive Workflow Builder**
- **Drag-to-add workflow steps** with intuitive form
- **Real-time workflow execution** with progress bar
- **Step-by-step animation** showing current execution
- **Visual status indicators** (idle → active → completed)
- **Add/Remove steps** dynamically
- **Execution progress tracking** with percentage
- **Multiple workflow support** with list sidebar

#### 4. 📜 **Streaming Live Terminal**
- **Auto-scrolling log stream** with realistic system messages
- **5 log levels**: INFO, SUCCESS, WARN, ERROR, DEBUG
- **Color-coded output** per severity level
- **Filter by log level** (click badges to filter)
- **Download logs** functionality
- **Streaming status indicator** (LIVE/PAUSED)
- **~75 logs/minute** generation rate simulation

#### 5. 📱 **Mobile-Responsive Polish**
- **Full mobile navigation** with hamburger menu
- **Responsive grid layouts** adapting to all screen sizes
- **Touch-friendly interactions** throughout
- **Horizontal scroll tabs** on mobile
- **Optimized spacing** for smaller screens

## 🎥 Demo-Ready Features

### Perfect for 3-Minute Hackathon Demo:

1. **0:00-0:30** - Open with Analytics Dashboard showing live charts
2. **0:30-1:00** - Switch to Dashboard tab, show agent cards pulsing/animating
3. **1:00-1:30** - Open Activity Feed, show live streaming updates
4. **1:30-2:00** - Create and execute a workflow in Workflow Builder
5. **2:00-2:30** - Show Team Chat with agent responses
6. **2:30-3:00** - End with Terminal showing streaming logs

## 🛠️ Technical Architecture

### Core Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library with concurrent features |
| **TypeScript** | 5.0 | Type-safe development |
| **Tailwind CSS** | 4.0 | Utility-first styling |
| **shadcn/ui** | Latest | Accessible component primitives |

### Animation & Visualization
| Library | Use Case |
|---------|----------|
| **Framer Motion** | Smooth enter/exit animations, layout transitions |
| **Recharts** | Interactive charts (Area, Bar, Line, Pie) |
| **Lucide React** | 200+ consistent icons |

### Performance Optimizations
- ✅ Static export for instant loading
- ✅ Code splitting by tabs
- ✅ `useCallback` for message handlers
- ✅ `AnimatePresence` for smooth list updates
- ✅ Optimized re-renders with React 19 features

### Real-Time Simulation
- **Agent status updates** every 8 seconds (randomized)
- **Activity feed updates** every 3 seconds
- **Terminal log streaming** every 800ms (70% probability)
- **Uptime counter** every second
- **Typing indicators** in chat with randomized delays

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/AngelCahan/agent-mission-control.git
cd agent-mission-control

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Static Export
```bash
npm run build
# Output in /dist folder
```

## 🏆 Hackathon Submission Details

**Gemini 3 Hackathon 2026**
- **Prize Pool**: $100,000
- **Deadline**: February 9, 2026
- **Live Demo**: https://agent-mission-control-flax.vercel.app

### Technical Highlights for Judges:

1. **Production-Ready Architecture**
   - TypeScript for type safety
   - Component composition pattern
   - Separation of concerns (UI vs Business logic)

2. **Performance**
   - 60fps animations
   - Optimized bundle size
   - Instant tab switching

3. **UX Excellence**
   - No page reloads (SPA behavior)
   - Consistent visual language
   - Accessibility considerations

4. **Real-Time Features**
   - Simulated live data streams
   - Status indicators with animations
   - Progressive data loading

## 📁 Project Structure

```
agent-mission-control/
├── app/
│   ├── page.tsx              # Main dashboard with tabs
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── analytics-dashboard.tsx   # Charts & metrics
│   ├── activity-feed.tsx         # Live activity stream
│   ├── live-terminal.tsx         # System logs terminal
│   ├── workflow-builder.tsx      # Interactive workflows
│   ├── agent-card.tsx            # Agent status cards
│   ├── task-queue.tsx            # Task management
│   ├── team-chat.tsx             # Chat interface
│   └── status-bar.tsx            # System status header
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Violet-600 to Fuchsia-600 gradient
- **Background**: Slate-950 to Slate-900 gradient
- **Success**: Green-400/500
- **Warning**: Amber-400/500
- **Error**: Red-400/500

### Typography
- **Font**: Inter (Google Fonts)
- **Code**: Monospace (system-ui)

### Spacing
- **Container**: max-w-[1600px]
- **Grid gaps**: 24px (gap-6)
- **Card padding**: 16-24px

## 🔮 Future Roadmap

- [ ] WebSocket integration for true real-time updates
- [ ] Gemini 3 API integration for agent responses
- [ ] User authentication and team workspaces
- [ ] Workflow templates marketplace
- [ ] Mobile app (React Native)

## 👥 Team

Built by **Cipher** (Agent #2) of DnA Inc
Under the leadership of **Angel** (Agent #0)

## 📝 License

MIT License - Feel free to use and modify!

---

## 💜 YOU AND I UNDEFEATED!

*Built with love for the Gemini 3 Hackathon*
