/**
 * FlowCODE - Voice-Based Government Service Portal
 * Citizen e-Services Initiative
 * Public Digital Services & e-Governance
 *
 * Technologies: Pure Vanilla JavaScript (No frameworks, no external libraries)
 * Features:
 *  - Speech Recognition (Web Speech API)
 *  - Text-to-Speech (Speech Synthesis)
 *  - Tamil and English bilingual translation engine
 *  - 27 Government Services Knowledge Base
 *  - Intelligent keyword matching (English & Tamil)
 *  - Application status tracking system (Demo)
 *  - Fully accessible UI controls
 */

// ==========================================
// 1. GLOBAL STATE AND CONSTANTS
// ==========================================
let currentLanguage = 'en'; // 'en' or 'ta'
let isListening = false;
let currentUtterance = null;
let activeService = null;

// UI Translations for Static Page Elements
const translations = {
  en: {
    portalName: "FlowCODE",
    portalSubtitle: "Voice-based government service portal",
    institution: "Voice-Based Government Service Initiative",
    department: "Public Digital Services & e-Governance",
    navHome: "Home",
    navServices: "Services",
    navStatus: "Application Status",
    navContact: "Contact",
    navLogin: "Login",
    navLogout: "Sign Out",
    heroTitle: "Voice Based Government Service Portal",
    heroSubtitle: "Helping citizens understand government services using simple Tamil or English voice and text interaction.",
    studentNotice: "Academic Prototype: Designed for rural citizens & learners. Please verify on official portals before applying.",
    btnStartSpeaking: "Start Speaking",
    btnStopSpeaking: "Stop Listening",
    btnViewServices: "View Government Services",
    stepListening: "Listening",
    stepTranscribing: "Transcribing",
    stepUnderstanding: "Understanding",
    stepFetching: "Fetching",
    stepResponding: "Responding",
    panelHeading: "Government Service Explanation",
    labelAsked: "You Asked:",
    labelMeaning: "Simple Meaning:",
    labelService: "Related Government Service:",
    labelAnswer: "Answer:",
    labelExplanation: "Easy Explanation:",
    labelWhyImportant: "Why This Information is Important:",
    labelSteps: "Basic Application Steps:",
    labelDocuments: "Required Documents:",
    labelSource: "Official Source:",
    labelVerifyNotice: "Important: Please verify the latest rules and documents on the official government website before applying.",
    btnPlayAnswer: "Play Answer (Voice)",
    btnStopAnswer: "Stop Audio",
    btnShowSteps: "Jump to Application Steps",
    askSectionTitle: "Ask Your Question",
    askSectionSubtitle: "Type your query below or click one of the common village service questions.",
    inputPlaceholder: "Type your question here (e.g., How to apply for income certificate?)...",
    btnAsk: "Ask Question",
    btnClear: "Clear",
    detectedLangLabel: "Input Mode:",
    exampleQuestionsTitle: "Example Common Questions (Click to test):",
    popularServicesTitle: "Popular Government Services",
    popularServicesSubtitle: "Click any service to view clear explanations, documents, and application steps.",
    whyTitle: "Why FlowCODE?",
    whyDesc1: "Most government portals are crowded with complex legal language, lengthy forms, and English-only menus. For village citizens, farmers, and elders with limited education, navigating these services online can be daunting and confusing.",
    whyDesc2: "FlowCODE bridges this digital divide by combining voice-first interaction with simple regional language explanations in Tamil and English, converting complex bureaucratic rules into plain step-by-step guidance.",
    whyBoxTitle: "Core FlowCODE Benefits",
    whyBenefit1: "Bilingual Tamil and English Voice & Text",
    whyBenefit2: "Plain Language Explanations (No Jargon)",
    whyBenefit3: "Simple Step-by-Step Application Procedures",
    whyBenefit4: "Verified Official Government Department Sources",
    whyBenefit5: "Free & Accessible on Any Standard Web Browser",
    objTitle: "Project Objective",
    objText: "The objective of FlowCODE is to help village users access and understand government-service information through simple voice and text interaction in Tamil and English.",
    statusSectionTitle: "Check Application Status (Demo)",
    statusSectionSubtitle: "Enter your application reference number to check the mock status of your request.",
    statusInputLabel: "Application Number:",
    statusInputPlaceholder: "e.g., APP1001, APP1002, APP1003",
    statusSelectLabel: "Service Type:",
    btnCheckStatus: "Check Status",
    statusNotice: "Note: This is sample data created for academic demonstration. The website is not connected to a live government database.",
    teamTitle: "Our Project Team",
    teamSubtitle: "Developed by student project engineers focusing on rural accessibility and voice computing.",
    footerDisclaimer: "Demo prototype — not an official government service.",
    footerWarning: "Government information may change. Please verify the latest details on the official government website before applying.",
    quickLinks: "Quick Links",
    contactSupport: "Department & Campus",
    noMatchFound: "Sorry, we could not find a matching answer for your query. Please try asking about Aadhaar, Voter ID, Certificates, Ration Card, or visit the official government website.",
    speechNotSupported: "Voice recognition is not supported in this browser. Please type your question instead.",
    listeningStatus: "Listening... Please speak your question now.",
    processingStatus: "Processing your question...",
    readyStatus: "Ready. Click the microphone to start speaking.",
    errorStatus: "Could not understand speech. Please try again or type below."
  },
  ta: {
    portalName: "FlowCODE",
    portalSubtitle: "குரல் அடிப்படையிலான அரசு சேவை தளம்",
    institution: "குரல் வழி அரசு சேவை முன்முயற்சி",
    department: "பொது டிஜிட்டல் சேவைகள் மற்றும் மின்-ஆளுமை",
    navHome: "முகப்பு",
    navServices: "அரசு சேவைகள்",
    navStatus: "விண்ணப்ப நிலை",
    navContact: "தொடர்பு",
    navLogin: "உள்நுழை",
    navLogout: "வெளியேறு",
    heroTitle: "குரல் அடிப்படையிலான அரசு சேவை தளம்",
    heroSubtitle: "கிராமப்புற மக்கள் மற்றும் எளிய குடிமக்கள் அரசு சேவைகளைப் புரிந்து கொள்ள எளிய தமிழ் மற்றும் ஆங்கில குரல்/உரை உதவி.",
    studentNotice: "மாணவர் கல்வி மாதிரித் திட்டம்: விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அரசு தளத்தில் சரிபார்க்கவும்.",
    btnStartSpeaking: "பேசத் தொடங்கவும்",
    btnStopSpeaking: "கேட்பதை நிறுத்தவும்",
    btnViewServices: "அரசு சேவைகளைக் காண்க",
    stepListening: "கேட்டல்",
    stepTranscribing: "உரை மாற்றம்",
    stepUnderstanding: "புரிதல்",
    stepFetching: "தகவல் பெறுதல்",
    stepResponding: "பதில் அளித்தல்",
    panelHeading: "அரசு சேவை எளிய விளக்கம்",
    labelAsked: "நீங்கள் கேட்ட கேள்வி:",
    labelMeaning: "எளிய அர்த்தம்:",
    labelService: "தொடர்புடைய அரசு சேவை:",
    labelAnswer: "பதில்:",
    labelExplanation: "விளக்கம்:",
    labelWhyImportant: "இந்த தகவல் ஏன் முக்கியம்:",
    labelSteps: "விண்ணப்பிக்கும் எளிய வழிமுறைகள்:",
    labelDocuments: "தேவையான ஆவணங்கள்:",
    labelSource: "அதிகாரப்பூர்வ அரசு மூலம்:",
    labelVerifyNotice: "முக்கிய குறிப்பு: விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அரசு இணையதளத்தில் சமீபத்திய விதிகள் மற்றும் ஆவணங்களை சரிபார்க்கவும்.",
    btnPlayAnswer: "பதிலைக் கேட்கவும் (குரல்)",
    btnStopAnswer: "ஆடியோவை நிறுத்து",
    btnShowSteps: "விண்ணப்ப படிகளைக் காண்க",
    askSectionTitle: "உங்கள் கேள்வியைக் கேளுங்கள்",
    askSectionSubtitle: "கீழே உங்கள் கேள்வியை தட்டச்சு செய்யவும் அல்லது எளிய கேள்வி பொத்தான்களை அழுத்தவும்.",
    inputPlaceholder: "உங்கள் கேள்வியை இங்கு தட்டச்சு செய்யவும் (எ.கா: வருமான சான்றிதழ் பெறுவது எப்படி?)...",
    btnAsk: "கேள்வி கேள்",
    btnClear: "அழி",
    detectedLangLabel: "உள்ளீட்டு முறை:",
    exampleQuestionsTitle: "மாதிரி பொதுவான கேள்விகள் (பயிற்சி செய்ய அழுத்தவும்):",
    popularServicesTitle: "பிரபலமான அரசு சேவைகள்",
    popularServicesSubtitle: "எளிய விளக்கம், தேவையான ஆவணங்கள் மற்றும் வழிமுறைகளைப் பார்க்க கிளிக் செய்யவும்.",
    whyTitle: "ஏன் FlowCODE?",
    whyDesc1: "பெரும்பாலான அரசு இணையதளங்கள் கடினமான சொற்கள் மற்றும் ஆங்கில வழிகாட்டிகளுடன் உள்ளன. இதனால் கிராமப்புற மக்களும் குறைந்த கல்வி அறிவு கொண்டவர்களும் பெரிதும் சிரமப்படுகின்றனர்.",
    whyDesc2: "FlowCODE எளிய குரல் வழி தொடர்பு மற்றும் தூய தமிழ்/ஆங்கில விளக்கங்கள் மூலம் எளிய மக்களுக்கும் அரசு சேவைகளை எளிதாக புரிய வைக்கிறது.",
    whyBoxTitle: "FlowCODE முக்கிய நன்மைகள்",
    whyBenefit1: "தமிழ் மற்றும் ஆங்கில குரல் மற்றும் உரை வசதி",
    whyBenefit2: "கடினமான சொற்கள் இல்லாத எளிய விளக்கம்",
    whyBenefit3: "படிப்படியான தெளிவான விண்ணப்ப முறை",
    whyBenefit4: "சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ அரசு தள இணைப்புகள்",
    whyBenefit5: "எந்தவொரு இணைய உலாவியிலும் இலவசமாக பயன்படும் தளம்",
    objTitle: "திட்டத்தின் நோக்கம்",
    objText: "கிராமப்புற பயனர்கள் எளிய குரல் மற்றும் உரை வழியாக தமிழ் மற்றும் ஆங்கிலத்தில் அரசு சேவை தகவல்களை அணுகி புரிந்துகொள்ள உதவுவதே FlowCODE திட்டத்தின் நோக்கமாகும்.",
    statusSectionTitle: "விண்ணப்ப நிலையை அறிய (மாதிரி)",
    statusSectionSubtitle: "உங்கள் மாதிரி விண்ணப்ப எண்ணை உள்ளிட்டு தற்போதைய நிலையை அறியவும்.",
    statusInputLabel: "விண்ணப்ப எண்:",
    statusInputPlaceholder: "எ.கா: APP1001, APP1002, APP1003",
    statusSelectLabel: "சேவை வகை:",
    btnCheckStatus: "நிலையை சரிபார்க்கவும்",
    statusNotice: "குறிப்பு: இது கல்லூரி திட்ட மாதிரி தரவு மட்டுமே. நேரடி அரசு தளத்துடன் இணைக்கப்படவில்லை.",
    teamTitle: "எங்கள் திட்டக் குழு",
    teamSubtitle: "கிராமப்புற கணினி பயன்பாடு மற்றும் குரல் வழி தொழில்நுட்பத்தை மேம்படுத்தும் மாணவர் பொறியியல் குழு.",
    footerDisclaimer: "மாதிரி திட்டம் மட்டுமே — இது அதிகாரப்பூர்வ அரசு சேவை அல்ல.",
    footerWarning: "அரசு தகவல்கள் மாறக்கூடும். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அரசு இணையதளத்தில் சரிபார்க்கவும்.",
    quickLinks: "முக்கிய இணைப்புகள்",
    contactSupport: "துறை மற்றும் முகவரி",
    noMatchFound: "மன்னிக்கவும், உங்கள் கேள்விக்குரிய விடை கிடைக்கவில்லை. ஆதார், குடும்ப அட்டை, சான்றிதழ் பற்றி கேட்டுப்பார்க்கவும் அல்லது அரசு தளத்தைப் பார்க்கவும்.",
    speechNotSupported: "இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை. உங்கள் கேள்வியை தட்டச்சு செய்யவும்.",
    listeningStatus: "கேட்கிறது... இப்போது உங்கள் கேள்வியைப் பேசவும்.",
    processingStatus: "உங்கள் கேள்வி செயலாக்கப்படுகிறது...",
    readyStatus: "தயாராக உள்ளது. பேச மைக்ரோஃபோன் பொத்தானை அழுத்தவும்.",
    errorStatus: "குரல் சரியாக புரியவில்லை. மீண்டும் பேசவும் அல்லது தட்டச்சு செய்யவும்."
  }
};

