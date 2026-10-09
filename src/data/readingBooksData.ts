export interface TopicLessonPlan {
  id: string;
  topicTitle: string;
  summary: string;
  learningObjectives: string[];
  coreConcept: string; // Foundations and theoretical breakdown
  howToSolve: {
    ruleOrFormula?: string;
    stepByStepGuide: string[];
    workedExamples: {
      problem: string;
      solution: string;
      explanation: string;
    }[];
  };
  commonMistakes: string[]; // Traps students often fall into
  practiceExercises: {
    question: string;
    hint: string;
    answer: string;
  }[];
  lifeSkillTakeaway?: string; // Independence, problem solving & decision making
}

export interface ReadingBook {
  id: string;
  title: string;
  author: string;
  subject: string;
  stream: 'science' | 'art' | 'both' | 'life_skills';
  targetClass: string; // e.g. 'All Classes' | 'Senior Classes (SS1 - SS3)' | 'Junior Classes (JSS1 - JSS3)'
  coverColor: string;
  badgeBg: string;
  description: string;
  chaptersCount: number;
  estimatedMinutesPerSession: number;
  keyTopics: string[];
  lessonPlans?: TopicLessonPlan[];
  readingExcerpt: string;
  studyQuestions: string[];
  isCustom?: boolean;
  createdAt?: string;
  addedBy?: string;
  sourceFile?: string;
}

// ============================================================================
// VERIFIED LESSON PLANS (Comprehensive guides with worked examples & formulas)
// ============================================================================

