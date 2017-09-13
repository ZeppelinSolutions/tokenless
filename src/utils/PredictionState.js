export function predictionStateToStr(state) {
  if(state === 0) return 'Open';
  if(state === 1) return 'Closed';
  if(state === 2) return 'Resolved';
  if(state === 3) return 'Finished';
  return 'Unknwon';
}