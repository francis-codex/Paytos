"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistForm = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const supabase_1 = require("../lib/supabase");
const WaitlistForm = ({ onSuccess }) => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [phone, setPhone] = (0, react_1.useState)('');
    const [showPhone, setShowPhone] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({});
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validatePhone = (phone) => {
        if (!phone)
            return true; // Phone is optional
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setErrors({});
        // Validation
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        }
        else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (phone && !validatePhone(phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        try {
            yield (0, supabase_1.addToWaitlist)(email, phone || undefined);
            onSuccess();
            setEmail('');
            setPhone('');
            setShowPhone(false);
        }
        catch (error) {
            console.error('Error adding to waitlist:', error);
            setErrors({ email: 'Something went wrong. Please try again.' });
        }
        setIsLoading(false);
    });
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-4xl mx-auto">
      <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/10">
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Join the Waitlist</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Horizontal Input Layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Email Field */}
            <div className="flex-1">
              <div className="relative">
                <lucide_react_1.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white" disabled={isLoading}/>
              </div>
              {errors.email && (<framer_motion_1.motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                  {errors.email}
                </framer_motion_1.motion.p>)}
            </div>

            {/* Phone Field (Always visible on large screens) */}
            <div className="flex-1 lg:block hidden">
              <div className="relative">
                <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (optional)" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white" disabled={isLoading}/>
              </div>
              {errors.phone && (<framer_motion_1.motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                  {errors.phone}
                </framer_motion_1.motion.p>)}
            </div>

            {/* Submit Button - Aligned with inputs on large screens */}
            <div className="lg:w-auto w-full">
              <framer_motion_1.motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full lg:w-auto bg-gradient-to-r from-patos-cream to-yellow-300 text-slate-900 font-semibold py-3 px-6 lg:px-8 rounded-lg hover:from-patos-cream/90 hover:to-yellow-300/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                {isLoading ? (<div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"/>) : (<>
                    <span>Get Early Access</span>
                    <lucide_react_1.ArrowRight className="w-4 h-4"/>
                  </>)}
              </framer_motion_1.motion.button>
            </div>
          </div>

          {/* Phone Field (Progressive for mobile) */}
          <div className="lg:hidden">
            <framer_motion_1.motion.div initial={false} animate={{ height: showPhone ? 'auto' : 0, opacity: showPhone ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
              <div className="relative">
                <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (optional)" className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white" disabled={isLoading}/>
              </div>
              {errors.phone && (<framer_motion_1.motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                  {errors.phone}
                </framer_motion_1.motion.p>)}
            </framer_motion_1.motion.div>

            {/* Add Phone Button (Mobile only) */}
            {!showPhone && (<button type="button" onClick={() => setShowPhone(true)} className="w-full py-2 text-patos-cream hover:text-white transition-colors text-sm">
                + Add phone number (optional)
              </button>)}
          </div>
        </form>

        <p className="text-gray-400 text-xs text-center mt-4">
          Be the first to experience SMS-based crypto payments
        </p>
      </div>
    </framer_motion_1.motion.div>);
};
exports.WaitlistForm = WaitlistForm;
