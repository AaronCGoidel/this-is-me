"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerate = ({
  words,
  className,
  onComplete,
}: {
  words: string;
  className?: string;
  onComplete?: () => void;
}) => {
  const [done, setDone] = useState(false);
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    const animateWords = async () => {
      await animate(
        "span",
        {
          opacity: 1,
        },
        {
          duration: 1.2,
          delay: stagger(0.1),
        }
      );
      onComplete && onComplete();
    };

    animateWords();
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span key={word + idx} className="opacity-0">
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className={`text-2xl leading-snug tracking-wide ${done && ""}`}>
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
