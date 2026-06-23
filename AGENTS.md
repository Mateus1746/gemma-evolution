# AGENTS.md - Guia de Execução Autônoma

## Visão Geral do Pipeline
Este projeto é uma vitrine técnica interativa do Gemma 4, utilizando React, Vite e Framer Motion para animações, com suporte a narração via Gemini TTS. O pipeline de renderização automatizada captura essas animações em vídeo (MP4) usando o Engine-Headless-Recorder, permitindo a produção de conteúdo determinístico e de alta qualidade.

## Canvas
- **Seletor CSS:** `#video-canvas`
- **Dimensões:** 1080x1080 px
- **Tipo de contexto:** 2d (utilizado pelo gravador para capturar o DOM via Puppeteer ou frames de canvas se implementado)

## API de Renderização
- `window.renderFrame(timeMs: number): Promise<void>` - Avança a animação para o tempo especificado (em milissegundos).
- `window.__appReady: boolean` - Torna-se `true` quando a cena está inicializada e pronta para gravação.

## Como Executar o Pipeline
1. **Gerar Áudio (Opcional):**
   ```bash
   uv run python conductor/generate_audio.py
   ```
2. **Build do Projeto:**
   ```bash
   npm run build
   ```
3. **Gravar Vídeo:**
   ```bash
   node tools/Engine-Headless-Recorder/src/node/record_video.js --project=dist --canvas=#video-canvas --duration=35 --fps=25 --output=pipeline/sync_drive/exports/output.mp4
   ```

## Assets Estáticos
Todos os arquivos lidos via `fetch()` ou servidos estaticamente devem estar em `public/`.
- `script_ato1_sota.json`: Configuração de script (placeholder).
- `_words.json`: Metadados de palavras (placeholder).
- `subtitles.json`: Legendas (placeholder).
- `noticia.jpg`: Imagem de asset (placeholder).

## Problemas Conhecidos e Correções Aplicadas
- **Timestamps de Vídeo:** Corrigido o arredondamento de timestamps no `recorder-core.js` para evitar falhas no `VideoFrame`.
- **API de Seek:** Implementada a função `seek()` no hook `useSemanticSequence` para permitir renderização síncrona.
- **Seletor de Canvas:** Unificado o seletor para `#video-canvas` em todo o pipeline.
- **Build System:** Ajustado o `render_headless.py` para apontar para o diretório `dist/` gerado pelo Vite.

## Testes
- `npm test` - Executa a suite de testes Vitest.
