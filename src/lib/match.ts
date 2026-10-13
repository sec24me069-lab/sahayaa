/**
 * Deterministic, language-independent eligibility engine.
 * Inputs and rules use canonical English IDs only; display text is translated separately.
 */
import { SCHEMES, type Category, type Scheme } from "./schemes";
import type { Lang } from "./i18n";

export const STATES = ["Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"] as const;
export type Gender = "female" | "male" | "other" | "";
export type Occupation = "student" | "farmer" | "worker" | "street_vendor" | "business" | "unemployed" | "retired" | "homemaker" | "";
export type Income = "bpl" | "under_2_5l" | "under_9l" | "above_9l" | "";
export type Area = "rural" | "urban" | "";
export type YesNo = "yes" | "no" | "";

export type Profile = {
  state: string; age: number | null; gender: Gender; occupation: Occupation; income: Income;
  area: Area; disability: YesNo; needs: Category[];
};

type Check = { ok: boolean | null; reason: string; missing: string };
type Rule = (p: Profile) => Check[];

const pass = (reason: string): Check => ({ ok: true, reason, missing: "" });
const fail: Check = { ok: false, reason: "", missing: "" };
const unknown = (missing: string): Check => ({ ok: null, reason: "", missing });
const lowIncome = (p: Profile, limit: "bpl" | "under_2_5l" | "under_9l") => {
  if (!p.income) return unknown("income");
  const order = ["bpl", "under_2_5l", "under_9l", "above_9l"];
  return order.indexOf(p.income) <= order.indexOf(limit) ? pass(`income_${limit}`) : fail;
};
const occ = (p: Profile, list: Occupation[], code: string) => (!p.occupation ? unknown("occupation") : list.includes(p.occupation) ? pass(code) : fail);
const female = (p: Profile) => (!p.gender ? unknown("gender") : p.gender === "female" ? pass("female") : fail);
const area = (p: Profile, a: Area) => (!p.area ? unknown("area") : p.area === a ? pass(`area_${a}`) : fail);

/** Mandatory conditions per scheme (beyond state + age, which come from the scheme record). */
export const RULES: Record<string, Rule> = {
  "pm-kisan": (p) => [occ(p, ["farmer"], "farmer")],
  pmfby: (p) => [occ(p, ["farmer"], "farmer")],
  "ayushman-bharat": (p) => [p.age !== null && p.age >= 70 ? pass("age70") : lowIncome(p, "bpl")],
  pmmvy: (p) => [female(p)],
  "pmay-g": (p) => [area(p, "rural"), lowIncome(p, "under_2_5l")],
  "pmay-u": (p) => [area(p, "urban"), lowIncome(p, "under_9l")],
  "nsp-post-matric": (p) => [occ(p, ["student"], "student"), lowIncome(p, "under_2_5l")],
  "kerala-vidyajyothi": (p) => [occ(p, ["student"], "student"), !p.disability ? unknown("disability") : p.disability === "yes" ? pass("disability") : fail, lowIncome(p, "under_2_5l")],
  mgnrega: (p) => [area(p, "rural")],
  "pm-mudra": (p) => [occ(p, ["business", "street_vendor", "unemployed", "homemaker"], "business")],
  "pm-svanidhi": (p) => [occ(p, ["street_vendor"], "vendor")],
  ignoaps: (p) => [lowIncome(p, "bpl")],
  "sukanya-samriddhi": (p) => [female(p)],
  "tn-pudhumai-penn": (p) => [female(p), occ(p, ["student"], "student")],
  "mh-ladki-bahin": (p) => [female(p), lowIncome(p, "under_2_5l")],
};

export type Match = { slug: string; match: "strong" | "possible"; reasons: string[]; missing: string[]; score: number };

export function matchSchemes(p: Profile, list: Scheme[] = SCHEMES): Match[] {
  const out: Match[] = [];
  for (const s of list) {
    const checks: Check[] = [];
    // State coverage
    if (s.location !== "All India") checks.push(!p.state ? unknown("state") : p.state === s.location ? pass("state") : fail);
    else checks.push(pass("nationwide"));
    // Age
    if (s.minAge !== undefined || s.maxAge !== undefined) {
      if (p.age === null) checks.push(unknown("age"));
      else checks.push(p.age >= (s.minAge ?? 0) && p.age <= (s.maxAge ?? 200) ? pass("age") : fail);
    }
    checks.push(...(RULES[s.slug]?.(p) ?? []));
    if (checks.some((c) => c.ok === false)) continue;
    const missing = [...new Set(checks.filter((c) => c.ok === null).map((c) => c.missing))];
    const reasons = checks.filter((c) => c.ok).map((c) => c.reason);
    const needHit = p.needs.includes(s.category);
    if (needHit) reasons.push("need");
    // Without any stated need, only show schemes whose specific conditions were confirmed.
    if (!needHit && p.needs.length > 0 && missing.length > 0) continue;
    const confirmed = checks.filter((c) => c.ok).length;
    out.push({ slug: s.slug, match: missing.length === 0 ? "strong" : "possible", reasons, missing, score: (needHit ? 10 : 0) + confirmed * 2 - missing.length * 3 });
  }
  return out.sort((a, b) => b.score - a.score);
}

