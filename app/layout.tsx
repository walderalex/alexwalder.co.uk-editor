import type { Metadata } from "next";
import "./globals.css";
import Fluent from "./Fluent";
import ThemeModeControl from "./ThemeMode";
import NewProject from "./NewButton";

export const metadata: Metadata = {
  title: "Markdown Editor (alexwalder.co.uk)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Fluent>
          <div
            className="h-full grid"
            style={{ gridTemplateRows: "auto minmax(0,1fr) auto" }}
          >
            <header className="flex justify-between p-4">
              <div className="flex gap-4 items-center">
                <h1>
                  <a href="/">Alex Walder | Content Editor</a>
                </h1>
                <NewProject />
              </div>
              <div className="flex-1"></div>
              <ThemeModeControl />
            </header>
            {children}
            <footer></footer>
          </div>
        </Fluent>
      </body>
    </html>
  );
}
