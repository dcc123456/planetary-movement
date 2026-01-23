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

interface PlanetProps {
  scene: THREE.Scene;
  planet: PlanetData;
  orbitSpeed: number;
  rotationSpeed: number;
  onPlanetClick: (planet: PlanetData) => void;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  camera: THREE.Camera;
}

export const Planet: React.FC<PlanetProps> = ({
  scene,
  planet,
  orbitSpeed,
  rotationSpeed,
  onPlanetClick,
  raycaster,
  mouse,
  camera,
}) => {
  const planetRef = useRef<THREE.Mesh | null>(null);
  const orbitAngleRef = useRef<number>(0);

  useEffect(() => {
    if (planetRef.current) {
      scene.remove(planetRef.current);
    }

    // 设置随机轨道角度
    orbitAngleRef.current = Math.random() * Math.PI * 2;

    // 创建行星几何体和材质
    const planetGeometry = new THREE.SphereGeometry(planet.radius * 2, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: planet.color,
      shininess: 30,
      specular: 0x333333,
    });

    // 创建行星网格
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planetMesh);
    planetRef.current = planetMesh;

    // 动画循环
    const animate = () => {
      if (!planetMesh) return;

      // 行星公转
      orbitAngleRef.current += (0.01 / planet.orbitPeriod) * orbitSpeed;
      const radius = planet.distance * 2;
      planetMesh.position.x = Math.cos(orbitAngleRef.current) * radius;
      planetMesh.position.z = Math.sin(orbitAngleRef.current) * radius;

      // 行星自转
      planetMesh.rotation.y += (0.01 / planet.rotationPeriod) * rotationSpeed;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (planetRef.current) {
        scene.remove(planetRef.current);
        planetRef.current.geometry.dispose();
        (planetRef.current.material as THREE.Material).dispose();
      }
    };
  }, [scene, planet, orbitSpeed, rotationSpeed]);

  // 点击检测
  useEffect(() => {
    const handleClick = () => {
      if (!planetRef.current) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planetRef.current);

      if (intersects.length > 0) {
        onPlanetClick(planet);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [planet, raycaster, mouse, camera, onPlanetClick]);

  return null;
};
