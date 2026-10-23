import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maps for Pokécompanion",
  description:
    "Demo app for open source, PokéAPI compatible svg maps of all Pokémon Regions",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="scheme-light bg-[#f6f7f4] font-[Arial,Helvetica,sans-serif] text-[#243c36] [font-synthesis:none]"
    >
      <body className="p-4 md:p-8 [&_button]:cursor-pointer [&_select]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-40 [&_:is(button,a,select,input):focus-visible]:outline-2 [&_:is(button,a,select,input):focus-visible]:outline-offset-3 [&_:is(button,a,select,input):focus-visible]:outline-[#297f72]">
        {children}
      </body>
    </html>
  );
}
