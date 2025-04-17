# 🔍 DigiForensics AI

**DigiForensics AI** is an AI-powered Digital Evidence Management System built for law enforcement, cyber forensic teams, and investigators. It helps manage cases, assign investigators, store digital evidence securely, and track progress—all from a central platform.

🌐 **Live Website**: [https://digiforensics-avd.netlify.app](https://digiforensics-avd.netlify.app)

---

## 🚀 Features

- 👤 Admin & Investigator login system
- 📝 Register new investigators (admin notified)
- 📂 Upload and manage digital evidence (all file types supported)
- 📄 Submit and track investigation reports
- 📊 Visual dashboard with case stats and recent activity
- 🔔 Real-time alerts and case updates
- 🕵️ Admin can assign cases to investigators
- 📅 Case timelines and priority levels
- 🌓 Modern UI with dark theme
- 🔐 Supabase authentication and storage
- 🧠 OCR and Graphical Case Mapping (Planned)

---

## 🧰 Tech Stack

| Layer        | Tools Used                       |
|--------------|----------------------------------|
| **Frontend** | React.js, TypeScript, TailwindCSS, Vite |
| **Backend**  | Supabase (Auth, DB, File Storage) |
| **Hosting**  | Netlify                          |

---

## 📁 Folder Structure

digiforensics-ai-main/
│
├── public/                         # Static assets like favicon, index.html
│   └── favicon.ico
│
├── src/                            # Main source code (React components, pages, logic)
│   ├── assets/                     # Images and static frontend assets
│   ├── components/                 # Reusable UI components
│   ├── pages/                      # Page-level components (e.g., Login, Dashboard)
│   ├── services/                   # API and Supabase integration logic
│   ├── utils/                      # Utility functions/helpers
│   └── App.tsx                     # Main app component
│
├── supabase/                       # Supabase config, table schema, and auth handling
│   └── supabaseClient.ts           # Initializes Supabase client
│
├── .gitignore                      # Files to ignore in Git
├── README.md                       # Project documentation
├── bun.lockb                       # Bun package manager lock file (if used)
├── components.json                 # Shadcn UI or other UI config
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main HTML file (entry point)
├── netlify.toml                    # Netlify deployment config
├── package.json                    # Node project metadata and dependencies
├── package-lock.json               # Locks versions of dependencies
├── postcss.config.js               # PostCSS config for Tailwind
├── tailwind.config.ts              # TailwindCSS settings
├── tsconfig.app.json               # TypeScript config for the app
├── tsconfig.json                   # Root TypeScript config
├── tsconfig.node.json              # Node-specific TypeScript settings
├── vite.config.ts                  # Vite bundler configuration


---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js v16+
- Supabase account (https://supabase.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/digiforensics-ai.git
cd digiforensics-ai-main

# Install dependencies
npm install

# Start development server
npm run dev
