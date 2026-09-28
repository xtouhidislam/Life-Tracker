export interface ExerciseLevel {
  level: number;
  name: string;
  subtitle: string;
  targetReps: string;
  graduateWhen: string;
  primaryMuscles: string[];
  equipment: string;
  formCues: string[];
  commonMistakes: string[];
  regression: string;
  isStretchGoal?: boolean;
}

export interface MovementPattern {
  id: "push" | "pull" | "legs" | "core";
  name: string;
  focus: string;
  description: string;
  visualGuide: string;
  iconName: string;
  levels: ExerciseLevel[];
}

export interface DaySchedule {
  dayName: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  dayIndex: number; // 0 = Sunday, 1 = Monday, etc.
  focus: string;
  subtitle: string;
  durationMinutes: number;
  isRestDay?: boolean;
  patterns: ("push" | "pull" | "legs" | "core")[];
  warmupMinutes: number;
  mainSetsMinutes: number;
  finisherMinutes: number;
  cooldownMinutes: number;
  description: string;
  sampleExercises: {
    name: string;
    pattern: "push" | "pull" | "legs" | "core" | "warmup" | "cooldown";
    setsReps: string;
    notes: string;
  }[];
}

export interface CalisthenicsPhase {
  phaseNumber: 1 | 2 | 3;
  months: string;
  title: string;
  focus: string;
  whatChanges: string;
  setsPerExercise: string;
  restDuration: string;
  keyMilestones: string[];
}

