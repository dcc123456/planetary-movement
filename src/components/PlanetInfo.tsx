import React from "react";

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

interface PlanetInfoProps {
  planet: PlanetData | null;
  onClose: () => void;
}

export const PlanetInfo: React.FC<PlanetInfoProps> = ({ planet, onClose }) => {
  if (!planet) return null;

  return (
    <div className="planet-info-overlay" onClick={onClose}>
      <div className="planet-info-panel" onClick={(e) => e.stopPropagation()}>
        <div className="planet-info-header">
          <h2>{planet.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="planet-info-content">
          <div className="planet-info-item">
            <span className="label">直径:</span>
            <span className="value">{planet.diameter.toLocaleString()} km</span>
          </div>
          <div className="planet-info-item">
            <span className="label">质量:</span>
            <span className="value">{planet.mass.toFixed(2)} × 10²³ kg</span>
          </div>
          <div className="planet-info-item">
            <span className="label">距离太阳:</span>
            <span className="value">{planet.distance.toFixed(1)} 百万 km</span>
          </div>
          <div className="planet-info-item">
            <span className="label">公转周期:</span>
            <span className="value">
              {planet.orbitPeriod.toFixed(2)} 地球日
            </span>
          </div>
          <div className="planet-info-item">
            <span className="label">自转周期:</span>
            <span className="value">
              {planet.rotationPeriod.toFixed(2)} 地球日
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
