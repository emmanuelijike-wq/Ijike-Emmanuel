import { ExamQuestion } from './mockExamData';

/**
 * Official SS1 Mathematics CBT Examination Paper
 * Converted from SS1_Mathematics_Exam.pdf
 * Aligned with Nigerian NERDC & WAEC SS1 Mathematics Curriculum Standards:
 * - Number Bases & Modular Arithmetic
 * - Indices, Logarithms & Standard Form
 * - Algebraic Expressions, Factorization & Quadratic Equations
 * - Linear Equations & Simultaneous Equations
 * - Sets & Venn Diagrams
 * - Geometry (Angles, Polygons & Triangles)
 * - Trigonometric Ratios (Sine, Cosine, Tangent)
 * - Mensuration of Plane Shapes & Solid Figures
 * - Statistics (Mean, Median, Mode, Frequency Distribution)
 * - Probability
 */
export const SS1_MATHEMATICS_CBT_QUESTIONS: ExamQuestion[] = [
  // SECTION A: NUMBER BASES & MODULAR ARITHMETIC (Q1 - Q5)
  {
    id: 401,
    questionNumber: 1,
    section: 'number_bases',
    sectionTitle: 'Number Bases',
    questionText: 'Convert 11011_two to a number in base ten (denary).',
    options: {
      A: '25',
      B: '27',
      C: '29',
      D: '31'
    },
    correctAnswer: 'B',
    explanation: '11011_2 = (1 × 2^4) + (1 × 2^3) + (0 × 2^2) + (1 × 2^1) + (1 × 2^0) = 16 + 8 + 0 + 2 + 1 = 27 in base 10.'
  },
  {
    id: 402,
    questionNumber: 2,
    section: 'number_bases',
    sectionTitle: 'Number Bases',
    questionText: 'If 23_five = x_ten, calculate the value of x.',
    options: {
      A: '11',
      B: '13',
      C: '15',
      D: '17'
    },
    correctAnswer: 'B',
    explanation: '23_five in base ten is (2 × 5^1) + (3 × 5^0) = 10 + 3 = 13.'
  },
  {
    id: 403,
    questionNumber: 3,
    section: 'number_bases',
    sectionTitle: 'Number Bases',
    questionText: 'Evaluate (1011_two + 110_two) leaving your answer in base two.',
    options: {
      A: '10001_two',
      B: '10010_two',
      C: '10000_two',
      D: '10101_two'
    },
    correctAnswer: 'A',
    explanation: 'In binary: 1011_2 (11 in base 10) + 110_2 (6 in base 10) = 17 in base 10 = 10001_2.'
  },
  {
    id: 404,
    questionNumber: 4,
    section: 'modular_arithmetic',
    sectionTitle: 'Modular Arithmetic',
    questionText: 'Evaluate (38 + 27) (mod 7).',
    options: {
      A: '2',
      B: '3',
      C: '4',
      D: '5'
    },
    correctAnswer: 'A',
    explanation: '38 + 27 = 65. Dividing 65 by 7 yields 9 with remainder 2. Hence, 65 ≡ 2 (mod 7).'
  },
  {
    id: 405,
    questionNumber: 5,
    section: 'modular_arithmetic',
    sectionTitle: 'Modular Arithmetic',
    questionText: 'Find the least positive value of x such that 4x ≡ 2 (mod 6).',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '5'
    },
    correctAnswer: 'B',
    explanation: 'For x = 1: 4(1) = 4 ≢ 2 (mod 6). For x = 2: 4(2) = 8. Since 8 ÷ 6 = 1 remainder 2, 8 ≡ 2 (mod 6). Thus x = 2.'
  },

  // SECTION B: INDICES, LOGARITHMS & STANDARD FORM (Q6 - Q12)
  {
    id: 406,
    questionNumber: 6,
    section: 'indices',
    sectionTitle: 'Indices & Surds',
    questionText: 'Simplify: (81 / 16)^(-3/4).',
    options: {
      A: '8 / 27',
      B: '27 / 8',
      C: '16 / 81',
      D: '4 / 9'
    },
    correctAnswer: 'A',
    explanation: '(81/16)^(-3/4) = (16/81)^(3/4) = [(16/81)^(1/4)]^3 = (2/3)^3 = 8/27.'
  },
  {
    id: 407,
    questionNumber: 7,
    section: 'indices',
    sectionTitle: 'Indices & Equations',
    questionText: 'Solve for x in the equation: 3^(2x - 1) = 243.',
    options: {
      A: '2',
      B: '3',
      C: '4',
      D: '5'
    },
    correctAnswer: 'B',
    explanation: 'Express 243 as base 3: 243 = 3^5. Thus 3^(2x - 1) = 3^5. Equating powers: 2x - 1 = 5 => 2x = 6 => x = 3.'
  },
  {
    id: 408,
    questionNumber: 8,
    section: 'logarithms',
    sectionTitle: 'Logarithms',
    questionText: 'Given that log_10(2) = 0.3010 and log_10(3) = 0.4771, calculate log_10(12).',
    options: {
      A: '0.7781',
      B: '1.0791',
      C: '1.2552',
      D: '1.3802'
    },
    correctAnswer: 'B',
    explanation: '12 = 2^2 × 3. Therefore log_10(12) = 2 log_10(2) + log_10(3) = 2(0.3010) + 0.4771 = 0.6020 + 0.4771 = 1.0791.'
  },
  {
    id: 409,
    questionNumber: 9,
    section: 'logarithms',
    sectionTitle: 'Logarithms',
    questionText: 'Evaluate: log_2(32) - log_3(27) + log_5(1).',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '0'
    },
    correctAnswer: 'B',
    explanation: 'log_2(32) = 5 (since 2^5 = 32). log_3(27) = 3 (since 3^3 = 27). log_5(1) = 0. So 5 - 3 + 0 = 2.'
  },
  {
    id: 410,
    questionNumber: 10,
    section: 'standard_form',
    sectionTitle: 'Standard Form',
    questionText: 'Express 0.000458 in standard form (scientific notation).',
    options: {
      A: '4.58 × 10^-3',
      B: '4.58 × 10^-4',
      C: '4.58 × 10^-5',
      D: '45.8 × 10^-5'
    },
    correctAnswer: 'B',
    explanation: 'Moving the decimal point 4 places to the right gives 4.58 × 10^-4.'
  },
  {
    id: 411,
    questionNumber: 11,
    section: 'logarithms',
    sectionTitle: 'Logarithms',
    questionText: 'If log_x(64) = 3, what is the value of x?',
    options: {
      A: '2',
      B: '4',
      C: '8',
      D: '16'
    },
    correctAnswer: 'B',
    explanation: 'By logarithmic definition, log_x(64) = 3 implies x^3 = 64. Since 4^3 = 64, x = 4.'
  },
  {
    id: 412,
    questionNumber: 12,
    section: 'indices',
    sectionTitle: 'Indices & Surds',
    questionText: 'Simplify: sqrt(75) - sqrt(27) + sqrt(12).',
    options: {
      A: '4 * sqrt(3)',
      B: '5 * sqrt(3)',
      C: '3 * sqrt(3)',
      D: '6 * sqrt(3)'
    },
    correctAnswer: 'A',
    explanation: 'sqrt(75) = 5*sqrt(3); sqrt(27) = 3*sqrt(3); sqrt(12) = 2*sqrt(3). Total = (5 - 3 + 2)*sqrt(3) = 4*sqrt(3).'
  },

  // SECTION C: SETS & VENN DIAGRAMS (Q13 - Q16)
  {
    id: 413,
    questionNumber: 13,
    section: 'sets',
    sectionTitle: 'Set Theory',
    questionText: 'If Universal Set U = {x : 1 <= x <= 12, x is an integer} and Set P = {prime numbers in U}, find the number of elements in set P, n(P).',
    options: {
      A: '4',
      B: '5',
      C: '6',
      D: '7'
    },
    correctAnswer: 'B',
    explanation: 'The prime numbers between 1 and 12 are {2, 3, 5, 7, 11}. Hence, n(P) = 5.'
  },
  {
    id: 414,
    questionNumber: 14,
    section: 'sets',
    sectionTitle: 'Venn Diagrams',
    questionText: 'In a class of 40 students, 25 study Mathematics, 20 study Physics, and 8 study neither. How many students study both Mathematics and Physics?',
    options: {
      A: '10',
      B: '13',
      C: '15',
      D: '17'
    },
    correctAnswer: 'B',
    explanation: 'Total students = 40. Those studying at least one subject = 40 - 8 = 32. n(M ∪ P) = n(M) + n(P) - n(M ∩ P) => 32 = 25 + 20 - n(M ∩ P) => n(M ∩ P) = 45 - 32 = 13.'
  },
  {
    id: 415,
    questionNumber: 15,
    section: 'sets',
    sectionTitle: 'Set Theory',
    questionText: 'If Set A = {factors of 18} and Set B = {factors of 24}, find A ∩ B.',
    options: {
      A: '{1, 2, 3, 6}',
      B: '{1, 2, 3, 6, 9}',
      C: '{2, 3, 6, 12}',
      D: '{1, 2, 3}'
    },
    correctAnswer: 'A',
    explanation: 'A = {1, 2, 3, 6, 9, 18} and B = {1, 2, 3, 4, 6, 8, 12, 24}. The common elements (intersection) are {1, 2, 3, 6}.'
  },
  {
    id: 416,
    questionNumber: 16,
    section: 'sets',
    sectionTitle: 'Set Theory',
    questionText: 'If a set has 4 elements, how many subsets does it possess in total?',
    options: {
      A: '8',
      B: '12',
      C: '16',
      D: '32'
    },
    correctAnswer: 'C',
    explanation: 'The number of subsets of a set containing n elements is given by 2^n. For n = 4, 2^4 = 16 subsets.'
  },

  // SECTION D: ALGEBRA & QUADRATIC EQUATIONS (Q17 - Q25)
  {
    id: 417,
    questionNumber: 17,
    section: 'algebra',
    sectionTitle: 'Algebraic Expressions',
    questionText: 'Factorize completely: 6x^2 - 13x - 5.',
    options: {
      A: '(2x - 5)(3x + 1)',
      B: '(3x - 5)(2x + 1)',
      C: '(6x - 1)(x + 5)',
      D: '(2x + 5)(3x - 1)'
    },
    correctAnswer: 'A',
    explanation: 'Product = 6 × (-5) = -30, sum = -13. Two numbers are -15 and +2. 6x^2 - 15x + 2x - 5 = 3x(2x - 5) + 1(2x - 5) = (2x - 5)(3x + 1).'
  },
  {
    id: 418,
    questionNumber: 18,
    section: 'algebra',
    sectionTitle: 'Quadratic Equations',
    questionText: 'Find the quadratic equation whose roots are 3 and -4.',
    options: {
      A: 'x^2 + x - 12 = 0',
      B: 'x^2 - x - 12 = 0',
      C: 'x^2 + 7x + 12 = 0',
      D: 'x^2 - 7x - 12 = 0'
    },
    correctAnswer: 'A',
    explanation: 'Sum of roots = 3 + (-4) = -1. Product of roots = 3 × (-4) = -12. Formula: x^2 - (sum)x + product = 0 => x^2 - (-1)x + (-12) = x^2 + x - 12 = 0.'
  },
  {
    id: 419,
    questionNumber: 19,
    section: 'algebra',
    sectionTitle: 'Simultaneous Equations',
    questionText: 'Solve for x and y: 2x + y = 11 and 3x - 2y = 6.',
    options: {
      A: 'x = 4, y = 3',
      B: 'x = 3, y = 5',
      C: 'x = 5, y = 1',
      D: 'x = 4, y = 2'
    },
    correctAnswer: 'A',
    explanation: 'From (1): y = 11 - 2x. Substitute into (2): 3x - 2(11 - 2x) = 6 => 3x - 22 + 4x = 6 => 7x = 28 => x = 4. Then y = 11 - 2(4) = 3.'
  },
  {
    id: 420,
    questionNumber: 20,
    section: 'algebra',
    sectionTitle: 'Change of Subject of Formula',
    questionText: 'Make r the subject of the formula: V = (1/3) * pi * r^2 * h.',
    options: {
      A: 'r = sqrt((3V) / (pi * h))',
      B: 'r = (3V) / (pi * h)',
      C: 'r = sqrt((V) / (3 * pi * h))',
      D: 'r = (3V * pi) / h'
    },
    correctAnswer: 'A',
    explanation: 'Multiply both sides by 3: 3V = pi * r^2 * h. Divide by pi * h: r^2 = (3V)/(pi * h). Taking square root: r = sqrt((3V)/(pi * h)).'
  },
  {
    id: 421,
    questionNumber: 21,
    section: 'algebra',
    sectionTitle: 'Linear Inequalities',
    questionText: 'Solve the inequality: 3 - 2x <= 11.',
    options: {
      A: 'x <= -4',
      B: 'x >= -4',
      C: 'x >= 4',
      D: 'x <= 4'
    },
    correctAnswer: 'B',
    explanation: '3 - 2x <= 11 => -2x <= 11 - 3 => -2x <= 8. Dividing by -2 reverses inequality sign: x >= -4.'
  },
  {
    id: 422,
    questionNumber: 22,
    section: 'algebra',
    sectionTitle: 'Quadratic Formula',
    questionText: 'In the quadratic equation ax^2 + bx + c = 0, the discriminant is given by:',
    options: {
      A: 'b^2 + 4ac',
      B: 'b^2 - 4ac',
      C: '4ac - b^2',
      D: 'sqrt(b^2 - 4ac)'
    },
    correctAnswer: 'B',
    explanation: 'The discriminant delta = b^2 - 4ac. When delta > 0 roots are real and distinct, when delta = 0 roots are equal, and when delta < 0 roots are imaginary.'
  },
  {
    id: 423,
    questionNumber: 23,
    section: 'algebra',
    sectionTitle: 'Variation',
    questionText: 'If y varies directly as the square of x, and y = 32 when x = 4, find y when x = 3.',
    options: {
      A: '12',
      B: '18',
      C: '24',
      D: '28'
    },
    correctAnswer: 'B',
    explanation: 'y = k * x^2. 32 = k * (4^2) = 16k => k = 2. When x = 3: y = 2 * (3^2) = 2 * 9 = 18.'
  },
  {
    id: 424,
    questionNumber: 24,
    section: 'algebra',
    sectionTitle: 'Algebraic Fractions',
    questionText: 'Simplify: (x^2 - 9) / (x^2 + 5x + 6).',
    options: {
      A: '(x - 3) / (x + 2)',
      B: '(x + 3) / (x - 2)',
      C: '(x - 3) / (x + 3)',
      D: '(x + 2) / (x + 3)'
    },
    correctAnswer: 'A',
    explanation: 'Factor numerator as difference of two squares: (x - 3)(x + 3). Factor denominator: (x + 2)(x + 3). Cancelling (x + 3) yields (x - 3)/(x + 2).'
  },
  {
    id: 425,
    questionNumber: 25,
    section: 'algebra',
    sectionTitle: 'Linear Graphs',
    questionText: 'Find the gradient (slope) of the straight line joining the points P(2, 3) and Q(6, 11).',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '4'
    },
    correctAnswer: 'B',
    explanation: 'Gradient m = (y2 - y1) / (x2 - x1) = (11 - 3) / (6 - 2) = 8 / 4 = 2.'
  },

  // SECTION E: GEOMETRY & TRIGONOMETRY (Q26 - Q35)
  {
    id: 426,
    questionNumber: 26,
    section: 'geometry',
    sectionTitle: 'Angles & Polygons',
    questionText: 'Calculate the size of each interior angle of a regular octagon (8-sided polygon).',
    options: {
      A: '120 degrees',
      B: '135 degrees',
      C: '140 degrees',
      D: '144 degrees'
    },
    correctAnswer: 'B',
    explanation: 'Each exterior angle = 360 / 8 = 45 degrees. Interior angle = 180 - 45 = 135 degrees (or [(8 - 2) * 180] / 8 = 1080 / 8 = 135 degrees).'
  },
  {
    id: 427,
    questionNumber: 27,
    section: 'geometry',
    sectionTitle: 'Angles of Polygons',
    questionText: 'The sum of the interior angles of a polygon is 1260 degrees. How many sides does the polygon have?',
    options: {
      A: '7',
      B: '8',
      C: '9',
      D: '10'
    },
    correctAnswer: 'C',
    explanation: 'Sum = (n - 2) * 180 = 1260 => n - 2 = 1260 / 180 = 7 => n = 7 + 2 = 9 sides.'
  },
  {
    id: 428,
    questionNumber: 28,
    section: 'trigonometry',
    sectionTitle: 'Trigonometric Ratios',
    questionText: 'In a right-angled triangle, if sin(theta) = 3/5, find the value of tan(theta) where theta is an acute angle.',
    options: {
      A: '3/4',
      B: '4/3',
      C: '4/5',
      D: '5/4'
    },
    correctAnswer: 'A',
    explanation: 'Opposite = 3, Hypotenuse = 5. By Pythagoras theorem, Adjacent = sqrt(5^2 - 3^2) = sqrt(25 - 9) = 4. tan(theta) = Opposite / Adjacent = 3/4.'
  },
  {
    id: 429,
    questionNumber: 29,
    section: 'trigonometry',
    sectionTitle: 'Angles of Elevation & Depression',
    questionText: 'A tower 30 metres high casts a shadow 30 * sqrt(3) metres long on level ground. What is the angle of elevation of the sun?',
    options: {
      A: '30 degrees',
      B: '45 degrees',
      C: '60 degrees',
      D: '75 degrees'
    },
    correctAnswer: 'A',
    explanation: 'tan(theta) = Opposite / Adjacent = 30 / (30 * sqrt(3)) = 1 / sqrt(3). Therefore theta = 30 degrees.'
  },
  {
    id: 430,
    questionNumber: 30,
    section: 'geometry',
    sectionTitle: 'Pythagoras Theorem',
    questionText: 'A ladder 13m long leans against a vertical wall. If the foot of the ladder is 5m from the base of the wall, how high up the wall does it reach?',
    options: {
      A: '10 m',
      B: '11 m',
      C: '12 m',
      D: '12.5 m'
    },
    correctAnswer: 'C',
    explanation: 'By Pythagoras theorem: h^2 + 5^2 = 13^2 => h^2 + 25 = 169 => h^2 = 144 => h = 12 metres.'
  },
  {
    id: 431,
    questionNumber: 31,
    section: 'geometry',
    sectionTitle: 'Circle Geometry',
    questionText: 'An angle subtended by a diameter at any point on the circumference of a circle is always:',
    options: {
      A: '45 degrees',
      B: '60 degrees',
      C: '90 degrees (right angle)',
      D: '180 degrees'
    },
    correctAnswer: 'C',
    explanation: 'By circle theorem, the angle subtended by a semicircle or diameter at the circumference is a right angle (90 degrees).'
  },
  {
    id: 432,
    questionNumber: 32,
    section: 'geometry',
    sectionTitle: 'Triangles & Congruence',
    questionText: 'The angles of a triangle are in the ratio 2 : 3 : 5. What is the size of the largest angle?',
    options: {
      A: '72 degrees',
      B: '80 degrees',
      C: '90 degrees',
      D: '100 degrees'
    },
    correctAnswer: 'C',
    explanation: 'Sum of ratio parts = 2 + 3 + 5 = 10. Largest angle = (5 / 10) * 180 = 90 degrees.'
  },
  {
    id: 433,
    questionNumber: 33,
    section: 'trigonometry',
    sectionTitle: 'Special Angles',
    questionText: 'What is the exact value of cos(60 degrees)?',
    options: {
      A: '1/2',
      B: 'sqrt(3)/2',
      C: '1/sqrt(2)',
      D: '1'
    },
    correctAnswer: 'A',
    explanation: 'From the standard 30-60-90 right triangle, cos(60°) = Adjacent / Hypotenuse = 1/2.'
  },
  {
    id: 434,
    questionNumber: 34,
    section: 'geometry',
    sectionTitle: 'Parallel Lines',
    questionText: 'When two parallel lines are crossed by a transversal, alternate interior angles are:',
    options: {
      A: 'Supplementary (add up to 180°)',
      B: 'Complementary (add up to 90°)',
      C: 'Equal to each other',
      D: 'Always acute'
    },
    correctAnswer: 'C',
    explanation: 'A fundamental geometric theorem states that when parallel lines are cut by a transversal, alternate interior angles are equal (congruent).'
  },
  {
    id: 435,
    questionNumber: 35,
    section: 'geometry',
    sectionTitle: 'Bearings',
    questionText: 'The three-figure bearing of point B from point A is 065 degrees. What is the back bearing of A from B?',
    options: {
      A: '115 degrees',
      B: '245 degrees',
      C: '295 degrees',
      D: '155 degrees'
    },
    correctAnswer: 'B',
    explanation: 'Back bearing = Forward bearing + 180° (when forward bearing < 180°). Here, 065° + 180° = 245°.'
  },

  // SECTION F: MENSURATION OF PLANE & SOLID SHAPES (Q36 - Q42)
  {
    id: 436,
    questionNumber: 36,
    section: 'mensuration',
    sectionTitle: 'Circles & Sectors',
    questionText: 'Find the perimeter of a sector of a circle of radius 7cm which subtends an angle of 60 degrees at the centre (Take pi = 22/7).',
    options: {
      A: '7.33 cm',
      B: '14.67 cm',
      C: '21.33 cm',
      D: '28.00 cm'
    },
    correctAnswer: 'C',
    explanation: 'Arc length l = (theta / 360) * 2 * pi * r = (60/360) * 2 * (22/7) * 7 = (1/6) * 44 = 7.33 cm. Perimeter of sector = arc length + 2r = 7.33 + 2(7) = 21.33 cm.'
  },
  {
    id: 437,
    questionNumber: 37,
    section: 'mensuration',
    sectionTitle: 'Plane Shapes',
    questionText: 'The parallel sides of a trapezium are 8 cm and 12 cm, and its area is 60 cm^2. Calculate its perpendicular height.',
    options: {
      A: '5 cm',
      B: '6 cm',
      C: '8 cm',
      D: '10 cm'
    },
    correctAnswer: 'B',
    explanation: 'Area = 0.5 * (a + b) * h => 60 = 0.5 * (8 + 12) * h => 60 = 0.5 * 20 * h = 10h => h = 6 cm.'
  },
  {
    id: 438,
    questionNumber: 38,
    section: 'mensuration',
    sectionTitle: 'Solid Shapes',
    questionText: 'A cylinder has a base radius of 3.5 cm and a height of 10 cm. Calculate its curved surface area (Take pi = 22/7).',
    options: {
      A: '220 cm^2',
      B: '110 cm^2',
      C: '440 cm^2',
      D: '385 cm^2'
    },
    correctAnswer: 'A',
    explanation: 'Curved surface area = 2 * pi * r * h = 2 * (22/7) * 3.5 * 10 = 2 * 22 * 0.5 * 10 = 220 cm^2.'
  },
  {
    id: 439,
    questionNumber: 39,
    section: 'mensuration',
    sectionTitle: 'Solid Shapes',
    questionText: 'Calculate the total volume of a cone with base radius 6 cm and vertical height 7 cm (Take pi = 22/7).',
    options: {
      A: '264 cm^3',
      B: '528 cm^3',
      C: '792 cm^3',
      D: '132 cm^3'
    },
    correctAnswer: 'A',
    explanation: 'Volume of cone = (1/3) * pi * r^2 * h = (1/3) * (22/7) * (6^2) * 7 = (1/3) * 22 * 36 = 22 * 12 = 264 cm^3.'
  },
  {
    id: 440,
    questionNumber: 40,
    section: 'mensuration',
    sectionTitle: 'Plane Shapes',
    questionText: 'Find the area of a rhombus whose diagonals are 14 cm and 10 cm.',
    options: {
      A: '70 cm^2',
      B: '140 cm^2',
      C: '48 cm^2',
      D: '24 cm^2'
    },
    correctAnswer: 'A',
    explanation: 'Area of a rhombus = 0.5 * d1 * d2 = 0.5 * 14 * 10 = 70 cm^2.'
  },
  {
    id: 441,
    questionNumber: 41,
    section: 'mensuration',
    sectionTitle: 'Spheres',
    questionText: 'What is the surface area of a sphere of radius 7 cm? (Take pi = 22/7).',
    options: {
      A: '616 cm^2',
      B: '308 cm^2',
      C: '154 cm^2',
      D: '1232 cm^2'
    },
    correctAnswer: 'A',
    explanation: 'Surface area of sphere = 4 * pi * r^2 = 4 * (22/7) * 7 * 7 = 4 * 22 * 7 = 616 cm^2.'
  },
  {
    id: 442,
    questionNumber: 42,
    section: 'mensuration',
    sectionTitle: 'Cuboids',
    questionText: 'A rectangular tank is 5m long, 4m wide, and 3m deep. How many litres of water can it hold? (1 m^3 = 1000 litres).',
    options: {
      A: '6,000 litres',
      B: '60,000 litres',
      C: '12,000 litres',
      D: '600 litres'
    },
    correctAnswer: 'B',
    explanation: 'Volume = l * w * h = 5 * 4 * 3 = 60 m^3. Capacity in litres = 60 * 1000 = 60,000 litres.'
  },

  // SECTION G: STATISTICS & PROBABILITY (Q43 - Q50)
  {
    id: 443,
    questionNumber: 43,
    section: 'statistics',
    sectionTitle: 'Measures of Central Tendency',
    questionText: 'Find the mean of the numbers: 12, 15, 18, 22, 28.',
    options: {
      A: '18',
      B: '19',
      C: '20',
      D: '21'
    },
    correctAnswer: 'B',
    explanation: 'Sum = 12 + 15 + 18 + 22 + 28 = 95. Mean = 95 / 5 = 19.'
  },
  {
    id: 444,
    questionNumber: 44,
    section: 'statistics',
    sectionTitle: 'Median & Mode',
    questionText: 'Find the median of the following set of test scores: 7, 3, 9, 5, 8, 4, 10, 6.',
    options: {
      A: '6.0',
      B: '6.5',
      C: '7.0',
      D: '7.5'
    },
    correctAnswer: 'B',
    explanation: 'Arrange in ascending order: 3, 4, 5, 6, 7, 8, 9, 10. Since n = 8 (even), median is average of 4th and 5th terms: (6 + 7) / 2 = 6.5.'
  },
  {
    id: 445,
    questionNumber: 45,
    section: 'statistics',
    sectionTitle: 'Measures of Dispersion',
    questionText: 'Calculate the range of the numbers: 34, 18, 45, 12, 56, 29.',
    options: {
      A: '38',
      B: '44',
      C: '42',
      D: '46'
    },
    correctAnswer: 'B',
    explanation: 'Highest value = 56, lowest value = 12. Range = 56 - 12 = 44.'
  },
  {
    id: 446,
    questionNumber: 46,
    section: 'probability',
    sectionTitle: 'Probability',
    questionText: 'A fair die with faces numbered 1 to 6 is rolled once. What is the probability of obtaining a prime number?',
    options: {
      A: '1/6',
      B: '1/3',
      C: '1/2',
      D: '2/3'
    },
    correctAnswer: 'C',
    explanation: 'Total sample space = {1, 2, 3, 4, 5, 6} (6 outcomes). Prime numbers = {2, 3, 5} (3 outcomes). P(prime) = 3/6 = 1/2.'
  },
  {
    id: 447,
    questionNumber: 47,
    section: 'probability',
    sectionTitle: 'Probability',
    questionText: 'A bag contains 6 red, 4 blue, and 5 green balls. If one ball is picked at random, what is the probability that it is NOT blue?',
    options: {
      A: '4/15',
      B: '11/15',
      C: '2/3',
      D: '1/3'
    },
    correctAnswer: 'B',
    explanation: 'Total balls = 6 + 4 + 5 = 15. Balls that are NOT blue = 6 + 5 = 11. P(not blue) = 11/15.'
  },
  {
    id: 448,
    questionNumber: 48,
    section: 'probability',
    sectionTitle: 'Independent Events',
    questionText: 'Two fair coins are tossed simultaneously. What is the probability of getting at least one head?',
    options: {
      A: '1/4',
      B: '1/2',
      C: '3/4',
      D: '1'
    },
    correctAnswer: 'C',
    explanation: 'Sample space = {HH, HT, TH, TT} (4 outcomes). Outcomes with at least one head = {HH, HT, TH} (3 outcomes). Probability = 3/4.'
  },
  {
    id: 449,
    questionNumber: 49,
    section: 'statistics',
    sectionTitle: 'Frequency & Mean',
    questionText: 'The mean of five numbers x, x + 2, x + 4, x + 6, and x + 8 is 15. Find the value of x.',
    options: {
      A: '9',
      B: '11',
      C: '13',
      D: '15'
    },
    correctAnswer: 'B',
    explanation: 'Sum = 5x + 20. Mean = (5x + 20) / 5 = x + 4. Given mean = 15: x + 4 = 15 => x = 11.'
  },
  {
    id: 450,
    questionNumber: 50,
    section: 'statistics',
    sectionTitle: 'Pie Chart Interpretation',
    questionText: 'In a school survey represented on a pie chart, 120 degrees represents 60 students who prefer Mathematics. How many students participated in the survey in total?',
    options: {
      A: '120',
      B: '180',
      C: '240',
      D: '360'
    },
    correctAnswer: 'B',
    explanation: 'Total angle in a pie chart = 360°. Since 120° represents 60 students, each student corresponds to 120° / 60 = 2°. Total students = 360° / 2° = 180 students.'
  }
];
