import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageHeroProps {
    badge?: React.ReactNode;
    title: string;
    description?: string;
    children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ badge, title, description, children }) => {
    const reduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: reduceMotion ? 0 : 0.6,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: reduceMotion ? 0 : 0.08,
            },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] },
        },
    } as const;

    return (
        <section className="relative flex flex-col justify-center items-stretch overflow-hidden min-h-[400px] md:min-h-[480px] w-full py-12 md:py-20 bg-gradient-to-b from-[#050816] via-[#111827] to-black">
            {/* Background Video */}
            <video
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                src="https://cdn.builder.io/o/assets%2F5497bee253214f7fa692ffe091e0dd84%2F6c5c5a542df34a01aef07c1166da96ca?alt=media&token=5908eed9-593c-4e36-9c97-3e4bfaa5dfb3&apiKey=5497bee253214f7fa692ffe091e0dd84"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" aria-hidden="true" />

            <motion.div
                className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8 text-white items-start text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div className="flex-1 space-y-4 max-w-2xl">
                        {badge && (
                            <motion.div variants={itemVariants}>
                                {typeof badge === 'string' ? (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(15,23,42,0.65)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[rgba(249,250,251,0.88)] backdrop-blur-sm border border-white/10">
                                        {badge}
                                    </span>
                                ) : (
                                    badge
                                )}
                            </motion.div>
                        )}

                        <motion.h1
                            variants={itemVariants}
                            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
                        >
                            {title}
                        </motion.h1>

                        {description && (
                            <motion.p
                                variants={itemVariants}
                                className="max-w-xl text-sm sm:text-base text-white/75 leading-relaxed"
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>

                    {children && (
                        <motion.div variants={itemVariants} className="w-full md:w-auto">
                            {children}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default PageHero;
