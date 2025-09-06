import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Create client with placeholder values if env vars are not set properly
const isProduction = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder_key'
export const supabase = isProduction ? createClient(supabaseUrl, supabaseAnonKey) : null

export interface WaitlistEntry {
  id?: number
  email: string
  created_at?: string
  phone?: string
  interest_level?: 'high' | 'medium' | 'low'
}

export const addToWaitlist = async (email: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // If Supabase is not properly configured, simulate success for demo purposes
    if (!supabase) {
      console.log('Demo mode: Would add to waitlist:', { email, phone })
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }

    const { error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email, 
          phone,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Network error:', error)
    return { success: false, error: 'Network error occurred' }
  }
} 