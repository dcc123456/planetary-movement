import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface StarsBackgroundProps {
  scene: THREE.Scene;
}

export const StarsBackground: React.FC<StarsBackgroundProps> = ({ scene }) => {
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (starsRef.current) {
      scene.remove(starsRef.current);
    }

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3),
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    return () => {
      if (starsRef.current) {
        scene.remove(starsRef.current);
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }
    };
  }, [scene]);

  return null;
};
