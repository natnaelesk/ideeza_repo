import type { Category, Challenge, Level, Rarity, StageDef, Ticket } from "@/lib/types";

export const PROFILE = {
  name: "Selam Tesfaye",
  handle: "selam.builds",
  city: "Addis Ababa",
  campus: "Addis Ababa University",
  code: "SELAM-7K",
  path: "/join/selam-7k",
  initials: "ST",
  role: "Builders Cohort",
};

export const REFERRAL_POINTS = 50;

export const LEVELS: Level[] = [
  {
    id: "spark",
    name: "Spark",
    points: 0,
    badge: "Ignition",
    summary: "You took a seat in the Builders Cohort.",
    detail: "Orientation at the hub, a first prompt, and a name on the circle sheet.",
  },
  {
    id: "signal",
    name: "Signal",
    points: 120,
    badge: "Signal",
    summary: "The room can tell you are here.",
    detail: "Show up, speak once, and leave a trace other builders can follow.",
  },
  {
    id: "maker",
    name: "Maker",
    points: 280,
    badge: "Maker",
    summary: "A board exists because you asked for it.",
    detail: "Turn a sentence into a schematic, a bill of materials, and something you can hold.",
  },
  {
    id: "beacon",
    name: "Beacon",
    points: 480,
    badge: "Beacon",
    summary: "People start building because you did.",
    detail: "Referrals, demos, and public notes. The cohort gets brighter around you.",
  },
  {
    id: "architect",
    name: "Architect",
    points: 720,
    badge: "Architect",
    summary: "You change how the group builds.",
    detail: "Harder missions, mentor loops, and a printed piece of IDEEZA hardware.",
  },
  {
    id: "inner",
    name: "Inner Circle",
    points: 1000,
    badge: "Inner Circle",
    summary: "The studio keeps a chair for you.",
    detail: "Priority path into the internship. Gifts and access, never cash.",
  },
];

export const TICKETS: Ticket[] = [
  {
    id: "studio",
    name: "Studio Pass",
    points: 250,
    reward: "30 days of IDEEZA platform access",
    detail: "Beta tools, prompt-to-board, and the cohort workspace.",
  },
  {
    id: "credits",
    name: "Credit Stack",
    points: 500,
    reward: "500 IDEEZA design credits",
    detail: "Credits for regenerates, exports, and enclosure passes.",
  },
  {
    id: "board",
    name: "Printed Board",
    points: 800,
    reward: "A printed IDEEZA hardware board",
    detail: "One board from an approved build, made for pickup in Addis.",
  },
  {
    id: "kit",
    name: "Pioneer Kit",
    points: 1200,
    reward: "Printed board, enclosure, and a cohort notebook",
    detail: "The full gift set for Inner Circle builders. Still not cash.",
  },
];

export const STAGES: StageDef[] = [
  {
    id: "orient",
    title: "Cohort orientation",
    detail: "Sit the first circle and see a prompt become a board.",
    kind: "auto",
  },
  {
    id: "build",
    title: "Ship a hardware build",
    detail: "Get one Build card approved.",
    kind: "auto",
    auto: "build",
  },
  {
    id: "show",
    title: "Show up twice",
    detail: "Two Show up cards approved. Coffee counts.",
    kind: "auto",
    auto: "show",
  },
  {
    id: "mentor",
    title: "Mentor critique",
    detail: "Walk a mentor through your schematic and note what changed.",
    kind: "manual",
  },
  {
    id: "showcase",
    title: "Final showcase",
    detail: "Present the build to the cohort at the hub.",
    kind: "manual",
  },
  {
    id: "apply",
    title: "Studio application",
    detail: "Ask for the internship. The reward is the seat, not a payout.",
    kind: "final",
  },
];

export const CATEGORIES: { id: Category; label: string; line: string }[] = [
  { id: "refer", label: "Refer", line: "Bring a builder in with your link." },
  { id: "build", label: "Build", line: "Prompt a board, a shell, or a full device." },
  { id: "bug", label: "Bug", line: "Catch a broken trace in the beta." },
  { id: "show", label: "Show up", line: "Be in the room and leave a note." },
];

export const RARITY_META: Record<
  Rarity,
  { label: string; mark: string; holo: string; frame: string; chip: string }
> = {
  common: {
    label: "Common",
    mark: "●",
    holo: "",
    frame: "bg-[#fbfaff]",
    chip: "bg-[#efe8ff] text-[#4a3a7a]",
  },
  rare: {
    label: "Rare",
    mark: "◆",
    holo: "holo-rare",
    frame: "bg-[#f4f8ff]",
    chip: "bg-cyan-100 text-cyan-900",
  },
  epic: {
    label: "Epic",
    mark: "★",
    holo: "holo-epic",
    frame: "bg-[#f7f3ff]",
    chip: "bg-[#efe8ff] text-[#4b17c9]",
  },
  legendary: {
    label: "Legendary",
    mark: "★★",
    holo: "holo-legend",
    frame: "bg-[#fffaf0]",
    chip: "bg-amber-100 text-amber-900",
  },
};

