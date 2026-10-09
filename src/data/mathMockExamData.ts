import { ExamQuestion } from './mockExamData';

export const SS2_MATHEMATICS_MOCK_QUESTIONS: ExamQuestion[] = [
  // SECTION A: MULTIPLE CHOICE (Questions 1 - 40)
  {
    id: 101,
    questionNumber: 1,
    section: 'grammar', // using standard category
    sectionTitle: 'Algebra & Expansion',
    questionText: 'Simplify completely: (3x - 2)^2 - (x + 1)(8x - 3).',
    options: {
      A: 'x^2 - 10x + 7',
      B: 'x^2 - 4x + 7',
      C: 'x^2 - 10x + 1',
      D: 'x^2 - 17x + 7'
    },
    correctAnswer: 'D',
    explanation: 'Expanding (3x - 2)^2 gives 9x^2 - 12x + 4. Expanding (x + 1)(8x - 3) gives 8x^2 + 5x - 3. Subtracting gives: (9x^2 - 12x + 4) - (8x^2 + 5x - 3) = x^2 - 17x + 7.'
  },
  {
    id: 102,
    questionNumber: 2,
    section: 'grammar',
    sectionTitle: 'Indices & Exponential Equations',
    questionText: 'Given that 2^(x+1) = 32^(2-x), find x.',
    options: {
      A: '1',
      B: '3/2',
      C: '5/3',
      D: '2'
    },
    correctAnswer: 'B',
    explanation: 'Express 32 as base 2: 32 = 2^5. So 2^(x+1) = (2^5)^(2-x) = 2^(10 - 5x). Equating powers: x + 1 = 10 - 5x => 6x = 9 => x = 9/6 = 3/2.'
  },
  {
    id: 103,
    questionNumber: 3,
    section: 'vocabulary',
    sectionTitle: 'Logarithms',
    questionText: 'If log_10(2) = 0.3010 and log_10(3) = 0.4771, evaluate log_10(72).',
    options: {
      A: '1.5563',
      B: '1.8573',
      C: '2.5563',
      D: '0.8573'
    },
    correctAnswer: 'B',
    explanation: '72 = 2^3 * 3^2. Therefore log_10(72) = 3*log_10(2) + 2*log_10(3) = 3(0.3010) + 2(0.4771) = 0.9030 + 0.9542 = 1.8572 ≈ 1.8573.'
  },
  {
    id: 104,
    questionNumber: 4,
    section: 'grammar',
    sectionTitle: 'Quadratic Equations',
    questionText: 'The roots of x^2 - 7x + k = 0 differ by 1. Find k.',
    options: {
      A: '10',
      B: '12',
      C: '15/2',
      D: '6'
    },
    correctAnswer: 'B',
    explanation: 'Let roots be r and r+1. Sum of roots = 2r + 1 = 7 => 2r = 6 => r = 3. Roots are 3 and 4. Product of roots k = 3 * 4 = 12.'
  },
  {
    id: 105,
    questionNumber: 5,
    section: 'grammar',
    sectionTitle: 'Simultaneous Equations',
    questionText: 'Solve simultaneously: 2x + 3y = 17 and x^2 - y^2 = 7. Which ordered pair is valid?',
    options: {
      A: '(5, 7/3)',
      B: '(4, 3)',
      C: '(7, 1)',
      D: '(1, 5)'
    },
    correctAnswer: 'B',
    explanation: 'Testing (4, 3): 2(4) + 3(3) = 8 + 9 = 17. And 4^2 - 3^2 = 16 - 9 = 7. Both equations hold perfectly.'
  },
  {
    id: 106,
    questionNumber: 6,
    section: 'phonetics',
    sectionTitle: 'Arithmetic Progression (A.P.)',
    questionText: 'The 5th term of an arithmetic progression is 17 and the 12th term is 38. Find the first term.',
    options: {
      A: '5',
      B: '6',
      C: '8',
      D: '11'
    },
    correctAnswer: 'A',
    explanation: 'T5 = a + 4d = 17 and T12 = a + 11d = 38. Subtracting: 7d = 21 => d = 3. First term a = 17 - 4(3) = 17 - 12 = 5.'
  },
  {
    id: 107,
    questionNumber: 7,
    section: 'phonetics',
    sectionTitle: 'Geometric Progression (G.P.)',
    questionText: 'A geometric progression has first term 81 and common ratio 2/3. Find its 6th term.',
    options: {
      A: '32/3',
      B: '81/3',
      C: '32/9',
      D: '8'
    },
    correctAnswer: 'A',
    explanation: 'T6 = a * r^(6-1) = 81 * (2/3)^5 = 81 * (32 / 243). Since 81/243 = 1/3, T6 = 32 / 3.'
  },
  {
    id: 108,
    questionNumber: 8,
    section: 'figures_of_speech',
    sectionTitle: 'Set Theory',
    questionText: 'If n(S)=60, n(A)=35, n(B)=28 and n(A ∪ B)=50, find n(A ∩ B).',
    options: {
      A: '13',
      B: '15',
      C: '17',
      D: '23'
    },
    correctAnswer: 'A',
    explanation: 'By the inclusion-exclusion principle: n(A ∪ B) = n(A) + n(B) - n(A ∩ B) => 50 = 35 + 28 - n(A ∩ B) => n(A ∩ B) = 63 - 50 = 13.'
  },
  {
    id: 109,
    questionNumber: 9,
    section: 'figures_of_speech',
    sectionTitle: 'Set Theory & Venn Diagrams',
    questionText: 'In a class, 40 students take Mathematics, 32 take Physics and 18 take both. If 5 take neither, how many students are in the class?',
    options: {
      A: '54',
      B: '59',
      C: '63',
      D: '75'
    },
    correctAnswer: 'B',
    explanation: 'Students taking at least one subject = n(M ∪ P) = 40 + 32 - 18 = 54. Total students in class = 54 + 5 (neither) = 59.'
  },
  {
    id: 110,
    questionNumber: 10,
    section: 'grammar',
    sectionTitle: 'Functions & Evaluation',
    questionText: 'If f(x) = 2x^2 - 3x + 1, find f(2) - f(-1).',
    options: {
      A: '-3',
      B: '0',
      C: '3',
      D: '6'
    },
    correctAnswer: 'A',
    explanation: 'f(2) = 2(2^2) - 3(2) + 1 = 8 - 6 + 1 = 3. f(-1) = 2(-1)^2 - 3(-1) + 1 = 2 + 3 + 1 = 6. f(2) - f(-1) = 3 - 6 = -3.'
  },
  {
    id: 111,
    questionNumber: 11,
    section: 'grammar',
    sectionTitle: 'Absolute Value Equations',
    questionText: 'Solve: |2x - 5| = 7.',
    options: {
      A: 'x = 6 only',
      B: 'x = -1 only',
      C: 'x = 6 or x = -1',
      D: 'x = 1 or x = -6'
    },
    correctAnswer: 'C',
    explanation: 'Case 1: 2x - 5 = 7 => 2x = 12 => x = 6. Case 2: 2x - 5 = -7 => 2x = -2 => x = -1. Therefore, x = 6 or x = -1.'
  },
  {
    id: 112,
    questionNumber: 12,
    section: 'grammar',
    sectionTitle: 'Variations',
    questionText: 'If y varies inversely as x^2 and y=3 when x=2, find y when x=6.',
    options: {
      A: '1/3',
      B: '2/3',
      C: '1',
      D: '3/4'
    },
    correctAnswer: 'A',
    explanation: 'y = k / x^2. When y=3, x=2 => 3 = k / 4 => k = 12. When x=6 => y = 12 / 6^2 = 12 / 36 = 1/3.'
  },
  {
    id: 113,
    questionNumber: 13,
    section: 'vocabulary',
    sectionTitle: 'Percentage Changes',
    questionText: 'A quantity is increased by 20% and then decreased by 20%. What is the overall percentage change?',
    options: {
      A: '0%',
      B: '4% decrease',
      C: '4% increase',
      D: '8% decrease'
    },
    correctAnswer: 'B',
    explanation: 'Let initial value be 100. After +20%, it is 120. Decreasing 120 by 20%: 120 - 0.20(120) = 120 - 24 = 96. Overall change = 100 - 96 = 4% decrease.'
  },
  {
    id: 114,
    questionNumber: 14,
    section: 'vocabulary',
    sectionTitle: 'Commercial Mathematics',
    questionText: 'A trader buys an item for ₦24,000 and marks it up by 25%. A discount of 12% is then given. Find the selling price.',
    options: {
      A: '₦25,800',
      B: '₦26,400',
      C: '₦26,250',
      D: '₦27,000'
    },
    correctAnswer: 'B',
    explanation: 'Marked price = 24,000 * 1.25 = ₦30,000. Selling price after 12% discount = 30,000 * (1 - 0.12) = 30,000 * 0.88 = ₦26,400.'
  },
  {
    id: 115,
    questionNumber: 15,
    section: 'vocabulary',
    sectionTitle: 'Ratio & Proportions',
    questionText: 'The ratio of boys to girls in a club is 5:7. If 8 boys and 6 girls join, the ratio becomes 13:17. What is the original number of boys?',
    options: {
      A: '20',
      B: '25',
      C: '30',
      D: '145/3 (Inconsistent problem)'
    },
    correctAnswer: 'D',
    explanation: 'Let common multiplier be x. Original boys = 5x, girls = 7x. (5x + 8)/(7x + 6) = 13/17 => 17(5x + 8) = 13(7x + 6) => 85x + 136 = 91x + 78 => 6x = 58 => x = 29/3. Original boys = 5*(29/3) = 145/3.'
  },
  {
    id: 116,
    questionNumber: 16,
    section: 'sentence_completion',
    sectionTitle: 'Geometry of Triangles',
    questionText: 'The angles of a triangle are in the ratio 2:3:4. Find the largest angle.',
    options: {
      A: '60 degrees',
      B: '70 degrees',
      C: '80 degrees',
      D: '90 degrees'
    },
    correctAnswer: 'C',
    explanation: 'Sum of angles in a triangle = 180°. Total ratio parts = 2 + 3 + 4 = 9. 1 part = 180° / 9 = 20°. Largest angle = 4 * 20° = 80°.'
  },
  {
    id: 117,
    questionNumber: 17,
    section: 'sentence_completion',
    sectionTitle: 'Circle Geometry',
    questionText: 'In a cyclic quadrilateral, one angle is 3 times the opposite angle. Find the larger angle.',
    options: {
      A: '90 degrees',
      B: '120 degrees',
      C: '135 degrees',
      D: '150 degrees'
    },
    correctAnswer: 'C',
    explanation: 'Opposite angles of a cyclic quadrilateral sum to 180°. Let smaller angle be x; larger is 3x. x + 3x = 180° => 4x = 180° => x = 45°. Larger angle = 3(45°) = 135°.'
  },
  {
    id: 118,
    questionNumber: 18,
    section: 'sentence_completion',
    sectionTitle: 'Chords & Pythagoras Theorem',
    questionText: 'A chord of a circle is 16 cm long and is 6 cm from the centre. Find the radius.',
    options: {
      A: '8 cm',
      B: '10 cm',
      C: '12 cm',
      D: '14 cm'
    },
    correctAnswer: 'B',
    explanation: 'The perpendicular from the centre bisects the chord into two 8 cm segments. Radius r = sqrt(8^2 + 6^2) = sqrt(64 + 36) = sqrt(100) = 10 cm.'
  },
  {
    id: 119,
    questionNumber: 19,
    section: 'sentence_completion',
    sectionTitle: 'Mensuration: Sectors',
    questionText: 'A sector of radius 14 cm subtends 90 degrees at the centre. Using π = 22/7, find its perimeter.',
    options: {
      A: '50 cm',
      B: '44 cm',
      C: '28 + 7π cm',
      D: '52 cm'
    },
    correctAnswer: 'A',
    explanation: 'Arc length L = (90/360) * 2 * (22/7) * 14 = (1/4) * 88 = 22 cm. Total perimeter = Arc + 2r = 22 + 14 + 14 = 50 cm.'
  },
  {
    id: 120,
    questionNumber: 20,
    section: 'sentence_completion',
    sectionTitle: 'Mensuration: Cylinders',
    questionText: 'A cylinder has radius 7 cm and height 10 cm. Using π = 22/7, find its volume.',
    options: {
      A: '770 cm^3',
      B: '980 cm^3',
      C: '1540 cm^3',
      D: '3080 cm^3'
    },
    correctAnswer: 'C',
    explanation: 'Volume = π * r^2 * h = (22/7) * 7^2 * 10 = 22 * 7 * 10 = 1540 cm^3.'
  },
  {
    id: 121,
    questionNumber: 21,
    section: 'sentence_completion',
    sectionTitle: 'Bearings & Trigonometry',
    questionText: 'The bearing of B from A is 125 degrees. What is the bearing of A from B?',
    options: {
      A: '055 degrees',
      B: '235 degrees',
      C: '305 degrees',
      D: '315 degrees'
    },
    correctAnswer: 'C',
    explanation: 'Because 125° < 180°, reverse bearing = 125° + 180° = 305°.'
  },
  {
    id: 122,
    questionNumber: 22,
    section: 'sentence_completion',
    sectionTitle: 'Trigonometry & Ladders',
    questionText: 'A ladder 10 m long leans against a vertical wall. If the foot is 6 m from the wall, how high does it reach?',
    options: {
      A: '6 m',
      B: '7 m',
      C: '8 m',
      D: '9 m'
    },
    correctAnswer: 'C',
    explanation: 'By Pythagoras theorem: h = sqrt(10^2 - 6^2) = sqrt(100 - 36) = sqrt(64) = 8 m.'
  },
  {
    id: 123,
    questionNumber: 23,
    section: 'sentence_completion',
    sectionTitle: 'Angles of Elevation',
    questionText: 'From a point on the ground, the angle of elevation of the top of a 12 m tower is 30 degrees. Find the horizontal distance from the tower (tan 30° = 1/√3).',
    options: {
      A: '4√3 m',
      B: '6√3 m',
      C: '12√3 m',
      D: '24 m'
    },
    correctAnswer: 'C',
    explanation: 'tan(30°) = Opposite / Adjacent => 1/√3 = 12 / d => d = 12√3 m.'
  },
  {
    id: 124,
    questionNumber: 24,
    section: 'sentence_completion',
    sectionTitle: 'Cosine Rule',
    questionText: 'A triangle has sides 7 cm, 8 cm and 9 cm. Find the angle opposite the 9 cm side, correct to 1 degree.',
    options: {
      A: '71 degrees',
      B: '73 degrees',
      C: '75 degrees',
      D: '79 degrees'
    },
    correctAnswer: 'B',
    explanation: 'cos C = (7^2 + 8^2 - 9^2) / (2 * 7 * 8) = (49 + 64 - 81) / 112 = 32 / 112 = 2/7 ≈ 0.2857. C = arccos(0.2857) ≈ 73.4° ≈ 73°.'
  },
  {
    id: 125,
    questionNumber: 25,
    section: 'comprehension',
    sectionTitle: 'Statistics: Mean',
    questionText: 'The mean of 7 numbers is 18. If one number, 24, is removed, what is the new mean?',
    options: {
      A: '16',
      B: '17',
      C: '17.5',
      D: '18'
    },
    correctAnswer: 'B',
    explanation: 'Sum of 7 numbers = 7 * 18 = 126. New sum after removing 24 = 126 - 24 = 102. New mean = 102 / 6 = 17.'
  },
  {
    id: 126,
    questionNumber: 26,
    section: 'comprehension',
    sectionTitle: 'Statistics: Median & Mode',
    questionText: 'The data are 4, 7, 7, 9, 12, 15, 18. What is the median plus the mode?',
    options: {
      A: '14',
      B: '16',
      C: '18',
      D: '19'
    },
    correctAnswer: 'B',
    explanation: 'Ordered data: 4, 7, 7, 9, 12, 15, 18. The middle (4th) number is 9 (median = 9). The most frequent is 7 (mode = 7). Median + Mode = 9 + 7 = 16.'
  },
  {
    id: 127,
    questionNumber: 27,
    section: 'comprehension',
    sectionTitle: 'Probability: Single Event',
    questionText: 'A bag contains 5 red, 4 blue and 3 green balls. One ball is selected at random. What is the probability it is not blue?',
    options: {
      A: '1/3',
      B: '2/3',
      C: '3/4',
      D: '5/8'
    },
    correctAnswer: 'B',
    explanation: 'Total balls = 5 + 4 + 3 = 12. Balls that are not blue = Red + Green = 5 + 3 = 8. Probability = 8 / 12 = 2/3.'
  },
  {
    id: 128,
    questionNumber: 28,
    section: 'comprehension',
    sectionTitle: 'Probability: Two Dice',
    questionText: 'Two fair dice are rolled. What is the probability that the sum is a prime number?',
    options: {
      A: '5/12',
      B: '1/3',
      C: '7/18',
      D: '1/2'
    },
    correctAnswer: 'A',
    explanation: 'Total outcomes = 36. Prime sums possible are 2, 3, 5, 7, 11. Sum 2 (1), Sum 3 (2), Sum 5 (4), Sum 7 (6), Sum 11 (2). Total favorable = 1+2+4+6+2 = 15. Probability = 15/36 = 5/12.'
  },
  {
    id: 129,
    questionNumber: 29,
    section: 'comprehension',
    sectionTitle: 'Probability: Coin Tosses',
    questionText: 'A fair coin is tossed 3 times. What is the probability of getting at least two heads?',
    options: {
      A: '1/4',
      B: '3/8',
      C: '1/2',
      D: '5/8'
    },
    correctAnswer: 'C',
    explanation: 'Sample space size = 2^3 = 8. Favorable outcomes with ≥2 heads: HHH, HHT, HTH, THH (4 outcomes). Probability = 4/8 = 1/2.'
  },
  {
    id: 130,
    questionNumber: 30,
    section: 'grammar',
    sectionTitle: 'Coordinate Geometry: Intercepts',
    questionText: 'If a line has gradient -3 and passes through (2, 5), find its y-intercept.',
    options: {
      A: '11',
      B: '9',
      C: '7',
      D: '-1'
    },
    correctAnswer: 'A',
    explanation: 'Equation of line: y = mx + c => 5 = -3(2) + c => 5 = -6 + c => c = 11.'
  },
  {
    id: 131,
    questionNumber: 31,
    section: 'grammar',
    sectionTitle: 'Coordinate Geometry: Line Equations',
    questionText: 'Find the equation of the line passing through (1, 4) and (5, 12).',
    options: {
      A: 'y = 2x + 2',
      B: 'y = x + 3',
      C: 'y = 2x + 1',
      D: 'y = 3x + 1'
    },
    correctAnswer: 'A',
    explanation: 'Gradient m = (12 - 4)/(5 - 1) = 8/4 = 2. Using point-slope: y - 4 = 2(x - 1) => y - 4 = 2x - 2 => y = 2x + 2.'
  },
  {
    id: 132,
    questionNumber: 32,
    section: 'grammar',
    sectionTitle: 'Simultaneous Equations',
    questionText: 'If 3x - 2y = 7 and x + 4y = 9, find x + y.',
    options: {
      A: '3',
      B: '4',
      C: '23/7',
      D: '6'
    },
    correctAnswer: 'C',
    explanation: 'From equation 2: x = 9 - 4y. Substituting into 1: 3(9 - 4y) - 2y = 7 => 27 - 14y = 7 => 14y = 20 => y = 10/7. Then x = 9 - 4(10/7) = 23/7. Sum x + y = 13/7 + 10/7 = 23/7.'
  },
  {
    id: 133,
    questionNumber: 33,
    section: 'grammar',
    sectionTitle: 'Quadratic Factorization',
    questionText: 'Solve: 3x^2 - 5x - 2 = 0.',
    options: {
      A: 'x = 2 or x = -1/3',
      B: 'x = -2 or x = 1/3',
      C: 'x = 1 or x = -2/3',
      D: 'x = 2/3 or x = -1'
    },
    correctAnswer: 'A',
    explanation: '3x^2 - 6x + x - 2 = 0 => 3x(x - 2) + 1(x - 2) = 0 => (3x + 1)(x - 2) = 0. Therefore x = 2 or x = -1/3.'
  },
  {
    id: 134,
    questionNumber: 34,
    section: 'grammar',
    sectionTitle: 'Algebraic Identities',
    questionText: 'If x + 1/x = 5, find x^2 + 1/x^2.',
    options: {
      A: '21',
      B: '23',
      C: '25',
      D: '27'
    },
    correctAnswer: 'B',
    explanation: 'Square both sides: (x + 1/x)^2 = x^2 + 2(x)(1/x) + 1/x^2 = x^2 + 2 + 1/x^2 = 25. Thus x^2 + 1/x^2 = 25 - 2 = 23.'
  },
  {
    id: 135,
    questionNumber: 35,
    section: 'grammar',
    sectionTitle: 'Algebraic Identities',
    questionText: 'If a + b = 9 and ab = 14, find a^2 + b^2.',
    options: {
      A: '53',
      B: '67',
      C: '81',
      D: '95'
    },
    correctAnswer: 'A',
    explanation: 'a^2 + b^2 = (a + b)^2 - 2ab = 9^2 - 2(14) = 81 - 28 = 53.'
  },
  {
    id: 136,
    questionNumber: 36,
    section: 'grammar',
    sectionTitle: 'Indices & Bases',
    questionText: 'The expression 4^(x-1) = 8^(2x-3). Find x.',
    options: {
      A: '7/4',
      B: '5/4',
      C: '7/5',
      D: '3/2'
    },
    correctAnswer: 'A',
    explanation: 'Express in base 2: 2^(2(x-1)) = 2^(3(2x-3)) => 2x - 2 = 6x - 9 => 4x = 7 => x = 7/4.'
  },
  {
    id: 137,
    questionNumber: 37,
    section: 'grammar',
    sectionTitle: 'Surds & Rationalisation',
    questionText: 'Rationalise: 5 / (√3 + √2).',
    options: {
      A: '5(√3 - √2)',
      B: '5(√3 + √2)',
      C: '2(√3 - √2)',
      D: '(5/5)(√3 - √2)'
    },
    correctAnswer: 'A',
    explanation: 'Multiply numerator and denominator by conjugate (√3 - √2): [5*(√3 - √2)] / [(√3 + √2)(√3 - √2)] = 5(√3 - √2) / (3 - 2) = 5(√3 - √2).'
  },
  {
    id: 138,
    questionNumber: 38,
    section: 'vocabulary',
    sectionTitle: 'Logarithm Bases',
    questionText: 'If log_a(81) = 4, find a.',
    options: {
      A: '2',
      B: '3',
      C: '4',
      D: '9'
    },
    correctAnswer: 'B',
    explanation: 'By logarithmic definition: a^4 = 81 => a = 81^(1/4) = 3 (since base a must be positive).'
  },
  {
    id: 139,
    questionNumber: 39,
    section: 'phonetics',
    sectionTitle: 'Sum of Arithmetic Progression',
    questionText: 'The sum of the first 15 terms of an arithmetic progression is 300 and its first term is 6. Find the common difference.',
    options: {
      A: '2',
      B: '2.5',
      C: '3',
      D: '4'
    },
    correctAnswer: 'A',
    explanation: 'Sn = (n/2)[2a + (n-1)d] => 300 = (15/2)[2(6) + 14d] => 300 = (15/2)[12 + 14d] => 600 = 15(12 + 14d) => 40 = 12 + 14d => 14d = 28 => d = 2.'
  },
  {
    id: 140,
    questionNumber: 40,
    section: 'vocabulary',
    sectionTitle: 'Ratio & Proportions',
    questionText: 'A sum of ₦18,000 is shared among A, B and C in the ratio 2:3:4. How much more does C receive than A?',
    options: {
      A: '₦2,000',
      B: '₦3,000',
      C: '₦4,000',
      D: '₦6,000'
    },
    correctAnswer: 'C',
    explanation: 'Total parts = 2 + 3 + 4 = 9. 1 part = 18,000 / 9 = ₦2,000. C receives 4 parts = ₦8,000. A receives 2 parts = ₦4,000. Difference = ₦8,000 - ₦4,000 = ₦4,000.'
  },

  // SECTION B: STRUCTURED / ADVANCED (Questions 41 - 50)
  {
    id: 141,
    questionNumber: 41,
    section: 'grammar',
    sectionTitle: 'Section B: Theory & Quadratic Parameters',
    questionText: 'A quadratic equation is given by x^2 - (k+2)x + 2k = 0. Show that x=2 is always a root, find the other root, and state the condition for distinct roots.',
    options: {
      A: 'Other root is k; roots are distinct when k ≠ 2',
      B: 'Other root is 2k; roots are distinct when k ≠ 1',
      C: 'Other root is -k; roots are distinct when k > 0',
      D: 'Other root is k/2; roots are distinct when k ≠ 4'
    },
    correctAnswer: 'A',
    explanation: 'Substituting x=2: 2^2 - (k+2)(2) + 2k = 4 - 2k - 4 + 2k = 0, so x=2 is always a root. Factoring gives (x - 2)(x - k) = 0, so the other root is k. The two roots are distinct when k ≠ 2.'
  },
  {
    id: 142,
    questionNumber: 42,
    section: 'grammar',
    sectionTitle: 'Section B: Straight Line Coordinate Geometry',
    questionText: 'Points A(2, -1) and B(8, 11) lie on a straight line. Find the equation of AB, and find the y-coordinate of point C on the line if its x-coordinate is 15.',
    options: {
      A: 'Equation is y = 2x - 5; y-coordinate of C = 25',
      B: 'Equation is y = 2x + 1; y-coordinate of C = 31',
      C: 'Equation is y = 3x - 7; y-coordinate of C = 38',
      D: 'Equation is y = x + 5; y-coordinate of C = 20'
    },
    correctAnswer: 'A',
    explanation: 'Gradient m = (11 - (-1))/(8 - 2) = 12/6 = 2. Equation: y - (-1) = 2(x - 2) => y + 1 = 2x - 4 => y = 2x - 5. When x = 15: y = 2(15) - 5 = 25.'
  },
  {
    id: 143,
    questionNumber: 43,
    section: 'vocabulary',
    sectionTitle: 'Section B: Business Math & VAT',
    questionText: 'A school bought 240 exercise books at ₦350 each. A supplier gave an 8% discount, after which 7.5% VAT was added to the discounted amount. Find the total amount paid.',
    options: {
      A: '₦81,500',
      B: '₦83,076',
      C: '₦84,000',
      D: '₦86,400'
    },
    correctAnswer: 'B',
    explanation: 'Total before discount = 240 * 350 = ₦84,000. Discount = 8% of 84,000 = ₦6,720. Discounted amount = ₦77,280. VAT = 7.5% of 77,280 = ₦5,796. Total paid = 77,280 + 5,796 = ₦83,076.'
  },
  {
    id: 144,
    questionNumber: 44,
    section: 'figures_of_speech',
    sectionTitle: 'Section B: Probability & Venn Diagrams',
    questionText: 'In a class of 80 students, 46 study Biology, 38 study Chemistry and 15 study both. If one student is chosen at random, find the probability that the student studies exactly one of the two subjects.',
    options: {
      A: '27/40',
      B: '23/40',
      C: '31/40',
      D: '15/80'
    },
    correctAnswer: 'A',
    explanation: 'Only Biology = 46 - 15 = 31. Only Chemistry = 38 - 15 = 23. Exactly one subject = 31 + 23 = 54. Probability = 54 / 80 = 27/40.'
  },
  {
    id: 145,
    questionNumber: 45,
    section: 'sentence_completion',
    sectionTitle: 'Section B: Perimeter of Circular Sector',
    questionText: 'A sector of a circle has radius 21 cm and angle 120 degrees at the centre (use π = 22/7). Find the perimeter of the sector.',
    options: {
      A: '44 cm',
      B: '72 cm',
      C: '86 cm',
      D: '92 cm'
    },
    correctAnswer: 'C',
    explanation: 'Arc length = (120/360) * 2 * (22/7) * 21 = (1/3) * 132 = 44 cm. Perimeter = Arc + 2r = 44 + 21 + 21 = 86 cm.'
  },
  {
    id: 146,
    questionNumber: 46,
    section: 'sentence_completion',
    sectionTitle: 'Section B: Pythagoras & Angles',
    questionText: 'A ladder 13 m long reaches a point 12 m above the ground on a vertical wall. If the foot is moved 5 m farther from the wall without changing ladder length, find the new height reached.',
    options: {
      A: '√69 m (approx 8.31 m)',
      B: '7.50 m',
      C: '9.20 m',
      D: '6.00 m'
    },
    correctAnswer: 'A',
    explanation: 'Initial foot distance = √(13^2 - 12^2) = √(169 - 144) = 5 m. After moving 5 m farther, new base = 5 + 5 = 10 m. New height = √(13^2 - 10^2) = √(169 - 100) = √69 m ≈ 8.31 m.'
  },
  {
    id: 147,
    questionNumber: 47,
    section: 'phonetics',
    sectionTitle: 'Section B: Geometric Progression',
    questionText: 'The first term of a geometric progression is 5 and the common ratio is 3. Find the value of n for which the nth term is 3645.',
    options: {
      A: 'n = 5',
      B: 'n = 6',
      C: 'n = 7',
      D: 'n = 8'
    },
    correctAnswer: 'C',
    explanation: 'Tn = a * r^(n-1) => 3645 = 5 * 3^(n-1) => 3^(n-1) = 729. Since 3^6 = 729, n - 1 = 6 => n = 7.'
  },
  {
    id: 148,
    questionNumber: 48,
    section: 'figures_of_speech',
    sectionTitle: 'Section B: Probability Without Replacement',
    questionText: 'A bag contains 6 red, 5 white and 4 black counters. Two counters are drawn without replacement. Find the probability that the two counters are of different colours.',
    options: {
      A: '31/105',
      B: '74/105',
      C: '45/105',
      D: '2/7'
    },
    correctAnswer: 'B',
    explanation: 'Total counters = 15. Total ways to pick 2 = (15 * 14) / 2 = 105. Ways of same color = (6*5)/2 + (5*4)/2 + (4*3)/2 = 15 + 10 + 6 = 31. P(same) = 31/105. P(different) = 1 - 31/105 = 74/105.'
  },
  {
    id: 149,
    questionNumber: 49,
    section: 'comprehension',
    sectionTitle: 'Section B: Grouped Data Mean',
    questionText: 'The grouped test scores frequencies are: 0-9 (3), 10-19 (7), 20-29 (12), 30-39 (10), 40-49 (8). Estimate the mean using class midpoints.',
    options: {
      A: '25.50',
      B: '27.75',
      C: '28.50',
      D: '30.25'
    },
    correctAnswer: 'B',
    explanation: 'Midpoints (x): 4.5, 14.5, 24.5, 34.5, 44.5. Σ(f*x) = 3(4.5) + 7(14.5) + 12(24.5) + 10(34.5) + 8(44.5) = 13.5 + 101.5 + 294 + 345 + 356 = 1110. Total frequency = 40. Estimated mean = 1110 / 40 = 27.75.'
  },
  {
    id: 150,
    questionNumber: 50,
    section: 'vocabulary',
    sectionTitle: 'Section B: Mixtures & Commercial Profit',
    questionText: 'A trader mixes two grades of rice costing ₦900/kg and ₦1,200/kg. He wants 30 kg of mixture to cost ₦1,020/kg. If sold at ₦1,250/kg, what is his total profit on the 30 kg?',
    options: {
      A: '₦5,400',
      B: '₦6,200',
      C: '₦6,900',
      D: '₦7,500'
    },
    correctAnswer: 'C',
    explanation: 'Cost price of mixture = 30 kg * ₦1,020 = ₦30,600. Selling price = 30 kg * ₦1,250 = ₦37,500. Total profit = ₦37,500 - ₦30,600 = ₦6,900. (Alternatively: profit per kg = 1250 - 1020 = 230; 230 * 30 = ₦6,900).'
  }
];
