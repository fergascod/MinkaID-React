"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

import { Database } from '@/database.types'

import Link from 'next/link'

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
                <p>No heu iniciat sessió</p>
                <Link
                    href={`/login`}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700 mb-2 transition-colors duration-200"
                >
                    Login
                </Link>
            </div>

        )
    }
    else {
        return (
            <div>
                <button onClick={async () => {
                    console.log(session)
                }}>pppp</button>
                <button onClick={async () => {
                    await supabase.auth.signOut()
                }}>Log out</button>
            </div>
        )
    }
}