import { ExamQuestion } from './mockExamData';

export const SS2_SCIENCE_MOCK_QUESTIONS: ExamQuestion[] = [
  // SECTION A: PHYSICS (Questions 1 - 17)
  {
    id: 301,
    questionNumber: 1,
    section: 'physics',
    sectionTitle: 'Physics: Mechanics & Vectors',
    questionText: 'Which of the following is a fundamental physical quantity in the International System of Units (SI)?',
    options: {
      A: 'Electric charge',
      B: 'Luminous intensity',
      C: 'Velocity',
      D: 'Force'
    },
    correctAnswer: 'B',
    explanation: 'The seven base SI units are mass (kg), length (m), time (s), electric current (A), thermodynamic temperature (K), amount of substance (mol), and luminous intensity (candela, cd).'
  },
  {
    id: 302,
    questionNumber: 2,
    section: 'physics',
    sectionTitle: 'Physics: Equations of Motion',
    questionText: 'A car accelerates uniformly from rest at 2.5 m/s² for 8 seconds. Calculate the total distance covered.',
    options: {
      A: '60 m',
      B: '80 m',
      C: '100 m',
      D: '160 m'
    },
    correctAnswer: 'B',
    explanation: 'Using s = ut + 0.5at²: since u = 0, s = 0.5 * 2.5 * (8)² = 1.25 * 64 = 80 metres.'
  },
  {
    id: 303,
    questionNumber: 3,
    section: 'physics',
    sectionTitle: 'Physics: Newton\'s Laws',
    questionText: 'Newton’s First Law of Motion is also widely known as the Law of:',
    options: {
      A: 'Conservation of Energy',
      B: 'Inertia',
      C: 'Action and Reaction',
      D: 'Gravitational Attraction'
    },
    correctAnswer: 'B',
    explanation: 'Newton’s First Law states that a body remains at rest or in uniform straight motion unless acted upon by an external net force; this inherent property of matter is inertia.'
  },
  {
    id: 304,
    questionNumber: 4,
    section: 'physics',
    sectionTitle: 'Physics: Work, Energy & Power',
    questionText: 'A crane lifts a 500 kg concrete block vertically through a height of 12 metres in 10 seconds. Calculate the power developed by the crane. (Take g = 10 m/s²)',
    options: {
      A: '6,000 W',
      B: '600 W',
      C: '12,000 W',
      D: '50,000 W'
    },
    correctAnswer: 'A',
    explanation: 'Work done = m * g * h = 500 * 10 * 12 = 60,000 J. Power = Work / time = 60,000 / 10 = 6,000 Watts (or 6 kW).'
  },
  {
    id: 305,
    questionNumber: 5,
    section: 'physics',
    sectionTitle: 'Physics: Circular Motion',
    questionText: 'The acceleration directed towards the centre of the circular path of an object in uniform circular motion is called:',
    options: {
      A: 'Tangential acceleration',
      B: 'Centrifugal acceleration',
      C: 'Centripetal acceleration',
      D: 'Angular velocity'
    },
    correctAnswer: 'C',
    explanation: 'Centripetal acceleration is directed radially inward towards the centre of rotation with magnitude a = v² / r.'
  },
  {
    id: 306,
    questionNumber: 6,
    section: 'physics',
    sectionTitle: 'Physics: Optics & Reflection',
    questionText: 'An object is placed at the centre of curvature (2F) of a concave mirror. The resulting image is:',
    options: {
      A: 'Virtual, erect and magnified',
      B: 'Real, inverted and of the same size',
      C: 'Real, inverted and diminished',
      D: 'Virtual, erect and diminished'
    },
    correctAnswer: 'B',
    explanation: 'For a concave mirror, when the object is located exactly at the centre of curvature (C = 2F), the image formed is real, inverted, located at C, and exactly identical in size.'
  },
  {
    id: 307,
    questionNumber: 7,
    section: 'physics',
    sectionTitle: 'Physics: Refraction of Light',
    questionText: 'When a light ray travels from water (optically denser) into air (optically rarer), the refracted ray bends:',
    options: {
      A: 'Towards the normal with decreased speed',
      B: 'Away from the normal with increased speed',
      C: 'Parallel to the incident ray without changing speed',
      D: 'Towards the normal with constant speed'
    },
    correctAnswer: 'B',
    explanation: 'When passing into a rarer medium of lower refractive index, light speeds up and bends away from the normal.'
  },
  {
    id: 308,
    questionNumber: 8,
    section: 'physics',
    sectionTitle: 'Physics: Waves & Sound',
    questionText: 'A tuning fork produces a sound wave of frequency 440 Hz in air where the speed of sound is 330 m/s. Calculate the wavelength.',
    options: {
      A: '0.75 m',
      B: '1.33 m',
      C: '1.50 m',
      D: '2.25 m'
    },
    correctAnswer: 'A',
    explanation: 'Wave formula: v = f * λ => λ = v / f = 330 / 440 = 3/4 = 0.75 metres.'
  },
  {
    id: 309,
    questionNumber: 9,
    section: 'physics',
    sectionTitle: 'Physics: Heat & Thermodynamics',
    questionText: 'The quantity of thermal energy required to convert a unit mass of liquid into vapour at its boiling point without temperature change is called:',
    options: {
      A: 'Specific heat capacity',
      B: 'Specific latent heat of fusion',
      C: 'Specific latent heat of vaporization',
      D: 'Thermal conductivity'
    },
    correctAnswer: 'C',
    explanation: 'Specific latent heat of vaporization is the heat energy absorbed per unit mass during phase transition from liquid to vapour without temperature change.'
  },
  {
    id: 310,
    questionNumber: 10,
    section: 'physics',
    sectionTitle: 'Physics: Current Electricity',
    questionText: 'Three resistors of resistances 3 Ω, 6 Ω, and 2 Ω are connected in parallel. What is their effective total resistance?',
    options: {
      A: '11 Ω',
      B: '1.0 Ω',
      C: '2.5 Ω',
      D: '0.5 Ω'
    },
    correctAnswer: 'B',
    explanation: '1/R_eq = 1/3 + 1/6 + 1/2 = 2/6 + 1/6 + 3/6 = 6/6 = 1. Therefore R_eq = 1.0 Ω.'
  },
  {
    id: 311,
    questionNumber: 11,
    section: 'physics',
    sectionTitle: 'Physics: Ohm\'s Law',
    questionText: 'According to Ohm\'s Law, the potential difference across a metallic conductor is directly proportional to current, provided that:',
    options: {
      A: 'Resistance changes exponentially',
      B: 'Temperature and other physical conditions remain constant',
      C: 'The conductor is subjected to magnetic fields',
      D: 'The electric power remains zero'
    },
    correctAnswer: 'B',
    explanation: 'Ohm’s law states V ∝ I at constant temperature and fixed physical dimensions.'
  },
  {
    id: 312,
    questionNumber: 12,
    section: 'physics',
    sectionTitle: 'Physics: Magnetism & Induction',
    questionText: 'Faraday’s Law of Electromagnetic Induction states that the magnitude of induced electromotive force (e.m.f.) is directly proportional to:',
    options: {
      A: 'The resistance of the coil',
      B: 'The rate of change of magnetic flux linkage',
      C: 'The volume of the permanent magnet',
      D: 'The speed of light in vacuum'
    },
    correctAnswer: 'B',
    explanation: 'Induced e.m.f. = -N (dΦ/dt); it depends directly on the rate at which magnetic flux through the circuit changes with time.'
  },
  {
    id: 313,
    questionNumber: 13,
    section: 'physics',
    sectionTitle: 'Physics: Gravitation',
    questionText: 'If the distance between two spherical masses is doubled, the gravitational attraction between them becomes:',
    options: {
      A: 'Doubled',
      B: 'Quadrupled',
      C: 'Halved',
      D: 'One-quarter of its initial value'
    },
    correctAnswer: 'D',
    explanation: 'Newton\'s Universal Law of Gravitation: F = G(m1*m2)/r². If r is replaced by 2r, F\' = F / (2)² = F / 4.'
  },
  {
    id: 314,
    questionNumber: 14,
    section: 'physics',
    sectionTitle: 'Physics: Radioactivity',
    questionText: 'Which nuclear emission consists of fast-moving helium nuclei carrying two positive charges?',
    options: {
      A: 'Beta particles',
      B: 'Gamma rays',
      C: 'Alpha particles',
      D: 'Neutrons'
    },
    correctAnswer: 'C',
    explanation: 'Alpha particles are identical to helium-4 nuclei (2 protons and 2 neutrons), carrying a +2e charge.'
  },
  {
    id: 315,
    questionNumber: 15,
    section: 'physics',
    sectionTitle: 'Physics: Pressure & Fluids',
    questionText: 'Pascal’s Principle is the fundamental operating concept behind which of the following mechanical devices?',
    options: {
      A: 'Aneroid barometer',
      B: 'Hydraulic car brake and lift',
      C: 'Thermocouple thermometer',
      D: 'Hydrometer'
    },
    correctAnswer: 'B',
    explanation: 'Pascal’s principle states that pressure applied to an enclosed fluid is transmitted undiminished throughout the fluid, operating hydraulic presses and car brakes.'
  },
  {
    id: 316,
    questionNumber: 16,
    section: 'physics',
    sectionTitle: 'Physics: Atomic Energy',
    questionText: 'The process in which a heavy unstable atomic nucleus splits into two or more smaller nuclei with massive release of energy is called:',
    options: {
      A: 'Nuclear fusion',
      B: 'Nuclear fission',
      C: 'Combustion',
      D: 'Sublimation'
    },
    correctAnswer: 'B',
    explanation: 'Nuclear fission is the splitting of heavy radioactive nuclei (such as Uranium-235) upon bombardment by slow thermal neutrons.'
  },
  {
    id: 317,
    questionNumber: 17,
    section: 'physics',
    sectionTitle: 'Physics: Electrostatics',
    questionText: 'Two point charges of +2 μC and +8 μC are separated by a distance r. The nature of the electrostatic force between them is:',
    options: {
      A: 'Attractive',
      B: 'Repulsive',
      C: 'Zero',
      D: 'Magnetic'
    },
    correctAnswer: 'B',
    explanation: 'Like charges repel each other while unlike charges attract. Since both charges are positive, the electrostatic force is repulsive.'
  },

  // SECTION B: CHEMISTRY (Questions 18 - 34)
  {
    id: 318,
    questionNumber: 18,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Atomic Structure',
    questionText: 'An atom of an element has an electronic configuration of 2, 8, 7. What is the element\'s group and period in the Periodic Table?',
    options: {
      A: 'Group 2, Period 7',
      B: 'Group 7 (Halogens), Period 3',
      C: 'Group 3, Period 7',
      D: 'Group 8, Period 2'
    },
    correctAnswer: 'B',
    explanation: 'The number of electron shells (3) indicates Period 3. The number of valence electrons (7) places it in Group 7 (Halogens, e.g. Chlorine).'
  },
  {
    id: 319,
    questionNumber: 19,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Chemical Bonding',
    questionText: 'Electrovalent (ionic) bonding typically occurs between:',
    options: {
      A: 'Two non-metallic atoms with similar electronegativity',
      B: 'A metal that readily loses electrons and a non-metal that readily accepts electrons',
      C: 'Two noble gas atoms sharing electron pairs',
      D: 'Molecules held exclusively by Van der Waals forces'
    },
    correctAnswer: 'B',
    explanation: 'Ionic bonding involves complete electron transfer from a metallic atom of low ionization energy to an electronegative non-metal.'
  },
  {
    id: 320,
    questionNumber: 20,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Mole Concept & Stoichiometry',
    questionText: 'How many moles of oxygen atoms are present in 44 grams of Carbon Dioxide (CO₂)? (C = 12, O = 16)',
    options: {
      A: '0.5 mole',
      B: '1.0 mole',
      C: '2.0 moles',
      D: '4.0 moles'
    },
    correctAnswer: 'C',
    explanation: 'Molar mass of CO₂ = 12 + (2*16) = 44 g/mol. 44 g of CO₂ = 1 mole of CO₂ molecules. Each CO₂ molecule contains 2 oxygen atoms; hence 1 mole of CO₂ contains 2.0 moles of oxygen atoms.'
  },
  {
    id: 321,
    questionNumber: 21,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Acids, Bases & Salts',
    questionText: 'Which indicator turns pink or deep magenta in a basic (alkaline) aqueous solution?',
    options: {
      A: 'Methyl orange',
      B: 'Litmus paper (red)',
      C: 'Phenolphthalein',
      D: 'Universal indicator in neutral water'
    },
    correctAnswer: 'C',
    explanation: 'Phenolphthalein is colourless in acidic and neutral solutions (pH < 8.2) and turns vivid pink/magenta in alkaline conditions (pH > 8.2).'
  },
  {
    id: 322,
    questionNumber: 22,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Gas Laws',
    questionText: 'Graham\'s Law of Diffusion states that the rate of diffusion of a gas is inversely proportional to the square root of its:',
    options: {
      A: 'Absolute temperature',
      B: 'Vapour density or molar mass',
      C: 'Atmospheric pressure',
      D: 'Volume at STP'
    },
    correctAnswer: 'B',
    explanation: 'Graham\'s Law: R ∝ 1 / √(M), meaning lighter gases with lower molar masses diffuse much faster than heavier gases.'
  },
  {
    id: 323,
    questionNumber: 23,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Redox Reactions',
    questionText: 'What is the oxidation number of manganese in Potassium Permanganate (KMnO₄)?',
    options: {
      A: '+2',
      B: '+4',
      C: '+6',
      D: '+7'
    },
    correctAnswer: 'D',
    explanation: 'In KMnO₄: (+1) + Mn + 4(-2) = 0 => 1 + Mn - 8 = 0 => Mn = +7.'
  },
  {
    id: 324,
    questionNumber: 24,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Organic Hydrocarbons',
    questionText: 'What is the general molecular formula for the Alkane homologous series?',
    options: {
      A: 'CₙH₂ₙ',
      B: 'CₙH₂ₙ₊₂',
      C: 'CₙH₂ₙ₋₂',
      D: 'CₙH₂ₙ₊₁OH'
    },
    correctAnswer: 'B',
    explanation: 'Alkanes are saturated hydrocarbons containing single covalent C-C bonds with general formula CₙH₂ₙ₊₂ (e.g. Methane CH₄, Ethane C₂H₆).'
  },
  {
    id: 325,
    questionNumber: 25,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Electrolysis',
    questionText: 'During the electrolysis of concentrated aqueous Sodium Chloride (brine) using inert carbon electrodes, which gas is liberated at the anode?',
    options: {
      A: 'Hydrogen gas',
      B: 'Oxygen gas',
      C: 'Chlorine gas',
      D: 'Nitrogen dioxide'
    },
    correctAnswer: 'C',
    explanation: 'Due to higher concentration of chloride ions in brine, Cl⁻ is preferentially discharged over OH⁻ at the anode to produce Chlorine gas (Cl₂).'
  },
  {
    id: 326,
    questionNumber: 26,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Chemical Equilibrium',
    questionText: 'According to Le Chatelier’s Principle, for the exothermic synthesis of ammonia: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), yields of ammonia increase with:',
    options: {
      A: 'Higher temperature and lower pressure',
      B: 'Lower temperature and higher pressure',
      C: 'Lower pressure and adding a catalyst',
      D: 'Removing reactants continuously'
    },
    correctAnswer: 'B',
    explanation: 'Since the forward reaction is exothermic, lower temperature favours forward yield. There are 4 moles of gas on the left and 2 moles on the right, so increasing pressure shifts equilibrium towards fewer moles (NH₃).'
  },
  {
    id: 327,
    questionNumber: 27,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Periodic Trends',
    questionText: 'Across a period from left to right in the Periodic Table, atomic radius generally:',
    options: {
      A: 'Increases because electron shells are added',
      B: 'Decreases because nuclear charge increases while shielding remains constant',
      C: 'Remains completely unchanged',
      D: 'Fluctuates unpredictably'
    },
    correctAnswer: 'B',
    explanation: 'Across a period, protons increase in the nucleus, pulling the outer electron shell closer inward without adding new inner shielding shells, reducing atomic size.'
  },
  {
    id: 328,
    questionNumber: 28,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Water & Hardness',
    questionText: 'Temporary hardness of water is caused by the dissolved presence of:',
    options: {
      A: 'Calcium sulphate (CaSO₄)',
      B: 'Magnesium chloride (MgCl₂)',
      C: 'Calcium hydrogencarbonate [Ca(HCO₃)₂]',
      D: 'Sodium nitrate (NaNO₃)'
    },
    correctAnswer: 'C',
    explanation: 'Temporary hardness is caused by soluble hydrogen carbonates of calcium and magnesium, which can be readily removed by simple boiling to precipitate insoluble carbonates.'
  },
  {
    id: 329,
    questionNumber: 29,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Metals & Metallurgy',
    questionText: 'Bauxite is the principal natural mineral ore from which which metal is extracted industrially via electrolytic reduction?',
    options: {
      A: 'Iron',
      B: 'Aluminium',
      C: 'Copper',
      D: 'Zinc'
    },
    correctAnswer: 'B',
    explanation: 'Bauxite (hydrated aluminium oxide, Al₂O₃·2H₂O) is purified and dissolved in molten cryolite before electrolysis in the Hall-Héroult industrial process.'
  },
  {
    id: 330,
    questionNumber: 30,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Organic Functional Groups',
    questionText: 'What is the characteristic functional group of Carboxylic Acids?',
    options: {
      A: '-OH (Hydroxyl)',
      B: '-CHO (Aldehyde)',
      C: '-COOH (Carboxyl)',
      D: '-CO- (Carbonyl)'
    },
    correctAnswer: 'C',
    explanation: 'The carboxyl group (-COOH) consists of a carbonyl (C=O) bonded directly to a hydroxyl (-OH) group, characterizing organic acids like Ethanoic Acid.'
  },
  {
    id: 331,
    questionNumber: 31,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Energetics',
    questionText: 'A chemical reaction that absorbs heat energy from the surrounding environment, resulting in a temperature drop, has a ΔH that is:',
    options: {
      A: 'Negative (Exothermic)',
      B: 'Positive (Endothermic)',
      C: 'Exactly zero at all times',
      D: 'Infinite'
    },
    correctAnswer: 'B',
    explanation: 'Endothermic reactions absorb thermal energy from surroundings; hence enthalpy change ΔH = H_products - H_reactants > 0 (positive).'
  },
  {
    id: 332,
    questionNumber: 32,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Catalysts',
    questionText: 'How does a catalyst increase the rate of a chemical reaction without being consumed?',
    options: {
      A: 'By increasing the total enthalpy of the products',
      B: 'By providing an alternative reaction pathway with lower activation energy',
      C: 'By raising the reaction temperature spontaneously',
      D: 'By converting endothermic reactions into exothermic reactions'
    },
    correctAnswer: 'B',
    explanation: 'A catalyst lowers the required activation energy threshold (Ea), allowing a greater fraction of reacting collisions to result in product formation.'
  },
  {
    id: 333,
    questionNumber: 33,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Environmental Chemistry',
    questionText: 'The depletion of the atmospheric ozone layer in the stratosphere is primarily accelerated by emissions of:',
    options: {
      A: 'Carbon dioxide (CO₂)',
      B: 'Chlorofluorocarbons (CFCs)',
      C: 'Water vapour (H₂O)',
      D: 'Argon (Ar)'
    },
    correctAnswer: 'B',
    explanation: 'Chlorofluorocarbons release free chlorine radicals under UV radiation that catalytically break down protective ozone (O₃) into oxygen gas.'
  },
  {
    id: 334,
    questionNumber: 34,
    section: 'chemistry',
    sectionTitle: 'Chemistry: Nuclear Chemistry',
    questionText: 'Isotopes of the same chemical element possess:',
    options: {
      A: 'Same number of neutrons but different number of protons',
      B: 'Same atomic number (protons) but different mass numbers (neutrons)',
      C: 'Different chemical properties and identical atomic masses',
      D: 'Different numbers of valence electrons in the neutral state'
    },
    correctAnswer: 'B',
    explanation: 'Isotopes (e.g. Carbon-12 and Carbon-14) have identical proton counts (atomic number Z) and identical electron arrangements, differing only in neutron count.'
  },

  // SECTION C: BIOLOGY & HEALTH SCIENCES (Questions 35 - 50)
  {
    id: 335,
    questionNumber: 35,
    section: 'biology',
    sectionTitle: 'Biology: Cell Biology',
    questionText: 'Which organelle is universally celebrated as the "powerhouse of the eukaryotic cell" where ATP is synthesized via aerobic cellular respiration?',
    options: {
      A: 'Ribosome',
      B: 'Golgi apparatus',
      C: 'Mitochondrion',
      D: 'Endoplasmic reticulum'
    },
    correctAnswer: 'C',
    explanation: 'Mitochondria generate the majority of cellular adenosine triphosphate (ATP) through the Krebs cycle and electron transport chain.'
  },
  {
    id: 336,
    questionNumber: 36,
    section: 'biology',
    sectionTitle: 'Biology: Plant Physiology',
    questionText: 'The vascular tissue responsible for conducting synthesized organic food materials (sucrose) from green leaves to other parts of a plant is:',
    options: {
      A: 'Xylem',
      B: 'Phloem',
      C: 'Cortex',
      D: 'Cambium'
    },
    correctAnswer: 'B',
    explanation: 'Phloem translocates sucrose and amino acids bidirectionally, whereas xylem transports water and dissolved mineral salts upward from roots.'
  },
  {
    id: 337,
    questionNumber: 37,
    section: 'biology',
    sectionTitle: 'Biology: Photosynthesis',
    questionText: 'During the light-dependent stage of photosynthesis, oxygen gas is released as a direct by-product of:',
    options: {
      A: 'Reduction of carbon dioxide in the Calvin cycle',
      B: 'Photolysis of water molecules inside the thylakoid',
      C: 'Breakdown of starch in the stomata',
      D: 'Oxidation of glucose during glycolysis'
    },
    correctAnswer: 'B',
    explanation: 'Photolysis is the splitting of water molecules by radiant light energy absorbed by chlorophyll: 2H₂O -> 4H⁺ + 4e⁻ + O₂.'
  },
  {
    id: 338,
    questionNumber: 38,
    section: 'biology',
    sectionTitle: 'Biology: Human Circulatory System',
    questionText: 'Which chamber of the human heart has the thickest muscular wall because it must pump oxygenated blood throughout the systemic circulation?',
    options: {
      A: 'Right atrium',
      B: 'Right ventricle',
      C: 'Left atrium',
      D: 'Left ventricle'
    },
    correctAnswer: 'D',
    explanation: 'The left ventricle pumps oxygenated blood against high systemic vascular resistance through the aorta to the entire body, requiring powerful myocardium.'
  },
  {
    id: 339,
    questionNumber: 39,
    section: 'biology',
    sectionTitle: 'Biology: Digestive System & Enzymes',
    questionText: 'Which digestive enzyme present in human gastric juice hydrolyzes dietary proteins into smaller peptide chains in an acidic pH environment?',
    options: {
      A: 'Salivary amylase',
      B: 'Pepsin',
      C: 'Lipase',
      D: 'Trypsin'
    },
    correctAnswer: 'B',
    explanation: 'Pepsinogen is activated by hydrochloric acid in gastric juice into active pepsin, with an optimal working pH around 1.5 to 2.0.'
  },
  {
    id: 340,
    questionNumber: 40,
    section: 'biology',
    sectionTitle: 'Biology: Genetics & Inheritance',
    questionText: 'If a man who is heterozygous for brown eyes (Bb) marries a woman with blue eyes (bb), what is the probability that their first child will have blue eyes?',
    options: {
      A: '0%',
      B: '25%',
      C: '50%',
      D: '100%'
    },
    correctAnswer: 'C',
    explanation: 'Punnett cross of Bb × bb produces offspring genotypes: 50% Bb (brown eyes) and 50% bb (blue eyes). Probability = 1/2 or 50%.'
  },
  {
    id: 341,
    questionNumber: 41,
    section: 'biology',
    sectionTitle: 'Biology: Blood Groups',
    questionText: 'An individual with blood group O negative (O-) is termed a universal red blood cell donor because their erythrocytes contain:',
    options: {
      A: 'Both A and B antigens on their membrane',
      B: 'Neither A nor B surface antigens nor Rh(D) antigen',
      C: 'Both anti-A and anti-B antibodies in their cytoplasm',
      D: 'High concentrations of haemoglobin F'
    },
    correctAnswer: 'B',
    explanation: 'Group O negative red blood cells lack A, B, and Rh factor antigens, avoiding immune agglutination when transfused into recipients of any ABO/Rh blood type.'
  },
  {
    id: 342,
    questionNumber: 42,
    section: 'biology',
    sectionTitle: 'Biology: Excretion & Homeostasis',
    questionText: 'The basic structural and functional filtration unit of the human mammalian kidney is the:',
    options: {
      A: 'Neuron',
      B: 'Nephron',
      C: 'Alveolus',
      D: 'Hepatocyte'
    },
    correctAnswer: 'B',
    explanation: 'Each kidney contains over one million microscopic nephrons responsible for ultrafiltration, selective reabsorption, and urine production.'
  },
  {
    id: 343,
    questionNumber: 43,
    section: 'biology',
    sectionTitle: 'Biology: Ecology & Ecosystems',
    questionText: 'An ecological relationship in which two distinct species live together, benefiting each other reciprocally, is known as:',
    options: {
      A: 'Parasitism',
      B: 'Commensalism',
      C: 'Mutualism',
      D: 'Amensalism'
    },
    correctAnswer: 'C',
    explanation: 'Mutualism is an obligate or facultative symbiotic interaction where both organisms derive survival or nutritional advantages (e.g. nitrogen-fixing bacteria in root nodules).'
  },
  {
    id: 344,
    questionNumber: 44,
    section: 'biology',
    sectionTitle: 'Biology: Nervous System',
    questionText: 'The microscopic junction across which nerve impulses are transmitted from the terminal axon of one neuron to the dendrite of another via neurotransmitters is a:',
    options: {
      A: 'Synapse',
      B: 'Myelin sheath',
      C: 'Node of Ranvier',
      D: 'Ganglion'
    },
    correctAnswer: 'A',
    explanation: 'A synapse is the microscopic gap where action potentials trigger vesicular exocytosis of chemical neurotransmitters like acetylcholine.'
  },
  {
    id: 345,
    questionNumber: 45,
    section: 'biology',
    sectionTitle: 'Biology: Cell Division',
    questionText: 'Meiosis is distinct from mitosis because meiotic division produces:',
    options: {
      A: 'Two diploid daughter cells genetically identical to parent',
      B: 'Four haploid gamete cells with genetic recombination',
      C: 'Somatic skin cells for tissue repair',
      D: 'Four polyploid zygotic cells'
    },
    correctAnswer: 'B',
    explanation: 'Meiosis is a reduction division resulting in four haploid gametes (sperm/egg), each with half the original chromosome number and genetic variation via crossing over.'
  },
  {
    id: 346,
    questionNumber: 46,
    section: 'biology',
    sectionTitle: 'Biology: Endocrinology & Hormones',
    questionText: 'Insulin, a hormone essential for lowering blood glucose concentration by stimulating cellular uptake and glycogen synthesis, is secreted by:',
    options: {
      A: 'Beta cells of the Islets of Langerhans in the pancreas',
      B: 'Adrenal cortex',
      C: 'Anterior pituitary gland',
      D: 'Thyroid gland follicles'
    },
    correctAnswer: 'A',
    explanation: 'Pancreatic beta cells in the Islets of Langerhans secrete insulin when blood glucose levels rise above homeostasis.'
  },
  {
    id: 347,
    questionNumber: 47,
    section: 'biology',
    sectionTitle: 'Biology: Evolutionary Adaptation',
    questionText: 'Hydrophytic aquatic plants like water lilies are structurally adapted to their environment through having:',
    options: {
      A: 'Deep taproot systems and sunken stomata on lower epidermis',
      B: 'Extensive internal aerenchyma tissue for buoyancy and stomata on upper leaf surface',
      C: 'Thick succulent stems for prolonged water retention',
      D: 'Needle-like leaves with thick waxy cuticles'
    },
    correctAnswer: 'B',
    explanation: 'Hydrophytes possess large air chambers (aerenchyma) providing buoyancy and gas diffusion, and their stomata are situated on the upper epidermis facing the open air.'
  },
  {
    id: 348,
    questionNumber: 48,
    section: 'biology',
    sectionTitle: 'Biology: Microbiology & Immunity',
    questionText: 'The human organism responsible for causing malaria is a protozoan parasite of the genus:',
    options: {
      A: 'Trypanosoma',
      B: 'Plasmodium',
      C: 'Ascaris',
      D: 'Salmonella'
    },
    correctAnswer: 'B',
    explanation: 'Plasmodium (such as P. falciparum) causes malaria and is transmitted into the human bloodstream via bites from infected female Anopheles mosquitoes.'
  },
  {
    id: 349,
    questionNumber: 49,
    section: 'biology',
    sectionTitle: 'Biology: Respiration',
    questionText: 'Anaerobic respiration in human skeletal muscle during intense sprint exertion results in the accumulation of:',
    options: {
      A: 'Ethanol and carbon dioxide',
      B: 'Lactic acid',
      C: 'Uric acid crystals',
      D: 'Pure glucose polymers'
    },
    correctAnswer: 'B',
    explanation: 'Under oxygen deficit, pyruvate undergoes anaerobic fermentation to form lactic acid, producing localized muscle fatigue and an oxygen debt.'
  },
  {
    id: 350,
    questionNumber: 50,
    section: 'biology',
    sectionTitle: 'Biology: Plant Reproduction',
    questionText: 'The transfer of pollen grains from the ripe anther of a flower to the receptive stigma of the same or another flower of the same species is called:',
    options: {
      A: 'Fertilization',
      B: 'Germination',
      C: 'Pollination',
      D: 'Parthenogenesis'
    },
    correctAnswer: 'C',
    explanation: 'Pollination is the mechanical transfer of pollen from anther to stigma via wind, insects, or water, preceding actual fertilization of ovules.'
  }
];
