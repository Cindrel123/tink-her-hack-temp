import { createClient } from '@supabase/supabase-js'

// Manual check for env vars since we are running in Node
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? 'Found' : 'Missing')
console.log('Key:', supabaseAnonKey ? 'Found' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Missing environment variables. Make sure .env exists and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    try {
        console.log('Attempting to fetch session...')
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.error('Supabase Error:', error.message)
        } else {
            console.log('Success! Supabase connection established.')
            console.log('Session:', data.session ? 'Active' : 'None')
        }
    } catch (err) {
        console.error('Unexpected Error:', err.message)
    }
}

testConnection()
