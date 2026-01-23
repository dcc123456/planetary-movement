import { useState } from "react";
import { SolarSystem } from "./components/SolarSystem";
import { PlanetInfo } from "./components/PlanetInfo";
import { SpeedController } from "./components/SpeedController";
import "./styles.css";

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

function App() {
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(planet);
  };

  const handleClosePlanetInfo = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="app-container">
      <SolarSystem
        orbitSpeed={orbitSpeed}
        rotationSpeed={rotationSpeed}
        onPlanetClick={handlePlanetClick}
      />
      <SpeedController
        orbitSpeed={orbitSpeed}
        rotationSpeed={rotationSpeed}
        onOrbitSpeedChange={setOrbitSpeed}
        onRotationSpeedChange={setRotationSpeed}
      />
      <PlanetInfo planet={selectedPlanet} onClose={handleClosePlanetInfo} />
      {/* 帮助信息 */}
      <div className="help-info">
        <h4>Controls</h4>
        <ul>
          <li>Left Click + Drag: Rotate view</li>
          <li>Right Click + Drag: Pan view</li>
          <li>Mouse Wheel: Zoom in/out</li>
          <li>Click Planet: Show info</li>
          <li>Use sliders to adjust speeds</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