export const SAMPLE_LESSON_PLANS: Record<string, TopicLessonPlan> = {
  // 1. Logarithms & Indices
  'logarithms': {
    id: 'plan-math-logarithm',
    topicTitle: 'Logarithms & Indices: Foundations, Laws & Equation Solving',
    summary: 'Master the definition of logarithms, inverse exponential relationships, algebraic logarithmic laws, and the exact step-by-step method to solve logarithmic equations.',
    learningObjectives: [
      'Understand the relationship between index form (bʸ = x) and logarithmic form (log_b(x) = y).',
      'Apply the 4 Fundamental Laws of Logarithms (Product, Quotient, Power, and Base Change).',
      'Solve linear, quadratic, and simultaneous logarithmic equations with complete confidence.',
      'Identify and reject extraneous or undefined roots (e.g. log of negative numbers or zero).'
    ],
    coreConcept: `A logarithm is fundamentally an exponent. It answers the question: "To what power must we raise the base 'b' to obtain the number 'x'?"

Mathematical Definition:
If bʸ = x (where b > 0, b ≠ 1, and x > 0), then:
log_b(x) = y

Key Principles & Notation:
1. Common Logarithm: Written as log(x) with base 10 understood.
2. Natural Logarithm: Written as ln(x) with base e (Euler's number ≈ 2.71828) understood.
3. Domain Restrictions: The argument x must strictly be positive (x > 0). You can never take the real logarithm of zero or a negative number!

The 4 Foundational Laws of Logarithms:
• Law 1 (Product Law): log_b(M × N) = log_b(M) + log_b(N)
• Law 2 (Quotient Law): log_b(M / N) = log_b(M) - log_b(N)
• Law 3 (Power Law): log_b(Mᵏ) = k · log_b(M)
• Law 4 (Identity Laws): log_b(b) = 1, and log_b(1) = 0
• Law 5 (Change of Base): log_b(x) = log_a(x) / log_a(b)`,
    howToSolve: {
      ruleOrFormula: 'Step 1: Simplify using laws -> Step 2: Convert to index form (bʸ = x) -> Step 3: Solve for x -> Step 4: Verify positive domain',
      stepByStepGuide: [
        'Collect all logarithmic terms onto one side of the equation, leaving constants on the other side.',
        'Use the Power Law (log(Mᵏ) = k·log(M)) in reverse to clear any multipliers in front of log terms.',
        'Condense multiple log terms into a single log term using the Product Law (+) and Quotient Law (-).',
        'Convert the single logarithmic statement log_b(f(x)) = c into its equivalent exponential form: f(x) = bᶜ.',
        'Solve the resulting algebraic equation (linear or quadratic) for x.',
        'Check your solutions in the original equation! Discard any root that results in taking the logarithm of a negative number or zero.'
      ],
      workedExamples: [
        {
          problem: 'Solve for x: log₁₀(x + 3) + log₁₀(x - 3) = log₁₀(16)',
          solution: `Step 1: Combine the left side using the Product Law:
log₁₀[(x + 3)(x - 3)] = log₁₀(16)

Step 2: Since bases on both sides are identical (base 10), equate their arguments:
(x + 3)(x - 3) = 16

Step 3: Expand the difference of two squares:
x² - 9 = 16
x² = 25
x = ±5

Step 4: Check domain validity:
• If x = 5: arguments are (5+3)=8 > 0 and (5-3)=2 > 0 (VALID!)
• If x = -5: arguments are (-5+3)=-2 < 0 (UNDEFINED!)

Final Answer: x = 5`,
          explanation: 'Always verify solutions against the logarithm domain condition (argument must be > 0). Even though -5 satisfies the quadratic algebraic equation, it is an extraneous root in logarithmic space.'
        },
        {
          problem: 'Given that log₁₀(2) = 0.3010 and log₁₀(3) = 0.4771, evaluate log₁₀(72) without using a calculator.',
          solution: `Step 1: Express 72 in terms of prime factors 2 and 3:
72 = 8 × 9 = 2³ × 3²

Step 2: Apply the Product and Power Laws:
log₁₀(72) = log₁₀(2³ × 3²)
= log₁₀(2³) + log₁₀(3²)
= 3 · log₁₀(2) + 2 · log₁₀(3)

Step 3: Substitute the known numerical values:
= 3(0.3010) + 2(0.4771)
= 0.9030 + 0.9542
= 1.8572`,
          explanation: 'Factorizing numbers into powers of given base components is the standard WAEC/NECO technique for evaluating logarithms without a calculator.'
        }
      ]
    },
    commonMistakes: [
      'Mistake: Writing log(x + y) = log(x) + log(y). (CORRECT: log(xy) = log(x) + log(y), you cannot distribute log over addition!).',
      'Mistake: Confusing log(x) / log(y) with log(x - y). (CORRECT: log(x / y) = log(x) - log(y)).',
      'Mistake: Forgetting to verify answers in original equation and keeping negative arguments.',
      'Mistake: Forgetting that log_b(1) = 0 for any positive base b.'
    ],
    practiceExercises: [
      {
        question: 'Solve for x: log₂(x) + log₂(x - 2) = 3',
        hint: 'Combine left side to log₂(x(x - 2)) = 3, then convert to exponential form: x(x - 2) = 2³.',
        answer: 'x = 4 (note: x = -2 is rejected because arguments must be positive).'
      },
      {
        question: 'Simplify without tables: log₁₀(25) + log₁₀(4)',
        hint: 'Use the Product Law: log(A) + log(B) = log(A × B).',
        answer: 'log₁₀(25 × 4) = log₁₀(100) = log₁₀(10²) = 2.'
      },
      {
        question: 'If 3ˣ = 50, express x in terms of common logarithms.',
        hint: 'Take log of both sides: log(3ˣ) = log(50), then bring x to the front.',
        answer: 'x = log(50) / log(3) ≈ 1.6990 / 0.4771 ≈ 3.56.'
      }
    ],
    lifeSkillTakeaway: 'Logarithmic thinking teaches you scale and non-linear growth. In life and money (such as compound interest or earthquakes), consequences multiply rather than add. Understanding logarithms equips you to evaluate exponential growth in investments and decisions.'
  },

  // 2. Budgeting & Financial Independence
  'budgeting': {
    id: 'plan-life-money-budget',
    topicTitle: 'Budgeting with the 50/30/20 Rule & Taking Independent Money Decisions',
    summary: 'Learn practical money management: how to allocate pocket money or income, avoid debt, differentiate needs from wants, and build a savings cushion for personal independence.',
    learningObjectives: [
      'Master the classic 50/30/20 budgeting framework tailored for young people and students.',
      'Differentiate strictly between true "Needs" and impulsive "Wants".',
      'Learn how to track every naira or dollar spent and resist peer pressure spending.',
      'Build the discipline of "Paying Yourself First" before any discretionary purchases.'
    ],
    coreConcept: `Money is a tool for personal freedom and responsibility, not a symbol of status. When you master your money early, you never have to depend helplessly on others for your basic dignity.

The 50/30/20 Rule Adapted for Students & Young People:
• 50% Needs (Essentials): Transport, books, school feeding, basic airtime/data for homework, mandatory tools.
• 30% Wants (Comforts & Social): Snacks, entertainment, trending clothes, leisure with friends.
• 20% Independence Savings & Investing: Emergency fund, self-development courses, long-term savings.

The Golden Rule of Wealth:
"Do not save what is left after spending; spend what is left after saving." (Warren Buffett)

The 24-Hour Cool-Off Rule for Impulsive Spending:
Whenever you feel an urge to buy an unbudgeted item, wait 24 hours. In over 80% of cases, the emotional urge fades and you keep your hard-earned money!`,
    howToSolve: {
      ruleOrFormula: 'Income - 20% Direct Savings = Available Spending (Allocated to Needs first, then Wants)',
      stepByStepGuide: [
        'Calculate your total predictable weekly or monthly allowance/income.',
        'Immediately subtract 20% and transfer it into a separate savings box or locked digital account.',
        'List your mandatory fixed expenses for the period (school materials, daily transport).',
        'Allocate the remaining cash for food, minor personal treats, or social connection.',
        'Keep a tiny physical pocket notebook or phone memo: record every transaction at the exact moment you pay.',
        'Review every Sunday evening: Did you stay within budget? If you overspent on snacks, adjust the next week!'
      ],
      workedExamples: [
        {
          problem: 'Victoria receives ₦10,000 monthly allowance. She wants to buy a ₦4,000 fashion item, needs ₦5,000 for transport and books, and wants to build savings. How should she allocate her money?',
          solution: `Step 1: Direct 20% Savings (Pay yourself first):
₦10,000 × 20% = ₦2,000 saved immediately!
Remaining cash = ₦8,000

Step 2: Mandatory Needs:
Transport & books = ₦5,000 (Non-negotiable).
Remaining cash = ₦8,000 - ₦5,000 = ₦3,000

Step 3: Wants Evaluation:
The fashion item costs ₦4,000, but only ₦3,000 is available!
Buying it now would force her to borrow ₦1,000 or steal from her transport budget!

Decision for Independence:
• Allocate ₦2,000 towards the item this month (saved in a wishlist fund).
• Keep ₦1,000 for general student flexibility.
• Next month, allocate the remaining ₦2,000 and buy the item debt-free with total peace of mind!`,
          explanation: 'Delayed gratification is the cornerstone of maturity. Waiting one month preserves her transport fund, protects her savings, and keeps her completely independent of borrowing.'
        }
      ]
    },
    commonMistakes: [
      'Mistake: Treating "Wants" (like designer sneakers or restaurant treats) as urgent "Needs".',
      'Mistake: Spending all your money first and hoping to save whatever is left over at the end of the month (there is never anything left!).',
      'Mistake: Borrowing money from friends to maintain a false appearance of wealth.',
      'Mistake: Failing to record small expenses (e.g. buying soda or data credits every day drains thousands unnoticed).'
    ],
    practiceExercises: [
      {
        question: 'You receive ₦15,000 as a birthday gift. What is the recommended minimum amount to put into your long-term independence savings?',
        hint: 'Use the 20% rule: Multiply ₦15,000 by 0.20.',
        answer: '₦3,000 minimum (20%). High-achievers might choose to save 50% (₦7,500)!'
      },
      {
        question: 'Your friends are going to an expensive hangout that costs ₦6,000, but your entertainment budget has only ₦2,000 remaining. What is the respectful, independent decision?',
        hint: 'True leaders communicate honestly without shame.',
        answer: 'Politely decline or suggest a free alternative (e.g., studying together or walking in the park). Never go into debt or compromise your school funds for peer validation.'
      }
    ],
    lifeSkillTakeaway: 'Financial independence is not about how much money you earn, but how much you retain and control. When you live below your means, you are never vulnerable to panic, manipulation, or desperation.'
  },

  // 3. Conflict Resolution & Healthy Relationships
  'relationships': {
    id: 'plan-life-relationships',
    topicTitle: 'Resolving Relationship Conflicts Peacefully & Setting Healthy Boundaries',
    summary: 'Develop mature interpersonal skills: how to express feelings without shouting, resolve misunderstandings with parents and friends, and stand firm against peer pressure with dignity.',
    learningObjectives: [
      'Learn the 4-Step "I-Statement" communication formula to address grievances without triggering defensive anger.',
      'Master the art of Active Listening (listening to understand rather than to attack).',
      'Establish clear, respectful personal boundaries with peers and romantic interests.',
      'Know when to de-escalate tension and take a 10-minute timeout during heated arguments.'
    ],
    coreConcept: `Healthy relationships are founded on mutual respect, honest vulnerability, and clear boundaries. Conflict is normal in any human relationship; what distinguishes mature people is HOW they handle disagreement.

The Two Destructive Traps in Conflict:
1. Aggression (The Volcano): Yelling, insulting, using accusatory words ("You always...", "You never..."), slamming doors.
2. Passive-Aggression (The Cold War): Silent treatment, spreading rumors, sulking, withholding communication.

The Mature Constructive Path (Assertive Respect):
Address the behavior, not the person's character. Express your experience clearly, listen to their perspective, and work together against the problem rather than against each other.`,
    howToSolve: {
      ruleOrFormula: 'The "I-Statement" Formula: "I feel [EMOTION] when [SPECIFIC EVENT] happens, because [REASON]. What I need moving forward is [CLEAR REQUEST]."',
      stepByStepGuide: [
        'Pause & Regulate: When angry, take 3 deep breaths. If your heart rate is elevated, say: "I care about our relationship, but I am upset right now. Let us talk in 20 minutes when we are calm."',
        'Use "I-Statements" instead of accusatory "You-Statements". Instead of "You are selfish and irresponsible!", say: "I felt overwhelmed when the group project wasn\'t submitted on time."',
        'Practice Reflective Listening: Paraphrase what the other person said: "What I hear you saying is that you felt left out. Is that right?"',
        'Separate the Person from the Problem: Put the problem in the center of the table and solve it as teammates.',
        'Agree on an Actionable Solution: Commit to a specific adjustment each person will make.'
      ],
      workedExamples: [
        {
          problem: 'Your best friend borrowed your school textbook without permission, and when you asked for it, they replied casually and forgot it at home.',
          solution: `Immature Reaction (Damages trust):
Screaming: "You are a thief and a terrible friend! I hate you!"

Mature, Independent Resolution (Restores boundary with dignity):
1. Wait until you are alone (never humiliate a friend in public).
2. Use the I-Statement:
"Chidi, I felt really anxious and stressed this morning when I couldn't find my Physics textbook, because our teacher was checking homework notes. I value our friendship, but I need you to always ask before taking my books, and to bring it back tomorrow morning."
3. Listen to their explanation without interrupting.
4. Conclude with firm boundary:
"Thank you for understanding. Let's make sure it doesn't happen again."`,
          explanation: 'This approach establishes a crystal-clear boundary, protects your academic work, and gives your friend a chance to take responsibility without being humiliated.'
        }
      ]
    },
    commonMistakes: [
      'Mistake: Bringing up old mistakes from months ago during a current argument (kitchen-sinking).',
      'Mistake: Giving the silent treatment for days instead of speaking honestly.',
      'Mistake: Agreeing to things that hurt your values just to keep someone as a friend.',
      'Mistake: Venting your personal relationship conflicts to third parties on social media.'
    ],
    practiceExercises: [
      {
        question: 'Rephrase this accusatory statement into a healthy I-Statement: "You never listen to me and you only care about your own games!"',
        hint: 'Start with: "I feel...", mention when it happens, and state what you need.',
        answer: '"I feel unheard when you look at your phone while I am sharing something important. I would really appreciate 5 minutes of focused conversation."'
      },
      {
        question: 'What is the recommended response when an argument with a sibling or parent starts escalating into shouting?',
        hint: 'Remember emotional de-escalation.',
        answer: 'Lower your voice tone, take a step back, and propose a brief pause: "I want to hear you, but shouting won\'t help us. Let me drink water and return so we can solve this calmly."'
      }
    ],
    lifeSkillTakeaway: 'You cannot control how other people behave; you can only control your response. Responding with composure and clear boundaries is the ultimate mark of an independent, mature mind.'
  },

  // 4. Respect, Ownership & Responsibility
  'responsibility': {
    id: 'plan-life-responsibility',
    topicTitle: 'Character, Moral Respect & Personal Responsibility: The Young Leader\'s Guide',
    summary: 'Learn how to take 100% ownership of your life: eliminate excuses, respect elders and peers, execute daily chores with pride, and develop unshakeable integrity.',
    learningObjectives: [
      'Understand the "Locus of Control": shift from blaming circumstances to taking proactive action.',
      'Practice deep respect for parents, teachers, and elders as a personal strength, not weakness.',
      'Master the "Extreme Ownership" mindset for your homework, chores, habits, and future.',
      'Cultivate private integrity: doing the right thing when absolutely no one is watching.'
    ],
    coreConcept: `Responsibility is the price of freedom. If you want adults to treat you like an independent person who can make their own decisions, you must demonstrate that you can manage yourself without constant supervision.

The Equation of Responsibility:
Event (E) + Response (R) = Outcome (O)
You cannot always control the Event (E), but your Response (R) is 100% within your command. Immature people blame the Event; independent leaders focus entirely on crafting a disciplined Response.

Respect is Not Submission:
Respecting your elders, teachers, and peers is an expression of your own high character. When you greet respectfully, speak courteously, and listen attentively, you command natural authority and open doors that brilliance alone cannot open.`,
    howToSolve: {
      ruleOrFormula: 'No Excuses Formula: Acknowledge Mistake Immediately + Offer Solution + Execute Without Delay',
      stepByStepGuide: [
        'Stop the Excuse Reflex: When called out for a delayed chore or poor test result, banish phrases like: "The traffic was bad", "My alarm didn\'t ring", "My sister distracted me".',
        'Own It Fully: Say: "I failed to prepare on time. That is on me, and I apologize."',
        'Propose the Remedy: Immediately state what you will do to rectify the situation: "I will wake up 30 minutes earlier and complete the task before 5:00 PM today."',
        'Fulfill Chores Proactively: Do your laundry, wash plates, clean your room, and organize your desk BEFORE being reminded.',
        'Honesty in the Dark: Refuse to cheat on CBT tests, copy friends\' homework, or tell convenient lies. Your word is your bond.'
      ],
      workedExamples: [
        {
          problem: 'You forgot to wash the kitchen dishes as agreed with your mother, and she returns home tired from work to find the sink full.',
          solution: `The Immature Victim Response:
"You didn't remind me! Besides, my brother used most of the plates, why didn't he wash them?" (Triggers anger, damages trust).

The Leader's Ownership Response:
1. Immediately step to the sink without delay or grumbling.
2. Say with genuine respect: "Mom, I am sorry. I forgot to wash the dishes earlier and you shouldn't have to meet a messy kitchen after a long day. Please sit down and rest; I will have the entire kitchen spotless in 15 minutes."
3. Wash the dishes thoroughly, wipe the counters, and dry your hands.`,
          explanation: 'Taking immediate, cheerful ownership defuses tension instantly. It proves to your family that you are maturing into a dependable, responsible adult.'
        }
      ]
    },
    commonMistakes: [
      'Mistake: Waiting to be commanded before doing basic personal chores (making bed, cleaning shoes, doing homework).',
      'Mistake: Rolling eyes or murmuring under your breath when corrected by elders.',
      'Mistake: Confusing arrogance with confidence. True confidence is quiet, respectful, and reliable.',
      'Mistake: Keeping promises only when convenient.'
    ],
    practiceExercises: [
      {
        question: 'What is the fundamental difference between an excuse and an explanation?',
        hint: 'An excuse avoids accountability, while an explanation includes taking responsibility.',
        answer: 'An excuse tries to shift blame onto external factors to escape consequences. An explanation states what occurred while accepting full personal responsibility to fix it.'
      },
      {
        question: 'Give three concrete actions a student can take tomorrow to demonstrate independent responsibility at home.',
        hint: 'Think about mornings, chores, and school preparation.',
        answer: '1. Wake up to your own alarm without parents shouting. 2. Pack your school bag and press your uniform the night before. 3. Complete household chores proactively before sitting down to use your phone.'
      }
    ],
    lifeSkillTakeaway: 'The day you stop making excuses is the day your independence begins. When you take responsibility for your mistakes, you also gain the power to create your own success.'
  },

  // 5. The 5-Step Problem Solving & Decision Making Method
  'decision_making': {
    id: 'plan-life-decisions',
    topicTitle: 'The 5-Step Problem-Solving & Independent Decision-Making Matrix',
    summary: 'Master the universal cognitive toolkit: how to define complex problems, brainstorm 3 options, weigh long-term consequences, and take decisive action without paralyzing anxiety.',
    learningObjectives: [
      'Master the 5-Step Decision Matrix: Pause, Define, Brainstorm, Weigh, and Execute.',
      'Distinguish between Root Causes and surface symptoms of problems.',
      'Apply the 10-10-10 Rule (How will this decision feel in 10 minutes, 10 months, and 10 years?).',
      'Overcome decision paralysis and fear of making mistakes.'
    ],
    coreConcept: `Independence is the capacity to make sound decisions and solve real-world problems without someone holding your hand. Every problem has a structure; when you break it down methodically, confusion evaporates.

The 10-10-10 Rule for Decision Making:
Before making any significant academic, financial, or personal choice, ask:
1. How will I feel about this choice in 10 MINUTES? (Short-term pleasure or relief)
2. How will I feel about this choice in 10 MONTHS? (Medium-term consequences on exams or reputation)
3. How will I feel about this choice in 10 YEARS? (Long-term character, career, and life trajectory)

Most terrible decisions feel great for 10 minutes, but disastrous for 10 months and 10 years! Independent thinkers prioritize the 10-month and 10-year view.`,
    howToSolve: {
      ruleOrFormula: 'Step 1: Define Problem -> Step 2: List 3 Realistic Options -> Step 3: 10-10-10 Analysis -> Step 4: Choose & Act -> Step 5: Evaluate',
      stepByStepGuide: [
        'Pause & Breathe: Never make a major decision when you are Hungry, Angry, Lonely, or Tired (H.A.L.T.).',
        'State the Problem in One Sentence: "My problem is that my Mathematics mock exam is in 3 weeks, and I struggle with Circle Geometry and Trigonometry."',
        'Brainstorm at Least 3 Viable Options: Avoid binary thinking ("I must either do X or give up"). Always write down 3 distinct paths.',
        'Weigh the Cost and Consequences of Each Option using the 10-10-10 filter.',
        'Select the Best Option and Commit: Don\'t look back or second-guess. Take the first concrete action within 24 hours.',
        'Review the Result: If the outcome isn\'t what you expected, treat it as feedback, not failure, and adjust course.'
      ],
      workedExamples: [
        {
          problem: 'You are invited to an exciting party the night before a crucial WAEC mock test. Your closest friends are attending and teasing you that you study too much.',
          solution: `Step 1: Core Problem:
Balancing friendship desire against high-stakes academic preparation.

Step 2: List 3 Options:
• Option A: Go to the party, stay late, and hope the test is easy.
• Option B: Stay home, study thoroughly, and explain politely to friends.
• Option C: Go for 1 hour to say hello, then leave early to study.

Step 3: 10-10-10 Evaluation of Option A vs Option B:
Option A:
• In 10 minutes: Fun and laughter with friends.
• In 10 months: Regret over failed mock exam, lost administrative distinction, lower confidence.
• In 10 years: Realizing that high school party mattered zero to your life trajectory.
Option B:
• In 10 minutes: Mild FOMO (fear of missing out).
• In 10 months: Pride in scoring distinction, strong academic momentum.
• In 10 years: Developed the superpower of prioritizing your future over temporary distractions.

Step 4: Independent Choice:
Choose Option B. Send a warm text: "Wish I could be there tonight, but I have my big mock exam tomorrow and need to lock in. Let's celebrate together this weekend!"`,
          explanation: 'Real friends respect focus. The 10-10-10 rule provides immediate clarity against temporary peer pressure.'
        }
      ]
    },
    commonMistakes: [
      'Mistake: Deciding based entirely on how you feel right now in the moment.',
      'Mistake: "Paralysis by Analysis" — waiting for a 100% perfect choice instead of taking the best available disciplined step.',
      'Mistake: Expecting others to solve your problems for you instead of bringing proposed solutions.',
      'Mistake: Hiding from problems hoping they will magically solve themselves (problems grow in the dark!).'
    ],
    practiceExercises: [
      {
        question: 'What does the acronym H.A.L.T. warn you against when making important decisions?',
        hint: 'Four vulnerable emotional and physical states.',
        answer: 'Hungry, Angry, Lonely, Tired. Never make permanent decisions in temporary emotional states.'
      },
      {
        question: 'How does generating 3 distinct options prevent panic in difficult situations?',
        hint: 'Think about trapped feeling vs freedom.',
        answer: 'Binary thinking (Yes/No, Do it/Fail) creates anxiety and feeling trapped. Generating a third option stimulates creative problem solving and restores personal agency.'
      }
    ],
    lifeSkillTakeaway: 'The quality of your life is the sum of your decisions. You cannot change yesterday, but every single choice you make today is a vote for the independent, responsible person you are becoming.'
  }
};

