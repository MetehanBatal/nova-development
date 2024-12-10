import type { Toast } from '../types';

export function updateProgress(toast: Toast, startTime: number) {
  const currentTime = Date.now();
  const elapsed = currentTime - startTime;

  const percentage = +((elapsed / toast.duration!) * 100 + 8).toFixed(2);

  const limitedPercentage = Math.min(percentage, 100);
  const roundedPercentage = Math.round(limitedPercentage * 100) / 100;

  toast.progress!.set(Number(roundedPercentage.toFixed(2)));

  if (percentage < 100) {
    requestAnimationFrame(() => updateProgress(toast, startTime));
  }
}
