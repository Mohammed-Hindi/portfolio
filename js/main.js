import * as THREE from "three";
import { skills, projects } from "./data.js";

window.__portfolioModuleLoaded = true;

/* =========================================================
   CONFIG
   ========================================================= */

const SECTION_COUNT = 5;

const CAMERA_ZONES = [
  { x: 0, y: 1.2, z: 8 },
  { x: 0, y: 1.0, z: -10 },
  { x: 0, y: 1.0, z: -28 },
  { x: 0, y: 1.2, z: -48 },
  { x: 0, y: 1.0, z: -68 },
];

const COLORS = {
  black: 0x050608,
  dark: 0x0a0d12,
  panel: 0x10141b,

  white: 0xf4f7fb,
  silver: 0xb8c2cf,
  silverDark: 0x5d6875,

  blue: 0x5aa9ff,
  blueLight: 0x8bc4ff,
  blueDark: 0x2f7fd1,

  line: 0x6e849b,
};

const quality = getQualitySettings();

/* =========================================================
   THREE STATE
   ========================================================= */

let scene;
let camera;
let renderer;
let clock;

let world;
let heroWorld;
let aboutWorld;
let skillsWorld;
let projectsWorld;
let contactWorld;
let backgroundWorld;

let raycaster;
let pointer = new THREE.Vector2();

let projectObjects = [];

let targetSection = 0;
let introTourActive = false;
let introTourTimer = null;
let introTourSkipHandler = null;

let modalOpen = false;

let isDragging = false;
let didDrag = false;

let dragStartX = 0;
let dragStartY = 0;
let dragLastX = 0;
let dragLastY = 0;

let targetRotationX = 0;
let targetRotationY = 0;

let worldRotationX = 0;
let worldRotationY = 0;

let touchStartX = 0;
let touchStartY = 0;

let scrollCooldown = false;

let reducedMotion = false;
let lastFrameTime = 0;

let soundEnabled = false;
let backgroundMusic = null;

/* =========================================================
   INIT
   ========================================================= */

function init() {
  setupSound();
  setupReducedMotion();
  setupModal();
  populateSkills();
  populateProjects();
  setupNavigation();
  setupCTAButtons();
  setupKeyboardNavigation();
  updateNavigation(0);

  try {
    clock = new THREE.Clock();

    createScene();
    createCamera();
    createRenderer();
    createWorld();

    setupLights();
    createBackground();

    createHeroWorld();
    createAboutWorld();
    createSkillsWorld();
    createProjectsWorld();
    createContactWorld();

    setupCanvasInteraction();
    setupTouchNavigation();
    setupIntroTour();

    animate();
  } catch (error) {
    activateStaticPortfolio(error);
  }

  window.__portfolioBootComplete = true;
  hideLoader();
}

function activateStaticPortfolio(error) {
  document.body.classList.add("portfolio-static-mode");
  renderer?.dispose();
  renderer = null;

  if (error) {
    console.warn("WebGL is unavailable. Showing the scrollable portfolio instead.", error);
  }
}

/* =========================================================
   SCENE
   ========================================================= */

function createScene() {
  scene = new THREE.Scene();

  scene.background = new THREE.Color(COLORS.black);

  scene.fog = new THREE.FogExp2(COLORS.black, 0.012);
}

/* =========================================================
   CAMERA
   ========================================================= */

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  );

  camera.position.set(CAMERA_ZONES[0].x, CAMERA_ZONES[0].y, CAMERA_ZONES[0].z);
}

/* =========================================================
   RENDERER
   ========================================================= */

function createRenderer() {
  let canvas = document.getElementById("three-canvas");
  let rendererError;
  const contextProfiles = [
    { powerPreference: "default", antialias: quality.antialias },
    { powerPreference: "low-power", antialias: false },
    { powerPreference: "high-performance", antialias: false },
  ];

  for (const [index, profile] of contextProfiles.entries()) {
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
        ...profile,
      });
      break;
    } catch (error) {
      rendererError = error;
      if (index < contextProfiles.length - 1) {
        const replacementCanvas = canvas.cloneNode(false);
        canvas.replaceWith(replacementCanvas);
        canvas = replacementCanvas;
      }
    }
  }

  if (!renderer) throw rendererError;

  renderer.setPixelRatio(quality.pixelRatio);

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 1.1;
}

/* =========================================================
   WORLD
   ========================================================= */

function createWorld() {
  raycaster = new THREE.Raycaster();

  world = new THREE.Group();

  scene.add(world);

  backgroundWorld = new THREE.Group();

  heroWorld = new THREE.Group();

  aboutWorld = new THREE.Group();

  skillsWorld = new THREE.Group();

  projectsWorld = new THREE.Group();

  contactWorld = new THREE.Group();

  world.add(backgroundWorld);
  world.add(heroWorld);
  world.add(aboutWorld);
  world.add(skillsWorld);
  world.add(projectsWorld);
  world.add(contactWorld);
}

