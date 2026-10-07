export type GameMode = 'unit' | 'dimension';

export type PhysicsCategory = 'mechanics' | 'energy' | 'electromagnetism' | 'thermo' | 'waves' | 'all';

export interface BaseUnit {
  symbol: string;
  name: string;
  english: string;
  color: string;
  bgLight: string;
  dimensionSymbol: string;
  dimensionName: string;
  description: string;
  hotkey: string;
}

export interface FormulaStep {
  text: string;
  subtext?: string;
  highlight?: string;
}

export interface PhysicsQuestion {
  id: string;
  category: 'mechanics' | 'energy' | 'electromagnetism' | 'thermo' | 'waves';
  categoryLabel: string;
  title: string;
  symbol: string;
  standardUnit: string;
  formula: string;
  formulaExplanation: string;
  // SI unit answers
  unitAns: {
    num: string[]; // e.g. ['kg', 'm']
    den: string[]; // e.g. ['s', 's']
  };
  // Dimension answers
  dimensionAns: {
    num: string[]; // e.g. ['M', 'L']
    den: string[]; // e.g. ['T', 'T']
  };
  steps: FormulaStep[];
  derivationSummary: string;
  realWorldExample: string;
  hint: string;
  hintFormula: string;
}

export interface UserStats {
  score: number;
  firstTryCount: number;
  totalAnswered: number;
  incorrectList: string[]; // question ids
}
