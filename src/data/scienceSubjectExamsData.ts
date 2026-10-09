import { ExamQuestion } from './mockExamData';
import { SS2_SCIENCE_MOCK_QUESTIONS } from './scienceMockExamData';

// Extract pure physics questions (1-17 from science mock)
const PHYSICS_QUESTIONS_CORE: ExamQuestion[] = SS2_SCIENCE_MOCK_QUESTIONS.slice(0, 17);

// Extract pure chemistry questions (18-34 from science mock)
const CHEMISTRY_QUESTIONS_CORE: ExamQuestion[] = SS2_SCIENCE_MOCK_QUESTIONS.slice(17, 34);

// Extract pure biology questions (35-50 from science mock)
const BIOLOGY_QUESTIONS_CORE: ExamQuestion[] = SS2_SCIENCE_MOCK_QUESTIONS.slice(34, 50);

/**
 * CHEMISTRY CBT EXAM QUESTIONS (Pure Chemistry Paper)
 */
export const CHEMISTRY_CBT_QUESTIONS: ExamQuestion[] = [
  ...CHEMISTRY_QUESTIONS_CORE.map((q, idx) => ({ ...q, id: 500 + idx, questionNumber: idx + 1 })),
  {
    id: 518,
    questionNumber: 18,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Separation Techniques',
    questionText: 'Which technique is most suitable for separating a mixture of two miscible liquids with close boiling points?',
    options: {
      A: 'Fractional distillation',
      B: 'Simple distillation',
      C: 'Chromatography',
      D: 'Filtration'
    },
    correctAnswer: 'A',
    explanation: 'Fractional distillation separates miscible liquids that have close boiling points using a fractionating column.'
  },
  {
    id: 519,
    questionNumber: 19,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Kinetic Theory of Matter',
    questionText: 'According to Graham\'s law of diffusion, the rate of diffusion of a gas is inversely proportional to the:',
    options: {
      A: 'Square root of its molar mass',
      B: 'Square of its density',
      C: 'Absolute temperature',
      D: 'Direct pressure exerted'
    },
    correctAnswer: 'A',
    explanation: 'Graham\'s Law states that at constant temperature and pressure, the rate of diffusion of a gas is inversely proportional to the square root of its density or molar mass.'
  },
  {
    id: 520,
    questionNumber: 20,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Qualitative Analysis',
    questionText: 'When aqueous sodium hydroxide is added dropwise to a solution of zinc ions, Zn²⁺, a white gelatinous precipitate forms which:',
    options: {
      A: 'Is insoluble in excess NaOH',
      B: 'Dissolves in excess NaOH to form a colorless complex ion',
      C: 'Turns blue upon standing',
      D: 'Evolves ammonia gas without warming'
    },
    correctAnswer: 'B',
    explanation: 'Zn²⁺ gives a white precipitate of Zn(OH)₂ with NaOH, which readily redissolves in excess NaOH to form soluble sodium tetrahydroxozincate (II) [Zn(OH)4]²⁻.'
  },
  {
    id: 521,
    questionNumber: 21,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Environmental Chemistry',
    questionText: 'Which oxide of nitrogen is primarily responsible for photochemical smog and acid rain?',
    options: {
      A: 'Nitrogen (IV) oxide (NO2)',
      B: 'Dinitrogen oxide (N2O)',
      C: 'Nitrogen (II) oxide (NO)',
      D: 'Dinitrogen trioxide (N2O3)'
    },
    correctAnswer: 'A',
    explanation: 'NO2 (nitrogen dioxide) is a toxic reddish-brown gas that reacts with sunlight and atmospheric water to produce acid rain and photochemical smog.'
  },
  {
    id: 522,
    questionNumber: 22,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Nuclear Chemistry',
    questionText: 'An element has a half-life of 4 days. What fraction of the original radioactive substance remains after 12 days?',
    options: {
      A: '1/2',
      B: '1/4',
      C: '1/8',
      D: '1/16'
    },
    correctAnswer: 'C',
    explanation: '12 days / 4 days per half-life = 3 half-lives. Fraction remaining = (1/2)^3 = 1/8.'
  },
  {
    id: 523,
    questionNumber: 23,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Thermochemistry',
    questionText: 'A chemical reaction in which heat is absorbed from the surroundings is designated as:',
    options: {
      A: 'Exothermic with Delta H < 0',
      B: 'Endothermic with Delta H > 0',
      C: 'Isothermal with Delta H = 0',
      D: 'Adiabatic'
    },
    correctAnswer: 'B',
    explanation: 'Endothermic reactions absorb heat energy from their surroundings, characterized by a positive enthalpy change (Delta H > 0).'
  },
  {
    id: 524,
    questionNumber: 24,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Electrochemistry',
    questionText: 'During the electrolysis of acidified water using platinum electrodes, the gas liberated at the anode is:',
    options: {
      A: 'Hydrogen gas (H2)',
      B: 'Oxygen gas (O2)',
      C: 'Chlorine gas (Cl2)',
      D: 'Nitrogen gas (N2)'
    },
    correctAnswer: 'B',
    explanation: 'At the anode (positive electrode), hydroxide ions (OH⁻) are discharged in preference to sulfate or nitrate ions, liberating oxygen gas (O2).'
  },
  {
    id: 525,
    questionNumber: 25,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Organic Functional Groups',
    questionText: 'What is the characteristic functional group of alkanoic acids (carboxylic acids)?',
    options: {
      A: '-OH (hydroxyl)',
      B: '-CHO (carbonyl)',
      C: '-COOH (carboxyl)',
      D: '-CO- (ketone)'
    },
    correctAnswer: 'C',
    explanation: 'Carboxylic or alkanoic acids possess the carboxyl group, -COOH.'
  }
];

