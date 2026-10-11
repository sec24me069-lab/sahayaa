import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SCHEME_TRANSLATIONS } from "./schemes.i18n";
import type { Scheme } from "./schemes";

export type Lang = "en" | "ta" | "hi";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिन्दी" },
];
export const LANG_NAMES: Record<Lang, string> = { en: "English", ta: "Tamil", hi: "Hindi" };

const en = {
  translationUnreviewed: "Tamil and Hindi summaries are AI translations, not official language documents; they have not been reviewed.",
  tagline: "Find the support you're entitled to — and the way to get it.",
  findMine: "FIND MY SCHEMES",
  howLabel: "HOW IT WORKS",
  howTitle: "From scattered information to one clear path.",
  step1t: "Tell us about you", step1d: "Answer a few simple questions about your age, location, income and family — in your own language.",
  step2t: "See what fits", step2d: "SAHAAYA matches you with schemes and services you're likely eligible for, and explains why in plain words.",
  step3t: "Get guided through", step3d: "Know exactly which documents to gather, which office handles it, and what happens next.",
  finderLabel: "FIND YOUR SCHEMES",
  finderTitle: "Tell us a little. We'll show what fits — and why.",
  fLocation: "STATE / LOCATION", fLocationPh: "e.g. Kerala, rural",
  fAge: "AGE", fAgePh: "e.g. 34",
  fNeeds: "WHAT DO YOU NEED?", fNeedsPh: "e.g. I'm a farmer with 2 acres and need help with crop losses and my daughter's college fees",
  recommend: "RECOMMEND SCHEMES", finding: "FINDING MATCHES…",
  aiNote: "AI-powered suggestions. Always confirm eligibility with the official office.",
  strong: "STRONG MATCH", possible: "POSSIBLE MATCH", confirm: "Confirm:",
  viewDetails: "VIEW DETAILS →", noMatches: "No clear matches. Try adding more about your situation.",
  resultsHere: "Your recommendations will appear here.", checkDetails: "Please check your details and try again.",
  discLabel: "SCHEME DISCOVERY", discTitle: "Every kind of support, in one place.",
  allCategories: "All categories", anyLocation: "Any location", nationwide: "Nationwide only", anyone: "Anyone eligible",
  clear: "CLEAR", schemesCount: "SCHEMES", noFilterMatch: "No schemes match these filters.",
  allSchemes: "← ALL SCHEMES", notFound: "We couldn't find that scheme.",
  dLocation: "LOCATION", dAge: "AGE", dFor: "FOR", anyAge: "Any age", years: "years", upTo: "Up to",
  eligibility: "ELIGIBILITY", benefits: "BENEFITS", documents: "DOCUMENTS", howApply: "HOW TO APPLY",
  source: "SOURCE", lastVerified: "LAST VERIFIED", notVerified: "Not yet verified against the official source",
  checkElse: "CHECK WHAT ELSE FITS ME", summaryNote: "Details are a summary. Confirm with the official scheme office before applying.",
  askLabel: "ASK SAHAAYA", askTitle: "Questions about {name}?", thinking: "Thinking…", askPh: "Type your question…", ask: "ASK",
  askNote: "AI-powered answers based on this page. Confirm with the official source before applying.",
  sugg1: "Am I eligible?", sugg2: "What documents do I need?", sugg3: "How do I apply, step by step?", sugg4: "How much will I receive?",
  replay: "↻ REPLAY INTRO", language: "Language",
  "cat:Education": "Education", "cat:Health": "Health", "cat:Housing": "Housing", "cat:Livelihood": "Livelihood", "cat:Agriculture": "Agriculture", "cat:Social security": "Social security",
  "aud:Students": "Students", "aud:Farmers": "Farmers", "aud:Women": "Women", "aud:Senior citizens": "Senior citizens", "aud:Low income": "Low income", "aud:Workers": "Workers", "aud:Entrepreneurs": "Entrepreneurs",
  "loc:All India": "All India", "loc:Kerala": "Kerala", "loc:Tamil Nadu": "Tamil Nadu", "loc:Maharashtra": "Maharashtra",
};
type Dict = typeof en;

