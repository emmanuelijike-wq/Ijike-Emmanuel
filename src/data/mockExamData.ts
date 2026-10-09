export interface ExamQuestion {
  id: number;
  questionNumber?: number;
  section?: string;
  sectionTitle?: string;
  topic?: string;
  passage?: string; // For comprehension
  questionText?: string;
  question?: string; // Alternative alias for questionText
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ExamSubmissionRecord {
  id: string;
  studentName: string;
  studentEmail?: string;
  studentClass?: string;
  examTitle: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  timeSpentSeconds: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  sectionScores: Record<string, { correct: number; total: number }>;
}

export const COMPREHENSION_PASSAGE = `Education is an important instrument for personal and national development. It provides individuals with knowledge and skills that enable them to contribute meaningfully to society. However, education should not be limited to passing examinations. Students should also develop critical thinking, creativity, discipline and good character. A society that invests in quality education is more likely to produce responsible citizens capable of solving its problems.`;

export const SS2_ENGLISH_MOCK_QUESTIONS: ExamQuestion[] = [
  // SECTION A: GRAMMAR (1 - 10)
  {
    id: 1,
    questionNumber: 1,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'If I had known about the meeting, I _____ attended it.',
    options: {
      A: 'will have',
      B: 'would have',
      C: 'would',
      D: 'shall have'
    },
    correctAnswer: 'B',
    explanation: 'Third conditional sentence structure: "If + past perfect (had known), would have + past participle (attended)".'
  },
  {
    id: 2,
    questionNumber: 2,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'Neither the teacher nor the students _____ aware of the change.',
    options: {
      A: 'was',
      B: 'is',
      C: 'were',
      D: 'has'
    },
    correctAnswer: 'C',
    explanation: 'Rule of proximity with "neither... nor": the verb agrees with the closer subject ("students", plural), so "were" is correct.'
  },
  {
    id: 3,
    questionNumber: 3,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'She has been living in Lagos _____ 2020.',
    options: {
      A: 'for',
      B: 'since',
      C: 'from',
      D: 'by'
    },
    correctAnswer: 'B',
    explanation: '"Since" is used to refer to a specific starting point in time (2020), whereas "for" refers to a duration/period of time.'
  },
  {
    id: 4,
    questionNumber: 4,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'The boys congratulated _____ after winning the competition.',
    options: {
      A: 'themselves',
      B: 'theirselves',
      C: 'themself',
      D: 'ourselves'
    },
    correctAnswer: 'A',
    explanation: 'The standard plural reflexive pronoun for third person plural ("the boys") is "themselves". "Theirselves" is grammatically incorrect.'
  },
  {
    id: 5,
    questionNumber: 5,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'I prefer reading novels _____ watching television.',
    options: {
      A: 'than',
      B: 'from',
      C: 'to',
      D: 'over'
    },
    correctAnswer: 'C',
    explanation: 'The standard preposition that follows the verb "prefer" when comparing two gerunds or nouns is "to" (prefer X to Y).'
  },
  {
    id: 6,
    questionNumber: 6,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'The principal, together with the teachers, _____ arrived.',
    options: {
      A: 'have',
      B: 'are',
      C: 'were',
      D: 'has'
    },
    correctAnswer: 'D',
    explanation: 'Phrases introduced by "together with", "as well as", or "in addition to" do not affect the grammatical subject ("The principal", singular), so singular verb "has" is required.'
  },
  {
    id: 7,
    questionNumber: 7,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'By the time we arrived, the movie _____.',
    options: {
      A: 'starts',
      B: 'had started',
      C: 'has started',
      D: 'was starting'
    },
    correctAnswer: 'B',
    explanation: 'Past perfect ("had started") indicates an action completed before another past event ("we arrived").'
  },
  {
    id: 8,
    questionNumber: 8,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'He is one of the students who _____ always punctual.',
    options: {
      A: 'is',
      B: 'was',
      C: 'are',
      D: 'has'
    },
    correctAnswer: 'C',
    explanation: 'In "one of the [plural noun] who...", the relative pronoun "who" refers back to the antecedent "students" (plural), taking a plural verb "are".'
  },
  {
    id: 9,
    questionNumber: 9,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'The news _____ very disturbing.',
    options: {
      A: 'are',
      B: 'were',
      C: 'have',
      D: 'is'
    },
    correctAnswer: 'D',
    explanation: '"News" is an uncountable singular noun in English and strictly takes a singular verb ("is").'
  },
  {
    id: 10,
    questionNumber: 10,
    section: 'grammar',
    sectionTitle: 'Section A: Grammar',
    questionText: 'If she _____ harder, she would have passed the examination.',
    options: {
      A: 'studies',
      B: 'studied',
      C: 'had studied',
      D: 'has studied'
    },
    correctAnswer: 'C',
    explanation: 'Third conditional pattern requires past perfect "had studied" in the if-clause to match "would have passed".'
  },

  // SECTION B: VOCABULARY (11 - 20)
  {
    id: 11,
    questionNumber: 11,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'The opposite of “scarce” is:',
    options: {
      A: 'rare',
      B: 'abundant',
      C: 'insufficient',
      D: 'limited'
    },
    correctAnswer: 'B',
    explanation: '"Scarce" means in short supply or insufficient; its direct antonym is "abundant", meaning plentiful.'
  },
  {
    id: 12,
    questionNumber: 12,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'The word “meticulous” means:',
    options: {
      A: 'careless',
      B: 'very careful',
      C: 'confused',
      D: 'impatient'
    },
    correctAnswer: 'B',
    explanation: '"Meticulous" denotes showing great attention to detail and being very thorough and careful.'
  },
  {
    id: 13,
    questionNumber: 13,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'The opposite of “hostile” is:',
    options: {
      A: 'aggressive',
      B: 'unfriendly',
      C: 'friendly',
      D: 'dangerous'
    },
    correctAnswer: 'C',
    explanation: '"Hostile" signifies antagonistic or showing enmity; the opposite is "friendly".'
  },
  {
    id: 14,
    questionNumber: 14,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'A person who cannot read or write is described as:',
    options: {
      A: 'ignorant',
      B: 'illiterate',
      C: 'inexperienced',
      D: 'uneducated'
    },
    correctAnswer: 'B',
    explanation: '"Illiterate" specifically describes a person unable to read or write.'
  },
  {
    id: 15,
    questionNumber: 15,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'To “abandon” something means to:',
    options: {
      A: 'protect it',
      B: 'improve it',
      C: 'leave it completely',
      D: 'repair it'
    },
    correctAnswer: 'C',
    explanation: 'To "abandon" is to desert, forsake, or cease supporting or looking after completely.'
  },
  {
    id: 16,
    questionNumber: 16,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'The word “obsolete” means:',
    options: {
      A: 'modern',
      B: 'outdated',
      C: 'expensive',
      D: 'useful'
    },
    correctAnswer: 'B',
    explanation: '"Obsolete" means no longer produced or used, having been replaced by something newer; outdated.'
  },
  {
    id: 17,
    questionNumber: 17,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'If someone is “arrogant,” the person is:',
    options: {
      A: 'humble',
      B: 'excessively proud',
      C: 'generous',
      D: 'timid'
    },
    correctAnswer: 'B',
    explanation: '"Arrogant" describes having or showing an offensive attitude of superiority and excessive pride.'
  },
  {
    id: 18,
    questionNumber: 18,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'The opposite of “transparent” is:',
    options: {
      A: 'clear',
      B: 'visible',
      C: 'opaque',
      D: 'bright'
    },
    correctAnswer: 'C',
    explanation: '"Transparent" means letting light through so that objects behind can be distinctly seen; its antonym is "opaque".'
  },
  {
    id: 19,
    questionNumber: 19,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'To “scrutinize” something means to:',
    options: {
      A: 'ignore it',
      B: 'examine it carefully',
      C: 'destroy it',
      D: 'hide it'
    },
    correctAnswer: 'B',
    explanation: 'To "scrutinize" means to examine or inspect closely and thoroughly.'
  },
  {
    id: 20,
    questionNumber: 20,
    section: 'vocabulary',
    sectionTitle: 'Section B: Vocabulary',
    questionText: 'Someone who is “compassionate” is:',
    options: {
      A: 'cruel',
      B: 'sympathetic',
      C: 'stubborn',
      D: 'selfish'
    },
    correctAnswer: 'B',
    explanation: '"Compassionate" means feeling or showing sympathy, concern, and kindness for others.'
  },

  // SECTION C: PHONETICS (21 - 30)
  {
    id: 21,
    questionNumber: 21,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word has the same vowel sound as “seat”?',
    options: {
      A: 'sit',
      B: 'beat',
      C: 'set',
      D: 'said'
    },
    correctAnswer: 'B',
    explanation: 'Both "seat" and "beat" contain the long front unrounded vowel /iː/.'
  },
  {
    id: 22,
    questionNumber: 22,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word contains the /ʃ/ sound (as in "shoe")?',
    options: {
      A: 'chair',
      B: 'vision',
      C: 'ship',
      D: 'judge'
    },
    correctAnswer: 'C',
    explanation: '"ship" contains the voiceless postalveolar fricative /ʃ/.'
  },
  {
    id: 23,
    questionNumber: 23,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word has a different vowel sound from the others?',
    options: {
      A: 'beat',
      B: 'meat',
      C: 'great',
      D: 'seat'
    },
    correctAnswer: 'C',
    explanation: '"great" has the diphthong /eɪ/, whereas "beat", "meat", and "seat" have the long vowel /iː/.'
  },
  {
    id: 24,
    questionNumber: 24,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word begins with the same consonant sound as “phone”?',
    options: {
      A: 'phase',
      B: 'van',
      C: 'pan',
      D: 'fan'
    },
    correctAnswer: 'A',
    explanation: 'Both "phone" and "phase" begin with the voiceless labiodental fricative /f/ spelled with "ph".'
  },
  {
    id: 25,
    questionNumber: 25,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word contains the /tʃ/ sound (as in "chain")?',
    options: {
      A: 'church',
      B: 'judge',
      C: 'measure',
      D: 'vision'
    },
    correctAnswer: 'A',
    explanation: '"church" begins and ends with the voiceless postalveolar affricate /tʃ/.'
  },
  {
    id: 26,
    questionNumber: 26,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word has the same vowel sound as “cup”?',
    options: {
      A: 'put',
      B: 'luck',
      C: 'food',
      D: 'boot'
    },
    correctAnswer: 'B',
    explanation: 'Both "cup" and "luck" share the open-mid back unrounded vowel /ʌ/.'
  },
  {
    id: 27,
    questionNumber: 27,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word contains a silent letter?',
    options: {
      A: 'knife',
      B: 'king',
      C: 'kite',
      D: 'kind'
    },
    correctAnswer: 'A',
    explanation: 'In "knife", the initial letter "k" is silent before "n" (/naɪf/).'
  },
  {
    id: 28,
    questionNumber: 28,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'The final sound in “laugh” is:',
    options: {
      A: '/g/',
      B: '/f/',
      C: '/v/',
      D: '/k/'
    },
    correctAnswer: 'B',
    explanation: 'The spelling "gh" in "laugh" is pronounced as the voiceless labiodental fricative /f/ (/lɑːf/ or /læf/).'
  },
  {
    id: 29,
    questionNumber: 29,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word has the same consonant sound at the beginning as “judge”?',
    options: {
      A: 'giant',
      B: 'goat',
      C: 'game',
      D: 'girl'
    },
    correctAnswer: 'A',
    explanation: 'Both "judge" and "giant" begin with the voiced postalveolar affricate /dʒ/.'
  },
  {
    id: 30,
    questionNumber: 30,
    section: 'phonetics',
    sectionTitle: 'Section C: Phonetics',
    questionText: 'Which word has a different initial sound?',
    options: {
      A: 'think',
      B: 'thought',
      C: 'this',
      D: 'thick'
    },
    correctAnswer: 'C',
    explanation: '"this" begins with the voiced dental fricative /ð/, whereas "think", "thought", and "thick" begin with the voiceless dental fricative /θ/.'
  },

  // SECTION D: FIGURES OF SPEECH (31 - 40)
  {
    id: 31,
    questionNumber: 31,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“The wind whispered through the trees” is an example of:',
    options: {
      A: 'simile',
      B: 'personification',
      C: 'irony',
      D: 'hyperbole'
    },
    correctAnswer: 'B',
    explanation: 'Giving human characteristics ("whispered") to non-human elements ("the wind") is personification.'
  },
  {
    id: 32,
    questionNumber: 32,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“He is as brave as a lion” is an example of:',
    options: {
      A: 'metaphor',
      B: 'irony',
      C: 'simile',
      D: 'pun'
    },
    correctAnswer: 'C',
    explanation: 'A direct comparison using "as... as" or "like" is a simile.'
  },
  {
    id: 33,
    questionNumber: 33,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“The classroom was a zoo” is an example of:',
    options: {
      A: 'metaphor',
      B: 'simile',
      C: 'personification',
      D: 'euphemism'
    },
    correctAnswer: 'A',
    explanation: 'An implied comparison stating that one thing is another without using "like" or "as" is a metaphor.'
  },
  {
    id: 34,
    questionNumber: 34,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“I have told you a million times” is an example of:',
    options: {
      A: 'irony',
      B: 'hyperbole',
      C: 'metaphor',
      D: 'oxymoron'
    },
    correctAnswer: 'B',
    explanation: 'An intentional, deliberate exaggeration for emphasis is hyperbole.'
  },
  {
    id: 35,
    questionNumber: 35,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“The sweet pain of separation” contains:',
    options: {
      A: 'paradox',
      B: 'oxymoron',
      C: 'simile',
      D: 'alliteration'
    },
    correctAnswer: 'B',
    explanation: 'Juxtaposing two contradictory terms side-by-side ("sweet pain") is an oxymoron.'
  },
  {
    id: 36,
    questionNumber: 36,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“Peter Piper picked plenty of peppers” illustrates:',
    options: {
      A: 'irony',
      B: 'alliteration',
      C: 'metaphor',
      D: 'euphemism'
    },
    correctAnswer: 'B',
    explanation: 'The repetition of the same initial consonant sound (/p/) across adjacent words is alliteration.'
  },
  {
    id: 37,
    questionNumber: 37,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“The leaves danced in the wind” is an example of:',
    options: {
      A: 'personification',
      B: 'simile',
      C: 'pun',
      D: 'litotes'
    },
    correctAnswer: 'A',
    explanation: 'Assigning the human action of dancing to leaves is personification.'
  },
  {
    id: 38,
    questionNumber: 38,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“She sells seashells by the seashore” mainly illustrates:',
    options: {
      A: 'hyperbole',
      B: 'alliteration',
      C: 'metaphor',
      D: 'irony'
    },
    correctAnswer: 'B',
    explanation: 'The repeated initial sibilant consonant sound (/s/ and /ʃ/) across words illustrates alliteration.'
  },
  {
    id: 39,
    questionNumber: 39,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“He passed away” instead of “He died” is an example of:',
    options: {
      A: 'euphemism',
      B: 'paradox',
      C: 'simile',
      D: 'sarcasm'
    },
    correctAnswer: 'A',
    explanation: 'A mild or indirect expression substituted for an unpleasant or blunt one ("died") is a euphemism.'
  },
  {
    id: 40,
    questionNumber: 40,
    section: 'figures_of_speech',
    sectionTitle: 'Section D: Figures of Speech',
    questionText: '“The more you learn, the less you realize you know” is an example of:',
    options: {
      A: 'personification',
      B: 'paradox',
      C: 'alliteration',
      D: 'simile'
    },
    correctAnswer: 'B',
    explanation: 'A seemingly contradictory statement that upon closer inspection reveals a deeper truth is a paradox.'
  },

  // SECTION E: COMPREHENSION (41 - 45)
  {
    id: 41,
    questionNumber: 41,
    section: 'comprehension',
    sectionTitle: 'Section E: Comprehension',
    passage: COMPREHENSION_PASSAGE,
    questionText: 'According to the passage, education is important for:',
    options: {
      A: 'entertainment only',
      B: 'personal and national development',
      C: 'passing examinations only',
      D: 'making students wealthy'
    },
    correctAnswer: 'B',
    explanation: 'The passage opens explicitly: "Education is an important instrument for personal and national development."'
  },
  {
    id: 42,
    questionNumber: 42,
    section: 'comprehension',
    sectionTitle: 'Section E: Comprehension',
    passage: COMPREHENSION_PASSAGE,
    questionText: 'Education provides individuals with:',
    options: {
      A: 'money and houses',
      B: 'fame and popularity',
      C: 'knowledge and skills',
      D: 'political positions'
    },
    correctAnswer: 'C',
    explanation: 'The second sentence states: "It provides individuals with knowledge and skills that enable them to contribute meaningfully to society."'
  },
  {
    id: 43,
    questionNumber: 43,
    section: 'comprehension',
    sectionTitle: 'Section E: Comprehension',
    passage: COMPREHENSION_PASSAGE,
    questionText: 'According to the passage, education should NOT be limited to:',
    options: {
      A: 'learning',
      B: 'development',
      C: 'passing examinations',
      D: 'critical thinking'
    },
    correctAnswer: 'C',
    explanation: 'The passage stresses: "However, education should not be limited to passing examinations."'
  },
  {
    id: 44,
    questionNumber: 44,
    section: 'comprehension',
    sectionTitle: 'Section E: Comprehension',
    passage: COMPREHENSION_PASSAGE,
    questionText: 'Which of the following is mentioned as a quality students should develop?',
    options: {
      A: 'Laziness',
      B: 'Creativity',
      C: 'Dishonesty',
      D: 'Pride'
    },
    correctAnswer: 'B',
    explanation: 'The text lists: "Students should also develop critical thinking, creativity, discipline and good character."'
  },
  {
    id: 45,
    questionNumber: 45,
    section: 'comprehension',
    sectionTitle: 'Section E: Comprehension',
    passage: COMPREHENSION_PASSAGE,
    questionText: 'A society that invests in quality education is likely to produce:',
    options: {
      A: 'irresponsible citizens',
      B: 'dependent citizens',
      C: 'responsible citizens',
      D: 'unemployed citizens'
    },
    correctAnswer: 'C',
    explanation: 'The concluding sentence states: "A society that invests in quality education is more likely to produce responsible citizens capable of solving its problems."'
  },

  // SECTION F: SENTENCE COMPLETION AND USAGE (46 - 50)
  {
    id: 46,
    questionNumber: 46,
    section: 'sentence_completion',
    sectionTitle: 'Section F: Sentence Completion and Usage',
    questionText: 'No sooner had the teacher entered the class _____ the students became quiet.',
    options: {
      A: 'when',
      B: 'than',
      C: 'and',
      D: 'but'
    },
    correctAnswer: 'B',
    explanation: 'Correlative conjunction rule: "No sooner" pairs strictly with "than" ("No sooner had... than...").'
  },
  {
    id: 47,
    questionNumber: 47,
    section: 'sentence_completion',
    sectionTitle: 'Section F: Sentence Completion and Usage',
    questionText: 'Hardly had she arrived _____ it started raining.',
    options: {
      A: 'than',
      B: 'when',
      C: 'and',
      D: 'but'
    },
    correctAnswer: 'B',
    explanation: 'Correlative conjunction rule: "Hardly" and "Scarcely" pair strictly with "when" ("Hardly had... when...").'
  },
  {
    id: 48,
    questionNumber: 48,
    section: 'sentence_completion',
    sectionTitle: 'Section F: Sentence Completion and Usage',
    questionText: 'The man was accused _____ stealing the money.',
    options: {
      A: 'for',
      B: 'with',
      C: 'of',
      D: 'on'
    },
    correctAnswer: 'C',
    explanation: 'The verb "accuse" takes the dependent preposition "of" (accused of a crime).'
  },
  {
    id: 49,
    questionNumber: 49,
    section: 'sentence_completion',
    sectionTitle: 'Section F: Sentence Completion and Usage',
    questionText: 'We are looking forward _____ from you soon.',
    options: {
      A: 'to hear',
      B: 'hearing',
      C: 'to hearing',
      D: 'hear'
    },
    correctAnswer: 'C',
    explanation: 'In the phrasal verb "look forward to", the "to" is a preposition, which must be followed by a gerund ("hearing"), not a bare infinitive.'
  },
  {
    id: 50,
    questionNumber: 50,
    section: 'sentence_completion',
    sectionTitle: 'Section F: Sentence Completion and Usage',
    questionText: 'Despite _____ very tired, she continued studying.',
    options: {
      A: 'she was',
      B: 'being',
      C: 'she is',
      D: 'to be'
    },
    correctAnswer: 'B',
    explanation: '"Despite" is a preposition and must be followed by a noun or gerund ("being"), never directly by a finite clause like "she was".'
  }
];

export const calculateExamGrade = (score: number, total: number = 50): {
  percentage: number;
  grade: string;
  remark: string;
  color: string;
} => {
  const percentage = Math.round((score / total) * 100);
  if (percentage >= 75) {
    return { percentage, grade: 'A1', remark: 'Excellent / Distinction', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' };
  } else if (percentage >= 70) {
    return { percentage, grade: 'B2', remark: 'Very Good', color: 'text-blue-600 bg-blue-50 border-blue-300' };
  } else if (percentage >= 65) {
    return { percentage, grade: 'B3', remark: 'Good', color: 'text-cyan-600 bg-cyan-50 border-cyan-300' };
  } else if (percentage >= 60) {
    return { percentage, grade: 'C4', remark: 'Credit (Upper)', color: 'text-indigo-600 bg-indigo-50 border-indigo-300' };
  } else if (percentage >= 55) {
    return { percentage, grade: 'C5', remark: 'Credit', color: 'text-violet-600 bg-violet-50 border-violet-300' };
  } else if (percentage >= 50) {
    return { percentage, grade: 'C6', remark: 'Credit (Pass)', color: 'text-amber-600 bg-amber-50 border-amber-300' };
  } else if (percentage >= 45) {
    return { percentage, grade: 'D7', remark: 'Pass', color: 'text-orange-600 bg-orange-50 border-orange-300' };
  } else if (percentage >= 40) {
    return { percentage, grade: 'E8', remark: 'Weak Pass', color: 'text-amber-700 bg-amber-50 border-amber-300' };
  } else {
    return { percentage, grade: 'F9', remark: 'Fail / Needs Immediate Revision', color: 'text-rose-600 bg-rose-50 border-rose-300' };
  }
};