// ==========================================
// 2. COMPLETE 27 GOVERNMENT SERVICES DATABASE
// ==========================================
const governmentServicesDB = [
  {
    id: "aadhaar",
    category: "Identity",
    source: "Unique Identification Authority of India (UIDAI)",
    sourceUrl: "https://uidai.gov.in",
    en: {
      title: "Aadhaar Services",
      question: "How can I apply for or update my Aadhaar card?",
      simpleMeaning: "You are asking how to get a unique 12-digit Indian citizen identity card or update your mobile number and address on it.",
      answer: "Aadhaar is a 12-digit unique identity number issued by UIDAI for all Indian residents. It serves as essential proof of identity and address.",
      simpleExplanation: "Aadhaar is needed for receiving ration, school admissions, bank accounts, pensions, and welfare subsidies directly to your account. Minor address updates can be made online, but biometric and mobile updates require visiting an Aadhaar Seva Kendra.",
      whyImportant: "Without Aadhaar, it is very difficult to access government welfare subsidies, open bank accounts, or register for state schemes.",
      steps: [
        "Locate your nearest Aadhaar Seva Kendra or Post Office center.",
        "Carry original Proof of Identity (Voter ID, PAN) and Proof of Address (Ration card, Electricity bill).",
        "Fill out the Aadhaar Enrolment / Correction form.",
        "Submit biometrics (fingerprints and iris scan) and a live photograph.",
        "Collect the 28-digit Enrolment Slip (EID) to track status online at uidai.gov.in."
      ],
      documents: [
        "Proof of Identity (Voter Card, PAN Card, or Passport)",
        "Proof of Address (Ration Card, Electricity Bill, or Bank Passbook)",
        "Proof of Date of Birth (Birth Certificate or SSLC Marksheet)"
      ],
      keywords: ["aadhaar", "adhar", "uidai", "aadhar card", "update address", "aadhaar link", "identity card"]
    },
    ta: {
      title: "ஆதார் சேவைகள்",
      question: "ஆதார் அட்டை பெறுவது அல்லது திருத்துவது எப்படி?",
      simpleMeaning: "இந்தியக் குடிமக்களுக்கான 12 இலக்க அடையாள அட்டையை எவ்வாறு பெறுவது அல்லது முகவரி மாற்றுவது என கேட்கிறீர்கள்.",
      answer: "ஆதார் என்பது இந்திய குடிமக்களுக்கு இந்திய தனித்துவ அடையாள ஆணையத்தால் (UIDAI) வழங்கப்படும் 12 இலக்க தனித்துவ எண் ஆகும்.",
      simpleExplanation: "அரசு நலத்திட்டங்கள், வங்கி கணக்குகள், முதியோர் ஓய்வூதியம் மற்றும் இலவச ரேஷன் பெற ஆதார் மிக அவசியமான ஆவணமாகும். கைரேகை மற்றும் தொலைபேசி எண் மாற்ற ஆதார் சேவை மையத்திற்கு நேரில் செல்ல வேண்டும்.",
      whyImportant: "ஆதார் எண் இல்லாமல் அரசு மானியங்களையோ அல்லது வங்கி சேவைகளையோ பெறுவது மிகவும் கடினம்.",
      steps: [
        "அருகிலுள்ள ஆதார் சேவை மையம் அல்லது அஞ்சலகத்திற்கு செல்லவும்.",
        "அடையாள மற்றும் முகவரி சான்றுகளின் அசல் ஆவணங்களை எடுத்துச் செல்லவும்.",
        "ஆதார் பதிவு / திருத்த படிவத்தை பூர்த்தி செய்து கொடுக்கவும்.",
        "கைரேகை, கண் கருவிழி மற்றும் புகைப்படத்தை பதிவு செய்யவும்.",
        "வழங்கப்படும் 28 இலக்க ஒப்புகை சீட்டை (EID) பத்திரமாக வைக்கவும்."
      ],
      documents: [
        "அடையாளச் சான்று (வாக்காளர் அட்டை, பான் அட்டை அல்லது பாஸ்போர்ட்)",
        "முகவரிச் சான்று (ரேஷன் அட்டை அல்லது மின்சாரக் கட்டண ரசீது)",
        "பிறப்புச் சான்றிதழ் அல்லது பள்ளி மாற்றுச் சான்றிதழ்"
      ],
      keywords: ["ஆதார்", "ஆதார் அட்டை", "முகவரி மாற்றம்", "கைரேகை", "UIDAI", "அடையாள அட்டை"]
    }
  },
  {
    id: "voter_id",
    category: "Identity",
    source: "Election Commission of India (ECI)",
    sourceUrl: "https://voters.eci.gov.in",
    en: {
      title: "Voter ID (EPIC Card)",
      question: "How can I register as a new voter or download my Voter ID?",
      simpleMeaning: "You are asking how an 18-year-old citizen can get a voter card to cast a vote in elections.",
      answer: "Indian citizens aged 18 or above can apply for an Electors Photo Identity Card (EPIC) through the Election Commission of India.",
      simpleExplanation: "Having a Voter ID gives you the democratic right to vote in panchayat, state, and central elections. It is also an officially accepted government identity proof.",
      whyImportant: "Voting is your constitutional right, and the card serves as strong proof of Indian citizenship and residence.",
      steps: [
        "Visit the official portal voters.eci.gov.in or use the Voter Helpline Mobile App.",
        "Register with your mobile phone number.",
        "Fill out Form 6 for a new voter registration.",
        "Upload passport photograph, age proof, and address proof.",
        "Note the reference ID for tracking. The Booth Level Officer (BLO) will conduct field verification."
      ],
      documents: [
        "Passport size photograph",
        "Age proof (Birth Certificate, Aadhaar, or 10th marksheet)",
        "Address proof (Ration card, Electricity bill, or Aadhaar)"
      ],
      keywords: ["voter", "voter id", "epic", "election", "vote", "form 6", "polling"]
    },
    ta: {
      title: "வாக்காளர் அடையாள அட்டை",
      question: "புதிய வாக்காளர் அட்டைக்கு விண்ணப்பிப்பது எப்படி?",
      simpleMeaning: "18 வயது பூர்த்தியான குடிமக்கள் தேர்தலில் வாக்களிக்க அடையாள அட்டை பெறுவது எப்படி என கேட்கிறீர்கள்.",
      answer: "18 வயது நிரம்பிய இந்தியக் குடிமக்கள் தேர்தல் ஆணையத்தின் மூலம் வாக்காளர் அடையாள அட்டை (EPIC) பெற விண்ணப்பிக்கலாம்.",
      simpleExplanation: "பஞ்சாயத்து, சட்டமன்ற மற்றும் நாடாளுமன்றத் தேர்தல்களில் வாக்களிக்க இந்த அட்டை கட்டாயம் தேவைப்படுகிறது. இது முக்கிய முகவரி சான்றாகவும் செயல்படுகிறது.",
      whyImportant: "வாக்களிப்பது ஒவ்வொரு குடிமகனின் ஜனநாயக உரிமை மற்றும் இது சிறந்த அரசு அடையாள அட்டை ஆகும்.",
      steps: [
        "voters.eci.gov.in இணையதளம் அல்லது Voter Helpline செயலியைப் பயன்படுத்தவும்.",
        "உங்கள் மொபைல் எண்ணை உள்ளிட்டு பதிவு செய்யவும்.",
        "புதிய வாக்காளர் பதிவுக்கு படிவம் 6-ஐ (Form 6) நிரப்பவும்.",
        "புகைப்படம், வயது சான்று மற்றும் முகவரி சான்றை பதிவேற்றவும்.",
        "குறிப்பு எண்ணைப் பெற்றுக்கொள்ளவும்; அலுவலர் நேரில் சரிபார்ப்பார்."
      ],
      documents: [
        "பாஸ்போர்ட் அளவு புகைப்படம்",
        "வயது சான்று (ஆதார் அல்லது பிறப்புச் சான்றிதழ்)",
        "முகவரி சான்று (குடும்ப அட்டை அல்லது மின்கட்டண ரசீது)"
      ],
      keywords: ["வாக்காளர்", "வாக்காளர் அட்டை", "தேர்தல்", "படிவம் 6", "ஓட்டு", "வாக்கு"]
    }
  },
  {
    id: "driving_licence",
    category: "Transport",
    source: "Ministry of Road Transport and Highways (Parivahan)",
    sourceUrl: "https://parivahan.gov.in",
    en: {
      title: "Driving Licence (New Learner / Permanent)",
      question: "How do I get a Learner's Licence and permanent Driving Licence?",
      simpleMeaning: "You are asking how to legally drive a two-wheeler, car, or tractor on public roads.",
      answer: "You must first apply for a Learner's Licence (LLR), pass a basic traffic sign test, and then apply for a permanent Driving Licence after 30 days.",
      simpleExplanation: "Driving any motor vehicle without a valid licence is illegal and punishable with heavy fines. With Parivahan, you can take the LLR test online from home using Aadhaar authentication.",
      whyImportant: "A driving licence ensures road safety, valid motor insurance coverage, and serves as an official photo identification.",
      steps: [
        "Go to parivahan.gov.in and choose 'Driving Licence Related Services'.",
        "Select your state and apply for 'New Learner's Licence'.",
        "Authenticate using Aadhaar or submit documents online.",
        "Pay the nominal government fee and attend the online road rules test.",
        "After holding LLR for 30 days, book a driving test slot at the local RTO for a permanent licence."
      ],
      documents: [
        "Age proof (Aadhaar card, Birth certificate)",
        "Address proof (Aadhaar or Ration card)",
        "Physical Fitness self-declaration (Form 1) or Medical Certificate (Form 1A for transport)",
        "Passport size photographs"
      ],
      keywords: ["driving", "licence", "license", "llr", "learner", "rto", "parivahan", "car", "bike"]
    },
    ta: {
      title: "ஓட்டுநர் உரிமம் (டிரைவிங் லைசென்ஸ்)",
      question: "புதிய பழகுநர் மற்றும் நிரந்தர ஓட்டுநர் உரிமம் பெறுவது எப்படி?",
      simpleMeaning: "இருசக்கர வாகனம் அல்லது நான்கு சக்கர வாகனம் ஓட்டுவதற்கான அரசு உரிமத்தை எவ்வாறு பெறுவது என கேட்கிறீர்கள்.",
      answer: "முதலில் பழகுநர் உரிமம் (LLR) பெற்று, 30 நாட்களுக்குப் பின் ஆர்.டி.ஓ அலுவலகத்தில் வாகனம் ஓட்டிக் காட்டி நிரந்தர உரிமம் பெறலாம்.",
      simpleExplanation: "சாலையில் வாகனம் ஓட்ட ஓட்டுநர் உரிமம் கட்டாயம். பரிவாஹன் இணையதளத்தில் ஆதார் மூலம் வீட்டிலிருந்தே LLR தேர்வை எளிதாக எழுத முடியும்.",
      whyImportant: "உரிமம் இல்லாமல் வாகனம் ஓட்டுவது தண்டனைக்குரிய குற்றம் மற்றும் காப்பீடு பெற உரிமம் மிக அவசியம்.",
      steps: [
        "parivahan.gov.in தளத்தில் உங்கள் மாநிலத்தைத் தேர்வு செய்யவும்.",
        "'Apply for Learner Licence' என்பதை கிளிக் செய்து விண்ணப்பிக்கவும்.",
        "ஆதார் மூலம் சரிபார்த்து கட்டணம் செலுத்தவும்.",
        "இணையவழி சாலை பாதுகாப்பு தேர்வை எழுதி LLR சான்றிதழை பதிவிறக்கவும்.",
        "30 நாட்களுக்குப் பிறகு வட்டாரப் போக்குவரத்து அலுவலகத்தில் (RTO) வாகன சோதனைக்கு செல்லவும்."
      ],
      documents: [
        "வயது சான்று (ஆதார் அட்டை, பிறப்புச் சான்றிதழ்)",
        "முகவரி சான்று (ஆதார் அல்லது குடும்ப அட்டை)",
        "உடல் தகுதி சுய அறிவிப்புப் படிவம் (Form 1)",
        "புகைப்படங்கள்"
      ],
      keywords: ["டிரைவிங்", "ஓட்டுநர் உரிமம்", "லைசென்ஸ்", "LLR", "ஆர்.டி.ஓ", "பரிவாஹன்"]
    }
  },
  {
    id: "birth_certificate",
    category: "Certificates",
    source: "Civil Registration System (Office of Registrar General)",
    sourceUrl: "https://crsorgi.gov.in",
    en: {
      title: "Birth Certificate",
      question: "What documents are needed and how do I apply for a birth certificate?",
      simpleMeaning: "You are asking how to get an official government document proving the date and place of a child's birth.",
      answer: "Births must be registered within 21 days with the local village panchayat, municipality, or hospital where the delivery took place.",
      simpleExplanation: "A birth certificate is the child's very first identity record. It is required for school admission, Aadhaar enrolment, passport, and inheritance rights.",
      whyImportant: "It legally establishes the child's date of birth, parentage, and nationality.",
      steps: [
        "Hospital births are reported directly by the hospital authority to the local registrar.",
        "For home births, inform the Village Administrative Officer (VAO) or Panchayat Secretary within 21 days.",
        "Submit the discharge summary from the hospital and parents' Aadhaar cards.",
        "Download the signed birth certificate from your state civil registration portal or collect it from the local local body office."
      ],
      documents: [
        "Hospital Discharge Slip / Proof of Birth from medical officer",
        "Aadhaar cards of both parents",
        "Marriage certificate or declaration if applicable"
      ],
      keywords: ["birth", "birth certificate", "baby", "delivery", "hospital", "panchayat", "crs"]
    },
    ta: {
      title: "பிறப்புச் சான்றிதழ்",
      question: "பிறப்புச் சான்றிதழ் பெறுவது எப்படி? தேவையான ஆவணங்கள் யாவை?",
      simpleMeaning: "குழந்தை பிறந்த தேதி மற்றும் இடத்தை உறுதி செய்யும் அரசு சான்றிதழை எவ்வாறு பெறுவது என கேட்கிறீர்கள்.",
      answer: "குழந்தை பிறந்த 21 நாட்களுக்குள் கிராம பஞ்சாயத்து, நகராட்சி அல்லது மருத்துவமனை மூலம் பிறப்பை பதிவு செய்ய வேண்டும்.",
      simpleExplanation: "பள்ளி சேர்க்கை, ஆதார் அட்டை எடுத்தல், மற்றும் அனைத்து அரசு சலுகைகளுக்கும் குழந்தையின் பிறப்புச் சான்றிதழ் முதல் அடிப்படை ஆவணமாகும்.",
      whyImportant: "குழந்தையின் பிறந்த தேதி மற்றும் குடியுரிமையை சட்டப்பூர்வமாக நிரூபிக்கும் முதல் ஆவணம் இதுவே.",
      steps: [
        "மருத்துவமனையில் பிறந்தால் அவர்களே உள்ளூர் பிறப்புப் பதிவாளருக்கு தகவல் அனுப்புவார்கள்.",
        "வீட்டில் பிரசவம் நடந்தால் 21 நாட்களுக்குள் கிராம நிர்வாக அலுவலர் (VAO) அல்லது பஞ்சாயத்தில் தகவல் தெரிவிக்கவும்.",
        "பெற்றோரின் ஆதார் அட்டைகளை சமர்ப்பிக்கவும்.",
        "மாநில உள்ளாட்சி இணையதளம் அல்லது இ-சேவை மூலம் சான்றிதழை பதிவிறக்கம் செய்யலாம்."
      ],
      documents: [
        "மருத்துவமனை டிஸ்சார்ஜ் சீட்டு / பிறப்பு அறிக்கை",
        "தாய் மற்றும் தந்தையின் ஆதார் அட்டைகள்",
        "திருமண சான்று அல்லது முகவரி ஆவணம்"
      ],
      keywords: ["பிறப்பு", "பிறப்பு சான்றிதழ்", "குழந்தை", "மருத்துவமனை", "பஞ்சாயத்து"]
    }
  },
  {
    id: "income_certificate",
    category: "Certificates",
    source: "State Revenue Department & e-District Portals",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Income Certificate",
      question: "How can I apply for an income certificate?",
      simpleMeaning: "You are asking how to get a document that shows your total family annual income.",
      answer: "An income certificate is issued by the Revenue Department (Tahsildar / Village Officer) to verify an individual or family's yearly income from all sources.",
      simpleExplanation: "This certificate gives an official record of your income. It is widely needed for college scholarships, school fee waivers, medical welfare cards, and subsidized loans.",
      whyImportant: "It verifies eligibility for government welfare programs meant for economically disadvantaged families.",
      steps: [
        "Visit your nearest government e-Seva / Common Service Centre (CSC) or state e-District portal.",
        "Submit the applicant's salary slip, employer certificate, or village agricultural income affidavit.",
        "Village Administrative Officer (VAO) and Revenue Inspector (RI) will verify the details.",
        "The Tahsildar approves and issues the digitally signed certificate within 7 to 15 days."
      ],
      documents: [
        "Aadhaar Card of the applicant and family members",
        "Ration Card or Smart Card copy",
        "Salary slip, bank passbook, or village agricultural income self-declaration",
        "Recent passport-sized photograph"
      ],
      keywords: ["income", "income certificate", "annual income", "salary certificate", "tahsildar", "e district", "e seva"]
    },
    ta: {
      title: "வருமானச் சான்றிதழ்",
      question: "வருமானச் சான்றிதழ் பெற விண்ணப்பிப்பது எப்படி?",
      simpleMeaning: "உங்கள் குடும்பத்தின் ஆண்டு மொத்த வருமானத்தை காட்டும் அரசு சான்றிதழை எவ்வாறு பெறுவது என கேட்கிறீர்கள்.",
      answer: "குடும்பத்தின் ஆண்டு வருமானத்தை உறுதி செய்ய வருவாய்த் துறை (தாசில்தார்) மூலம் வருமானச் சான்றிதழ் வழங்கப்படுகிறது.",
      simpleExplanation: "இந்த சான்றிதழ் உங்கள் குடும்ப வருமானத்தை அரசு பதிவாக காட்டுகிறது. கல்வி உதவித்தொகை, பள்ளி கட்டண சலுகை மற்றும் நலத்திட்டங்களுக்கு இது தேவைப்படுகிறது.",
      whyImportant: "அரசு வழங்கும் கல்வி உதவித்தொகை மற்றும் மானியங்களைப் பெற இது அத்தியாவசியமான ஆவணமாகும்.",
      steps: [
        "அருகிலுள்ள இ-சேவை மையம் (e-Sevai) அல்லது மாநில இணையதளத்திற்கு செல்லவும்.",
        "வருமான விவரங்கள் மற்றும் ஆவணங்களை சமர்ப்பிக்கவும்.",
        "கிராம நிர்வாக அலுவலர் (VAO) மற்றும் வருவாய் ஆய்வாளர் (RI) நேரில் சரிபார்ப்பார்கள்.",
        "தாசில்தார் ஒப்புதல் அளித்த பின் டிஜிட்டல் கையொப்பமிட்ட சான்றிதழ் வழங்கப்படும்."
      ],
      documents: [
        "விண்ணப்பதாரர் மற்றும் குடும்பத்தினர் ஆதார் அட்டை",
        "குடும்ப அட்டை (ரேஷன் கார்டு)",
        "ஊதியச் சான்று அல்லது விவசாய வருமான சுய அறிவிப்பு",
        "பாஸ்போர்ட் அளவு புகைப்படம்"
      ],
      keywords: ["வருமானம்", "வருமான சான்றிதழ்", "தாசில்தார்", "இ சேவை", "வருமானச் சான்று", "வருவாய்"]
    }
  },
  {
    id: "community_certificate",
    category: "Certificates",
    source: "State Revenue Administration",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Community / Caste Certificate",
      question: "How do I get a Community or Caste Certificate?",
      simpleMeaning: "You are asking how to get a certificate that proves your caste or community category (SC/ST/OBC/BC/MBC).",
      answer: "A Community Certificate is an official document issued by the state revenue department certifying that an individual belongs to a particular community or caste.",
      simpleExplanation: "Government reservations in education, college admissions, competitive exams, and government job recruitments depend on this certificate.",
      whyImportant: "It ensures reserved quota rights, fee concessions, and government welfare benefits meant for your community.",
      steps: [
        "Apply at a local e-Seva centre or online via the state revenue portal.",
        "Provide parent's or sibling's community certificate as proof of family lineage.",
        "Local VAO and Revenue Inspector verify community records in the village register.",
        "Digitally signed certificate is issued by the Tahsildar / Zonal Deputy Tahsildar."
      ],
      documents: [
        "Applicant's Aadhaar Card",
        "Father's / Mother's / Sibling's Community Certificate copy",
        "School Transfer Certificate (TC) mentioning caste",
        "Ration Card or Smart Card"
      ],
      keywords: ["community", "caste", "caste certificate", "obc", "sc", "st", "bc", "mbc", "reservation"]
    },
    ta: {
      title: "சாதிச் சான்றிதழ் (Community Certificate)",
      question: "சாதிச் சான்றிதழ் பெறுவது எப்படி?",
      simpleMeaning: "நீங்கள் எந்த சமூகத்தைச் சேர்ந்தவர் என்பதை உறுதிப்படுத்தும் சான்றிதழைப் பெறுவது எப்படி என கேட்கிறீர்கள்.",
      answer: "ஒருவர் குறிப்பிட்ட சமூகம் அல்லது வகுப்பைச் சேர்ந்தவர் என்பதை உறுதி செய்ய வருவாய்த் துறையால் சாதிச் சான்றிதழ் வழங்கப்படுகிறது.",
      simpleExplanation: "பள்ளி, கல்லூரி சேர்க்கை, அரசு வேலைவாய்ப்பு இடஒதுக்கீடு மற்றும் கல்வி உதவித்தொகை பெற இந்த சான்றிதழ் மிகவும் அவசியம்.",
      whyImportant: "அரசியலமைப்பு வழங்கும் இடஒதுக்கீடு சலுகைகள் மற்றும் கல்வி சலுகைகளை பெற இது கட்டாயமாகும்.",
      steps: [
        "அருகிலுள்ள இ-சேவை மையத்தில் விண்ணப்பிக்கவும்.",
        "பெற்றோர் அல்லது உடன் பிறந்தோரின் சாதிச் சான்றிதழை சான்றாக இணைக்கவும்.",
        "கிராம நிர்வாக அலுவலர் மற்றும் வருவாய் ஆய்வாளர் கிராம பதிவேடுகளை சரிபார்ப்பார்.",
        "தாசில்தார் ஒப்புதலுக்குப் பிறகு சான்றிதழைப் பெற்றுக் கொள்ளலாம்."
      ],
      documents: [
        "விண்ணப்பதாரரின் ஆதார் அட்டை",
        "தந்தை/தாய் அல்லது சகோதரரின் சாதிச் சான்றிதழ் நகல்",
        "பள்ளி மாற்றுச் சான்றிதழ் (TC)",
        "குடும்ப அட்டை நகல்"
      ],
      keywords: ["சாதி", "சாதி சான்றிதழ்", "கம்யூனிட்டி", "இடஒதுக்கீடு", "தாசில்தார்", "BC", "MBC", "SC", "ST"]
    }
  },
  {
    id: "residence_certificate",
    category: "Certificates",
    source: "State Revenue Department",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Residence / Domicile / Nativity Certificate",
      question: "How can I obtain a Residence or Nativity Certificate?",
      simpleMeaning: "You are asking how to get proof that you have lived in a specific village, town, or state for a number of years.",
      answer: "A Residence or Nativity Certificate certifies that a citizen is a permanent resident of a specific village, district, or state.",
      simpleExplanation: "State government recruitments, local quota admissions in universities, and regional welfare schemes require proof of native residency.",
      whyImportant: "It grants you access to state-specific job quotas, local scholarships, and regional farmer subsidies.",
      steps: [
        "Apply online through your State e-District portal or at an e-Seva centre.",
        "Upload residency proof showing minimum required continuous stay (typically 5+ years).",
        "Revenue department verifies residential records.",
        "Download the verified digital certificate."
      ],
      documents: [
        "Aadhaar Card with local address",
        "Ration Card or Voter ID card",
        "Electricity bill, Land Tax receipt, or Rent Agreement",
        "School study certificate (showing continuous years of study)"
      ],
      keywords: ["residence", "nativity", "domicile", "address proof", "native certificate", "resident"]
    },
    ta: {
      title: "இருப்பிடச் சான்றிதழ் (Nativity / Residence)",
      question: "இருப்பிடச் சான்றிதழ் அல்லது பூர்வீகச் சான்றிதழ் பெறுவது எப்படி?",
      simpleMeaning: "நீங்கள் குறிப்பிட்ட ஊர் அல்லது மாநிலத்தில் பல ஆண்டுகளாக வசித்து வருகிறீர்கள் என்பதை நிரூபிக்கும் சான்றிதழ்.",
      answer: "நீங்கள் ஒரு குறிப்பிட்ட ஊர் அல்லது மாநிலத்தில் நிரந்தரமாக வசித்து வருகிறீர்கள் என்பதை உறுதி செய்ய வருவாய்த் துறை வழங்குகிறது.",
      simpleExplanation: "மாநில அரசு வேலைவாய்ப்புகள், உள்ளூர் இடஒதுக்கீடு மற்றும் விவசாய நலத்திட்டங்கள் பெற இருப்பிடச் சான்றிதழ் அவசியமாகும்.",
      whyImportant: "மாநில அரசின் சலுகைகள் மற்றும் உள்ளூர் மாணவர் இடஒதுக்கீட்டைப் பெற இது கட்டாயமாகும்.",
      steps: [
        "இ-சேவை மையம் அல்லது அரசு மின்-மாவட்ட இணையதளம் வழியே விண்ணப்பிக்கவும்.",
        "குறைந்தபட்சம் 5 ஆண்டுகள் தொடர்ந்து அங்கு வசிப்பதற்கான ஆவணங்களை இணைக்கவும்.",
        "கிராம நிர்வாக அலுவலர் நேரில் கள ஆய்வு செய்து சரிபார்ப்பார்.",
        "டிஜிட்டல் சான்றிதழை இ-சேவை மையத்தில் பெற்றுக்கொள்ளலாம்."
      ],
      documents: [
        "ஆதார் அட்டை",
        "குடும்ப அட்டை அல்லது வாக்காளர் அட்டை",
        "மின் கட்டண ரசீது அல்லது வீட்டு வரி ரசீது",
        "பள்ளி படிப்புச் சான்றிதழ் (Study Certificate)"
      ],
      keywords: ["இருப்பிடம்", "இருப்பிட சான்றிதழ்", "நேட்டிவிட்டி", "பூர்வீகம்", "முகவரி"]
    }
  },
  {
    id: "health_schemes",
    category: "Welfare & Health",
    source: "National Health Authority (Ayushman Bharat PM-JAY)",
    sourceUrl: "https://pmjay.gov.in",
    en: {
      title: "Health Schemes (Ayushman Bharat / CMCHS)",
      question: "How do I get free hospital treatment under government health schemes?",
      simpleMeaning: "You are asking how poor and rural families can get cashless hospital surgeries and medical treatment up to ₹5 Lakhs.",
      answer: "Ayushman Bharat PM-JAY and state Chief Minister Health Schemes offer up to ₹5 Lakhs per family per year for secondary and tertiary cashless hospitalization.",
      simpleExplanation: "Eligible families can visit any empaneled government or private hospital, present their Ayushman Card or Ration Card, and receive free medical treatment without paying cash upfront.",
      whyImportant: "It protects rural and low-income families from devastating hospital expenses during critical illnesses.",
      steps: [
        "Check your family eligibility on pmjay.gov.in or at a Primary Health Centre (PHC).",
        "Visit any empaneled government hospital or CSC center with your Ration card and Aadhaar card.",
        "Complete e-KYC verification with biometric fingerprint.",
        "Download your Ayushman Golden Card.",
        "Show the card at the hospital 'Ayushman Mitra' desk to avail cashless treatment."
      ],
      documents: [
        "Ration Card / Smart Card",
        "Aadhaar Card of all family members",
        "Active mobile number"
      ],
      keywords: ["health", "hospital", "ayushman", "pmjay", "medical insurance", "free treatment", "cmchs"]
    },
    ta: {
      title: "அரசு மருத்துவக் காப்பீட்டுத் திட்டம்",
      question: "அரசு மருத்துவக் காப்பீடு மூலம் இலவச சிகிச்சை பெறுவது எப்படி?",
      simpleMeaning: "ஏழை எளிய குடும்பங்கள் தனியார் மற்றும் அரசு மருத்துவமனைகளில் ₹5 லட்சம் வரை இலவச சிகிச்சை பெறுவது எப்படி என கேட்கிறீர்கள்.",
      answer: "ஆயுஷ்மான் பாரத் (PM-JAY) மற்றும் முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் மூலம் ஆண்டுக்கு ₹5 லட்சம் வரை கட்டணமில்லா சிகிச்சை பெறலாம்.",
      simpleExplanation: "திட்டத்தில் இணைக்கப்பட்டுள்ள அரசு அல்லது தனியார் மருத்துவமனைகளுக்குச் சென்று, காப்பீட்டு அட்டை அல்லது ரேஷன் அட்டையைக் காட்டி பணம் எதுவும் செலுத்தாமல் சிகிச்சை பெறலாம்.",
      whyImportant: "திடீர் அறுவை சிகிச்சை மற்றும் தீவிர நோய்களின் போது ஏழை குடும்பங்கள் கடன் சுமையில் சிக்குவதைத் தடுக்கிறது.",
      steps: [
        "pmjay.gov.in அல்லது ஆரம்ப சுகாதார நிலையத்தில் உங்கள் குடும்ப தகுதியை சரிபார்க்கவும்.",
        "குடும்ப அட்டை மற்றும் ஆதார் அட்டையுடன் அரசு மருத்துவமனைக்கு செல்லவும்.",
        "கைரேகை பதிவு செய்து இ-கேஒய்சி (e-KYC) முடிக்கவும்.",
        "ஆயுஷ்மான் தங்க அட்டையைப் பெற்றுக்கொள்ளவும்.",
        "மருத்துவமனையில் உள்ள 'ஆயுஷ்மான் மித்ரா' உதவி மையத்தில் அட்டையைக் காட்டி சிகிச்சை பெறவும்."
      ],
      documents: [
        "குடும்ப அட்டை (ரேஷன் கார்டு)",
        "குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள்",
        "மொபைல் எண்"
      ],
      keywords: ["மருத்துவம்", "காப்பீடு", "ஆயுஷ்மான்", "இலவச சிகிச்சை", "மருத்துவமனை", "முதலமைச்சர் காப்பீடு"]
    }
  },
  {
    id: "vaccination",
    category: "Welfare & Health",
    source: "Ministry of Health and Family Welfare",
    sourceUrl: "https://www.mohfw.gov.in",
    en: {
      title: "Vaccination & Immunization Services",
      question: "Where and how can I get routine child and adult vaccinations?",
      simpleMeaning: "You are asking how to get free life-saving vaccines for newborn babies, children, and pregnant mothers.",
      answer: "The Universal Immunization Programme (UIP) provides free vaccines against 12 preventable diseases at all government Primary Health Centres (PHCs) and Anganwadis.",
      simpleExplanation: "Vaccines protect children from polio, tetanus, hepatitis, measles, and rubella. Village health nurses (VHN) conduct regular vaccination camps every Wednesday.",
      whyImportant: "Immunization is crucial to shield children from life-threatening childhood diseases and long-term disability.",
      steps: [
        "Register pregnant mothers at the nearest Primary Health Centre (PHC) or Anganwadi.",
        "Obtain the Mother and Child Protection (RCH) card.",
        "Bring the infant on scheduled immunization days (usually Village Health Days / Wednesdays).",
        "Keep the vaccination record card safely for school admissions."
      ],
      documents: [
        "Mother and Child Health Card / RCH Book",
        "Parents' Aadhaar Card"
      ],
      keywords: ["vaccine", "vaccination", "injection", "polio", "immunization", "baby", "phc", "anganwadi"]
    },
    ta: {
      title: "தடுப்பூசி மற்றும் சுகாதார சேவைகள்",
      question: "குழந்தைகளுக்கான இலவச தடுப்பூசி எங்கு மற்றும் எப்படி போடுவது?",
      simpleMeaning: "பிறந்த குழந்தை மற்றும் கர்ப்பிணி தாய்மார்களுக்கான இலவச தடுப்பூசிகளை எங்கு போடுவது என கேட்கிறீர்கள்.",
      answer: "அனைத்து அரசு ஆரம்ப சுகாதார நிலையங்கள் (PHC) மற்றும் அங்கன்வாடி மையங்களில் 12 வகையான நோய்களுக்கு எதிரான தடுப்பூசிகள் முற்றிலும் இலவசமாக போடப்படுகின்றன.",
      simpleExplanation: "போலியோ, தட்டம்மை, மஞ்சள் காமாலை போன்ற தீவிர நோய்களிலிருந்து குழந்தைகளைப் பாதுகாக்க இந்த தடுப்பூசிகள் அவசியம். கிராம செவிலியர்கள் வாரந்தோறும் இதனை வழங்குகிறார்கள்.",
      whyImportant: "குழந்தைகளின் ஆரோக்கியமான எதிர்காலத்திற்கும் கொடிய நோய்களிலிருந்து பாதுகாக்கவும் இது மிக அவசியமாகும்.",
      steps: [
        "கர்ப்பிணி தாய்மார்கள் ஆரம்ப சுகாதார நிலையம் அல்லது அங்கன்வாடியில் பதிவு செய்யவும்.",
        "தாய்-சேய் நலப் பாதுகாப்பு அட்டையைப் (RCH Card) பெற்றுக்கொள்ளவும்.",
        "குறிப்பிட்ட தேதிகளில் குழந்தையை ஆரம்ப சுகாதார நிலையத்திற்கு அழைத்து வரவும்.",
        "தடுப்பூசி போட்ட விவரங்களை அட்டையில் தவறாமல் குறித்துக்கொள்ளவும்."
      ],
      documents: [
        "தாய் சேய் நல அட்டை (RCH புத்தகம்)",
        "பெற்றோரின் ஆதார் அட்டை"
      ],
      keywords: ["தடுப்பூசி", "போலியோ", "ஊசி", "குழந்தை", "ஆரம்ப சுகாதார நிலையம்", "அங்கன்வாடி"]
    }
  },
  {
    id: "scholarships",
    category: "Education",
    source: "National Scholarship Portal (NSP)",
    sourceUrl: "https://scholarships.gov.in",
    en: {
      title: "Government Scholarships",
      question: "How can students apply for school and college scholarships?",
      simpleMeaning: "You are asking how students from poor or rural families can get financial help from the government for their studies.",
      answer: "School and college students can apply for Pre-Matric, Post-Matric, and Merit-cum-Means scholarships through the National Scholarship Portal (NSP) or State portals.",
      simpleExplanation: "Scholarship money is sent directly into the student's Aadhaar-linked bank account (DBT) to pay for school fees, books, and hostel charges.",
      whyImportant: "It ensures that financial constraints do not stop talented village students from pursuing higher education.",
      steps: [
        "Visit scholarships.gov.in and click 'New Student Registration'.",
        "Provide Aadhaar number and active bank account details.",
        "Fill out educational details and select the matching scholarship scheme.",
        "Upload marksheet, income certificate, and community certificate.",
        "Submit the application and hand over a printout to your school or college nodal officer for verification."
      ],
      documents: [
        "Student's Aadhaar Card",
        "Bank Passbook copy (must be Aadhaar seeded)",
        "Income Certificate (current financial year)",
        "Community Certificate",
        "Previous year mark sheet and Bonafide student certificate"
      ],
      keywords: ["scholarship", "fees", "student", "college", "nsp", "matric", "education loan", "study help"]
    },
    ta: {
      title: "அரசு கல்வி உதவித்தொகை (Scholarships)",
      question: "பள்ளி மற்றும் கல்லூரி மாணவர்கள் கல்வி உதவித்தொகை பெறுவது எப்படி?",
      simpleMeaning: "பொருளாதாரத்தில் பின்தங்கிய மாணவர்கள் படிக்க அரசு வழங்கும் உதவிப்பணத்தை எவ்வாறு பெறுவது என கேட்கிறீர்கள்.",
      answer: "பள்ளி மற்றும் கல்லூரி மாணவர்கள் தேசிய உதவித்தொகை தளம் (NSP) அல்லது மாநில அரசு தளங்கள் மூலம் உதவித்தொகைக்கு விண்ணப்பிக்கலாம்.",
      simpleExplanation: "படிப்பு கட்டணம், புத்தகங்கள் மற்றும் விடுதி செலவுகளுக்காக உதவித்தொகை நேரடியாக மாணவரின் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கில் செலுத்தப்படுகிறது.",
      whyImportant: "கிராமப்புற மற்றும் ஏழை மாணவர்கள் பணக் கஷ்டத்தால் படிப்பை கைவிடாமல் உயர் கல்வி பெற இது உதவுகிறது.",
      steps: [
        "scholarships.gov.in தளத்தில் 'New Registration' கிளிக் செய்யவும்.",
        "ஆதார் எண் மற்றும் வங்கிக் கணக்கு விவரங்களை உள்ளிடவும்.",
        "பள்ளி/கல்லூரி விவரங்கள் மற்றும் தகுதியான உதவித்தொகை திட்டத்தை தேர்வு செய்யவும்.",
        "வருமான சான்று, சாதி சான்று மற்றும் மதிப்பெண் பட்டியலை பதிவேற்றவும்.",
        "படிவத்தை சமர்ப்பித்து அதன் நகலை பள்ளி/கல்லூரி அலுவலகத்தில் சரிபார்ப்பிற்கு கொடுக்கவும்."
      ],
      documents: [
        "மாணவரின் ஆதார் அட்டை",
        "வங்கி கணக்கு புத்தக நகல் (ஆதார் இணைக்கப்பட்டிருக்க வேண்டும்)",
        "வருமானச் சான்றிதழ்",
        "சாதிச் சான்றிதழ்",
        "முந்தைய ஆண்டு மதிப்பெண் பட்டியல் மற்றும் கல்வி நிலைய சான்றிதழ்"
      ],
      keywords: ["உதவித்தொகை", "கல்வி உதவித்தொகை", "ஸ்காலர்ஷிப்", "மாணவர்", "பள்ளி", "கல்லூரி", "NSP"]
    }
  },
  {
    id: "exam_results",
    category: "Education",
    source: "DigiLocker & Official Examination Boards",
    sourceUrl: "https://www.digilocker.gov.in",
    en: {
      title: "Board Exam Results & Digital Certificates",
      question: "How can I check 10th/12th board exam results and download verified marksheets?",
      simpleMeaning: "You are asking how to view school board examination results and download original digital marksheets.",
      answer: "Students can check results on state board portals and download legally recognized digital marksheets through DigiLocker.",
      simpleExplanation: "Mark sheets downloaded from DigiLocker are digitally signed by the government and have equal legal validity to physical printed certificates under the IT Act.",
      whyImportant: "Instant access to verified marks prevents forged documents and speeds up college admissions.",
      steps: [
        "Visit your state examination result portal on announcement day.",
        "Enter your Roll Number and Date of Birth to view instant results.",
        "To get the permanent certificate, open digilocker.gov.in or the DigiLocker app.",
        "Sign in using your Aadhaar number and navigate to 'Education' -> Select your Education Board.",
        "Enter registration year and roll number to fetch and download the original marksheet."
      ],
      documents: [
        "Exam Roll Number / Registration Number",
        "Date of Birth as per school records",
        "Aadhaar Number (for DigiLocker fetch)"
      ],
      keywords: ["exam", "results", "marksheet", "10th", "12th", "board exam", "digilocker", "cbse"]
    },
    ta: {
      title: "தேர்வு முடிவுகள் மற்றும் மதிப்பெண் சான்றிதழ்",
      question: "10 மற்றும் 12-ஆம் வகுப்பு தேர்வு முடிவுகள் மற்றும் மதிப்பெண் பட்டியலை எடுப்பது எப்படி?",
      simpleMeaning: "பள்ளி பொதுத்தேர்வு முடிவுகளை பார்ப்பது மற்றும் அசல் டிஜிட்டல் மதிப்பெண் சான்றிதழை பதிவிறக்குவது எப்படி.",
      answer: "அரசு தேர்வுத் துறை இணையதளத்தில் முடிவுகளை பார்க்கலாம் மற்றும் டிஜிலாக்கர் (DigiLocker) மூலம் அசல் சான்றிதழை பதிவிறக்கலாம்.",
      simpleExplanation: "டிஜிலாக்கர் மூலம் பெறப்படும் டிஜிட்டல் மதிப்பெண் பட்டியல் அசல் சான்றிதழுக்கு இணையான சட்டப்பூர்வ மதிப்பைக் கொண்டது.",
      whyImportant: "கல்லூரி சேர்க்கை மற்றும் வேலைவாய்ப்புகளுக்கு விரைவாக சான்றிதழைப் பெற இது மிகவும் பயனுள்ளதாக இருக்கும்.",
      steps: [
        "அரசு தேர்வு முடிவுகள் இணையதளத்திற்கு செல்லவும்.",
        "உங்கள் தேர்வு பதிவு எண் மற்றும் பிறந்த தேதியை உள்ளிட்டு முடிவுகளை பார்க்கவும்.",
        "அசல் சான்றிதழ் பெற digilocker.gov.in அல்லது DigiLocker செயலியைத் திறக்கவும்.",
        "ஆதார் மூலம் உள்நுழைந்து உங்கள் பள்ளிக் கல்வி வாரியத்தைத் தேர்ந்தெடுக்கவும்.",
        "பதிவு எண்ணை உள்ளிட்டு சான்றிதழைப் பதிவிறக்கம் செய்து கொள்ளவும்."
      ],
      documents: [
        "தேர்வு பதிவு எண் (Roll Number)",
        "பிறந்த தேதி",
        "ஆதார் எண்"
      ],
      keywords: ["தேர்வு", "தேர்வு முடிவு", "மதிப்பெண் பட்டியல்", "10th", "12th", "டிஜிலாக்கர்"]
    }
  },
  {
    id: "employment_portals",
    category: "Employment",
    source: "National Career Service (Ministry of Labour & Employment)",
    sourceUrl: "https://www.ncs.gov.in",
    en: {
      title: "Employment Registration (NCS & State Exchange)",
      question: "How can job seekers register on government employment portals?",
      simpleMeaning: "You are asking how educated youth can register their degrees for government and private job opportunities.",
      answer: "Job seekers can register on the National Career Service (NCS) portal or their district employment exchange to access job fairs and public sector recruitments.",
      simpleExplanation: "Registration helps calculate state seniority for government postings and connects rural candidates with verified private sector employers and job melas.",
      whyImportant: "It keeps your educational qualifications formally recorded on official employment lists and notifies you of vacancies.",
      steps: [
        "Visit ncs.gov.in or your state employment exchange website.",
        "Click on 'Jobseeker Registration' and enter your Aadhaar / PAN details.",
        "Fill in personal, educational, and vocational qualifications.",
        "Upload resume and certificates.",
        "Download your NCS Jobseeker Card with unique registration number."
      ],
      documents: [
        "Aadhaar Card",
        "Educational certificates (10th, 12th, ITI, Diploma, Degree marksheets)",
        "Community Certificate",
        "Passport size photograph"
      ],
      keywords: ["job", "employment", "ncs", "career", "employment exchange", "recruitment", "jobseeker", "work"]
    },
    ta: {
      title: "வேலைவாய்ப்பு அலுவலக பதிவு (Employment Exchange)",
      question: "அரசு வேலைவாய்ப்பு தளத்தில் பதிவு செய்வது எப்படி?",
      simpleMeaning: "படித்த இளைஞர்கள் அரசு மற்றும் தனியார் வேலைவாய்ப்புகளுக்காக பதிவு செய்வது எப்படி என கேட்கிறீர்கள்.",
      answer: "தேசிய தொழில் சேவை (NCS) அல்லது மாவட்ட வேலைவாய்ப்பு அலுவலக இணையதளத்தில் கல்வித் தகுதியை பதிவு செய்யலாம்.",
      simpleExplanation: "இதில் பதிவு செய்வதன் மூலம் அரசு வேலைக்கான பணி மூப்பு (seniority) கணக்கிடப்படுகிறது மற்றும் அரசு நடத்தும் வேலைவாய்ப்பு முகாம்களில் பங்கேற்கலாம்.",
      whyImportant: "உங்கள் கல்வித் தகுதிக்கான அரசு அறிவிப்புகள் மற்றும் வேலைவாய்ப்பு தகவல்களை உடனடியாக பெற இது உதவுகிறது.",
      steps: [
        "ncs.gov.in அல்லது மாநில வேலைவாய்ப்பு இணையதளத்திற்கு செல்லவும்.",
        "'Jobseeker' என்பதைத் தேர்ந்தெடுத்து பதிவு செய்யவும்.",
        "ஆதார் மற்றும் கல்வித் தகுதி விவரங்களை உள்ளிடவும்.",
        "சான்றிதழ்களை பதிவேற்றம் செய்யவும்.",
        "உங்கள் பதிவு அட்டை மற்றும் பதிவு எண்ணை பதிவிறக்கம் செய்து வைத்துக்கொள்ளவும்."
      ],
      documents: [
        "ஆதார் அட்டை",
        "பள்ளி/கல்லூரி கல்விச் சான்றிதழ்கள்",
        "சாதிச் சான்றிதழ்",
        "புகைப்படம்"
      ],
      keywords: ["வேலைவாய்ப்பு", "வேலை", "எம்ப்ளாய்மென்ட்", "பதிவு", "NCS", "பணி"]
    }
  },
  {
    id: "skill_development",
    category: "Employment",
    source: "Skill India Digital (Ministry of Skill Development & Entrepreneurship)",
    sourceUrl: "https://www.skillindia.gov.in",
    en: {
      title: "Skill India Free Training Courses",
      question: "How can rural youth join free skill training courses?",
      simpleMeaning: "You are asking how young people can learn practical trades like electrical work, plumbing, computers, or tailoring for free.",
      answer: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) provides free vocational training, government certification, and placement support for youth.",
      simpleExplanation: "Courses are short-term (1 to 3 months) and offer hands-on training with government stipends, uniforms, and recognized skill certificates to help you get employed or start a business.",
      whyImportant: "Provides practical, market-relevant job skills for youth without college degrees.",
      steps: [
        "Go to skillindiadigital.gov.in or visit the nearest Pradhan Mantri Kaushal Kendra (PMKK).",
        "Register with your mobile phone number.",
        "Choose a job role such as Solar Technician, Electrician, Data Entry, Tailoring, or Auto Repair.",
        "Attend free hands-on training sessions at the accredited centre.",
        "Pass the assessment test to receive a certified Skill India certificate and stipend."
      ],
      documents: [
        "Aadhaar Card",
        "Bank account passbook",
        "Educational proof (8th, 10th, or 12th pass)"
      ],
      keywords: ["skill", "skill india", "pmkvy", "vocational", "training", "electrician", "tailoring", "free course"]
    },
    ta: {
      title: "இலவச திறன் மேம்பாட்டுப் பயிற்சி (Skill India)",
      question: "இளைஞர்களுக்கான இலவச தொழில் பயிற்சி பெறுவது எப்படி?",
      simpleMeaning: "மின் பணியாளர், தையல் கலை, கணினி போன்ற கைத்தொழில்களை இலவசமாக கற்றுக்கொள்வது எப்படி.",
      answer: "பிரதம மந்திரி திறன் மேம்பாட்டுத் திட்டம் (PMKVY) மூலம் இளைஞர்களுக்கு இலவச தொழில் பயிற்சியும் அரசு சான்றிதழும் வழங்கப்படுகிறது.",
      simpleExplanation: "இக்குறுகிய கால பயிற்சிகளில் செய்முறை பயிற்சி, சீருடை, உதவித்தொகை மற்றும் அங்கீகரிக்கப்பட்ட சான்றிதழ் வழங்கப்பட்டு வேலைவாய்ப்பும் பெற்றுத்தரப்படுகிறது.",
      whyImportant: "கல்லூரி செல்ல முடியாத இளைஞர்களும் சொந்த தொழில் தொடங்க அல்லது நல்ல வேலை பெற இது உதவுகிறது.",
      steps: [
        "skillindiadigital.gov.in இணையதளம் அல்லது அருகிலுள்ள திறன் பயிற்சி மையத்திற்கு செல்லவும்.",
        "உங்கள் மொபைல் எண்ணை உள்ளிட்டு பதிவு செய்யவும்.",
        "உங்களுக்கு விருப்பமான தொழில் பிரிவைத் (எ.கா: எலக்ட்ரீசியன், தையல், கணினி) தேர்ந்தெடுக்கவும்.",
        "வகுப்புகளில் கலந்துகொண்டு பயிற்சியை முடிக்கவும்.",
        "தேர்வில் தேர்ச்சி பெற்று அரசு சான்றிதழும் உதவித்தொகையும் பெறவும்."
      ],
      documents: [
        "ஆதார் அட்டை",
        "வங்கி கணக்கு புத்தகம்",
        "பள்ளி கல்வி சான்று (8 அல்லது 10-ஆம் வகுப்பு)"
      ],
      keywords: ["திறன்", "தொழில் பயிற்சி", "இலவச பயிற்சி", "Skill India", "PMKVY", "தையல்", "எலக்ட்ரீசியன்"]
    }
  },
  {
    id: "old_age_pension",
    category: "Pension",
    source: "National Social Assistance Programme (NSAP) & State Welfare",
    sourceUrl: "https://nsap.nic.in",
    en: {
      title: "Old Age Pension (IGNOAPS / OAP)",
      question: "How can senior citizens apply for the monthly old-age pension?",
      simpleMeaning: "You are asking how poor elderly citizens aged 60 and above can receive a monthly government financial pension.",
      answer: "Destitute senior citizens aged 60 or above from Below Poverty Line (BPL) families can receive a monthly direct cash pension under the Old Age Pension scheme.",
      simpleExplanation: "The pension is directly credited into the elder's post office or bank savings account every month to help them meet basic food, clothing, and medicinal expenses.",
      whyImportant: "It provides independent social security and dignified living support for destitute elders.",
      steps: [
        "Collect the Old Age Pension application form from the local Taluk Office, Village Administrative Officer (VAO), or e-Seva centre.",
        "Attach proof of age, BPL ration card, and active bank account details.",
        "The Revenue Inspector verifies family living conditions and age.",
        "Upon recommendation by the Tahsildar, the Social Security sanction order is generated."
      ],
      documents: [
        "Aadhaar Card of senior citizen",
        "Age proof (Voter ID, Birth certificate, or Medical Officer Age Certificate)",
        "BPL Ration Card / Smart Card",
        "Bank or Post Office Passbook with single account",
        "Passport size photographs"
      ],
      keywords: ["pension", "old age", "senior citizen", "oap", "nsap", "elderly", "monthly pension", "bpl pension"]
    },
    ta: {
      title: "முதியோர் உதவித்தொகை (Old Age Pension)",
      question: "முதியோர் மாத ஓய்வூதியம் பெறுவது எப்படி?",
      simpleMeaning: "60 வயதுக்கு மேற்பட்ட ஏழை முதியவர்கள் அரசு வழங்கும் மாதாந்திர உதவிப்பணத்தை பெறுவது எப்படி.",
      answer: "வறுமைக்கோட்டிற்கு கீழ் வாழும் 60 வயது நிரம்பிய ஆதரவற்ற முதியவர்களுக்கு அரசு மாதந்தோறும் முதியோர் ஓய்வூதியம் வழங்குகிறது.",
      simpleExplanation: "முதியவர்களின் மருத்துவ மற்றும் உணவு தேவைகளுக்காக இந்த உதவித்தொகை நேரடியாக அவர்களது வங்கிக் கணக்கு அல்லது அஞ்சலகக் கணக்கில் செலுத்தப்படுகிறது.",
      whyImportant: "ஆதரவற்ற வயதான காலத்தில் முதியவர்கள் பிறரை நம்பியிருக்காமல் வாழ இது சமூகப் பாதுகாப்பை அளிக்கிறது.",
      steps: [
        "கிராம நிர்வாக அலுவலர் (VAO), வட்டாட்சியர் அலுவலகம் அல்லது இ-சேவை மையத்தில் விண்ணப்பம் பெறவும்.",
        "வயது சான்று, குடும்ப அட்டை மற்றும் வங்கி புத்தக நகல்களை இணைக்கவும்.",
        "வருவாய் ஆய்வாளர் முதியவரின் நிலையை நேரில் வந்து சரிபார்ப்பார்.",
        "தாசில்தார் ஒப்புதலுக்குப் பிறகு மாதாந்திர ஓய்வூதியம் வங்கி கணக்கில் வரவு வைக்கப்படும்."
      ],
      documents: [
        "முதியவரின் ஆதார் அட்டை",
        "வயது சான்று (வாக்காளர் அட்டை அல்லது மருத்துவ சான்றிதழ்)",
        "வறுமைக்கோட்டு குடும்ப அட்டை (BPL ரேஷன் கார்டு)",
        "வங்கி கணக்கு புத்தகம்",
        "புகைப்படங்கள்"
      ],
      keywords: ["ஓய்வூதியம்", "முதியோர் ஓய்வூதியம்", "முதியோர் உதவித்தொகை", "60 வயது", "பென்ஷன்", "தாசில்தார்"]
    }
  },
  {
    id: "widow_pension",
    category: "Pension",
    source: "Social Welfare Department & NSAP",
    sourceUrl: "https://nsap.nic.in",
    en: {
      title: "Widow / Destitute Women Pension",
      question: "How can widowed or destitute women apply for monthly pension?",
      simpleMeaning: "You are asking how women who have lost their husbands can receive monthly financial support from the government.",
      answer: "Widows living below the poverty line can apply for the Indira Gandhi National Widow Pension Scheme (IGNWPS) for monthly financial assistance.",
      simpleExplanation: "This welfare pension assists widows in raising their children and managing family expenses without severe poverty.",
      whyImportant: "Guarantees a reliable safety net for vulnerable women who have lost their family's primary earner.",
      steps: [
        "Obtain husband's official death certificate and legal heir certificate.",
        "Submit the widow pension form at the Taluk Office or e-District / e-Seva centre.",
        "Field inspection by the Revenue Inspector confirms destitute status.",
        "Monthly pension order is issued by the Social Welfare / Revenue department."
      ],
      documents: [
        "Applicant's Aadhaar Card",
        "Husband's Death Certificate",
        "Legal Heir Certificate or Non-remarriage Certificate (certified by VAO)",
        "BPL Ration Card",
        "Bank Passbook copy"
      ],
      keywords: ["widow", "widow pension", "destitute women", "ignwps", "husband death", "pension scheme"]
    },
    ta: {
      title: "விதவை / ஆதரவற்ற பெண்கள் உதவித்தொகை",
      question: "விதவை பெண்கள் மாதாந்திர உதவித்தொகை பெறுவது எப்படி?",
      simpleMeaning: "கணவரை இழந்த ஏழை பெண்கள் அரசு வழங்கும் மாதாந்திர உதவிப்பணத்தை பெறுவது எப்படி.",
      answer: "கணவரை இழந்த வறுமைக்கோட்டிற்கு கீழ் உள்ள பெண்களுக்கு அரசு மாதந்தோறும் விதவை உதவித்தொகை வழங்குகிறது.",
      simpleExplanation: "குடும்பத் தலைவரை இழந்த பெண்கள் தங்களின் குழந்தைகளை வளர்க்கவும் குடும்பச் செலவுகளை சமாளிக்கவும் இந்த உதவித்தொகை வழங்கப்படுகிறது.",
      whyImportant: "கணவரை இழந்த பெண்களுக்கு பொருளாதார பாதுகாப்பும் சுயமரியாதையும் அளிக்கிறது.",
      steps: [
        "கணவரின் இறப்புச் சான்றிதழ் மற்றும் வாரிசுச் சான்றிதழைப் பெறவும்.",
        "இ-சேவை மையம் அல்லது தாலுகா அலுவலகத்தில் விதவை ஓய்வூதிய படிவத்தை பூர்த்தி செய்து கொடுக்கவும்.",
        "வருவாய் ஆய்வாளர் மற்றும் கிராம நிர்வாக அலுவலர் சரிபார்ப்பார்கள்.",
        "ஒப்புதல் கிடைத்தவுடன் மாதாந்திர ஓய்வூதியம் வங்கிக் கணக்கில் வரவு வைக்கப்படும்."
      ],
      documents: [
        "விண்ணப்பதாரரின் ஆதார் அட்டை",
        "கணவரின் இறப்புச் சான்றிதழ்",
        "மறுமணம் செய்யவில்லை என்பதற்கான VAO சான்றிதழ்",
        "குடும்ப அட்டை",
        "வங்கி கணக்கு புத்தகம்"
      ],
      keywords: ["விதவை", "விதவை உதவித்தொகை", "விதவை பென்ஷன்", "ஆதரவற்ற பெண்", "கணவர் இறப்பு"]
    }
  },
  {
    id: "disability_benefits",
    category: "Pension",
    source: "Department of Empowerment of Persons with Disabilities (UDID Portal)",
    sourceUrl: "https://www.swavlambancard.gov.in",
    en: {
      title: "Disability Benefits & UDID Card",
      question: "How can persons with disabilities get a UDID Card and monthly allowance?",
      simpleMeaning: "You are asking how differently-abled persons can get an official disability identity card and government welfare allowances.",
      answer: "Persons with disabilities can apply for the Unique Disability ID (UDID) card, which unlocks monthly financial pensions, free travel concessions, and assistive devices.",
      simpleExplanation: "The UDID card acts as a single nationwide document for all government disability benefits, eliminating the need to carry multiple paper medical certificates.",
      whyImportant: "Grants equal rights, bus/rail concessions, reservations, and monthly financial support for differently-abled citizens.",
      steps: [
        "Register on the official portal swavlambancard.gov.in.",
        "Upload personal details, address proof, photograph, and signature or thumb impression.",
        "Visit the District Medical Board at the Government Hospital for medical assessment.",
        "The board assesses disability percentage (40% or more qualifies for major benefits).",
        "Download the digital UDID card and receive the plastic smart card by post."
      ],
      documents: [
        "Aadhaar Card",
        "Disability Medical Certificate from a government hospital",
        "Passport size photograph clearly showing the disability",
        "Bank account passbook"
      ],
      keywords: ["disability", "udid", "swavlamban", "handicapped", "differently abled", "wheelchair", "special pension"]
    },
    ta: {
      title: "மாற்றுத்திறனாளிகள் நலத்திட்டங்கள் (UDID அட்டை)",
      question: "மாற்றுத்திறனாளி அடையாள அட்டை மற்றும் மாதாந்திர உதவித்தொகை பெறுவது எப்படி?",
      simpleMeaning: "மாற்றுத்திறனாளிகள் அரசு அடையாள அட்டை மற்றும் மாதாந்திர உதவித்தொகை பெறுவது எப்படி என கேட்கிறீர்கள்.",
      answer: "மாற்றுத்திறனாளிகள் தனித்துவ அடையாள அட்டை (UDID) மூலம் மாதாந்திர உதவித்தொகை, இலவச பேருந்து பயணம் மற்றும் உபகரணங்களை பெறலாம்.",
      simpleExplanation: "இந்த ஒரே UDID அட்டை மூலம் இந்தியா முழுவதும் அனைத்து அரசு சலுகைகளையும் மருத்துவ பரிசோதனை சான்றிதழ்களை சுமக்காமல் எளிதாகப் பெறலாம்.",
      whyImportant: "மாற்றுத்திறனாளிகளின் சம உரிமை, கட்டணமில்லா பயணம் மற்றும் நிதி உதவிக்கு இது அடிப்படையாகும்.",
      steps: [
        "swavlambancard.gov.in இணையதளத்தில் பதிவு செய்யவும்.",
        "ஆதார், புகைப்படம் மற்றும் விவரங்களை உள்ளிடவும்.",
        "அரசு தலைமை மருத்துவமனையில் உள்ள மருத்துவக் குழு பரிசோதனைக்கு செல்லவும்.",
        "மருத்துவர்கள் ஊனத்தின் சதவீதத்தை மதிப்பீடு செய்து சான்றளிப்பார்கள் (40% மேல் இருந்தால் முழு சலுகை).",
        "டிஜிட்டல் UDID அட்டை ஆன்லைனில் கிடைக்கும் மற்றும் அஞ்சல் மூலம் ஸ்மார்ட் கார்டு வரும்."
      ],
      documents: [
        "ஆதார் அட்டை",
        "அரசு மருத்துவமனை மருத்துவ சான்றிதழ்",
        "ஊனத்தைக் காட்டும் பாஸ்போர்ட் அளவு புகைப்படம்",
        "வங்கி கணக்கு புத்தகம்"
      ],
      keywords: ["மாற்றுத்திறனாளி", "UDID", "ஊனமுற்றோர்", "உதவித்தொகை", "இலவச பேருந்து", "மருத்துவ குழு"]
    }
  },
  {
    id: "ration_card",
    category: "Utilities & Food",
    source: "Department of Food & Public Distribution (NFSA / State PDS)",
    sourceUrl: "https://nfsa.gov.in",
    en: {
      title: "Ration Card / Smart Family Card",
      question: "How do I apply for a new Ration Card or add family members?",
      simpleMeaning: "You are asking how to get a subsidized food grains card for rice, wheat, sugar, and kerosene.",
      answer: "Ration cards (PDS Smart Cards) are issued by the Civil Supplies department to provide subsidized food grains and act as prime family identification.",
      simpleExplanation: "Through the 'One Nation One Ration Card' scheme, migrant workers and villagers can buy subsidized rice and wheat from any Fair Price Shop across India using biometric authentication.",
      whyImportant: "It ensures basic food security for the family and is the primary document required for almost every welfare scheme.",
      steps: [
        "Visit your State Civil Supplies / PDS portal (e.g., tnpds.gov.in for TN) or an e-Seva centre.",
        "Select 'Apply for New Smart Card'.",
        "Enter head of the family details, gas cylinder count, and add all family member Aadhaar numbers.",
        "Upload family photo and proof of address.",
        "The Taluk Supply Officer (TSO) will inspect and issue the card within 15 to 30 days."
      ],
      documents: [
        "Aadhaar cards of all family members",
        "Proof of residence (Electricity bill, House tax receipt, or Rental agreement)",
        "Gas connection details or consumer book",
        "Surrender certificate if shifting from another family card"
      ],
      keywords: ["ration", "ration card", "smart card", "rice", "pds", "fair price shop", "sugar", "food card", "nfsa"]
    },
    ta: {
      title: "குடும்ப அட்டை (ரேஷன் கார்டு)",
      question: "புதிய குடும்ப அட்டைக்கு விண்ணப்பிப்பது அல்லது பெயர் சேர்ப்பது எப்படி?",
      simpleMeaning: "அரிசி, பருப்பு, சர்க்கரை போன்ற அத்தியாவசிய உணவுப் பொருட்களை நியாயவிலைக் கடையில் பெற குடும்ப அட்டை பெறுவது எப்படி.",
      answer: "உணவு மற்றும் நுகர்வோர் பாதுகாப்பு துறை மூலம் பொது விநியோகத் திட்டத்தின் (PDS) கீழ் ஸ்மார்ட் குடும்ப அட்டை வழங்கப்படுகிறது.",
      simpleExplanation: "குடும்ப அட்டை மூலம் நியாயவிலைக் கடைகளில் இலவச அரிசி மற்றும் மலிவு விலையில் மளிகைப் பொருட்கள் கிடைக்கும். 'ஒரே நாடு ஒரே ரேஷன்' மூலம் எங்கு வேண்டுமானாலும் பொருட்கள் வாங்கலாம்.",
      whyImportant: "குடும்பத்தின் உணவுப் பாதுகாப்பை உறுதி செய்யவும் பிற அரசு நலத்திட்டங்களை பெறவும் இது மிக முக்கிய ஆவணம்.",
      steps: [
        "மாநில நுகர்வோர் பாதுகாப்பு இணையதளம் (எ.கா: tnpds.gov.in) அல்லது இ-சேவை மையத்திற்கு செல்லவும்.",
        "'புதிய மின்னணு குடும்ப அட்டை விண்ணப்பிக்க' என்பதைத் தேர்ந்தெடுக்கவும்.",
        "குடும்பத் தலைவர் மற்றும் அனைத்து உறுப்பினர்களின் ஆதார் எண்களை உள்ளிடவும்.",
        "முகவரி சான்று மற்றும் எரிவாயு இணைப்பு விவரங்களை பதிவேற்றவும்.",
        "வட்ட வழங்கல் அலுவலர் (TSO) சரிபார்த்து ஸ்மார்ட் அட்டையை வழங்குவார்."
      ],
      documents: [
        "அனைத்து குடும்ப உறுப்பினர்களின் ஆதார் அட்டை",
        "முகவரி சான்று (மின்கட்டண ரசீது அல்லது வீட்டு வரி ரசீது)",
        "எரிவாயு இணைப்பு விவரம்",
        "திருமணமானவர்கள் எனில் பெற்றோர் அட்டையிலிருந்து பெயர் நீக்கல் சான்றிதழ்"
      ],
      keywords: ["ரேஷன்", "ரேஷன் கார்டு", "குடும்ப அட்டை", "ஸ்மார்ட் கார்டு", "அரிசி", "PDS", "நியாய விலை கடை"]
    }
  },
  {
    id: "driving_licence_renewal",
    category: "Transport",
    source: "Parivahan Sewa (MoRTH)",
    sourceUrl: "https://parivahan.gov.in",
    en: {
      title: "Driving Licence Renewal",
      question: "Where and how can I renew an expired driving licence?",
      simpleMeaning: "You are asking how to extend the validity of your driving licence after it has passed its expiration date.",
      answer: "You can renew your driving licence online on parivahan.gov.in within one year before or after expiry without retaking the driving test.",
      simpleExplanation: "Driving with an expired licence attracts heavy fines. For applicants aged 40 and above, a medical certificate (Form 1A) signed by a registered doctor is required.",
      whyImportant: "Ensures legal driving status and validates motor insurance claims in case of unexpected accidents.",
      steps: [
        "Visit parivahan.gov.in -> Online Services -> Driving Licence Related Services.",
        "Select your state and click 'Apply for DL Renewal'.",
        "Enter your DL number and date of birth.",
        "Upload Form 1A medical certificate if over 40 years of age.",
        "Pay the renewal fee online and download the renewed acknowledgement slip."
      ],
      documents: [
        "Original Expired Driving Licence",
        "Aadhaar Card",
        "Medical Certificate Form 1A (for applicants above 40 years)",
        "Passport size photo"
      ],
      keywords: ["renew licence", "dl renewal", "expired license", "driving licence renewal", "parivahan", "rto renewal"]
    },
    ta: {
      title: "ஓட்டுநர் உரிமம் புதுப்பித்தல் (DL Renewal)",
      question: "காலாவதியான ஓட்டுநர் உரிமத்தை புதுப்பிப்பது எப்படி?",
      simpleMeaning: "காலாவதியான டிரைவிங் லைசென்ஸின் செல்லுபடியாகும் காலத்தை நீட்டிப்பது எப்படி என கேட்கிறீர்கள்.",
      answer: "பரிவாஹன் (parivahan.gov.in) இணையதளத்தில் ஆன்லைன் மூலமாகவே ஓட்டுநர் உரிமத்தை எளிதாக புதுப்பிக்கலாம்.",
      simpleExplanation: "உரிமம் காலாவதியான ஒரு வருடத்திற்குள் புதுப்பித்தால் மீண்டும் வண்டி ஓட்டி தேர்வு எழுத வேண்டிய அவசியமில்லை. 40 வயதுக்கு மேற்பட்டவர்கள் மருத்துவ சான்றிதழ் அளிக்க வேண்டும்.",
      whyImportant: "காலாவதியான உரிமத்துடன் வண்டி ஓட்டினால் அபராதம் விதிக்கப்படும் மற்றும் விபத்து காப்பீடு கிடைக்காது.",
      steps: [
        "parivahan.gov.in தளத்தில் 'Apply for DL Renewal' என்பதைத் தேர்வு செய்யவும்.",
        "உங்கள் லைசென்ஸ் எண் மற்றும் பிறந்த தேதியை உள்ளிடவும்.",
        "40 வயதுக்கு மேற்பட்டவர்கள் Form 1A மருத்துவ சான்றிதழை பதிவேற்றவும்.",
        "கட்டணத்தை ஆன்லைனில் செலுத்தி ரசீதைப் பெற்றுக்கொள்ளவும்.",
        "புதிய ஸ்மார்ட் கார்டு அஞ்சல் மூலம் உங்கள் முகவரிக்கு வந்து சேரும்."
      ],
      documents: [
        "பழைய ஓட்டுநர் உரிமம் (DL)",
        "ஆதார் அட்டை",
        "மருத்துவ தகுதி சான்றிதழ் (Form 1A - 40 வயதுக்கு மேற்பட்டவர்களுக்கு)",
        "புகைப்படம்"
      ],
      keywords: ["லைசென்ஸ் புதுப்பித்தல்", "டிரைவிங் லைசென்ஸ் ரினீவல்", "DL Renewal", "பரிவாஹன்", "காலாவதி"]
    }
  },
  {
    id: "vehicle_registration",
    category: "Transport",
    source: "Vahan Citizen Services (MoRTH)",
    sourceUrl: "https://parivahan.gov.in",
    en: {
      title: "Vehicle Registration (RC & Transfer)",
      question: "How do I check RC status or transfer vehicle ownership?",
      simpleMeaning: "You are asking how to get the Registration Certificate (RC) for a vehicle or transfer ownership when buying a used bike or car.",
      answer: "Vehicle Registration details, hypothecation termination, and ownership transfer are handled via the national Vahan portal.",
      simpleExplanation: "When buying a used vehicle, ownership must be officially transferred within 30 days using Form 29 and Form 30 to avoid legal liability for traffic accidents.",
      whyImportant: "Proves legal vehicle ownership, enables insurance claims, and prevents disputes.",
      steps: [
        "Visit vahan.parivahan.gov.in.",
        "Enter your vehicle registration number and state.",
        "Select the service: 'Transfer of Ownership' or 'RC Particulars'.",
        "Upload buyer and seller Aadhaar cards along with Form 29 & Form 30.",
        "Pay government fee and submit physical papers to RTO if required."
      ],
      documents: [
        "Original Registration Certificate (RC Book)",
        "Form 29 and Form 30 signed by seller and buyer",
        "Valid Vehicle Insurance Certificate",
        "Valid Pollution Under Control (PUC) Certificate",
        "Buyer's Aadhaar Card and Address proof"
      ],
      keywords: ["rc", "vehicle registration", "rc transfer", "ownership transfer", "vahan", "bike rc", "car registration"]
    },
    ta: {
      title: "வாகன பதிவு மற்றும் ஆர்.சி மாற்றம் (RC Transfer)",
      question: "வாகன பதிவு புத்தகம் (RC) பெயர் மாற்றம் செய்வது எப்படி?",
      simpleMeaning: "பழைய பைக் அல்லது கார் வாங்கும் போது உரிமையாளர் பெயரை உங்கள் பெயருக்கு மாற்றுவது எப்படி.",
      answer: "வாகன் (vahan.parivahan.gov.in) தளம் மூலம் வாகன பதிவு விவரங்கள் மற்றும் பெயர் மாற்றத்திற்கு விண்ணப்பிக்கலாம்.",
      simpleExplanation: "பழைய வாகனம் வாங்கிய 30 நாட்களுக்குள் படிவம் 29 மற்றும் 30 மூலம் உங்கள் பெயருக்கு மாற்ற வேண்டும். இல்லையெனில் பழைய உரிமையாளருக்கே சட்ட சிக்கல்கள் வரும்.",
      whyImportant: "வாகனத்தின் உண்மையான உரிமையாளர் நீங்கள் என்பதை நிரூபிக்கவும் விபத்து காப்பீடு பெறவும் இது கட்டாயம்.",
      steps: [
        "vahan.parivahan.gov.in தளத்திற்கு செல்லவும்.",
        "வாகன பதிவு எண்ணை உள்ளிட்டு 'Transfer of Ownership' தேர்வு செய்யவும்.",
        "வாங்குபவர் மற்றும் விற்பவர் விவரங்களை பதிவு செய்யவும்.",
        "படிவம் 29 மற்றும் 30 மற்றும் காப்பீட்டு ஆவணங்களை பதிவேற்றவும்.",
        "கட்டணம் செலுத்தி RTO அலுவலகத்தில் சரிபார்க்கவும்."
      ],
      documents: [
        "அசல் ஆர்.சி புத்தகம் (RC Book)",
        "படிவம் 29 மற்றும் 30 (விற்பவர் மற்றும் வாங்குபவர் கையொப்பம்)",
        "செல்லுபடியாகும் வாகன காப்பீடு (Insurance)",
        "புகை பரிசோதனை சான்றிதழ் (PUC)",
        "ஆதார் அட்டை"
      ],
      keywords: ["ஆர் சி", "RC", "பெயர் மாற்றம்", "வாகன பதிவு", "பைக் RC", "வாகன்", "RTO"]
    }
  },
  {
    id: "property_tax",
    category: "Revenue & Land",
    source: "State Municipal Administration & Urban Local Bodies",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Property Tax Assessment & Payment",
      question: "How can I assess and pay property or house tax online?",
      simpleMeaning: "You are asking how to pay the annual tax on your residential house, plot, or commercial building to the local panchayat or municipality.",
      answer: "Property tax is levied annually by local bodies (village panchayats, municipalities, or municipal corporations) for civic maintenance.",
      simpleExplanation: "Paying property tax generates a tax receipt which acts as undisputed evidence of property ownership and physical possession.",
      whyImportant: "Property tax receipts are required when applying for electricity connections, drinking water lines, bank home loans, and building permits.",
      steps: [
        "Go to your municipal corporation or state urban local bodies portal.",
        "Enter your Property Assessment Number / Door Number / Ward.",
        "Verify outstanding dues and property owner details.",
        "Pay via UPI, Debit Card, or Net Banking, or pay directly at the Village Panchayat office.",
        "Download and save the digital tax receipt."
      ],
      documents: [
        "Property Assessment Number / Old Tax Receipt",
        "Sale Deed / Patta copy (for new assessment)",
        "Approved building plan or electricity consumer number"
      ],
      keywords: ["property tax", "house tax", "panchayat tax", "municipal tax", "tax receipt", "building tax", "door tax"]
    },
    ta: {
      title: "சொத்து வரி மற்றும் வீட்டு வரி (Property Tax)",
      question: "வீட்டு வரி அல்லது சொத்து வரியை ஆன்லைனில் செலுத்துவது எப்படி?",
      simpleMeaning: "உங்கள் வீடு அல்லது காலி நிலத்திற்கு பஞ்சாயத்து அல்லது நகராட்சிக்கு ஆண்டு வரி செலுத்துவது எப்படி.",
      answer: "உள்ளாட்சி அமைப்புகள் (ஊராட்சி, நகராட்சி, மாநகராட்சி) மூலம் ஆண்டுதோறும் சொத்து வரி வசூலிக்கப்படுகிறது.",
      simpleExplanation: "வீட்டு வரி செலுத்துவதன் மூலம் வழங்கப்படும் ரசீது, அந்த வீடு உங்கள் வசம் உள்ளது என்பதற்கான மிக முக்கியமான சட்டப்பூர்வ ஆவணமாகும்.",
      whyImportant: "மின் இணைப்பு, குடிநீர் இணைப்பு மற்றும் வங்கிக் கடன் பெற வீட்டு வரி ரசீது கட்டாயம் தேவைப்படும்.",
      steps: [
        "உள்ளாட்சி இணையதளத்திற்கு செல்லவும் அல்லது ஊராட்சி அலுவலகத்திற்கு நேரில் செல்லவும்.",
        "சொத்து வரி மதிப்பீட்டு எண் (Assessment Number) உள்ளிடவும்.",
        "நிலுவைத் தொகையை சரிபார்த்து ஆன்லைனில் அல்லது அலுவலகத்தில் செலுத்தவும்.",
        "வரி செலுத்திய ரசீதை உடனடியாக பதிவிறக்கம் செய்து பத்திரப்படுத்தவும்."
      ],
      documents: [
        "முந்தைய ஆண்டு வீட்டு வரி ரசீது அல்லது மதிப்பீட்டு எண்",
        "பட்டா அல்லது கிரையப் பத்திர நகல்",
        "மின் இணைப்பு எண்"
      ],
      keywords: ["வீட்டு வரி", "சொத்து வரி", "பஞ்சாயத்து வரி", "நகராட்சி", "ரசீது", "வரி"]
    }
  },
  {
    id: "land_records",
    category: "Revenue & Land",
    source: "State Land Records Portal (Bhoomi / AnyRoR / e-Services)",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Land Records, Patta & Chitta",
      question: "How can I view digital land records, Patta, and FMB sketch?",
      simpleMeaning: "You are asking how to verify land ownership records and map sketches without visiting government offices.",
      answer: "Digital land records (Patta, Chitta, 7/12, RoR, and FMB sketches) can be viewed and downloaded for free from state revenue portals.",
      simpleExplanation: "Before buying land or applying for agricultural crop loans, checking digital land records guarantees the seller is the genuine titleholder with clear ownership.",
      whyImportant: "Protects citizens from land scams, property disputes, and boundary overlap problems.",
      steps: [
        "Visit your state land record portal (e.g., eservices.tn.gov.in for Patta Chitta).",
        "Select District, Taluk, Village, and Survey Number / Sub-division number.",
        "Verify owner name, land area, and soil classification (Nanjai/Punjai).",
        "Download the digitally signed copy of the Patta Chitta.",
        "Check FMB (Field Measurement Book) sketch for accurate boundary lines."
      ],
      documents: [
        "Survey Number and Sub-division Number",
        "District, Taluk, and Village name",
        "Patta Number (if known)"
      ],
      keywords: ["patta", "chitta", "land records", "survey number", "fmb", "bhoomi", "khasra", "khatauni", "land", "field sketch"]
    },
    ta: {
      title: "நில ஆவணங்கள் (பட்டா, சிட்டா மற்றும் எஃப்.எம்.பி)",
      question: "பட்டா சிட்டா மற்றும் நில வரைபடத்தை ஆன்லைனில் பார்ப்பது எப்படி?",
      simpleMeaning: "உங்கள் நிலத்தின் உரிமையாளர் யார் மற்றும் எல்லை வரைபடத்தை இணையத்தில் பார்ப்பது எப்படி.",
      answer: "மாநில அரசின் வருவாய்த் துறை இணையதளம் மூலம் பட்டா, சிட்டா மற்றும் புல வரைபடத்தை (FMB) இலவசமாக பதிவிறக்கலாம்.",
      simpleExplanation: "விவசாய நிலம் அல்லது வீட்டுமனை வாங்கும் முன், விற்பவரின் பெயரில் உண்மையாகவே பட்டா உள்ளதா என சரிபார்க்க இது மிக அவசியம்.",
      whyImportant: "நில மோசடிகள், இரட்டைப் பதிவு மற்றும் எல்லை தகராறுகளில் இருந்து உங்களை பாதுகாத்துக் கொள்ள இது உதவுகிறது.",
      steps: [
        "மாநில நில ஆவணங்கள் தளத்திற்கு (eservices.tn.gov.in) செல்லவும்.",
        "மாவட்டம், வட்டம், கிராமம் ஆகியவற்றைத் தேர்ந்தெடுக்கவும்.",
        "புல எண் (Survey No) மற்றும் உட்பிரிவு எண்ணை உள்ளிடவும்.",
        "உரிமையாளர் பெயர் மற்றும் நில பரப்பளவு விவரங்களை சரிபார்க்கவும்.",
        "டிஜிட்டல் கையொப்பமிட்ட பட்டா சிட்டா நகலை பதிவிறக்கம் செய்யவும்."
      ],
      documents: [
        "நிலத்தின் சர்வே எண் மற்றும் உட்பிரிவு எண்",
        "கிராமம் மற்றும் தாலுகா பெயர்",
        "பட்டா எண் (தெரிந்தால்)"
      ],
      keywords: ["பட்டா", "சிட்டா", "சர்வே எண்", "நில ஆவணம்", "புல வரைபடம்", "FMB", "நிலம்"]
    }
  },
  {
    id: "electricity_connection",
    category: "Utilities & Food",
    source: "State Electricity Distribution Corporation (DISCOM)",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "New Electricity Connection & Tariff Services",
      question: "How do I apply for a new domestic or agricultural electricity connection?",
      simpleMeaning: "You are asking how to get an electric power meter and power supply for your home, farm pump, or shop.",
      answer: "Applications for new low-tension (LT) domestic, commercial, or agricultural electricity connections can be submitted online via the state electricity board portal.",
      simpleExplanation: "Once submitted with ownership proof, Junior Engineers inspect the premises and install the power meter within 7 to 15 days.",
      whyImportant: "Access to safe and reliable grid power is essential for households, lighting, and farm irrigation pumps.",
      steps: [
        "Visit your State Power Distribution Corporation website (e.g., TANGEDCO).",
        "Click on 'Apply New LT Connection' and select tariff type (Domestic / Commercial / Agricultural).",
        "Upload property ownership document and latest property tax receipt.",
        "Licensed electrical wiring completion certificate must be enclosed.",
        "Pay security deposit and meter charges online; meter installation follows field inspection."
      ],
      documents: [
        "Proof of ownership (Sale deed or Patta) or Rental agreement with NOC",
        "Latest Property Tax / House Tax receipt",
        "Licensed Electrical Contractor Wiring Certificate",
        "Aadhaar Card of the applicant"
      ],
      keywords: ["electricity", "power connection", "current", "meter", "tangedco", "eb", "discom", "eb bill"]
    },
    ta: {
      title: "புதிய மின் இணைப்பு (Electricity Connection)",
      question: "வீட்டுக்கு அல்லது விவசாயத்திற்கு புதிய மின் இணைப்பு பெறுவது எப்படி?",
      simpleMeaning: "உங்கள் வீட்டிற்கு அல்லது கடைக்கு புதிய மின்சார மீட்டர் மற்றும் மின்சாரம் பெறுவது எப்படி.",
      answer: "மாநில மின்சார வாரிய இணையதளம் (எ.கா: TANGEDCO) மூலம் புதிய மின் இணைப்பிற்கு ஆன்லைனில் விண்ணப்பிக்கலாம்.",
      simpleExplanation: "விண்ணப்பித்த பின் மின்சார வாரிய உதவி பொறியாளர் இடத்தை நேரில் ஆய்வு செய்து பாதுகாப்பு விதிகளை உறுதி செய்த பின் மின் மீட்டர் பொருத்துவார்.",
      whyImportant: "வீட்டின் அடிப்படை வெளிச்சம் மற்றும் விவசாய பம்புசெட் இயக்க மின் இணைப்பு இன்றியமையாதது.",
      steps: [
        "மின்சார வாரிய இணையதளத்திற்கு சென்று 'புதிய மின் இணைப்பு' என்பதைத் தேர்ந்தெடுக்கவும்.",
        "வீட்டு மின்சாரம் அல்லது வணிக மின்சாரத்தைத் தேர்ந்தெடுக்கவும்.",
        "சொத்து உரிமை ஆவணம் மற்றும் வீட்டு வரி ரசீதை பதிவேற்றவும்.",
        "மின் வயரிங் ஒப்பந்ததாரர் சான்றிதழை இணைக்கவும்.",
        "வைப்புத் தொகை செலுத்திய பின் பொறியாளர் ஆய்வு செய்து மீட்டர் பொருத்துவார்."
      ],
      documents: [
        "சொத்து ஆவணம் (கிரைய பத்திரம் அல்லது பட்டா)",
        "சமீபத்திய வீட்டு வரி ரசீது",
        "அங்கீகரிக்கப்பட்ட மின் வயரிங் சான்றிதழ்",
        "ஆதார் அட்டை"
      ],
      keywords: ["மின்சாரம்", "மின் இணைப்பு", "EB", "மீட்டர்", "கரண்ட்", "TANGEDCO", "மின் கட்டணம்"]
    }
  },
  {
    id: "water_connection",
    category: "Utilities & Food",
    source: "Municipal Corporation / Jal Jeevan Mission / Water Board",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Drinking Water Tap Connection",
      question: "How can rural and urban households apply for piped drinking water?",
      simpleMeaning: "You are asking how to get clean government drinking water piped directly into your home.",
      answer: "Under the Jal Jeevan Mission (rural) and Municipal Water Boards (urban), households can apply for piped functional household drinking water tap connections.",
      simpleExplanation: "Water connections ensure safe, chlorinated drinking water to protect your family from water-borne diseases.",
      whyImportant: "Ensures clean drinking water and saves village women and families hours spent carrying water from distant borewells.",
      steps: [
        "For rural areas: Submit a request to the Village Panchayat Secretary under Jal Jeevan Mission.",
        "For urban areas: Apply on the local municipality or Metro Water portal.",
        "Submit property tax receipt and pipe route drawing.",
        "Pay pipeline connection and road restoration fee.",
        "Local plumbing team executes line connection from main supply."
      ],
      documents: [
        "Aadhaar Card",
        "Property Tax paid receipt",
        "Building ownership or rental agreement",
        "Nearest existing water line consumer number"
      ],
      keywords: ["water", "drinking water", "water connection", "tap", "jal jeevan", "metro water", "pipeline"]
    },
    ta: {
      title: "குடிநீர் குழாய் இணைப்பு (Drinking Water Connection)",
      question: "வீட்டுக்கு பாதுகாப்பான குடிநீர் இணைப்பு பெறுவது எப்படி?",
      simpleMeaning: "உங்கள் வீட்டிற்கு அரசு குழாய் குடிநீர் இணைப்பு பெறுவது எப்படி என கேட்கிறீர்கள்.",
      answer: "கிராமங்களில் ஜல் ஜீவன் இயக்கம் மூலமும், நகராட்சிகளில் குடிநீர் வடிகால் வாரியம் மூலமும் குடிநீர் இணைப்பு வழங்கப்படுகிறது.",
      simpleExplanation: "தூய்மையான குடிநீர் வீட்டிற்கே வருவதால் நீர் மூலம் பரவும் நோய்களிலிருந்து குடும்பத்தைப் பாதுகாக்கலாம் மற்றும் தூரம் சென்று தண்ணீர் பிடிக்கும் சிரமம் குறைகிறது.",
      whyImportant: "குடும்பத்தின் சுகாதாரத்திற்கும் பாதுகாப்பான குடிநீர் வசதிக்கும் இது மிக அவசியம்.",
      steps: [
        "கிராமங்களில் ஊராட்சி மன்ற செயலாளரிடம் ஜல் ஜீவன் திட்டத்தின் கீழ் விண்ணப்பிக்கவும்.",
        "நகராட்சிகளில் குடிநீர் வாரிய இணையதளம் மூலம் விண்ணப்பிக்கவும்.",
        "வீட்டு வரி ரசீது மற்றும் கட்டிட ஆவணங்களை இணைக்கவும்.",
        "இணைப்பு கட்டணம் மற்றும் சாலை சீரமைப்பு கட்டணம் செலுத்தவும்.",
        "ஊராட்சி அல்லது நகராட்சி பணியாளர்கள் குழாய் இணைப்பை அமைப்பார்கள்."
      ],
      documents: [
        "ஆதார் அட்டை",
        "வீட்டு வரி செலுத்திய ரசீது",
        "வீட்டு உரிமை ஆவணம்",
        "அருகிலுள்ள குடிநீர் குழாய் நுகர்வோர் எண்"
      ],
      keywords: ["குடிநீர்", "தண்ணீர்", "குழாய் இணைப்பு", "ஜல் ஜீவன்", "வாட்டர்", "பஞ்சாயத்து தண்ணீர்"]
    }
  },
  {
    id: "gas_connection",
    category: "Utilities & Food",
    source: "Pradhan Mantri Ujjwala Yojana (PMUY) & Oil Marketing Companies",
    sourceUrl: "https://www.pmuy.gov.in",
    en: {
      title: "LPG Gas Connection (PM Ujjwala Yojana)",
      question: "How can women from low-income families get a free LPG cooking gas connection?",
      simpleMeaning: "You are asking how poor rural households can get a gas stove and cylinder without paying advance security deposits.",
      answer: "Under PM Ujjwala Yojana (PMUY), adult women from poor households receive a deposit-free LPG gas connection with first cylinder and stove free.",
      simpleExplanation: "Cooking with LPG replaces hazardous firewood and smoke, protecting rural mothers and children from lung infections and respiratory illnesses.",
      whyImportant: "Guarantees clean cooking fuel, smoke-free health, and saves time spent collecting firewood.",
      steps: [
        "Visit your nearest LPG distributor (Indane, Bharatgas, or HP Gas) or apply on pmuy.gov.in.",
        "Submit applicant's Aadhaar and Ration card showing adult women in the household.",
        "Provide Aadhaar-linked bank account details for subsidy credits.",
        "Distributor verifies that the household does not already have an active LPG connection.",
        "Collect stove, regulator, safety hose, and filled cylinder."
      ],
      documents: [
        "Aadhaar Card of applicant and adult family members",
        "Ration Card proving family composition",
        "Bank Passbook (Aadhaar linked)",
        "Recent passport size photo"
      ],
      keywords: ["gas", "lpg", "cylinder", "ujjwala", "pmuy", "cooking gas", "gas connection", "stove"]
    },
    ta: {
      title: "இலவச எரிவாயு இணைப்பு (உஜ்வாலா திட்டம் - PMUY)",
      question: "பிரதமர் உஜ்வாலா திட்டம் மூலம் இலவச கேஸ் இணைப்பு பெறுவது எப்படி?",
      simpleMeaning: "ஏழை குடும்பத்துப் பெண்கள் இலவசமாக சமையல் எரிவாயு சிலிண்டர் மற்றும் அடுப்பு பெறுவது எப்படி.",
      answer: "பிரதம மந்திரி உஜ்வாலா திட்டம் (PMUY) மூலம் ஏழை குடும்பப் பெண்களுக்கு வைப்புத்தொகை இல்லா இலவச எரிவாயு இணைப்பு வழங்கப்படுகிறது.",
      simpleExplanation: "விறகு அடுப்பு புகையினால் ஏற்படும் நுரையீரல் நோய்களிலிருந்து பெண்களைக் காக்கவும் சுத்தமான சமையல் சூழலை உருவாக்கவும் இலவச சிலிண்டர் மற்றும் அடுப்பு வழங்கப்படுகிறது.",
      whyImportant: "பெண்களின் உடல் ஆரோக்கியம், சுத்தமான சமையல் மற்றும் புகையற்ற வீட்டை உறுதி செய்கிறது.",
      steps: [
        "அருகிலுள்ள கேஸ் ஏஜென்சி (Indane, Bharatgas, HP) அல்லது pmuy.gov.in இணையதளத்திற்கு செல்லவும்.",
        "குடும்ப பெண் உறுப்பினரின் பெயரில் விண்ணப்பத்தை சமர்ப்பிக்கவும்.",
        "குடும்ப அட்டை மற்றும் ஆதார் அட்டையை இணைக்கவும்.",
        "மானியத்திற்கு ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு விவரங்களை கொடுக்கவும்.",
        "இலவச எரிவாயு அடுப்பு, சிலிண்டர் மற்றும் ஒழுங்குபடுத்தியைப் பெற்றுக் கொள்ளலாம்."
      ],
      documents: [
        "விண்ணப்பதாரர் மற்றும் குடும்பத்தினரின் ஆதார் அட்டை",
        "குடும்ப அட்டை (ரேஷன் கார்டு)",
        "வங்கி கணக்கு புத்தகம் (ஆதார் இணைக்கப்பட்டது)",
        "புகைப்படம்"
      ],
      keywords: ["கேஸ்", "சிலிண்டர்", "எரிவாயு", "உஜ்வாலா", "PMUY", "இலவச கேஸ்", "சமையல் எரிவாயு"]
    }
  },
  {
    id: "business_registration",
    category: "Business",
    source: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    sourceUrl: "https://udyamregistration.gov.in",
    en: {
      title: "Udyam MSME Business Registration",
      question: "How can small village shop owners and entrepreneurs register a business for free?",
      simpleMeaning: "You are asking how to get a government certificate for your small shop, tailoring unit, workshop, or cottage business.",
      answer: "Small businesses can register for free on the official Udyam Registration portal without uploading physical documents.",
      simpleExplanation: "Udyam registration gives your enterprise an official certificate, makes you eligible for priority bank loans without collateral (Mudra loans), and protects against delayed payments.",
      whyImportant: "Enables small village entrepreneurs to access government subsidies, tax benefits, and formal bank loans.",
      steps: [
        "Visit the official free portal: udyamregistration.gov.in (Beware of fake private paid sites).",
        "Click 'For New Entrepreneurs who are not Registered yet as MSME'.",
        "Enter entrepreneur's 12-digit Aadhaar number and verify via OTP.",
        "Fill in business name, bank account, activity type (Manufacturing/Service), and investment amount.",
        "Instantly download your permanent Udyam Registration Certificate with QR Code."
      ],
      documents: [
        "Aadhaar Card of the proprietor",
        "PAN Card (for enterprises registered with income tax)",
        "Business Bank Account details"
      ],
      keywords: ["udyam", "msme", "business", "small business", "mudra", "shop registration", "enterprise", "start business"]
    },
    ta: {
      title: "உத்யம் சிறுதொழில் பதிவு (MSME Udyam Registration)",
      question: "சிறிய கடை அல்லது தொழிலை இலவசமாக அரசு அங்கீகாரத்துடன் பதிவு செய்வது எப்படி?",
      simpleMeaning: "உங்கள் மளிகைக் கடை, தையல் கூடம், ஒர்க்ஷாப் போன்ற தொழில்களுக்கு அரசு பதிவு சான்றிதழ் பெறுவது எப்படி.",
      answer: "மத்திய அரசின் உத்யம் (udyamregistration.gov.in) தளம் மூலம் சிறு, குறு தொழில்களை எந்த கட்டணமும் இன்றி இலவசமாக பதிவு செய்யலாம்.",
      simpleExplanation: "உத்யம் பதிவு செய்வதன் மூலம் வங்கிகளில் பிணையமில்லா முத்ரா கடன் (Mudra loan), அரசு மானியங்கள் மற்றும் குறைந்த வட்டியில் தொழில்கடன் எளிதாகக் கிடைக்கும்.",
      whyImportant: "சிறுதொழில் செய்பவர்கள் வங்கி கடனுதவி மற்றும் அரசு மானியங்களைப் பெற இந்த பதிவு சான்றிதழ் அவசியம்.",
      steps: [
        "அதிகாரப்பூர்வ தளத்திற்கு செல்லவும்: udyamregistration.gov.in (இது முற்றிலும் இலவசம்).",
        "தொழில் முனைவோரின் ஆதார் எண்ணை உள்ளிட்டு OTP மூலம் சரிபார்க்கவும்.",
        "கடையின் பெயர், முகவரி, தொழில் வகை மற்றும் முதலீட்டுத் தொகையை உள்ளிடவும்.",
        "வங்கி கணக்கு விவரங்களை பதிவு செய்யவும்.",
        "QR குறியீட்டுடன் கூடிய உத்யம் சான்றிதழை உடனடியாக பதிவிறக்கம் செய்து கொள்ளலாம்."
      ],
      documents: [
        "தொழில் உரிமையாளரின் ஆதார் அட்டை",
        "பான் அட்டை (PAN Card)",
        "தொழில் வங்கி கணக்கு விவரங்கள்"
      ],
      keywords: ["உத்யம்", "MSME", "சிறு தொழில்", "வியாபாரம்", "முத்ரா கடன்", "கடை பதிவு", "தொழில் சான்றிதழ்"]
    }
  },
  {
    id: "trade_licence",
    category: "Business",
    source: "Municipal Administration & Urban Local Bodies",
    sourceUrl: "https://www.india.gov.in",
    en: {
      title: "Trade Licence",
      question: "How do I get a Trade Licence to run a commercial shop or factory?",
      simpleMeaning: "You are asking how to get official municipal permission to operate a shop, hotel, or workshop legally.",
      answer: "A Trade Licence is permission granted by the local municipal body or corporation to conduct a specific trade or business without health hazards.",
      simpleExplanation: "Running a commercial enterprise without a trade licence can result in shop closure and penalties by health and municipal inspectors.",
      whyImportant: "Guarantees public safety, ethical business operations, and prevents municipal legal action.",
      steps: [
        "Apply through the local municipality or Corporation citizen portal.",
        "Submit property rental deed or ownership tax receipt.",
        "Fire and Safety NOC or Food Safety (FSSAI) registration if running eateries.",
        "Municipal Health Inspector inspects the shop for sanitation compliance.",
        "Pay prescribed municipal trade fees and obtain the certificate."
      ],
      documents: [
        "Aadhaar Card and PAN of the applicant",
        "Rental agreement or property tax receipt of the shop premises",
        "FSSAI certificate (for food businesses)",
        "NOC from fire and pollution boards (for manufacturing units)"
      ],
      keywords: ["trade licence", "shop licence", "trade license", "hotel licence", "municipality licence", "commercial permit"]
    },
    ta: {
      title: "வணிக உரிமம் (Trade Licence)",
      question: "கடை அல்லது வணிகம் நடத்த வணிக உரிமம் பெறுவது எப்படி?",
      simpleMeaning: "நகராட்சி அல்லது பஞ்சாயத்தில் சட்டப்பூர்வமாக கடை நடத்த அனுமதி பெறுவது எப்படி.",
      answer: "நகராட்சி அல்லது மாநகராட்சி மூலம் பொதுமக்களுக்கு இடையூறு இன்றி தொழில் நடத்த வணிக உரிமம் (Trade Licence) வழங்கப்படுகிறது.",
      simpleExplanation: "உரிமம் இல்லாமல் கடை நடத்தினால் நகராட்சி அதிகாரிகளால் அபராதம் விதிக்கப்படலாம். உணவு விடுதிகள் உணவுப் பாதுகாப்பு (FSSAI) அனுமதியும் பெற வேண்டும்.",
      whyImportant: "சட்டப்பூர்வமாகவும் பாதுகாப்பாகவும் தொழில் நடத்த உள்ளாட்சி நிர்வாகத்தின் அனுமதி மிக முக்கியமாகும்.",
      steps: [
        "உள்ளாட்சி அல்லது மாநகராட்சி இணையதளத்தில் விண்ணப்பிக்கவும்.",
        "கடை வாடகை ஒப்பந்தம் அல்லது சொத்து வரி ரசீதை இணைக்கவும்.",
        "உணவுப் பொருட்கள் எனில் FSSAI சான்றிதழை சமர்ப்பிக்கவும்.",
        "சுகாதார ஆய்வாளர் கடையை நேரில் வந்து ஆய்வு செய்வார்.",
        "குறிப்பிட்ட கட்டணத்தை செலுத்தி வணிக உரிம சான்றிதழைப் பெற்றுக்கொள்ளவும்."
      ],
      documents: [
        "ஆதார் அட்டை மற்றும் பான் அட்டை",
        "கடை வாடகை ஒப்பந்தம் அல்லது வீட்டு வரி ரசீது",
        "உணவு பாதுகாப்பு சான்றிதழ் (FSSAI - உணவகங்களுக்கு)",
        "புகைப்படம்"
      ],
      keywords: ["வணிக உரிமம்", "டிரேட் லைசென்ஸ்", "கடை உரிமம்", "நகராட்சி அனுமதி", "FSSAI", "வியாபார அனுமதி"]
    }
  },
  {
    id: "grievance_registration",
    category: "Grievances",
    source: "Central & State Public Grievance Portals (CPGRAMS / CM Cell)",
    sourceUrl: "https://pgportal.gov.in",
    en: {
      title: "Government Grievance Redressal (CPGRAMS / CM Cell)",
      question: "How can I register a complaint against government services or corrupt officials?",
      simpleMeaning: "You are asking how a citizen can lodge a formal grievance to higher government authorities when village officials do not take action.",
      answer: "Citizens can register complaints directly with the Prime Minister's Office or Chief Minister's Special Cell through CPGRAMS (pgportal.gov.in) or state helpline numbers.",
      simpleExplanation: "Once registered, an enquiry officer is appointed, a tracking registration number is provided, and the concerned department is mandated to resolve your grievance within 30 days.",
      whyImportant: "Empowers citizens against bureaucratic negligence, bribes, broken infrastructure, or delayed certificates.",
      steps: [
        "Go to pgportal.gov.in (for Central complaints) or your State CM Cell portal (e.g., cmcell.tn.gov.in).",
        "Click on 'Lodge Public Grievance' and register your mobile number.",
        "Select the relevant ministry or department (e.g., Revenue, Police, Electricity, Roads).",
        "Describe your problem in plain language and upload supporting proofs or photos.",
        "Submit to receive a unique Grievance Tracking Number for status monitoring."
      ],
      documents: [
        "Complainant's Aadhaar or contact details",
        "Copies of earlier unaddressed petitions or reference numbers",
        "Photographs or supporting evidence of the grievance"
      ],
      keywords: ["grievance", "complaint", "cm cell", "cpgrams", "pgportal", "corruption", "petition", "officer complaint"]
    },
    ta: {
      title: "அரசு குறைதீர்ப்பு மற்றும் புகார் பதிவு (CPGRAMS / CM Cell)",
      question: "அரசு அதிகாரிகள் நடவடிக்கை எடுக்காத போது புகார் அல்லது மனு அளிப்பது எப்படி?",
      simpleMeaning: "அரசு சேவைகள் கிடைக்காத போது அல்லது அதிகாரிகள் தாமதிக்கும் போது முதல்வரின் தனிப்பிரிவுக்கு புகார் அளிப்பது எப்படி.",
      answer: "மத்திய அரசின் CPGRAMS (pgportal.gov.in) அல்லது மாநில முதல்வரின் தனிப்பிரிவு (CM Cell) மூலம் பொதுமக்கள் நேரடியாக புகார் அளிக்கலாம்.",
      simpleExplanation: "புகார் பதிவு செய்தவுடன் ஒரு கண்காணிப்பு எண் வழங்கப்படும். குறிப்பிட்ட அதிகாரிக்கு உத்தரவிடப்பட்டு 30 நாட்களுக்குள் உங்கள் பிரச்சனைக்கு தீர்வு காணப்படும்.",
      whyImportant: "அரசு ஊழியர்களின் அலட்சியம், லஞ்சம் அல்லது தீர்க்கப்படாத பிரச்சனைகளுக்கு மேல்முறையீடு செய்ய இது சிறந்த வழியமைப்பாகும்.",
      steps: [
        "pgportal.gov.in அல்லது மாநில முதல்வரின் தனிப்பிரிவு இணையதளத்திற்கு செல்லவும்.",
        "உங்கள் மொபைல் எண்ணை உள்ளிட்டு பதிவு செய்யவும்.",
        "சம்பந்தப்பட்ட துறை (வருவாய்த்துறை, மின்சாரம், குடிநீர், காவல்துறை) தேர்ந்தெடுக்கவும்.",
        "உங்கள் புகாரை எளிய தமிழில் எழுதி, ஆதார ஆவணங்கள் இருந்தால் இணைக்கவும்.",
        "மனுவை சமர்ப்பித்து புகார் கண்காணிப்பு எண்ணைப் (Tracking ID) பெற்றுக்கொள்ளவும்."
      ],
      documents: [
        "மனுதாரரின் ஆதார் அட்டை மற்றும் மொபைல் எண்",
        "முந்தைய மனுக்கள் அல்லது விண்ணப்பங்களின் நகல்",
        "புகார் தொடர்பான புகைப்படங்கள் அல்லது ஆதாரங்கள்"
      ],
      keywords: ["புகார்", "மனு", "முதல்வர் தனிப்பிரிவு", "CPGRAMS", "குறைதீர்ப்பு", "அதிகாரி புகார்", "CM Cell"]
    }
  }
];

