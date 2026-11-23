import {
  createServer,
  type IncomingMessage,
  type ServerResponse
} from 'node:http'

const PORT = 54321
const HOST = '127.0.0.1'
const NOW = new Date().toISOString()

interface MockUser {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  identities: unknown[]
  created_at: string
  updated_at: string
}

interface MockAccount {
  password: string
  user: MockUser
}

const fixtureUser: MockUser = {
  id: '00000000-0000-4000-8000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'e2e@example.test',
  email_confirmed_at: NOW,
  phone: '',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: 'E2E User' },
  identities: [],
  created_at: NOW,
  updated_at: NOW
}

const accounts = new Map<string, MockAccount>([
  [fixtureUser.email, { password: 'Password123!', user: fixtureUser }]
])

const tokens = new Map<string, MockUser>()

// ── Datos de la canción de prueba (e2e de comentarios) ──
const fixtureSong = {
  id: '10000000-0000-4000-8000-000000000001',
  slug: 'cancion-e2e',
  title: 'Canción E2E',
  artist_id: '20000000-0000-4000-8000-000000000001',
  chords: '{title: Canción E2E}\n[C]Hola [G]mundo',
  lyrics: 'Hola mundo',
  coverArt: null,
  video: null,
  key: 'C',
  alphatex_content: null,
  isPublished: true,
  createdAt: NOW,
  updatedAt: NOW,
  artists_list: [
    {
      artist: {
        id: '20000000-0000-4000-8000-000000000001',
        name: 'Artista E2E',
        slug: 'artista-e2e'
      }
    }
  ]
}

interface MockComment {
  id: string
  song_id: string
  user_id: string
  content: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

const comments = new Map<string, MockComment>()

const findUserName = (uid: string): string | null =>
  [...accounts.values()].find((account) => account.user.id === uid)?.user
    .user_metadata?.full_name as string | null

const json = (
  req: IncomingMessage,
  res: ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {}
) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders(req),
    ...headers
  })
  res.end(JSON.stringify(body))
}

const corsHeaders = (req: IncomingMessage) => ({
  'Access-Control-Allow-Origin': req.headers.origin ?? '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-api-version, accept-profile, content-profile, x-retry-count, prefer, range, x-supabase-client-platform, x-supabase-client-version',
  'Access-Control-Expose-Headers': 'content-range, content-profile',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  Vary: 'Origin'
})

const readBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
  }
  if (chunks.length === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

/**
 * Responde como PostgREST: un objeto si el cliente pidió `.single()`
 * (`Accept: application/vnd.pgrst.object+json`) o la lista de filas.
 */
const respondRows = (
  req: IncomingMessage,
  res: ServerResponse,
  status: number,
  rows: unknown[]
) => {
  const wantsObject = (req.headers.accept ?? '').includes('vnd.pgrst.object')
  if (wantsObject && rows.length !== 1) {
    json(req, res, 406, { code: 'PGRST116', message: 'No rows' })
    return
  }
  json(req, res, status, wantsObject ? rows[0] : rows)
}

const buildSession = (user: MockUser) => {
  const accessToken = `access-token-${user.id}-${Date.now()}`
  const refreshToken = `refresh-token-${user.id}-${Date.now()}`
  tokens.set(accessToken, user)

  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: refreshToken,
    user
  }
}

const newUser = (
  email: string,
  fullName: string,
  id = crypto.randomUUID()
): MockUser => ({
  id,
  aud: 'authenticated',
  role: 'authenticated',
  email,
  email_confirmed_at: NOW,
  phone: '',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: fullName },
  identities: [],
  created_at: NOW,
  updated_at: NOW
})

const tokenFromRequest = (req: IncomingMessage) => {
  const header = req.headers.authorization ?? ''
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
}

const userFromRequest = (req: IncomingMessage): MockUser | null => {
  const token = tokenFromRequest(req)
  if (token == null) return null
  return tokens.get(token) ?? null
}

