// 3D Rotating Phone Mockup for Payslip Display
// Interactive 3D phone that displays the payslip form

class PayslipPhoneMockup {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.phone = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initPhone());
    } else {
      this.initPhone();
    }
  }

  initPhone() {
    console.log('Initializing 3D phone mockup...');
    const container = document.getElementById('phone-3d-mockup');
    if (!container) {
      console.error('Container #phone-3d-mockup not found!');
      return;
    }

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Create phone group
    this.phone = new THREE.Group();

    // iPhone 17 Pro Max - Sleek Modern Design
    const phoneWidth = 2.8;
    const phoneHeight = 6;
    const phoneDepth = 0.22;

    // Create rounded phone body with RoundedBox geometry
    const bodyGeometry = new THREE.BoxGeometry(phoneWidth, phoneHeight, phoneDepth, 32, 32, 32);

    // Modify geometry vertices for rounded corners effect
    const positionAttribute = bodyGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      // Apply subtle rounding to corners
      const edgeDistance = 0.15;
      const roundFactor = 0.92;

      if (Math.abs(x) > phoneWidth / 2 - edgeDistance && Math.abs(y) > phoneHeight / 2 - edgeDistance) {
        positionAttribute.setX(i, x * roundFactor);
        positionAttribute.setY(i, y * roundFactor);
      }
    }

    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 1
    });
    const body = new THREE.Mesh(bodyGeometry, titaniumMaterial);
    body.castShadow = true;
    this.phone.add(body);

    // Screen bezel (ultra-thin bezels)
    const screenWidth = phoneWidth - 0.1;
    const screenHeight = phoneHeight - 0.1;
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.3,
      roughness: 0.7
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = (phoneDepth / 2) + 0.01;
    this.phone.add(screen);

    // Dynamic Island (pill-shaped cutout)
    const islandGeometry = new THREE.BoxGeometry(0.95, 0.13, 0.02);
    const islandMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0,
      roughness: 1
    });
    const dynamicIsland = new THREE.Mesh(islandGeometry, islandMaterial);
    dynamicIsland.position.set(0, (phoneHeight / 2) - 0.3, (phoneDepth / 2) + 0.015);
    this.phone.add(dynamicIsland);

    // Front camera lens (glossy)
    const frontCamGeometry = new THREE.CircleGeometry(0.04, 32);
    const frontCamMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x1e40af,
      emissiveIntensity: 0.2
    });
    const frontCam = new THREE.Mesh(frontCamGeometry, frontCamMaterial);
    frontCam.position.set(-0.35, (phoneHeight / 2) - 0.28, (phoneDepth / 2) + 0.02);
    this.phone.add(frontCam);

    // Face ID dot
    const sensorGeometry = new THREE.CircleGeometry(0.025, 32);
    const sensorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.5,
      roughness: 0.5
    });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(0.35, (phoneHeight / 2) - 0.28, (phoneDepth / 2) + 0.02);
    this.phone.add(sensor);

    // Create screen content (payslip form preview)
    this.createScreenContent();

    // Camera module (raised square bump)
    const cameraModuleGeometry = new THREE.BoxGeometry(1.4, 1.5, 0.12);
    const cameraModuleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2
    });
    const cameraModule = new THREE.Mesh(cameraModuleGeometry, cameraModuleMaterial);
    cameraModule.position.set(-0.5, phoneHeight / 2 - 1.3, -(phoneDepth / 2) - 0.06);
    this.phone.add(cameraModule);

    // Triple camera lenses with glass effect
    const createLens = (x, y, size) => {
      const lensGroup = new THREE.Group();

      // Lens housing (dark ring)
      const housingGeometry = new THREE.CircleGeometry(size + 0.03, 32);
      const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.3
      });
      const housing = new THREE.Mesh(housingGeometry, housingMaterial);
      lensGroup.add(housing);

      // Glass lens (glossy)
      const glassGeometry = new THREE.CircleGeometry(size, 32);
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0x475569,
        emissiveIntensity: 0.1
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      glass.position.z = 0.01;
      lensGroup.add(glass);

      lensGroup.position.set(x, y, -(phoneDepth / 2) - 0.13);
      return lensGroup;
    };

    // Main camera (largest)
    this.phone.add(createLens(-0.9, phoneHeight / 2 - 0.9, 0.26));

    // Ultra-wide camera
    this.phone.add(createLens(-0.1, phoneHeight / 2 - 0.9, 0.26));

    // Telephoto camera
    this.phone.add(createLens(-0.9, phoneHeight / 2 - 1.7, 0.26));

    // LiDAR scanner (smaller, matte black)
    const lidarGeometry = new THREE.CircleGeometry(0.18, 32);
    const lidarMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.2,
      roughness: 0.9
    });
    const lidar = new THREE.Mesh(lidarGeometry, lidarMaterial);
    lidar.position.set(-0.1, phoneHeight / 2 - 1.7, -(phoneDepth / 2) - 0.13);
    this.phone.add(lidar);

    // Flash (subtle)
    const flashGeometry = new THREE.CircleGeometry(0.1, 32);
    const flashMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      metalness: 0.1,
      roughness: 0.8,
      emissive: 0xfde047,
      emissiveIntensity: 0.2
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.set(0.3, phoneHeight / 2 - 1.3, -(phoneDepth / 2) - 0.13);
    this.phone.add(flash);

    // Side buttons (slim and refined)
    const buttonGeometry = new THREE.BoxGeometry(0.04, 0.55, 0.1);
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      metalness: 0.85,
      roughness: 0.25
    });

    // Volume buttons (left side)
    const volumeUp = new THREE.Mesh(buttonGeometry, buttonMaterial);
    volumeUp.position.set(-(phoneWidth / 2) - 0.02, 0.9, 0);
    this.phone.add(volumeUp);

    const volumeDown = new THREE.Mesh(buttonGeometry, buttonMaterial);
    volumeDown.position.set(-(phoneWidth / 2) - 0.02, 0.2, 0);
    this.phone.add(volumeDown);

    // Silent switch (tiny)
    const silentGeometry = new THREE.BoxGeometry(0.03, 0.25, 0.08);
    const silentSwitch = new THREE.Mesh(silentGeometry, buttonMaterial);
    silentSwitch.position.set(-(phoneWidth / 2) - 0.02, 1.6, 0);
    this.phone.add(silentSwitch);

    // Power button (right side, longer)
    const powerGeometry = new THREE.BoxGeometry(0.04, 0.7, 0.1);
    const powerButton = new THREE.Mesh(powerGeometry, buttonMaterial);
    powerButton.position.set((phoneWidth / 2) + 0.02, 0.5, 0);
    this.phone.add(powerButton);

    this.scene.add(this.phone);
    console.log('Phone added to scene:', this.phone);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.5, 30);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
    rimLight.position.set(0, 0, -5);
    this.scene.add(rimLight);

    // Mouse interaction
    this.setupMouseInteraction(container);

    // Animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize(container));

    console.log('3D phone mockup initialized successfully!');
  }

  createScreenContent() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 2340;
    const context = canvas.getContext('2d');

    // White background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 60;
    let currentY = 80;

    // Header - Dark Blue Bar
    context.fillStyle = '#1e3a8a';
    context.fillRect(0, 0, canvas.width, 180);

    // Company Name
    context.fillStyle = '#ffffff';
    context.font = 'bold 48px -apple-system, sans-serif';
    context.textAlign = 'left';
    context.fillText('YOUR COMPANY NAME', margin, 70);

    // Payroll Slip text
    context.font = 'bold 36px -apple-system, sans-serif';
    context.fillText('PAYROLL SLIP', margin, 130);

    // Pay Period (right side)
    context.textAlign = 'right';
    context.font = '24px -apple-system, sans-serif';
    context.fillStyle = '#93c5fd';
    context.fillText('PAY PERIOD / រយៈពេល', canvas.width - margin, 50);
    context.fillStyle = '#ffffff';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.fillText('06/12/2025', canvas.width - margin, 90);

    // Exchange Rate
    context.font = '20px -apple-system, sans-serif';
    context.fillStyle = '#93c5fd';
    context.fillText('Exchange Rate / អត្រាប្ដូរប្រាក់', canvas.width - margin, 125);
    context.fillStyle = '#ffffff';
    context.font = 'bold 24px -apple-system, sans-serif';
    context.fillText('1 USD = 4188 KHR', canvas.width - margin, 155);

    currentY = 220;

    // EMPLOYEE INFO Section
    context.fillStyle = '#1e293b';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.textAlign = 'left';
    context.fillText('EMPLOYEE INFO', margin, currentY);
    context.fillStyle = '#94a3b8';
    context.font = '24px -apple-system, sans-serif';
    context.fillText('ព័ត៌មានបុគ្គលិក', margin + 280, currentY);

    // Payment Details (right side)
    context.textAlign = 'right';
    context.fillStyle = '#1e293b';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.fillText('PAYMENT DETAILS', canvas.width - margin, currentY);

    currentY += 60;

    // Divider
    context.strokeStyle = '#e2e8f0';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(margin, currentY);
    context.lineTo(canvas.width - margin, currentY);
    context.stroke();

    currentY += 50;

    // Employee Info Fields (Left Column)
    const employeeFields = [
      { label: 'NAME / ឈ្មោះ', value: '---' },
      { label: 'ID / លេខសម្គាល់', value: '---', label2: 'POSITION / តួនាទី', value2: '---' },
      { label: 'DEPARTMENT / ផ្នែក', value: '---' }
    ];

    context.textAlign = 'left';
    employeeFields.forEach(field => {
      // Label
      context.fillStyle = '#64748b';
      context.font = '22px -apple-system, sans-serif';
      context.fillText(field.label, margin, currentY);

      // Value
      context.fillStyle = '#1e293b';
      context.font = '26px -apple-system, sans-serif';
      context.fillText(field.value, margin, currentY + 35);

      // Second field in same row (if exists)
      if (field.label2) {
        context.fillStyle = '#64748b';
        context.font = '22px -apple-system, sans-serif';
        context.fillText(field.label2, 520, currentY);

        context.fillStyle = '#1e293b';
        context.font = '26px -apple-system, sans-serif';
        context.fillText(field.value2, 520, currentY + 35);
      }

      currentY += 80;
    });

    // Payment Details (Right Column) - repositioned
    let paymentY = 280;
    const paymentFields = [
      { label: 'BANK / ធនាគារ', value: '---', label2: 'ACCOUNT / លេខគណនី', value2: '---' },
      { label: 'NSSF NO / លេខសន្តិសុខ សង្គម', value: '---' },
      { label: 'ATTENDANCE / វត្តមាន', value: '0 Days Worked • 0 Leave' }
    ];

    context.textAlign = 'left';
    paymentFields.forEach(field => {
      // Label
      context.fillStyle = '#64748b';
      context.font = '22px -apple-system, sans-serif';
      context.fillText(field.label, 540, paymentY);

      // Value
      context.fillStyle = '#1e293b';
      context.font = '26px -apple-system, sans-serif';
      context.fillText(field.value, 540, paymentY + 35);

      // Second field in same row
      if (field.label2) {
        context.fillStyle = '#64748b';
        context.font = '22px -apple-system, sans-serif';
        context.textAlign = 'right';
        context.fillText(field.label2, canvas.width - margin, paymentY);

        context.fillStyle = '#1e293b';
        context.font = '26px -apple-system, sans-serif';
        context.fillText(field.value2, canvas.width - margin, paymentY + 35);
        context.textAlign = 'left';
      }

      paymentY += 80;
    });

    currentY = Math.max(currentY, paymentY) + 40;

    // EARNINGS and DEDUCTIONS Section
    context.fillStyle = '#f8fafc';
    context.fillRect(0, currentY, canvas.width, 700);

    currentY += 50;

    // Two column headers
    context.fillStyle = '#1e293b';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.textAlign = 'left';
    context.fillText('EARNINGS', margin, currentY);
    context.fillStyle = '#64748b';
    context.font = '24px -apple-system, sans-serif';
    context.fillText('ប្រាក់ចំណូល', margin + 180, currentY);

    context.textAlign = 'center';
    context.fillStyle = '#1e293b';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.fillText('DEDUCTIONS', canvas.width / 2 + 200, currentY);
    context.fillStyle = '#64748b';
    context.font = '24px -apple-system, sans-serif';
    context.fillText('ការកាត់ទោស', canvas.width / 2 + 380, currentY);

    currentY += 60;

    // Earnings items
    const earnings = [
      { label: 'Base Salary', sublabel: 'ប្រាក់ខែមូលដ្ឋាន', amount: '$0.00' },
      { label: 'Seniority Indemnity', sublabel: 'សំណងឋានានុក្រម', note: '(Example)', amount: '$0.00' },
      { label: 'Bonus / Commission', sublabel: 'ប្រាក់រង្វាន់ / កម្រៃជើងសា', amount: '$0.00' },
      { label: 'Overtime', sublabel: 'ម៉ោងធ្វើការបន្ថែម', note: '(0h)', amount: '$0.00' }
    ];

    const deductions = [
      { label: 'Tax on Salary', sublabel: 'ពន្ធលើប្រាក់ខែ', note: '(Degr. 0)', amount: '$0.00', red: true },
      { label: 'NSSF (Pension 2%)', sublabel: 'សន.ស.ស (ប្រាក់សោធន)', amount: '$0.00', red: true },
      { label: 'Advance / Loan', sublabel: 'ប្រាក់កម្ចី / កម', amount: '$0.00', red: true }
    ];

    let earningsY = currentY;
    earnings.forEach(item => {
      context.textAlign = 'left';
      context.fillStyle = '#1e293b';
      context.font = 'bold 24px -apple-system, sans-serif';
      context.fillText(item.label, margin + 20, earningsY);

      context.fillStyle = '#64748b';
      context.font = '20px -apple-system, sans-serif';
      let sublabel = item.sublabel;
      if (item.note) sublabel += ' ' + item.note;
      context.fillText(sublabel, margin + 20, earningsY + 28);

      context.textAlign = 'right';
      context.fillStyle = '#1e293b';
      context.font = 'bold 26px -apple-system, sans-serif';
      context.fillText(item.amount, 480, earningsY + 15);

      earningsY += 85;
    });

    let deductionsY = currentY;
    deductions.forEach(item => {
      context.textAlign = 'left';
      context.fillStyle = '#1e293b';
      context.font = 'bold 24px -apple-system, sans-serif';
      context.fillText(item.label, 560, deductionsY);

      context.fillStyle = '#64748b';
      context.font = '20px -apple-system, sans-serif';
      context.fillText(item.sublabel, 560, deductionsY + 28);

      context.textAlign = 'right';
      context.fillStyle = item.red ? '#dc2626' : '#1e293b';
      context.font = 'bold 26px -apple-system, sans-serif';
      context.fillText(item.amount, canvas.width - margin - 20, deductionsY + 15);

      deductionsY += 95;
    });

    currentY = Math.max(earningsY, deductionsY) + 30;

    // Total lines
    context.strokeStyle = '#cbd5e1';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(margin, currentY);
    context.lineTo(500, currentY);
    context.stroke();

    context.beginPath();
    context.moveTo(540, currentY);
    context.lineTo(canvas.width - margin, currentY);
    context.stroke();

    currentY += 45;

    // TOTAL EARNINGS / DEDUCTIONS
    context.textAlign = 'left';
    context.fillStyle = '#1e293b';
    context.font = 'bold 28px -apple-system, sans-serif';
    context.fillText('TOTAL EARNINGS', margin + 20, currentY);
    context.fillStyle = '#64748b';
    context.font = '22px -apple-system, sans-serif';
    context.fillText('សរុបប្រាក់ចំណូល', margin + 20, currentY + 30);

    context.textAlign = 'right';
    context.fillStyle = '#2563eb';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.fillText('$0.00', 480, currentY + 15);

    context.textAlign = 'left';
    context.fillStyle = '#1e293b';
    context.font = 'bold 28px -apple-system, sans-serif';
    context.fillText('TOTAL DEDUCTIONS', 560, currentY);
    context.fillStyle = '#64748b';
    context.font = '22px -apple-system, sans-serif';
    context.fillText('សរុបការកាត់ទោស', 560, currentY + 30);

    context.textAlign = 'right';
    context.fillStyle = '#dc2626';
    context.font = 'bold 32px -apple-system, sans-serif';
    context.fillText('$0.00', canvas.width - margin - 20, currentY + 15);

    currentY += 100;

    // NET PAY Section (Dark Blue)
    context.fillStyle = '#1e3a8a';
    context.fillRect(margin - 20, currentY, canvas.width - (margin * 2) + 40, 120);

    context.fillStyle = '#ffffff';
    context.font = 'bold 36px -apple-system, sans-serif';
    context.textAlign = 'left';
    context.fillText('NET PAY', margin + 20, currentY + 50);
    context.font = '24px -apple-system, sans-serif';
    context.fillText('ប្រាក់សុទ្ធដែលទទួល', margin + 20, currentY + 85);

    context.textAlign = 'right';
    context.font = 'bold 52px -apple-system, sans-serif';
    context.fillText('$0.00', canvas.width - margin - 20, currentY + 65);

    currentY += 150;

    // Estimated in KHR
    context.textAlign = 'left';
    context.fillStyle = '#1e293b';
    context.font = 'bold 24px -apple-system, sans-serif';
    context.fillText('ESTIMATED IN KHR គណនាជា', margin, currentY);

    context.fillStyle = '#64748b';
    context.font = '28px -apple-system, sans-serif';
    context.fillText('៛ 0', margin + 380, currentY);

    currentY += 60;

    // Signature sections
    context.strokeStyle = '#e2e8f0';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(margin, currentY);
    context.lineTo(canvas.width - margin, currentY);
    context.stroke();

    currentY += 50;

    // Employer Signature
    context.textAlign = 'left';
    context.fillStyle = '#1e293b';
    context.font = 'bold 24px -apple-system, sans-serif';
    context.fillText('EMPLOYER SIGNATURE & STAMP', margin, currentY);

    context.fillStyle = '#64748b';
    context.font = '20px -apple-system, sans-serif';
    context.fillText('ហត្ថលេខា និងត្រានិយោជក', margin, currentY + 30);

    // Employee Signature
    context.textAlign = 'right';
    context.fillStyle = '#1e293b';
    context.font = 'bold 24px -apple-system, sans-serif';
    context.fillText('EMPLOYEE SIGNATURE', canvas.width - margin, currentY);

    context.fillStyle = '#64748b';
    context.font = '20px -apple-system, sans-serif';
    context.fillText('ហត្ថលេខាបុគ្គលិក', canvas.width - margin, currentY + 30);

    currentY += 120;

    // Compliance notice
    context.fillStyle = '#fef3c7';
    this.roundRect(context, margin, currentY, canvas.width - margin * 2, 100, 10);
    context.fill();

    context.fillStyle = '#92400e';
    context.font = '20px -apple-system, sans-serif';
    context.textAlign = 'left';
    context.fillText('⚠ Compliance Notice', margin + 20, currentY + 35);

    context.font = '18px -apple-system, sans-serif';
    context.fillStyle = '#78350f';
    const noticeText = 'As per Prakas No. 113/25, this payslip requires MLVT QR code integration';
    context.fillText(noticeText, margin + 20, currentY + 65);

    currentY += 130;

    // MLVT QR Code placeholder
    context.fillStyle = '#f1f5f9';
    this.roundRect(context, canvas.width / 2 - 120, currentY, 240, 240, 10);
    context.fill();

    context.fillStyle = '#64748b';
    context.font = 'bold 24px -apple-system, sans-serif';
    context.textAlign = 'center';
    context.fillText('MLVT QR Code', canvas.width / 2, currentY + 120);

    currentY += 280;

    // Footer disclaimer
    context.fillStyle = '#64748b';
    context.font = '18px -apple-system, sans-serif';
    context.textAlign = 'center';
    context.fillText('DESIGNED IN ACCORDANCE WITH CAMBODIA LABOR LAW, MLVT QR CODE', canvas.width / 2, currentY);
    context.fillText('INTEGRATION REQUIRED FOR FULL COMPLIANCE', canvas.width / 2, currentY + 30);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Apply to screen (adjusted for new phone size)
    const displayWidth = 2.7;  // phoneWidth - 0.1
    const displayHeight = 5.9; // phoneHeight - 0.1
    const screenContentGeometry = new THREE.PlaneGeometry(displayWidth * 0.98, displayHeight * 0.98);
    const screenContentMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false
    });
    const screenContent = new THREE.Mesh(screenContentGeometry, screenContentMaterial);
    screenContent.position.z = 0.17;
    this.phone.add(screenContent);

    // Screen glow effect
    const glowGeometry = new THREE.PlaneGeometry(displayWidth * 1.02, displayHeight * 1.02);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.1
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = 0.16;
    this.phone.add(glow);
  }

  // Helper function to draw rounded rectangles
  roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  setupMouseInteraction(container) {
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      rotationVelocityY = deltaX * 0.01;
      rotationVelocityX = deltaY * 0.01;

      this.phone.rotation.y += rotationVelocityY;
      this.phone.rotation.x += rotationVelocityX;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    container.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      rotationVelocityY = deltaX * 0.01;
      rotationVelocityX = deltaY * 0.01;

      this.phone.rotation.y += rotationVelocityY;
      this.phone.rotation.x += rotationVelocityX;

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth auto-rotate when not being dragged
    if (this.phone) {
      this.phone.rotation.y += 0.002; // Slower, smoother rotation
      // No bobbing animation - phone stays stable
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize(container) {
    if (!container.clientWidth) return;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

// Initialize when Three.js is loaded
if (typeof THREE !== 'undefined') {
  console.log('Three.js loaded for payslip phone mockup');
  new PayslipPhoneMockup();
} else {
  console.error('THREE.js NOT LOADED! Phone mockup will not work.');
}