type L = Record<string, string>;
const REASONS: Record<Lang, L> = {
  en: { state: "You live in the state this scheme covers", nationwide: "Available across India", age: "Your age is within the scheme's age limit", farmer: "You are a farmer", student: "You are a student", female: "This scheme is for women and girls", age70: "Everyone aged 70+ is covered", income_bpl: "Your household is below the poverty line", income_under_2_5l: "Your family income is within ₹2.5 lakh", income_under_9l: "Your family income is within ₹9 lakh", area_rural: "You live in a rural area", area_urban: "You live in a city or town", disability: "You have a disability of 40% or more", business: "You run or want to start a small business", vendor: "You are a street vendor", need: "It matches what you said you need" },
  ta: { state: "இத்திட்டம் உள்ள மாநிலத்தில் நீங்கள் வசிக்கிறீர்கள்", nationwide: "இந்தியா முழுவதும் கிடைக்கும்", age: "உங்கள் வயது திட்டத்தின் வரம்பிற்குள் உள்ளது", farmer: "நீங்கள் விவசாயி", student: "நீங்கள் மாணவர்", female: "இத்திட்டம் பெண்களுக்கும் சிறுமிகளுக்கும்", age70: "70 வயதுக்கு மேற்பட்ட அனைவருக்கும்", income_bpl: "உங்கள் குடும்பம் வறுமைக் கோட்டிற்குக் கீழ் உள்ளது", income_under_2_5l: "குடும்ப வருமானம் ₹2.5 லட்சத்திற்குள்", income_under_9l: "குடும்ப வருமானம் ₹9 லட்சத்திற்குள்", area_rural: "நீங்கள் கிராமப்புறத்தில் வசிக்கிறீர்கள்", area_urban: "நீங்கள் நகரத்தில் வசிக்கிறீர்கள்", disability: "உங்களுக்கு 40% அல்லது அதற்கு மேல் மாற்றுத்திறன் உள்ளது", business: "நீங்கள் சிறு தொழில் செய்கிறீர்கள் அல்லது தொடங்க விரும்புகிறீர்கள்", vendor: "நீங்கள் தெருவோர வியாபாரி", need: "நீங்கள் கூறிய தேவையுடன் பொருந்துகிறது" },
  hi: { state: "आप उस राज्य में रहते हैं जहाँ यह योजना है", nationwide: "पूरे भारत में उपलब्ध", age: "आपकी उम्र योजना की सीमा में है", farmer: "आप किसान हैं", student: "आप छात्र हैं", female: "यह योजना महिलाओं और लड़कियों के लिए है", age70: "70+ उम्र के सभी लोग शामिल हैं", income_bpl: "आपका परिवार गरीबी रेखा से नीचे है", income_under_2_5l: "परिवार की आय ₹2.5 लाख के भीतर है", income_under_9l: "परिवार की आय ₹9 लाख के भीतर है", area_rural: "आप ग्रामीण क्षेत्र में रहते हैं", area_urban: "आप शहर में रहते हैं", disability: "आपको 40% या अधिक दिव्यांगता है", business: "आप छोटा व्यवसाय चलाते हैं या शुरू करना चाहते हैं", vendor: "आप रेहड़ी-पटरी विक्रेता हैं", need: "यह आपकी बताई ज़रूरत से मेल खाती है" },
};
const MISSING: Record<Lang, L> = {
  en: { state: "your state", age: "your age", gender: "your gender", occupation: "your occupation", income: "your family income", area: "rural or urban", disability: "disability status" },
  ta: { state: "உங்கள் மாநிலம்", age: "உங்கள் வயது", gender: "உங்கள் பாலினம்", occupation: "உங்கள் தொழில்", income: "குடும்ப வருமானம்", area: "கிராமம் அல்லது நகரம்", disability: "மாற்றுத்திறன் நிலை" },
  hi: { state: "आपका राज्य", age: "आपकी उम्र", gender: "आपका लिंग", occupation: "आपका काम", income: "परिवार की आय", area: "ग्रामीण या शहरी", disability: "दिव्यांगता की स्थिति" },
};
export const reasonText = (code: string, lang: Lang) => REASONS[lang][code] ?? REASONS.en[code] ?? code;
export const missingText = (code: string, lang: Lang) => MISSING[lang][code] ?? MISSING.en[code] ?? code;

