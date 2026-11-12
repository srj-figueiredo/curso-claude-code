"""Copia uma transcrição stream-json para transcripts/ sem dados pessoais.

Uso: python scripts/sanitizar-transcricao.py <entrada.jsonl> <id> <pasta-do-projeto>

Troca a pasta do projeto por caminhos relativos, a pasta do usuário por ~ e remove
identificadores de sessão e campos de cobrança que não interessam ao curso.
"""
import json
import os
import re
import sys

entrada, ident, projeto = sys.argv[1], sys.argv[2], sys.argv[3]
casa = os.path.expanduser("~")


def variantes(caminho):
    barra = caminho.replace("/", "\\")
    return [barra.replace("\\", "\\\\"), barra, barra.replace("\\", "/")]


def limpar(texto):
    for v in variantes(projeto):
        texto = texto.replace(v + "\\\\", "").replace(v + "\\", "").replace(v + "/", "").replace(v, ".")
    for v in variantes(casa):
        texto = texto.replace(v, "~")
    return re.sub(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", "00000000-0000-0000-0000-000000000000", texto)


MANTER_SISTEMA = {"type", "subtype", "model", "permissionMode", "claude_code_version", "tools"}
saida = []
with open(entrada, encoding="utf-8") as arquivo:
    for linha in arquivo:
        evento = json.loads(limpar(linha))
        tipo = evento.get("type")
        if tipo == "system" and evento.get("subtype") == "init":
            saida.append({k: v for k, v in evento.items() if k in MANTER_SISTEMA})
        elif tipo in ("assistant", "user"):
            conteudo = evento["message"]["content"]
            if isinstance(conteudo, list):
                conteudo = [b for b in conteudo if b.get("type") != "thinking"]
                for bloco in conteudo:
                    bloco.pop("signature", None)
                    bloco.pop("caller", None)
            if conteudo:
                saida.append({"type": tipo, "message": {"content": conteudo}})
        elif tipo == "result":
            saida.append({k: evento.get(k) for k in ("type", "subtype", "num_turns", "duration_ms", "total_cost_usd", "result")})

destino = os.path.join("transcripts", ident + ".jsonl")
with open(destino, "w", encoding="utf-8", newline="\n") as arquivo:
    for evento in saida:
        arquivo.write(json.dumps(evento, ensure_ascii=False) + "\n")
print(destino, len(saida), "eventos")
