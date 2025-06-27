export const getCompletionRateColor = (rate: number) => {
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-blue-600';
  if (rate >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const getCompletionRateBackground = (rate: number) => {
  if (rate >= 80) return 'bg-green-100';
  if (rate >= 60) return 'bg-blue-100';
  if (rate >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const getProgressRateBackground = (rate: number) => {
  if (rate >= 80) return 'bg-green-500';
  if (rate >= 60) return 'bg-blue-500';
  if (rate >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};