export const RARITY_ORDER: Rarity[] = ["legendary", "epic", "rare", "common"];

export const CHALLENGES: Challenge[] = [
  {
    id: "mouse-console",
    title: "Mouse Console",
    category: "build",
    rarity: "legendary",
    points: 220,
    seed: 19,
    pitch: "A mouse that opens into a handheld, board and all.",
    brief:
      "Prompt a transforming mouse: joystick shell, small screen, and a custom board. Share the schematic set, the BOM, and one note about what the generator got wrong.",
  },
  {
    id: "inner-notes",
    title: "Inner Notes",
    category: "show",
    rarity: "legendary",
    points: 120,
    seed: 27,
    pitch: "Five notes the next builder can actually use.",
    brief:
      "Sit an Inner Circle session and publish five notes: a decision, a dead end, a prompt that worked, a person to ask, and a part to order in Addis.",
  },
  {
    id: "enclosure-drop",
    title: "Enclosure Drop",
    category: "build",
    rarity: "epic",
    points: 160,
    seed: 33,
    pitch: "A snap-fit shell for a board you already generated.",
    brief:
      "Design a printable enclosure around an existing IDEEZA board. Include the render, the wall thickness, and a sentence on how the lid closes.",
  },
  {
    id: "prompt-board",
    title: "Prompt to Board",
    category: "build",
    rarity: "epic",
    points: 150,
    seed: 41,
    pitch: "A wearable soil sensor from a single sentence.",
    brief:
      "Start from one prompt for a wearable soil sensor. Deliver the project link with a schematic, a BOM, and an enclosure render.",
  },
  {
    id: "night-market",
    title: "Night Market",
    category: "show",
    rarity: "epic",
    points: 90,
    seed: 52,
    pitch: "Demo a build on a table at the hub.",
    brief:
      "Take a build to Creators Hub night market. Share a table photo and the question people asked most.",
  },
  {
    id: "campus-beacon",
    title: "Campus Beacon",
    category: "refer",
    rarity: "rare",
    points: 100,
    seed: 63,
    pitch: "A twenty-minute intro for five students.",
    brief:
      "Host a short IDEEZA intro on campus. Share the headcount, one question you could not answer, and the referral link you left behind.",
  },
  {
    id: "lab-partner",
    title: "Lab Partner",
    category: "refer",
    rarity: "rare",
    points: 80,
    seed: 71,
    pitch: "One builder from your lab, on your link.",
    brief:
      "Invite one lab partner. Paste their note from the join page and the project they said they want to prompt first.",
  },
  {
    id: "credit-leak",
    title: "Credit Leak",
    category: "bug",
    rarity: "rare",
    points: 80,
    seed: 84,
    pitch: "A credit counter that drifts after regenerate.",
    brief:
      "Reproduce a design-credit total that changes without a matching action. Record the before, the after, and the click path.",
  },
  {
    id: "ghost-click",
    title: "Ghost Click",
    category: "bug",
    rarity: "rare",
    points: 70,
    seed: 96,
    pitch: "A control that highlights and does nothing.",
    brief:
      "Find a control on the beta canvas that looks active and never fires. Describe the screen, the control, and what you expected.",
  },
  {
    id: "dorm-antenna",
    title: "Dorm Antenna",
    category: "build",
    rarity: "common",
    points: 60,
    seed: 108,
    pitch: "A matchbox LoRa node for a dorm window.",
    brief:
      "Prompt a pocket LoRa node. Export the BOM and a top render, and name the one part you would buy locally.",
  },
  {
    id: "broken-trace",
    title: "Broken Trace",
    category: "bug",
    rarity: "common",
    points: 50,
    seed: 121,
    pitch: "A routed trace that crosses a keep-out.",
    brief:
      "Catch a generated trace that runs through a keep-out or off the board edge. Attach a crop of the layout and the prompt that made it.",
  },
  {
    id: "coffee-circuit",
    title: "Coffee Circuit",
    category: "show",
    rarity: "common",
    points: 40,
    seed: 134,
    pitch: "Check in at Ambassador Coffee.",
    brief:
      "Be at the next Ambassador Coffee. Drop a one-line recap and the name of the person you sat beside.",
  },
];

export const RIVALS = [
  { id: "mara", name: "Mara Desta", campus: "AAU", points: 980 },
  { id: "yonas", name: "Yonas Bekele", campus: "AAiT", points: 860 },
  { id: "helen", name: "Helen Tadesse", campus: "Unity", points: 710 },
  { id: "kidus", name: "Kidus Alemu", campus: "AASTU", points: 540 },
  { id: "liya", name: "Liya Worku", campus: "St. Mary", points: 310 },
  { id: "nahom", name: "Nahom Getachew", campus: "HiLCoE", points: 220 },
  { id: "sara", name: "Sara Mengistu", campus: "AAU", points: 140 },
];

export const challengeById = (id: string) => CHALLENGES.find((item) => item.id === id);
