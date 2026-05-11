import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Worst Countries — Rankings on negative indicators",
    template: "%s · Worst Countries",
  },
  description:
    "Sortable country rankings on corruption, crime, debt, press freedom, gender inequality, pollution, and more. Hybrid live + snapshot data with sources.",
  metadataBase: new URL("https://worst-countries.local"),
};

// Run before hydration to avoid a theme flash. Default = light when no preference saved.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark';if(d)document.documentElement.classList.add('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased flex flex-col dark:bg-neutral-950 dark:text-neutral-100">
        <SiteHeader />
        <main className="flex-1 w-full">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
