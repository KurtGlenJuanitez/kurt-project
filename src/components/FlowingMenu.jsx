import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import './FlowingMenu.css';

function buildScrollbarVars(scrollbar = {}) {
  const {
    size = 14,
    radius = 999,
    gap = 2,
    trackColor = 'rgba(20, 20, 24, 0.46)',
    thumbColor = 'rgba(183, 110, 121, 0.62)',
    thumbHoverColor = 'rgba(212, 165, 172, 0.9)',
  } = scrollbar;

  return {
    '--flow-scrollbar-size': `${size}px`,
    '--flow-scrollbar-radius': `${radius}px`,
    '--flow-scrollbar-gap': `${gap}px`,
    '--flow-scrollbar-track': trackColor,
    '--flow-scrollbar-thumb': thumbColor,
    '--flow-scrollbar-thumb-hover': thumbHoverColor,
  };
}

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = 'var(--color-rose-gold-light)',
  bgColor = 'transparent',
  marqueeBgColor = 'rgba(183, 110, 121, 0.18)',
  marqueeTextColor = 'var(--color-rose-gold-light)',
  borderColor = 'rgba(183, 110, 121, 0.25)',
  scrollbar,
  activeId,
  onItemSelect,
}) {
  const wrapperStyle = useMemo(
    () => ({
      backgroundColor: bgColor,
      ...buildScrollbarVars(scrollbar),
    }),
    [bgColor, scrollbar],
  );

  return (
    <div className="menu-wrap" style={wrapperStyle}>
      <nav className="menu" role="tablist" aria-label="Memories by month">
        {items.map((item, index) => (
          <MenuItem
            key={item.monthId}
            {...item}
            index={index + 1}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isActive={activeId === item.monthId}
            onSelect={onItemSelect}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  tabId,
  link,
  text,
  image,
  monthId,
  index,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isActive,
  onSelect,
}) {
  const itemRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const rafRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);
  const [partWidth, setPartWidth] = useState(0);

  // Consolidated marquee animation state into a single object to reduce re-renders
  const [marqueeState, setMarqueeState] = useState({
    marqueeY: 101,
    innerY: -101,
    transitionsEnabled: false,
    isMarqueeRunning: false,
    isMarqueeVisible: false,
  });

  const transitionStyle = useMemo(
    () => (marqueeState.transitionsEnabled ? 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)' : 'none'),
    [marqueeState.transitionsEnabled],
  );

  const findClosestEdge = useCallback((mouseX, mouseY, width, height) => {
    const topDist = mouseX - width / 2;
    const topDistSq = topDist * topDist + mouseY * mouseY;
    const botDist = mouseY - height;
    const botDistSq = topDist * topDist + botDist * botDist;
    return topDistSq < botDistSq ? 'top' : 'bottom';
  }, []);

  useEffect(() => {
    let resizeTimer = null;
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;

      setPartWidth(contentWidth);
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();

    const throttledResize = () => {
      if (resizeTimer) return;
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        calculateRepetitions();
      }, 200);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [text, image]);

  useEffect(() => () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  const clearAnimationTimers = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const animateIn = useCallback((edge) => {
    clearAnimationTimers();
    const startOuter = edge === 'top' ? -101 : 101;
    const startInner = edge === 'top' ? 101 : -101;

    // First: position offscreen without transitions
    setMarqueeState({
      transitionsEnabled: false,
      marqueeY: startOuter,
      innerY: startInner,
      isMarqueeVisible: true,
      isMarqueeRunning: true,
    });

    // Then: animate to center with transitions (double RAF for browser to flush styles)
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setMarqueeState({
          transitionsEnabled: true,
          marqueeY: 0,
          innerY: 0,
          isMarqueeVisible: true,
          isMarqueeRunning: true,
        });
      });
    });
  }, [clearAnimationTimers]);

  const animateOut = useCallback((edge) => {
    clearAnimationTimers();
    const endOuter = edge === 'top' ? -101 : 101;
    const endInner = edge === 'top' ? 101 : -101;

    setMarqueeState({
      transitionsEnabled: true,
      marqueeY: endOuter,
      innerY: endInner,
      isMarqueeVisible: true,
      isMarqueeRunning: false,
    });

    hideTimeoutRef.current = setTimeout(() => {
      setMarqueeState((prev) => ({ ...prev, isMarqueeVisible: false }));
    }, 650);
  }, [clearAnimationTimers]);

  const handleMouseEnter = (ev) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    animateIn(edge);
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    animateOut(edge);
  };

  const handleClick = (ev) => {
    ev.preventDefault();
    onSelect?.(monthId);
  };

  return (
    <div
      className={`menu__item ${isActive ? 'menu__item--active' : ''}`}
      ref={itemRef}
      style={{ borderColor }}
      role="presentation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Faint row index */}
      <span className="menu__item-index">{String(index).padStart(2, '0')}</span>

      <a
        className={`menu__item-link ${isActive ? 'menu__item-link--active' : ''}`}
        href={link}
        onClick={handleClick}
        onFocus={() => animateIn('top')}
        onBlur={() => animateOut('bottom')}
        style={{ color: textColor }}
        role="tab"
        aria-selected={isActive}
        aria-controls={tabId}
        id={`menu-${tabId}`}
      >
        {text}
      </a>

      {/* Small thumbnail preview circle */}
      {image && <div className="menu__item-thumb" style={{ backgroundImage: `url(${image})` }} />}
      <div
        className={`marquee ${marqueeState.isMarqueeVisible ? 'marquee--visible' : ''}`}
        style={{
          backgroundColor: marqueeBgColor,
          transform: `translate3d(0, ${marqueeState.marqueeY}%, 0)`,
          transition: transitionStyle,
        }}
      >
        <div className="marquee__inner-wrap">
          <div
            className="marquee__inner"
            ref={marqueeInnerRef}
            aria-hidden="true"
            style={{
              transform: `translate3d(0, ${marqueeState.innerY}%, 0)`,
              transition: transitionStyle,
            }}
          >
            <div
              className={`marquee__track ${marqueeState.isMarqueeRunning ? 'marquee__track--running' : ''}`}
              style={{
                animationDuration: `${speed}s`,
                '--flow-width': `${partWidth}px`,
              }}
            >
              {[...Array(repetitions)].map((_, idx) => (
                <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                  <span>{text}</span>
                  <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
