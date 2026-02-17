import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useImperativeHandle,
  useCallback,
  useRef,
} from 'react';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));

Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  index: i,
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const easingMap = {
  elastic: 'cubic-bezier(0.19, 1.2, 0.22, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

const CardSwap = forwardRef(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  onCardClick,
  onCardChange,
  skewAmount = 6,
  easing = 'elastic',
  children,
}, ref) => {
  const config = useMemo(() => (easing === 'elastic'
    ? {
        transitionEase: easingMap.elastic,
        durMove: 740,
      }
    : {
        transitionEase: easingMap.smooth,
        durMove: 800,
      }), [easing]);

  const childCount = Children.count(children);
  const childArr = useMemo(() => Children.toArray(children), [children]);

  // Stabilise refs: only recreate when the number of cards changes,
  // not on every parent re-render.
  const refs = useMemo(
    () => Array.from({ length: childCount }, () => React.createRef()),
    [childCount],
  );

  const order = useRef(Array.from({ length: childCount }, (_, i) => i));
  const isAnimatingRef = useRef(false);
  const settleTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Pause all <video> elements inside the card container
  const pauseAllVideos = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll('video').forEach((v) => {
      if (!v.paused) {
        v.pause();
      }
    });
  }, []);

  const placeCard = useCallback((el, slot, withTransition) => {
    if (!el) return;

    const transition = withTransition
      ? `transform ${config.durMove}ms ${config.transitionEase}, opacity 420ms ease, box-shadow 420ms ease`
      : 'none';

    const scale = slot.index === 0 ? 1.03 : 1 - Math.min(slot.index * 0.02, 0.14);
    const opacity = slot.index <= 7 ? 1 : Math.max(0.18, 1 - ((slot.index - 7) * 0.14));

    el.style.transition = transition;
    el.style.transform = `translate(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px)) translateZ(${slot.z}px) skewY(${skewAmount}deg) scale(${scale})`;
    el.style.zIndex = String(slot.zIndex);
    el.style.opacity = String(opacity);
    el.style.boxShadow = slot.index === 0
      ? '0 20px 54px rgba(0, 0, 0, 0.52), 0 0 22px rgba(183, 110, 121, 0.22)'
      : '0 14px 36px rgba(0, 0, 0, 0.42)';
    el.dataset.slot = String(slot.index);
    el.style.pointerEvents = slot.zIndex === refs.length ? 'auto' : 'none';
  }, [config.durMove, config.transitionEase, skewAmount, refs.length]);

  const layoutCards = useCallback((withTransition) => {
    const total = refs.length;
    order.current.forEach((cardIdx, slotIdx) => {
      const el = refs[cardIdx]?.current;
      const slot = makeSlot(slotIdx, cardDistance, verticalDistance, total);
      placeCard(el, slot, withTransition);
    });
  }, [refs, cardDistance, verticalDistance, placeCard]);

  const settleAnimation = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
    }, config.durMove + 120);
  }, [config.durMove]);

  const next = useCallback(() => {
    if (order.current.length < 2 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    pauseAllVideos();
    const [front, ...rest] = order.current;
    order.current = [...rest, front];
    layoutCards(true);
    settleAnimation();
    onCardChange?.(order.current[0]);
  }, [layoutCards, settleAnimation, pauseAllVideos, onCardChange]);

  const prev = useCallback(() => {
    if (order.current.length < 2 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    pauseAllVideos();
    const last = order.current[order.current.length - 1];
    const rest = order.current.slice(0, -1);
    order.current = [last, ...rest];
    layoutCards(true);
    settleAnimation();
    onCardChange?.(order.current[0]);
  }, [layoutCards, settleAnimation, pauseAllVideos, onCardChange]);

  useImperativeHandle(ref, () => ({
    next,
    prev,
  }), [next, prev]);

  // Only reset order + layout when the card count actually changes
  useEffect(() => {
    order.current = Array.from({ length: childCount }, (_, i) => i);
    layoutCards(false);
    onCardChange?.(order.current[0] ?? 0);

    return () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [childCount, layoutCards, skewAmount, easing, onCardChange]);

  const rendered = childArr.map((child, i) => (
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  ));

  return (
    <div ref={containerRef} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
});

export default CardSwap;
