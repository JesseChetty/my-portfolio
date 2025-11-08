// src/components/gitlantis/MiniMap.tsx
import { useGitlantisStore } from '../../hooks/useGitlantisStore';

interface MiniMapProps {}

export const MiniMap = ({}: MiniMapProps) => {
  const boatPosition = useGitlantisStore((state) => state.boatPosition);
  const projects = useGitlantisStore((state) => state.projects);
  const skills = useGitlantisStore((state) => state.skills);

  const scale = 2;        // scale factor for minimap
  const mapSize = 300;    // bigger map

  return (
    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
      <h3 className="text-sm font-semibold text-foreground mb-2 text-center">Navigation</h3>

      <div
        className="relative bg-blue-200/50 rounded border"
        style={{ width: mapSize, height: mapSize }}
      >
        {/* Center crosshairs */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/50" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-border/50" />

        {/* N S E W letters */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-foreground">N</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-bold text-foreground">S</div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-xs font-bold text-foreground">E</div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-foreground">W</div>


{/* Boat */}
<div
  className="absolute w-2 h-2 bg-red-500 rounded-full"
  style={{
    left: `${50 - boatPosition[0] / scale}%`, // flipped
    top: `${50 - boatPosition[2] / scale}%`,
    transform: 'translate(-50%, -50%)',
  }}
/>

{/* Lighthouses */}
{projects.map((project) => (
  <div
    key={project.id}
    className="absolute w-2 h-2 bg-yellow-500 rounded"
    style={{
      left: `${50 - project.position[0] / scale}%`, // flipped
      top: `${50 - project.position[2] / scale}%`,
      transform: 'translate(-50%, -50%)',
    }}
    title={project.title}
  />
))}

{/* Skill buoys */}
{skills.map((skill) => (
  <div
    key={skill.name}
    className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full"
    style={{
      left: `${50 - skill.position[0] / scale}%`, // flipped
      top: `${50 - skill.position[2] / scale}%`,
      transform: 'translate(-50%, -50%)',
    }}
    title={skill.name}
  />
))}

      </div>

      {/* Legend */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>You</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded" />
            <span>Projects</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
};
