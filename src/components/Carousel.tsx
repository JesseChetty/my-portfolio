import { useRef, useEffect } from 'react';
import { Card } from './Card';
import { windowData } from '../data/portfolioData';

interface CarouselProps {
  onCardClick: (data: any) => void;
  focusedIndex: number;
  onFocusChange: (index: number) => void;
}

export const Carousel = ({ onCardClick, focusedIndex, onFocusChange }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const isNavigatingRef = useRef(false); // programmatic scroll
  const isDraggingRef = useRef(false);   // during user swipe
  const ignoreScrollRef = useRef(false);

  const swipeStartXRef = useRef(0);
  const swipeEndXRef = useRef(0);
  const isPointerDownInsideRef = useRef(false);

  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener (only snaps after user interaction)
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      if (!isDraggingRef.current && !isNavigatingRef.current) return;

      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      snapTimeoutRef.current = setTimeout(() => {
        if (!carousel) return;

        const containerCenter = carousel.scrollLeft + carousel.clientWidth / 2;
        let nearestIndex = 0;
        let minDistance = Infinity;

        itemsRef.current.forEach((item, idx) => {
          if (!item) return;
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          const distance = Math.abs(itemCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = idx;
          }
        });

        onFocusChange(nearestIndex);
      }, 150);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [onFocusChange]);

  // Prevent drag selection / images
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const preventDrag = (e: DragEvent) => e.preventDefault();
    carousel.addEventListener('dragstart', preventDrag);
    return () => carousel.removeEventListener('dragstart', preventDrag);
  }, []);

  // Programmatic scroll (Navbar click)
  const scrollToCard = (index: number) => {
    const item = itemsRef.current[index];
    const carousel = carouselRef.current;
    if (!item || !carousel) return;

    isNavigatingRef.current = true;
    item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 600);
  };

  useEffect(() => {
    scrollToCard(focusedIndex);
  }, [focusedIndex]);

  // Drag / swipe handling
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only track if pointer starts inside carousel
      isPointerDownInsideRef.current = true;
      swipeStartXRef.current = e.clientX;
      isDraggingRef.current = false;
      ignoreScrollRef.current = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownInsideRef.current) return;

      const diff = e.clientX - swipeStartXRef.current;
      if (Math.abs(diff) > 5) {
        isDraggingRef.current = true;
        swipeEndXRef.current = e.clientX;
      }
    };

    const onPointerUp = () => {
      if (!isPointerDownInsideRef.current) return;

      if (isDraggingRef.current) {
        const diff = swipeEndXRef.current - swipeStartXRef.current;

        if (diff < -30) {
          const nextIndex = Math.min(focusedIndex + 1, windowData.length - 1);
          scrollToCard(nextIndex);
          onFocusChange(nextIndex);
        } else if (diff > 30) {
          const prevIndex = Math.max(focusedIndex - 1, 0);
          scrollToCard(prevIndex);
          onFocusChange(prevIndex);
        }
      }

      isDraggingRef.current = false;
      isPointerDownInsideRef.current = false;
      swipeStartXRef.current = 0;
      swipeEndXRef.current = 0;

      setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 100);
    };

    const onClick = (e: MouseEvent) => {
      if (isDraggingRef.current) e.preventDefault(); // prevent accidental click
    };

    carousel.addEventListener('pointerdown', onPointerDown);
    carousel.addEventListener('pointermove', onPointerMove);
    carousel.addEventListener('pointerup', onPointerUp);
    carousel.addEventListener('pointerleave', onPointerUp);
    carousel.addEventListener('click', onClick, true);

    return () => {
      carousel.removeEventListener('pointerdown', onPointerDown);
      carousel.removeEventListener('pointermove', onPointerMove);
      carousel.removeEventListener('pointerup', onPointerUp);
      carousel.removeEventListener('pointerleave', onPointerUp);
      carousel.removeEventListener('click', onClick, true);
    };
  }, [focusedIndex, onFocusChange]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        ref={carouselRef}
        className="carousel-snap flex h-full overflow-x-auto overflow-y-hidden scrollbar-hide pl-[10vw] pr-[10vw] select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {windowData.map((data, index) => (
          <div
            key={data.id}
            ref={(el) => { if (el) itemsRef.current[index] = el; }}
            className="carousel-item flex-shrink-0 w-[80vw] h-full flex items-center justify-center select-none"
          >
            <Card
              data={data}
              isFocused={index === focusedIndex}
              onClick={() => onCardClick(data)}
            />
          </div>
        ))}
      </div>

      {/* Navigation indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {windowData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollToCard(index);
              onFocusChange(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === focusedIndex
                ? 'bg-primary shadow-glow'
                : 'bg-muted hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
