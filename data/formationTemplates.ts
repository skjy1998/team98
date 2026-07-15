import { FormationName, FormationSlot } from "@/types/tactics";

export const formationTemplate: Record<FormationName, FormationSlot[]> = {
  "4-4-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lb", label: "LB", x: 18, y: 68 },
    { id: "lcb", label: "LCB", x: 38, y: 68 },
    { id: "rcb", label: "RCB", x: 62, y: 68 },
    { id: "rb", label: "RB", x: 82, y: 68 },

    { id: "lm", label: "LM", x: 18, y: 45 },
    { id: "lcm", label: "LCM", x: 38, y: 45 },
    { id: "rcm", label: "RCM", x: 62, y: 45 },
    { id: "rm", label: "RM", x: 82, y: 45 },

    { id: "lf", label: "LS", x: 40, y: 22 },
    { id: "rf", label: "RS", x: 60, y: 22 },
  ],
  "4-3-3": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lb", label: "LB", x: 18, y: 68 },
    { id: "lcb", label: "LCB", x: 38, y: 68 },
    { id: "rcb", label: "RCB", x: 62, y: 68 },
    { id: "rb", label: "RB", x: 82, y: 68 },
    { id: "lcm", label: "LCM", x: 32, y: 47 },
    { id: "cm", label: "CM", x: 50, y: 52 },
    { id: "rcm", label: "RCM", x: 68, y: 47 },
    { id: "lw", label: "LW", x: 24, y: 22 },
    { id: "st", label: "ST", x: 50, y: 18 },
    { id: "rw", label: "RW", x: 76, y: 22 },
  ],
  "4-2-3-1": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", x: 20, y: 78 },
    { id: "lcb", label: "LCB", x: 38, y: 81 },
    { id: "rcb", label: "RCB", x: 62, y: 81 },
    { id: "rb", label: "RB", x: 80, y: 78 },

    { id: "lcdm", label: "LCDM", x: 40, y: 63 },
    { id: "rcdm", label: "RCDM", x: 60, y: 63 },

    { id: "lam", label: "LAM", x: 24, y: 46 },
    { id: "cam", label: "CAM", x: 50, y: 42 },
    { id: "ram", label: "RAM", x: 76, y: 46 },

    { id: "st", label: "ST", x: 50, y: 24 },
  ],
  "4-1-4-1": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", x: 20, y: 78 },
    { id: "lcb", label: "LCB", x: 38, y: 81 },
    { id: "rcb", label: "RCB", x: 62, y: 81 },
    { id: "rb", label: "RB", x: 80, y: 78 },

    { id: "cdm", label: "CDM", x: 50, y: 64 },

    { id: "lm", label: "LM", x: 18, y: 48 },
    { id: "lcm", label: "LCM", x: 40, y: 52 },
    { id: "rcm", label: "RCM", x: 60, y: 52 },
    { id: "rm", label: "RM", x: 82, y: 48 },

    { id: "st", label: "ST", x: 50, y: 24 },
  ],
  "3-5-2": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lcb", label: "LCB", x: 30, y: 80 },
    { id: "cb", label: "CB", x: 50, y: 82 },
    { id: "rcb", label: "RCB", x: 70, y: 80 },

    { id: "lwb", label: "LWB", x: 15, y: 58 },
    { id: "lcm", label: "LCM", x: 38, y: 58 },
    { id: "cm", label: "CM", x: 50, y: 52 },
    { id: "rcm", label: "RCM", x: 62, y: 58 },
    { id: "rwb", label: "RWB", x: 85, y: 58 },

    { id: "ls", label: "LS", x: 40, y: 28 },
    { id: "rs", label: "RS", x: 60, y: 28 },
  ],
  "3-4-3": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lcb", label: "LCB", x: 30, y: 80 },
    { id: "cb", label: "CB", x: 50, y: 82 },
    { id: "rcb", label: "RCB", x: 70, y: 80 },

    { id: "lm", label: "LM", x: 18, y: 56 },
    { id: "lcm", label: "LCM", x: 40, y: 58 },
    { id: "rcm", label: "RCM", x: 60, y: 58 },
    { id: "rm", label: "RM", x: 82, y: 56 },

    { id: "lw", label: "LW", x: 24, y: 26 },
    { id: "st", label: "ST", x: 50, y: 22 },
    { id: "rw", label: "RW", x: 76, y: 26 },
  ],
  "4-5-1": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", x: 20, y: 78 },
    { id: "lcb", label: "LCB", x: 38, y: 81 },
    { id: "rcb", label: "RCB", x: 62, y: 81 },
    { id: "rb", label: "RB", x: 80, y: 78 },

    { id: "lm", label: "LM", x: 16, y: 52 },
    { id: "lcm", label: "LCM", x: 36, y: 56 },
    { id: "cm", label: "CM", x: 50, y: 60 },
    { id: "rcm", label: "RCM", x: 64, y: 56 },
    { id: "rm", label: "RM", x: 84, y: 52 },

    { id: "st", label: "ST", x: 50, y: 24 },
  ],

  "4-3-1-2": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", x: 20, y: 78 },
    { id: "lcb", label: "LCB", x: 38, y: 81 },
    { id: "rcb", label: "RCB", x: 62, y: 81 },
    { id: "rb", label: "RB", x: 80, y: 78 },

    { id: "lcm", label: "LCM", x: 34, y: 58 },
    { id: "cm", label: "CM", x: 50, y: 62 },
    { id: "rcm", label: "RCM", x: 66, y: 58 },

    { id: "cam", label: "CAM", x: 50, y: 42 },

    { id: "ls", label: "LS", x: 40, y: 24 },
    { id: "rs", label: "RS", x: 60, y: 24 },
  ],

  "3-4-1-2": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lcb", label: "LCB", x: 30, y: 80 },
    { id: "cb", label: "CB", x: 50, y: 82 },
    { id: "rcb", label: "RCB", x: 70, y: 80 },

    { id: "lm", label: "LM", x: 16, y: 56 },
    { id: "lcm", label: "LCM", x: 38, y: 58 },
    { id: "rcm", label: "RCM", x: 62, y: 58 },
    { id: "rm", label: "RM", x: 84, y: 56 },

    { id: "cam", label: "CAM", x: 50, y: 40 },

    { id: "ls", label: "LS", x: 40, y: 24 },
    { id: "rs", label: "RS", x: 60, y: 24 },
  ],

  "5-3-2": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lwb", label: "LWB", x: 12, y: 72 },
    { id: "lcb", label: "LCB", x: 28, y: 80 },
    { id: "cb", label: "CB", x: 50, y: 82 },
    { id: "rcb", label: "RCB", x: 72, y: 80 },
    { id: "rwb", label: "RWB", x: 88, y: 72 },

    { id: "lcm", label: "LCM", x: 36, y: 56 },
    { id: "cm", label: "CM", x: 50, y: 60 },
    { id: "rcm", label: "RCM", x: 64, y: 56 },

    { id: "ls", label: "LS", x: 40, y: 24 },
    { id: "rs", label: "RS", x: 60, y: 24 },
  ],

  "5-4-1": [
    { id: "gk", label: "GK", x: 50, y: 92 },
    { id: "lwb", label: "LWB", x: 12, y: 72 },
    { id: "lcb", label: "LCB", x: 28, y: 80 },
    { id: "cb", label: "CB", x: 50, y: 82 },
    { id: "rcb", label: "RCB", x: 72, y: 80 },
    { id: "rwb", label: "RWB", x: 88, y: 72 },

    { id: "lm", label: "LM", x: 18, y: 50 },
    { id: "lcm", label: "LCM", x: 40, y: 56 },
    { id: "rcm", label: "RCM", x: 60, y: 56 },
    { id: "rm", label: "RM", x: 82, y: 50 },

    { id: "st", label: "ST", x: 50, y: 24 },
  ],
};