/* =========================================================
   QUALITY
   ========================================================= */

function getQualitySettings() {
  const mobile = window.innerWidth < 768;

  const tablet = window.innerWidth >= 768 && window.innerWidth < 1100;

  if (mobile) {
    return {
      pixelRatio: Math.min(window.devicePixelRatio, 1.2),
      particles: 260,
      segments: 14,
      antialias: false,
    };
  }

  if (tablet) {
    return {
      pixelRatio: Math.min(window.devicePixelRatio, 1.4),
      particles: 500,
      segments: 18,
      antialias: false,
    };
  }

  return {
    pixelRatio: Math.min(window.devicePixelRatio, 1.6),
    particles: 800,
    segments: 20,
    antialias: false,
  };
}

/* =========================================================
   LIGHTS
   ========================================================= */

function setupLights() {
  const ambient = new THREE.AmbientLight(COLORS.white, 0.65);

  scene.add(ambient);

  const directional = new THREE.DirectionalLight(COLORS.white, 1.15);

  directional.position.set(4, 8, 8);

  scene.add(directional);

  const blue = new THREE.PointLight(COLORS.blue, 4.5, 35);

  blue.position.set(-5, 3, 2);

  scene.add(blue);

  const blueLight = new THREE.PointLight(COLORS.blueLight, 2.5, 30);

  blueLight.position.set(5, -2, -25);

  scene.add(blueLight);
}

/* =========================================================
   GEOMETRY HELPERS
   ========================================================= */

function addBox(
  parent,
  {
    x = 0,
    y = 0,
    z = 0,
    width = 1,
    height = 1,
    depth = 1,
    color = COLORS.panel,
    opacity = 1,
    emissive = 0x000000,
  } = {},
) {
  const geometry = new THREE.BoxGeometry(width, height, depth);

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.75,
    roughness: 0.25,
    transparent: opacity < 1,
    opacity,
    emissive,
    emissiveIntensity: emissive ? 0.25 : 0,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);

  parent.add(mesh);

  return mesh;
}

function addSphere(
  parent,
  {
    x = 0,
    y = 0,
    z = 0,
    radius = 0.3,
    color = COLORS.blue,
    emissive = COLORS.blue,
  } = {},
) {
  const geometry = new THREE.SphereGeometry(
    radius,
    quality.segments,
    quality.segments,
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.55,
    roughness: 0.2,
    emissive,
    emissiveIntensity: 0.65,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);

  parent.add(mesh);

  return mesh;
}

function addLine(parent, points, color = COLORS.line, opacity = 0.45) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });

  const line = new THREE.Line(geometry, material);

  parent.add(line);

  return line;
}

function addFrame(
  parent,
  {
    width = 4,
    height = 3,
    depth = 0.1,
    color = COLORS.silverDark,
    opacity = 0.7,
  } = {},
) {
  const group = new THREE.Group();

  const thickness = 0.035;

  addBox(group, {
    y: height / 2,
    width,
    height: thickness,
    depth,
    color,
    opacity,
  });

  addBox(group, {
    y: -height / 2,
    width,
    height: thickness,
    depth,
    color,
    opacity,
  });

  addBox(group, {
    x: -width / 2,
    width: thickness,
    height,
    depth,
    color,
    opacity,
  });

  addBox(group, {
    x: width / 2,
    width: thickness,
    height,
    depth,
    color,
    opacity,
  });

  parent.add(group);

  return group;
}

/* =========================================================
   BACKGROUND
   ========================================================= */

function createBackground() {
  const positions = new Float32Array(quality.particles * 3);

  for (let i = 0; i < quality.particles; i++) {
    const index = i * 3;

    positions[index] = (Math.random() - 0.5) * 55;

    positions[index + 1] = (Math.random() - 0.5) * 22;

    positions[index + 2] = -Math.random() * 90;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: COLORS.silver,
    size: window.innerWidth < 768 ? 0.025 : 0.035,
    transparent: true,
    opacity: 0.32,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);

  backgroundWorld.add(particles);
}

/* =========================================================
   HERO
   ========================================================= */