/**
 * BIOLOGY CBT EXAM QUESTIONS (Pure Biology Paper)
 */
export const BIOLOGY_CBT_QUESTIONS: ExamQuestion[] = [
  ...BIOLOGY_QUESTIONS_CORE.map((q, idx) => ({ ...q, id: 600 + idx, questionNumber: idx + 1 })),
  {
    id: 617,
    questionNumber: 17,
    section: 'biology',
    sectionTitle: 'Biology: Cell Division',
    questionText: 'During which stage of mitosis do sister chromatids separate and move towards opposite poles of the cell?',
    options: {
      A: 'Prophase',
      B: 'Metaphase',
      C: 'Anaphase',
      D: 'Telophase'
    },
    correctAnswer: 'C',
    explanation: 'In anaphase, the centromere divides and sister chromatids are pulled apart toward opposite spindle poles by shortening spindle fibers.'
  },
  {
    id: 618,
    questionNumber: 18,
    section: 'biology',
    sectionTitle: 'Biology: Ecology & Food Chains',
    questionText: 'In any ecological pyramid of energy, the trophic level with the highest available energy is always the:',
    options: {
      A: 'Primary producers (autotrophs)',
      B: 'Primary consumers (herbivores)',
      C: 'Secondary consumers (carnivores)',
      D: 'Apex predators'
    },
    correctAnswer: 'A',
    explanation: 'Green plants and photosynthetic autotrophs trap sunlight directly and contain 100% of the initial energy; roughly 90% is dissipated as heat at each succeeding trophic step.'
  },
  {
    id: 619,
    questionNumber: 19,
    section: 'biology',
    sectionTitle: 'Biology: Human Physiology',
    questionText: 'Which hormone is secreted by the beta cells of the Islets of Langerhans to lower blood glucose levels?',
    options: {
      A: 'Glucagon',
      B: 'Insulin',
      C: 'Adrenaline',
      D: 'Thyroxine'
    },
    correctAnswer: 'B',
    explanation: 'Insulin stimulates liver and skeletal muscle cells to convert excess circulating glucose into glycogen for storage.'
  },
  {
    id: 620,
    questionNumber: 20,
    section: 'biology',
    sectionTitle: 'Biology: Genetics & Heredity',
    questionText: 'If a heterozygous tall pea plant (Tt) is crossed with a homozygous short pea plant (tt), what percentage of offspring will be short?',
    options: {
      A: '25%',
      B: '50%',
      C: '75%',
      D: '100%'
    },
    correctAnswer: 'B',
    explanation: 'Cross Tt × tt produces gametes: T and t from one parent; t from the other. Offspring are 50% Tt (tall) and 50% tt (short).'
  },
  {
    id: 621,
    questionNumber: 21,
    section: 'biology',
    sectionTitle: 'Biology: Excretion',
    questionText: 'The functional microscopic filtering unit of the human kidney is the:',
    options: {
      A: 'Neuron',
      B: 'Nephron',
      C: 'Alveolus',
      D: 'Villus'
    },
    correctAnswer: 'B',
    explanation: 'The nephron is the microscopic structural and functional filtering unit of the kidney consisting of Bowman\'s capsule, glomerulus, and renal tubule.'
  },
  {
    id: 622,
    questionNumber: 22,
    section: 'biology',
    sectionTitle: 'Biology: Transport in Plants',
    questionText: 'The upward conduction of water and dissolved mineral salts from plant roots to leaves is executed by:',
    options: {
      A: 'Xylem tissue',
      B: 'Phloem tissue',
      C: 'Cambium tissue',
      D: 'Pith'
    },
    correctAnswer: 'A',
    explanation: 'Xylem transports water and dissolved mineral ions upward from root systems; phloem translocates manufactured sugars bidirectionally.'
  },
  {
    id: 623,
    questionNumber: 23,
    section: 'biology',
    sectionTitle: 'Biology: Respiratory System',
    questionText: 'The respiratory organ in adult amphibians while resting on land is primarily the:',
    options: {
      A: 'Gills and fins',
      B: 'Lungs and moist skin',
      C: 'Tracheal tubes',
      D: 'Book lungs'
    },
    correctAnswer: 'B',
    explanation: 'Adult amphibians respire using lungs, buccopharyngeal cavity, and their thin vascularized cutaneous (skin) membrane.'
  },
  {
    id: 624,
    questionNumber: 24,
    section: 'biology',
    sectionTitle: 'Biology: Evolution & Adaptation',
    questionText: 'The sudden, spontaneous, and heritable change in the DNA structure of an organism is termed:',
    options: {
      A: 'Mutation',
      B: 'Natural Selection',
      C: 'Adaptive Radiation',
      D: 'Speciation'
    },
    correctAnswer: 'A',
    explanation: 'A mutation is an alteration in nucleotide sequence or chromosome architecture that generates genetic variation.'
  },
  {
    id: 625,
    questionNumber: 25,
    section: 'biology',
    sectionTitle: 'Biology: Skeletal System',
    questionText: 'The joint between the humerus and scapula in the human shoulder is an example of a:',
    options: {
      A: 'Hinge joint',
      B: 'Ball and socket joint',
      C: 'Pivot joint',
      D: 'Gliding joint'
    },
    correctAnswer: 'B',
    explanation: 'The shoulder joint is a synovial ball and socket joint providing rotational motion in all planes.'
  }
];