const handleAuth = async (
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req))
    res.end()
    return
  }

  if (url.pathname === '/auth/v1/health') {
    json(req, res, 200, { name: 'e2e-mock', status: 'ok' })
    return
  }

  if (url.pathname === '/auth/v1/authorize') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      ...corsHeaders(req)
    })
    res.end('<h1>Google OAuth mock</h1>')
    return
  }

  if (url.pathname === '/auth/v1/user' && req.method === 'GET') {
    const user = userFromRequest(req)
    if (user == null) {
      json(req, res, 401, { msg: 'invalid claim: missing sub claim' })
      return
    }
    json(req, res, 200, user)
    return
  }

  if (url.pathname === '/auth/v1/logout') {
    const token = tokenFromRequest(req)
    if (token != null) tokens.delete(token)
    res.writeHead(204, corsHeaders(req))
    res.end()
    return
  }

  if (url.pathname === '/auth/v1/signup' && req.method === 'POST') {
    const body = await readBody(req)
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const data =
      typeof body.data === 'object' && body.data != null
        ? (body.data as Record<string, unknown>)
        : {}
    const fullName =
      typeof data.full_name === 'string' && data.full_name.length > 0
        ? data.full_name
        : 'E2E User'

    if (email === 'duplicate@example.test' || accounts.has(email)) {
      json(req, res, 422, {
        code: 422,
        error_code: 'user_already_exists',
        msg: 'User already registered'
      })
      return
    }

    if (email.length === 0 || password.length < 6) {
      json(req, res, 422, {
        code: 422,
        error_code: 'weak_password',
        msg: 'Password should be at least 6 characters'
      })
      return
    }

    const user = newUser(email, fullName)
    accounts.set(email, { password, user })

    if (email.startsWith('confirm@')) {
      json(req, res, 200, { user })
      return
    }

    json(req, res, 200, buildSession(user))
    return
  }

  if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
    const grantType = url.searchParams.get('grant_type')

    if (grantType === 'refresh_token') {
      const body = await readBody(req)
      const account = [...accounts.values()].find(
        (item) => item.user.email !== '' && item.user.id !== ''
      )
      if (body.refresh_token == null || account == null) {
        json(req, res, 400, { msg: 'Invalid Refresh Token' })
        return
      }
      json(req, res, 200, buildSession(account.user))
      return
    }

    const body = await readBody(req)
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const account = accounts.get(email)

    if (
      email === 'fail@example.test' ||
      account == null ||
      account.password !== password
    ) {
      json(req, res, 400, {
        code: 400,
        error_code: 'invalid_credentials',
        msg: 'Invalid login credentials',
        error_description: 'Invalid login credentials'
      })
      return
    }

    json(req, res, 200, buildSession(account.user))
    return
  }

  json(req, res, 404, { msg: `Unhandled auth route: ${url.pathname}` })
}

const handleRest = async (
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req))
    res.end()
    return
  }

  if (url.pathname === '/rest/v1/users') {
    const uid = url.searchParams.get('uid')?.replace('eq.', '') ?? ''
    const knownUser = [...accounts.values()].find(
      (account) => account.user.id === uid
    )?.user

    const profile = {
      uid,
      email: knownUser?.email ?? 'e2e@example.test',
      name: knownUser?.user_metadata?.full_name ?? 'E2E User',
      role: 'user',
      avatar_url: null,
      createdAt: null
    }
    json(req, res, 200, profile)
    return
  }

  if (url.pathname === '/rest/v1/song_favorites') {
    json(req, res, 200, [])
    return
  }

  // ── Canción de prueba (solo cuando se pide por su slug) ──
  if (url.pathname === '/rest/v1/songs') {
    const slug = url.searchParams.get('slug')
    json(req, res, 200, slug === `eq.${fixtureSong.slug}` ? [fixtureSong] : [])
    return
  }

  // ── Comentarios en memoria ──
  if (url.pathname === '/rest/v1/rpc/get_song_comments') {
    const { p_song_id: songId } = await readBody(req)
    json(
      req,
      res,
      200,
      [...comments.values()]
        .filter((c) => c.song_id === songId && !c.isDeleted)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((c) => ({
          ...c,
          user_name: findUserName(c.user_id),
          user_avatar_url: null
        }))
    )
    return
  }

  if (url.pathname === '/rest/v1/song_comments') {
    const id = url.searchParams.get('id')?.replace('eq.', '') ?? ''

    if (req.method === 'POST') {
      const body = await readBody(req)
      const now = new Date().toISOString()
      const comment: MockComment = {
        id: crypto.randomUUID(),
        song_id: String(body.song_id),
        user_id: String(body.user_id),
        content: String(body.content),
        createdAt: now,
        updatedAt: now,
        isDeleted: false
      }
      comments.set(comment.id, comment)
      respondRows(req, res, 201, [comment])
      return
    }

    if (req.method === 'PATCH') {
      const current = comments.get(id)
      if (current == null) {
        respondRows(req, res, 200, [])
        return
      }
      const body = await readBody(req)
      const updated: MockComment = {
        ...current,
        ...(typeof body.content === 'string' && { content: body.content }),
        ...(typeof body.isDeleted === 'boolean' && {
          isDeleted: body.isDeleted
        }),
        updatedAt: new Date().toISOString()
      }
      comments.set(id, updated)
      respondRows(req, res, 200, [updated])
      return
    }

    if (req.method === 'DELETE') {
      comments.delete(id)
      res.writeHead(204, corsHeaders(req))
      res.end()
      return
    }

    json(req, res, 200, [...comments.values()])
    return
  }

  // El resto de endpoints de PostgREST devuelven una lista vacía para que
  // las páginas que cargan datos no rompan durante el E2E.
  json(req, res, 200, [])
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`)

  if (url.pathname === '/health') {
    json(req, res, 200, { status: 'ok' })
    return
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req))
    res.end()
    return
  }

  const handler = url.pathname.startsWith('/auth/v1')
    ? handleAuth(req, res, url)
    : url.pathname.startsWith('/rest/v1')
      ? handleRest(req, res, url)
      : Promise.resolve(json(req, res, 404, { msg: 'Not found' }))

  handler.catch((error: unknown) => {
    console.error('[mock-supabase]', error)
    if (!res.headersSent) {
      json(req, res, 500, { msg: 'Mock server error' })
    }
  })
})

server.listen(PORT, HOST, () => {
  console.log(`[mock-supabase] listening on http://${HOST}:${PORT}`)
})