function createHeroWorld() {
  heroWorld.position.z = 8;

  const structure = new THREE.Group();

  heroWorld.add(structure);

  addFrame(structure, {
    width: 7,
    height: 5,
    depth: 0.08,
    color: COLORS.silverDark,
    opacity: 0.7,
  });

  addFrame(structure, {
    width: 5.5,
    height: 3.8,
    depth: 0.08,
    color: COLORS.blue,
    opacity: 0.35,
  });

  const core = addBox(structure, {
    width: 1.4,
    height: 2.2,
    depth: 1.4,
    color: COLORS.panel,
    emissive: COLORS.blueDark,
  });

  core.userData.heroCore = true;

  const nodes = [
    [-3.5, 2.5, 0],
    [3.5, 2.5, 0],
    [-3.5, -2.5, 0],
    [3.5, -2.5, 0],
    [-2.7, 0, 0],
    [2.7, 0, 0],
  ];

  nodes.forEach(([x, y, z], index) => {
    addSphere(structure, {
      x,
      y,
      z,
      radius: index < 4 ? 0.08 : 0.12,
      color: COLORS.blue,
      emissive: COLORS.blue,
    });

    addLine(
      structure,
      [new THREE.Vector3(x, y, z), new THREE.Vector3(0, 0, 0)],
      COLORS.blue,
      0.25,
    );
  });

  createArchitecturalFloor(heroWorld, 14, 8);
}

/* =========================================================
   ABOUT
   ========================================================= */

function createAboutWorld() {
  aboutWorld.position.z = -10;

  const timeline = new THREE.Group();

  aboutWorld.add(timeline);

  const stages = [
    {
      x: -3.5,
      height: 4,
      color: COLORS.silver,
    },
    {
      x: 0,
      height: 4.6,
      color: COLORS.blue,
    },
    {
      x: 3.5,
      height: 5.2,
      color: COLORS.white,
    },
  ];

  stages.forEach((stage, index) => {
    addBox(timeline, {
      x: stage.x,
      height: stage.height,
      width: 1.1,
      depth: 1.1,
      color: COLORS.panel,
      emissive: index === 1 ? COLORS.blueDark : 0x000000,
    });

    addSphere(timeline, {
      x: stage.x,
      y: 2.5 + index * 0.3,
      radius: 0.16,
      color: stage.color,
      emissive: stage.color,
    });

    if (index < stages.length - 1) {
      addLine(
        timeline,
        [
          new THREE.Vector3(stage.x + 0.6, 2, 0),
          new THREE.Vector3(stages[index + 1].x - 0.6, 2.2, 0),
        ],
        COLORS.blue,
        0.5,
      );
    }
  });

  createArchitecturalFloor(aboutWorld, 13, 7);
}

/* =========================================================
   SKILLS 3D
   ========================================================= */

function createSkillsWorld() {
  skillsWorld.position.z = -28;

  const group = new THREE.Group();

  skillsWorld.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.25, 1);

  const material = new THREE.MeshStandardMaterial({
    color: COLORS.panel,
    metalness: 0.85,
    roughness: 0.2,
    emissive: COLORS.blueDark,
    emissiveIntensity: 0.55,
    wireframe: true,
  });

  const core = new THREE.Mesh(geometry, material);

  core.userData.skillsCore = true;

  group.add(core);

  const categories = [
    {
      name: "FRONTEND",
      x: -4,
      y: 1.4,
    },
    {
      name: "BACKEND",
      x: 4,
      y: 1.4,
    },
    {
      name: "TOOLS",
      x: 0,
      y: -2.5,
    },
  ];

  categories.forEach((category) => {
    const node = addBox(group, {
      x: category.x,
      y: category.y,
      width: 1.3,
      height: 0.7,
      depth: 1.3,
      color: COLORS.panel,
      emissive: COLORS.blueDark,
    });

    node.userData.skillCategory = category.name;

    addSphere(group, {
      x: category.x,
      y: category.y + 0.65,
      radius: 0.11,
      color: COLORS.blue,
      emissive: COLORS.blue,
    });

    addLine(
      group,
      [
        new THREE.Vector3(category.x, category.y, 0),
        new THREE.Vector3(0, 0, 0),
      ],
      COLORS.blue,
      0.45,
    );
  });

  createArchitecturalFloor(skillsWorld, 14, 8);
}

/* =========================================================
   PROJECTS 3D
   ========================================================= */

function createProjectsWorld() {
  projectsWorld.position.z = -48;

  const exhibition = new THREE.Group();

  projectsWorld.add(exhibition);

  const positions = [
    {
      x: -4.2,
      y: 0.3,
      scale: 0.82,
    },
    {
      x: 0,
      y: 0.8,
      scale: 1.15,
    },
    {
      x: 4.2,
      y: 0.3,
      scale: 0.82,
    },
  ];

  if (Array.isArray(projects)) {
    projects.forEach((project, index) => {
      const position = positions[index % positions.length];

      const bay = createProjectBay(project, index, position);

      exhibition.add(bay);

      projectObjects.push(bay);
    });
  }

  createArchitecturalFloor(projectsWorld, 17, 9);
}

