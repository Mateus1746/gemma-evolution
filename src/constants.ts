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
    text: "A jornada dos modelos de linguagem começou com o GPT-1 em 2018, provando que o pré-treinamento generativo era o caminho para a inteligência.",
    highlight: "GPT-1",
    scene: 'architecture',
    meta: { camera: { x: 0, y: 0, zoom: 1.1 } }
  },
  { 
    time: 10,
    text: "O GPT-2 e o GPT-3 elevaram a escala para bilhões de parâmetros, demonstrando habilidades emergentes e aprendizado com poucos exemplos.",
    highlight: "GPT-3",
    scene: 'neural',
    meta: { camera: { x: 180, y: -40, zoom: 1.6 } }
  },
  { 
    time: 22,
    text: "Com o GPT-4, entramos na era da multimodalidade e do raciocínio complexo, superando barreiras humanas em diversos exames acadêmicos.",
    highlight: "GPT-4",
    scene: 'data',
    meta: {
      camera: { x: 0, y: 0, zoom: 0.95 },
      chartType: 'scatter',
      chartData: [
        { x: 2, y: 42, z: 200, name: 'GPT-2', color: '#444' },
        { x: 175, y: 75, z: 250, name: 'GPT-3', color: '#666' },
        { x: 1000, y: 85, z: 300, name: 'GPT-4', color: '#E44' },
        { x: 1500, y: 90, z: 400, name: 'Gemini Ultra', color: '#F2C94C' },
      ]
    }
  },
  { 
    time: 35,
    text: "O Gemini Ultra consolidou a performance multimodal nativa, integrando visão, áudio e texto em um único motor de processamento.",
    highlight: "Gemini Ultra",
    scene: 'process',
    meta: {
      camera: { x: -80, y: 30, zoom: 1.4 },
      activeNode: 1,
      tokens: ['VISÃO', 'ÁUDIO', 'TEXTO', 'CÓDIGO', 'LÓGICA']
    }
  },
  { 
    time: 48,
    text: "O que vem a seguir? A evolução aponta para agentes autônomos, raciocínio sistêmico profundo e modelos que aprendem continuamente com o mundo.",
    highlight: "Futuro da IA",
    scene: 'architecture',
    meta: { camera: { x: 0, y: 0, zoom: 2.5 } }
  },
];
