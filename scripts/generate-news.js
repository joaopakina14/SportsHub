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
    // Google News RSS targeting specifically A Bola, O Jogo, and Record
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=site:abola.pt+OR+site:ojogo.pt+OR+site:record.pt+futebol&hl=pt-PT&gl=PT&ceid=PT:pt');
    
    // Get the top 15 headlines to give context to the AI (giving more options)
    const headlines = feed.items.slice(0, 15).map(item => ({
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

  // Ler os arquivos já gerados para não repetir notícias
  const postsDir = path.join(__dirname, "../src/content/posts");
  let existingTitles = [];
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .reverse()
      .slice(0, 6); // Ver as últimas 6 notícias
    
    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const { data } = matter(fileContent);
      if (data && data.title) {
        existingTitles.push(data.title);
      }
    }
  }

  const context = realHeadlines.map(h => `- ${h.title}`).join('\n');
  const recentArticlesContext = existingTitles.length > 0 
    ? `\n\nARTIGOS JÁ PUBLICADOS RECENTEMENTE (PROIBIDO FALAR SOBRE ESTES TEMAS):\n${existingTitles.map(t => `- ${t}`).join('\n')}` 
    : '';

  const prompt = `
    És um jornalista desportivo de elite para o portal "SportsHub".
    O teu objetivo é escrever a notícia mais importante do momento baseada em factos REAIS.
    
    FACTOS REAIS DO MOMENTO (Extraídos do Google News):
    ${context}${recentArticlesContext}
    
    Instruções:
    1. Escolhe UMA notícia relevante da lista de "FACTOS REAIS DO MOMENTO" acima.
    2. REGRA DE OURO: NÃO podes escolher um tema que seja igual ou sequer semelhante aos que estão na lista "ARTIGOS JÁ PUBLICADOS RECENTEMENTE". Se todos os de cima forem parecidos, escolhe um dos factos mais abaixo na lista.
    3. Escreve uma notícia completa e factual em Português de Portugal. É MUITO IMPORTANTE que uses as tuas próprias palavras. Reescreve a informação de forma original, criativa e num tom de jornalismo desportivo cativante. NÃO copies as frases da fonte original - cria um texto 100% único.
    4. NÃO inventes resultados ou nomes. Se a informação não estiver no título, foca-te na análise do que é público.
    5. Devolve o resultado estritamente em formato JSON com os seguintes campos:
       - title: Título SEO baseado no facto real.
       - category: OBRIGATÓRIO escolher APENAS UMA destas opções exatas: "Primeira Liga", "LaLiga", "Premier League", "Ligue 1", "Serie A", "Bundesliga", "Andebol", "Futsal", "Voleibol", "Basquetebol", "F1", "MotoGP", ou "Geral".
       - image_search: Gera 1 a 3 palavras em INGLÊS que descrevam visualmente a notícia para um banco de imagens. REGRA VITAL 1: NUNCA uses nomes próprios (Porto, Sporting, Ronaldo). REGRA VITAL 2: A PRIMEIRA palavra TEM DE SER o nome do desporto em inglês (ex: "soccer", "basketball"). REGRA VITAL 3: Se a notícia for sobre algo abstrato (como eleições, contratos, finanças ou tribunais), NÃO uses essas palavras abstratas; pesquisa simplesmente pelo nome do desporto e um conceito físico seguro (ex: se é sobre reeleição no futebol, usa "soccer stadium" ou "soccer manager", NÃO uses "election" ou "vote").
       - excerpt: Resumo factual de 2 frases.
       - content: Corpo da notícia em MDX.
       - keywords: Array de strings com 5-10 palavras-chave reais (ex: ["futebol", "benfica", "liga"]).
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
    
    // Obter imagem perfeita do banco de imagens (Unsplash)
    let imageUrl = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1080&auto=format&fit=crop"; // Fallback: Relvado genérico
    if (process.env.UNSPLASH_API_KEY && data.image_search) {
      try {
        console.log(`Searching Unsplash for: ${data.image_search}`);
        const unsplashRes = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(data.image_search)}&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`);
        if (unsplashRes.ok) {
          const unsplashData = await unsplashRes.json();
          imageUrl = unsplashData.urls.regular;
        } else {
          console.log("Unsplash fail, using fallback.");
        }
      } catch (e) {
        console.error("Error fetching Unsplash image", e);
      }
    }

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
      image: imageUrl,
      keywords: data.keywords,
      tags: [data.category],
      realSource: true
    });

    fs.writeFileSync(path.join(postsDir, fileName), fileContent);
    console.log(`REAL NEWS GENERATED: ${fileName}`);
    
    // Export metadata for GitHub Actions
    const metadata = {
      title: data.title,
      slug: slug,
      fileName: fileName,
      image: imageUrl,
      url: `https://sports-news-theta.vercel.app/news/${slug}`
    };
    fs.writeFileSync(path.join(__dirname, "../news-metadata.json"), JSON.stringify(metadata));

  } catch (error) {
    console.error("Error generating news:", error);
    process.exit(1);
  }
}

generateNews();
