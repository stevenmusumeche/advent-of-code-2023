type SeedMaps = ReturnType<typeof parseMaps>;
export function parseMaps(sections: string[]) {
  return {
    seedToSoil: parseMap(sections[1]),
    soilToFertilizer: parseMap(sections[2]),
    fertilizerToWater: parseMap(sections[3]),
    waterToLight: parseMap(sections[4]),
    lightToTemp: parseMap(sections[5]),
    tempToHumidity: parseMap(sections[6]),
    humidityToLocation: parseMap(sections[7]),
  };
}

type SeedMap = ReturnType<typeof parseMap>;
function parseMap(section: string) {
  const [_, ...seedMap] = section.split("\n").map((line) => {
    const [destRangeStart, sourceRangeStart, rangeLength] = line
      .split(" ")
      .map(Number);

    return {
      destRangeStart,
      sourceRangeStart,
      rangeLength,
    };
  });

  return { seedMap, cache: new Map<number, number>() };
}

export function toLocationNumber(seed: number, maps: SeedMaps): number {
  const soil = getMappedValue(seed, maps.seedToSoil);
  const fertilizer = getMappedValue(soil, maps.soilToFertilizer);
  const water = getMappedValue(fertilizer, maps.fertilizerToWater);
  const light = getMappedValue(water, maps.waterToLight);
  const temp = getMappedValue(light, maps.lightToTemp);
  const humidity = getMappedValue(temp, maps.tempToHumidity);
  const location = getMappedValue(humidity, maps.humidityToLocation);

  return location;
}

function getMappedValue(itemNumber: number, map: SeedMap): number {
  if (map.cache.has(itemNumber)) {
    return map.cache.get(itemNumber) as number;
  }
  const match = map.seedMap.find((item) => {
    const { sourceRangeStart, rangeLength } = item;
    return (
      itemNumber >= sourceRangeStart &&
      itemNumber < sourceRangeStart + rangeLength
    );
  });

  let answer;
  if (match) {
    answer = match.destRangeStart + (itemNumber - match.sourceRangeStart);
  } else {
    answer = itemNumber;
  }
  map.cache.set(itemNumber, answer);
  return answer;
}
