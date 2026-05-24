const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../'));

app.post('/api/ajuda', async (req, res) => {
  try {
    const { dificuldade = "Estou travado" } = req.body;
    console.log("→ Recebi pedido:", dificuldade);
    console.log("→ Chave carregada?", process.env.GROQ_API_KEY? "SIM" : "NÃO");

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user',    content: `Você é um coach anti-procrastinação. NÃO dê a solução. Dê apenas 1 dica leve, em 2 frases, para quem disse: "${dificuldade}". Foque em dividir em micro-passos.` }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    console.log("← Resposta Groq status:", response.status);
    console.log("← Corpo:", data);

    const texto = data.choices?.[0]?.message?.content || "Erro: " + JSON.stringify(data);
    res.json({ texto });
  } catch (error) {
    console.error("ERRO:", error);
    res.status(500).json({ texto: "Erro no servidor" });
  }
});

app.listen(PORT, () => console.log(`✅ Rodando em http://localhost:${PORT}`));