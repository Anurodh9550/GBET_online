import type { ReactNode } from "react";

const PRINT_CSS = `
@page { size: A4; margin: 0; }
html, body { background: #ffffff !important; }
.brochure, .brochure * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sheet { width: 210mm; height: 297mm; break-after: page; page-break-after: always; }
.sheet:last-child { break-after: auto; page-break-after: auto; }
@media screen {
  html, body { background: #e2e8f0 !important; }
  .brochure { padding: 24px 0; }
  .sheet { margin: 0 auto 24px; box-shadow: 0 20px 50px -25px rgba(11, 31, 58, 0.45); }
}
`;

export default function BrochureLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{PRINT_CSS}</style>
      {children}
    </>
  );
}