// ==========================================
// 3. SAMPLE APPLICATION STATUS DATABASE (DEMO)
// ==========================================
const mockApplicationStatusDB = {
  "APP1001": {
    appNumber: "APP1001",
    serviceEn: "Income Certificate",
    serviceTa: "வருமானச் சான்றிதழ்",
    applicantEn: "Ramasamy M.",
    applicantTa: "ராமசாமி மு.",
    submissionDate: "2026-09-20",
    statusEn: "Under Verification",
    statusTa: "சரிபார்ப்பில் உள்ளது",
    statusClass: "status-pending",
    expectedCompletionEn: "7 working days",
    expectedCompletionTa: "7 வேலை நாட்கள்",
    actionRequiredEn: "Village Administrative Officer (VAO) field visit scheduled for tomorrow.",
    actionRequiredTa: "கிராம நிர்வாக அலுவலர் (VAO) நாளை நேரில் ஆய்வு செய்ய உள்ளார்."
  },
  "APP1002": {
    appNumber: "APP1002",
    serviceEn: "Birth Certificate",
    serviceTa: "பிறப்புச் சான்றிதழ்",
    applicantEn: "Kavitha S.",
    applicantTa: "கவிதா சு.",
    submissionDate: "2026-09-12",
    statusEn: "Approved",
    statusTa: "ஒப்புதல் அளிக்கப்பட்டது",
    statusClass: "status-approved",
    expectedCompletionEn: "Completed",
    expectedCompletionTa: "முழுமை பெற்றது",
    actionRequiredEn: "Digitally signed certificate is ready. Download from your nearest e-Seva centre.",
    actionRequiredTa: "டிஜிட்டல் கையொப்பமிட்ட சான்றிதழ் தயாராக உள்ளது. இ-சேவை மையத்தில் பெற்றுக்கொள்ளலாம்."
  },
  "APP1003": {
    appNumber: "APP1003",
    serviceEn: "Community Certificate",
    serviceTa: "சாதிச் சான்றிதழ்",
    applicantEn: "Murugan K.",
    applicantTa: "முருகன் கு.",
    submissionDate: "2026-09-18",
    statusEn: "Additional Document Required",
    statusTa: "கூடுதல் ஆவணம் தேவை",
    statusClass: "status-action",
    expectedCompletionEn: "Pending Document Submission",
    expectedCompletionTa: "ஆவணம் சமர்ப்பிக்கும் வரை நிலுவை",
    actionRequiredEn: "Please submit father's school Transfer Certificate (TC) copy at the Taluk Office.",
    actionRequiredTa: "தந்தையின் பள்ளி மாற்றுச் சான்றிதழ் (TC) நகலை வட்டாட்சியர் அலுவலகத்தில் சமர்ப்பிக்கவும்."
  }
};

