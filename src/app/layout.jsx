import { Inter } from "next/font/google";
import "@/assets/css/globals.css";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://meghamgarg.com"),
  title: "Megham's Portfolio",
  description: "Portfolio of software projects by Megham Garg",
  applicationName: "Portfolio",
  authors: [
    {
      name: "Megham Garg",
      url: "mailto:meghamgarg@gmail.com",
    },
  ],
  keywords: [
    "portfolio",
    "software",
    "projects",
    "Megham Garg",
    "freelancer",
    "web developer",
    "AI expert",
  ],
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <Script id="clarity-script" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
      </Script>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
