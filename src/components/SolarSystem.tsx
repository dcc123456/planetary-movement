import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePlanetData } from "../hooks/usePlanetData";

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

interface SolarSystemProps {
  orbitSpeed: number;
  rotationSpeed: number;
  onPlanetClick: (planet: PlanetData) => void;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({
  orbitSpeed,
  rotationSpeed,
  onPlanetClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const planetDataRef = useRef<PlanetData[]>([]);
  const orbitAngleRef = useRef<number[]>([]);
  const orbitSpeedRef = useRef<number>(orbitSpeed);
  const rotationSpeedRef = useRef<number>(rotationSpeed);

  const planets = usePlanetData();

  // 监听速度变化，更新ref
  useEffect(() => {
    orbitSpeedRef.current = orbitSpeed;
  }, [orbitSpeed]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000,
    );
    camera.position.set(0, 200, 500); // 调整相机位置，让视野更开阔
    camera.lookAt(0, 0, 0); // 让相机看向原点
    cameraRef.current = camera;

    // 初始化渲染器 - 启用WebGL2，提高渲染性能
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance", // 优先使用高性能GPU
      alpha: false, // 关闭alpha通道，提高性能
    });

    // 尝试启用WebGL2
    if (renderer.capabilities.isWebGL2) {
      console.log("Using WebGL2 renderer");
    } else {
      console.log("Using WebGL1 renderer");
    }

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比，提高性能
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 初始化轨道控制
    const controls = new OrbitControls(camera, renderer.domElement);

    // 启用所有控制功能
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 1000;

    // 显式启用所有控制选项
    controls.enablePan = true; // 启用平移
    controls.enableRotate = true; // 启用旋转
    controls.enableZoom = true; // 启用缩放

    // 设置控制灵敏度
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;
    controls.panSpeed = 0.5;

    controlsRef.current = controls;

    // 创建星星背景
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      // 减少星星数量，提高性能
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

    // 创建太阳
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
      shininess: 10,
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // 创建太阳光
    const pointLight = new THREE.PointLight(0xffff00, 2, 10000);
    scene.add(pointLight);

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // 创建行星和轨道
    planetsRef.current = [];
    planetDataRef.current = planets;
    orbitAngleRef.current = planets.map(() => Math.random() * Math.PI * 2);

    planets.forEach((planet, index) => {
      // 创建轨道
      const orbitGeometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 128;
      const orbitRadius = (planet.distance * 2) / 10; // 除以10，缩小轨道半径

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        points.push(x, 0, z);
      }

      orbitGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3),
      );

      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        linewidth: 1,
      });

      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbit);

      // 创建行星 - 大幅增大行星尺寸，确保可见
      const planetGeometry = new THREE.SphereGeometry(
        planet.radius * 10, // 增大20倍，使行星更明显
        16, // 减少细分级别，提高性能
        16, // 减少细分级别，提高性能
      );

      // 使用Wireframe材质使旋转更明显
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: planet.color,
        shininess: 30,
        specular: 0x333333,
        wireframe: true, // 使用线框模式，使旋转更明显
      });

      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

      // 初始化行星位置
      const initialAngle = orbitAngleRef.current[index];
      // 使用上面已经声明的orbitRadius变量
      planetMesh.position.x = Math.cos(initialAngle) * orbitRadius;
      planetMesh.position.z = Math.sin(initialAngle) * orbitRadius;

      scene.add(planetMesh);
      planetsRef.current.push(planetMesh);
    });

    // 鼠标移动事件，用于点击检测
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 窗口大小调整事件
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    // 点击事件，用于行星选择
    const handleClick = () => {
      if (!cameraRef.current || !sceneRef.current) return;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        planetsRef.current,
      );

      if (intersects.length > 0) {
        const index = planetsRef.current.indexOf(
          intersects[0].object as THREE.Mesh,
        );
        if (index !== -1 && planetDataRef.current[index]) {
          onPlanetClick(planetDataRef.current[index]);
        }
      }
    };

    window.addEventListener("click", handleClick);

    // 渲染循环 - 使用delta time确保动画速度一致
    let lastTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // 计算delta time
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // 转换为秒
      lastTime = currentTime;

      // 限制delta time，避免大跳跃
      const clampedDelta = Math.min(deltaTime, 0.1);

      // 更新行星位置
      planetsRef.current.forEach((planetMesh, index) => {
        if (!planetDataRef.current[index]) return;

        const planet = planetDataRef.current[index];

        // 行星公转 - 使用delta time确保动画速度一致
        orbitAngleRef.current[index] +=
          0.5 * orbitSpeedRef.current * clampedDelta * 0.6; // *60 确保60fps时速度一致
        const orbitRadius = (planet.distance * 2) / 10; // 除以10，缩小轨道半径
        planetMesh.position.x =
          Math.cos(orbitAngleRef.current[index]) * orbitRadius;
        planetMesh.position.z =
          Math.sin(orbitAngleRef.current[index]) * orbitRadius;

        // 行星自转 - 使用delta time确保动画速度一致
        planetMesh.rotation.y +=
          1.0 * rotationSpeedRef.current * clampedDelta * 60; // *60 确保60fps时速度一致
      });

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 将ref.current复制到变量中，避免在cleanup时发生变化
    const currentRenderer = rendererRef.current;
    const currentContainer = containerRef.current;
    const currentControls = controlsRef.current;

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);

      if (currentRenderer) {
        currentRenderer.dispose();
        if (currentContainer) {
          currentContainer.removeChild(currentRenderer.domElement);
        }
      }

      if (currentControls) {
        currentControls.dispose();
      }
    };
  }, [onPlanetClick, planets]); // 添加依赖项，确保组件能正确响应变化

  return (
    <div className="solar-system-container" ref={containerRef}>
      {/* 渲染器会自动将场景渲染到这个容器中 */}
    </div>
  );
};