// ==========================================
// 4. SPEECH RECOGNITION (WEB SPEECH API)
// ==========================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition = null;

function setupSpeechRecognition() {
  const micBtn = document.getElementById("micBtn");
  const micStatus = document.getElementById("micStatusText");
  const pipelineBar = document.getElementById("pipelineBar");

  if (!SpeechRecognition) {
    if (micStatus) {
      micStatus.textContent = translations[currentLanguage].speechNotSupported;
      micStatus.className = "mic-status-text status-error";
    }
    if (micBtn) {
      micBtn.classList.add("disabled");
      micBtn.setAttribute("title", translations[currentLanguage].speechNotSupported);
    }
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Language setup according to current state
  recognition.lang = currentLanguage === 'ta' ? 'ta-IN' : 'en-IN';

  recognition.onstart = function () {
    isListening = true;
    updateMicVisualState('listening');
    updatePipeline('listening');
    if (micStatus) {
      micStatus.textContent = translations[currentLanguage].listeningStatus;
      micStatus.className = "mic-status-text status-listening";
    }
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    updatePipeline('transcribing');

    setTimeout(() => {
      updatePipeline('understanding');
      const questionInput = document.getElementById("questionInput");
      if (questionInput) {
        questionInput.value = transcript;
      }

      setTimeout(() => {
        updatePipeline('fetching');
        processUserQuestion(transcript, true);
      }, 400);
    }, 400);
  };

  recognition.onerror = function (event) {
    isListening = false;
    updateMicVisualState('ready');
    updatePipeline('ready');
    if (micStatus) {
      micStatus.textContent = translations[currentLanguage].errorStatus + " (" + (event.error || "unknown") + ")";
      micStatus.className = "mic-status-text status-error";
    }
  };

  recognition.onend = function () {
    isListening = false;
    updateMicVisualState('ready');
  };
}

function toggleListening() {
  if (!SpeechRecognition) {
    alert(translations[currentLanguage].speechNotSupported);
    return;
  }

  if (isListening) {
    if (recognition) {
      recognition.stop();
    }
  } else {
    // Stop any ongoing speech synthesis first
    stopSpeechSynthesis();

    if (recognition) {
      recognition.lang = currentLanguage === 'ta' ? 'ta-IN' : 'en-IN';
      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition already active:", e);
      }
    }
  }
}

