import { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

// MOCK AUTHENTICATION
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Check for persisted mock user
        const storedUser = localStorage.getItem('mockUser')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const signUp = async (email, password) => {
        // Mock signup - just log them in
        const newUser = { email, id: 'mock-id-123' }
        setUser(newUser)
        localStorage.setItem('mockUser', JSON.stringify(newUser))
        return { data: { user: newUser }, error: null }
    }

    const signIn = async (email, password) => {
        // Specific credential check
        if (email === 'cindrel@gmail.com' && password === 'cindrel123') {
            const newUser = { email, id: 'mock-id-123' }
            setUser(newUser)
            localStorage.setItem('mockUser', JSON.stringify(newUser))
            return { data: { user: newUser }, error: null }
        } else {
            return { data: null, error: { message: "Invalid credentials" } }
        }
    }

    const signOut = async () => {
        setUser(null)
        localStorage.removeItem('mockUser')
        return { error: null }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
