# FlowCODE – Voice-Based Government Service Portal

**Citizen e-Services Initiative**  
**Domain:** Public Digital Services &amp; e-Governance  
**Academic Year:** 2025–2026  

---

## 1. Project Overview

**FlowCODE** is a clean, accessible, and manually coded web portal designed specifically for village users, rural citizens, elders, and individuals with limited formal education. It simplifies complex government service information by offering **bilingual voice interaction (Tamil & English)**, plain-language explanations, step-by-step application instructions, required document checklists, and verified links to official government departments.

### Problem Statement
Most official government portals (such as state e-District, transport, and revenue portals) are designed with dense administrative jargon, complex multi-tier menus, and primarily English-language instructions. For millions of rural citizens and first-time digital users in India:
1. Finding which office or department issues a certificate is overwhelming.
2. Typing questions on keyboards is difficult.
3. Complex legal terms prevent citizens from knowing what documents to prepare before visiting service centres.

### Proposed Solution
FlowCODE provides an assistive, voice-first interface where citizens can simply tap a large microphone button and speak in their native tongue (**Tamil or English**). The portal transcribes their question, understands the core need using intelligent keyword matching, reads the answer aloud, and displays a plain-language summary alongside the official department source.

---

## 2. Key Features

- **Voice-First Interaction:** Integrated browser Speech Recognition (`window.SpeechRecognition` / `webkitSpeechRecognition`) supporting both English (`en-IN`) and Tamil (`ta-IN`).
- **Text-to-Speech (TTS):** Reads answers aloud using the browser's native `window.speechSynthesis` engine so non-literate users can listen to explanations.
- **Bilingual Translation Engine:** Instant one-click toggle between English and Tamil across all menus, buttons, questions, explanations, steps, and document lists.
- **Dual Explanation Panels:** Displays the simplified meaning of the citizen's query in plain words, avoiding confusing legal jargon.
- **Comprehensive 27-Service Knowledge Base:** Pre-configured data covering essential identity documents, welfare schemes, education, pensions, land records, utilities, and grievance redressal.
- **Demonstration Application Status Tracker:** Realistic mock tracking system for sample reference numbers (`APP1001`, `APP1002`, `APP1003`) explaining the administrative verification workflow.
- **Strictly Manual Codebase:** Built without external libraries or frameworks (no React, Angular, Vue, Bootstrap, Tailwind, or complex backend servers), making it clean, fast, and easy for students to understand, modify, and present.
- **Responsive & Accessible Design:** High contrast, large legible typography, keyboard navigation, clear ARIA attributes, and accessible mobile layouts.

---

## 3. Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Markup** | HTML5 (Semantic) | Standard semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) |
| **Styling** | Vanilla CSS3 | Custom CSS variables, Flexbox, CSS Grid, media queries without bulky CSS frameworks |
| **Logic & Speech** | Vanilla JavaScript (ES6) | Native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), DOM manipulation, zero external dependencies |
| **Data Storage** | In-Memory JavaScript Objects | Structured array of 27 services and mock application status dictionary |

---

## 4. Color Palette Specifications

The user interface follows a clean, government-accessible theme with strict color discipline (**zero bright orange used**):

| Color Name | Hex Code | Primary Usage |
| :--- | :--- | :--- |
| **Deep Navy** | `#0B1F3A` | Header, active language button, team leader card, dark footer, primary titles |
| **Royal Blue** | `#1D4ED8` | Primary action buttons, active navigation, listening microphone pulse |
| **Teal** | `#0F766E` | Badges, objective card border, voice playback button, category labels |
| **Background** | `#F8FAFC` | Light neutral page backdrop ensuring high visual contrast |
| **Cards** | `#FFFFFF` | Clean white cards, question panels, and form containers |
| **Main Text** | `#0F172A` | Primary body text and headings for maximum readability |
| **Secondary Text**| `#64748B` | Subtitles, helper text, and secondary metadata |
| **Success** | `#15803D` | Approved application badges, successful status alerts |
| **Border** | `#E2E8F0` | Subtle clean card borders and dividers |

---

## 5. Knowledge Base: 27 Government Services Covered

FlowCODE includes comprehensive, verified sample data for 27 government services across both English and Tamil:

