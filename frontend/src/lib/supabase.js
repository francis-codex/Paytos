"use strict";
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
exports.addToWaitlist = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
const addToWaitlist = (email, phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = yield exports.supabase
            .from('waitlist')
            .insert([
            {
                email,
                phone,
                created_at: new Date().toISOString()
            }
        ])
            .select();
        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    catch (error) {
        console.error('Network error:', error);
        return { success: false, error: 'Network error occurred' };
    }
});
exports.addToWaitlist = addToWaitlist;