const ta: Dict = {
  translationUnreviewed: "தமிழ் மற்றும் இந்தி சுருக்கங்கள் AI மொழிபெயர்ப்புகள்; அதிகாரப்பூர்வ மொழி ஆவணங்கள் அல்ல. இன்னும் மதிப்பாய்வு செய்யப்படவில்லை.",
  tagline: "உங்களுக்கு உரிய உதவியைக் கண்டறியுங்கள் — அதைப் பெறும் வழியையும்.",
  findMine: "என் திட்டங்களைக் கண்டறி",
  howLabel: "எப்படி செயல்படுகிறது",
  howTitle: "சிதறிய தகவல்களிலிருந்து ஒரு தெளிவான பாதை.",
  step1t: "உங்களைப் பற்றி சொல்லுங்கள்", step1d: "உங்கள் வயது, இடம், வருமானம், குடும்பம் பற்றிய சில எளிய கேள்விகளுக்கு உங்கள் மொழியிலேயே பதில் சொல்லுங்கள்.",
  step2t: "பொருந்துவதைப் பாருங்கள்", step2d: "நீங்கள் தகுதி பெறக்கூடிய திட்டங்களை SAHAAYA காட்டி, ஏன் என்பதை எளிய வார்த்தைகளில் விளக்கும்.",
  step3t: "வழிகாட்டுதல் பெறுங்கள்", step3d: "எந்த ஆவணங்கள் தேவை, எந்த அலுவலகம் கையாளும், அடுத்து என்ன நடக்கும் என்பதைத் தெரிந்துகொள்ளுங்கள்.",
  finderLabel: "உங்கள் திட்டங்களைக் கண்டறியுங்கள்",
  finderTitle: "கொஞ்சம் சொல்லுங்கள். பொருந்துவதையும் காரணத்தையும் காட்டுகிறோம்.",
  fLocation: "மாநிலம் / இடம்", fLocationPh: "எ.கா. தமிழ்நாடு, கிராமம்",
  fAge: "வயது", fAgePh: "எ.கா. 34",
  fNeeds: "உங்களுக்கு என்ன தேவை?", fNeedsPh: "எ.கா. எனக்கு 2 ஏக்கர் நிலம் உள்ளது, பயிர் இழப்புக்கும் மகளின் கல்லூரிக் கட்டணத்துக்கும் உதவி தேவை",
  recommend: "திட்டங்களைப் பரிந்துரை", finding: "தேடுகிறது…",
  aiNote: "AI பரிந்துரைகள். தகுதியை எப்போதும் அதிகாரப்பூர்வ அலுவலகத்தில் உறுதிப்படுத்துங்கள்.",
  strong: "வலுவான பொருத்தம்", possible: "சாத்தியமான பொருத்தம்", confirm: "உறுதிப்படுத்தவும்:",
  viewDetails: "விவரங்கள் →", noMatches: "தெளிவான பொருத்தம் இல்லை. உங்கள் நிலைமையைப் பற்றி இன்னும் சொல்லுங்கள்.",
  resultsHere: "உங்கள் பரிந்துரைகள் இங்கே தோன்றும்.", checkDetails: "விவரங்களைச் சரிபார்த்து மீண்டும் முயலுங்கள்.",
  discLabel: "திட்டங்களை ஆராயுங்கள்", discTitle: "எல்லா வகை உதவியும் ஒரே இடத்தில்.",
  allCategories: "எல்லா வகைகளும்", anyLocation: "எந்த இடமும்", nationwide: "நாடு முழுவதும் மட்டும்", anyone: "யார் வேண்டுமானாலும்",
  clear: "அழி", schemesCount: "திட்டங்கள்", noFilterMatch: "இந்த வடிகட்டிகளுக்குப் பொருந்தும் திட்டங்கள் இல்லை.",
  allSchemes: "← எல்லா திட்டங்களும்", notFound: "அந்தத் திட்டம் கிடைக்கவில்லை.",
  dLocation: "இடம்", dAge: "வயது", dFor: "யாருக்கு", anyAge: "எந்த வயதும்", years: "வயது", upTo: "அதிகபட்சம்",
  eligibility: "தகுதி", benefits: "பலன்கள்", documents: "ஆவணங்கள்", howApply: "விண்ணப்பிக்கும் முறை",
  source: "ஆதாரம்", lastVerified: "கடைசியாகச் சரிபார்த்தது", notVerified: "அதிகாரப்பூர்வ ஆதாரத்துடன் இன்னும் சரிபார்க்கப்படவில்லை",
  checkElse: "எனக்கு வேறு என்ன பொருந்தும்?", summaryNote: "இது சுருக்கம் மட்டுமே. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அலுவலகத்தில் உறுதிப்படுத்துங்கள்.",
  askLabel: "SAHAAYA-விடம் கேளுங்கள்", askTitle: "{name} பற்றி கேள்விகள் உள்ளதா?", thinking: "யோசிக்கிறது…", askPh: "உங்கள் கேள்வியைத் தட்டச்சு செய்யுங்கள்…", ask: "கேள்",
  askNote: "இந்தப் பக்கத்தின் அடிப்படையிலான AI பதில்கள். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ ஆதாரத்தில் உறுதிப்படுத்துங்கள்.",
  sugg1: "நான் தகுதியானவரா?", sugg2: "என்ன ஆவணங்கள் தேவை?", sugg3: "படிப்படியாக எப்படி விண்ணப்பிப்பது?", sugg4: "எவ்வளவு கிடைக்கும்?",
  replay: "↻ அறிமுகத்தை மீண்டும் பார்", language: "மொழி",
  "cat:Education": "கல்வி", "cat:Health": "சுகாதாரம்", "cat:Housing": "வீட்டுவசதி", "cat:Livelihood": "வாழ்வாதாரம்", "cat:Agriculture": "விவசாயம்", "cat:Social security": "சமூகப் பாதுகாப்பு",
  "aud:Students": "மாணவர்கள்", "aud:Farmers": "விவசாயிகள்", "aud:Women": "பெண்கள்", "aud:Senior citizens": "மூத்த குடிமக்கள்", "aud:Low income": "குறைந்த வருமானம்", "aud:Workers": "தொழிலாளர்கள்", "aud:Entrepreneurs": "தொழில்முனைவோர்",
  "loc:All India": "இந்தியா முழுவதும்", "loc:Kerala": "கேரளா", "loc:Tamil Nadu": "தமிழ்நாடு", "loc:Maharashtra": "மகாராஷ்டிரா",
};

