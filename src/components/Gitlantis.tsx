// Gitlantis.tsx
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Ocean } from "./gitlantis/Ocean";
import { Boat } from "./gitlantis/Boat";
import { ProjectLighthouses } from "./gitlantis/ProjectLighthouses";
import { SkillBuoys } from "./gitlantis/SkillBuoys";
import { Compass } from "./gitlantis/Compass";
import { MiniMap } from "./gitlantis/MiniMap";
import { BreadcrumbTrail } from "./gitlantis/BreadcrumbTrail";
import { Loading } from "./gitlantis/Loading";
import { useGitlantisStore } from "../hooks/useGitlantisStore";
import { projectsData, skillsData } from "../data/portfolioData";
import { SEO } from "./SEO";

interface GitlantisProps {
  onProjectSelect: (project: any) => void;
}

function ResizeOnMount() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setSize(window.innerWidth, window.innerHeight);
  }, [gl]);
  return null;
}

export const Gitlantis = ({ onProjectSelect }: GitlantisProps) => {
  const { selectedProject, boatPosition, hasMoved } = useGitlantisStore();
  const setHasMoved = useGitlantisStore((state) => state.setHasMoved);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExplorer, setShowExplorer] = useState(true);
  const [orbitEnabled, setOrbitEnabled] = useState(false);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [lookDismissed, setLookDismissed] = useState(false);

  const [showWASD, setShowWASD] = useState(true);
  const [showLook, setShowLook] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);

  // Handles normal fullscreen toggle
  const handleFullscreen = () => {
    const explorerElement = document.getElementById("gitlantis-explorer");
    if (!explorerElement) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else explorerElement.requestFullscreen();
  };

  // Automatically request fullscreen when opening the explorer
  const handleExplorerToggle = () => {
    const explorerElement = document.getElementById("gitlantis-explorer");
    if (explorerElement && !document.fullscreenElement) {
      explorerElement.requestFullscreen();
    }
    setShowExplorer((prev) => !prev);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (document.fullscreenElement) setShowFullscreenPrompt(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", handleContextMenu);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Detect first WASD input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ["KeyW", "KeyA", "KeyS", "KeyD"];
      if (keys.includes(e.code)) {
        setHasMoved(true);
        setShowWASD(false);
        if (!lookDismissed) {
          setTimeout(() => setShowLook(true), 500);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setHasMoved, lookDismissed]);

  const handleProjectClick = (project: any) => {
    setActiveProject(project);
    setOrbitEnabled(true);
    onProjectSelect(project);
    setShowLook(false);
    setLookDismissed(true);
  };

  const overlayBase = `
    absolute left-1/2 z-30 transform -translate-x-1/2
    pointer-events-auto flex flex-col items-center bg-black/90 text-white
    rounded-3xl p-10 shadow-lg border border-gray-700
    max-w-[600px] w-[80vw] text-center
    transition-all duration-500 ease-out
  `;
  const overlayVisible = "opacity-100 translate-y-0";
  const overlayHidden = "opacity-0 -translate-y-8 pointer-events-none";

  return (
    <div
      id="gitlantis-explorer"
      className="relative w-full h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-blue-500 overflow-hidden"
    >
      <SEO
        title="Portfolio Explorer - Interactive 3D Navigation"
        description="Explore my portfolio projects in an immersive 3D ocean world. Navigate through projects as lighthouses and skills as buoys."
        keywords="3D portfolio, interactive navigation, three.js, React Three Fiber, immersive experience"
        canonicalUrl="https://portfolio.dev/explore"
      />

      {/* Toggle Buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        <button
          onClick={handleExplorerToggle}
          className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-background/90 transition-colors"
        >
          {showExplorer ? "📂 Show Projects" : "🌊 Open Explorer"}
        </button>
        {showExplorer && (
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-background/90 transition-colors"
          >
            ⛶ Fullscreen
          </button>
        )}
      </div>

      {/* Folder View */}
      {!showExplorer && (
        <div className="absolute inset-0 overflow-y-auto bg-background/90 p-10 z-20">
          <h2 className="text-3xl font-bold mb-6 text-center">All Projects</h2>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="flex flex-col md:flex-row gap-4 p-4 bg-background/80 rounded-2xl shadow-lg border border-border"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full md:w-48 h-48 object-cover rounded-xl"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary">{project.title}</h3>
                  <p className="text-sm text-muted-foreground my-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/20 text-primary rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3D Scene */}
      {showExplorer && (
        <>
          <Canvas
            camera={{ position: [0, 12, 20], fov: 60 }}
            shadows
            className="absolute inset-0"
            gl={{ antialias: true, alpha: true }}
          >
            <ResizeOnMount />
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <Ocean />
              <Boat />
              <ProjectLighthouses
                projects={projectsData}
                onProjectSelect={handleProjectClick}
              />
              <SkillBuoys skills={skillsData} />
            </Suspense>
            {orbitEnabled && <OrbitControls enablePan={false} enableZoom />}
          </Canvas>

          {/* FULLSCREEN PROMPT */}
          <div
            className={`${overlayBase} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 ${
              showFullscreenPrompt ? overlayVisible : overlayHidden
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Fullscreen Recommended</h2>
            <p className="text-lg mb-6">
              For the best experience, please enter fullscreen mode.
            </p>
            <button
              onClick={handleFullscreen}
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              ⛶ Enter Fullscreen
            </button>
          </div>

          {/* Look Around Overlay */}
          <div className={`${overlayBase} bottom-32 absolute ${
            showLook ? overlayVisible : overlayHidden
          }`}>
            <h3 className="text-2xl font-bold mb-2">LOOK AROUND</h3>
            <p className="text-lg mb-4">Use your mouse to look around</p>
            <p className="text-lg">Click on lighthouses to view projects</p>
          </div>

          {/* WASD Overlay */}
          <div className={`${overlayBase} bottom-8 absolute ${
            showWASD ? overlayVisible : overlayHidden
          }`}>
            <h3 className="text-2xl font-bold mb-2">LEARN TO MOVE</h3>
            <p className="text-lg mb-4">Use WASD to move around</p>
            <div className="grid grid-rows-2 grid-cols-3 gap-4 items-center">
              <div></div>
              <div className="keycap text-3xl p-5 text-center">W</div>
              <div></div>
              <div className="keycap text-3xl p-5 text-center">A</div>
              <div className="keycap text-3xl p-5 text-center">S</div>
              <div className="keycap text-3xl p-5 text-center">D</div>
            </div>
          </div>

          {/* UI Overlays */}
          <div className="absolute top-4 right-4 z-10"><Compass boatPosition={boatPosition} /></div>
          <div className="absolute bottom-4 right-4 z-10"><MiniMap /></div>
          <div className="absolute top-4 left-4 z-10"><BreadcrumbTrail selectedProject={selectedProject} /></div>

          {/* Active project panel */}
          {activeProject && (
            <div className="absolute bottom-4 left-4 w-96 max-h-[50%] bg-background/90 backdrop-blur-md p-4 flex flex-col overflow-y-auto z-20 rounded-2xl border border-border shadow-lg">
              <div className="flex gap-4">
                {activeProject.image && (
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-32 h-32 rounded-2xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-2">{activeProject.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{activeProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {activeProject.technologies?.map((tech: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2">
                    {activeProject.github && <a href={activeProject.github} target="_blank" className="text-sm text-primary hover:text-primary/80 transition-colors">Code</a>}
                    {activeProject.live && <a href={activeProject.live} target="_blank" className="text-sm text-primary hover:text-primary/80 transition-colors">Live Demo</a>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Loading />
        </>
      )}
    </div>
  );
};
