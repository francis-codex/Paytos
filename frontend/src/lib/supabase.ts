import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface WaitlistEntry {
  id?: number
  email: string
  created_at?: string
  phone?: string
  interest_level?: 'high' | 'medium' | 'low'
}

export const addToWaitlist = async (email: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
  try {
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