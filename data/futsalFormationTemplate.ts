import type { FormationSlot, FutsalFormationName } from "@/types/tactics";

export const futsalFormationTemplates: Record<
  FutsalFormationName,
  FormationSlot[]
> = {
  "1-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "cb", label: "CB", x: 50, y: 60 },
    { id: "st", label: "ST", x: 50, y: 25 },
  ],

  "1-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "cb", label: "CB", x: 50, y: 65 },
    { id: "lw", label: "LW", x: 30, y: 30 },
    { id: "rw", label: "RW", x: 70, y: 30 },
  ],

  "2-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 35, y: 62 },
    { id: "rcb", label: "RCB", x: 65, y: 62 },
    { id: "st", label: "ST", x: 50, y: 25 },
  ],

  "1-2-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "cb", label: "CB", x: 50, y: 68 },
    { id: "lm", label: "LM", x: 28, y: 46 },
    { id: "rm", label: "RM", x: 72, y: 46 },
    { id: "st", label: "ST", x: 50, y: 22 },
  ],

  "2-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 35, y: 65 },
    { id: "rcb", label: "RCB", x: 65, y: 65 },
    { id: "ls", label: "LS", x: 35, y: 28 },
    { id: "rs", label: "RS", x: 65, y: 28 },
  ],

  "2-2-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 35, y: 68 },
    { id: "rcb", label: "RCB", x: 65, y: 68 },
    { id: "lm", label: "LM", x: 30, y: 44 },
    { id: "rm", label: "RM", x: 70, y: 44 },
    { id: "st", label: "ST", x: 50, y: 20 },
  ],

  "2-1-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 35, y: 70 },
    { id: "rcb", label: "RCB", x: 65, y: 70 },
    { id: "cm", label: "CM", x: 50, y: 47 },
    { id: "ls", label: "LS", x: 35, y: 22 },
    { id: "rs", label: "RS", x: 65, y: 22 },
  ],

  "2-3-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 35, y: 70 },
    { id: "rcb", label: "RCB", x: 65, y: 70 },
    { id: "lm", label: "LM", x: 25, y: 46 },
    { id: "cm", label: "CM", x: 50, y: 48 },
    { id: "rm", label: "RM", x: 75, y: 46 },
    { id: "st", label: "ST", x: 50, y: 20 },
  ],

  "3-2-1": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 27, y: 70 },
    { id: "cb", label: "CB", x: 50, y: 73 },
    { id: "rcb", label: "RCB", x: 73, y: 70 },
    { id: "lm", label: "LM", x: 32, y: 44 },
    { id: "rm", label: "RM", x: 68, y: 44 },
    { id: "st", label: "ST", x: 50, y: 20 },
  ],

  "3-1-2": [
    { id: "gk", label: "GK", x: 50, y: 88 },
    { id: "lcb", label: "LCB", x: 27, y: 70 },
    { id: "cb", label: "CB", x: 50, y: 73 },
    { id: "rcb", label: "RCB", x: 73, y: 70 },
    { id: "cm", label: "CM", x: 50, y: 47 },
    { id: "ls", label: "LS", x: 35, y: 20 },
    { id: "rs", label: "RS", x: 65, y: 20 },
  ],
};
