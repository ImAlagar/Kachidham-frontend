import React from "react";
import { motion } from "framer-motion";

export default function Logo() {

    const lineX = (delay = 0) => ({
        initial: { scaleX: 0, opacity: 0 },
        animate: { scaleX: 1, opacity: 1 },
        transition: { duration: .6, delay }
    });

    const lineY = (delay = 0) => ({
        initial: { scaleY: 0, opacity: 0 },
        animate: { scaleY: 1, opacity: 1 },
        transition: { duration: .6, delay }
    });

    const letter = (delay = 0) => ({
        initial: { opacity: 0, y: 5 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: .3, delay }
    });

    return (
        <div className="flex flex-col gap-8 items-center justify-center h-[120vh] w-full bg-primary">
            <div className="relative w-48 h-64">

                {/* -------- BOTTOM LEFT SQUARE -------- */}
                <motion.div className="absolute bottom-16 left-0 w-[105px] h-3 rounded-md bg-white"
                    style={{ transformOrigin: "left" }} {...lineX(.1)} />

                <motion.div className="absolute bottom-0 left-0 w-[105px] h-3 rounded-md bg-white"
                    style={{ transformOrigin: "left" }} {...lineX(.2)} />

                <motion.div className="absolute bottom-0 left-0 w-3 h-[76px] rounded-md bg-white"
                    style={{ transformOrigin: "bottom" }} {...lineY(.3)} />

                <motion.div className="absolute bottom-0 left-24 w-3 h-[76px] rounded-md bg-white -translate-x-1/2"
                    style={{ transformOrigin: "bottom" }} {...lineY(.4)} />

                {/* -------- BOTTOM RIGHT SQUARE -------- */}
                <motion.div className="absolute bottom-16 left-24 w-24 h-3 rounded-md bg-white"
                    style={{ transformOrigin: "left" }} {...lineX(.5)} />

                <motion.div className="absolute bottom-0 rounded-l-md right-0 rounded-md w-16 h-3 bg-white"
                    style={{ transformOrigin: "right" }} {...lineX(.6)} />

                <motion.div className="absolute bottom-0 right-0 w-3 h-[76px] rounded-md bg-white"
                    style={{ transformOrigin: "bottom" }} {...lineY(.7)} />

                {/* -------- VERTICAL LINE -------- */}
                <motion.div
                    className="absolute top-14 left-24 w-3 h-32 rounded-t-md bg-white origin-bottom"
                    style={{ transform: 'translateX(-50%)', transformOrigin: "bottom" }}
                    {...lineY(.9)}
                />

                {/* -------- SLANTED LINE -------- */}
                <motion.div
                    style={{ transformOrigin: "top right" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: .6, delay: 1.1 }}
                    className="absolute top-[44px] left-16"
                >
                    <div
                        className="rounded-md w-3 h-24 bg-white rotate-[45deg]"
                        style={{ left: 'calc(50% - 4px)', position: 'relative' }}
                    />
                </motion.div>

            </div>

            {/* -------- TEXT -------- */}
            <div className="flex gap-4 text-secondary font-semibold font-josefin">
                {["K", "A", "C", "H", "I", "D", "H", "A", "M"].map((c, i) => (
                    <motion.span key={i} {...letter(1.6 + i * .12)}>
                        {c}
                    </motion.span>
                ))}
            </div>

        </div>
    );
}
