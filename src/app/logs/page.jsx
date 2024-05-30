import React from "react";
import { CardBody, CardContainer, CardItem } from "@/ui/aceternity/3d-card";

export const metadata = {
  title: "Logs | Megham Garg",
  description:
    "Watch my latest YouTube videos on software development, freelancing, and entrepreneurship.",
  keywords: [
    "logs",
    "videos",
    "youtube",
    "software development",
    "freelancing",
    "entrepreneurship",
  ],
};

const logs = [
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

export default function Logs() {
  return (
    <main className="bg-grid-small-white/[0.4] px-20 py-36 gap-8 grid md:grid-cols-2 lg:grid-cols-3">
      {logs.map((log, index) => {
        return (
          <CardContainer className="inter-var" key={index}>
            <CardBody className="bg-gray-50 relative dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[24rem] h-auto rounded-xl p-6 border">
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {log.title}
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <iframe
                  className="w-full h-60 rounded-xl"
                  src={log.link}
                  title={log.title}
                  allow="clipboard-write; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </CardItem>
            </CardBody>
          </CardContainer>
        );
      })}
    </main>
  );
}
