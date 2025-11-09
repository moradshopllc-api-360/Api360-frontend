import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

// Create Supabase client for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Return error response if Supabase not configured (but don't fail build)
const isConfigured = !!(supabaseUrl && supabaseAnonKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get('redirect_to') || '/dashboard'

    // Check if Supabase is configured
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'Google OAuth not configured - Supabase credentials missing' },
        { status: 503 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

    // Get Google OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.json(
        { error: 'Failed to initiate Google OAuth', details: error.message },
        { status: 500 }
      )
    }

    // Redirect to Google OAuth URL
    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json(
      { error: 'No OAuth URL received from Google' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Google OAuth route error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error during Google OAuth',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { redirectTo } = await request.json()

    // Check if Supabase is configured
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'Google OAuth not configured - Supabase credentials missing' },
        { status: 503 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

    // Get Google OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${request.nextUrl.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.json(
        { error: 'Failed to initiate Google OAuth', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      message: 'Google OAuth initiated successfully'
    })

  } catch (error) {
    console.error('Google OAuth POST error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error during Google OAuth',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}