const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const matter = require("gray-matter");

// Initialize DeepSeek (OpenAI compatible)
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

async function generateNews() {
  const prompt = `
    És um jornalista desportivo de elite para o portal "SportsHub".
    O teu objetivo é escrever a notícia mais impactante e bem estruturada do dia em Portugal.
    
    Data Atual: ${new Date().toISOString()}
    
    Instruções:
    1. Pesquisa (simula) as notícias desportivas mais recentes (Futebol, Modalidades, Internacional).
    2. Escreve uma notícia completa em Português de Portugal.
    3. Devolve o resultado estritamente em formato JSON com os seguintes campos:
       - title: Um título apelativo e otimizado para SEO.
       - category: A categoria (ex: Futebol, Ténis, NBA).
       - excerpt: Um resumo de 2 frases para o card da página inicial.
       - content: O corpo da notícia em formato MDX (Markdown).
       - keywords: Uma lista de 5 a 10 palavras-chave separadas por vírgulas.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "És um jornalista desportivo que escreve apenas em JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(response.choices[0].message.content);
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
      tags: [data.category]
    });

    fs.writeFileSync(path.join(postsDir, fileName), fileContent);
    console.log(`Successfully generated with DeepSeek: ${fileName}`);
    
  } catch (error) {
    console.error("Error generating news with DeepSeek:", error);
    process.exit(1);
  }
}

generateNews();