function createProjectBay(project, index, position) {
  const group = new THREE.Group();

  group.position.set(position.x, position.y, 0);

  group.scale.setScalar(position.scale);

  /*
   * IMPORTANT:
   * Every child receives projectIndex.
   * This makes raycasting reliable.
   */

  group.userData.projectIndex = index;

  group.userData.interactive = true;

  const frame = addFrame(group, {
    width: 4.2,
    height: 3.2,
    depth: 0.1,
    color: index === 0 ? COLORS.blue : COLORS.silverDark,
    opacity: index === 0 ? 0.9 : 0.65,
  });

  frame.userData.projectIndex = index;

  frame.userData.interactive = true;

  const panel = addBox(group, {
    z: -0.12,
    width: 3.5,
    height: 2.5,
    depth: 0.12,
    color: COLORS.panel,
    opacity: 0.72,
    emissive: index === 0 ? COLORS.blueDark : 0x000000,
  });

  panel.userData.projectIndex = index;

  panel.userData.interactive = true;

  const node = addSphere(group, {
    z: 0.1,
    radius: index === 0 ? 0.34 : 0.25,
    color: index === 0 ? COLORS.blue : COLORS.silver,
    emissive: index === 0 ? COLORS.blue : COLORS.silverDark,
  });

  node.userData.projectIndex = index;

  node.userData.interactive = true;

  /*
   * Invisible hit area.
   *
   * This is intentionally larger than
   * the visible object so clicking the
   * project is easy.
   */

  const hitGeometry = new THREE.BoxGeometry(4.5, 3.5, 0.5);

  const hitMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  const hitArea = new THREE.Mesh(hitGeometry, hitMaterial);

  hitArea.userData.projectIndex = index;

  hitArea.userData.interactive = true;

  group.add(hitArea);

  const corners = [
    [-1.75, 1.25, 0],
    [1.75, 1.25, 0],
    [-1.75, -1.25, 0],
    [1.75, -1.25, 0],
  ];

  corners.forEach(([x, y, z]) => {
    const point = addSphere(group, {
      x,
      y,
      z: z + 0.08,
      radius: 0.045,
      color: COLORS.blue,
      emissive: COLORS.blue,
    });

    point.userData.projectIndex = index;

    addLine(
      group,
      [new THREE.Vector3(x, y, z), new THREE.Vector3(0, 0, 0)],
      COLORS.blue,
      index === 0 ? 0.4 : 0.22,
    );
  });

  return group;
}

/* =========================================================
   CONTACT
   ========================================================= */

function createContactWorld() {
  contactWorld.position.z = -68;

  const gateway = new THREE.Group();

  contactWorld.add(gateway);

  addFrame(gateway, {
    width: 8,
    height: 5.5,
    depth: 0.1,
    color: COLORS.silverDark,
    opacity: 0.7,
  });

  addFrame(gateway, {
    width: 6.3,
    height: 4.1,
    depth: 0.1,
    color: COLORS.blue,
    opacity: 0.35,
  });

  addBox(gateway, {
    width: 1.6,
    height: 1.6,
    depth: 1.6,
    color: COLORS.panel,
    emissive: COLORS.blueDark,
  });

  createArchitecturalFloor(contactWorld, 15, 8);
}

/* =========================================================
   FLOOR
   ========================================================= */

function createArchitecturalFloor(parent, width, depth) {
  const group = new THREE.Group();

  group.position.y = -3;

  for (let x = -width / 2; x <= width / 2; x += 1) {
    addLine(
      group,
      [new THREE.Vector3(x, 0, -depth / 2), new THREE.Vector3(x, 0, depth / 2)],
      COLORS.silverDark,
      0.12,
    );
  }

  for (let z = -depth / 2; z <= depth / 2; z += 1) {
    addLine(
      group,
      [new THREE.Vector3(-width / 2, 0, z), new THREE.Vector3(width / 2, 0, z)],
      COLORS.silverDark,
      0.12,
    );
  }

  parent.add(group);
}

/* =========================================================
   HTML SKILLS
   ========================================================= */

function populateSkills() {
  if (!skills) {
    return;
  }

  const containers = {
    frontend: document.getElementById("frontend-skills"),

    backend: document.getElementById("backend-skills"),

    tools: document.getElementById("tools-skills"),
  };

  Object.entries(skills).forEach(([category, skillList]) => {
    const container = containers[category];

    if (!container || !Array.isArray(skillList)) {
      return;
    }

    container.innerHTML = "";

    skillList.forEach((skill, index) => {
      const tag = document.createElement("button");

      tag.type = "button";

      tag.className = "skill-tag";

      const name = typeof skill === "string" ? skill : skill.name || "Skill";

      const level =
        typeof skill === "object"
          ? skill.level || "Intermediate"
          : "Intermediate";

      tag.textContent = name;

      tag.dataset.level = level;

      tag.dataset.skill = name;

      /*
       * Click to show level.
       */

      tag.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        showSkillLevel(tag, name, level);
      });

      container.appendChild(tag);
    });
  });
}

