import json
from openai import OpenAI

_client = OpenAI()

def get_classificacao_resposta(text: str) -> dict:
    system = "Responda somente JSON válido e nada além disso."
    user = (
        "Você é um verificador conciso de emails recebidos por uma empresa do setor financeiro. Diga apenas JSON.\n"
        "Analise o texto referente a um email recebido pela empresa e classifique se ele é considerado um email Produtivo ou Improdutivo.\n "
        "Um email Produtivo consiste em: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema).\n"
        "Um email Improdutivo consiste em: Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos).\n"
        "Por fim, entregue uma sugestão de resposta automática para ser utilizada como resposta pelo email.\n"
        'Responda SOMENTE neste formato: {"classificacao": "Produtivo"|"Improdutivo", "resposta": "<resposta>"}\n'
        f"Texto do email:\n{text}"
    )

    try:
        resp = _client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        )
        content = resp.choices[0].message.content
        if content:
            content = content.strip()
        else:
            content = "{}"
        data = json.loads(content)
        return {
            "classificacao": data.get("classificacao"),
            "resposta": data.get("resposta"),
            "raw": content,
        }
    except Exception as e:
        # Fallback local para não quebrar o fluxo caso a API falhe
        return {
            "error": str(e),
        }