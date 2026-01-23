interface PlanetData {
  name: string;
  diameter: number;
  distance: number;
  orbitPeriod: number;
  rotationPeriod: number;
  color: string;
  mass: number;
  radius: number;
}

export const usePlanetData = (): PlanetData[] => {
  return [
    {
      name: "水星",
      diameter: 4879,
      distance: 57.9,
      orbitPeriod: 87.97,
      rotationPeriod: 58.65,
      color: "#8C7853",
      mass: 3.3011,
      radius: 0.38,
    },
    {
      name: "金星",
      diameter: 12104,
      distance: 108.2,
      orbitPeriod: 224.7,
      rotationPeriod: 243.02,
      color: "#FFC649",
      mass: 4.8675,
      radius: 0.95,
    },
    {
      name: "地球",
      diameter: 12742,
      distance: 149.6,
      orbitPeriod: 365.26,
      rotationPeriod: 0.99,
      color: "#4B9CD3",
      mass: 5.9724,
      radius: 1.0,
    },
    {
      name: "火星",
      diameter: 6779,
      distance: 227.9,
      orbitPeriod: 686.98,
      rotationPeriod: 1.03,
      color: "#CD5C5C",
      mass: 0.64171,
      radius: 0.53,
    },
    {
      name: "木星",
      diameter: 139820,
      distance: 778.5,
      orbitPeriod: 4332.59,
      rotationPeriod: 0.41,
      color: "#D9C4A1",
      mass: 1898.19,
      radius: 11.21,
    },
    {
      name: "土星",
      diameter: 116460,
      distance: 1434,
      orbitPeriod: 10759.22,
      rotationPeriod: 0.44,
      color: "#FAD5A5",
      mass: 568.34,
      radius: 9.45,
    },
    {
      name: "天王星",
      diameter: 50724,
      distance: 2871,
      orbitPeriod: 30688.5,
      rotationPeriod: 0.72,
      color: "#4FD0E7",
      mass: 86.813,
      radius: 4.01,
    },
    {
      name: "海王星",
      diameter: 49244,
      distance: 4495,
      orbitPeriod: 60195,
      rotationPeriod: 0.67,
      color: "#4169E1",
      mass: 102.413,
      radius: 3.88,
    },
  ];
};