/* =========================================================
   SKILL LEVEL DISPLAY
   ========================================================= */

function showSkillLevel(tag, name, level) {
  /*
   * Remove previous selected state.
   */

  document.querySelectorAll(".skill-tag.skill-selected").forEach((element) => {
    element.classList.remove("skill-selected");
  });

  tag.classList.add("skill-selected");

  /*
   * Existing tooltip, if the CSS supports it.
   */

  tag.setAttribute("aria-label", `${name}: ${level}`);

  /*
   * Create/update a small visible
   * level element.
   */

  let levelElement = tag.querySelector(".skill-level-display");

  if (!levelElement) {
    levelElement = document.createElement("span");

    levelElement.className = "skill-level-display";

    tag.appendChild(levelElement);
  }

  levelElement.textContent = `Level: ${level}`;

  /*
   * Automatically remove the selected
   * state when another skill is clicked.
   */
}

/* =========================================================
   HTML PROJECT CARDS
   ========================================================= */

function populateProjects() {
  const grid = document.getElementById("projects-grid");

  if (!grid || !Array.isArray(projects)) {
    return;
  }

  grid.innerHTML = "";

  projects.forEach((project, index) => {
    const card = document.createElement("article");

    card.className = "project-card";
    card.dataset.projectIndex = index;

    const stack = Array.isArray(project.stack) ? project.stack : [];

    card.innerHTML = `
      <div class="project-card-head">
        <span class="project-card-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="project-card-category">${escapeHtml(project.category || "Project")}</span>
      </div>

      <h3>${escapeHtml(project.title || "Project")}</h3>

      <p class="project-desc">${escapeHtml(project.description || "")}</p>

      <div class="project-stack">
        ${stack
          .slice(0, 4)
          .map((item) => `<span class="stack-badge">${escapeHtml(item)}</span>`)
          .join("")}
      </div>

      <button
        type="button"
        class="project-open"
        aria-label="View case study for ${escapeHtml(project.title || "project")}" 
      >
        <span>View case study</span>
        <span class="project-open-arrow" aria-hidden="true">→</span>
      </button>
    `;

    // Clicking the card
    card.addEventListener("click", (event) => {
      if (event.target.closest(".project-open")) {
        return;
      }

      openModal(index);
    });

    // Clicking the button
    const openButton = card.querySelector(".project-open");

    openButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openModal(index);
    });

    grid.appendChild(card);
  });
}

/* =========================================================
   CTA BUTTONS
   ========================================================= */

function setupCTAButtons() {
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const section = Number(button.dataset.section);

      if (Number.isInteger(section)) {
        goToSection(section);
      }
    });
  });
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const section = Number(link.dataset.section);

      if (Number.isInteger(section)) {
        goToSection(section);
      }
    });
  });

  document.querySelectorAll(".indicator").forEach((indicator) => {
    indicator.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const section = Number(indicator.dataset.section);

      if (Number.isInteger(section)) {
        goToSection(section);
      }
    });
  });
}

function goToSection(section, immediate = false, fromIntroTour = false) {
  section = Math.max(0, Math.min(SECTION_COUNT - 1, Number(section)));

  if (introTourActive && !fromIntroTour) finishIntroTour();

  targetSection = section;

  if (document.body.classList.contains("portfolio-static-mode")) {
    updateNavigation(section);
    document.querySelectorAll(".overlay-section")[section]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    return;
  }

  if (immediate && camera) {
    camera.position.set(
      CAMERA_ZONES[section].x,
      CAMERA_ZONES[section].y,
      CAMERA_ZONES[section].z,
    );
  }

  updateNavigation(section);

}

function updateNavigation(section) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", Number(link.dataset.section) === section);
  });

  document.querySelectorAll(".indicator").forEach((indicator) => {
    indicator.classList.toggle(
      "active",
      Number(indicator.dataset.section) === section,
    );
  });

  document.querySelectorAll(".overlay-section").forEach((overlay, index) => {
    const wasActive = overlay.classList.contains("active");
    overlay.classList.toggle("active", index === section);
    if (index === section && !wasActive) overlay.scrollTop = 0;
  });
}

function canScrollOverlay(eventTarget, direction) {
  const overlay = eventTarget?.closest?.(".overlay-section.active");
  if (!overlay || overlay.scrollHeight <= overlay.clientHeight + 2) return false;
  return direction > 0
    ? overlay.scrollTop + overlay.clientHeight < overlay.scrollHeight - 2
    : overlay.scrollTop > 2;
}

/* =========================================================
   CANVAS INTERACTION
   ========================================================= */

