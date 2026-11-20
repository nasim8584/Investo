import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface HoverFullTextProps {
  fullText: string;
  badge?: string | number;
  children: React.ReactNode;
  onlyIfTruncated?: boolean;
  className?: string;
  as?: 'div' | 'span';
}

interface TooltipCoords {
  left: number;
  top: number;
  arrowLeft: number;
  placement: 'top' | 'bottom';
}

/**
 * Displays a crisp, bold, portal-rendered tooltip with the full untruncated text
 * whenever the user hovers or focuses on a truncated option, label, or sentence.
 */
export const HoverFullText: React.FC<HoverFullTextProps> = ({
  fullText,
  badge,
  children,
  onlyIfTruncated = true,
  className = '',
  as = 'div',
}) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);

  const checkTruncationAndPosition = useCallback(() => {
    const container = triggerRef.current;
    if (!container || !fullText) return;

    if (onlyIfTruncated) {
      const candidate =
        (container.querySelector('.truncate, .line-clamp-1, .line-clamp-2, [data-truncate-target]') as HTMLElement | null) ||
        container;

      const isOverflowingWidth = candidate.scrollWidth > candidate.clientWidth;
      const isOverflowingHeight = candidate.scrollHeight > candidate.clientHeight;

      if (!isOverflowingWidth && !isOverflowingHeight) {
        setVisible(false);
        return;
      }
    }

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const viewportWidth = window.innerWidth;
    const estimatedMaxHalfWidth = 170;
    const centerX = rect.left + rect.width / 2;
    const clampedCenterX = Math.max(
      estimatedMaxHalfWidth + 12,
      Math.min(viewportWidth - estimatedMaxHalfWidth - 12, centerX)
    );

    const placement: 'top' | 'bottom' = rect.top < 84 ? 'bottom' : 'top';
    const top = placement === 'top' ? rect.top - 10 : rect.bottom + 10;
    const arrowOffset = centerX - clampedCenterX;

    setCoords({
      left: clampedCenterX,
      top,
      arrowLeft: arrowOffset,
      placement,
    });
    setVisible(true);
  }, [fullText, onlyIfTruncated]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const handleScrollOrResize = () => setVisible(false);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [visible]);

  const WrapperTag = as;

  return (
    <>
      <WrapperTag
        ref={triggerRef as any}
        onMouseEnter={checkTruncationAndPosition}
        onMouseLeave={hide}
        onFocus={checkTruncationAndPosition}
        onBlur={hide}
        className={className}
      >
        {children}
      </WrapperTag>

      {visible &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              transform:
                coords.placement === 'top'
                  ? 'translate(-50%, -100%)'
                  : 'translate(-50%, 0)',
              zIndex: 9999,
            }}
            className="pointer-events-none select-none max-w-[min(340px,calc(100vw-24px))]"
          >
            <div className="relative bg-slate-950 text-white px-3.5 py-2 rounded-xl border border-emerald-400/50 shadow-[0_16px_38px_-6px_rgba(2,6,23,0.6)] flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[13px] font-extrabold tracking-wide leading-snug text-white whitespace-normal break-words">
                {fullText}
              </span>
              {badge !== undefined && badge !== '' && (
                <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                  {badge}
                </span>
              )}
              <span
                style={{
                  left: `calc(50% + ${Math.max(-120, Math.min(120, coords.arrowLeft))}px)`,
                }}
                className={`absolute -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-slate-950 ${
                  coords.placement === 'top'
                    ? '-bottom-[6px] border-r border-b border-emerald-400/50'
                    : '-top-[6px] border-l border-t border-emerald-400/50'
                }`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
