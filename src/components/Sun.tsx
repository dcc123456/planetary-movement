import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SunProps {
  scene: THREE.Scene;
}

export const Sun: React.FC<SunProps> = ({ scene }) => {
  const sunRef = useRef<THREE.Mesh | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    // 移除旧的太阳和灯光
    if (sunRef.current) {
      scene.remove(sunRef.current);
    }
    if (lightRef.current) {
      scene.remove(lightRef.current);
    }

    // 创建太阳几何体和材质
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
      shininess: 10,
    });

    // 创建太阳网格
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // 创建太阳光
    const pointLight = new THREE.PointLight(0xffff00, 2, 10000);
    scene.add(pointLight);
    lightRef.current = pointLight;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    return () => {
      if (sunRef.current) {
        scene.remove(sunRef.current);
        sunRef.current.geometry.dispose();
        (sunRef.current.material as THREE.Material).dispose();
      }
      if (lightRef.current) {
        scene.remove(lightRef.current);
      }
    };
  }, [scene]);

  return null;
};
