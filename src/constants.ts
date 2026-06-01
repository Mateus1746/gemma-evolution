/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const THEME = {
  colors: {
    space: '#130F26',
    gold: '#F2C94C',
    coral: '#EB5757',
  },
  animation: {
    spring: {
      stiffness: 100,
      damping: 10,
    },
    zoomIncrement: 0.005, // 0.5% per second
    physics: {
      organic: { stiffness: 40, damping: 20, mass: 1 },
      snappy: { stiffness: 200, damping: 20 },
      heavy: { stiffness: 20, damping: 15, mass: 2 }
    }
  }
};

export type SceneType = 'biology' | 'data' | 'process' | 'neural' | 'architecture';

export interface ScriptStep {
  time: number;
  text: string;
  highlight: string;
  scene: SceneType;
  meta?: any;
}

export const SAMPLE_SCRIPT: ScriptStep[] = [
  { 
    time: 0, 
    text: "Apresentamos o Gemma 4: Construído com a mesma tecnologia do Gemini 1.5 Pro, agora em formato aberto.", 
    highlight: "Gemma 4",
    scene: 'architecture',
    meta: { camera: { x: 0, y: 0, zoom: 1.1 } }
  },
  { 
    time: 6, 
    text: "Sua nova arquitetura MoE de 64 experts ativa apenas os neurônios necessários, reduzindo o custo computacional em 40%.", 
    highlight: "MoE 64 experts",
    scene: 'neural',
    meta: { camera: { x: 180, y: -40, zoom: 1.6 } }
  },
  { 
    time: 12, 
    text: "No benchmark MMLU, o Gemma 4 27B atinge impressionantes 84%, superando o Llama 3 70B em raciocínio lógico.", 
    highlight: "84% no MMLU",
    scene: 'data',
    meta: {
      camera: { x: 0, y: 0, zoom: 0.95 },
      chartType: 'scatter',
      chartData: [
        { x: 2, y: 42, z: 200, name: 'Gemma 2 2B', color: '#444' },
        { x: 9, y: 65, z: 250, name: 'Gemma 3 9B', color: '#666' },
        { x: 70, y: 78, z: 100, name: 'Llama 3 70B', color: '#E44' },
        { x: 27, y: 84, z: 400, name: 'Gemma 4 27B', color: '#F2C94C' },
      ]
    }
  },
  { 
    time: 18, 
    text: "A janela de contexto de 2 milhões de tokens permite processar repositórios inteiros de código ou horas de vídeo.", 
    highlight: "2 milhões de tokens",
    scene: 'process',
    meta: {
      camera: { x: -80, y: 30, zoom: 1.4 },
      activeNode: 1,
      tokens: ['PYTHON', 'C++', 'JS', 'RUST', 'GO']
    }
  },
  { 
    time: 24, 
    text: "Com suporte nativo a visão e áudio, o Gemma 4 demonstra maturidade multimodal absoluta.", 
    highlight: "Nativo Multimodal",
    scene: 'data',
    meta: { 
      camera: { x: 0, y: 0, zoom: 1 },
      chartType: 'radar',
      chartData: [
        { subject: 'Logic', A: 95, B: 70, fullMark: 100 },
        { subject: 'Vision', A: 88, B: 40, fullMark: 100 },
        { subject: 'Audio', A: 82, B: 30, fullMark: 100 },
        { subject: 'Coding', A: 92, B: 65, fullMark: 100 },
        { subject: 'Search', A: 85, B: 60, fullMark: 100 },
      ]
    }
  },
  { 
    time: 30, 
    text: "Disponível em 2B, 9B e na poderosa 27B. O futuro da IA aberta é multimodal e eficiente.", 
    highlight: "Abra sua IA",
    scene: 'architecture',
    meta: { camera: { x: 0, y: 0, zoom: 2.5 } }
  },
];