export const MOVEMENT_PATTERNS: Record<string, MovementPattern> = {
  push: {
    id: "push",
    name: "Push Progression",
    focus: "Chest · Shoulders · Triceps",
    description:
      "Build your foundation from zero push-ups to diamond, pike, and decline variations without weights.",
    visualGuide: "/exercises/pushup-progression.jpg",
    iconName: "Flame",
    levels: [
      {
        level: 1,
        name: "Wall Push-up",
        subtitle: "Entry level · Reduced bodyweight resistance",
        targetReps: "3 sets × 15 reps",
        graduateWhen: "3×15 feels easy with crisp form",
        primaryMuscles: ["Pectorals (Chest)", "Anterior Deltoids", "Triceps"],
        equipment: "Any sturdy wall",
        formCues: [
          "Stand arm's length from the wall, hands shoulder-width at chest height.",
          "Keep body in a rigid plank: heels, hips, and shoulders form a straight line.",
          "Lower chest toward wall at a 45° elbow angle, pause for 1s, then press away.",
        ],
        commonMistakes: [
          "Flaring elbows straight out at 90° (harms shoulders).",
          "Bending at the hips instead of pivoting from toes.",
        ],
        regression: "Step feet closer to the wall to decrease the angle.",
      },
      {
        level: 2,
        name: "Incline Push-up",
        subtitle: "Beginner · Hands on table or sofa edge",
        targetReps: "3 sets × 12 clean reps",
        graduateWhen: "3×12 clean reps with zero hip sag",
        primaryMuscles: ["Lower Chest", "Triceps", "Core"],
        equipment: "Sturdy table, desk, or firm sofa arm",
        formCues: [
          "Grip table edge firmly, walk feet back until your body forms a 45° angle.",
          "Keep glutes squeezed and abs braced to prevent spinal sag.",
          "Touch your lower chest lightly to the edge, then push through palm heels.",
        ],
        commonMistakes: [
          "Letting the hips dip downward before chest descends.",
          "Short half-reps (chest should touch the surface).",
        ],
        regression: "Use a higher surface like a kitchen counter or windowsill.",
      },
      {
        level: 3,
        name: "Knee Push-up",
        subtitle: "Intermediate bridge · Floor pivot with ~50% bodyweight",
        targetReps: "3 sets × 12 clean reps",
        graduateWhen: "3×12 clean reps with full chest-to-floor depth",
        primaryMuscles: ["Pectorals", "Triceps", "Serratus Anterior"],
        equipment: "Yoga mat or soft floor",
        formCues: [
          "Kneel on the floor, walk hands forward until torso is straight from knees to head.",
          "Tuck pelvis forward (posterior pelvic tilt) — do not stick buttocks in air.",
          "Lower until chest hovers 1 inch off the mat, then press up to full arm extension.",
        ],
        commonMistakes: [
          "Leaving hips bent at 90° (butt sticking up), removing load from chest.",
          "Looking up (craning neck) instead of keeping gaze down.",
        ],
        regression: "Return to low incline push-ups on a sturdy chair.",
      },
      {
        level: 4,
        name: "Full Push-up",
        subtitle: "Standard landmark · True bodyweight mastery",
        targetReps: "3 sets × 10 clean reps",
        graduateWhen: "3×10 clean reps with strict locked-out top",
        primaryMuscles: ["Full Pectorals", "Front Shoulders", "Triceps", "Abs"],
        equipment: "Floor / Mat",
        formCues: [
          "Hands slightly wider than shoulder-width, fingers spread for grip stability.",
          "Lock knees, squeeze glutes, brace abs: body is a solid moving board.",
          "Descend under control for 2 seconds, hover chest over floor, explosively push up.",
        ],
        commonMistakes: [
          "Flaring elbows wide (tuck them at 45° like an arrow, not a T).",
          "Dropping head to simulate reaching the floor without chest moving.",
        ],
        regression: "Perform controlled 4-second eccentric negatives from full push-up, then push up from knees.",
      },
      {
        level: 5,
        name: "Diamond Push-up + Pike Push-up",
        subtitle: "Advanced · Targeted tricep overload & shoulder power",
        targetReps: "3 sets × 8–10 reps each",
        graduateWhen: "3×8–10 clean reps on both variations",
        primaryMuscles: ["Triceps (Diamond)", "Deltoids / Traps (Pike)", "Upper Chest"],
        equipment: "Floor / Mat",
        formCues: [
          "Diamond: Place thumbs and index fingers together under center chest, elbows tucked.",
          "Pike: Elevate hips into inverted V-shape, lower forehead forward between hands.",
          "Control the descent to protect wrists and maximize tension.",
        ],
        commonMistakes: [
          "Pike: Lowering straight down instead of angled forward like an overhead press.",
          "Diamond: Excessive wrist twisting (angle fingers out slightly if needed).",
        ],
        regression: "Incline diamond push-up on a bench or knee pike push-up.",
      },
      {
        level: 6,
        name: "Decline Push-up",
        subtitle: "Stretch Goal · Month 5–6 ultimate upper chest & shoulder builder",
        targetReps: "3 sets × 8–12 clean reps",
        graduateWhen: "Stretch goal for Month 5–6 definition",
        primaryMuscles: ["Clavicular (Upper) Pectorals", "Anterior Deltoids", "Core"],
        equipment: "Chair, bed edge, or sofa for feet",
        formCues: [
          "Place toes on chair, hands on floor underneath shoulders.",
          "Brace core extra hard to prevent lumbar hyperextension under vertical angle.",
          "Lower upper chest toward floor, press smoothly back to lockout.",
        ],
        commonMistakes: [
          "Arched lower back from weak core bracing.",
          "Bouncing out of the bottom position.",
        ],
        regression: "Standard full push-up or lower the foot elevation height.",
        isStretchGoal: true,
      },
    ],
  },

  pull: {
    id: "pull",
    name: "Pull Progression",
    focus: "Back · Latissimus · Biceps · Rear Delts",
    description:
      "Zero-equipment pulling using sturdy household tables, doorframes, and floor activation.",
    visualGuide: "/exercises/pull-progression.jpg",
    iconName: "Zap",
    levels: [
      {
        level: 1,
        name: "Doorframe / Towel Rows (Steep)",
        subtitle: "Entry level · High leverage pulling angle",
        targetReps: "3 sets × 12 clean reps",
        graduateWhen: "3×12 clean reps with full scapular retraction",
        primaryMuscles: ["Rhomboids", "Mid Traps", "Biceps", "Forearms"],
        equipment: "Sturdy doorframe or towel wrapped on door handles",
        formCues: [
          "Stand close to doorframe, grip edges with thumbs pointing up.",
          "Lean back slightly with straight arms and straight body.",
          "Pull chest toward frame by driving elbows backwards; squeeze shoulder blades 1s.",
        ],
        commonMistakes: [
          "Pulling with arm shrug rather than initiating with shoulder blades.",
          "Hips flexing forward.",
        ],
        regression: "Stand more upright to decrease resistance.",
      },
      {
        level: 2,
        name: "Table Horizontal Rows (Flatter Angle)",
        subtitle: "Intermediate · True horizontal bodyweight row",
        targetReps: "3 sets × 12 clean reps",
        graduateWhen: "3×12 clean reps with chest touching table edge",
        primaryMuscles: ["Latissimus Dorsi", "Rear Deltoids", "Biceps", "Core"],
        equipment: "Very sturdy table or desk (tested for weight)",
        formCues: [
          "Lie under a sturdy table, grip the rim with palms facing away or toward you.",
          "Keep body in straight reverse plank with heels planted on floor.",
          "Pull upper chest up to touch the underside of the table rim, pause, lower slowly.",
        ],
        commonMistakes: [
          "Using an unstable table (always test with heavy weights or sandbags on top).",
          "Sagging buttocks or hyperextending neck.",
        ],
        regression: "Bend knees 90° with feet flat on floor (bridge row) to reduce load.",
      },
      {
        level: 3,
        name: "Superman Holds + Reverse Snow Angels",
        subtitle: "Floor posterior chain activation · Posture builder",
        targetReps: "3 sets: 25s hold + 15 snow angels",
        graduateWhen: "3×15 clean snow angels with zero floor touch",
        primaryMuscles: ["Erector Spinae", "Rear Delts", "Lower Traps", "Glutes"],
        equipment: "Yoga mat / carpeted floor",
        formCues: [
          "Lie flat on stomach. Simultaneously lift chest, arms, and thighs off the ground.",
          "Squeeze shoulder blades and glutes firmly.",
          "Sweep straight arms from overhead down to touch sides of thighs, then return.",
        ],
        commonMistakes: [
          "Jerking or flapping arms rapidly instead of controlled 3-second sweeps.",
          "Craning neck backwards (keep gaze neutral at the floor).",
        ],
        regression: "Superman hold only without the arm sweep motion.",
      },
      {
        level: 4,
        name: "Dead Hang → Negative Pull-ups",
        subtitle: "Vertical pulling transition (doorframe bar recommended)",
        targetReps: "3 sets × 5 clean 5-second negatives",
        graduateWhen: "3×5 clean 5-second controlled descents",
        primaryMuscles: ["Lats", "Biceps", "Grip", "Core"],
        equipment: "Pull-up bar (doorframe) or sturdy high beam",
        formCues: [
          "Step or jump so chin is cleanly over the bar.",
          "Engage back and core, lock grip.",
          "Resist gravity on a slow, controlled 5-second descent all the way to straight arms.",
        ],
        commonMistakes: [
          "Dropping like a stone in the bottom half of the rep.",
          "Swinging legs to kick upward.",
        ],
        regression: "Table horizontal rows with feet elevated on a chair.",
      },
      {
        level: 5,
        name: "Assisted / Full Dead-Hang Pull-up",
        subtitle: "Peak bodyweight pulling achievement",
        targetReps: "1 full clean rep → build to 3×5",
        graduateWhen: "1 full clean rep from dead hang to chin over bar",
        primaryMuscles: ["Full Lats", "Biceps Brachii", "Upper Back", "Abs"],
        equipment: "Pull-up bar",
        formCues: [
          "Start from dead hang with arms fully extended and shoulders packed down.",
          "Drive elbows down toward back pockets, pull chest up toward the bar.",
          "Clear chin completely over the bar, pause briefly, lower with control.",
        ],
        commonMistakes: [
          "Kipping or bicycling legs to gain momentum.",
          "Incomplete range of motion (not locking out at bottom).",
        ],
        regression: "Toe-assisted pull-ups with one foot resting lightly on a stool.",
      },
    ],
  },

  legs: {
    id: "legs",
    name: "Legs & Glutes Progression",
    focus: "Quads · Hamstrings · Glutes · Calves",
    description:
      "Progressive single-leg loading ladder building explosive lower-body power and balance.",
    visualGuide: "/exercises/legs-progression.jpg",
    iconName: "Target",
    levels: [
      {
        level: 1,
        name: "Bodyweight Air Squat",
        subtitle: "Foundation · Hip mobility and quad mechanics",
        targetReps: "3 sets × 20 clean reps",
        graduateWhen: "3×20 clean reps with thighs parallel to ground",
        primaryMuscles: ["Quadriceps", "Gluteus Maximus", "Hamstrings"],
        equipment: "No equipment",
        formCues: [
          "Feet shoulder-width apart, toes turned 10–15° outwards.",
          "Push hips back first, then bend knees while keeping chest proud.",
          "Descend until hip crease is level with top of knees, drive up through heels.",
        ],
        commonMistakes: [
          "Knees caving inwards (actively press knees outward over toes).",
          "Heels lifting off the ground.",
        ],
        regression: "Box / chair squat (sit down to chair and stand back up).",
      },
      {
        level: 2,
        name: "Split Squat (Stationary Lunge)",
        subtitle: "Unilateral base · Isolates each leg independently",
        targetReps: "3 sets × 12 reps per leg",
        graduateWhen: "3×12 clean reps per leg without wobbling",
        primaryMuscles: ["Quads", "Glutes", "Adductors", "Calves"],
        equipment: "No equipment",
        formCues: [
          "Take a long stride: front foot flat, back foot on ball of toes.",
          "Lower back knee straight down until it gently taps or hovers 1 inch off floor.",
          "Both knees should bend to roughly 90° at bottom, torso upright.",
        ],
        commonMistakes: [
          "Front knee shooting far past toes and heel elevating.",
          "Narrow stance causing loss of balance (keep feet hip-width apart).",
        ],
        regression: "Hold onto a wall or doorframe for balance assistance.",
      },
      {
        level: 3,
        name: "Bulgarian Split Squat",
        subtitle: "Hypertrophy monster · Rear foot elevated on chair",
        targetReps: "3 sets × 10 reps per leg",
        graduateWhen: "3×10 clean reps per leg with full depth",
        primaryMuscles: ["Quads (Heavy Load)", "Gluteus Maximus", "Hip Flexors"],
        equipment: "Chair, couch, or bench",
        formCues: [
          "Place top of rear foot on chair behind you; take a generous step forward with front foot.",
          "Lower hips down and slightly back until front thigh is parallel to ground.",
          "Keep front heel pinned to floor; drive upward through midfoot and heel.",
        ],
        commonMistakes: [
          "Rear foot positioned too close to front foot, jamming knee joint.",
          "Leaning excessively forward with rounded back.",
        ],
        regression: "Standard split squat with rear foot on floor.",
      },
      {
        level: 4,
        name: "Assisted Pistol Squat",
        subtitle: "Single-leg strength landmark with balance support",
        targetReps: "3 sets × 8 reps per leg",
        graduateWhen: "3×8 reps per leg with minimal hand support",
        primaryMuscles: ["Single Leg Quads", "Glute Medius", "Core", "Ankles"],
        equipment: "Doorframe or pole for finger support",
        formCues: [
          "Stand on one leg, extend other leg straight forward in the air.",
          "Hold doorframe lightly with fingers for balance (do not pull with arms).",
          "Lower hips fully into a deep single-leg squat, then drive through heel to stand.",
        ],
        commonMistakes: [
          "Yanking with arms instead of pushing with leg muscles.",
          "Collapsing inward at the knee.",
        ],
        regression: "Sit down to a high chair on one leg, stand up using both legs.",
      },
      {
        level: 5,
        name: "Full Pistol Squat",
        subtitle: "Stretch Goal · Month 5–6 pure bodyweight mastery",
        targetReps: "3 sets × 5 reps per leg",
        graduateWhen: "Stretch goal for Month 5–6 definition",
        primaryMuscles: ["Complete Lower Body", "Ankle Dorsiflexors", "Hip Flexors"],
        equipment: "No equipment",
        formCues: [
          "Freestanding single-leg deep squat with non-working leg extended out front.",
          "Arms straight forward for counter-balance.",
          "Sink into deep hip pocket, maintain tight core, drive straight up.",
        ],
        commonMistakes: [
          "Loss of ankle mobility causing heel to lift.",
          "Rounding lower back aggressively at bottom.",
        ],
        regression: "Assisted pistol squat with one hand on a wall.",
        isStretchGoal: true,
      },
    ],
  },

  core: {
    id: "core",
    name: "Core Progression",
    focus: "Abs · Obliques · Deep Transverse Abdominis",
    description:
      "Progressive anti-extension and compression ladder from knee plank to the iconic L-sit.",
    visualGuide: "/exercises/core-progression.jpg",
    iconName: "Shield",
    levels: [
      {
        level: 1,
        name: "Knee Plank",
        subtitle: "Entry level · Lumbar protection and deep core brace",
        targetReps: "3 sets × 30 sec hold",
        graduateWhen: "3×30 sec feels easy without lower back strain",
        primaryMuscles: ["Transverse Abdominis", "Rectus Abdominis"],
        equipment: "Yoga mat or soft floor",
        formCues: [
          "Forearms on floor, elbows directly under shoulders.",
          "Knees on ground, straight line from shoulders to knees.",
          "Tuck pelvis under, pull belly button inward toward spine, breathe smoothly.",
        ],
        commonMistakes: [
          "Holding breath instead of diaphragmatic breathing.",
          "Sagging stomach toward floor.",
        ],
        regression: "Incline plank with hands on a wall or high table.",
      },
      {
        level: 2,
        name: "Full Plank + Side Plank",
        subtitle: "Full body stability · Front & lateral abdominal wall",
        targetReps: "3 sets × 45 sec front + 30s each side",
        graduateWhen: "3×45 sec front plank + 30s side planks unbroken",
        primaryMuscles: ["Rectus Abdominis", "Obliques", "Glutes", "Serratus"],
        equipment: "Floor / Mat",
        formCues: [
          "Front Plank: On forearms or palms, toes tucked, glutes squeezed rock-hard.",
          "Side Plank: Stack feet, drive bottom hip upward toward ceiling, neck neutral.",
          "Imagine pulling elbows toward toes to create intense full-body tension.",
        ],
        commonMistakes: [
          "Hips drooping below shoulder line (compresses lower back).",
          "Piking hips up into an inverted V.",
        ],
        regression: "Hold for 20-30 seconds, rest 10 seconds, repeat.",
      },
      {
        level: 3,
        name: "Hollow Body Hold",
        subtitle: "Gymnastics secret · Maximum abdominal compression",
        targetReps: "3 sets × 30 sec hold",
        graduateWhen: "3×30 sec with lower back glued to floor",
        primaryMuscles: ["Lower & Upper Abs", "Hip Flexors", "Intercostals"],
        equipment: "Floor / Mat",
        formCues: [
          "Lie flat on back. Absolutely crucial: press lower back firmly into the floor (zero gap).",
          "Lift shoulder blades off floor, extend arms overhead beside ears.",
          "Lift straight legs 6 inches off ground, toes pointed. Hold the banana shape.",
        ],
        commonMistakes: [
          "Letting the lower back arch off the floor (stop immediately if arching).",
          "Bending knees instead of keeping legs straight.",
        ],
        regression: "Tuck knees toward chest (tucked hollow body hold) until core strengthens.",
      },
      {
        level: 4,
        name: "Controlled Leg Raises",
        subtitle: "Strict lower abdominal pulling power",
        targetReps: "3 sets × 15 clean reps",
        graduateWhen: "3×15 clean controlled reps with 3s eccentric lower",
        primaryMuscles: ["Lower Rectus Abdominis", "Psoas / Hip Flexors"],
        equipment: "Floor / Mat",
        formCues: [
          "Lie on back, hands by hips or gripping floor edge for anchor.",
          "Keep legs straight, raise them to vertical 90° angle using abdominal power.",
          "Lower legs slowly over 3 seconds, stopping 2 inches before floor, then repeat.",
        ],
        commonMistakes: [
          "Swinging legs using hip momentum.",
          "Arching lower back on the negative descent.",
        ],
        regression: "Lying knee tucks / reverse crunches.",
      },
      {
        level: 5,
        name: "L-Sit Progression",
        subtitle: "Stretch Goal · Month 5–6 ultimate calisthenics skill",
        targetReps: "3 sets × 15–20 sec hold",
        graduateWhen: "Stretch goal for Month 5–6 definition",
        primaryMuscles: ["Full Rectus Abdominis", "Hip Flexors", "Triceps", "Lats"],
        equipment: "Two sturdy chairs, parallettes, or floor",
        formCues: [
          "Place hands on chair seats or floor beside hips.",
          "Push floor away violently (scapular depression) to lift body off surface.",
          "Tuck knees to chest; as strength grows, extend one or both legs straight out parallel.",
        ],
        commonMistakes: [
          "Slumping shoulders up toward ears.",
          "Bending elbows to hold body up.",
        ],
        regression: "Tucked L-sit with toes lightly touching floor for 10% assistance.",
        isStretchGoal: true,
      },
    ],
  },
};

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    dayName: "Monday",
    dayIndex: 1,
    focus: "Push (Chest, Shoulders, Triceps)",
    subtitle: "Upper Body Pressing Power",
    durationMinutes: 40,
    patterns: ["push", "core"],
    warmupMinutes: 5,
    mainSetsMinutes: 25,
    finisherMinutes: 5,
    cooldownMinutes: 5,
    description: "40-min focused push session designed to build chest, shoulder cap, and tricep volume.",
    sampleExercises: [
      { name: "Joint Rotations & Arm Circles", pattern: "warmup", setsReps: "2 min", notes: "Wrist, elbow, and shoulder warmups" },
      { name: "Jumping Jacks / High Knees", pattern: "warmup", setsReps: "20 reps × 2 sets", notes: "Heart rate elevation" },
      { name: "Push Progression (Your Current Level)", pattern: "push", setsReps: "3 sets × 10–12 reps", notes: "Primary compound pressing movement" },
      { name: "Secondary Push / Dip / Pike variation", pattern: "push", setsReps: "3 sets × 8–10 reps", notes: "Targeted shoulder & tricep focus" },
      { name: "Core Progression Finisher", pattern: "core", setsReps: "3 sets × 30–45s", notes: "Plank or hollow hold" },
      { name: "Chest & Shoulder Doorway Stretch", pattern: "cooldown", setsReps: "3 min", notes: "Deep static stretch for recovery" },
    ],
  },
  {
    dayName: "Tuesday",
    dayIndex: 2,
    focus: "Pull (Back, Biceps) + Core",
    subtitle: "V-Taper & Core Stability",
    durationMinutes: 40,
    patterns: ["pull", "core"],
    warmupMinutes: 5,
    mainSetsMinutes: 25,
    finisherMinutes: 5,
    cooldownMinutes: 5,
    description: "Table horizontal rows, doorframe pulling, and floor posterior chain activation.",
    sampleExercises: [
      { name: "Scapular Rolls & Neck Rotations", pattern: "warmup", setsReps: "2 min", notes: "Preps upper thoracic spine" },
      { name: "Jumping Jacks", pattern: "warmup", setsReps: "25 reps", notes: "Bloodflow primer" },
      { name: "Pull Progression (Your Current Level)", pattern: "pull", setsReps: "3 sets × 10–12 reps", notes: "Table rows or negative pull-ups" },
      { name: "Superman Holds + Reverse Snow Angels", pattern: "pull", setsReps: "3 sets × 15 reps", notes: "Rear delt and mid-back posture work" },
      { name: "Hollow Body / Leg Raise Core Finisher", pattern: "core", setsReps: "3 sets × 30s / 12 reps", notes: "Anti-extension abdominal hold" },
      { name: "Lat & Child's Pose Stretch", pattern: "cooldown", setsReps: "3 min", notes: "Restores back mobility" },
    ],
  },
  {
    dayName: "Wednesday",
    dayIndex: 3,
    focus: "Rest or Light Mobility / Stretching",
    subtitle: "Active Recovery & Joint Health",
    durationMinutes: 20,
    isRestDay: true,
    patterns: [],
    warmupMinutes: 3,
    mainSetsMinutes: 12,
    finisherMinutes: 0,
    cooldownMinutes: 5,
    description: "Light mobility drills, hip openers, and spine de-loading. Keeps joints supple.",
    sampleExercises: [
      { name: "Cat-Cow Spine Mobilization", pattern: "warmup", setsReps: "10 slow cycles", notes: "Flexion and extension" },
      { name: "World's Greatest Stretch", pattern: "warmup", setsReps: "5 reps per side", notes: "Opens hips, t-spine, ankles" },
      { name: "Deep Squat Hold / Asian Squat", pattern: "cooldown", setsReps: "2 min total", notes: "Ankle & hip mobility" },
      { name: "Doorframe Chest Opener", pattern: "cooldown", setsReps: "1 min each side", notes: "Relieves sitting tightness" },
    ],
  },
  {
    dayName: "Thursday",
    dayIndex: 4,
    focus: "Legs & Glutes",
    subtitle: "Unilateral Lower Body Strength",
    durationMinutes: 40,
    patterns: ["legs", "core"],
    warmupMinutes: 5,
    mainSetsMinutes: 25,
    finisherMinutes: 5,
    cooldownMinutes: 5,
    description: "Build powerful legs, glutes, and knee stability with progressive bodyweight movements.",
    sampleExercises: [
      { name: "Hip Circles & Ankle Rotations", pattern: "warmup", setsReps: "2 min", notes: "Essential knee/ankle prep" },
      { name: "Bodyweight Air Squats (Warmup speed)", pattern: "warmup", setsReps: "15 reps", notes: "Joint lubrication" },
      { name: "Legs Progression (Your Current Level)", pattern: "legs", setsReps: "3 sets × 10–12 reps/leg", notes: "Split squats or Bulgarian split squats" },
      { name: "Single-Leg Calf Raises (Wall supported)", pattern: "legs", setsReps: "3 sets × 15 reps", notes: "Lower leg strength & ankle armor" },
      { name: "Core Finisher (Side Planks)", pattern: "core", setsReps: "3 sets × 30s per side", notes: "Lateral hip & core bridge" },
      { name: "Hamstring & Quad Couch Stretch", pattern: "cooldown", setsReps: "3 min", notes: "Deep lower body release" },
    ],
  },
  {
    dayName: "Friday",
    dayIndex: 5,
    focus: "Full Body (Lighter, All Patterns)",
    subtitle: "Movement Synergy & Conditioning",
    durationMinutes: 40,
    patterns: ["push", "pull", "legs", "core"],
    warmupMinutes: 5,
    mainSetsMinutes: 25,
    finisherMinutes: 5,
    cooldownMinutes: 5,
    description: "Combines all 4 movement patterns at moderate intensity to reinforce neuromuscular coordination.",
    sampleExercises: [
      { name: "Full Body Dynamic Joint Rotations", pattern: "warmup", setsReps: "3 min", notes: "Neck, shoulder, hip, ankle" },
      { name: "Push Progression Circuit", pattern: "push", setsReps: "2 sets × 10 reps", notes: "Crisp form, controlled tempo" },
      { name: "Pull Progression Circuit", pattern: "pull", setsReps: "2 sets × 10 reps", notes: "Full range table rows" },
      { name: "Legs Progression Circuit", pattern: "legs", setsReps: "2 sets × 10 reps/side", notes: "Split squats or squats" },
      { name: "Core Finisher Circuit", pattern: "core", setsReps: "2 sets × 45s", notes: "Hollow body or plank" },
      { name: "Full Body Static Stretching", pattern: "cooldown", setsReps: "5 min", notes: "Down-regulate nervous system" },
    ],
  },
  {
    dayName: "Saturday",
    dayIndex: 6,
    focus: "Longer Session: High Volume + Skill Work",
    subtitle: "Peak Weekend Volume & Mastery",
    durationMinutes: 55,
    patterns: ["push", "pull", "legs", "core"],
    warmupMinutes: 7,
    mainSetsMinutes: 35,
    finisherMinutes: 8,
    cooldownMinutes: 5,
    description: "Highest volume session of the week. Focus on ladder progression tests and skill practice.",
    sampleExercises: [
      { name: "Extended Dynamic Warmup & Mobility", pattern: "warmup", setsReps: "7 min", notes: "Full body prep" },
      { name: "Push Ladder Test & Sets", pattern: "push", setsReps: "4 sets × max clean reps", notes: "Attempt graduation criteria" },
      { name: "Pull Ladder Test & Sets", pattern: "pull", setsReps: "4 sets × max clean reps", notes: "Focus on slow 3s eccentric" },
      { name: "Legs Ladder Focus", pattern: "legs", setsReps: "3 sets × 10 reps/leg", notes: "Bulgarian or assisted pistol" },
      { name: "Core Compression (L-Sit practice / Leg raises)", pattern: "core", setsReps: "4 sets × holds", notes: "Maximum core recruitment" },
      { name: "Comprehensive Cool-down & Reflection", pattern: "cooldown", setsReps: "5 min", notes: "Log reps and review progress" },
    ],
  },
  {
    dayName: "Sunday",
    dayIndex: 0,
    focus: "Full Rest & Recovery",
    subtitle: "Muscle Synthesis & Cellular Rebuild",
    durationMinutes: 0,
    isRestDay: true,
    patterns: [],
    warmupMinutes: 0,
    mainSetsMinutes: 0,
    finisherMinutes: 0,
    cooldownMinutes: 0,
    description: "Non-negotiable full rest. Muscle grows during recovery, not the workout itself. Eat protein, sleep deep.",
    sampleExercises: [
      { name: "Sunday Rest Mindset", pattern: "cooldown", setsReps: "All Day", notes: "Hydrate, hit protein target, take an easy walk" },
      { name: "Weekly Review & Rep Logging", pattern: "cooldown", setsReps: "10 min", notes: "Check your ladder progress for next week" },
    ],
  },
];