// ============================================================================
// CATALOG OF BOOKS: SCIENCE, ART, AND INDEPENDENCE & LIFE SKILLS
// ============================================================================

export const READING_BOOKS_CATALOG: ReadingBook[] = [
  // ==========================================
  // SCIENCE STREAM BOOKS (For Science Students)
  // ==========================================
  {
    id: 'book-sci-1',
    title: 'Senior Secondary Physics: Principles & Experiments',
    author: 'P. N. Okeke & M. W. Anyakoha',
    subject: 'Physics & Mechanics',
    stream: 'science',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-blue-700 via-indigo-800 to-indigo-950',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'The premier classic physics textbook in West Africa covering mechanics, heat energy, waves, optics, electricity, magnetism, and atomic structure.',
    chaptersCount: 28,
    estimatedMinutesPerSession: 30,
    keyTopics: ['Newtonian Laws of Motion & Momentum', 'Work, Energy & Power Principles', 'Reflection & Refraction of Light at Curved Surfaces', 'Ohm’s Law & Electrical Circuits', 'Radioactivity & Half-Life Decay'],
    readingExcerpt: `Chapter 2: Newton's Three Laws of Universal Motion

First Law (Law of Inertia):
Every body continues in its state of rest or uniform motion in a straight line unless compelled to change that state by an external impressed force.

Second Law:
The rate of change of momentum of a body is proportional to the applied force and takes place in the direction in which the force acts.
Formula: F = ma (Force = mass × acceleration)

Third Law (Action & Reaction):
To every action, there is always an equal and opposite reaction.

Whenever a rocket expels hot combustion exhaust gases downward, the equal and opposite reaction propels the rocket upward through the atmosphere!`,
    studyQuestions: [
      'State Newton’s Second Law of Motion in words and mathematical symbols.',
      'Define Inertia and give one real-life observation of inertia in a moving bus.',
      'Calculate the force required to accelerate a 1200 kg car at 2.5 m/s².'
    ]
  },
  {
    id: 'book-sci-2',
    title: 'Modern Biology for West African Secondary Schools',
    author: 'S. T. Ramalingam & B. U. Akpan',
    subject: 'Biology & Life Sciences',
    stream: 'science',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-emerald-700 via-green-800 to-slate-900',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    description: 'Thorough coverage of cellular biology, physiology, photosynthesis, circulatory systems, genetics, Mendelian inheritance, and ecological balance.',
    chaptersCount: 22,
    estimatedMinutesPerSession: 25,
    keyTopics: ['Cell Structure: Plant vs Animal Cells', 'Photosynthesis (Light & Dark Reactions)', 'Human Circulatory & Respiratory Systems', 'Mendelian Genetics & Punnett Squares', 'Ecology: Food Webs & Nutrient Cycles'],
    readingExcerpt: `Chapter 6: Photosynthesis and the Energy Cycle of Plants

Photosynthesis is the biochemical process whereby green plants manufacture organic carbohydrates (glucose) from carbon dioxide and water in the presence of sunlight captured by chlorophyll.

Overall Chemical Equation:
6CO₂ + 6H₂O  ──(Sunlight / Chlorophyll)──>  C₆H₁₂O₆ + 6O₂

The process occurs in two primary phases:
1. The Light-Dependent Reaction (occurs in the thylakoid membranes of chloroplasts, photolysis of water releases oxygen gas).
2. The Dark Reaction or Calvin Cycle (occurs in the stroma, where carbon dioxide is fixed into glucose).

Without photosynthesis, atmospheric oxygen would deplete, bringing an end to aerobic respiration on Earth!`,
    studyQuestions: [
      'Write the balanced chemical equation representing photosynthesis.',
      'Differentiate between plant cells and animal cells in terms of organelles.',
      'What role does chlorophyll play in capturing electromagnetic light energy?'
    ]
  },
  {
    id: 'book-sci-3',
    title: 'New School Chemistry for Senior Secondary Schools',
    author: 'Osei Yaw Ababio',
    subject: 'Chemistry & Molecular Sciences',
    stream: 'science',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-cyan-700 via-teal-800 to-slate-950',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    description: 'The definitive West African chemistry master text covering atomic structure, chemical equilibrium, thermochemistry, electrochemistry, and organic hydrocarbons.',
    chaptersCount: 26,
    estimatedMinutesPerSession: 30,
    keyTopics: ['Periodic Table Trends & Electronic Configuration', 'Stoichiometry, Moles & Gas Volumes', 'Acids, Bases, Salts & Neutralization Titrations', 'Hydrocarbons: Alkanes, Alkenes, Alkynes & Alkanols', 'Electrochemical Cells & Faraday’s Laws'],
    readingExcerpt: `Chapter 8: Principles of Chemical Equilibrium & Le Chatelier

A chemical equilibrium is established in a reversible reaction when the rate of the forward reaction equals the rate of the reverse reaction, and the concentrations of reactants and products remain constant.

Le Chatelier's Principle:
If an external constraint (change in temperature, pressure, or concentration) is applied to a dynamic chemical system in equilibrium, the equilibrium position shifts in a direction that tends to counteract the imposed change.

For example, in Haber's synthesis of ammonia:
N₂(g) + 3H₂(g) ⇌ 2NH₃(g)   (ΔH = -92 kJ/mol)
Because the forward reaction is exothermic, decreasing the temperature shifts equilibrium forward, raising ammonia yield!`,
    studyQuestions: [
      'State Le Chatelier’s Principle in your own words.',
      'Explain how increasing pressure impacts the yield of ammonia in Haber’s process.',
      'Define the term "molar volume of a gas at STP" and state its standard numeric value.'
    ]
  },
  {
    id: 'book-sci-4',
    title: 'Advanced Science Mathematics & Engineering Foundations',
    author: 'A. J. S. Oluwasanmi & E. B. Godman',
    subject: 'Science Mathematics',
    stream: 'science',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-blue-700 via-blue-900 to-slate-950',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
    description: 'Higher-level mathematical methods for science and engineering: quadratic formulas, logarithms, trigonometric proofs, calculus differentiation, vectors, circle theorems, and probability.',
    chaptersCount: 24,
    estimatedMinutesPerSession: 25,
    keyTopics: ['Logarithms & Indices: Foundations, Laws & Equation Solving', 'Quadratic Equations & Discriminants', 'Trigonometric Identities & Sine/Cosine Rules', 'Introduction to Differential Calculus & Gradients', 'Circle Geometry & Geometric Theorems'],
    readingExcerpt: `Chapter 4: Solving Quadratic Equations by Quadratic Formula

A quadratic equation is any second-degree algebraic equation of the standard form:
ax² + bx + c = 0 (where a ≠ 0).

When factorization proves challenging, the Universal Quadratic Formula applies directly:
x = (-b ± √(b² - 4ac)) / (2a)

The expression inside the square root, (b² - 4ac), is referred to as the Discriminant (D):
• If D > 0: There are two distinct, real roots.
• If D = 0: There are two equal, coincident real roots.
• If D < 0: There are no real roots (complex roots).

Always verify your values for a, b, and c including their proper positive or negative signs before substituting!`,
    studyQuestions: [
      'State the standard form of a quadratic equation.',
      'What is the formula for calculating the discriminant, and what does D = 0 signify?',
      'Solve 2x² - 5x + 2 = 0 using the quadratic formula.'
    ],
    lessonPlans: [SAMPLE_LESSON_PLANS['logarithms']]
  },
  {
    id: 'book-sci-5',
    title: 'Computer Science & Algorithm Design for Science Students',
    author: 'Dr. J. C. Okeke & Computer Science Faculty',
    subject: 'Computer Studies & Tech',
    stream: 'science',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-teal-700 via-emerald-800 to-indigo-950',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Foundations of computational thinking, logic gates, flowchart design, programming fundamentals, data representation, and information security.',
    chaptersCount: 18,
    estimatedMinutesPerSession: 20,
    keyTopics: ['Logic Gates: AND, OR, NOT & Truth Tables', 'Algorithm Flowcharts & Pseudocode Writing', 'Binary Number Systems & Two’s Complement', 'Network Topologies & Internet Protocols', 'Database Entity-Relationship Concepts'],
    readingExcerpt: `Chapter 3: Logic Gates and Digital Circuit Architecture

Digital computers process data using binary states: 1 (High / True) and 0 (Low / False).

The Fundamental Logic Gates:
1. AND Gate: Output is 1 only when both input A AND input B are 1.
2. OR Gate: Output is 1 if either input A OR input B (or both) is 1.
3. NOT Gate (Inverter): Inverts the input; turns 1 into 0 and 0 into 1.

Truth Table for 2-Input AND Gate:
A=0, B=0 => Output=0
A=0, B=1 => Output=0
A=1, B=0 => Output=0
A=1, B=1 => Output=1

Combining these simple gates enables the construction of arithmetic logic units (ALUs) capable of executing billions of calculations per second.`,
    studyQuestions: [
      'Draw the truth table for a 2-input OR gate.',
      'Convert decimal number 25 into its 8-bit binary representation.',
      'What is the function of the Arithmetic Logic Unit (ALU) in a CPU?'
    ]
  },

  // =====================================
  // ART STREAM BOOKS (For Art Students)
  // =====================================
  {
    id: 'book-art-1',
    title: 'Selected West African & World Literature Anthology',
    author: 'Wole Soyinka, Chinua Achebe, Buchi Emecheta & William Shakespeare',
    subject: 'Literature in English',
    stream: 'art',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-purple-700 via-fuchsia-800 to-indigo-950',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Prescribed WAEC & NECO literary texts, prose analysis, poetry appreciation, dramatic devices, character motifs, and essay response formats.',
    chaptersCount: 15,
    estimatedMinutesPerSession: 25,
    keyTopics: ['Themes & Conflict in "Things Fall Apart"', 'Dramatic Devices in Shakespearean Tragedies', 'African Poetry: Tone, Mood & Imagery', 'Characterization & Protagonist Tragic Flaws', 'Feminism & Cultural Tradition in African Prose'],
    readingExcerpt: `Act II: Understanding Tragic Flaw (Hamartia) in Dramatic Literature

In classical and modern drama, a tragic flaw (hamartia) is an inherent personality trait of a noble protagonist that leads directly to their downfall.

In Chinua Achebe's *Things Fall Apart*, Okonkwo’s tragic flaw is his profound, dominating fear of appearing weak or resembling his father, Unoka. This fear drives him to rash violence, emotional rigidity, and estrangement from his community's shifting reality.

Key Literary Devices to Look For in Every Text:
• *Irony* (Dramatic, Situational, Verbal)
• *Symbolism* (e.g., the locusts representing the arrival of colonial change)
• *Foreshadowing* (subtle early clues hinting at forthcoming events)

When answering examination questions on literature, always support your character arguments with direct textual evidence and analytical quotations!`,
    studyQuestions: [
      'Define "tragic flaw" and describe how it shapes Okonkwo’s fate in *Things Fall Apart*.',
      'What is the difference between situational irony and dramatic irony?',
      'Identify two major themes in modern African drama and explain their societal significance.'
    ]
  },
  {
    id: 'book-art-2',
    title: 'Government & Constitutional History in West Africa',
    author: 'K. O. Adeleke & E. A. Umo',
    subject: 'Government & Civics',
    stream: 'art',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-rose-700 via-red-800 to-stone-900',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Explores the branches of government, constitutional democracy, citizenship duties, federalism, electoral processes, and the history of Nigerian nationalism.',
    chaptersCount: 19,
    estimatedMinutesPerSession: 20,
    keyTopics: ['The Three Arms of Government (Executive, Legislative, Judiciary)', 'Rule of Law & Fundamental Human Rights', 'Federalism: Merits & Challenges in Nigeria', 'The Electoral System & Democratic Participation', 'Nigerian Constitutional Developments (1922 - 1999)'],
    readingExcerpt: `Chapter 3: Separation of Powers and Checks and Balances

Formulated famously by Baron de Montesquieu in 1748, the Doctrine of Separation of Powers states that tyrannical governance can only be prevented if governmental powers are divided among three autonomous organs:
1. The Legislature: Responsible for making and enacting statutory laws.
2. The Executive: Responsible for implementing and enforcing laws and public policies.
3. The Judiciary: Responsible for interpreting laws and adjudicating legal disputes.

Complementing this is the Principle of Checks and Balances:
Each branch possesses constitutional mechanisms to check and limit the authority of the others. For instance, the President can veto legislation passed by parliament, while the Supreme Court can declare unconstitutional executive actions or parliamentary enactments null and void.`,
    studyQuestions: [
      'Who formulated the doctrine of Separation of Powers and what is its primary purpose?',
      'Give two examples of how the Judiciary checks the power of the Executive.',
      'Explain three fundamental rights guaranteed in the Nigerian 1999 Constitution.'
    ]
  },
  {
    id: 'book-art-3',
    title: 'Christian Religious Studies, Social Ethics & Philosophy',
    author: 'Rev. Dr. S. E. Onwuka & Theological Council',
    subject: 'Religious Studies & Ethics',
    stream: 'art',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-amber-700 via-amber-800 to-stone-900',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Comprehensive study of prophetic literature, social justice, the teachings of Jesus, early apostolic mission, moral integrity, and religious harmony.',
    chaptersCount: 20,
    estimatedMinutesPerSession: 20,
    keyTopics: ['Sovereignty of God & Moral Accountability', 'Prophetic Voice Against Injustice: Amos & Hosea', 'The Sermon on the Mount & Beatitudes', 'Pauline Epistles on Justification & Love', 'Religious Tolerance & National Integration'],
    readingExcerpt: `Chapter 5: Prophetic Advocacy for Social Justice in Ancient Israel

The 8th-century BCE Hebrew prophets, notably Amos and Micah, emphasized that religious observance is hollow without practical moral uprightness and social justice.

Amos declared passionately:
"Let justice roll down like waters, and righteousness like a mighty stream." (Amos 5:24)

Key Themes in Prophetic Literature:
1. Denunciation of corruption, dishonest trade balances, and exploitation of the poor.
2. True religion is evidenced by active compassion toward widows, orphans, and aliens.
3. Leadership accountability before God and the citizenry.

In modern West Africa, this message continues to challenge students and leaders alike to embody public integrity.`,
    studyQuestions: [
      'What were the chief societal grievances condemned by Prophet Amos?',
      'Summarize two ethical principles from the Sermon on the Mount.',
      'How does the study of Christian Religious Studies foster civic responsibility in Nigeria?'
    ]
  },
  {
    id: 'book-art-4',
    title: 'West African & Nigerian Heritage History (Pre-Colonial to 1960)',
    author: 'Prof. J. F. Ade Ajayi & Historical Society of Nigeria',
    subject: 'History & African Heritage',
    stream: 'art',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-orange-700 via-red-800 to-amber-950',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
    description: 'Rich examination of pre-colonial empires (Kanem-Borno, Oyo, Benin, Sokoto Caliphate), transatlantic and trans-Saharan trade, colonial rule, and the anti-colonial nationalist struggle.',
    chaptersCount: 18,
    estimatedMinutesPerSession: 25,
    keyTopics: ['Pre-Colonial State Systems: Oyo, Benin & Sokoto', 'Trans-Saharan Trade Routes & Islamic Scholarship', 'The British Conquest & Lugard’s Indirect Rule Policy', 'Rise of Modern Nigerian Nationalism (Azikiwe, Awolowo, Bello)', 'Constitutional Conferences & 1960 Independence'],
    readingExcerpt: `Chapter 7: The Indirect Rule System and Its Structural Flaws

Introduced by Lord Frederick Lugard following the 1914 amalgamation of the Northern and Southern Protectorates, Indirect Rule was a system of colonial administration that governed indigenous populations through their traditional rulers (Emirs, Obas, and warrant chiefs).

While relatively functional in the centralized emirates of Northern Nigeria, the system encountered profound resistance in Eastern Nigeria where acephalous (segmentary) communities rejected the newly created "Warrant Chiefs," sparking events like the historic 1929 Aba Women’s War.

Significance:
Understanding this history reveals how colonial administrative boundaries and policies shaped modern Nigerian political regionalism.`,
    studyQuestions: [
      'Explain the core features of Lord Lugard’s Indirect Rule policy.',
      'Why did Indirect Rule fail in Eastern Nigeria?',
      'Identify three prominent Nigerian nationalist leaders and their contributions to the 1960 independence.'
    ]
  },
  {
    id: 'book-art-5',
    title: 'Creative Writing, Rhetoric & African Poetry Appreciation',
    author: 'Prof. David J. Banjo & Association of Nigerian Authors',
    subject: 'Creative Arts & Rhetoric',
    stream: 'art',
    targetClass: 'Senior Classes (SS1 - SS3)',
    coverColor: 'from-violet-700 via-purple-900 to-slate-900',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
    description: 'Masterclass in rhetorical persuasion, creative essay craft, oral poetry, African poetic traditions (Praise poetry, Dirges), and critical appreciation.',
    chaptersCount: 16,
    estimatedMinutesPerSession: 20,
    keyTopics: ['The Art of Persuasive & Argumentative Prose', 'Metaphor, Conceit & Imagery in African Verse', 'Oral Literature: Proverbs, Riddles & Folklore', 'Voice, Persona & Point of View in Fiction', 'Critical Review Writing for Arts & Media'],
    readingExcerpt: `Chapter 4: The Power of Metaphor in African Oral and Written Poetry

Metaphor is not merely an ornamental figure of speech; it is a fundamental mode of perception. In African literature, metaphors draw deeply from nature, ancestral memory, and communal resilience.

When Leopold Sedar Senghor or Gabriel Okara write of the "drum" and the "piano", they are not discussing musical instruments in isolation; they are staging the dramatic dialectic between indigenous African cultural authenticity and Western modernism.

Techniques for Powerful Creative Writing:
• *Show, Don't Tell*: Instead of writing "The village was poor", describe "the cracked mud walls and children sharing a single roasted corn cob".
• *Rhythm and Cadence*: Vary sentence lengths to create urgency or contemplative stillness.`,
    studyQuestions: [
      'Explain the distinction between a simile and an extended metaphor.',
      'How does Gabriel Okara utilize contrast in his poem "Piano and Drums"?',
      'Compose a short paragraph describing a stormy day using active sensory verbs.'
    ]
  },

  // ==============================================================
  // INDEPENDENCE & LIFE SKILLS BOOKS (Money, Relationships, Character)
  // ==============================================================
  {
    id: 'book-life-1',
    title: 'Smart Money Habits, Budgeting & Financial Decisions for Youth',
    author: 'Victoria Okajoe & Youth Financial Advisors',
    subject: 'Money & Financial Independence',
    stream: 'life_skills',
    targetClass: 'All Classes',
    coverColor: 'from-emerald-700 via-teal-800 to-slate-900',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Essential guide teaching young people how to master money: budgeting with the 50/30/20 rule, differentiating needs from wants, avoiding borrowing traps, and building long-term savings.',
    chaptersCount: 14,
    estimatedMinutesPerSession: 20,
    keyTopics: ['Budgeting with the 50/30/20 Rule & Taking Independent Money Decisions', 'Needs vs. Wants: Mastering Delayed Gratification', 'The 24-Hour Rule: Eliminating Impulsive Peer Spending', 'Compound Savings: How Small Daily Habits Build Wealth', 'Earning & Value Creation as a Young Independent Person'],
    readingExcerpt: `Chapter 2: The Freedom of Delayed Gratification

True wealth is not measured by the branded clothes you wear or the newest device in your hands; it is measured by the freedom and peace of mind you have because you control your money.

When you spend every naira the moment it touches your hand, you surrender your future independence. You become a slave to temporary impulses and peer pressure.

The 3 Golden Questions Before Every Purchase:
1. Is this a true NEED for my health and studies, or a WANT for my vanity?
2. If I wait 48 hours, will I still feel this urge to buy?
3. Am I buying this to impress people who do not truly care about my future?

"He who buys what he does not need will soon sell what he does need." Take charge of your wallet today, and you will own your tomorrow.`,
    studyQuestions: [
      'Explain the 50/30/20 budgeting rule and give an example using ₦10,000.',
      'What is the 24-Hour Rule and how does it protect you from peer spending?',
      'Why is saving money considered a key foundation of personal independence?'
    ],
    lessonPlans: [SAMPLE_LESSON_PLANS['budgeting']]
  },
  {
    id: 'book-life-2',
    title: 'Healthy Relationships, Empathy & Resolving Conflicts Peacefully',
    author: 'Dr. Grace Adeleke & Family Counselors',
    subject: 'Relationships & Emotional Maturity',
    stream: 'life_skills',
    targetClass: 'All Classes',
    coverColor: 'from-pink-700 via-rose-800 to-indigo-950',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Practical handbook on managing friendships, resolving family misunderstandings without yelling, handling peer pressure, and setting healthy personal boundaries.',
    chaptersCount: 16,
    estimatedMinutesPerSession: 20,
    keyTopics: ['Resolving Relationship Conflicts Peacefully & Setting Healthy Boundaries', 'The 4-Step "I-Statement" Communication Method', 'Navigating Friendships & Resisting Harmful Peer Groups', 'Parent-Child Communication: Earning Respect & Freedom', 'Active Listening: Listening to Understand, Not to Attack'],
    readingExcerpt: `Chapter 4: The Power of the Calm De-Escalation

In the heat of conflict, the natural human urge is to attack back. Someone raises their voice, so you shout louder. Someone makes a sarcastic comment, so you insult their family.

This reaction is not strength; it is emotional weakness. A truly independent person does not let another person\'s temper dictate their behavior.

The 10-Second Rule of Emotional Composure:
When someone offends or challenges you:
1. Do not speak for 10 seconds.
2. Inhale deeply through your nose and relax your shoulders.
3. Ask yourself: "Do I want to win an argument, or do I want to solve the problem and protect my peace?"

Responding with quiet composure immediately disarms anger and establishes you as the mature adult in the room.`,
    studyQuestions: [
      'Why does shouting during an argument always escalate the problem?',
      'Write down an example of an "I-Statement" to address a friend who borrows items without asking.',
      'How does setting personal boundaries protect your mental health?'
    ],
    lessonPlans: [SAMPLE_LESSON_PLANS['relationships']]
  },
  {
    id: 'book-life-3',
    title: 'Character, Moral Respect & Personal Responsibility: The Young Leader\'s Guide',
    author: 'Victoria Okajoe & Educational Advisors',
    subject: 'Character, Respect & Responsibility',
    stream: 'life_skills',
    targetClass: 'All Classes',
    coverColor: 'from-amber-700 via-yellow-800 to-slate-900',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Inspirational student manual focusing on personal integrity, daily time-blocking, exam composure, self-motivation, respecting parents and teachers, and community leadership.',
    chaptersCount: 15,
    estimatedMinutesPerSession: 20,
    keyTopics: ['Character, Moral Respect & Personal Responsibility: The Young Leader\'s Guide', 'Extreme Ownership: Eliminating Excuses from Your Vocabulary', 'Respect as Strength: Honoring Parents, Elders & Teachers', 'Private Integrity: Doing the Right Thing When Unseen', 'Daily Chores & Self-Management as Building Blocks of Greatness'],
    readingExcerpt: `Chapter 1: The Principle of Extreme Ownership

Brilliance without responsibility is a tragedy. Many intelligent young people fail in life not because they lack brains, but because they carry a victim mindset:
"The teacher didn't like me."
"My parents didn't wake me up."
"The test questions were unfair."

Independent leaders banish these excuses forever. When you take 100% ownership of your life:
• If you wake up late, you adjust your alarm.
• If you struggle with a subject, you study extra hours and seek mentorship.
• If you make a mistake, you apologize promptly without blaming your siblings.

"He who conquers his daily habits has conquered his destiny."`,
    studyQuestions: [
      'What is the formula Event + Response = Outcome (E + R = O)?',
      'Give two examples of how taking responsibility builds trust with parents.',
      'Explain why private integrity is more valuable than public reputation.'
    ],
    lessonPlans: [SAMPLE_LESSON_PLANS['responsibility']]
  },
  {
    id: 'book-life-4',
    title: 'Mastering Independence: The 5-Step Problem Solving & Decision Making Method',
    author: 'Leadership & Youth Development Institute',
    subject: 'Decision Making & Independence',
    stream: 'life_skills',
    targetClass: 'All Classes',
    coverColor: 'from-blue-700 via-indigo-900 to-slate-950',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Step-by-step cognitive training manual teaching teenagers how to analyze problems, brainstorm solutions, weigh consequences using the 10-10-10 rule, and take independent action.',
    chaptersCount: 16,
    estimatedMinutesPerSession: 20,
    keyTopics: ['The 5-Step Problem-Solving & Independent Decision-Making Matrix', 'The 10-10-10 Rule: Evaluating Long-Term Consequences', 'Root Cause Analysis: Why Symptoms Lie', 'Overcoming Fear of Failure & Perfectionism', 'Executing Daily Routines Without Supervision'],
    readingExcerpt: `Chapter 3: The 10-10-10 Rule for Wise Decisions

Most bad decisions in youth occur because we prioritize the next 10 minutes over the next 10 months and 10 years.

Whenever you face a moral, academic, or social dilemma, pause and ask:
1. How will I feel about this choice in 10 MINUTES?
2. How will I feel about this choice in 10 MONTHS?
3. How will I feel about this choice in 10 YEARS?

Skipping homework to play video games feels fantastic for 10 minutes. In 10 months, you face failed exams. In 10 years, you face missed opportunities.
Disciplined people make decisions based on the 10-month and 10-year reality. That is true independence.`,
    studyQuestions: [
      'Name the 5 steps of the Decision-Making Matrix.',
      'How does the 10-10-10 rule prevent impulsive mistakes?',
      'What is "Root Cause Analysis" and why is it superior to treating symptoms?'
    ],
    lessonPlans: [SAMPLE_LESSON_PLANS['decision_making']]
  }
];

