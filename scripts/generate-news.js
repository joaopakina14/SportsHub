const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const matter = require("gray-matter");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateNews() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    És um jornalista desportivo de elite para o portal "SportsHub".
    O teu objetivo é escrever a notícia mais impactante e bem estruturada do dia em Portugal.
    
    Data Atual: ${new Date().toISOString()}
    
    Instruções:
    1. Pesquisa (simula) as notícias desportivas mais recentes (Futebol, Modalidades, Internacional).
    2. Escreve uma notícia completa em Português de Portugal.
    3. Devolve o resultado em formato JSON com os seguintes campos:
       - title: Um título apelativo e otimizado para SEO.
       - category: A categoria (ex: Futebol, Ténis, NBA).
       - excerpt: Um resumo de 2 frases para o card da página inicial.
       - content: O corpo da notícia em formato MDX (Markdown).
       - keywords: Uma lista de 5 a 10 palavras-chave separadas por vírgulas.
    
    A notícia deve ter tom profissional, ser informativa e ter alta qualidade de escrita.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean JSON if Gemini wraps it in code blocks
    text = text.replace(/```json|```/g, "").trim();
    
    const data = JSON.parse(text);
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
    console.log(`Successfully generated: ${fileName}`);
    
  } catch (error) {
    console.error("Error generating news:", error);
    process.exit(1);
  }
}

generateNews();
