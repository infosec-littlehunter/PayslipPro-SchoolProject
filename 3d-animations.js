// 3D Cute Anime Robot for PayrollPro - Kawaii style with big eyes and adorable features
// Fun, energetic promotional animation for Digital Payslip Management section

class ThreeDAnimations {
  constructor() {
    this.scenes = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initAnimations());
    } else {
      this.initAnimations();
    }
  }

  initAnimations() {
    console.log('Initializing 3D animations...');
    this.initKawaiiRobot();
  }

  // Cute Anime Robot with Easy-to-Read Sign
  initKawaiiRobot() {
    console.log('Starting kawaii robot initialization...');
    const container = document.getElementById('payslip-3d-viz');
    if (!container) {
      console.error('Container #payslip-3d-viz not found!');
      return;
    }
    console.log('Container found:', container);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const primaryColor = 0x3b82f6;
    const accentColor = 0x60a5fa;
    const jetpackColor = 0xff6b35;
    const whiteColor = 0xffffff;
    const pinkBlush = 0xff9eb5;

    // Create Cute Robot Group
    const robot = new THREE.Group();

    // CUTE ROUNDED HEAD (bigger for anime proportions)
    const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.6,
      roughness: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    head.scale.set(1, 1.05, 1); // Slightly elongated
    head.castShadow = true;

    // Face panel (lighter area for face)
    const facePanelGeometry = new THREE.CircleGeometry(0.65, 32);
    const facePanelMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      metalness: 0.2,
      roughness: 0.8
    });
    const facePanel = new THREE.Mesh(facePanelGeometry, facePanelMaterial);
    facePanel.position.set(0, 1.8, 0.8);

    // BIG ANIME EYES (kawaii style)
    const eyeWhiteGeometry = new THREE.SphereGeometry(0.22, 32, 32);
    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: whiteColor,
      metalness: 0.1,
      roughness: 0.3
    });

    // Left eye white
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    leftEyeWhite.position.set(-0.28, 1.9, 0.75);
    leftEyeWhite.scale.set(1, 1.15, 0.8);

    // Right eye white
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    rightEyeWhite.position.set(0.28, 1.9, 0.75);
    rightEyeWhite.scale.set(1, 1.15, 0.8);

    // Eye iris (bright cyan)
    const irisGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.5,
      metalness: 0.8
    });

    const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
    leftIris.position.set(-0.28, 1.88, 0.85);

    const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
    rightIris.position.set(0.28, 1.88, 0.85);

    // Eye pupils (large for cute look)
    const pupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.28, 1.88, 0.92);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.28, 1.88, 0.92);

    // Eye highlights (anime sparkle)
    const highlightGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });

    const leftHighlight1 = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight1.position.set(-0.32, 1.95, 0.95);

    const rightHighlight1 = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight1.position.set(0.24, 1.95, 0.95);

    // Small highlight
    const smallHighlightGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const leftHighlight2 = new THREE.Mesh(smallHighlightGeometry, highlightMaterial);
    leftHighlight2.position.set(-0.22, 1.82, 0.95);

    const rightHighlight2 = new THREE.Mesh(smallHighlightGeometry, highlightMaterial);
    rightHighlight2.position.set(0.34, 1.82, 0.95);

    // Cute mouth (^_^ style)
    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.25, 1.55, 0.78),
      new THREE.Vector3(0, 1.48, 0.78),
      new THREE.Vector3(0.25, 1.55, 0.78)
    );
    const mouthPoints = mouthCurve.getPoints(30);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouthMaterial = new THREE.LineBasicMaterial({
      color: 0x1e40af,
      linewidth: 4
    });
    const mouth = new THREE.Line(mouthGeometry, mouthMaterial);

    // Blush marks (kawaii!)
    const blushGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const blushMaterial = new THREE.MeshBasicMaterial({
      color: pinkBlush,
      transparent: true,
      opacity: 0.6
    });

    const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
    leftBlush.position.set(-0.55, 1.7, 0.72);
    leftBlush.scale.set(1.2, 0.8, 0.5);

    const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial);
    rightBlush.position.set(0.55, 1.7, 0.72);
    rightBlush.scale.set(1.2, 0.8, 0.5);

    // Cute antenna with heart on top!
    const antennaGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.9
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 2.4, 0);

    // Heart shape on antenna
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.05, -0.08, -0.05, -0.08, 0);
    heartShape.bezierCurveTo(-0.08, 0.05, -0.08, 0.08, 0, 0.15);
    heartShape.bezierCurveTo(0.08, 0.08, 0.08, 0.05, 0.08, 0);
    heartShape.bezierCurveTo(0.08, -0.05, 0, -0.05, 0, 0);

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01
    });
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0066,
      emissive: 0xff0066,
      emissiveIntensity: 0.5
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(0, 2.6, 0);
    heart.rotation.x = Math.PI;

    // CHIBI BODY (smaller, rounded)
    const bodyGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.6,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.scale.set(1, 1.2, 0.9);
    body.castShadow = true;

    // Body panel (lighter)
    const bodyPanelGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bodyPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      metalness: 0.3,
      roughness: 0.7
    });
    const bodyPanel = new THREE.Mesh(bodyPanelGeometry, bodyPanelMaterial);
    bodyPanel.position.set(0, 0.5, 0.5);
    bodyPanel.scale.set(1, 1.1, 0.5);

    // CUTE SHORT ARMS (chibi style) - using cylinder instead of capsule
    const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16);

    const leftArmGroup = new THREE.Group();
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.y = -0.2;
    leftArmGroup.add(leftArm);
    leftArmGroup.position.set(-0.75, 0.6, 0);
    leftArmGroup.rotation.z = 0.4;

    const rightArmGroup = new THREE.Group();
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.y = -0.2;
    rightArmGroup.add(rightArm);
    rightArmGroup.position.set(0.75, 0.6, 0);
    rightArmGroup.rotation.z = -0.4;

    // ROUNDED HANDS (mittens style - super cute!)
    const handGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const handMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.7
    });

    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-1.7, -0.4, 0.2);
    leftHand.scale.set(1, 0.9, 0.9);

    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(1.7, -0.4, 0.2);
    rightHand.scale.set(1, 0.9, 0.9);

    // CUTE JETPACK (rounded, toy-like)
    const jetpackGroup = new THREE.Group();

    // Main jetpack body (rounded)
    const jetpackBodyGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.5, 8, 8, 8);
    const jetpackMaterial = new THREE.MeshStandardMaterial({
      color: jetpackColor,
      metalness: 0.7,
      roughness: 0.3
    });
    const jetpackBody = new THREE.Mesh(jetpackBodyGeometry, jetpackMaterial);
    jetpackBody.position.set(0, 0.5, -0.65);

    // Round details on jetpack
    const jetpackDetailGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const jetpackDetailMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      emissive: 0xffd700,
      emissiveIntensity: 0.3
    });

    const jetpackDetail1 = new THREE.Mesh(jetpackDetailGeometry, jetpackDetailMaterial);
    jetpackDetail1.position.set(-0.25, 0.8, -0.4);

    const jetpackDetail2 = new THREE.Mesh(jetpackDetailGeometry, jetpackDetailMaterial);
    jetpackDetail2.position.set(0.25, 0.8, -0.4);

    // Cute rounded thrusters
    const thrusterGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.4, 16);

    const leftThruster = new THREE.Mesh(thrusterGeometry, jetpackMaterial);
    leftThruster.position.set(-0.25, -0.2, -0.65);

    const rightThruster = new THREE.Mesh(thrusterGeometry, jetpackMaterial);
    rightThruster.position.set(0.25, -0.2, -0.65);

    // KAWAII FLAMES (star-like, magical)
    const flameGeometry = new THREE.ConeGeometry(0.15, 0.6, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.85
    });

    const leftFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    leftFlame.position.set(-0.25, -0.75, -0.65);
    leftFlame.rotation.x = Math.PI;

    const rightFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    rightFlame.position.set(0.25, -0.75, -0.65);
    rightFlame.rotation.x = Math.PI;

    // Inner yellow flame
    const innerFlameGeometry = new THREE.ConeGeometry(0.08, 0.4, 8);
    const innerFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff66,
      transparent: true,
      opacity: 0.9
    });

    const leftInnerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    leftInnerFlame.position.set(-0.25, -0.65, -0.65);
    leftInnerFlame.rotation.x = Math.PI;

    const rightInnerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
    rightInnerFlame.position.set(0.25, -0.65, -0.65);
    rightInnerFlame.rotation.x = Math.PI;

    jetpackGroup.add(jetpackBody);
    jetpackGroup.add(jetpackDetail1);
    jetpackGroup.add(jetpackDetail2);
    jetpackGroup.add(leftThruster);
    jetpackGroup.add(rightThruster);
    jetpackGroup.add(leftFlame);
    jetpackGroup.add(rightFlame);
    jetpackGroup.add(leftInnerFlame);
    jetpackGroup.add(rightInnerFlame);

    // Add all parts to robot
    robot.add(head);
    robot.add(facePanel);
    robot.add(leftEyeWhite);
    robot.add(rightEyeWhite);
    robot.add(leftIris);
    robot.add(rightIris);
    robot.add(leftPupil);
    robot.add(rightPupil);
    robot.add(leftHighlight1);
    robot.add(rightHighlight1);
    robot.add(leftHighlight2);
    robot.add(rightHighlight2);
    robot.add(mouth);
    robot.add(leftBlush);
    robot.add(rightBlush);
    robot.add(antenna);
    robot.add(heart);
    robot.add(body);
    robot.add(bodyPanel);
    robot.add(leftArmGroup);
    robot.add(rightArmGroup);
    robot.add(leftHand);
    robot.add(rightHand);
    robot.add(jetpackGroup);

    scene.add(robot);

    // Cute rounded sign
    const signGroup = new THREE.Group();

    // Rounded sign board
    const signGeometry = new THREE.BoxGeometry(4, 2.2, 0.15, 16, 16, 16);
    const signMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.6
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.castShadow = true;

    // Cute border
    const borderGeometry = new THREE.EdgesGeometry(signGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({
      color: primaryColor,
      linewidth: 5
    });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    sign.add(border);

    signGroup.add(sign);
    signGroup.position.set(0, -0.4, 0.5);
    robot.add(signGroup);

    // Messages
    const messages = [
      "Save Trees! 🌳\nGo Paperless!",
      "Instant Access ⚡\nAnytime!",
      "Super Secure 🔒\nData Safe!",
      "Mobile Ready 📱\nAny Device!",
      "Track History 📊\nAll Organized!",
      "Never Lost ✓\nAlways There!"
    ];

    let currentMessageIndex = 0;

    const createTextTexture = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1536;
      canvas.height = 820;
      const context = canvas.getContext('2d');

      // Cute gradient background
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#fef3c7');
      gradient.addColorStop(0.5, '#fef9e3');
      gradient.addColorStop(1, '#ffffff');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Add cute border
      context.strokeStyle = '#3b82f6';
      context.lineWidth = 15;
      context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Draw text
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const lines = text.split('\n');
      const lineHeight = 220;
      const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        if (index === 0) {
          context.font = 'bold 150px "Comic Sans MS", Arial, sans-serif';
          context.fillStyle = '#1e3a8a';
        } else {
          context.font = 'bold 120px "Comic Sans MS", Arial, sans-serif';
          context.fillStyle = '#3b82f6';
        }

        // Cute text outline
        context.strokeStyle = '#ffffff';
        context.lineWidth = 8;
        context.strokeText(line, canvas.width / 2, startY + index * lineHeight);

        // Fill text
        context.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const textMaterial = new THREE.MeshBasicMaterial({
      map: createTextTexture(messages[0])
    });
    sign.material = textMaterial;

    setInterval(() => {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      sign.material.map = createTextTexture(messages[currentMessageIndex]);
      sign.material.needsUpdate = true;
    }, 3500);

    // KAWAII SPARKLES!
    const sparkleCount = 60;
    const sparklesGeometry = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 15;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Rainbow colors
      const hue = Math.random();
      if (hue < 0.33) {
        sparkleColors[i * 3] = 1; sparkleColors[i * 3 + 1] = 0.7; sparkleColors[i * 3 + 2] = 0.8; // Pink
      } else if (hue < 0.66) {
        sparkleColors[i * 3] = 0.5; sparkleColors[i * 3 + 1] = 0.8; sparkleColors[i * 3 + 2] = 1; // Blue
      } else {
        sparkleColors[i * 3] = 1; sparkleColors[i * 3 + 1] = 1; sparkleColors[i * 3 + 2] = 0.5; // Yellow
      }
    }

    sparklesGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparklesGeometry.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      vertexColors: true
    });

    const sparkles = new THREE.Points(sparklesGeometry, sparkleMaterial);
    scene.add(sparkles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff66cc, 0.6, 50);
    pointLight2.position.set(-5, 3, 5);
    scene.add(pointLight2);

    const jetpackLight = new THREE.PointLight(jetpackColor, 0.8, 12);
    jetpackLight.position.set(0, -0.5, -0.65);
    robot.add(jetpackLight);

    // SUPER LIVELY KAWAII ANIMATION!
    let time = 0;
    let blinkTimer = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;
      blinkTimer += 0.016;

      // Bouncy hovering (kawaii bounce)
      robot.position.y = Math.abs(Math.sin(time * 1.5)) * 0.6 + Math.sin(time * 3) * 0.1;

      // Cute tilting
      robot.rotation.z = Math.sin(time * 0.8) * 0.1;
      robot.rotation.y = Math.sin(time * 0.4) * 0.15;

      // Head bobbing
      head.rotation.y = Math.sin(time * 0.6) * 0.2;
      head.rotation.z = Math.cos(time * 0.7) * 0.08;

      // Heart pulsing
      const heartPulse = 1 + Math.sin(time * 5) * 0.3;
      heart.scale.set(heartPulse, heartPulse, heartPulse);

      // Blush pulsing
      leftBlush.material.opacity = 0.5 + Math.sin(time * 2) * 0.15;
      rightBlush.material.opacity = 0.5 + Math.sin(time * 2) * 0.15;

      // Eye tracking
      const eyeMove = Math.sin(time * 0.6) * 0.08;
      leftPupil.position.x = -0.28 + eyeMove;
      rightPupil.position.x = 0.28 + eyeMove;
      leftIris.position.x = -0.28 + eyeMove;
      rightIris.position.x = 0.28 + eyeMove;

      // Kawaii blinking
      if (blinkTimer > 2.5 && Math.random() > 0.98) {
        leftEyeWhite.scale.y = 0.1;
        rightEyeWhite.scale.y = 0.1;
        setTimeout(() => {
          leftEyeWhite.scale.y = 1.15;
          rightEyeWhite.scale.y = 1.15;
        }, 150);
        blinkTimer = 0;
      }

      // Arms waving
      leftArmGroup.rotation.z = 0.4 + Math.sin(time * 1.2) * 0.15;
      rightArmGroup.rotation.z = -0.4 - Math.sin(time * 1.2) * 0.15;

      leftHand.position.y = -0.4 + Math.sin(time * 1.2) * 0.12;
      rightHand.position.y = -0.4 + Math.sin(time * 1.2) * 0.12;

      // Jetpack flames
      const flameScale = 1 + Math.sin(time * 10) * 0.5;
      leftFlame.scale.y = flameScale;
      rightFlame.scale.y = flameScale;
      leftInnerFlame.scale.y = flameScale * 0.7;
      rightInnerFlame.scale.y = flameScale * 0.7;

      jetpackLight.intensity = 0.6 + Math.sin(time * 8) * 0.3;

      // Sign bouncing
      signGroup.rotation.z = Math.sin(time * 1.2) * 0.05;
      signGroup.position.y = -0.4 + Math.sin(time * 1.5) * 0.1;

      // Sparkles rotation and twinkling
      sparkles.rotation.y = time * 0.08;
      sparkles.rotation.x = time * 0.03;

      const positions = sparkles.geometry.attributes.position.array;
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.015;
      }
      sparkles.geometry.attributes.position.needsUpdate = true;

      // Dynamic camera
      camera.position.x = Math.sin(time * 0.35) * 1;
      camera.position.y = Math.cos(time * 0.45) * 0.7;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    this.scenes.robot = { scene, camera, renderer, container };

    window.addEventListener('resize', () => {
      if (!container.clientWidth) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  cleanup() {
    Object.values(this.scenes).forEach(({ scene, renderer, container }) => {
      if (renderer) {
        renderer.dispose();
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
      }
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    });
  }
}

if (typeof THREE !== 'undefined') {
  console.log('Three.js loaded successfully! Version:', THREE.REVISION);
  new ThreeDAnimations();
  console.log('ThreeDAnimations instance created');
} else {
  console.error('THREE.js NOT LOADED! 3D animations will not work.');
  console.log('Make sure Three.js script is loaded before this file.');
}