function setupCanvasInteraction() {
  const canvas = renderer.domElement;

  canvas.addEventListener("pointerdown", (event) => {
    if (modalOpen) {
      return;
    }

    isDragging = true;
    didDrag = false;

    dragStartX = event.clientX;

    dragStartY = event.clientY;

    dragLastX = event.clientX;

    dragLastY = event.clientY;

    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;

    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!isDragging || modalOpen) {
      return;
    }

    const deltaX = event.clientX - dragLastX;

    const deltaY = event.clientY - dragLastY;

    const totalX = event.clientX - dragStartX;

    const totalY = event.clientY - dragStartY;

    if (Math.abs(totalX) > 6 || Math.abs(totalY) > 6) {
      didDrag = true;
    }

    dragLastX = event.clientX;

    dragLastY = event.clientY;

    targetRotationY += deltaX * 0.0025;

    targetRotationX += deltaY * 0.0018;

    targetRotationX = THREE.MathUtils.clamp(targetRotationX, -0.35, 0.35);
  });

  canvas.addEventListener("pointerup", (event) => {
    isDragging = false;

    canvas.releasePointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    isDragging = false;
    didDrag = false;
  });

  canvas.addEventListener("click", (event) => {
    if (modalOpen) {
      return;
    }

    /*
     * If the user dragged the world,
     * this click is NOT a project click.
     */

    if (didDrag) {
      didDrag = false;
      return;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;

    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    /*
     * Recursive raycast:
     * checks every child inside
     * every project bay.
     */

    const intersections = raycaster.intersectObjects(projectObjects, true);

    if (!intersections.length) {
      return;
    }

    for (const hit of intersections) {
      const projectIndex = findProjectIndex(hit.object);

      if (projectIndex !== null) {
        openModal(projectIndex);

        return;
      }
    }
  });
}

/* =========================================================
   FIND PROJECT INDEX
   ========================================================= */

function findProjectIndex(object) {
  let current = object;

  while (current) {
    if (current.userData && Number.isInteger(current.userData.projectIndex)) {
      return current.userData.projectIndex;
    }

    current = current.parent;
  }

  return null;
}

/* =========================================================
   TOUCH
   ========================================================= */

function setupTouchNavigation() {
  window.addEventListener(
    "touchstart",
    (event) => {
      if (!event.touches.length || modalOpen) {
        return;
      }

      touchStartX = event.touches[0].clientX;

      touchStartY = event.touches[0].clientY;
    },
    {
      passive: true,
    },
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches.length || modalOpen) {
        return;
      }

      const touch = event.changedTouches[0];

      const deltaX = touch.clientX - touchStartX;

      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
        return;
      }

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (scrollCooldown) {
          return;
        }

        const direction = deltaY < 0 ? 1 : -1;

        if (canScrollOverlay(event.target, direction)) return;

        goToSection(targetSection + direction);

        scrollCooldown = true;

        setTimeout(() => {
          scrollCooldown = false;
        }, 650);
      } else {
        targetRotationY += deltaX * 0.003;
      }
    },
    {
      passive: true,
    },
  );

  window.addEventListener(
    "wheel",
    (event) => {
      if (modalOpen || scrollCooldown) {
        return;
      }

      if (Math.abs(event.deltaY) < 10) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (canScrollOverlay(event.target, direction)) return;

      const next = targetSection + direction;

      if (next < 0 || next >= SECTION_COUNT) {
        return;
      }

      goToSection(next);

      scrollCooldown = true;

      setTimeout(() => {
        scrollCooldown = false;
      }, 650);
    },
    {
      passive: true,
    },
  );
}

/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboardNavigation() {
  window.addEventListener("keydown", (event) => {
    if (modalOpen) {
      if (event.key === "Escape") {
        closeModal();
      }

      return;
    }

    if (event.target.matches("input, textarea, select")) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      const overlay = document.querySelector(".overlay-section.active");
      if (overlay && canScrollOverlay(overlay, 1)) {
        event.preventDefault();
        overlay.scrollBy({
          top: event.key === "PageDown" ? overlay.clientHeight * 0.8 : 80,
          behavior: reducedMotion ? "auto" : "smooth",
        });
        return;
      }

      event.preventDefault();

      goToSection(targetSection + 1);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      const overlay = document.querySelector(".overlay-section.active");
      if (overlay && canScrollOverlay(overlay, -1)) {
        event.preventDefault();
        overlay.scrollBy({
          top: event.key === "PageUp" ? -overlay.clientHeight * 0.8 : -80,
          behavior: reducedMotion ? "auto" : "smooth",
        });
        return;
      }

      event.preventDefault();

      goToSection(targetSection - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();

      goToSection(0);
    }

    if (event.key === "End") {
      event.preventDefault();

      goToSection(SECTION_COUNT - 1);
    }

    if (event.key === "Escape") {
      closeModal();
    }
  });
}

