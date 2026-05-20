import { FormationName, FormationSlot } from "@/types/tactics";

export const formationTemplate: Record<FormationName, FormationSlot[]> = {
  "4-4-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lb", label: "DF", x: 18, y: 68 },
    { id: "lcb", label: "DF", x: 38, y: 68 },
    { id: "rcb", label: "DF", x: 62, y: 68 },
    { id: "rb", label: "DF", x: 82, y: 68 },
    { id: "lm", label: "MF", x: 18, y: 45 },
    { id: "lcm", label: "MF", x: 38, y: 45 },
    { id: "rcm", label: "MF", x: 62, y: 45 },
    { id: "rm", label: "MF", x: 82, y: 45 },
    { id: "lf", label: "FW", x: 40, y: 22 },
    { id: "rf", label: "FW", x: 60, y: 22 },
  ],
  "4-3-3": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lb", label: "DF", x: 18, y: 68 },
    { id: "lcb", label: "DF", x: 38, y: 68 },
    { id: "rcb", label: "DF", x: 62, y: 68 },
    { id: "rb", label: "DF", x: 82, y: 68 },
    { id: "lcm", label: "MF", x: 32, y: 47 },
    { id: "cm", label: "MF", x: 50, y: 52 },
    { id: "rcm", label: "MF", x: 68, y: 47 },
    { id: "lw", label: "FW", x: 24, y: 22 },
    { id: "st", label: "FW", x: 50, y: 18 },
    { id: "rw", label: "FW", x: 76, y: 22 },
  ],
};
