"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingElements = void 0;
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const FloatingElements = () => {
    return (<div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large floating orbs */}
      <framer_motion_1.motion.div className="floating-orb w-96 h-96 -top-48 -left-48" animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
        }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
        }}/>
      
      <framer_motion_1.motion.div className="floating-orb w-80 h-80 -bottom-40 -right-40" animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
        }} transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
        }}/>

      {/* Medium floating orbs */}
      <framer_motion_1.motion.div className="floating-orb w-64 h-64 top-1/4 right-1/4" animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            rotate: [0, 180, 360],
        }} transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
        }}/>

      {/* Small floating particles - static positions */}
      {[
            { x: '10%', y: '20%' },
            { x: '80%', y: '15%' },
            { x: '20%', y: '70%' },
            { x: '70%', y: '80%' },
            { x: '50%', y: '40%' },
            { x: '30%', y: '50%' },
        ].map((position, i) => (<framer_motion_1.motion.div key={i} className="absolute w-2 h-2 bg-patos-cream rounded-full opacity-30" style={{
                left: position.x,
                top: position.y,
            }} animate={{
                y: [0, -50, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
            }} transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
            }}/>))}

      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 opacity-50"/>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
            linear-gradient(rgba(247, 245, 242, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247, 245, 242, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px'
        }}/>
    </div>);
};
exports.FloatingElements = FloatingElements;