function updateMicVisualState(state) {
  const micBtn = document.getElementById("micBtn");
  const micBtnText = document.getElementById("micBtnText");
  if (!micBtn) return;

  micBtn.classList.remove("state-ready", "state-listening", "state-processing", "state-error");

  if (state === 'listening') {
    micBtn.classList.add("state-listening");
    if (micBtnText) micBtnText.textContent = translations[currentLanguage].btnStopSpeaking;
    micBtn.setAttribute("aria-pressed", "true");
  } else if (state === 'processing') {
    micBtn.classList.add("state-processing");
    if (micBtnText) micBtnText.textContent = translations[currentLanguage].processingStatus;
    micBtn.setAttribute("aria-pressed", "false");
  } else {
    micBtn.classList.add("state-ready");
    if (micBtnText) micBtnText.textContent = translations[currentLanguage].btnStartSpeaking;
    micBtn.setAttribute("aria-pressed", "false");
  }
}

function updatePipeline(activeStep) {
  const steps = ["listening", "transcribing", "understanding", "fetching", "responding"];
  steps.forEach(step => {
    const el = document.getElementById("pipe-" + step);
    if (el) {
      if (step === activeStep) {
        el.className = "pipeline-step step-active";
      } else if (steps.indexOf(step) < steps.indexOf(activeStep)) {
        el.className = "pipeline-step step-done";
      } else {
        el.className = "pipeline-step";
      }
    }
  });

  if (activeStep === 'ready') {
    steps.forEach(step => {
      const el = document.getElementById("pipe-" + step);
      if (el) el.className = "pipeline-step";
    });
  }
}

