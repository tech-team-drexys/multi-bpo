import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { typography, spacing } from "@/lib/design-system";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  span?: string;
  postSpan?: string;
  description?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
  imageWidth?: string;
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  span,
  postSpan,
  description,
  autoPlayInterval = 3000,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <div className={`text-center ${spacing.content.lg}`}>
          <h2 className={`${typography.heading.lg} text-gray-900 mb-4`}>
            {title} <span className="text-blue-600">{span}</span>{" "}
            {postSpan && <span className="text-gray-900">{postSpan}</span>}
          </h2>
          {description && (
            <p
              className={`${typography.body.lg} text-gray-600 max-w-3xl mx-auto`}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[1fr_1.3fr] gap-6 md:gap-24 items-stretch">
          <div className="order-2 md:order-1 space-y-12 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8 cursor-pointer"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleFeatureClick(index)}
              >
                <motion.div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
                    index === currentFeature
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-300"
                  )}
                >
                  <span className="text-lg font-semibold">{index + 1}</span>
                </motion.div>

                <div className="flex-1 space-y-2">
                  <h3 className={`${typography.heading.sm} text-gray-900`}>
                    {feature.title || feature.step}
                  </h3>
                  <p className={`${typography.body.sm} text-gray-600`}>
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              `order-1 md:order-2 relative overflow-hidden rounded-lg mx-auto w-full h-[320px] md:h-[480px] lg:h-[500px]`
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.step}
                        className="h-full object-cover transition-transform transform"
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
