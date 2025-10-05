from flask import request, jsonify
from app import app
from askOpenAI import get_classificacao_resposta

@app.post("/classificar-texto")
def classificar_texto():
    # Aceita JSON ({"text": "..."}) ou form-data (text="...")
    text = ""
    if request.is_json:
        payload = request.get_json(silent=True) or {}
        text = payload.get("text", "")
    else:
        text = request.form.get("text", "")

    if not text or not str(text).strip():
        return jsonify({"error": "Campo 'text' é obrigatório."}), 400

    result = get_classificacao_resposta(str(text))
    if result.get("error"):
        return jsonify({"error": result["error"]}), 502

    classificacao = (result.get("classificacao") or "").strip()
    resposta = (result.get("resposta") or "").strip()

    # Normaliza valores esperados e evita valores inesperados
    valid_values = {"produtivo": "Produtivo", "improdutivo": "Improdutivo"}
    key = classificacao.lower()
    classificacao_norm = valid_values.get(key)

    if not classificacao_norm:
        # Se a API não retornou um valor válido, mantenha consistente mas sinalize
        return jsonify({
            "error": "Resposta inválida do modelo",
            "detalhes": {
                "classificacao": classificacao,
                "resposta": resposta,
            },
        }), 502

    return jsonify({
        "classificacao": classificacao_norm,
        "resposta": resposta,
    }), 200


