// Static implementation - no external dependencies

export interface WaitlistEntry {
  id?: number
  email: string
  created_at?: string
  phone?: string
  interest_level?: 'high' | 'medium' | 'low'
}

export const addToWaitlist = async (email: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Static demo - just log and return success
    console.log('Static demo: Would add to waitlist:', { email, phone })
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return { success: true }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'An error occurred' }
  }
} 