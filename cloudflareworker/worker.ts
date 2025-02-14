import { Router } from 'itty-router'



export interface Env {
  MY_DATABASE: D1Database
}

interface ExtendedRequest extends Request {
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  }
}
const API_KEY = '1234'
const RATE_LIMIT = 100
const RATE_LIMIT_WINDOW = 60
const rateLimitCache = new Map<string, { count: number, resetTime: number }>()
const router = Router()

router.use(async (request: Request) => {
  const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';
  const now = Math.floor(Date.now() / 1000);
  let rateLimitInfo = rateLimitCache.get(ip);

  if (!rateLimitInfo || rateLimitInfo.resetTime < now) {
    rateLimitInfo = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitCache.set(ip, rateLimitInfo);
  }
  rateLimitInfo.count++;

  (request as ExtendedRequest).rateLimit = { limit: RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - rateLimitInfo.count), reset: rateLimitInfo.resetTime }
  
  
  request.rateLimit = { limit: RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - rateLimitInfo.count), reset: rateLimitInfo.resetTime }
  if (rateLimitInfo.count > RATE_LIMIT) {
    return new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429 , headers: { 'Content-Type': 'application/json' },})
  }
  if (request.method !== 'GET') {
      const apiKey = request.headers.get('x-api-key')
      if (!apiKey || apiKey !== API_KEY) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
  } 

})

const addRateLimitHeaders = (response: Response, request: ExtendedRequest) => {
  if (request.rateLimit) {
    response.headers.set('X-RateLimit-Limit', request.rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', request.rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', request.rateLimit.reset.toString());
  }
};

// GET all tools
router.get('/api/tools', async (request: ExtendedRequest, env: Env) => {
    try {
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools').all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  }catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to get tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
router.get('/api/tools/category/:category', async (request: ExtendedRequest, env: Env) => {
  const { category } = request.params;

    try {

    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE category = ?').bind(category).all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get tools by category' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})


router.get('/api/tools/search', async (request: ExtendedRequest, env: Env) => {
    try{
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    if (!q) {
      return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
    }
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE name LIKE ? OR description LIKE ?').bind(`%${q}%`, `%${q}%`).all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to search tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})


router.get('/api/tools/featured', async (request: ExtendedRequest, env: Env) => {
    try{
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE featured = 1').all()
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get featured tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  } 
})


router.get('/api/tools/language/:language', async (request: ExtendedRequest, env: Env) => {
    try{
    const { language } = request.params
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE language = ?').bind(language).all()
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get tools by language' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  } 
})
router.get('/api/tools/category/:category/language/:language', async (request: ExtendedRequest, env: Env) => {

    try{

    const { category, language } = request.params
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE category = ? AND language = ?').bind(category, language).all()
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get tools by category and language' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  } 
})


router.get('/api/tools/:toolId/reviews', async (request: ExtendedRequest, env: Env) => {
    try{
    const { toolId } = request.params
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM reviews WHERE toolId = ?').bind(toolId).all()
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get reviews by toolId' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  } 
})
  
router.get('/api/tools/:toolId/rating', async (request: ExtendedRequest, env: Env) => {

  try{
    const { toolId } = request.params
    const { results } = await env.MY_DATABASE.prepare('SELECT AVG(rating) as averageRating FROM reviews WHERE toolId = ?').bind(toolId).all()
    if(results[0].averageRating == null){
      return new Response(JSON.stringify({averageRating:0}), { headers: { 'Content-Type': 'application/json' } })
    }else{
      return new Response(JSON.stringify(results[0]), { headers: { 'Content-Type': 'application/json' } })
    }
  } catch (error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to get average rating by toolId' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  } 
})
router.post('/api/reviews', async (request: ExtendedRequest, env: Env) => {


  const body = await request.json();

  const toolId = body.toolId
  const rating = body.rating
  const comment = body.comment
  

  // Manual validation

  if (!toolId || typeof toolId !== 'number' || !rating || typeof rating !== 'number' || rating < 1 || rating > 5 || typeof comment !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid review data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    
    const stmt = env.MY_DATABASE.prepare('INSERT INTO reviews (toolId, rating, comment) VALUES (?, ?, ?)');
    const { meta } = await stmt.bind(toolId, rating, comment).run();

    const id = meta.last_row_id
    return new Response(JSON.stringify({id}), {headers: { 'Content-Type': 'application/json' }})
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create reviews' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
})
  


router.post('/api/tools', async (request: ExtendedRequest, env: Env) => {

  try{
    const body = await request.json()
    const { name, description, category, url, imageUrl, featured, language, translations } = body

    if (!name || !description || !category || !url || !imageUrl || featured === undefined || !language || !translations) {
      return new Response(JSON.stringify({ error: 'Invalid tool data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const stmt = env.MY_DATABASE.prepare('INSERT INTO tools (name, description, category, url, imageUrl, featured, language, translations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const { meta } = await stmt.bind(name, description, category, url, imageUrl, featured, language, translations).run()
    const id = meta.last_row_id
    return new Response(JSON.stringify({id}), { headers: { 'Content-Type': 'application/json' } })

  }catch(error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create tool' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
})

router.all('*', async (request: ExtendedRequest) => {
  const response = new Response(JSON.stringify({ error: 'Not Found.' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });

  addRateLimitHeaders(response, request)
  return response
})






export default {
    fetch: router.handle,
  };