/* =========================================================
   MODAL
   ========================================================= */

function setupModal() {
  const modal = document.getElementById("project-modal");

  if (!modal) {
    return;
  }

  modal
    .querySelectorAll("[data-modal-close], .modal-close")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        closeModal();
      });
    });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function openModal(index) {
  const project = projects[index];

  if (!project) {
    return;
  }

  const modal = document.getElementById("project-modal");

  if (!modal) {
    return;
  }

  modalOpen = true;

  setText("modal-category", project.category || "PROJECT");

  setText("modal-title", project.title || "Project");

  setText("modal-description", project.description || "");

  const stackContainer = document.getElementById("modal-stack");

  if (stackContainer) {
    stackContainer.innerHTML = "";

    const stack = Array.isArray(project.stack) ? project.stack : [];

    stack.forEach((item) => {
      const tag = document.createElement("span");

      tag.textContent = item;

      stackContainer.appendChild(tag);
    });
  }

  const caseStudy = project.caseStudy || {};

  setText("modal-problem", caseStudy.problem || "");

  setText("modal-solution", caseStudy.solution || "");

  setText("modal-architecture", caseStudy.architecture || "");

  const highlights = document.getElementById("modal-highlights");

  if (highlights) {
    highlights.innerHTML = "";

    const list = Array.isArray(project.highlights) ? project.highlights : [];

    list.forEach((item) => {
      const li = document.createElement("li");

      li.textContent = item;

      highlights.appendChild(li);
    });
  }

  setupProjectLinks(project);

  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function buildCaseStudyText(caseStudy) {
  const parts = [];

  if (caseStudy.backend) {
    parts.push(`Backend: ${caseStudy.backend}`);
  }

  if (caseStudy.frontend) {
    parts.push(`Frontend: ${caseStudy.frontend}`);
  }

  if (caseStudy.ai || caseStudy.AI) {
    parts.push(`AI: ${caseStudy.ai || caseStudy.AI}`);
  }

  if (caseStudy.workflow) {
    parts.push(`Workflow: ${caseStudy.workflow}`);
  }

  if (caseStudy.outcome) {
    parts.push(`Outcome: ${caseStudy.outcome}`);
  }

  if (caseStudy.validation) {
    parts.push(`Validation: ${caseStudy.validation}`);
  }

  return parts.join("\n\n");
}

function setupProjectLinks(project) {
  const github = document.getElementById("modal-github");

  const live = document.getElementById("modal-live");

  if (github) {
    let url = null;

    if (typeof project.github === "string") {
      url = project.github;
    } else if (project.github) {
      url =
        project.github.repository ||
        project.github.backend ||
        project.github.frontend ||
        null;
    }

    if (url) {
      github.href = url;
      github.target = "_blank";
      github.rel = "noopener noreferrer";

      github.style.display = "";
    } else {
      github.removeAttribute("href");

      github.style.display = "none";
    }
  }

  if (live) {
    if (project.liveUrl) {
      live.href = project.liveUrl;

      live.target = "_blank";

      live.rel = "noopener noreferrer";

      live.style.display = "";
    } else {
      live.removeAttribute("href");

      live.style.display = "none";
    }
  }
}

function closeModal() {
  const modal = document.getElementById("project-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  modalOpen = false;
}

/* =========================================================
   SOUND
   ========================================================= */

function setupSound() {
  backgroundMusic = document.getElementById("background-music");
  if (!backgroundMusic) return;
  backgroundMusic.loop = true;
  // Fetch during the loading screen so playback can begin immediately when
  // the loader exits (including after a page refresh).
  backgroundMusic.preload = "auto";
  backgroundMusic.playsInline = true;
  backgroundMusic.volume = 0;
  backgroundMusic.load();

  const beginMusic = async () => {
    if (soundEnabled) return;
    try {
      await backgroundMusic.play();
      soundEnabled = true;
      // Fade in gently so the music stays part of the atmosphere.
      const targetVolume = 0.05;
      const fadeSteps = 20;
      let currentStep = 0;
      const fadeTimer = window.setInterval(() => {
        currentStep += 1;
        if (!backgroundMusic) {
          window.clearInterval(fadeTimer);
          return;
        }
        backgroundMusic.volume = Math.min(targetVolume, targetVolume * currentStep / fadeSteps);
        if (currentStep >= fadeSteps) window.clearInterval(fadeTimer);
      }, 100);
      window.removeEventListener("pointerdown", beginMusic);
      window.removeEventListener("keydown", beginMusic);
      window.removeEventListener("wheel", beginMusic);
      window.removeEventListener("touchstart", beginMusic);
    } catch (error) {
      // Autoplay can be blocked until the visitor interacts with the page.
      console.info("Background music awaits a user gesture:", error?.name || error);
    }
  };

  const startAfterLoader = () => {
    // Start as soon as the loading screen has finished, then keep a gesture
    // fallback for browsers that reject audible autoplay.
    beginMusic();
    window.addEventListener("pointerdown", beginMusic, { passive: true });
    window.addEventListener("keydown", beginMusic);
    window.addEventListener("wheel", beginMusic, { passive: true });
    window.addEventListener("touchstart", beginMusic, { passive: true });
  };
  window.addEventListener("portfolio:ready", startAfterLoader, { once: true });
}

function setupIntroTour() {
  window.addEventListener("portfolio:ready", startIntroTour, { once: true });
}

function startIntroTour() {
  if (reducedMotion) return;

  introTourActive = true;
  introTourSkipHandler = () => finishIntroTour();
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, introTourSkipHandler, { passive: true });
  });

  const route = [1, 2, 3, 4, 0];
  let step = 0;
  const visitNextSection = () => {
    if (!introTourActive) return;
    if (step >= route.length) {
      finishIntroTour();
      return;
    }

    goToSection(route[step], false, true);
    step += 1;
    introTourTimer = window.setTimeout(visitNextSection, 2600);
  };

  // Give visitors a moment to see the hero before the guided camera tour.
  introTourTimer = window.setTimeout(visitNextSection, 1900);
}