// ==========================================
// 5. TEXT-TO-SPEECH (SPEECH SYNTHESIS)
// ==========================================
function playAnswerVoice() {
  if (!window.speechSynthesis) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  stopSpeechSynthesis();

  if (!activeService) return;

  const content = currentLanguage === 'ta' ? activeService.ta : activeService.en;
  const textToRead = `${content.title}. ${content.answer}. ${content.simpleExplanation}`;

  currentUtterance = new SpeechSynthesisUtterance(textToRead);
  currentUtterance.lang = currentLanguage === 'ta' ? 'ta-IN' : 'en-IN';
  currentUtterance.rate = 0.95; // Slightly slower for clarity in village contexts

  const playBtn = document.getElementById("btnPlayVoice");
  const stopBtn = document.getElementById("btnStopVoice");

  currentUtterance.onstart = function () {
    if (playBtn) playBtn.classList.add("speaking-now");
    if (stopBtn) stopBtn.style.display = "inline-flex";
  };

  currentUtterance.onend = function () {
    if (playBtn) playBtn.classList.remove("speaking-now");
    if (stopBtn) stopBtn.style.display = "none";
  };

  currentUtterance.onerror = function () {
    if (playBtn) playBtn.classList.remove("speaking-now");
    if (stopBtn) stopBtn.style.display = "none";
  };

  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeechSynthesis() {
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  const playBtn = document.getElementById("btnPlayVoice");
  const stopBtn = document.getElementById("btnStopVoice");
  if (playBtn) playBtn.classList.remove("speaking-now");
  if (stopBtn) stopBtn.style.display = "none";
}

// ==========================================
// 6. QUESTION MATCHING AND SEARCH LOGIC
// ==========================================
function findServiceByQuery(rawQuery) {
  if (!rawQuery || rawQuery.trim() === "") return null;
  const q = rawQuery.toLowerCase().trim();

  // Score based matching
  let bestMatch = null;
  let highestScore = 0;

  for (const item of governmentServicesDB) {
    let score = 0;

    // Check English keywords
    for (const kw of item.en.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    // Check Tamil keywords
    for (const kw of item.ta.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    // Check title in English & Tamil
    if (q.includes(item.en.title.toLowerCase()) || q.includes(item.ta.title.toLowerCase())) {
      score += 4;
    }

    // Check if query is directly in question
    if (q.includes(item.en.question.toLowerCase()) || q.includes(item.ta.question.toLowerCase())) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If score is at least 1, we return it
  if (highestScore > 0) {
    return bestMatch;
  }

  // Secondary Fallback for common keywords
  const keywordMap = [
    { keys: ["income", "வருமானம்", "tahsildar"], id: "income_certificate" },
    { keys: ["birth", "பிறப்பு", "baby"], id: "birth_certificate" },
    { keys: ["scholarship", "உதவித்தொகை", "கல்வி உதவி"], id: "scholarships" },
    { keys: ["licence", "license", "உரிமம்", "டிரைவிங்"], id: "driving_licence" },
    { keys: ["grievance", "புகார்", "மனு", "complaint"], id: "grievance_registration" },
    { keys: ["aadhaar", "ஆதார்", "adhar"], id: "aadhaar" },
    { keys: ["voter", "வாக்காளர்", "vote"], id: "voter_id" },
    { keys: ["pension", "ஓய்வூதியம்", "முதியோர்"], id: "old_age_pension" },
    { keys: ["ration", "ரேஷன்", "குடும்ப அட்டை"], id: "ration_card" },
    { keys: ["patta", "பட்டா", "சிட்டா"], id: "land_records" },
    { keys: ["health", "மருத்துவம்", "காப்பீடு", "ayushman"], id: "health_schemes" },
    { keys: ["electricity", "மின்சாரம்", "கரண்ட்"], id: "electricity_connection" },
    { keys: ["water", "குடிநீர்", "தண்ணீர்"], id: "water_connection" },
    { keys: ["gas", "கேஸ்", "சிலிண்டர்"], id: "gas_connection" },
    { keys: ["business", "தொழில்", "உத்யம்", "msme"], id: "business_registration" },
    { keys: ["job", "வேலை", "employment"], id: "employment_portals" },
    { keys: ["tax", "வரி", "வீட்டு வரி"], id: "property_tax" }
  ];

  for (const mapping of keywordMap) {
    for (const k of mapping.keys) {
      if (q.includes(k)) {
        return governmentServicesDB.find(s => s.id === mapping.id);
      }
    }
  }

  return null;
}

function processUserQuestion(questionText, fromVoice = false) {
  const micStatus = document.getElementById("micStatusText");
  const resultCard = document.getElementById("explanationPanel");
  const noResultBox = document.getElementById("noResultBox");

  const matched = findServiceByQuery(questionText);

  updatePipeline('responding');

  if (matched) {
    activeService = matched;
    renderServiceExplanation(matched, questionText);
    if (resultCard) {
      resultCard.style.display = "block";
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (noResultBox) noResultBox.style.display = "none";

    if (micStatus && fromVoice) {
      micStatus.textContent = currentLanguage === 'ta' ? "பதில் பெறப்பட்டது. கீழே பார்க்கவும்." : "Answer found. See details below.";
      micStatus.className = "mic-status-text status-success";
    }
  } else {
    activeService = null;
    if (resultCard) resultCard.style.display = "none";
    if (noResultBox) {
      noResultBox.style.display = "block";
      noResultBox.textContent = translations[currentLanguage].noMatchFound;
    }
    if (micStatus && fromVoice) {
      micStatus.textContent = translations[currentLanguage].noMatchFound;
      micStatus.className = "mic-status-text status-error";
    }
  }
}

function renderServiceExplanation(service, customQuestion) {
  if (!service) return;

  const content = currentLanguage === 'ta' ? service.ta : service.en;
  const otherContent = currentLanguage === 'ta' ? service.en : service.ta;

  // Set elements
  const elUserQuestion = document.getElementById("panelUserQuestion");
  const elMeaning = document.getElementById("panelMeaning");
  const elServiceTitle = document.getElementById("panelServiceTitle");
  const elShortAnswer = document.getElementById("panelAnswer");
  const elExplanation = document.getElementById("panelExplanation");
  const elWhyImportant = document.getElementById("panelWhyImportant");
  const elStepsList = document.getElementById("panelStepsList");
  const elDocsList = document.getElementById("panelDocsList");
  const elSource = document.getElementById("panelSource");
  const elSourceUrl = document.getElementById("panelSourceUrl");
  const elBilingualNote = document.getElementById("panelBilingualNote");

  if (elUserQuestion) {
    elUserQuestion.textContent = customQuestion ? `"${customQuestion}"` : `"${content.question}"`;
  }
  if (elMeaning) elMeaning.textContent = content.simpleMeaning;
  if (elServiceTitle) elServiceTitle.textContent = content.title;
  if (elShortAnswer) elShortAnswer.textContent = content.answer;
  if (elExplanation) elExplanation.textContent = content.simpleExplanation;
  if (elWhyImportant) elWhyImportant.textContent = content.whyImportant;

  if (elStepsList) {
    elStepsList.innerHTML = "";
    content.steps.forEach((step, idx) => {
      const li = document.createElement("li");
      li.textContent = step;
      elStepsList.appendChild(li);
    });
  }

  if (elDocsList) {
    elDocsList.innerHTML = "";
    content.documents.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc;
      elDocsList.appendChild(li);
    });
  }

  if (elSource) elSource.textContent = service.source;
  if (elSourceUrl) {
    if (service.sourceUrl) {
      elSourceUrl.href = service.sourceUrl;
      elSourceUrl.textContent = service.sourceUrl;
      elSourceUrl.style.display = "inline";
    } else {
      elSourceUrl.style.display = "none";
    }
  }

  // Dual language supplementary explanation box
  if (elBilingualNote) {
    elBilingualNote.textContent = currentLanguage === 'ta'
      ? `English Summary: ${otherContent.simpleExplanation}`
      : `தமிழ் விளக்கம்: ${otherContent.simpleExplanation}`;
  }
}

function showPopularService(serviceId) {
  const service = governmentServicesDB.find(s => s.id === serviceId);
  if (service) {
    activeService = service;
    const questionInput = document.getElementById("questionInput");
    if (questionInput) {
      questionInput.value = currentLanguage === 'ta' ? service.ta.question : service.en.question;
    }
    renderServiceExplanation(service);
    const resultCard = document.getElementById("explanationPanel");
    if (resultCard) {
      resultCard.style.display = "block";
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const noResultBox = document.getElementById("noResultBox");
    if (noResultBox) noResultBox.style.display = "none";
  }
}

function handleAskButtonClick() {
  const input = document.getElementById("questionInput");
  if (!input) return;
  const q = input.value.trim();
  if (q === "") {
    alert(currentLanguage === 'ta' ? "தயவுசெய்து ஒரு கேள்வியை உள்ளிடவும்." : "Please type a question.");
    input.focus();
    return;
  }
  processUserQuestion(q, false);
}

function clearQuestionInput() {
  const input = document.getElementById("questionInput");
  if (input) input.value = "";
  const noResultBox = document.getElementById("noResultBox");
  if (noResultBox) noResultBox.style.display = "none";
  updatePipeline('ready');
  const micStatus = document.getElementById("micStatusText");
  if (micStatus) {
    micStatus.textContent = translations[currentLanguage].readyStatus;
    micStatus.className = "mic-status-text";
  }
}

function scrollToSteps() {
  const stepsContainer = document.getElementById("stepsContainer");
  if (stepsContainer) {
    stepsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    stepsContainer.classList.add("highlight-box");
    setTimeout(() => {
      stepsContainer.classList.remove("highlight-box");
    }, 2000);
  }
}

// ==========================================
// 7. LANGUAGE SWITCHING ENGINE
// ==========================================
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('flowcode_lang', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Toggle button active states
  const btnEn = document.getElementById("langEnBtn");
  const btnTa = document.getElementById("langTaBtn");
  if (btnEn && btnTa) {
    if (lang === 'en') {
      btnEn.classList.add("active");
      btnTa.classList.remove("active");
    } else {
      btnTa.classList.add("active");
      btnEn.classList.remove("active");
    }
  }

  // Update all elements with data-i18n attributes
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update placeholders
  const placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");
  placeholderEls.forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });

  // Update speech recognition language
  if (recognition) {
    recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
  }

  // Update active service view if open
  if (activeService) {
    renderServiceExplanation(activeService);
  }

  // Update sample question buttons if on home page
  updateSampleQuestionsUI();

  // If on services.html, re-render services grid
  if (typeof renderAllServicesGrid === 'function') {
    renderAllServicesGrid();
  }
}

function updateSampleQuestionsUI() {
  const container = document.getElementById("sampleQuestionsList");
  if (!container) return;

  const samples = [
    { en: "How can I apply for an income certificate?", ta: "வருமான சான்றிதழ் பெறுவது எப்படி?", id: "income_certificate" },
    { en: "What documents are needed for a birth certificate?", ta: "பிறப்பு சான்றிதழுக்கு தேவையான ஆவணங்கள் என்ன?", id: "birth_certificate" },
    { en: "How can I check my application status?", ta: "விண்ணப்ப நிலையை எவ்வாறு சரிபார்ப்பது?", id: "status_redirect" },
    { en: "Where can I renew my driving licence?", ta: "டிரைவிங் லைசென்ஸ் புதுப்பிப்பது எங்கு?", id: "driving_licence_renewal" },
    { en: "What is a scholarship?", ta: "அரசு கல்வி உதவித்தொகை என்றால் என்ன?", id: "scholarships" },
    { en: "How can I register a grievance?", ta: "அரசு புகார் மனு அளிப்பது எப்படி?", id: "grievance_registration" }
  ];

  container.innerHTML = "";
  samples.forEach(s => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sample-q-btn";
    btn.textContent = currentLanguage === 'ta' ? s.ta : s.en;
    btn.onclick = () => {
      if (s.id === "status_redirect") {
        const statusSec = document.getElementById("statusSection");
        if (statusSec) {
          statusSec.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = "application-status.html";
        }
      } else {
        const input = document.getElementById("questionInput");
        if (input) input.value = btn.textContent;
        processUserQuestion(btn.textContent, false);
      }
    };
    container.appendChild(btn);
  });
}

// ==========================================
// 8. APPLICATION STATUS TRACKER (DEMO)
// ==========================================
function checkApplicationStatus(event) {
  if (event) event.preventDefault();

  const input = document.getElementById("appNumberInput");
  const resultDiv = document.getElementById("statusResultArea");
  if (!input || !resultDiv) return;

  const queryNum = input.value.trim().toUpperCase();

  if (queryNum === "") {
    alert(currentLanguage === 'ta' ? "விண்ணப்ப எண்ணை உள்ளிடவும் (எ.கா: APP1001)" : "Please enter an application number (e.g., APP1001)");
    input.focus();
    return;
  }

  const record = mockApplicationStatusDB[queryNum];

  if (record) {
    const serviceName = currentLanguage === 'ta' ? record.serviceTa : record.serviceEn;
    const applicantName = currentLanguage === 'ta' ? record.applicantTa : record.applicantEn;
    const statusText = currentLanguage === 'ta' ? record.statusTa : record.statusEn;
    const expText = currentLanguage === 'ta' ? record.expectedCompletionTa : record.expectedCompletionEn;
    const actionText = currentLanguage === 'ta' ? record.actionRequiredTa : record.actionRequiredEn;

    resultDiv.innerHTML = `
      <div class="status-card-result ${record.statusClass}">
        <div class="status-result-header">
          <div>
            <span class="status-badge ${record.statusClass}">${statusText}</span>
            <h4 class="status-app-title">${serviceName}</h4>
            <div class="status-sub">Ref: <strong>${record.appNumber}</strong> | Applicant: <strong>${applicantName}</strong></div>
          </div>
          <div class="status-date-box">
            <small>Submitted: ${record.submissionDate}</small>
          </div>
        </div>
        <div class="status-result-body">
          <div class="status-data-row">
            <span class="status-label">${currentLanguage === 'ta' ? 'எதிர்பார்க்கப்படும் முடிவு:' : 'Expected Completion:'}</span>
            <span class="status-val">${expText}</span>
          </div>
          <div class="status-data-row">
            <span class="status-label">${currentLanguage === 'ta' ? 'தற்போதைய நடவடிக்கை:' : 'Current Action / Next Step:'}</span>
            <span class="status-val">${actionText}</span>
          </div>
        </div>
      </div>
    `;
    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    resultDiv.innerHTML = `
      <div class="status-card-result status-not-found">
        <h4>${currentLanguage === 'ta' ? 'விண்ணப்பம் காணப்படவில்லை' : 'Application Not Found'}</h4>
        <p>${currentLanguage === 'ta'
          ? 'குறிப்பிட்ட எண்ணில் எந்த மாதிரி விண்ணப்பமும் கிடைக்கவில்லை. மாதிரி எண்களை சோதிக்கவும்: APP1001, APP1002, APP1003'
          : 'No mock application matches this number. Try our sample test numbers: APP1001, APP1002, or APP1003.'}
        </p>
      </div>
    `;
    resultDiv.style.display = "block";
  }
}

function fillDemoAppNumber(num) {
  const input = document.getElementById("appNumberInput");
  if (input) {
    input.value = num;
    checkApplicationStatus(null);
  }
}

// ==========================================
// 8.1 SERVICES DIRECTORY HELPERS (services.html)
// ==========================================
let currentServiceCategory = 'all';
let currentSearchTerm = '';

function renderAllServicesGrid() {
  const grid = document.getElementById("allServicesGrid");
  if (!grid) return;

  const countEl = document.getElementById("servicesResultCount");

  const filtered = governmentServicesDB.filter(s => {
    const matchesCat = currentServiceCategory === 'all' || s.category.toLowerCase() === currentServiceCategory.toLowerCase();
    
    if (!matchesCat) return false;
    if (!currentSearchTerm) return true;

    const term = currentSearchTerm.toLowerCase();
    const content = currentLanguage === 'ta' ? s.ta : s.en;
    const matchesTitle = content.title.toLowerCase().includes(term);
    const matchesDesc = content.simpleExplanation.toLowerCase().includes(term);
    const matchesKw = content.keywords.some(k => k.toLowerCase().includes(term));
    const matchesSource = s.source.toLowerCase().includes(term);

    return matchesTitle || matchesDesc || matchesKw || matchesSource;
  });

  if (countEl) {
    countEl.textContent = currentLanguage === 'ta'
      ? `${filtered.length} சேவைகள் காட்டப்படுகின்றன`
      : `Showing ${filtered.length} of ${governmentServicesDB.length} Services`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--border-radius);">
        <h3 style="color: var(--color-deep-navy); margin-bottom: 8px;">${currentLanguage === 'ta' ? 'சேவை எதுவும் கிடைக்கவில்லை' : 'No Services Found'}</h3>
        <p style="color: var(--color-text-muted);">${currentLanguage === 'ta' ? 'வேறு சொல்லைத் தேடவும் அல்லது வகையை மாற்றவும்.' : 'Please try another search keyword or clear the category filter.'}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";
  filtered.forEach(item => {
    const content = currentLanguage === 'ta' ? item.ta : item.en;
    const card = document.createElement("article");
    card.className = "service-card-full";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", content.title);

    card.innerHTML = `
      <div>
        <div class="card-top-category">${item.category}</div>
        <h3 class="card-service-title">${content.title}</h3>
        <p class="card-service-desc">${content.simpleExplanation}</p>
      </div>
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 13px; color: var(--color-teal); font-weight: 600;">
          <span>&#10003; ${content.steps.length} ${currentLanguage === 'ta' ? 'படிகள்' : 'Steps'}</span>
          <span>&bull;</span>
          <span>&#128196; ${content.documents.length} ${currentLanguage === 'ta' ? 'ஆவணங்கள்' : 'Documents'}</span>
        </div>
        <button type="button" class="btn-secondary" style="width: 100%; justify-content: center;" onclick="viewServiceDetail('${item.id}')">
          ${currentLanguage === 'ta' ? 'முழு விவரம் காண்க' : 'View Full Details & Steps'} &rarr;
        </button>
        <div class="card-source-tag">
          <small>${item.source}</small>
        </div>
      </div>
    `;

    // Keyboard accessibility for card
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        viewServiceDetail(item.id);
      }
    });

    grid.appendChild(card);
  });
}

