"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero({ predictionCount }: { predictionCount: number }) {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-16 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="text-[10.5px] text-[var(--color-text-secondary)]">
          {predictionCount} predictions made so far
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-medium text-[var(--color-text-primary)] leading-tight mb-3"
      >
        Know who wins
        <br />
        before kickoff
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
       className="text-3xl sm:text-4xl font-medium text-[var(--color-text-primary)] leading-tight mb-3"
      >
        Real match data and explainable predictions for the Premier League.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link
          href="/matches"
          className="inline-block px-5 py-2.5 rounded-[10px] text-sm text-white"
          style={{ background: "linear-gradient(145deg, var(--color-accent), var(--color-accent-deep))" }}
        >
          Explore matches
        </Link>
      </motion.div>
    </div>
  );
}