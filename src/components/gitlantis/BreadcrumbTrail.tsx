import { Button } from '../ui/button';
import { ChevronRight, Home, X } from 'lucide-react';
import { useGitlantisStore } from '../../hooks/useGitlantisStore';
import { useState, useEffect } from 'react';

interface BreadcrumbTrailProps {
  selectedProject: any | null;
}

export const BreadcrumbTrail = ({ selectedProject }: BreadcrumbTrailProps) => {
  const { setSelectedProject } = useGitlantisStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEscape = () => {
    setSelectedProject(null);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const explorerElement = document.getElementById('gitlantis-explorer');
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === explorerElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEscape}
          className="p-1 h-auto"
        >
          <Home className="w-4 h-4" />
        </Button>
        
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm font-medium">Ocean Explorer</span>
        
        {selectedProject && (
          <>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm text-primary font-medium">{selectedProject.title}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEscape}
              className="p-1 h-auto ml-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground space-y-1">
        <div>
          Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">WASD</kbd> to navigate
        </div>
        <div>
          Click lighthouses to explore projects
        </div>
        <div>
          Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Scroll Wheel</kbd> & <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Right Click</kbd> to rotate camera (
          <span className="font-semibold">{isFullscreen ? 'enabled' : 'requires fullscreen'}</span>)
        </div>
        {selectedProject && (
          <div>
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> or click <X className="inline w-3 h-3" /> to return
          </div>
        )}
      </div>
    </div>
  );
};
