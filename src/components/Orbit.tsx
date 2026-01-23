import React, { useEffect, useRef } from "react";
import * as THREE from "three";

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

interface OrbitProps {
  scene: THREE.Scene;
  planet: PlanetData;
}

export const Orbit: React.FC<OrbitProps> = ({ scene, planet }) => {
  const orbitRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    if (orbitRef.current) {
      scene.remove(orbitRef.current);
    }

    // 创建椭圆轨道几何体
    const orbitGeometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 128;
    const radius = planet.distance * 2;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(x, 0, z);
    }

    orbitGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );

    // 创建轨道材质
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });

    // 创建轨道线
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbit);
    orbitRef.current = orbit;

    return () => {
      if (orbitRef.current) {
        scene.remove(orbitRef.current);
        orbitRef.current.geometry.dispose();
        (orbitRef.current.material as THREE.Material).dispose();
      }
    };
  }, [scene, planet]);

  return null;
};
