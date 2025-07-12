import React from "react";

export const metadata = {
  title: "Content | Megham Garg",
  description:
    "Watch my latest YouTube videos and read my blogs on software development, freelancing, and entrepreneurship.",
  keywords: [
    "content",
    "videos",
    "blogs",
    "youtube",
    "software development",
    "freelancing",
    "entrepreneurship",
  ],
};

const content = [
  {
    title: "Watch me make and launch a software for steam, and waxpeer users",
    link: "https://www.youtube.com/embed/9HDPlMolBis?si=ovSAQRHHK3zOA14g",
  },
  {
    title: "Google Ads 101 For Complete Beginners | Lessons from My Campaigns",
    link: "https://www.youtube.com/embed/pxNkKQimdCU?si=xVM8FfwBbSNpVEw5",
  },
  {
    title:
      "Create a portfolio website using Next.js, Framer-Motion, and Three.js [Open-Source codebase]",
    link: "https://www.youtube.com/embed/naFDriFNlgw?si=hwqfd3Viy7s2nKYA",
  },
  {
    title:
      "How I Would Go from Zero to $10k in Freelance Earnings: Candid Advice and Lessons Learned",
    link: "https://www.youtube.com/embed/Gq78F4-dxXY?si=eJwjf5RNqJGaZj87",
  },
  {
    title:
      "Entrepreneurship Tales: How I Built My First SaaS Startup for Freelance Agencies",
    link: "https://www.youtube.com/embed/TI2mZL2GBo0?si=miE0jh1hiZwSA90J",
  },
];

export default function Content() {
  return (
    <main className="bg-grid-small-white/[0.4] px-4 md:px-8 lg:px-20 py-36">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Content & Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore my latest videos and insights on software development, freelancing, and entrepreneurship
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item, index) => (
            <div
              key={index}
              className="group bg-gray-50/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-gray-50/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              <p className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[3rem]">
                {item.title}
              </p>
              
              <div className="relative overflow-hidden rounded-xl">
                <iframe
                  className="w-full h-60 rounded-xl transition-transform duration-300 group-hover:scale-105"
                  src={item.link}
                  title={item.title}
                  allow="clipboard-write; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
