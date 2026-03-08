import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const PageHero = ({ title, subtitle, children }: PageHeroProps) => {
  return (
    <section className="bg-secondary pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-secondary-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-lg md:text-xl text-secondary-foreground/80 leading-relaxed">
              {subtitle}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
