# ...existing code...
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
    return jsonify({
        "classificacao": result.get("classificacao"),
        "resposta": result.get("resposta"),
    }), 200

@app.post("/classificar-arquivo")
def classificar_arquivo():
    # Espera multipart/form-data com um arquivo .txt no campo "file"
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "Envie um arquivo .txt no campo 'file'."}), 400

    filename = (file.filename or "").lower()
    if not filename.endswith(".txt"):
        return jsonify({"error": "Apenas arquivos .txt são aceitos."}), 400

    content_bytes = file.read()
    if not content_bytes:
        return jsonify({"error": "Arquivo vazio."}), 400

    try:
        text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = content_bytes.decode("latin-1", errors="ignore")

    if not text.strip():
        return jsonify({"error": "Arquivo sem conteúdo de texto válido."}), 400

    result = get_classificacao_resposta(text)
    if result.get("error"):
        return jsonify({"error": result["error"]}), 502
    return jsonify({
        "classificacao": result.get("classificacao"),
        "resposta": result.get("resposta"),
    }), 200
