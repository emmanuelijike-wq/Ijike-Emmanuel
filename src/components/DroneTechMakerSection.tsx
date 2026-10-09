import React, { useState } from 'react';
import { 
  Cpu, Wrench, Sparkles, CheckCircle2, ChevronRight, Zap, 
  HelpCircle, ShieldCheck, BatteryCharging, Compass, Radio, 
  Lightbulb, BookOpen, AlertTriangle, ArrowRight, Play, Check,
  Layers, Award, Plus, Eye, EyeOff, RotateCw, RotateCcw,
  CheckSquare, Square
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';
import { HabitItem } from '../types';

interface DroneTechMakerSectionProps {
  onAddHabit?: (habit: Omit<HabitItem, 'id' | 'streak'>) => void;
}

// Interactive Drone Parts Inventory
interface DronePart {
  id: string;
  name: string;
  category: 'Structure' | 'Propulsion' | 'Avionics' | 'Power';
  specs: string;
  role: string;
  whereToGet: string;
  diyBudgetTip: string;
}

const DRONE_PARTS_LIST: DronePart[] = [
  {
    id: 'frame',
    name: '1× Symmetrical X-Frame Chassis (100mm - 250mm)',
    category: 'Structure',
    specs: 'Carbon Fiber, Balsa Wood, or 3D-Printed PLA/ABS',
    role: 'Rigid structural skeleton holding all 4 motors at equal 90° intervals from center of mass.',
    whereToGet: 'Hobby electronics vendor, craft supply store, or 3D printing lab',
    diyBudgetTip: 'Can be crafted using two 5mm thick balsa wood strips or popsicle craft sticks bonded with epoxy.'
  },
  {
    id: 'motors',
    name: '4× Coreless DC Motors or Brushless Motors (2 CW, 2 CCW)',
    category: 'Propulsion',
    specs: '8520 coreless (3.7V, 50,000 RPM) or 2205 Brushless (2300KV)',
    role: 'Generates high-speed rotational aerodynamic torque to spin propellers.',
    whereToGet: 'STEM robotics kit, electronics shop, or salvaged toy quadcopters',
    diyBudgetTip: 'Salvage miniature coreless DC motors from broken mini RC cars or toy quadcopters.'
  },
  {
    id: 'props',
    name: '4× Matched Aerodynamic Propellers (2 CW, 2 CCW)',
    category: 'Propulsion',
    specs: '55mm micro propellers or 5045 tri-blade propellers',
    role: 'Converts motor rotational speed into upward aerodynamic lift ($F_{lift}$) and cancels torque.',
    whereToGet: 'Drone parts vendor or STEM education kit',
    diyBudgetTip: 'Ensure you have 2 Clockwise (pusher) and 2 Counter-Clockwise (tractor) props.'
  },
  {
    id: 'fc',
    name: '1× Micro Flight Controller Board (FC)',
    category: 'Avionics',
    specs: 'F3/F4 Evo board or Arduino Nano + MPU6050 6-Axis Gyroscope',
    role: 'The "brain" of the drone. Samples angular tilt 500 times/sec and auto-adjusts motor speeds to hover.',
    whereToGet: 'Electronics component store or Arduino starter kit',
    diyBudgetTip: 'An Arduino Nano paired with an MPU6050 accelerometer costs under ₦3,500.'
  },
  {
    id: 'esc',
    name: '4× ESC Speed Controllers / MOSFET Driver Circuits',
    category: 'Avionics',
    specs: '6A - 20A ESC or SI2302 N-channel MOSFET transistors',
    role: 'Modulates electrical current to each motor thousands of times per second (PWM switching).',
    whereToGet: 'Electronics parts store or hobby kit',
    diyBudgetTip: 'For brushed coreless motors, miniature MOSFET transistors on a breadboard act as micro-ESCs.'
  },
  {
    id: 'battery',
    name: '1× High-Discharge LiPo Battery Pack (1S 3.7V or 3S 11.1V)',
    category: 'Power',
    specs: '380mAh - 500mAh (25C discharge rate) with JST/XT30 plug',
    role: 'Supplies high-amperage electrical current without heavy gravitational weight.',
    whereToGet: 'Rechargeable battery vendor or hobby store',
    diyBudgetTip: 'Salvaged small lithium polymer cells from old rechargeable electronics can be tested with a multimeter.'
  },
  {
    id: 'receiver',
    name: '1× 2.4GHz Radio Receiver & Transmitter (or Bluetooth)',
    category: 'Avionics',
    specs: '4-Channel 2.4GHz receiver (PPM/SBUS) or HC-05 Bluetooth module',
    role: 'Receives pilot commands for Throttle (height), Pitch (forward/back), Roll (left/right), and Yaw (spin).',
    whereToGet: 'STEM robotics lab or wireless module vendor',
    diyBudgetTip: 'Can use an HC-05 Bluetooth chip paired with an Android smartphone joystick app.'
  }
];

interface DroneStep {
  stepNumber: number;
  title: string;
  tagline: string;
  instructions: string[];
  safetyTip: string;
  physicsConcept: string;
}

const DRONE_BUILD_STEPS: DroneStep[] = [
  {
    stepNumber: 1,
    title: 'Construct the Symmetric X-Frame',
    tagline: 'Precision alignment of the quadcopter skeleton and center of gravity',
    instructions: [
      'Align two cross spars at exactly 90 degrees with motor mounts equidistant from the center of mass.',
      'Check that the diagonal distance between opposite motor centers is equal (e.g. exactly 100mm).',
      'The center of gravity (CG) must align directly with the central flight controller mount.'
    ],
    safetyTip: 'Ensure all spar joints are clamped and cured solidly with epoxy to avoid mid-air vibration.',
    physicsConcept: "Newton's Third Law & Center of Mass ($CG$): Balancing structural weight prevents uncontrollable pitch or roll spin."
  },
  {
    stepNumber: 2,
    title: 'Install Motor Pairings in Opposing Directions',
    tagline: 'Canceling gyroscopic reaction torque for stable straight hover',
    instructions: [
      'Mount Motor 1 (CW - Clockwise) on Front-Left corner.',
      'Mount Motor 2 (CCW - Counter-Clockwise) on Front-Right corner.',
      'Mount Motor 3 (CCW - Counter-Clockwise) on Rear-Left corner.',
      'Mount Motor 4 (CW - Clockwise) on Rear-Right corner.',
      'Attach matched CW and CCW propellers to their corresponding motor shafts.'
    ],
    safetyTip: 'Never leave propellers mounted during electrical bench testing or soldering!',
    physicsConcept: 'Conservation of Angular Momentum ($L = I\\omega$): Two pairs spinning in opposite directions produce net zero reactive yaw torque.'
  },
  {
    stepNumber: 3,
    title: 'Wire the Power Distribution & ESCs',
    tagline: 'Connecting battery energy safely to high-speed motor drivers',
    instructions: [
      'Solder battery positive (Red +) and negative (Black -) cables to the power distribution rail through a safety switch.',
      'Connect motor driver leads to the flight controller PWM signal pins (Pins D3, D5, D6, D9).',
      'Use a digital multimeter to test continuity and verify there is zero short circuit between (+) and (-).'
    ],
    safetyTip: 'Lithium polymer batteries can spark if shorted. Always double check polarity before connecting.',
    physicsConcept: "Ohm's Law ($V = IR$) & Pulse Width Modulation (PWM): Transistors pulse voltage thousands of times per second to control RPM."
  },
  {
    stepNumber: 4,
    title: 'Calibrate the Gyroscope & PID Loop',
    tagline: 'Programming the microchip stabilization reflex loop',
    instructions: [
      'Place the quadcopter frame on an absolute flat, level table.',
      'Power the flight controller and initiate sensor accelerometer calibration (zero degrees pitch and roll).',
      'Set Proportional-Integral-Derivative (PID) gains to prevent oscillation: Proportional counters tilt, Derivative dampens overshooting.'
    ],
    safetyTip: 'Keep the drone stationary for 5 seconds after power-up while gyroscope sensors calibrate.',
    physicsConcept: 'Closed-Loop Feedback Control: IMU sensor senses tilt 500 times/sec; the chip spins lower motors faster to restore equilibrium.'
  },
  {
    stepNumber: 5,
    title: 'Pre-Flight Safety Checks & Maiden Hover',
    tagline: 'Executing your first controlled lift into the air',
    instructions: [
      'Test in an open indoor room with no wind or obstacles.',
      'Stand 2 metres back. Arm the radio transmitter and slowly advance throttle to 50%.',
      'As total thrust overcomes vehicle weight ($T > W$), the drone lifts smoothly into a steady hover.'
    ],
    safetyTip: 'Always maintain at least 2 metres distance and keep eye protection handy.',
    physicsConcept: "Aerodynamic Lift ($F_{lift} = \\frac{1}{2} \\rho v^2 S C_L$): When upward lift exceeds gravitational weight, vertical climb occurs."
  }
];

export const DroneTechMakerSection: React.FC<DroneTechMakerSectionProps> = ({
  onAddHabit
}) => {
  // Suggestion & Choice: "it should not be a must. It should be a suggestion for students if they want to learn or they don't want to learn"
  const [wantsToLearn, setWantsToLearn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_wants_drone_maker');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true; // Default open as an inviting suggestion
  });

  const [activePartHighlight, setActivePartHighlight] = useState<string>('fc');
  const [showAerodynamics, setShowAerodynamics] = useState<boolean>(true);
  const [checkedParts, setCheckedParts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_drone_parts_checked');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { frame: true, motors: true, props: true };
  });

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_drone_steps_done');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 1: true };
  });

  const [habitAddedNotice, setHabitAddedNotice] = useState<string | null>(null);

  const handleToggleLearnChoice = (choice: boolean) => {
    setWantsToLearn(choice);
    try {
      localStorage.setItem('echo_plan_wants_drone_maker', JSON.stringify(choice));
    } catch {}
    playSuccessSound();
  };

  const handleTogglePart = (partId: string) => {
    setCheckedParts(prev => {
      const updated = { ...prev, [partId]: !prev[partId] };
      try {
        localStorage.setItem('echo_plan_drone_parts_checked', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    playSuccessSound();
  };

  const handleToggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const updated = { ...prev, [stepNumber]: !prev[stepNumber] };
      try {
        localStorage.setItem('echo_plan_drone_steps_done', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    playSuccessSound();
  };

  const handleAddMakerHabitToStreak = () => {
    if (onAddHabit) {
      onAddHabit({
        title: 'Maker Habit: 15-Min Drone & Tech Engineering',
        targetFrequency: 'Daily (Elective)',
        completedDays: [true, false, false, false, false, false, false],
        iconName: 'Cpu',
        category: 'creative'
      });
      setHabitAddedNotice('Added to your Habits & Strikes tracker! Keep your streak growing.');
      setTimeout(() => setHabitAddedNotice(null), 4000);
      playSuccessSound();
    } else {
      setHabitAddedNotice('Maker habit recorded for your study routine!');
      setTimeout(() => setHabitAddedNotice(null), 3000);
    }
  };

  const partsCheckedCount = Object.values(checkedParts).filter(Boolean).length;
  const stepsDoneCount = Object.values(completedSteps).filter(Boolean).length;
  const activePartObj = DRONE_PARTS_LIST.find(p => p.id === activePartHighlight) || DRONE_PARTS_LIST[0];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* =================================================================== */}
      {/* 1. OPTIONAL HABIT SUGGESTION BANNER (NOT A MUST)                    */}
      {/* =================================================================== */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#071a3d] via-[#0d2a5d] to-[#154687] text-white border-2 border-blue-400/40 shadow-xl relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 90% 10%, #62c5fa, transparent 50%), radial-gradient(circle at 10% 80%, #a5b4fc, transparent 50%)'
          }}
        />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-[#62c5fa] text-xs font-black uppercase tracking-wider border border-blue-400/30">
              <Cpu size={14} />
              <span>Optional Suggestion for Habits & Strikes</span>
            </div>

            <span className="text-[11px] font-black uppercase text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
              ⚡ Not Mandatory • Student Choice
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              “You Are Not an Ordinary Person, So You Cannot Live an Ordinary Life”
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
              This tech device workshop is an <strong>optional suggestion</strong> for your daily habit streak.
              It is <strong>not a must</strong>: you can choose if you want to learn how to build a drone, or choose to skip it.
              If you want to explore, you will see a full diagram of how a drone is built, the exact parts you get, and the steps you take.
            </p>
          </div>

          {/* Student Choice Toggles */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggleLearnChoice(true)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${
                wantsToLearn
                  ? 'bg-[#62c5fa] text-[#081a3d] border-[#62c5fa] shadow-md ring-2 ring-white/30 scale-102'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <CheckCircle2 size={16} className={wantsToLearn ? 'text-[#081a3d]' : 'text-emerald-300'} />
              <span>✓ Yes! Learn How to Build a Drone</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleLearnChoice(false)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                !wantsToLearn
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-white/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span>✕ Skip / I Don&apos;t Want to Learn This</span>
            </button>

            {wantsToLearn && (
              <button
                type="button"
                onClick={handleAddMakerHabitToStreak}
                className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus size={15} />
                <span>+ Add Maker Habit to My Streak</span>
              </button>
            )}
          </div>

          {habitAddedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>{habitAddedNotice}</span>
            </div>
          )}
        </div>
      </div>

      {/* When student chooses not to learn: graceful minimization */}
      {!wantsToLearn ? (
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3 py-10">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
            🚁
          </div>
          <h4 className="text-base font-bold text-slate-700">
            Drone Building is Currently Hidden
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This tech device module is completely optional. If you ever want to see the drone diagram, parts checklist, and assembly steps, tap the button below.
          </p>
          <button
            type="button"
            onClick={() => handleToggleLearnChoice(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-2 shadow-sm"
          >
            <Eye size={14} />
            <span>Show Drone Build Guide & Diagram</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* ================================================================= */}
          {/* 2. INTERACTIVE DIAGRAM OF HOW THEY BUILD A DRONE                   */}
          {/* ================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  <Cpu size={14} />
                  <span>Engineering Schematic</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                  Diagram of How to Build a Quadcopter Drone
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Click on any component on the drone diagram to inspect its placement, wiring, and role in aerodynamic flight.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAerodynamics(!showAerodynamics)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto border ${
                  showAerodynamics
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Zap size={14} className={showAerodynamics ? 'text-blue-600' : 'text-slate-400'} />
                <span>{showAerodynamics ? 'Hide Force Vectors' : 'Show Lift Vectors'}</span>
              </button>
            </div>

            {/* Visual Drone Schematic SVG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* SVG Diagram Canvas */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 relative flex items-center justify-center overflow-hidden min-h-[380px]">
                
                {/* Background Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #62c5fa 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <svg viewBox="0 0 500 400" className="w-full h-auto max-h-[360px] select-none">
                  <defs>
                    <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 1. X-FRAME ARMS (90° cross spars) */}
                  <g 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => setActivePartHighlight('frame')}
                  >
                    {/* Spar 1: Top-Left to Bottom-Right */}
                    <line 
                      x1="100" y1="80" x2="400" y2="320" 
                      stroke={activePartHighlight === 'frame' ? '#38bdf8' : 'url(#armGrad)'} 
                      strokeWidth={activePartHighlight === 'frame' ? "14" : "10"} 
                      strokeLinecap="round"
                    />
                    {/* Spar 2: Bottom-Left to Top-Right */}
                    <line 
                      x1="100" y1="320" x2="400" y2="80" 
                      stroke={activePartHighlight === 'frame' ? '#38bdf8' : 'url(#armGrad)'} 
                      strokeWidth={activePartHighlight === 'frame' ? "14" : "10"} 
                      strokeLinecap="round"
                    />
                  </g>

                  {/* 2. ESC MOTOR DRIVERS (Along each arm) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('esc')}
                  >
                    {/* ESC 1 (Top Left) */}
                    <rect x="150" y="125" width="22" height="14" rx="3" fill={activePartHighlight === 'esc' ? '#f59e0b' : '#334155'} stroke="#64748b" />
                    {/* ESC 2 (Top Right) */}
                    <rect x="328" y="125" width="22" height="14" rx="3" fill={activePartHighlight === 'esc' ? '#f59e0b' : '#334155'} stroke="#64748b" />
                    {/* ESC 3 (Bottom Left) */}
                    <rect x="150" y="260" width="22" height="14" rx="3" fill={activePartHighlight === 'esc' ? '#f59e0b' : '#334155'} stroke="#64748b" />
                    {/* ESC 4 (Bottom Right) */}
                    <rect x="328" y="260" width="22" height="14" rx="3" fill={activePartHighlight === 'esc' ? '#f59e0b' : '#334155'} stroke="#64748b" />
                  </g>

                  {/* 3. BATTERY PACK (Center mounted under frame) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('battery')}
                  >
                    <rect 
                      x="220" y="235" width="60" height="30" rx="5" 
                      fill={activePartHighlight === 'battery' ? '#10b981' : '#1e293b'} 
                      stroke="#10b981" 
                      strokeWidth="2" 
                    />
                    <text x="250" y="254" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">LiPo 3.7V</text>
                    {/* Power cables */}
                    <path d="M 230 235 Q 235 220 240 215" fill="none" stroke="#ef4444" strokeWidth="2" />
                    <path d="M 270 235 Q 265 220 260 215" fill="none" stroke="#000" strokeWidth="2" />
                  </g>

                  {/* 4. CENTRAL FLIGHT CONTROLLER (FC) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('fc')}
                  >
                    <rect 
                      x="215" y="165" width="70" height="70" rx="8" 
                      fill={activePartHighlight === 'fc' ? '#0284c7' : '#0f172a'} 
                      stroke={activePartHighlight === 'fc' ? '#38bdf8' : '#38bdf8'} 
                      strokeWidth="2.5" 
                      filter="url(#glow)"
                    />
                    {/* Microchip Gyro Core */}
                    <rect x="237" y="187" width="26" height="26" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="250" y="203" textAnchor="middle" fill="#62c5fa" fontSize="8" fontWeight="bold">IMU</text>
                    {/* Status LEDs */}
                    <circle cx="225" cy="175" r="3" fill="#22c55e" />
                    <circle cx="275" cy="175" r="3" fill="#ef4444" />
                    <text x="250" y="180" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">FLIGHT CONTROLLER</text>
                  </g>

                  {/* 5. 2.4GHz RADIO RECEIVER ANTENNA */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('receiver')}
                  >
                    <rect x="235" y="130" width="30" height="18" rx="3" fill={activePartHighlight === 'receiver' ? '#8b5cf6' : '#1e1e2f'} stroke="#a78bfa" />
                    <line x1="240" y1="130" x2="230" y2="105" stroke="#a78bfa" strokeWidth="2" />
                    <line x1="260" y1="130" x2="270" y2="105" stroke="#a78bfa" strokeWidth="2" />
                    <text x="250" y="142" textAnchor="middle" fill="#ddd6fe" fontSize="7" fontWeight="bold">2.4G Rx</text>
                  </g>

                  {/* 6. MOTOR 1: TOP-LEFT (CW - CLOCKWISE) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('motors')}
                  >
                    {/* Propeller Disc */}
                    <circle 
                      cx="100" cy="80" r="42" 
                      fill="rgba(56, 189, 248, 0.08)" 
                      stroke={activePartHighlight === 'props' ? '#38bdf8' : 'rgba(56, 189, 248, 0.35)'} 
                      strokeDasharray="4 3" 
                    />
                    {/* Motor Can */}
                    <circle cx="100" cy="80" r="16" fill={activePartHighlight === 'motors' ? '#38bdf8' : '#1e293b'} stroke="#62c5fa" strokeWidth="2" />
                    <circle cx="100" cy="80" r="5" fill="#f8fafc" />
                    {/* Propeller Blades */}
                    <ellipse cx="100" cy="80" rx="36" ry="6" fill="#62c5fa" opacity="0.75" transform="rotate(35 100 80)" />
                    {/* Rotation indicator: CW */}
                    <text x="100" y="45" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="extrabold">M1 (CW ↻)</text>
                    {showAerodynamics && (
                      <path d="M 80 65 A 25 25 0 0 1 120 65" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                    )}
                  </g>

                  {/* 7. MOTOR 2: TOP-RIGHT (CCW - COUNTER CLOCKWISE) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('motors')}
                  >
                    <circle 
                      cx="400" cy="80" r="42" 
                      fill="rgba(244, 63, 94, 0.08)" 
                      stroke={activePartHighlight === 'props' ? '#f43f5e' : 'rgba(244, 63, 94, 0.35)'} 
                      strokeDasharray="4 3" 
                    />
                    <circle cx="400" cy="80" r="16" fill={activePartHighlight === 'motors' ? '#f43f5e' : '#1e293b'} stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="400" cy="80" r="5" fill="#f8fafc" />
                    <ellipse cx="400" cy="80" rx="36" ry="6" fill="#f43f5e" opacity="0.75" transform="rotate(-35 400 80)" />
                    <text x="400" y="45" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="extrabold">M2 (CCW ↺)</text>
                  </g>

                  {/* 8. MOTOR 3: BOTTOM-LEFT (CCW - COUNTER CLOCKWISE) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('motors')}
                  >
                    <circle 
                      cx="100" cy="320" r="42" 
                      fill="rgba(244, 63, 94, 0.08)" 
                      stroke={activePartHighlight === 'props' ? '#f43f5e' : 'rgba(244, 63, 94, 0.35)'} 
                      strokeDasharray="4 3" 
                    />
                    <circle cx="100" cy="320" r="16" fill={activePartHighlight === 'motors' ? '#f43f5e' : '#1e293b'} stroke="#f43f5e" strokeWidth="2" />
                    <circle cx="100" cy="320" r="5" fill="#f8fafc" />
                    <ellipse cx="100" cy="320" rx="36" ry="6" fill="#f43f5e" opacity="0.75" transform="rotate(-35 100 320)" />
                    <text x="100" y="375" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="extrabold">M3 (CCW ↺)</text>
                  </g>

                  {/* 9. MOTOR 4: BOTTOM-RIGHT (CW - CLOCKWISE) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setActivePartHighlight('motors')}
                  >
                    <circle 
                      cx="400" cy="320" r="42" 
                      fill="rgba(56, 189, 248, 0.08)" 
                      stroke={activePartHighlight === 'props' ? '#38bdf8' : 'rgba(56, 189, 248, 0.35)'} 
                      strokeDasharray="4 3" 
                    />
                    <circle cx="400" cy="320" r="16" fill={activePartHighlight === 'motors' ? '#38bdf8' : '#1e293b'} stroke="#62c5fa" strokeWidth="2" />
                    <circle cx="400" cy="320" r="5" fill="#f8fafc" />
                    <ellipse cx="400" cy="320" rx="36" ry="6" fill="#62c5fa" opacity="0.75" transform="rotate(35 400 320)" />
                    <text x="400" y="375" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="extrabold">M4 (CW ↻)</text>
                  </g>

                  {/* Aerodynamics Lift Vector Markers */}
                  {showAerodynamics && (
                    <g>
                      <path d="M 250 160 L 250 100" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrow)" />
                      <text x="258" y="115" fill="#4ade80" fontSize="10" fontWeight="bold">Lift ($F_L$)</text>
                      <path d="M 250 270 L 250 310" stroke="#f87171" strokeWidth="2.5" />
                      <text x="258" y="305" fill="#f87171" fontSize="10" fontWeight="bold">Weight ($W$)</text>
                    </g>
                  )}
                </svg>

                {/* Floating Quick Part Selector Pills */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 justify-center">
                  {[
                    { id: 'fc', label: 'Flight Controller' },
                    { id: 'motors', label: '4x Motors (CW/CCW)' },
                    { id: 'props', label: 'Propellers' },
                    { id: 'frame', label: 'X-Frame' },
                    { id: 'battery', label: 'LiPo Battery' },
                    { id: 'esc', label: 'ESCs' },
                    { id: 'receiver', label: 'Radio Rx' }
                  ].map(part => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setActivePartHighlight(part.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        activePartHighlight === part.id
                          ? 'bg-[#62c5fa] text-[#081a3d] shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Card for Selected Part in Diagram */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                    Selected in Diagram • {activePartObj.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Component Details
                  </span>
                </div>

                <h5 className="text-base font-black text-[#081a3d]">
                  {activePartObj.name}
                </h5>

                <div className="space-y-2 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-800">What It Does:</strong> {activePartObj.role}
                  </p>
                  <p>
                    <strong className="text-slate-800">Key Specification:</strong> {activePartObj.specs}
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px]">
                    <strong>💡 Low-Cost Nigerian DIY Alternative:</strong> {activePartObj.diyBudgetTip}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTogglePart(activePartObj.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {checkedParts[activePartObj.id] ? (
                      <>
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>I have acquired this part</span>
                      </>
                    ) : (
                      <>
                        <Square size={15} className="text-slate-400" />
                        <span>Mark as acquired</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Part {DRONE_PARTS_LIST.findIndex(p => p.id === activePartHighlight) + 1} of {DRONE_PARTS_LIST.length}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ================================================================= */}
          {/* 3. THE PARTS YOU GET (CHECKLIST)                                  */}
          {/* ================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-700 tracking-wider mb-1">
                  <Wrench size={14} />
                  <span>Hardware & Electronics Inventory</span>
                </div>
                <h4 className="text-xl font-black text-[#081a3d]">
                  The Parts You Get (Parts Checklist)
                </h4>
                <p className="text-xs text-slate-600">
                  Review the exact parts required to build your quadcopter drone. Check off the parts you get:
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black self-start sm:self-auto">
                {partsCheckedCount} of {DRONE_PARTS_LIST.length} Parts Acquired
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {DRONE_PARTS_LIST.map((part) => {
                const isAcquired = Boolean(checkedParts[part.id]);
                return (
                  <div
                    key={part.id}
                    onClick={() => handleTogglePart(part.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isAcquired
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isAcquired ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}>
                      {isAcquired && <Check size={13} />}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-black ${isAcquired ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                          {part.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold shrink-0 ml-1">
                          {part.category}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600">
                        {part.role}
                      </p>
                      <div className="text-[10.5px] text-slate-500 font-medium">
                        📍 <em>Where to find:</em> {part.whereToGet}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 4. THE STEPS YOU TAKE (STEP-BY-STEP ASSEMBLY)                     */}
          {/* ================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 tracking-wider mb-1">
                  <Layers size={14} />
                  <span>Assembly & Flight Milestones</span>
                </div>
                <h4 className="text-xl font-black text-[#081a3d]">
                  The Steps You Take (Build Workflow)
                </h4>
                <p className="text-xs text-slate-600">
                  Follow these 5 engineering steps to assemble, solder, calibrate, and successfully fly your drone:
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-black self-start sm:self-auto">
                {stepsDoneCount} of {DRONE_BUILD_STEPS.length} Steps Completed
              </div>
            </div>

            <div className="space-y-3.5">
              {DRONE_BUILD_STEPS.map((st) => {
                const isStepDone = Boolean(completedSteps[st.stepNumber]);
                return (
                  <div
                    key={st.stepNumber}
                    className={`p-5 rounded-2xl border transition-all ${
                      isStepDone
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStep(st.stepNumber)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                            isStepDone 
                              ? 'bg-emerald-600 text-white' 
                              : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                          }`}
                          title={isStepDone ? 'Mark step incomplete' : 'Mark step completed'}
                        >
                          {isStepDone ? <Check size={16} /> : <span className="text-xs font-bold text-slate-400">{st.stepNumber}</span>}
                        </button>

                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                              Step {st.stepNumber} of 5
                            </span>
                            <h5 className={`font-black text-base ${isStepDone ? 'text-emerald-950 line-through' : 'text-[#081a3d]'}`}>
                              {st.title}
                            </h5>
                            <p className="text-xs text-slate-500 font-medium">
                              {st.tagline}
                            </p>
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                            {st.instructions.map((inst, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {inst}
                              </li>
                            ))}
                          </ul>

                          {st.safetyTip && (
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                              <span>Safety Rule: {st.safetyTip}</span>
                            </div>
                          )}

                          <div className="text-[11px] font-medium text-blue-900 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 flex items-start gap-1.5">
                            <Zap size={13} className="text-blue-600 shrink-0 mt-0.5" />
                            <span><strong>Physics Law:</strong> {st.physicsConcept}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-black text-slate-300 shrink-0">
                        Phase 0{st.stepNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