const hi: Dict = {
  translationUnreviewed: "तमिल और हिन्दी सारांश AI अनुवाद हैं, आधिकारिक भाषा दस्तावेज़ नहीं; इनकी समीक्षा अभी नहीं हुई है।",
  tagline: "जिस मदद के आप हक़दार हैं, उसे खोजें — और उसे पाने का रास्ता भी।",
  findMine: "मेरी योजनाएँ खोजें",
  howLabel: "यह कैसे काम करता है",
  howTitle: "बिखरी जानकारी से एक साफ़ रास्ते तक।",
  step1t: "अपने बारे में बताएँ", step1d: "अपनी उम्र, जगह, आय और परिवार के बारे में कुछ आसान सवालों के जवाब अपनी भाषा में दें।",
  step2t: "देखें क्या आपके लिए है", step2d: "SAHAAYA आपको वे योजनाएँ दिखाता है जिनके आप पात्र हो सकते हैं, और आसान शब्दों में बताता है क्यों।",
  step3t: "पूरा मार्गदर्शन पाएँ", step3d: "जानें कौन-से दस्तावेज़ चाहिए, कौन-सा दफ़्तर संभालता है, और आगे क्या होगा।",
  finderLabel: "अपनी योजनाएँ खोजें",
  finderTitle: "थोड़ा बताइए। हम दिखाएँगे क्या फिट है — और क्यों।",
  fLocation: "राज्य / जगह", fLocationPh: "जैसे: उत्तर प्रदेश, गाँव",
  fAge: "उम्र", fAgePh: "जैसे: 34",
  fNeeds: "आपको क्या चाहिए?", fNeedsPh: "जैसे: मैं 2 एकड़ वाला किसान हूँ, फ़सल नुकसान और बेटी की कॉलेज फ़ीस में मदद चाहिए",
  recommend: "योजनाएँ सुझाएँ", finding: "खोज रहे हैं…",
  aiNote: "AI सुझाव। पात्रता हमेशा आधिकारिक दफ़्तर से पक्का करें।",
  strong: "पक्का मेल", possible: "संभावित मेल", confirm: "पक्का करें:",
  viewDetails: "विवरण देखें →", noMatches: "कोई साफ़ मेल नहीं मिला। अपनी स्थिति के बारे में थोड़ा और बताएँ।",
  resultsHere: "आपके सुझाव यहाँ दिखेंगे।", checkDetails: "कृपया अपना विवरण जाँचें और फिर कोशिश करें।",
  discLabel: "योजनाएँ खोजें", discTitle: "हर तरह की मदद, एक ही जगह।",
  allCategories: "सभी श्रेणियाँ", anyLocation: "कोई भी जगह", nationwide: "केवल पूरे देश की", anyone: "कोई भी पात्र",
  clear: "हटाएँ", schemesCount: "योजनाएँ", noFilterMatch: "इन फ़िल्टर से कोई योजना मेल नहीं खाती।",
  allSchemes: "← सभी योजनाएँ", notFound: "वह योजना नहीं मिली।",
  dLocation: "जगह", dAge: "उम्र", dFor: "किसके लिए", anyAge: "कोई भी उम्र", years: "वर्ष", upTo: "अधिकतम",
  eligibility: "पात्रता", benefits: "लाभ", documents: "दस्तावेज़", howApply: "आवेदन कैसे करें",
  source: "स्रोत", lastVerified: "अंतिम सत्यापन", notVerified: "आधिकारिक स्रोत से अभी सत्यापित नहीं",
  checkElse: "मेरे लिए और क्या है?", summaryNote: "यह केवल सारांश है। आवेदन से पहले आधिकारिक दफ़्तर से पक्का करें।",
  askLabel: "SAHAAYA से पूछें", askTitle: "{name} के बारे में सवाल?", thinking: "सोच रहे हैं…", askPh: "अपना सवाल लिखें…", ask: "पूछें",
  askNote: "इस पेज पर आधारित AI जवाब। आवेदन से पहले आधिकारिक स्रोत से पक्का करें।",
  sugg1: "क्या मैं पात्र हूँ?", sugg2: "कौन-से दस्तावेज़ चाहिए?", sugg3: "आवेदन कैसे करूँ, चरण-दर-चरण?", sugg4: "मुझे कितना मिलेगा?",
  replay: "↻ परिचय फिर देखें", language: "भाषा",
  "cat:Education": "शिक्षा", "cat:Health": "स्वास्थ्य", "cat:Housing": "आवास", "cat:Livelihood": "आजीविका", "cat:Agriculture": "कृषि", "cat:Social security": "सामाजिक सुरक्षा",
  "aud:Students": "छात्र", "aud:Farmers": "किसान", "aud:Women": "महिलाएँ", "aud:Senior citizens": "वरिष्ठ नागरिक", "aud:Low income": "कम आय", "aud:Workers": "मज़दूर", "aud:Entrepreneurs": "उद्यमी",
  "loc:All India": "पूरा भारत", "loc:Kerala": "केरल", "loc:Tamil Nadu": "तमिलनाडु", "loc:Maharashtra": "महाराष्ट्र",
};

const DICTS: Record<Lang, Dict> = { en, ta, hi };
export type TKey = keyof Dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey | string, vars?: Record<string, string>) => string };
const I18nContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "sahaaya-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
    if (saved === "ta" || saved === "hi" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem(STORAGE_KEY, l); } catch { /* Keep selection for this visit. */ } };
  const t = (k: string, vars?: Record<string, string>) => {
    let s = (DICTS[lang] as Record<string, string>)[k] ?? (en as Record<string, string>)[k] ?? k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
    return s;
  };
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}

/** Scheme text in the chosen language, falling back to English. */
export function localizeScheme(s: Scheme, lang: Lang): Scheme {
  if (lang === "en") return s;
  const tr = SCHEME_TRANSLATIONS[lang][s.slug];
  return tr ? { ...s, ...tr } : s;
}