/**
 * PHYSICS CBT EXAM QUESTIONS (Pure Physics Paper)
 */
export const PHYSICS_CBT_QUESTIONS: ExamQuestion[] = [
  ...PHYSICS_QUESTIONS_CORE.map((q, idx) => ({ ...q, id: 700 + idx, questionNumber: idx + 1 })),
  {
    id: 718,
    questionNumber: 18,
    section: 'physics',
    sectionTitle: 'Physics: Simple Harmonic Motion',
    questionText: 'The period T of a simple pendulum of length L undergoing small oscillations is given by:',
    options: {
      A: 'T = 2 * pi * sqrt(L / g)',
      B: 'T = 2 * pi * sqrt(g / L)',
      C: 'T = (1 / 2pi) * sqrt(L / g)',
      D: 'T = 2 * pi * (L / g)'
    },
    correctAnswer: 'A',
    explanation: 'For small amplitudes, the time period of a simple pendulum depends only on string length L and acceleration due to gravity g: T = 2 * pi * sqrt(L/g).'
  },
  {
    id: 719,
    questionNumber: 19,
    section: 'physics',
    sectionTitle: 'Physics: Wave Optics',
    questionText: 'The bending of light waves around corners or edges of an obstacle into the geometrical shadow region is called:',
    options: {
      A: 'Refraction',
      B: 'Diffraction',
      C: 'Polarization',
      D: 'Dispersion'
    },
    correctAnswer: 'B',
    explanation: 'Diffraction is the spreading or bending of wave fronts when they encounter an obstacle or narrow aperture comparable in size to their wavelength.'
  },
  {
    id: 720,
    questionNumber: 20,
    section: 'physics',
    sectionTitle: 'Physics: Thermal Physics',
    questionText: 'Calculate the heat energy required to raise the temperature of 2 kg of copper from 20°C to 70°C. (Specific heat capacity of copper = 400 J/kg·K).',
    options: {
      A: '20,000 J',
      B: '40,000 J',
      C: '80,000 J',
      D: '160,000 J'
    },
    correctAnswer: 'B',
    explanation: 'Q = mc(Delta T) = 2 kg * 400 J/kg·K * (70 - 20) K = 2 * 400 * 50 = 40,000 Joules.'
  },
  {
    id: 721,
    questionNumber: 21,
    section: 'physics',
    sectionTitle: 'Physics: Electric Circuits',
    questionText: 'Three resistors of 2 ohms, 3 ohms, and 6 ohms are connected in parallel. What is their effective total resistance?',
    options: {
      A: '1 ohm',
      B: '2 ohms',
      C: '11 ohms',
      D: '0.5 ohms'
    },
    correctAnswer: 'A',
    explanation: '1/R_total = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1. Thus R_total = 1 ohm.'
  },
  {
    id: 722,
    questionNumber: 22,
    section: 'physics',
    sectionTitle: 'Physics: Magnetism',
    questionText: 'The direction of an induced electromotive force (e.m.f.) always opposes the change producing it. This principle is:',
    options: {
      A: 'Faraday\'s Law',
      B: 'Lenz\'s Law',
      C: 'Coulomb\'s Law',
      D: 'Ampere\'s Law'
    },
    correctAnswer: 'B',
    explanation: 'Lenz\'s Law states that the polarity of induced e.m.f. produces an electric current whose magnetic flux opposes the initiating magnetic flux variation.'
  },
  {
    id: 723,
    questionNumber: 23,
    section: 'physics',
    sectionTitle: 'Physics: Modern Physics',
    questionText: 'In the photoelectric effect, electrons are emitted from a metal surface only when the frequency of incident radiation is greater than the:',
    options: {
      A: 'Critical angle',
      B: 'Threshold frequency (f0)',
      C: 'Harmonic frequency',
      D: 'Doppler frequency'
    },
    correctAnswer: 'B',
    explanation: 'The threshold (cutoff) frequency is the minimum radiation frequency capable of freeing photoelectrons with zero excess kinetic energy.'
  },
  {
    id: 724,
    questionNumber: 24,
    section: 'physics',
    sectionTitle: 'Physics: Pressure in Fluids',
    questionText: 'Atmospheric pressure at sea level is approximately 1.01 × 10^5 N/m². A barometer using mercury (density = 13,600 kg/m³) registers a column height of approximately:',
    options: {
      A: '76 mm Hg',
      B: '760 mm Hg (76 cm Hg)',
      C: '1000 mm Hg',
      D: '500 mm Hg'
    },
    correctAnswer: 'B',
    explanation: 'P = rho * g * h => 1.01 × 10^5 = 13,600 * 9.8 * h => h ≈ 0.76 metres = 760 mm Hg.'
  },
  {
    id: 725,
    questionNumber: 25,
    section: 'physics',
    sectionTitle: 'Physics: Energy & Momentum',
    questionText: 'An inelastic collision between two bodies is characterized by the conservation of:',
    options: {
      A: 'Both momentum and kinetic energy',
      B: 'Momentum only, while kinetic energy is not conserved',
      C: 'Kinetic energy only',
      D: 'Neither momentum nor energy'
    },
    correctAnswer: 'B',
    explanation: 'Linear momentum is universally conserved in all isolated collisions; however, kinetic energy is partially converted into internal thermal/sound energy during inelastic collisions.'
  }
];