export const FORM: Record<Lang, L> = {
  en: { state: "STATE", age: "AGE", gender: "GENDER", occupation: "OCCUPATION", income: "FAMILY INCOME (YEAR)", area: "AREA", disability: "DISABILITY (40%+)", needs: "WHAT DO YOU NEED HELP WITH?", unknown: "Prefer not to say", female: "Female", male: "Male", other: "Other", student: "Student", farmer: "Farmer", worker: "Daily-wage / worker", street_vendor: "Street vendor", business: "Small business", unemployed: "Unemployed", retired: "Retired", homemaker: "Homemaker", bpl: "Below poverty line (BPL)", under_2_5l: "Up to ₹2.5 lakh", under_9l: "₹2.5–9 lakh", above_9l: "Above ₹9 lakh", rural: "Rural / village", urban: "City / town", yes: "Yes", no: "No", Other: "Other state", why: "Why this matches you", missing: "Tell us {x} to confirm this.", none: "No schemes match these answers. Try changing an answer or leaving it as 'Prefer not to say'.", note: "Based on SAHAAYA's scheme rules, which are not yet verified against official documents. Always confirm with the official office.", find: "SHOW MY SCHEMES" },
  ta: { state: "மாநிலம்", age: "வயது", gender: "பாலினம்", occupation: "தொழில்", income: "குடும்ப ஆண்டு வருமானம்", area: "பகுதி", disability: "மாற்றுத்திறன் (40%+)", needs: "எதற்கு உதவி தேவை?", unknown: "சொல்ல விரும்பவில்லை", female: "பெண்", male: "ஆண்", other: "மற்றவை", student: "மாணவர்", farmer: "விவசாயி", worker: "கூலித் தொழிலாளி", street_vendor: "தெருவோர வியாபாரி", business: "சிறு தொழில்", unemployed: "வேலையில்லை", retired: "ஓய்வு பெற்றவர்", homemaker: "இல்லத்தரசி", bpl: "வறுமைக் கோட்டிற்குக் கீழ் (BPL)", under_2_5l: "₹2.5 லட்சம் வரை", under_9l: "₹2.5–9 லட்சம்", above_9l: "₹9 லட்சத்திற்கு மேல்", rural: "கிராமம்", urban: "நகரம்", yes: "ஆம்", no: "இல்லை", Other: "பிற மாநிலம்", why: "இது ஏன் உங்களுக்குப் பொருந்துகிறது", missing: "உறுதிப்படுத்த {x} தெரிவிக்கவும்.", none: "இந்த பதில்களுக்கு எந்தத் திட்டமும் பொருந்தவில்லை. ஒரு பதிலை மாற்றிப் பாருங்கள்.", note: "SAHAAYA திட்ட விதிகளின் அடிப்படையில்; இவை இன்னும் அதிகாரப்பூர்வ ஆவணங்களுடன் சரிபார்க்கப்படவில்லை. அதிகாரப்பூர்வ அலுவலகத்தில் உறுதிப்படுத்துங்கள்.", find: "என் திட்டங்களைக் காட்டு" },
  hi: { state: "राज्य", age: "उम्र", gender: "लिंग", occupation: "काम", income: "परिवार की सालाना आय", area: "क्षेत्र", disability: "दिव्यांगता (40%+)", needs: "किस चीज़ में मदद चाहिए?", unknown: "नहीं बताना चाहते", female: "महिला", male: "पुरुष", other: "अन्य", student: "छात्र", farmer: "किसान", worker: "दिहाड़ी मज़दूर", street_vendor: "रेहड़ी-पटरी विक्रेता", business: "छोटा व्यवसाय", unemployed: "बेरोज़गार", retired: "सेवानिवृत्त", homemaker: "गृहिणी", bpl: "गरीबी रेखा से नीचे (BPL)", under_2_5l: "₹2.5 लाख तक", under_9l: "₹2.5–9 लाख", above_9l: "₹9 लाख से अधिक", rural: "गाँव", urban: "शहर", yes: "हाँ", no: "नहीं", Other: "अन्य राज्य", why: "यह आपसे क्यों मेल खाती है", missing: "पुष्टि के लिए {x} बताएँ।", none: "इन जवाबों से कोई योजना मेल नहीं खाती। कोई जवाब बदलकर देखें।", note: "SAHAAYA के योजना नियमों पर आधारित, जो अभी आधिकारिक दस्तावेज़ों से सत्यापित नहीं हैं। आधिकारिक कार्यालय से पुष्टि करें।", find: "मेरी योजनाएँ दिखाएँ" },
};