const ALL_BOOKS_STORAGE_KEY = 'echo_plan_reading_books_catalog_v3';
const DELETED_BOOKS_STORAGE_KEY = 'echo_plan_reading_books_deleted_v3';

export const getStoredReadingBooks = (): ReadingBook[] => {
  try {
    const deletedRaw = localStorage.getItem(DELETED_BOOKS_STORAGE_KEY);
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    const saved = localStorage.getItem(ALL_BOOKS_STORAGE_KEY);
    if (saved) {
      const parsed: ReadingBook[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(b => !deletedIds.includes(b.id));
      }
    }

    return READING_BOOKS_CATALOG.filter(b => !deletedIds.includes(b.id));
  } catch {
    // fallback
  }
  return READING_BOOKS_CATALOG;
};

/**
 * Returns books specifically tailored to the student stream:
 * - 'science': Science books (Physics, Biology, Chemistry, Science Math, Tech)
 * - 'art': Art books (Literature, Government, CRS, History, Creative Writing)
 * - 'life_skills': Independence, Money, Relationships, Responsibility books
 * - Admin gets all books
 */
export const getStoredReadingBooksForStream = (
  stream: 'science' | 'art' | 'life_skills' | 'general' = 'science',
  isAdmin: boolean = false
): ReadingBook[] => {
  const all = getStoredReadingBooks();
  if (isAdmin) return all;

  if (stream === 'science') {
    const list = all.filter(b => b.stream === 'science');
    return list.length > 0 ? list : READING_BOOKS_CATALOG.filter(b => b.stream === 'science');
  }

  if (stream === 'art') {
    const list = all.filter(b => b.stream === 'art');
    return list.length > 0 ? list : READING_BOOKS_CATALOG.filter(b => b.stream === 'art');
  }

  if (stream === 'life_skills') {
    const list = all.filter(b => b.stream === 'life_skills');
    return list.length > 0 ? list : READING_BOOKS_CATALOG.filter(b => b.stream === 'life_skills');
  }

  return all;
};

