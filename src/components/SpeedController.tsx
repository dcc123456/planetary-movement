import React from "react";

interface SpeedControllerProps {
  orbitSpeed: number;
  rotationSpeed: number;
  onOrbitSpeedChange: (speed: number) => void;
  onRotationSpeedChange: (speed: number) => void;
}

export const SpeedController: React.FC<SpeedControllerProps> = ({
  orbitSpeed,
  rotationSpeed,
  onOrbitSpeedChange,
  onRotationSpeedChange,
}) => {
  return (
    <div className="speed-controller">
      <h3>速度控制</h3>
      <div className="control-item">
        <label htmlFor="orbit-speed">公转速度</label>
        <input
          type="range"
          id="orbit-speed"
          min="0"
          max="5"
          step="0.1"
          value={orbitSpeed}
          onChange={(e) => onOrbitSpeedChange(parseFloat(e.target.value))}
        />
        <span className="value">{orbitSpeed.toFixed(1)}x</span>
      </div>
      <div className="control-item">
        <label htmlFor="rotation-speed">自转速度</label>
        <input
          type="range"
          id="rotation-speed"
          min="0"
          max="5"
          step="0.1"
          value={rotationSpeed}
          onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
        />
        <span className="value">{rotationSpeed.toFixed(1)}x</span>
      </div>
    </div>
  );
};
