declare module 'react-vertical-timeline-component' {
  import { ReactNode } from 'react';
  export const VerticalTimeline: (props: { children?: ReactNode; lineColor?: string }) => JSX.Element;
  export const VerticalTimelineElement: (props: {
    children?: ReactNode;
    date?: string;
    dateClassName?: string;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    icon?: ReactNode;
  }) => JSX.Element;
}
