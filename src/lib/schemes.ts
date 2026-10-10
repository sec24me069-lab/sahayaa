export type Category = "Education" | "Health" | "Housing" | "Livelihood" | "Agriculture" | "Social security";
export type Audience = "Students" | "Farmers" | "Women" | "Senior citizens" | "Low income" | "Workers" | "Entrepreneurs";

export type Scheme = {
  slug: string;
  name: string;
  category: Category;
  /** "All India" or a state name */
  location: string;
  audiences: Audience[];
  minAge?: number;
  maxAge?: number;
  summary: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  steps: string[];
  /** Official portal for this scheme */
  source: string;
  /** ISO date the details were last checked against the official source; null = not yet verified */
  verifiedOn: string | null;
};

export const CATEGORIES: Category[] = ["Education", "Health", "Housing", "Livelihood", "Agriculture", "Social security"];
export const AUDIENCES: Audience[] = ["Students", "Farmers", "Women", "Senior citizens", "Low income", "Workers", "Entrepreneurs"];

export const SCHEMES: Scheme[] = [
  {
    slug: "pm-kisan", source: "https://pmkisan.gov.in", verifiedOn: null, name: "PM-KISAN Samman Nidhi", category: "Agriculture", location: "All India", audiences: ["Farmers", "Low income"], minAge: 18,
    summary: "Direct income support of ₹6,000 a year for landholding farmer families.",
    eligibility: ["Farmer family owning cultivable land in their name", "Not an income-tax payer", "Not a serving or retired government employee (Group D excepted)"],
    benefits: ["₹6,000 per year paid in three instalments of ₹2,000", "Money sent directly to your bank account"],
    documents: ["Aadhaar card", "Land ownership records", "Bank account linked to Aadhaar"],
    steps: ["Visit the PM-KISAN portal or your nearest Common Service Centre", "Choose 'New Farmer Registration' and enter Aadhaar", "Fill land and bank details", "Complete e-KYC with OTP or biometrics", "Track status on the portal"],
  },
  {
    slug: "pmfby", source: "https://pmfby.gov.in", verifiedOn: null, name: "Pradhan Mantri Fasal Bima Yojana", category: "Agriculture", location: "All India", audiences: ["Farmers"], minAge: 18,
    summary: "Low-premium crop insurance against drought, flood, pests and other losses.",
    eligibility: ["Farmers growing notified crops in notified areas", "Includes tenant farmers and sharecroppers"],
    benefits: ["Premium only 2% for kharif, 1.5% for rabi, 5% for commercial crops", "Full claim for crop loss from natural calamities"],
    documents: ["Aadhaar card", "Land records or tenancy agreement", "Bank passbook", "Sowing certificate"],
    steps: ["Apply through your bank, CSC or the PMFBY portal before the cut-off date", "Select crop and season", "Pay your share of the premium", "Report any crop loss within 72 hours"],
  },
  {
    slug: "ayushman-bharat", source: "https://beneficiary.nha.gov.in", verifiedOn: null, name: "Ayushman Bharat PM-JAY", category: "Health", location: "All India", audiences: ["Low income", "Senior citizens"],
    summary: "Free hospital treatment up to ₹5 lakh per family per year.",
    eligibility: ["Families listed in SECC 2011 deprivation criteria", "All citizens aged 70 and above, regardless of income", "Holders of eligible ration cards in participating states"],
    benefits: ["Cashless treatment up to ₹5 lakh per family per year", "Covers 1,900+ procedures in public and empanelled private hospitals", "Pre- and post-hospitalisation costs included"],
    documents: ["Aadhaar card", "Ration card", "Mobile number"],
    steps: ["Check eligibility on the PM-JAY website or at a CSC", "Verify identity with Aadhaar", "Download your Ayushman card", "Show the card at any empanelled hospital"],
  },
  {
    slug: "pmmvy", source: "https://pmmvy.wcd.gov.in", verifiedOn: null, name: "Pradhan Mantri Matru Vandana Yojana", category: "Health", location: "All India", audiences: ["Women", "Low income"], minAge: 19,
    summary: "Cash support for pregnant women and new mothers.",
    eligibility: ["Pregnant women and lactating mothers aged 19 or above", "First child, or second child if a girl", "Not employed with central or state government"],
    benefits: ["₹5,000 for the first child in instalments", "₹6,000 for a second child if she is a girl"],
    documents: ["Aadhaar card", "Mother & Child Protection card", "Bank account details", "Child's birth certificate (for later instalment)"],
    steps: ["Register at your Anganwadi centre or health facility", "Submit the form with documents", "Complete required health check-ups", "Receive instalments in your bank account"],
  },
  {
    slug: "pmay-g", source: "https://pmayg.nic.in", verifiedOn: null, name: "Pradhan Mantri Awas Yojana – Gramin", category: "Housing", location: "All India", audiences: ["Low income"], minAge: 18,
    summary: "Financial help to build a pucca house for rural families without one.",
    eligibility: ["Rural household without a pucca house", "Listed in SECC data or approved by Gram Sabha", "No family member in government job or paying income tax"],
    benefits: ["₹1.2 lakh in plains, ₹1.3 lakh in hilly areas", "90 days of MGNREGA wages for construction", "Toilet support through Swachh Bharat"],
    documents: ["Aadhaar card", "Job card (MGNREGA)", "Bank account details", "Swachh Bharat Mission number"],
    steps: ["Check your name on the beneficiary list with the Gram Panchayat", "Get geo-tagged photos of the current house", "Submit documents through the block office", "Receive funds in stages as construction progresses"],
  },
  {
    slug: "pmay-u", source: "https://pmay-urban.gov.in", verifiedOn: null, name: "Pradhan Mantri Awas Yojana – Urban 2.0", category: "Housing", location: "All India", audiences: ["Low income"], minAge: 18,
    summary: "Support to buy, build or rent an affordable home in cities.",
    eligibility: ["Urban family without a pucca house anywhere in India", "Annual household income up to ₹9 lakh", "Economically weaker, low or middle income group"],
    benefits: ["Up to ₹2.5 lakh assistance for construction", "Interest subsidy on home loans", "Affordable rental housing options"],
    documents: ["Aadhaar card", "Income certificate", "Bank account details", "Land documents (for construction)"],
    steps: ["Apply on the PMAY-U portal", "Fill household and income details", "Verification by urban local body", "Receive assistance after approval"],
  },
  {
    slug: "nsp-post-matric", source: "https://scholarships.gov.in", verifiedOn: null, name: "Post-Matric Scholarship (NSP)", category: "Education", location: "All India", audiences: ["Students", "Low income"], minAge: 15, maxAge: 30,
    summary: "Scholarships for students in Class 11 to postgraduate studies.",
    eligibility: ["Studying Class 11 or above in a recognised institution", "Family income within the scheme limit (usually ₹2.5 lakh)", "Passed previous exam with required marks"],
    benefits: ["Tuition and non-refundable fees reimbursed", "Monthly maintenance allowance"],
    documents: ["Aadhaar card", "Income certificate", "Previous mark sheet", "Fee receipt", "Bank account in student's name"],
    steps: ["Register on the National Scholarship Portal", "Fill the application and upload documents", "Institute verifies your application", "Scholarship paid to your bank account"],
  },
  {
    slug: "kerala-vidyajyothi", source: "https://suneethi.sjd.kerala.gov.in", verifiedOn: null, name: "Vidyajyothi Scholarship", category: "Education", location: "Kerala", audiences: ["Students", "Low income"], minAge: 6, maxAge: 25,
    summary: "Study support for students with disabilities from low-income families in Kerala.",
    eligibility: ["Resident of Kerala", "Student with 40% or more disability", "Family income below state limit"],
    benefits: ["Yearly grant for books, uniforms and study material"],
    documents: ["Disability certificate", "Income certificate", "School certificate", "Bank details"],
    steps: ["Apply through the Suneethi portal of Kerala Social Justice Department", "Upload documents", "District officer verifies", "Grant credited to your bank"],
  },
  {
    slug: "mgnrega", source: "https://nrega.nic.in", verifiedOn: null, name: "MGNREGA Rural Employment", category: "Livelihood", location: "All India", audiences: ["Workers", "Low income"], minAge: 18,
    summary: "Guaranteed 100 days of paid work every year for rural households.",
    eligibility: ["Adult member of a rural household", "Willing to do unskilled manual work"],
    benefits: ["At least 100 days of wage employment per household per year", "Wages paid directly to bank within 15 days", "Unemployment allowance if work isn't given in 15 days"],
    documents: ["Aadhaar card", "Photograph", "Bank account details"],
    steps: ["Apply for a job card at your Gram Panchayat", "Receive job card within 15 days", "Submit written request for work", "Work is allotted within 5 km where possible"],
  },
  {
    slug: "pm-mudra", source: "https://www.mudra.org.in", verifiedOn: null, name: "PM Mudra Yojana", category: "Livelihood", location: "All India", audiences: ["Entrepreneurs", "Women"], minAge: 18,
    summary: "Collateral-free business loans up to ₹20 lakh for small enterprises.",
    eligibility: ["Indian citizen with a non-farm small business plan", "Manufacturing, trading, services or allied agriculture activities"],
    benefits: ["Shishu up to ₹50,000, Kishore up to ₹5 lakh, Tarun up to ₹20 lakh", "No collateral required"],
    documents: ["Aadhaar and PAN", "Business plan or proof of business", "Address proof", "Bank statements"],
    steps: ["Approach any bank, NBFC or the Udyam Mitra portal", "Choose loan category", "Submit application and business plan", "Loan disbursed after appraisal"],
  },
  {
    slug: "pm-svanidhi", source: "https://pmsvanidhi.mohua.gov.in", verifiedOn: null, name: "PM SVANidhi", category: "Livelihood", location: "All India", audiences: ["Workers", "Low income", "Entrepreneurs"], minAge: 18,
    summary: "Small working-capital loans for street vendors.",
    eligibility: ["Street vendor with a certificate of vending or recommendation letter from urban local body"],
    benefits: ["Loans of ₹15,000, then ₹25,000, then ₹50,000", "7% interest subsidy", "Cashback on digital payments"],
    documents: ["Aadhaar card", "Vending certificate or LoR", "Bank account details"],
    steps: ["Apply on the PM SVANidhi portal or at a CSC", "Get Letter of Recommendation if needed", "Bank processes the loan", "Repay on time to unlock the next loan"],
  },
  {
    slug: "ignoaps", source: "https://nsap.nic.in", verifiedOn: null, name: "Indira Gandhi National Old Age Pension", category: "Social security", location: "All India", audiences: ["Senior citizens", "Low income"], minAge: 60,
    summary: "Monthly pension for senior citizens from below-poverty-line families.",
    eligibility: ["Aged 60 or above", "Belongs to a below-poverty-line household"],
    benefits: ["₹200 per month (age 60–79) from the centre", "₹500 per month at 80+", "States add their own top-up"],
    documents: ["Age proof", "BPL card", "Aadhaar card", "Bank account details"],
    steps: ["Apply at the Gram Panchayat, municipality or social welfare office", "Submit age and BPL proof", "Verification by local officials", "Pension credited monthly"],
  },
  {
    slug: "sukanya-samriddhi", source: "https://www.indiapost.gov.in", verifiedOn: null, name: "Sukanya Samriddhi Yojana", category: "Social security", location: "All India", audiences: ["Women"], maxAge: 10,
    summary: "High-interest savings account for a girl child's future.",
    eligibility: ["Girl child aged below 10", "Opened by parent or legal guardian", "Maximum two accounts per family"],
    benefits: ["Among the highest small-savings interest rates", "Tax-free returns under Section 80C", "Matures when the girl turns 21"],
    documents: ["Girl's birth certificate", "Parent's Aadhaar and PAN", "Address proof"],
    steps: ["Visit a post office or authorised bank", "Fill the account opening form", "Deposit at least ₹250", "Deposit yearly for 15 years"],
  },
  {
    slug: "tn-pudhumai-penn", source: "https://www.pudhumaipenn.tn.gov.in", verifiedOn: null, name: "Pudhumai Penn Scheme", category: "Education", location: "Tamil Nadu", audiences: ["Students", "Women"], minAge: 17, maxAge: 25,
    summary: "₹1,000 a month for girls from government schools pursuing higher education.",
    eligibility: ["Girl who studied Class 6–12 in a Tamil Nadu government school", "Enrolled in an undergraduate, diploma or ITI course"],
    benefits: ["₹1,000 per month until course completion"],
    documents: ["School certificates", "College admission proof", "Aadhaar card", "Bank account"],
    steps: ["Apply through your college on the Pudhumai Penn portal", "College verifies enrolment", "Monthly amount paid to your bank"],
  },
  {
    slug: "mh-ladki-bahin", source: "https://ladakibahin.maharashtra.gov.in", verifiedOn: null, name: "Mukhyamantri Majhi Ladki Bahin", category: "Social security", location: "Maharashtra", audiences: ["Women", "Low income"], minAge: 21, maxAge: 65,
    summary: "Monthly financial support for women in Maharashtra.",
    eligibility: ["Woman resident of Maharashtra aged 21–65", "Family income below ₹2.5 lakh a year", "Married, widowed, divorced or destitute"],
    benefits: ["₹1,500 per month directly to bank"],
    documents: ["Aadhaar card", "Domicile certificate", "Income certificate", "Bank passbook"],
    steps: ["Apply on the Nari Shakti Doot app or at the Anganwadi", "Upload documents", "Verification by local authority", "Monthly payment begins"],
  },
];

export const LOCATIONS = ["All India", ...Array.from(new Set(SCHEMES.map((s) => s.location).filter((l) => l !== "All India"))).sort()];

export function getScheme(slug: string) {
  return SCHEMES.find((s) => s.slug === slug);
}

export function filterSchemes(list: Scheme[], f: { category?: string; location?: string; audience?: string }) {
  return list.filter(
    (s) =>
      (!f.category || s.category === f.category) &&
      // a state filter also includes nationwide schemes
      (!f.location || s.location === f.location || (f.location !== "All India" && s.location === "All India")) &&
      (!f.audience || s.audiences.includes(f.audience as Audience)),
  );
}
