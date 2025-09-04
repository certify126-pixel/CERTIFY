import * as React from "react";

export const CertiCheckLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <title>CertiCheck Logo</title>
    <path d="M15 7l-5.5 5.5a3 3 0 0 0 4.24 4.24l5.5-5.5" />
    <path d="M12 7h.01" />
    <path d="M12 17h.01" />
    <path d="M7 12h.01" />
    <path d="M17 12h.01" />
    <path d="M3.5 15.5L8.5 10.5" />
    <path d="M20.5 8.5L15.5 13.5" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
