'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

interface HoloTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Holographic-styled tooltip using Radix UI. Neon border, dark panel.
 */
export default function HoloTooltip({ content, children, side = 'top' }: HoloTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            sideOffset={6}
            className="modal-panel rounded-lg px-3 py-2 text-sm text-slate-200 shadow-[0_0_20px_rgba(0,255,255,0.15)] max-w-xs z-[9999]"
            style={{ border: '1px solid rgba(0,255,255,0.3)' }}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
