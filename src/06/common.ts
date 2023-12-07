export function getNumWinningOptions(race: Race) {
  let winners = 0;
  for (let i = 1; i < race.time; i++) {
    const distance = getDistance(race.time, i);
    if (distance > race.bestDistance) {
      winners++;
    }
  }
  return winners;
}

function getDistance(raceTime: number, buttonTime: number) {
  const speed = buttonTime;
  const remainingTime = raceTime - buttonTime;
  return speed * remainingTime;
}

export type Race = {
  time: number;
  bestDistance: number;
};
