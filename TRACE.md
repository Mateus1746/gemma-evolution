# TRACE

### Decisão: Eliminação Completa do Google Colab e Automação Local Unificada (SOTA 2026)
`[DECISION] -> [RATIONALE] -> [CONSEQUENCE]`
* **DECISION**: Migrar o fluxo de áudio do Colab para síntese local via Kokoro (usando os DNAs de voz `.pt` no Drive) e utilizar o `Engine-Headless-Recorder` no lugar de compilação por CPU do FFmpeg.
* **RATIONALE**: A esteira anterior exigia sincronização manual e processamento externo lento. Com o Kokoro local e a gravação via Puppeteer Headless Canvas, alcançamos velocidades de renderização acima de **~85 FPS** de forma 100% automatizada e offline.
* **CONSEQUENCE**: Pipeline unificado e executado em um único comando: `uv run python conductor/run_pipeline.py`.

### Decisão: Refatoração do Gemma Evolution para Renderização em Canvas 2D
`[DECISION] -> [RATIONALE] -> [CONSEQUENCE]`
* **DECISION**: Substituir a renderização baseada em DOM (divs com framer-motion) por um motor de renderização dedicado via Canvas 2D API em `src/App.tsx`, garantindo sincronia perfeita de gravação via WebCodecs.
* **RATIONALE**: O `Engine-Headless-Recorder` exige nativamente texturas rasterizadas de alta performance (como o `<canvas>`). Tentar forçar rasterização do DOM resultaria em quebra da taxa de quadros e dessincronização de animações complexas. A abordagem de Canvas com `window.renderFrame(t)` decopla o frame rate e permite alta fidelidade, processando visuais estritos neurais a altas velocidades sem gargalos de DOM.
* **CONSEQUENCE**: O headless recorder agora roda a centenas de quadros virtuais por segundo gerando exportações determinísticas locais, e o componente central React passa a ser o loop da API Canvas renderizando o nó e as conexões do Gemma Evolution.