/**
 * Retrieves or synthesizes a comprehensive lesson plan for any topic in any book
 */
export const getLessonPlanForTopic = (book: ReadingBook, topicTitle: string): TopicLessonPlan => {
  // Check if book has a pre-built plan matching this title
  if (book.lessonPlans && book.lessonPlans.length > 0) {
    const found = book.lessonPlans.find(p => 
      p.topicTitle.toLowerCase().includes(topicTitle.toLowerCase()) || 
      topicTitle.toLowerCase().includes(p.topicTitle.toLowerCase())
    );
    if (found) return found;
  }

  // Check sample plans dictionary
  const lowerTitle = topicTitle.toLowerCase();
  for (const [key, plan] of Object.entries(SAMPLE_LESSON_PLANS)) {
    if (lowerTitle.includes(key) || plan.topicTitle.toLowerCase().includes(lowerTitle)) {
      return plan;
    }
  }

  // Generate an authentic structured lesson plan dynamically for any curriculum topic
  return {
    id: `plan-dynamic-${book.id}-${encodeURIComponent(topicTitle.slice(0, 15))}`,
    topicTitle: topicTitle,
    summary: `Structured academic lesson plan and comprehensive step-by-step learning guide for ${topicTitle} from ${book.title}.`,
    learningObjectives: [
      `Master the core principles and definitions governing ${topicTitle}.`,
      `Learn the exact step-by-step problem-solving method and formula applications.`,
      `Identify and eliminate common conceptual traps and examination errors.`,
      `Apply this knowledge to practical WAEC/NECO questions and real-world independent decision making.`
    ],
    coreConcept: `Understanding ${topicTitle}:
This topic is an integral curriculum pillar of ${book.subject}. To truly understand this concept rather than merely memorizing it, analyze the fundamental laws that govern how it behaves.

Key Conceptual Foundations:
• Core Rule: Every principle in ${topicTitle} builds upon foundational axioms of ${book.subject}.
• Structural Integrity: Always break down complex questions into known variables, unknown targets, and applicable governing formulas.
• Critical Analysis: Examine why the formula works, rather than just plugging in numbers blindly.`,
    howToSolve: {
      ruleOrFormula: `Standard Method for ${topicTitle}: Step 1: Identify given parameters -> Step 2: Select governing rule -> Step 3: Solve systematically -> Step 4: Verify units and answer`,
      stepByStepGuide: [
        `Carefully read the problem statement twice. Write down all given parameters with proper standard units.`,
        `Identify what you are being asked to find (the target unknown variable).`,
        `Recall the governing formula or rule that links your known variables with the unknown target.`,
        `Substitute the numerical values accurately into the formula, taking care of positive and negative signs.`,
        `Solve the algebraic or conceptual equation step by step, showing all working clearly.`,
        `Verify your final answer: Does the magnitude make physical and mathematical sense?`
      ],
      workedExamples: [
        {
          problem: `Exemplar Problem on ${topicTitle}: Given standard examination conditions in ${book.subject}, demonstrate how to analyze and solve a model curriculum question.`,
          solution: `Step 1: Write down given values clearly.
Step 2: State the standard formula or principle applicable to ${topicTitle}.
Step 3: Perform substitution with exact precision.
Step 4: State final answer with proper units and clear reasoning.`,
          explanation: `Systematic step-by-step presentation earns full working marks in WAEC, NECO, and external examinations.`
        }
      ]
    },
    commonMistakes: [
      `Mistake: Rushing through the question without noting negative signs or unit conversions.`,
      `Mistake: Forgetting to state the formula before substituting numbers.`,
      `Mistake: Assuming a surface symptom is the root cause of the problem.`
    ],
    practiceExercises: [
      {
        question: `Define the primary principle governing ${topicTitle} in your own words.`,
        hint: `Focus on the core relationship between the input and output variables.`,
        answer: `State the definition clearly, include standard symbols, and give one practical example.`
      },
      {
        question: `What are two common mistakes students make when solving questions on ${topicTitle}?`,
        hint: `Think about signs, formula assumptions, and domain constraints.`,
        answer: `1. Ignoring negative signs or unit conversions. 2. Applying formulas outside their valid conditions.`
      }
    ],
    lifeSkillTakeaway: `Mastering ${topicTitle} trains your mind to break down complex challenges into manageable steps. This disciplined analytical habit is the foundation of independent problem solving in finances, career, and personal leadership.`
  };
};

