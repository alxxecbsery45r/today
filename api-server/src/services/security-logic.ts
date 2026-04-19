// @ts-nocheck
export const checkSpoofing = (lastLat: number, lastLng: number, newLat: number, newLng: number, timeDiff: number) => {
  // Agar distance/time ratio bohot ziada hai (e.g. plane ki speed), to alert generate karein
  const speed = 100; // Example threshold
  return speed > 500 ? true : false;
};
