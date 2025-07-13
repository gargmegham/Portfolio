"use client";

import { forwardRef, useState } from "react";
import {
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandGithub,
} from "@tabler/icons-react";
import { RiScrollToBottomLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Highlight } from "@/ui/aceternity/hero-highlight";
import { PlaceholdersAndVanishInput } from "@/ui/aceternity/placeholders-and-vanish-input";
import { fetchWithNoCache } from "@/utils/api";

const Intro = forwardRef(({ scrollIndicatorHidden }, ref) => {
  const [email, setEmail] = useState("");
  const validateEmail = (email) => {
    return email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };
  const subscribe = async (email) => {
    try {
      const res = await fetchWithNoCache("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) toast.success("Subscribed to newsletter!");
      else toast.error("Failed to subscribe!");
    } catch (err) {
      toast.error("Failed to subscribe!");
    }
  };
  return (
    <AnimatePresence mode="wait">
      <motion.section
        ref={ref}
        id="about"
        initial={{
          opacity: 0,
          x: -100,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="md:text-4xl text-2xl bg-dot-white/[0.2] relative font-bold flex items-center text-teritiary-300 justify-center"
      >
        <div className="max-w-4xl mx-auto space-y-8 rounded-2xl p-4">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-gotham-bold text-teritiary-300 leading-tight">
              hi, i&apos;m <span className="text-white">megham</span>.
            </h1>
            <p className="text-xl md:text-2xl text-teritiary-400 leading-relaxed max-w-3xl">
              i build software that solves real problems — and i{" "}
              <Highlight className="text-white font-semibold">
                ship fast
              </Highlight>
              .
            </p>
          </div>

          {/* Story */}
          <div className="space-y-6 text-lg md:text-xl text-teritiary-300 leading-relaxed">
            <p>
              it started back in college, where writing code gave me a way to
              turn curiosity into real products.
              <br />i launched my first SaaS before graduating, and i&apos;ve
              been building ever since.
            </p>
            <p>
              today, i run a{" "}
              <Highlight className="text-white font-semibold">
                dev studio
              </Highlight>{" "}
              that helps startups move from idea to MVP, modernize old tech
              stacks, and bring AI-powered tools to life.
              <br />
              along the way, i also launch my own software products — tools born
              out of personal pain points, experiments, or just plain fun. some
              stick. some don&apos;t. i learn either way.
            </p>
            <p>
              i&apos;ve shipped tools used by{" "}
              <Highlight className="text-white font-semibold">
                thousands
              </Highlight>
              , led remote teams, and built platforms that make research,
              workflows, and knowledge more accessible.
            </p>
            <p className="text-teritiary-400 italic">
              some days i write code. some days i write content.
              <br />
              most days, i&apos;m building something worth sharing.
            </p>
          </div>

          {/* Social Links & Newsletter */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pt-8 border-t border-white/10">
            <div className="flex gap-4 items-center">
              <a
                href="https://www.linkedin.com/in/megham-garg/"
                target="_blank"
                aria-label="LinkedIn"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandLinkedin className="size-5" />
              </a>
              <a
                href="https://x.com/garg_megham"
                target="_blank"
                aria-label="Twitter"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandTwitter className="size-5" />
              </a>
              <a
                href="https://github.com/gargmegham"
                target="_blank"
                aria-label="GitHub"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandGithub className="size-5" />
              </a>
              <a
                href="https://youtube.com/@megham_"
                target="_blank"
                aria-label="YouTube"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandYoutube className="size-5" />
              </a>
            </div>

            <div className="flex max-w-sm w-full sm:w-auto">
              <PlaceholdersAndVanishInput
                placeholders={["Join my newsletter..."]}
                onChange={(e) => setEmail(e.target.value)}
                id="newsletter-form"
                onSubmit={async () => {
                  if (!validateEmail(email)) {
                    toast.error("Invalid email address!");
                    return;
                  }
                  subscribe(email);
                }}
              />
            </div>
          </div>
        </div>
        {!scrollIndicatorHidden && (
          <button
            aria-label="scroll-indicator"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-10 left-[50%] hidden md:block"
          >
            <RiScrollToBottomLine className="animate-pulse opacity-30 text-teritiary-400 size-8" />
          </button>
        )}
      </motion.section>
    </AnimatePresence>
  );
});

export default Intro;
