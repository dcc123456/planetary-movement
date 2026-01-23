export interface PlanetData {
  name: string;
  diameter: number;
  distance: number;
  orbitPeriod: number;
  rotationPeriod: number;
  color: string;
  mass: number;
  radius: number;
}

export interface SolarSystemState {
  orbitSpeed: number;
  rotationSpeed: number;
  selectedPlanet: PlanetData | null;
}
