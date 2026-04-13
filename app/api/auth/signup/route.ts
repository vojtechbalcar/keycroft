import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json() as {
      email?: string
      password?: string
      name?: string
    }

    const cleanEmail = email?.trim().toLowerCase()
    const cleanName  = name?.trim()

    if (!cleanEmail || !password || !cleanName) {
      return NextResponse.json({ error: 'Email, username, and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        password: hashed,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
