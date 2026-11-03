import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const GlassFingerprint3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Main 3D Group containing the sculpture
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // -------------------------------------------------------------
    // 1. LIGHTING (Forensic Luxury Mood: Wine, Champagne & Rose)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xd8b4ad, 0.8);
    scene.add(ambientLight);

    // Key Light - Deep Wine / Burgundy Glow
    const keyLight = new THREE.DirectionalLight(0x681b28, 4.0);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    // Rim Light - Translucent Champagne Edge Highlight
    const rimLight = new THREE.DirectionalLight(0xf8f0e9, 3.5);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    // Center Core Light (Breathing point light inside fingerprint whorl)
    const coreLight = new THREE.PointLight(0xd8b4ad, 2.5, 12);
    coreLight.position.set(0, 0, 1);
    mainGroup.add(coreLight);

    // -------------------------------------------------------------
    // 2. LUXURY TRANSLUCENT GLASS MATERIAL
    // -------------------------------------------------------------
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd8b4ad),
      emissive: new THREE.Color(0x4a1028),
      emissiveIntensity: 0.15,
      roughness: 0.12,
      metalness: 0.08,
      transmission: 0.88, // Realistic glass refraction
      ior: 1.54, // Glass index of refraction
      thickness: 1.6,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xf8f0e9),
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    const innerCoreGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x681b28),
      emissive: new THREE.Color(0x380b1e),
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.48,
      thickness: 2.0,
      transparent: true,
      opacity: 0.9,
    });

    // -------------------------------------------------------------
    // 3. FINGERPRINT RIDGE SCULPTURE GEOMETRIES
    // -------------------------------------------------------------
    // Generate concentric fingerprint whorl arches in 3D
    const fingerprintGroup = new THREE.Group();
    mainGroup.add(fingerprintGroup);

    const numRidges = 19;
    for (let i = 1; i <= numRidges; i++) {
      const radiusX = 0.22 * i;
      const radiusY = 0.32 * i;
      const points: THREE.Vector3[] = [];
      const numPoints = 80;

      // Create natural asymmetric fingerprint loop shape
      const startAngle = i > 4 ? -Math.PI * 0.9 : -Math.PI;
      const endAngle = i > 4 ? Math.PI * 0.9 : Math.PI;
      const step = (endAngle - startAngle) / numPoints;

      for (let j = 0; j <= numPoints; j++) {
        const theta = startAngle + j * step;
        
        // Procedural natural ridge curvature
        const wavePerturbation = Math.sin(theta * 3 + i * 0.6) * (0.04 + i * 0.003);
        const yPerturbation = Math.cos(theta * 2 + i * 0.4) * 0.05;
        
        const x = (radiusX + wavePerturbation) * Math.sin(theta);
        // Slight bottom loop tapering typical of human dermal papillary ridges
        const taper = 1.0 + (theta > 0 ? 0.08 * Math.sin(theta) : -0.05 * Math.sin(theta));
        const y = (radiusY * taper + yPerturbation) * Math.cos(theta) - 0.2;
        
        // 3D curvature: curved dome shape
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const z = Math.cos(Math.min(Math.PI * 0.45, distanceFromCenter * 0.55)) * 0.6 - (i * 0.015);

        points.push(new THREE.Vector3(x, y, z));
      }

      if (points.length > 2) {
        const curve = new THREE.CatmullRomCurve3(points);
        // Vary tube thickness: finer at edges, more prominent in core
        const tubeRadius = Math.max(0.016, 0.038 - i * 0.001);
        const tubeGeo = new THREE.TubeGeometry(curve, 72, tubeRadius, 10, false);
        const ridgeMesh = new THREE.Mesh(tubeGeo, i <= 6 ? innerCoreGlass : glassMaterial);
        fingerprintGroup.add(ridgeMesh);
      }
    }

    // -------------------------------------------------------------
    // 4. FLOATING ORBITAL GLOW RINGS (Forensic Scanner Armatures)
    // -------------------------------------------------------------
    const ringsGroup = new THREE.Group();
    mainGroup.add(ringsGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xd8b4ad,
      emissive: 0x681b28,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5,
    });

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xf8f0e9,
      emissive: 0x4a1028,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.4,
    });

    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.018, 16, 120);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.8;
    ring1.rotation.y = 0.35;
    ringsGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(4.2, 0.014, 16, 120);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = -0.4;
    ringsGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(4.8, 0.01, 16, 120);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
    ring3.rotation.x = Math.PI / 4;
    ring3.rotation.z = Math.PI / 5;
    ringsGroup.add(ring3);

    // -------------------------------------------------------------
    // 5. FLOATING FORENSIC PARTICLES (Champagne, Dusty Rose & Wine)
    // -------------------------------------------------------------
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const pColor1 = new THREE.Color(0xf8f0e9); // Champagne
    const pColor2 = new THREE.Color(0xd8b4ad); // Dusty Rose
    const pColor3 = new THREE.Color(0x681b28); // Deep Wine

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spherical distribution around center
      const r = 2.2 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[idx] = r * Math.cos(phi) * Math.sin(theta);
      particlePositions[idx + 1] = r * Math.sin(phi);
      particlePositions[idx + 2] = r * Math.cos(phi) * Math.cos(theta);

      // Color selection
      const col = Math.random() < 0.4 ? pColor1 : Math.random() < 0.7 ? pColor2 : pColor3;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(216,180,173,0.8)');
      grad.addColorStop(1, 'rgba(74,16,40,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // -------------------------------------------------------------
    // 6. MOUSE PARALLAX INTERACTION & ANIMATION LOOP
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Do not render if tab is hidden
      if (document.hidden) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax lerp
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.35;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.04;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.04;

      // Gentle autonomous floating rotation and vertical oscillation
      fingerprintGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.22;
      fingerprintGroup.rotation.z = Math.cos(elapsedTime * 0.3) * 0.08;
      mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.18;

      // Independent orbital rings counter-rotations
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.0025;
      ring3.rotation.x += 0.002;

      // Particle subtle field swirl
      particlesMesh.rotation.y = elapsedTime * 0.035;
      particlesMesh.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Core light pulsing
      coreLight.intensity = 2.2 + Math.sin(elapsedTime * 2.5) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleTexture.dispose();
    };
  }, []);

  if (!webGLSupported) {
    // Static Luxury Fallback for low-spec/non-WebGL devices
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-[#4A1028] to-[#380B1E]">
        <div className="w-48 h-48 rounded-full border-4 border-rose-dusty/40 flex items-center justify-center shadow-wine-glow">
          <div className="w-36 h-36 rounded-full border-2 border-ivory-100/60 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-wine/60 backdrop-blur-md border border-rose-dusty flex items-center justify-center">
              <span className="font-serif text-3xl font-bold text-ivory-100">TL</span>
            </div>
          </div>
        </div>
        <p className="font-serif italic text-rose-dusty text-sm mt-6 tracking-wide">
          TruthLens AI • Holographic Forensic Glass
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      title="Interactive 3D Glass Fingerprint — Move mouse to orbit"
    />
  );
};

