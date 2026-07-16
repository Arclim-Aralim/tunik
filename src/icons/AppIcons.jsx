import React from "react";

function SvgIcon({ children, size = 24, ...props }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </SvgIcon>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M19 12H6" />
      <path d="m11 6-6 6 6 6" />
    </SvgIcon>
  );
}

export function BuildingIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 20.5h15" />
      <path d="M6 20.5V7.8c0-.9.7-1.6 1.6-1.6h5.8c.9 0 1.6.7 1.6 1.6v12.7" />
      <path d="M15 10.5h2.6c.8 0 1.4.6 1.4 1.4v8.6" />
      <path d="M8.8 10h3.4M8.8 13.5h3.4M8.8 17h3.4" />
      <path d="M9 6.2V3.8h3v2.4" />
    </SvgIcon>
  );
}

export function BrainIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9 4.5a3 3 0 0 0-3 3v.4A3.4 3.4 0 0 0 4 11a3.4 3.4 0 0 0 2 3.1v.4a3 3 0 0 0 3 3" />
      <path d="M15 4.5a3 3 0 0 1 3 3v.4a3.4 3.4 0 0 1 2 3.1 3.4 3.4 0 0 1-2 3.1v.4a3 3 0 0 1-3 3" />
      <path d="M12 5v14" />
      <path d="M8 9.2c1.7 0 2.4.8 2.8 2" />
      <path d="M16 9.2c-1.7 0-2.4.8-2.8 2" />
      <path d="M8.2 14.6c1.3.2 2.2-.1 2.8-.9" />
      <path d="M15.8 14.6c-1.3.2-2.2-.1-2.8-.9" />
    </SvgIcon>
  );
}

export function GamepadIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M8.4 9.5h7.2c2 0 3.7 1.4 4.1 3.4l.7 3.6c.2 1.2-.7 2.3-1.9 2.3-.6 0-1.1-.2-1.5-.7l-1.6-1.9H8.6L7 18.1c-.4.5-.9.7-1.5.7-1.2 0-2.1-1.1-1.9-2.3l.7-3.6c.4-2 2.1-3.4 4.1-3.4Z" />
      <path d="M8.2 12.4v3M6.7 13.9h3" />
      <path d="M15.8 13.1h.1M17.8 15h.1" />
    </SvgIcon>
  );
}

export function SparkIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9-5.7-1.8L10.2 9 12 3.5Z" />
      <path d="m18 4 .7 2.2L21 7l-2.3.8L18 10l-.7-2.2L15 7l2.3-.8L18 4Z" />
      <path d="m5.5 15 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" />
    </SvgIcon>
  );
}

export function NetworkIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 5.5v5" />
      <path d="M7 15.5 12 10.5l5 5" />
      <rect height="4" rx="1" width="5" x="9.5" y="3.5" />
      <rect height="4" rx="1" width="5" x="4.5" y="15.5" />
      <rect height="4" rx="1" width="5" x="14.5" y="15.5" />
    </SvgIcon>
  );
}

export function CpuIcon(props) {
  return (
    <SvgIcon {...props}>
      <rect height="10" rx="2" width="10" x="7" y="7" />
      <path d="M10 11h4v2h-4z" />
      <path d="M9 3.5v2M12 3.5v2M15 3.5v2M9 18.5v2M12 18.5v2M15 18.5v2M3.5 9h2M3.5 12h2M3.5 15h2M18.5 9h2M18.5 12h2M18.5 15h2" />
    </SvgIcon>
  );
}

export function PlaneIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20.4 4.1c.5.5.4 1.4-.3 1.8L14 10l2.4 7.2-1.6 1.6-4.1-5.6-3.5 2.2-.2 2.6-1.2 1.2-1.2-4.1-4.1-1.2 1.2-1.2 2.6-.2 2.2-3.5L.9 4.9l1.6-1.6L9.7 5.7l4.1-6.1c.4-.7 1.3-.8 1.8-.3l4.8 4.8Z" transform="translate(1.2 1.2) scale(.9)" />
    </SvgIcon>
  );
}

export function GlobeIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.5c2.3 2.3 3.4 5.1 3.4 8.5s-1.1 6.2-3.4 8.5" />
      <path d="M12 3.5c-2.3 2.3-3.4 5.1-3.4 8.5s1.1 6.2 3.4 8.5" />
    </SvgIcon>
  );
}
