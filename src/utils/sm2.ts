export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

// 0: Complete blackout
// 1: Incorrect response; the correct one remembered
// 2: Incorrect response; where the correct one seemed easy to recall
// 3: Correct response recalled with serious difficulty
// 4: Correct response after a hesitation
// 5: Perfect response

export interface SM2Data {
  interval: number;
  repetition: number;
  efactor: number;
}

export function calculateSM2(quality: Quality, data: SM2Data): SM2Data {
  let { interval, repetition, efactor } = data;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < 1.3) {
    efactor = 1.3;
  }

  return { interval, repetition, efactor };
}

export function getNextReviewDate(interval: number): string {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date.toISOString();
}