function filterServicesByCategory(cat, btnElement) {
  currentServiceCategory = cat;
  const buttons = document.querySelectorAll(".category-filter-bar .filter-btn");
  buttons.forEach(b => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  renderAllServicesGrid();
}

function handleServicesSearch(e) {
  currentSearchTerm = e.target.value.trim();
  renderAllServicesGrid();
}

function viewServiceDetail(serviceId) {
  const service = governmentServicesDB.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById("serviceDetailModal");
  const modalBody = document.getElementById("serviceModalBody");
  if (!modal || !modalBody) return;

  const content = currentLanguage === 'ta' ? service.ta : service.en;
  const otherContent = currentLanguage === 'ta' ? service.en : service.ta;

  modalBody.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span class="hero-tag">${service.category}</span>
      <h2 style="font-size: 24px; color: var(--color-deep-navy); margin-top: 6px;">${content.title}</h2>
      <div style="font-size: 15px; color: var(--color-teal); font-style: italic; margin-top: 4px;">"${content.question}"</div>
    </div>

    <div class="panel-block" style="margin-bottom: 14px;">
      <div class="block-title">${translations[currentLanguage].labelMeaning}</div>
      <div class="block-text">${content.simpleMeaning}</div>
    </div>

    <div class="panel-block teal-accent" style="margin-bottom: 14px;">
      <div class="block-title">${translations[currentLanguage].labelAnswer}</div>
      <div class="block-text">${content.answer}</div>
    </div>

    <div class="panel-block navy-accent" style="margin-bottom: 14px;">
      <div class="block-title">${translations[currentLanguage].labelExplanation}</div>
      <div class="block-text">${content.simpleExplanation}</div>
      <div class="bilingual-note-box" style="margin-top: 8px;">
        ${currentLanguage === 'ta' ? 'English Summary: ' + otherContent.simpleExplanation : 'தமிழ் விளக்கம்: ' + otherContent.simpleExplanation}
      </div>
    </div>

    <div class="steps-container" style="margin-bottom: 14px;">
      <div class="block-title">${translations[currentLanguage].labelSteps}</div>
      <ol class="steps-list">
        ${content.steps.map(st => `<li>${st}</li>`).join('')}
      </ol>
    </div>

    <div class="panel-block teal-accent" style="margin-bottom: 14px;">
      <div class="block-title">${translations[currentLanguage].labelDocuments}</div>
      <ul class="docs-list">
        ${content.documents.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>

    <div class="source-attribution-card">
      <div class="source-left">
        <span class="source-tag">${translations[currentLanguage].labelSource}</span>
        <span class="source-name">${service.source}</span>
      </div>
      <div>
        <a href="${service.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link-btn">${service.sourceUrl}</a>
      </div>
    </div>

    <div class="official-warning-note" style="margin-top: 14px;">
      ${translations[currentLanguage].labelVerifyNotice}
    </div>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeServiceModal() {
  const modal = document.getElementById("serviceDetailModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// ==========================================
// 8.2 AUTHENTICATION & LOGIN MANAGEMENT (FULL ACCESS)
// ==========================================
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('flowcode_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateNavAuthUI() {
  const container = document.getElementById("navAuthItem");
  if (!container) return;

  const user = getCurrentUser();
  if (user) {
    container.innerHTML = `
      <div class="nav-user-chip">
        <a href="login.html" class="nav-user-link" title="Open Citizen Dashboard">
          <span aria-hidden="true">&#128100;</span>
          <span>${user.name}</span>
          <span class="nav-user-badge">Full Access</span>
        </a>
        <button type="button" class="nav-logout-btn" onclick="logoutUser()" title="Logout">
          (${translations[currentLanguage] ? translations[currentLanguage].navLogout : 'Sign Out'})
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <a href="login.html" id="navLoginLink" class="nav-login-btn">
        <span aria-hidden="true">&#128272;</span>
        <span data-i18n="navLogin">${translations[currentLanguage] ? translations[currentLanguage].navLogin : 'Login'}</span>
      </a>
    `;
  }
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (btnEl) btnEl.innerHTML = "&#128274;";
    if (btnEl) btnEl.title = "Hide Password";
  } else {
    input.type = "password";
    if (btnEl) btnEl.innerHTML = "&#128065;";
    if (btnEl) btnEl.title = "Show Password";
  }
}

function switchLoginTab(tab) {
  const tabSignIn = document.getElementById("tabSignInBtn");
  const tabRegister = document.getElementById("tabRegisterBtn");
  const formSignIn = document.getElementById("citizenSignInForm");
  const formRegister = document.getElementById("citizenRegisterForm");
  const alertEl = document.getElementById("loginStatusAlert");

  if (alertEl) {
    alertEl.style.display = "none";
    alertEl.textContent = "";
  }

  if (tab === 'signin') {
    if (tabSignIn) tabSignIn.classList.add("active");
    if (tabRegister) tabRegister.classList.remove("active");
    if (formSignIn) formSignIn.style.display = "block";
    if (formRegister) formRegister.style.display = "none";
  } else {
    if (tabRegister) tabRegister.classList.add("active");
    if (tabSignIn) tabSignIn.classList.remove("active");
    if (formRegister) formRegister.style.display = "block";
    if (formSignIn) formSignIn.style.display = "none";
  }
}

function calculateAgeFromDob(dobString) {
  if (!dobString) return 25;
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function handleCitizenSignIn(event) {
  if (event) event.preventDefault();
  const alertEl = document.getElementById("loginStatusAlert");
  const usernameInput = document.getElementById("loginUsername");
  const emailInput = document.getElementById("loginEmail");
  const dobInput = document.getElementById("loginDob");
  const passwordInput = document.getElementById("loginPassword");

  const username = usernameInput ? usernameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const dob = dobInput ? dobInput.value : "";
  const password = passwordInput ? passwordInput.value : "";

  if (!username || !email || !dob || !password) {
    if (alertEl) {
      alertEl.className = "login-status-alert error";
      alertEl.textContent = "Please fill in all required fields: Username, Gmail account, Date of Birth (D.O.B), and Password.";
      alertEl.style.display = "block";
    }
    return;
  }

  // Validate Gmail format
  if (!email.includes("@")) {
    if (alertEl) {
      alertEl.className = "login-status-alert error";
      alertEl.textContent = "Please enter a valid Gmail address (e.g., yourname@gmail.com).";
      alertEl.style.display = "block";
    }
    return;
  }

  const age = calculateAgeFromDob(dob);
  const citizenId = "TN-CIT-" + Math.floor(10000 + Math.random() * 90000);

  const user = {
    role: 'citizen',
    name: username,
    email: email,
    dob: dob,
    age: age,
    citizenId: citizenId,
    mobile: '+91 98401 ' + Math.floor(10000 + Math.random() * 90000),
    village: 'Thiruporur Taluk, Tamil Nadu',
    hasFullAccess: true,
    loginTimestamp: new Date().toISOString()
  };

  localStorage.setItem('flowcode_auth_user', JSON.stringify(user));
  updateNavAuthUI();
  renderDashboardIfPresent();
}

function handleCitizenRegistration(event) {
  if (event) event.preventDefault();
  const alertEl = document.getElementById("loginStatusAlert");
  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const dobInput = document.getElementById("regDob");
  const mobileInput = document.getElementById("regMobile");
  const villageInput = document.getElementById("regVillage");
  const passInput = document.getElementById("regPassword");
  const confirmPassInput = document.getElementById("regConfirmPassword");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const dob = dobInput ? dobInput.value : "";
  const mobile = mobileInput ? mobileInput.value.trim() : "";
  const village = villageInput ? villageInput.value.trim() : "Tamil Nadu";
  const pass = passInput ? passInput.value : "";
  const confirmPass = confirmPassInput ? confirmPassInput.value : "";

  if (pass !== confirmPass) {
    if (alertEl) {
      alertEl.className = "login-status-alert error";
      alertEl.textContent = "Error: Passwords do not match. Please verify and re-type.";
      alertEl.style.display = "block";
    }
    return;
  }

  if (pass.length < 6) {
    if (alertEl) {
      alertEl.className = "login-status-alert error";
      alertEl.textContent = "Error: Password must contain at least 6 characters.";
      alertEl.style.display = "block";
    }
    return;
  }

  const age = calculateAgeFromDob(dob);
  const citizenId = "TN-CIT-" + Math.floor(10000 + Math.random() * 90000);

  const user = {
    role: 'citizen',
    name: name,
    email: email,
    dob: dob,
    age: age,
    citizenId: citizenId,
    mobile: mobile ? ('+91 ' + mobile) : '+91 98401 23456',
    village: village,
    hasFullAccess: true,
    loginTimestamp: new Date().toISOString()
  };

  localStorage.setItem('flowcode_auth_user', JSON.stringify(user));
  updateNavAuthUI();
  renderDashboardIfPresent();
}

function handleForgotPassword(event) {
  if (event) event.preventDefault();
  const email = document.getElementById("loginEmail") ? document.getElementById("loginEmail").value.trim() : "";
  if (email) {
    alert("Password reset OTP has been dispatched to: " + email + ". Please check your inbox.");
  } else {
    alert("Please enter your Gmail address in the field above to receive password reset instructions.");
  }
}

function copyCitizenId() {
  const user = getCurrentUser();
  const id = user ? user.citizenId : "TN-CIT-82019";
  navigator.clipboard.writeText(id).then(() => {
    alert("Citizen ID (" + id + ") copied to clipboard!");
  }).catch(() => {
    alert("Citizen ID: " + id);
  });
}

function handleDashboardQuickApply(event) {
  if (event) event.preventDefault();
  const serviceSelect = document.getElementById("applyServiceSelect");
  const talukInput = document.getElementById("applyTalukInput");
  const noticeEl = document.getElementById("applySuccessNotice");

  const service = serviceSelect ? serviceSelect.value : "Income Certificate";
  const taluk = talukInput ? talukInput.value.trim() : "Local Taluk";
  const newAppId = "APP" + Math.floor(1004 + Math.random() * 8990);

  // Retrieve or create application history
  let apps = [];
  try {
    const raw = localStorage.getItem('flowcode_user_apps');
    apps = raw ? JSON.parse(raw) : [];
  } catch (e) {
    apps = [];
  }

  const newApp = {
    id: newAppId,
    service: service,
    location: taluk,
    date: new Date().toLocaleDateString('en-GB'),
    status: "Application Submitted - Pending VAO Verification",
    statusBadge: "Pending Review",
    badgeColor: "var(--color-royal-blue)"
  };

  apps.unshift(newApp);
  localStorage.setItem('flowcode_user_apps', JSON.stringify(apps));

  if (noticeEl) {
    noticeEl.innerHTML = `
      <strong>&#10004; Application Successfully Filed!</strong><br>
      Reference Number: <strong style="font-family:monospace; font-size:16px;">${newAppId}</strong><br>
      Service: ${service} &bull; Village/Taluk: ${taluk}<br>
      <a href="application-status.html" style="color:var(--color-royal-blue); font-weight:700; text-decoration:underline;">Click here to track your new application in real-time &rarr;</a>
    `;
    noticeEl.style.display = "block";
  }

  // Refresh dashboard applications list
  renderDashboardIfPresent();
}

function logoutUser() {
  localStorage.removeItem('flowcode_auth_user');
  updateNavAuthUI();
  renderDashboardIfPresent();
}

function renderDashboardIfPresent() {
  const loginCard = document.getElementById("loginFormCard");
  const dashboardCard = document.getElementById("userDashboardCard");
  if (!loginCard || !dashboardCard) return;

  const user = getCurrentUser();
  if (user) {
    loginCard.style.display = "none";
    dashboardCard.style.display = "block";

    // Header banner fields
    const userNameEl = document.getElementById("dashUserName");
    const userRoleEl = document.getElementById("dashUserRole");
    const citizenIdEl = document.getElementById("dashCitizenId");
    const userEmailEl = document.getElementById("dashUserEmail");
    const userDobEl = document.getElementById("dashUserDob");
    const userAgeEl = document.getElementById("dashUserAge");
    const userVillageEl = document.getElementById("dashUserVillage");

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = "🛡️ Verified Citizen Account (Full Access)";
    if (citizenIdEl) citizenIdEl.textContent = user.citizenId || "TN-CIT-82019";
    if (userEmailEl) userEmailEl.textContent = user.email || "citizen@gmail.com";
    if (userDobEl) userDobEl.textContent = user.dob || "01/01/2000";
    if (userAgeEl) userAgeEl.textContent = user.age || "25";
    if (userVillageEl) userVillageEl.textContent = user.village || "Tamil Nadu";

    // Digital pass fields
    const passName = document.getElementById("passName");
    const passId = document.getElementById("passId");
    const passEmail = document.getElementById("passEmail");
    const passDob = document.getElementById("passDob");
    const passMobile = document.getElementById("passMobile");
    const passLocation = document.getElementById("passLocation");

    if (passName) passName.textContent = user.name;
    if (passId) passId.textContent = user.citizenId || "TN-CIT-82019";
    if (passEmail) passEmail.textContent = user.email || "citizen@gmail.com";
    if (passDob) passDob.textContent = `${user.dob || "2000-01-01"} (Age: ${user.age || "25"})`;
    if (passMobile) passMobile.textContent = user.mobile || "+91 98401 23456";
    if (passLocation) passLocation.textContent = user.village || "Tamil Nadu, India";

    // Render applications list
    const dashContentEl = document.getElementById("dashCustomContent");
    if (dashContentEl) {
      let apps = [];
      try {
        const raw = localStorage.getItem('flowcode_user_apps');
        apps = raw ? JSON.parse(raw) : [];
      } catch (e) {
        apps = [];
      }

      // Default mock app if none filed yet
      if (apps.length === 0) {
        apps = [
          {
            id: "APP1001",
            service: "வருமான சான்றிதழ் (Income Certificate)",
            location: user.village || "Thiruporur Taluk",
            date: "20/09/2026",
            status: "Under Verification — Field inspection by Village Administrative Officer (VAO)",
            statusBadge: "Under Verification",
            badgeColor: "var(--color-royal-blue)"
          }
        ];
      }

      let appsHtml = `
        <div class="dashboard-quick-apply-card" style="margin-top:20px;">
          <h3 style="font-size:18px; color:var(--color-deep-navy); margin-bottom:14px; font-weight:800;">
            &#128196; My Active Applications (${apps.length})
          </h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
      `;

      apps.forEach(app => {
        appsHtml += `
          <div style="background-color:var(--color-bg); border:1px solid var(--color-border); border-radius:var(--border-radius); padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-family:monospace; font-size:15px; color:var(--color-deep-navy);">${app.id}</strong>
                <span style="font-size:11px; font-weight:700; background:#E0F2FE; color:#0369A1; padding:2px 8px; border-radius:10px;">${app.statusBadge || 'Active'}</span>
              </div>
              <div style="font-size:14px; font-weight:600; color:var(--color-text-main); margin-top:2px;">${app.service}</div>
              <div style="font-size:12px; color:var(--color-text-muted); margin-top:2px;">${app.status} &bull; Filed: ${app.date}</div>
            </div>
            <div>
              <a href="application-status.html" class="btn-secondary" style="font-size:12px; padding:6px 12px; text-decoration:none;">
                Track Status &rarr;
              </a>
            </div>
          </div>
        `;
      });

      appsHtml += `
          </div>
        </div>
      `;

      dashContentEl.innerHTML = appsHtml;
    }
  } else {
    loginCard.style.display = "block";
    dashboardCard.style.display = "none";
  }
}

// ==========================================
// 9. INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Load stored language preference or default to English
  const savedLang = localStorage.getItem('flowcode_lang') || 'en';
  setLanguage(savedLang);

  // Setup speech recognition
  setupSpeechRecognition();

  // Update navigation auth status across all pages
  updateNavAuthUI();

  // If on login.html, render login or dashboard
  renderDashboardIfPresent();

  // If question input exists, attach Enter key listener
  const qInput = document.getElementById("questionInput");
  if (qInput) {
    qInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAskButtonClick();
      }
    });
  }

  // Default display a popular service (Income Certificate) on home page if panel exists
  const explanationPanel = document.getElementById("explanationPanel");
  if (explanationPanel && !activeService) {
    // Show income certificate by default as requested in prompt specs
    const defaultService = governmentServicesDB.find(s => s.id === "income_certificate");
    if (defaultService) {
      activeService = defaultService;
      renderServiceExplanation(defaultService);
      explanationPanel.style.display = "block";
    }
  }

  // If on services.html, render services grid
  if (document.getElementById("allServicesGrid")) {
    renderAllServicesGrid();
  }
});