export const CALISTHENICS_PHASES: CalisthenicsPhase[] = [
  {
    phaseNumber: 1,
    months: "Month 1–2",
    title: "Foundation Phase",
    focus: "Learn form, build base reps, first full push-up",
    whatChanges:
      "Start every movement at Level 1–2. Sets: 3 per exercise. Priority is clean form and consistency, not intensity — this phase is about teaching your body the movement patterns.",
    setsPerExercise: "3 sets per exercise",
    restDuration: "60–90 seconds rest",
    keyMilestones: [
      "Achieve 3×15 Wall Push-ups easily",
      "Progress to Knee Push-ups or first Full Push-up",
      "Hold Full Plank for 45 seconds unbroken",
      "Perform 3×20 Bodyweight Squats with zero knee pain",
    ],
  },
  {
    phaseNumber: 2,
    months: "Month 3–4",
    title: "Growth Phase",
    focus: "Increase volume, progress up ladders, add supersets",
    whatChanges:
      "Most movements should reach Level 3–4. Sets: 3–4 per exercise, shorter rest (45–60 sec) to build muscular endurance alongside strength. This is where visible size starts building.",
    setsPerExercise: "3–4 sets per exercise",
    restDuration: "45–60 seconds rest",
    keyMilestones: [
      "Perform 3×10 clean Full Push-ups",
      "Master Table Horizontal Rows at flat angle",
      "Achieve Bulgarian Split Squats (3×10 each leg)",
      "Unbroken Hollow Body Hold for 30 seconds",
    ],
  },
  {
    phaseNumber: 3,
    months: "Month 5–6",
    title: "Definition Phase",
    focus: "Advanced variations, higher total volume, skill moves",
    whatChanges:
      "Push into Level 5 variations where ready (decline push-ups, pistol squats, L-sits). Add a 6th set of 'finisher' circuits on Fridays/Saturdays for extra volume. This phase is about maximizing visible muscle and control.",
    setsPerExercise: "4–5 sets + finisher circuits",
    restDuration: "45–60 seconds rest",
    keyMilestones: [
      "Explore Diamond & Decline Push-ups",
      "Unlock Assisted Pistol Squats",
      "Perform Tucked L-Sit off chair rims",
      "Noticeable upper chest, back width, and shoulder definition",
    ],
  },
];

