"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { Database } from '@/database.types'


const supabaseUrl = 'https://sofujpixmzfvshtuqysm.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : ""
console.log(supabaseKey)
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default function App() {
    const [session, setSession] = useState<any | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (
            <div className='grid place-items-center'>
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
            </div>

        )
    }
    else {
        return (<div>Logged in!</div>)
    }
}