function finishIntroTour() {
  if (introTourTimer !== null) {
    window.clearTimeout(introTourTimer);
    introTourTimer = null;
  }
  introTourActive = false;
  if (introTourSkipHandler) {
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) => {
      window.removeEventListener(eventName, introTourSkipHandler);
    });
    introTourSkipHandler = null;
  }
}

/* =========================================================
   REDUCED MOTION
   ========================================================= */

function setupReducedMotion() {
  const button = document.getElementById("reduced-motion-toggle");

  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!button) {
    return;
  }

  button.classList.toggle("active", reducedMotion);

  button.setAttribute("aria-pressed", String(reducedMotion));

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    reducedMotion = !reducedMotion;

    if (reducedMotion) finishIntroTour();

    button.classList.toggle("active", reducedMotion);

    button.setAttribute("aria-pressed", String(reducedMotion));
  });
}

/* =========================================================
   ANIMATION
   ========================================================= */

function animate(frameTime = 0) {
  try {
    if (frameTime - lastFrameTime < 1000 / 60) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = frameTime;

  const elapsed = clock.getElapsedTime();

  const zone = CAMERA_ZONES[targetSection];

  const cameraSpeed = reducedMotion ? 0.12 : 0.045;

  camera.position.x += (zone.x - camera.position.x) * cameraSpeed;

  camera.position.y += (zone.y - camera.position.y) * cameraSpeed;

  camera.position.z += (zone.z - camera.position.z) * cameraSpeed;

  if (!reducedMotion) {
    worldRotationX += (targetRotationX - worldRotationX) * 0.06;

    worldRotationY += (targetRotationY - worldRotationY) * 0.06;
  } else {
    worldRotationX = 0;
    worldRotationY = 0;
  }

  world.rotation.x = worldRotationX * 0.35;

  world.rotation.y = worldRotationY * 0.35;

  heroWorld.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.2) * 0.025;

  heroWorld.traverse((object) => {
    if (object.userData && object.userData.heroCore) {
      const scale = 1 + Math.sin(elapsed * 1.4) * 0.025;

      object.scale.setScalar(scale);
    }
  });

  aboutWorld.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.15) * 0.035;

  skillsWorld.traverse((object) => {
    if (object.userData && object.userData.skillsCore) {
      object.rotation.x = reducedMotion ? 0 : elapsed * 0.18;

      object.rotation.y = reducedMotion ? 0 : elapsed * 0.25;
    }
  });

  projectObjects.forEach((object, index) => {
    if (!reducedMotion) {
      object.rotation.y = Math.sin(elapsed * 0.35 + index) * 0.025;
    }
  });

  contactWorld.rotation.y = reducedMotion
    ? 0
    : Math.sin(elapsed * 0.18) * 0.025;

  if (!reducedMotion) {
    backgroundWorld.rotation.y = elapsed * 0.004;
  }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  } catch (error) {
    activateStaticPortfolio(error);
  }
}

/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener("resize", () => {
  if (!camera || !renderer) {
    return;
  }

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.pixelRatio));
});

/* =========================================================
   MODAL / LOADER HELPERS
   ========================================================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  element.textContent = value ?? "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hideLoader() {
  const loader = document.getElementById("loader");

  if (!loader) {
    return;
  }

  setTimeout(() => {
    loader.classList.add("hidden");
    window.dispatchEvent(new Event("portfolio:ready"));
  }, 900);
}
/* =========================================================
   START
   ========================================================= */

init();