export const NUTRITION_FOODS = [
  { name: "Eggs", protein: "6g per whole egg", category: "Complete Protein", icon: "Egg" },
  { name: "Chicken Breast", protein: "31g per 100g", category: "Lean Protein", icon: "Beef" },
  { name: "Fish / Tuna", protein: "25–28g per 100g", category: "Lean Protein & Omega-3", icon: "Fish" },
  { name: "Dal / Lentils", protein: "18g per cooked cup", category: "Plant Protein & Fiber", icon: "Wheat" },
  { name: "Greek Yogurt / Curd", protein: "10–15g per 100g", category: "Dairy & Probiotics", icon: "Milk" },
  { name: "Chickpeas / Chana", protein: "15g per cooked cup", category: "Plant Fuel", icon: "Sparkles" },
];

export const SAFETY_PRINCIPLES = [
  {
    title: "Soreness vs Sharp Pain",
    desc: "Muscle soreness (DOMS) for 1–2 days after a new movement is normal. Sharp pain during a movement is a warning signal — stop immediately and regress one level down.",
    badge: "Rule #1",
  },
  {
    title: "Sunday Full Rest is Mandatory",
    desc: "Muscle tissue is broken down during workouts and rebuilt during deep rest and sleep. Skipping rest leads to joint strain and stalls progress.",
    badge: "Recovery",
  },
  {
    title: "The 2-Session Graduation Rule",
    desc: "Only move to the next level once you can complete all 3 sets cleanly across 2 consecutive workout sessions. Never rush the ladder.",
    badge: "Graduation",
  },
  {
    title: "Visible Muscle Equation",
    desc: "Visible muscle = Muscle Growth (this progressive plan) + Low enough body fat to reveal it (protein + calorie balance). Both sides matter.",
    badge: "Physiology",
  },
];