/**
 * CIVIC EDUCATION CBT EXAM QUESTIONS (Civic Education for Science & General Students)
 */
export const CIVIC_EDUCATION_CBT_QUESTIONS: ExamQuestion[] = [
  {
    id: 801,
    questionNumber: 1,
    section: 'civic',
    sectionTitle: 'Values & National Consciousness',
    questionText: 'Which of the following values promotes peaceful co-existence and social harmony in a pluralistic society like Nigeria?',
    options: {
      A: 'Tribal nepotism',
      B: 'Tolerance and mutual respect',
      C: 'Religious intolerance',
      D: 'Electoral malpractice'
    },
    correctAnswer: 'B',
    explanation: 'Tolerance and mutual respect foster understanding, unity, and peaceful co-existence among people of diverse ethnic and religious groups.'
  },
  {
    id: 802,
    questionNumber: 2,
    section: 'civic',
    sectionTitle: 'Citizenship & Human Rights',
    questionText: 'Fundamental Human Rights in the 1999 Constitution of the Federal Republic of Nigeria are enshrined in:',
    options: {
      A: 'Chapter I',
      B: 'Chapter II',
      C: 'Chapter IV',
      D: 'Chapter VII'
    },
    correctAnswer: 'C',
    explanation: 'Chapter IV of the 1999 Nigerian Constitution provides for Fundamental Human Rights including the right to life, dignity, personal liberty, and fair hearing.'
  },
  {
    id: 803,
    questionNumber: 3,
    section: 'civic',
    sectionTitle: 'Rule of Law',
    questionText: 'The principle of the Rule of Law emphasizes that:',
    options: {
      A: 'The military is superior to civilian courts',
      B: 'All citizens, including government officials, are subject to the ordinary law of the land',
      C: 'Judges make laws without legislative approval',
      D: 'Wealthy individuals enjoy legal immunity'
    },
    correctAnswer: 'B',
    explanation: 'As conceptualized by A.V. Dicey, the Rule of Law means supremacy of regular law, equality before the law, and protection of citizen rights.'
  },
  {
    id: 804,
    questionNumber: 4,
    section: 'civic',
    sectionTitle: 'Democracy & Electoral Process',
    questionText: 'The official statutory body charged with organizing and conducting federal elections in Nigeria is:',
    options: {
      A: 'EFCC',
      B: 'ICPC',
      C: 'INEC',
      D: 'NPC'
    },
    correctAnswer: 'C',
    explanation: 'The Independent National Electoral Commission (INEC) is empowered by law to register voters, political parties, and conduct general elections in Nigeria.'
  },
  {
    id: 805,
    questionNumber: 5,
    section: 'civic',
    sectionTitle: 'Public Service & Ethics',
    questionText: 'Which government anti-corruption agency specializes in investigating financial crimes and money laundering in Nigeria?',
    options: {
      A: 'EFCC (Economic and Financial Crimes Commission)',
      B: 'FRSC',
      C: 'NDLEA',
      D: 'NEMA'
    },
    correctAnswer: 'A',
    explanation: 'The EFCC was established in 2003 specifically to investigate and prosecute advance fee fraud, money laundering, and economic financial crimes.'
  },
  {
    id: 806,
    questionNumber: 6,
    section: 'civic',
    sectionTitle: 'National Symbols & Identity',
    questionText: 'The green color in the Nigerian national flag symbolizes:',
    options: {
      A: 'Peace and unity',
      B: 'Agriculture and natural national wealth',
      C: 'Mineral resources',
      D: 'Rivers Niger and Benue'
    },
    correctAnswer: 'B',
    explanation: 'Designed by Michael Taiwo Akinkunmi in 1959, the green stripes represent Nigeria\'s fertile agriculture and rich natural abundance, while white represents peace and unity.'
  },
  {
    id: 807,
    questionNumber: 7,
    section: 'civic',
    sectionTitle: 'Duties and Obligations of Citizens',
    questionText: 'Which of the following is an obligatory civic duty of every eligible adult citizen?',
    options: {
      A: 'Payment of legitimate taxes and rates',
      B: 'Joining a political party',
      C: 'Traveling abroad for tourism',
      D: 'Building private secondary schools'
    },
    correctAnswer: 'A',
    explanation: 'Prompt payment of taxes, obeying laws, defending the nation, and voting during elections are fundamental constitutional duties of citizens.'
  },
  {
    id: 808,
    questionNumber: 8,
    section: 'civic',
    sectionTitle: 'Cultism & Youth Problems',
    questionText: 'The primary cause and driver of secret cultism among youths in educational institutions is:',
    options: {
      A: 'Academic excellence and discipline',
      B: 'Search for peer protection, intimidation, and false social power',
      C: 'Desire to uphold religious virtues',
      D: 'Patriotic youth service'
    },
    correctAnswer: 'B',
    explanation: 'Students are often lured into campus and school cults through false promises of protection, status, intimidation, and distorted brotherhood.'
  },
  {
    id: 809,
    questionNumber: 9,
    section: 'civic',
    sectionTitle: 'Drug Abuse & Trafficking',
    questionText: 'Which law enforcement agency in Nigeria is constitutionally mandated to eradicate illicit drug trafficking and abuse?',
    options: {
      A: 'NDLEA (National Drug Law Enforcement Agency)',
      B: 'NAFDAC',
      C: 'Nigeria Customs Service',
      D: 'Immigration Service'
    },
    correctAnswer: 'A',
    explanation: 'The NDLEA was established by Decree No. 48 of 1989 to interdict narcotics and suppress drug trafficking across Nigerian borders and cities.'
  },
  {
    id: 810,
    questionNumber: 10,
    section: 'civic',
    sectionTitle: 'Road Safety & Traffic Regulations',
    questionText: 'The agency responsible for road traffic management and preventing accidents on Nigerian federal highways is:',
    options: {
      A: 'FRSC (Federal Road Safety Corps)',
      B: 'VIO',
      C: 'LASTMA',
      D: 'NURTW'
    },
    correctAnswer: 'A',
    explanation: 'The Federal Road Safety Corps (FRSC) was established to minimize highway road crashes, administer driver licensing, and enforce speed regulations.'
  },
  {
    id: 811,
    questionNumber: 11,
    section: 'civic',
    sectionTitle: 'Good Governance',
    questionText: 'Transparency, accountability, responsiveness, and fairness in public administration are hallmarks of:',
    options: {
      A: 'Autocracy',
      B: 'Good governance',
      C: 'Military junta',
      D: 'Nepotism'
    },
    correctAnswer: 'B',
    explanation: 'Good governance ensures public resources are managed effectively, transparently, and equitably in accordance with public interest.'
  },
  {
    id: 812,
    questionNumber: 12,
    section: 'civic',
    sectionTitle: 'Human Trafficking',
    questionText: 'The federal agency dedicated to combating trafficking in persons and protecting vulnerable victims is:',
    options: {
      A: 'NAPTIP (National Agency for the Prohibition of Trafficking in Persons)',
      B: 'NHRC',
      C: 'NOA',
      D: 'SON'
    },
    correctAnswer: 'A',
    explanation: 'NAPTIP enforces laws against human trafficking, illegal labor migration, and modern sexual exploitation.'
  },
  {
    id: 813,
    questionNumber: 13,
    section: 'civic',
    sectionTitle: 'Civil Society & Non-Governmental Organizations',
    questionText: 'Civil society organizations play a vital role in democratic governance by:',
    options: {
      A: 'Forming military coalitions',
      B: 'Holding governments accountable and advocating for citizen welfare',
      C: 'Printing national currency notes',
      D: 'Imposing taxes on citizens'
    },
    correctAnswer: 'B',
    explanation: 'Civil society acts as an independent watchdog that monitors government activities, promotes human rights, and amplifies community voices.'
  },
  {
    id: 814,
    questionNumber: 14,
    section: 'civic',
    sectionTitle: 'Constitutional History',
    questionText: 'Which Nigerian constitution introduced the elective principle in 1922, allowing Africans to elect members to the Legislative Council?',
    options: {
      A: 'Clifford Constitution of 1922',
      B: 'Richards Constitution of 1946',
      C: 'Macpherson Constitution of 1951',
      D: 'Lyttelton Constitution of 1954'
    },
    correctAnswer: 'A',
    explanation: 'The 1922 Sir Hugh Clifford Constitution introduced the elective principle, providing 4 elected seats (3 in Lagos, 1 in Calabar).'
  },
  {
    id: 815,
    questionNumber: 15,
    section: 'civic',
    sectionTitle: 'National Security & Defence',
    questionText: 'National security is best preserved when citizens:',
    options: {
      A: 'Conceal known criminal syndicates in their neighborhoods',
      B: 'Cooperate with law enforcement agencies and provide credible intelligence',
      C: 'Organize armed vigilantes that defy state laws',
      D: 'Encourage cross-border arms smuggling'
    },
    correctAnswer: 'B',
    explanation: 'Community vigilance and partnership with statutory law enforcement agencies are essential for maintaining sustainable peace and territorial security.'
  },
  {
    id: 816,
    questionNumber: 16,
    section: 'civic',
    sectionTitle: 'Consumer Rights & Protection',
    questionText: 'Which regulatory commission in Nigeria protects consumer rights against substandard goods and unfair business practices?',
    options: {
      A: 'FCCPC (Federal Competition and Consumer Protection Commission)',
      B: 'CAC',
      C: 'NEPC',
      D: 'SMEDAN'
    },
    correctAnswer: 'A',
    explanation: 'The FCCPC protects consumers against hazardous products, price gouging, false advertising, and anti-competitive practices.'
  },
  {
    id: 817,
    questionNumber: 17,
    section: 'civic',
    sectionTitle: 'Public Hygiene & Clean Environment',
    questionText: 'Promoting a clean and sanitary environment in local communities prevents the spread of epidemic diseases such as:',
    options: {
      A: 'Cholera and malaria',
      B: 'Sickle cell anemia',
      C: 'Color blindness',
      D: 'Hemophilia'
    },
    correctAnswer: 'A',
    explanation: 'Clean water systems and proper waste disposal eliminate breeding sites for mosquitoes (malaria vectors) and waterborne Vibrio cholerae bacteria.'
  },
  {
    id: 818,
    questionNumber: 18,
    section: 'civic',
    sectionTitle: 'Integrity & Moral Rectitude',
    questionText: 'A public officer who refuses a bribe and adheres to moral truth even when unwatched exhibits the virtue of:',
    options: {
      A: 'Integrity',
      B: 'Complacency',
      C: 'Opportunism',
      D: 'Docility'
    },
    correctAnswer: 'A',
    explanation: 'Integrity is the practice of being honest and showing consistent, uncompromising adherence to strong moral and ethical principles.'
  },
  {
    id: 819,
    questionNumber: 19,
    section: 'civic',
    sectionTitle: 'Leadership and Followership',
    questionText: 'Effective leadership in a democratic society is characterized by:',
    options: {
      A: 'Servant leadership, empathy, and listening to the people',
      B: 'Arbitrary decrees and suppression of dissent',
      C: 'Enrichment of political cronies',
      D: 'Total censorship of news and media'
    },
    correctAnswer: 'A',
    explanation: 'Democracy thrives when leaders practice servant leadership, demonstrating accountability, responsiveness, and genuine dedication to public welfare.'
  },
  {
    id: 820,
    questionNumber: 20,
    section: 'civic',
    sectionTitle: 'National Integration',
    questionText: 'The National Youth Service Corps (NYSC) scheme was founded in 1973 principally to:',
    options: {
      A: 'Promote national unity and cross-cultural integration across Nigeria',
      B: 'Prepare graduates for partisan political campaigns',
      C: 'Provide military combat troops for overseas warfare',
      D: 'Eliminate university degrees in the country'
    },
    correctAnswer: 'A',
    explanation: 'Created under General Yakubu Gowon\'s regime via Decree 24 of 1973, NYSC deploys tertiary graduates to diverse states to foster unity, cross-ethnic understanding, and national integration.'
  }
];