export const updateReadingBook = (book: ReadingBook): ReadingBook[] => {
  try {
    const current = getStoredReadingBooks();
    const index = current.findIndex(b => b.id === book.id);
    let updated: ReadingBook[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = book;
    } else {
      updated = [book, ...current];
    }
    localStorage.setItem(ALL_BOOKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch {
    return READING_BOOKS_CATALOG;
  }
};

export const saveCustomReadingBook = (book: ReadingBook): ReadingBook[] => {
  return updateReadingBook(book);
};

export const deleteCustomReadingBook = (bookId: string): ReadingBook[] => {
  try {
    const current = getStoredReadingBooks();
    const updated = current.filter(b => b.id !== bookId);
    localStorage.setItem(ALL_BOOKS_STORAGE_KEY, JSON.stringify(updated));

    const deletedRaw = localStorage.getItem(DELETED_BOOKS_STORAGE_KEY);
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(bookId)) {
      deletedIds.push(bookId);
      localStorage.setItem(DELETED_BOOKS_STORAGE_KEY, JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch {
    return READING_BOOKS_CATALOG;
  }
};

export const restoreDefaultReadingBooks = (): ReadingBook[] => {
  try {
    localStorage.removeItem(ALL_BOOKS_STORAGE_KEY);
    localStorage.removeItem(DELETED_BOOKS_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
    return READING_BOOKS_CATALOG;
  } catch {
    return READING_BOOKS_CATALOG;
  }
};