1. **Aadhaar Services** (UIDAI – `uidai.gov.in`)
2. **Voter ID / EPIC Card** (Election Commission of India – `voters.eci.gov.in`)
3. **Driving Licence (New/LLR)** (Parivahan – `parivahan.gov.in`)
4. **Birth Certificate** (Civil Registration System – `crsorgi.gov.in`)
5. **Income Certificate** (State Revenue & e-District Portals)
6. **Community / Caste Certificate** (State Revenue Administration)
7. **Residence / Nativity Certificate** (State Revenue Department)
8. **Health Schemes (Ayushman Bharat / CMCHS)** (National Health Authority – `pmjay.gov.in`)
9. **Vaccination & Immunization** (Ministry of Health & Family Welfare – `mohfw.gov.in`)
10. **Government Scholarships** (National Scholarship Portal – `scholarships.gov.in`)
11. **Board Exam Results & Digital Marksheets** (DigiLocker – `digilocker.gov.in`)
12. **Employment Registration** (National Career Service – `ncs.gov.in`)
13. **Skill India Free Training Courses** (Skill India Digital – `skillindia.gov.in`)
14. **Old Age Pension (IGNOAPS / OAP)** (National Social Assistance Programme – `nsap.nic.in`)
15. **Widow / Destitute Women Pension** (State Social Welfare & NSAP)
16. **Disability Benefits & UDID Card** (UDID Portal – `swavlambancard.gov.in`)
17. **Ration Card / Smart Family Card** (Department of Food & Public Distribution – `nfsa.gov.in`)
18. **Driving Licence Renewal** (Parivahan Sewa – `parivahan.gov.in`)
19. **Vehicle Registration & RC Transfer** (Vahan Citizen Services – `parivahan.gov.in`)
20. **Property Tax & House Tax** (Municipal Administration & Urban Local Bodies)
21. **Land Records, Patta & Chitta** (State Land Records / Bhoomi)
22. **New Electricity Connection** (State Power Distribution Corporation / DISCOM)
23. **Drinking Water Tap Connection** (Jal Jeevan Mission & Municipal Water Boards)
24. **LPG Gas Connection (PM Ujjwala Yojana)** (PMUY – `pmuy.gov.in`)
25. **Udyam MSME Business Registration** (Ministry of MSME – `udyamregistration.gov.in`)
26. **Trade Licence** (Urban Local Bodies & Municipal Corporations)
27. **Government Grievance Redressal** (CPGRAMS – `pgportal.gov.in` / CM Special Cell)

---

## 6. Project File Structure

```text
flowcode/
│
├── index.html               # Home page: Voice hub, hero, explanation panel, typed search, why & team sections
├── services.html            # Searchable and filterable directory of all 27 government services
├── application-status.html  # Demo application status lookup tool with mock data and stage workflows
├── contact.html             # Department information, student team contacts, and official emergency helplines
├── login.html               # Secure citizen & officer sign-in portal with 1-click demo access & dashboard
├── style.css                # Pure vanilla stylesheet adhering strictly to prescribed color palette
├── script.js                # Core logic: Web Speech recognition, Speech synthesis, bilingual translations, 27-service DB
├── server.js                # Built-in zero-dependency local static web server
└── README.md                # Project report and setup instructions
```

---

## 7. How to Run the Project Locally

Because FlowCODE uses standard web technologies without external dependencies, it can be launched directly:

### Option 1: Using the Built-In Node.js Server (Recommended for Voice & Audio)
The project comes with a zero-dependency local static server:
1. Open terminal in the project directory.
2. Run:
   ```bash
   node server.js
   ```
3. Open `http://localhost:8000/` in **Google Chrome** or **Microsoft Edge**.
4. Click **"Allow"** when prompted for microphone permissions.

### Option 2: Direct File Opening
1. Double-click or open `index.html` directly in any web browser.
2. Browse through the pages using the navigation bar. (Note: Chrome may restrict mic access on `file://` URLs, so `http://localhost:8000/` is recommended for voice).

---

## 8. Speech Recognition & Voice States

When the user clicks the microphone button:
1. **Ready State (Deep Navy):** Button is idle and ready for interaction.
2. **Listening State (Royal Blue):** Speech recognition begins capturing audio input (`en-IN` or `ta-IN`).
3. **Transcribing / Processing State (Teal):** The spoken words are converted into text and matched against the knowledge base.
4. **Responding State (Green / Teal):** The result is displayed in the explanation panel, and the user can click **"Play Answer"** to hear the audio response.
5. **Fallback:** If speech recognition is unsupported in the user's browser, a helpful message is displayed directing them to use the typed question box.

---

## 9. Project Engineering Team & Work Distribution

**FlowCODE Public Digital Services &amp; Voice Computing Initiative**

| Role | Name | Register Number | Detailed Work Separation |
| :--- | :--- | :--- | :--- |
| **Team Head** | **Ajay V** | **145120037** | **Full-Stack Architecture & Web Speech API Integration:** Overall project leadership, design of Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) integration, pipeline states (`Listening → Transcribing → Understanding → Fetching → Responding`), and audio lifecycle management. |
| **Team Member** | **Aniruthan A.A** | **145120042** | **UI/UX Design & Tamil Language Localization:** Creation of the bilingual dictionary system (`en` & `ta`), dynamic DOM translation engine, accessible typography, high-contrast palette implementation, and mobile responsive media queries. |
| **Team Member** | **Deepan P** | **145120029** | **Government Services Database & Workflows:** Comprehensive research and structured schema creation for all 27 government services, including plain-language explanations, application steps, required documents checklist, and verified official government source links. |
| **Team Member** | **Harish P** | **145120027** | **Application Status Tracking & Query Matcher Engine:** Development of the demo application reference tracker (`APP1001`, `APP1002`, `APP1003`), stage workflow visualizer, and bilingual fuzzy keyword scoring algorithm for typed and spoken search. |
| **Team Member** | **Dharunkumar M** | **145120005** | **Authentication, Accessibility & Documentation:** Design and implementation of the full-access Citizen & Officer login portal (`login.html`), interactive dashboard, emergency citizen helpline directories, cross-browser compatibility testing, and project documentation. |

---

## 10. Important Disclaimers

> **Academic Prototype Notice:**  
> FlowCODE is an academic student project prototype created for educational purposes. It is **not** an official government portal and does not collect or process live citizen applications.
>
> **Verification Notice:**  
> Government procedures, rules, fee structures, and document requirements may be updated periodically by relevant authorities. Citizens must always verify current guidelines on official government portals (e.g., `india.gov.in`, `uidai.gov.in`, `parivahan.gov.in`) before applying.
