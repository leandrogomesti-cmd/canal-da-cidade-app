// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://yckouwzjejhqwpmbdbkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlja291d3pqZWpocXdwbWJkYmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MDk3NDYsImV4cCI6MjA1MTE4NTc0Nn0._n4XU02deVJmEzwXfuBPuMI3uAUaRctpxfGgxqsNRGA'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})