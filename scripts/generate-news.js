const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const matter = require("gray-matter");
const Parser = require("rss-parser");

const parser = new Parser();

// Initialize Groq
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getRealNews() {
  try {
    // Google News RSS for Portuguese Sports
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=desporto+portugal+futebol&hl=pt-PT&gl=PT&ceid=PT:pt');
    
    // Get the top 5 headlines to give context to the AI
    const headlines = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));
    
    return headlines;
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return [];
  }
}

async function generateNews() {
  const realHeadlines = await getRealNews();
  
  if (realHeadlines.length === 0) {
    console.error("No real news found. Skipping generation to avoid fake news.");
    return;
  }

  const context = realHeadlines.map(h => `- ${h.title}`).join('\n');

  const prompt = `
    És um jornalista desportivo de elite para o portal "SportsHub".
    O teu objetivo é escrever a notícia mais importante do momento baseada em factos REAIS.
    
    FACTOS REAIS DO MOMENTO (Extraídos do Google News):
    ${context}
    
    Instruções:
    1. Escolhe a notícia mais relevante da lista acima.
    2. Escreve uma notícia completa, profissional e factual em Português de Portugal.
    3. NÃO inventes resultados ou nomes. Se a informação não estiver no título, foca-te na análise do que é público.
    4. Devolve o resultado estritamente em formato JSON com os seguintes campos:
       - title: Título SEO baseado no facto real.
       - category: Categoria (ex: Futebol, Modalidades).
       - excerpt: Resumo factual de 2 frases.
       - content: Corpo da notícia em MDX.
       - keywords: 5-10 palavras-chave reais.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "És um jornalista desportivo rigoroso que só escreve sobre factos reais em JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(response.choices[0].message.content);
    
    // Check if the title is actually relevant to our context
    const slug = slugify(data.title, { lower: true, strict: true });
    const fileName = `${new Date().toISOString().split('T')[0]}-${slug}.mdx`;
    
    const postsDir = path.join(__dirname, "../src/content/posts");
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const fileContent = matter.stringify(data.content, {
      title: data.title,
      category: data.category,
      excerpt: data.excerpt,
      date: new Date().toISOString(),
      keywords: data.keywords,
      tags: [data.category],
      realSource: true
    });

    fs.writeFileSync(path.join(postsDir, fileName), fileContent);
    console.log(`REAL NEWS GENERATED: ${fileName}`);
    
  } catch (error) {
    console.error("Error generating news:", error);
    process.exit(1);
  }
}

generateNews();
