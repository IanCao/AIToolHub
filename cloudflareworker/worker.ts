import { Router } from 'itty-router'



export interface Env {
  MY_DATABASE: D1Database;
}

function log(message: string, env: Env) {
  const timestamp = new Date().toISOString();
    if (!env.MY_DATABASE) {
        console.error(`${timestamp} [ERROR] Database not initialized.`);
    } else {
      console.log(`${timestamp} [LOG] ${message}`);
    }
}

interface ExtendedRequest extends Request {}
const API_KEY = '1234'
const router = Router()



// GET all tools
router.get('/api/tools', async (_request: ExtendedRequest, env: Env) => {
  try {
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    log("Fetching all tools", env);
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools').all();
    log(`Found ${results.length} tools`, env);
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  }catch (error) {
      console.error("Error fetching all tools:", error);
      return new Response(JSON.stringify({ error: 'Failed to get tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  }
})
router.get('/api/tools/category/:category', async (request: ExtendedRequest, env: Env) => {
  const { category } = request.params;

  try {
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    log(`Fetching tools by category: ${category}`, env);
    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE category = ?').bind(category).all();
      log(`Found ${results.length} tools in category: ${category}`, env);
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
      console.error(`Error fetching tools by category: ${category}`, error);
      return new Response(JSON.stringify({ error: 'Failed to get tools by category' }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  }
})


router.get('/api/tools/search', async (request: ExtendedRequest, env: Env) => {
  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    if (!q) {
      return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
    }
    log(`Searching tools with query: ${q}`, env);
      const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE name LIKE ? OR description LIKE ?').bind(`%${q}%`, `%${q}%`).all();
      log(`Found ${results.length} tools matching query: ${q}`, env);
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
      console.error(`Error searching tools with query: ${q}`, error);
      return new Response(JSON.stringify({ error: 'Failed to search tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  }
})


router.get('/api/tools/featured', async (request: ExtendedRequest, env: Env) => {
  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE featured = 1').all();
      log(`Found ${results.length} featured tools`, env);
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
      console.error("Error fetching featured tools:", error);
    return new Response(JSON.stringify({ error: 'Failed to get featured tools' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

})


router.get('/api/tools/language/:language', async (request: ExtendedRequest, env: Env) => {
  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { language } = request.params
      const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE language = ?').bind(language).all()
      log(`Found ${results.length} tools with language: ${language}`, env);
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
      console.error(`Error fetching tools by language: ${language}`, error);
    return new Response(JSON.stringify({ error: 'Failed to get tools by language' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

})
router.get('/api/tools/category/:category/language/:language', async (request: ExtendedRequest, env: Env) => {

  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const { category, language } = request.params
      const { results } = await env.MY_DATABASE.prepare('SELECT * FROM tools WHERE category = ? AND language = ?').bind(category, language).all()
      log(`Found ${results.length} tools with category: ${category} and language: ${language}`, env);
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
      console.error(`Error fetching tools by category: ${category} and language: ${language}`, error);
    return new Response(JSON.stringify({ error: 'Failed to get tools by category and language' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

})


router.get('/api/tools/:toolId/reviews', async (request: ExtendedRequest, env: Env) => {
  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { toolId } = request.params
      const { results } = await env.MY_DATABASE.prepare('SELECT * FROM reviews WHERE toolId = ?').bind(toolId).all()
      log(`Found ${results.length} reviews for toolId: ${toolId}`, env);
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } })
  } catch (error){
      console.error(`Error fetching reviews by toolId: ${toolId}`, error);
    return new Response(JSON.stringify({ error: 'Failed to get reviews by toolId' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

})
  
router.get('/api/tools/:toolId/rating', async (request: ExtendedRequest, env: Env) => {

  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const { toolId } = request.params
      const { results } = await env.MY_DATABASE.prepare('SELECT AVG(rating) as averageRating FROM reviews WHERE toolId = ?').bind(toolId).all()
      log(`Fetched average rating for toolId: ${toolId}`, env);
    if(results[0].averageRating == null){
      return new Response(JSON.stringify({averageRating:0}), { headers: { 'Content-Type': 'application/json' } })
    }else{
      return new Response(JSON.stringify(results[0]), { headers: { 'Content-Type': 'application/json' } })
    }
  } catch (error){
      console.error(`Error fetching average rating by toolId: ${toolId}`, error);
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
      if (!env.MY_DATABASE) {
          return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    
      log(`Creating review for toolId: ${toolId}, rating: ${rating}, comment: ${comment}`, env);
      const stmt = env.MY_DATABASE.prepare('INSERT INTO reviews (toolId, rating, comment) VALUES (?, ?, ?)');
    const { meta } = await stmt.bind(toolId, rating, comment).run();

    const id = meta.last_row_id
    log(`Review created with id: ${id}`, env);
    return new Response(JSON.stringify({id}), {headers: { 'Content-Type': 'application/json' }})
  } catch (error) {
      console.error("Error creating review:", error);
    return new Response(JSON.stringify({ error: 'Failed to create reviews' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
})
  


router.post('/api/tools', async (request: ExtendedRequest, env: Env) => {
  try{
    if (!env.MY_DATABASE) {
        console.error("Database not initialized.");
        return new Response(JSON.stringify({ error: 'Database not initialized' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }


    const body = await request.json()
    const { name, description, category, url, imageUrl, featured, language, translations } = body

    if (!name || !description || !category || !url || !imageUrl || featured === undefined || !language || !translations) {
      return new Response(JSON.stringify({ error: 'Invalid tool data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    log(`Creating tool with name: ${name}`, env);
    const stmt = env.MY_DATABASE.prepare('INSERT INTO tools (name, description, category, url, imageUrl, featured, language, translations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const { meta } = await stmt.bind(name, description, category, url, imageUrl, featured, language, translations).run()
    const id = meta.last_row_id
    log(`Tool created with id: ${id}`, env);
    return new Response(JSON.stringify({id}), { headers: { 'Content-Type': 'application/json' } })

  }catch(error){
      console.error("Error creating tool:", error);
    return new Response(JSON.stringify({ error: 'Failed to create tool' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
})

router.all('*', async (request: ExtendedRequest) => {
  const response = new Response(JSON.stringify({ error: 'Not Found.' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
  return response
});






export default {
    fetch: router.handle,
  };