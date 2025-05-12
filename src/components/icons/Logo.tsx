import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="150"
    height="37.5" // Maintain aspect ratio
    role="img"
    aria-labelledby="logoTitle"
    {...props}
  >
    <title id="logoTitle">BlogCraft AI Logo</title>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <style>
      {`
        .logo-text {
          font-family: var(--font-geist-sans), sans-serif;
          font-size: 38px;
          font-weight: bold;
          fill: url(#logoGradient);
          letter-spacing: -1px;
        }
        .logo-text-ai {
          fill: hsl(var(--primary));
        }
         @media (prefers-color-scheme: dark) {
          .logo-text-ai {
             fill: hsl(var(--accent));
          }
        }
      `}
    </style>
    <text x="0" y="35" className="logo-text">
      BlogCraft
      <tspan className="logo-text-ai"> AI</tspan>
    </text>
  </svg>
);

export default Logo;
