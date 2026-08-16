"use client";

import { useMemo, useState } from "react";

type ChoiceQuestion = {
  scene: string;
  prompt: string;
  options: string[];
  correct: number;
  success: string;
  hint: string;
};

type ChoiceMissionData = {
  type: "choice";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  questions: ChoiceQuestion[];
};

type SortItem = {
  icon: string;
  label: string;
  correct: number;
  explanation: string;
};

type SortMissionData = {
  type: "sort";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  categories: [string, string];
  items: SortItem[];
};

type MazeMissionData = {
  type: "maze";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  levels: MazeLevel[];
};

type MazeLevel = {
  name: string;
  size: number;
  start: [number, number];
  goal: [number, number];
  blocks: string[];
  batteries: string[];
};

type MemoryMissionData = {
  type: "memory";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  cards: string[];
};

type OddRound = {
  items: string[];
  correct: number;
};

type OddMissionData = {
  type: "odd";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  rounds: OddRound[];
};

type SequenceMissionData = {
  type: "sequence";
  title: string;
  short: string;
  icon: string;
  color: string;
  intro: string;
  rounds: string[][];
};

type Mission = ChoiceMissionData | SortMissionData | MazeMissionData | MemoryMissionData | OddMissionData | SequenceMissionData;

const missions: Mission[] = [
  {
    type: "choice",
    title: "Circuito dos padrões",
    short: "Padrões",
    icon: "◈",
    color: "cyan",
    intro: "LUMI precisa completar sequências para ativar seus sensores. Conversem antes de responder.",
    questions: [
      {
        scene: "🔵 🔴 🔵 🔴 ❓",
        prompt: "Qual símbolo completa o padrão?",
        options: ["🔵", "🟢", "🔴"],
        correct: 0,
        success: "O padrão alterna azul e vermelho.",
        hint: "Observe como as duas cores se repetem.",
      },
      {
        scene: "⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ❓",
        prompt: "O que aparece em seguida?",
        options: ["🌙", "⭐", "☀️"],
        correct: 1,
        success: "A sequência repete duas estrelas e uma lua.",
        hint: "Separe a sequência em grupos de três.",
      },
      {
        scene: "2 · 4 · 6 · 8 · ❓",
        prompt: "Qual número mantém a regra?",
        options: ["9", "10", "12"],
        correct: 1,
        success: "Cada número aumenta duas unidades.",
        hint: "Calcule a diferença entre dois números vizinhos.",
      },
      {
        scene: "🐟 🐟 🐙 · 🐟 🐟 🐙 · ❓",
        prompt: "Qual animal vem agora?",
        options: ["🐙", "🐟", "🐳"],
        correct: 1,
        success: "O grupo repetido é peixe, peixe e polvo.",
        hint: "Encontre o grupo que já apareceu duas vezes.",
      },
      {
        scene: "▲ · ▲▲ · ▲▲▲ · ❓",
        prompt: "Qual conjunto completa a sequência?",
        options: ["▲▲", "▲▲▲▲", "▲▲▲▲▲"],
        correct: 1,
        success: "A quantidade aumenta de um em um.",
        hint: "Conte os triângulos de cada grupo.",
      },
      {
        scene: "🟨 🟩 🟩 · 🟨 🟩 🟩 · ❓",
        prompt: "Qual figura vem agora?",
        options: ["🟨", "🟩", "🟦"],
        correct: 0,
        success: "O grupo repetido começa com o quadrado amarelo.",
        hint: "Divida as figuras em grupos de três.",
      },
      {
        scene: "🚀 · 🌍 · 🚀🚀 · 🌍🌍 · 🚀🚀🚀 · ❓",
        prompt: "Qual grupo completa a sequência?",
        options: ["🌍", "🌍🌍", "🌍🌍🌍"],
        correct: 2,
        success: "A quantidade de foguetes e planetas cresce em conjunto.",
        hint: "Conte os planetas de cada etapa.",
      },
      {
        scene: "⬆️ ➡️ ⬇️ ⬅️ ⬆️ ➡️ ❓",
        prompt: "Qual seta aparece em seguida?",
        options: ["⬅️", "⬇️", "⬆️"],
        correct: 1,
        success: "As setas giram no sentido horário.",
        hint: "Acompanhe a volta iniciada pela seta para cima.",
      },
      {
        scene: "🍎 🍌 🍌 · 🍎 🍌 🍌 · 🍎 ❓",
        prompt: "Qual fruta falta?",
        options: ["🍇", "🍎", "🍌"],
        correct: 2,
        success: "Depois de cada maçã aparecem duas bananas.",
        hint: "Observe quantas bananas acompanham cada maçã.",
      },
      {
        scene: "🔺 🔻 🔺 🔻 🔺 ❓",
        prompt: "Qual triângulo completa a sequência?",
        options: ["🔺", "🔻", "🔸"],
        correct: 1,
        success: "As orientações alternam entre cima e baixo.",
        hint: "Veja para onde aponta cada triângulo.",
      },
    ],
  },
  {
    type: "memory",
    title: "Memória dos sensores",
    short: "Memória",
    icon: "▥",
    color: "violet",
    intro: "Encontrem os pares de símbolos para recuperar a memória visual de LUMI.",
    cards: ["🤖", "⭐", "🔋", "🔒", "👁️", "🧠", "🔋", "🤖", "🧠", "⭐", "🔒", "👁️"],
  },
  {
    type: "choice",
    title: "Academia dos dados",
    short: "Dados",
    icon: "▦",
    color: "lime",
    intro: "Uma IA aprende com exemplos. A missão é escolher conjuntos variados e adequados.",
    questions: [
      {
        scene: "🐶 🐕 🦮 🐩",
        prompt: "Para reconhecer cães diferentes, qual conjunto é mais útil?",
        options: ["Quatro fotos do mesmo cão", "Cães de tamanhos, cores e posições diferentes", "Somente desenhos de ossos"],
        correct: 1,
        success: "A variedade ajuda o modelo a reconhecer casos diferentes.",
        hint: "Pense no que acontece quando aparece um cão nunca visto.",
      },
      {
        scene: "☀️ 🌧️ ☁️ 🌬️",
        prompt: "Para prever o tempo, quais dados fazem sentido?",
        options: ["Temperatura, chuva, vento e nuvens", "Cor favorita das pessoas", "Nome das ruas"],
        correct: 0,
        success: "Os dados precisam estar relacionados ao problema.",
        hint: "Qual opção descreve diretamente o clima?",
      },
      {
        scene: "🍎 🍌 🍇 🍓",
        prompt: "Uma IA viu apenas maçãs. Ela reconhecerá bem todas as frutas?",
        options: ["Sim, porque toda fruta é igual", "Não, faltam exemplos de outras frutas", "Sim, se a maçã for grande"],
        correct: 1,
        success: "Um conjunto limitado produz conhecimento limitado.",
        hint: "Ela já observou bananas ou uvas durante o treinamento?",
      },
      {
        scene: "📷 + 🏷️",
        prompt: "O que significa rotular uma imagem?",
        options: ["Dar um nome correto ao que aparece nela", "Aumentar o brilho", "Apagar a imagem"],
        correct: 0,
        success: "O rótulo informa ao sistema qual é a resposta esperada.",
        hint: "É como colocar uma etiqueta em uma caixa.",
      },
      {
        scene: "🧪 → ✅ → 🔁",
        prompt: "Depois de treinar um modelo, qual é o próximo cuidado?",
        options: ["Testá-lo com novos exemplos", "Acreditar em qualquer resposta", "Nunca mais verificar"],
        correct: 0,
        success: "Testes mostram onde o sistema funciona e onde ainda erra.",
        hint: "Como descobrir se o modelo realmente aprendeu?",
      },
    ],
  },
  {
    type: "odd",
    title: "Radar do intruso",
    short: "Intruso",
    icon: "◎",
    color: "pink",
    intro: "Localizem a figura diferente em cada painel. Observação rápida vale mais que leitura.",
    rounds: [
      { items: ["🍎", "🍎", "🍎", "🍎", "🍋", "🍎", "🍎", "🍎", "🍎", "🍎", "🍎", "🍎"], correct: 4 },
      { items: ["🤖", "🤖", "🤖", "🤖", "🤖", "🦾", "🤖", "🤖", "🤖", "🤖", "🤖", "🤖"], correct: 5 },
      { items: ["🔵", "🔵", "🔵", "🔵", "🔵", "🔵", "🔵", "🟣", "🔵", "🔵", "🔵", "🔵"], correct: 7 },
      { items: ["🐟", "🐟", "🐟", "🐟", "🐟", "🐟", "🐙", "🐟", "🐟", "🐟", "🐟", "🐟"], correct: 6 },
      { items: ["🌙", "🌙", "🌙", "⭐", "🌙", "🌙", "🌙", "🌙", "🌙", "🌙", "🌙", "🌙"], correct: 3 },
      { items: ["♻️", "♻️", "♻️", "♻️", "♻️", "♻️", "♻️", "♻️", "🗑️", "♻️", "♻️", "♻️"], correct: 8 },
    ],
  },
  {
    type: "sort",
    title: "Classificador relâmpago",
    short: "Classificar",
    icon: "↔",
    color: "orange",
    intro: "Ajude o robô da coleta seletiva. Classifique cada objeto antes que a esteira avance.",
    categories: ["RECICLÁVEL", "ORGÂNICO"],
    items: [
      { icon: "🥫", label: "lata de alumínio", correct: 0, explanation: "A lata pode ser encaminhada à reciclagem." },
      { icon: "🍌", label: "casca de banana", correct: 1, explanation: "A casca é um resíduo orgânico." },
      { icon: "📰", label: "jornal limpo", correct: 0, explanation: "Papel limpo é reciclável." },
      { icon: "🍎", label: "resto de maçã", correct: 1, explanation: "Restos de alimentos são orgânicos." },
      { icon: "🫙", label: "pote de vidro", correct: 0, explanation: "Vidro pode ser reciclado quando descartado corretamente." },
      { icon: "🥚", label: "casca de ovo", correct: 1, explanation: "A casca de ovo integra resíduos orgânicos." },
      { icon: "📦", label: "caixa de papelão", correct: 0, explanation: "Papelão limpo e seco é reciclável." },
      { icon: "🍂", label: "folhas secas", correct: 1, explanation: "Folhas são matéria orgânica." },
      { icon: "🧴", label: "frasco plástico vazio", correct: 0, explanation: "O plástico deve ser limpo e encaminhado à coleta adequada." },
      { icon: "🥕", label: "casca de cenoura", correct: 1, explanation: "Cascas de vegetais são orgânicas." },
    ],
  },
  {
    type: "sequence",
    title: "Painel de comandos",
    short: "Comandos",
    icon: "⌁",
    color: "orange",
    intro: "Observem as setas, escondam a sequência e repitam os comandos na ordem correta.",
    rounds: [
      ["↑", "→", "↓"],
      ["→", "→", "↑", "←"],
      ["↓", "←", "↑", "→", "↓"],
      ["↑", "↑", "→", "↓", "←", "←"],
      ["→", "↓", "↓", "←", "↑", "→", "↑"],
      ["←", "↑", "→", "→", "↓", "←", "↓", "→"],
    ],
  },
  {
    type: "choice",
    title: "Detetives do erro",
    short: "Erros",
    icon: "⌕",
    color: "pink",
    intro: "LUMI recebeu respostas de outros robôs. Descubram o que deve ser feito quando uma previsão parece errada.",
    questions: [
      {
        scene: "🐧  IA: “É um pato.”",
        prompt: "A pessoa deve aceitar a resposta sem verificar?",
        options: ["Sim, a IA nunca erra", "Não, deve comparar com outras informações", "Sim, porque os dois têm asas"],
        correct: 1,
        success: "Sistemas podem confundir objetos com características semelhantes.",
        hint: "A imagem e a resposta realmente correspondem?",
      },
      {
        scene: "🌧️  IA: “Não vai chover.”",
        prompt: "A janela mostra chuva forte. Qual atitude é adequada?",
        options: ["Ignorar o que está acontecendo", "Verificar os dados e corrigir a decisão", "Desligar todos os computadores"],
        correct: 1,
        success: "Evidências atuais devem ser consideradas.",
        hint: "A realidade observada pode ajudar na verificação.",
      },
      {
        scene: "🐈 🐈 🐈 → treinamento",
        prompt: "O modelo chama uma raposa de gato. Qual causa é plausível?",
        options: ["Treinamento com poucos tipos de animais", "A raposa escolheu o rótulo", "O computador ficou com sono"],
        correct: 0,
        success: "Pouca variedade de exemplos favorece confusões.",
        hint: "O que o modelo observou antes de ser testado?",
      },
      {
        scene: "95% de confiança",
        prompt: "Uma confiança alta garante que a resposta está correta?",
        options: ["Sempre", "Não, a previsão ainda pode estar errada", "Somente às terças-feiras"],
        correct: 1,
        success: "Confiança é uma estimativa do modelo, não uma garantia.",
        hint: "Até pessoas muito confiantes podem se enganar.",
      },
      {
        scene: "IA + pessoa = decisão",
        prompt: "Quem responde pelas decisões importantes?",
        options: ["Somente a máquina", "As pessoas responsáveis pelo uso do sistema", "Ninguém"],
        correct: 1,
        success: "A supervisão humana permanece indispensável.",
        hint: "Máquinas não assumem responsabilidade ética ou jurídica.",
      },
    ],
  },
  {
    type: "sort",
    title: "Guardião da privacidade",
    short: "Privacidade",
    icon: "◇",
    color: "violet",
    intro: "Um aplicativo pediu informações. Separe o que pode ser usado nesta brincadeira e o que deve permanecer protegido.",
    categories: ["PODE USAR", "PROTEGER"],
    items: [
      { icon: "🦸", label: "apelido inventado", correct: 0, explanation: "Um apelido fictício evita expor a identidade." },
      { icon: "🏠", label: "endereço de casa", correct: 1, explanation: "Endereço é dado pessoal e não deve ser divulgado." },
      { icon: "🎨", label: "cor favorita", correct: 0, explanation: "Para esta brincadeira, uma preferência genérica pode ser utilizada." },
      { icon: "🔑", label: "senha pessoal", correct: 1, explanation: "Senhas nunca devem ser compartilhadas." },
      { icon: "🧙", label: "nome de personagem inventado", correct: 0, explanation: "Personagens fictícios são apropriados para jogos." },
      { icon: "📞", label: "telefone da família", correct: 1, explanation: "Telefone é informação pessoal protegida." },
      { icon: "🦖", label: "animal pré-histórico favorito", correct: 0, explanation: "Essa escolha não identifica diretamente a criança." },
      { icon: "📍", label: "localização em tempo real", correct: 1, explanation: "A localização atual não deve ser compartilhada em jogos." },
    ],
  },
  {
    type: "choice",
    title: "Laboratório justo",
    short: "Justiça",
    icon: "⚖",
    color: "blue",
    intro: "Um sistema deve funcionar para pessoas e situações diferentes. Escolham os testes mais responsáveis.",
    questions: [
      {
        scene: "🎙️ vozes diferentes",
        prompt: "Como testar um reconhecedor de voz?",
        options: ["Com uma única pessoa", "Com pessoas de idades e vozes diferentes", "Sem ouvir nenhum resultado"],
        correct: 1,
        success: "Testes variados ajudam a revelar falhas de desempenho.",
        hint: "O sistema será usado por uma única pessoa?",
      },
      {
        scene: "🙂 🙂 🙂 🙂",
        prompt: "Um detector de rostos foi treinado com imagens muito parecidas. Qual é o risco?",
        options: ["Funcionar mal para pessoas diferentes", "Aprender todas as pessoas perfeitamente", "Não precisar de testes"],
        correct: 0,
        success: "A falta de diversidade pode produzir desempenho desigual.",
        hint: "Pense em quem não apareceu nos exemplos.",
      },
      {
        scene: "Grupo A: 98% · Grupo B: 61%",
        prompt: "O resultado pode ser considerado igualmente bom para todos?",
        options: ["Sim, basta observar o maior número", "Não, é necessário investigar a diferença", "Sim, diferenças nunca importam"],
        correct: 1,
        success: "Resultados por grupo ajudam a identificar desigualdades.",
        hint: "Compare os dois percentuais.",
      },
      {
        scene: "🔁 testar · corrigir · testar",
        prompt: "O que fazer ao encontrar desempenho desigual?",
        options: ["Esconder o resultado", "Revisar dados e modelo, depois testar novamente", "Culpar quem usou"],
        correct: 1,
        success: "A correção exige revisão e novos testes.",
        hint: "Qual alternativa realmente tenta resolver o problema?",
      },
      {
        scene: "🤖 ≠ juiz perfeito",
        prompt: "Por que decisões importantes precisam de acompanhamento humano?",
        options: ["Porque modelos podem reproduzir limitações dos dados", "Porque computadores não usam eletricidade", "Porque dados nunca influenciam resultados"],
        correct: 0,
        success: "Modelos herdam limitações dos exemplos e das escolhas de projeto.",
        hint: "A IA aprende a partir de dados selecionados por pessoas.",
      },
    ],
  },
  {
    type: "maze",
    title: "Labirinto do robô",
    short: "Planejar",
    icon: "⌘",
    color: "yellow",
    intro: "Planejem a rota, coletem todas as baterias e conduzam LUMI até o portal. Há dois mapas.",
    levels: [
      {
        name: "Estação de energia",
        size: 6,
        start: [0, 0],
        goal: [5, 5],
        blocks: ["1,1", "2,1", "4,1", "1,3", "2,3", "4,3", "3,4"],
        batteries: ["3,0", "0,3", "5,2"],
      },
      {
        name: "Núcleo de dados",
        size: 7,
        start: [0, 6],
        goal: [6, 0],
        blocks: ["1,1", "2,1", "4,1", "5,1", "1,3", "3,3", "5,3", "1,5", "2,5", "4,5", "5,5"],
        batteries: ["0,2", "3,4", "6,2"],
      },
    ],
  },
  {
    type: "choice",
    title: "Radar visual",
    short: "Radar",
    icon: "◉",
    color: "cyan",
    intro: "Respondam apenas observando os painéis. As imagens carregam quase toda a informação.",
    questions: [
      { scene: "🌙 ⭐ 🌙 🌙 ⭐ 🌙", prompt: "Quantas estrelas?", options: ["1", "2", "3"], correct: 1, success: "Há duas estrelas.", hint: "Conte somente as estrelas." },
      { scene: "🐶 🐱 🐶 🐶 🐱 🐶 🐶", prompt: "Quantos gatos?", options: ["2", "3", "5"], correct: 0, success: "Há dois gatos.", hint: "Ignore os cães e conte os gatos." },
      { scene: "MODELO  🚀🌍", prompt: "Qual grupo é igual?", options: ["🌍🚀", "🚀🌍", "🚀🚀"], correct: 1, success: "A ordem também faz parte do padrão.", hint: "Compare da esquerda para a direita." },
      { scene: "🔴 + 🔵 = ❓", prompt: "Qual par foi mostrado?", options: ["🔴🔵", "🔵🟢", "🟡🔴"], correct: 0, success: "O par contém vermelho e azul.", hint: "Observe as duas cores do modelo." },
      { scene: "🟩🟩🟨🟩🟩🟨", prompt: "Qual grupo se repete?", options: ["🟩🟨", "🟩🟩🟨", "🟨🟨🟩"], correct: 1, success: "O bloco repetido possui três figuras.", hint: "Separe a sequência em duas metades iguais." },
      { scene: "⬆️ ➡️ ⬇️", prompt: "Qual foi a segunda seta?", options: ["⬆️", "➡️", "⬇️"], correct: 1, success: "A seta central aponta para a direita.", hint: "Observe a figura do meio." },
      { scene: "🍓 🍓 🍌 🍓 🍓", prompt: "Qual fruta aparece uma vez?", options: ["🍓", "🍌", "🍎"], correct: 1, success: "A banana é a única diferente.", hint: "Procure a fruta que não se repete." },
      { scene: "🔺🔺 · 🔵🔵🔵 · ⭐⭐⭐⭐", prompt: "Qual grupo tem quatro figuras?", options: ["🔺", "🔵", "⭐"], correct: 2, success: "O grupo das estrelas possui quatro elementos.", hint: "Conte cada grupo." },
    ],
  },
  {
    type: "maze",
    title: "Corredores do portal",
    short: "Labirintos",
    icon: "▧",
    color: "green",
    intro: "Três novos mapas protegem o portal. Coletem todas as baterias antes de alcançar a saída.",
    levels: [
      {
        name: "Barreira vertical",
        size: 6,
        start: [0, 0],
        goal: [5, 5],
        blocks: ["2,0", "2,1", "2,3", "2,4", "4,1", "4,2", "4,4", "4,5"],
        batteries: ["1,2", "3,2", "5,3"],
      },
      {
        name: "Galeria espelhada",
        size: 7,
        start: [6, 6],
        goal: [0, 0],
        blocks: ["1,1", "2,1", "4,1", "5,1", "1,3", "3,3", "5,3", "1,5", "2,5", "4,5", "5,5"],
        batteries: ["6,4", "3,4", "0,2"],
      },
      {
        name: "Portal estelar",
        size: 8,
        start: [0, 7],
        goal: [7, 0],
        blocks: ["1,1", "2,1", "4,1", "5,1", "6,1", "1,3", "3,3", "4,3", "6,3", "1,5", "2,5", "3,5", "5,5", "6,5"],
        batteries: ["0,4", "4,4", "7,2", "4,6"],
      },
    ],
  },
  {
    type: "choice",
    title: "Código final",
    short: "Final",
    icon: "✦",
    color: "green",
    intro: "O portal só será aberto após a revisão dos princípios de uma inteligência artificial responsável.",
    questions: [
      {
        scene: "DADOS",
        prompt: "Qual afirmação está correta?",
        options: ["Mais dados sempre resolvem tudo", "Dados precisam ser relevantes e bem selecionados", "Dados não influenciam a IA"],
        correct: 1,
        success: "Qualidade e adequação são tão importantes quanto quantidade.",
        hint: "Os exemplos precisam representar o problema estudado.",
      },
      {
        scene: "TESTES",
        prompt: "Por que testar com exemplos novos?",
        options: ["Para verificar se o sistema funciona fora do treinamento", "Para decorar a tela", "Para impedir qualquer correção"],
        correct: 0,
        success: "Testes avaliam a capacidade de lidar com casos não utilizados no treinamento.",
        hint: "Aprender exemplos antigos não garante reconhecer os novos.",
      },
      {
        scene: "ERROS",
        prompt: "O que fazer quando a IA erra?",
        options: ["Investigar a causa e corrigir", "Fingir que não aconteceu", "Afirmar que a pessoa está errada"],
        correct: 0,
        success: "Erros devem ser documentados, investigados e corrigidos.",
        hint: "Qual opção permite melhorar o sistema?",
      },
      {
        scene: "PRIVACIDADE",
        prompt: "Qual informação nunca deve ser fornecida em um jogo?",
        options: ["Um herói inventado", "Uma cor", "Uma senha pessoal"],
        correct: 2,
        success: "Senhas são pessoais e secretas.",
        hint: "Uma dessas informações permite acessar contas.",
      },
      {
        scene: "JUSTIÇA",
        prompt: "Um sistema justo deve ser testado como?",
        options: ["Somente no caso mais fácil", "Com grupos e situações variadas", "Sem registrar erros"],
        correct: 1,
        success: "A avaliação deve considerar a diversidade das situações reais.",
        hint: "É preciso saber se o sistema funciona para diferentes pessoas.",
      },
      {
        scene: "RESPONSABILIDADE",
        prompt: "Quem deve tomar a decisão final em situações importantes?",
        options: ["Uma pessoa responsável, apoiada por informações verificadas", "A IA sem supervisão", "O resultado mais rápido"],
        correct: 0,
        success: "Tecnologia pode apoiar decisões, mas não elimina a responsabilidade humana.",
        hint: "A IA é uma ferramenta, não uma autoridade infalível.",
      },
    ],
  },
];

function playTone(kind: "ok" | "no" | "step", enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = kind === "no" ? "sawtooth" : "sine";
  osc.frequency.value = kind === "ok" ? 660 : kind === "no" ? 180 : 380;
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.17);
}

function ChoiceMission({ mission, onComplete, sound }: { mission: ChoiceMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [index, setIndex] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [done, setDone] = useState(false);
  const question = mission.questions[index];

  function answer(option: number) {
    if (answered) return;
    if (option === question.correct) {
      setPoints((value) => value + (attempted ? 60 : 100));
      setAnswered(true);
      setMessage(question.success);
      playTone("ok", sound);
    } else {
      setAttempted(true);
      setMessage(question.hint);
      playTone("no", sound);
    }
  }

  function next() {
    if (index === mission.questions.length - 1) {
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setAttempted(false);
    setAnswered(false);
    setMessage("");
  }

  if (done) {
    return <MissionComplete icon={mission.icon} points={points} text="Setor liberado. O raciocínio da equipe abasteceu mais um módulo de LUMI." onContinue={() => onComplete(points)} />;
  }

  return (
    <section className="mission-stage" aria-labelledby="mission-title">
      <div className="mission-heading">
        <span className={`mission-symbol ${mission.color}`}>{mission.icon}</span>
        <div><p className="eyebrow">DESAFIO {index + 1} DE {mission.questions.length}</p><h2 id="mission-title">{mission.title}</h2></div>
      </div>
      <p className="mission-intro">{index === 0 && !attempted && !answered ? mission.intro : "Conversem, escolham e testem a hipótese da equipe."}</p>
      <div className="question-panel">
        <div className="scene" aria-label={`Desafio visual: ${question.scene}`}>{question.scene}</div>
        <h3>{question.prompt}</h3>
        <div className="choice-grid">
          {question.options.map((option, optionIndex) => (
            <button className={answered && optionIndex === question.correct ? "choice correct" : "choice"} key={option} onClick={() => answer(optionIndex)} disabled={answered}>
              <span className="choice-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>
            </button>
          ))}
        </div>
        {message && <div className={answered ? "feedback success" : "feedback hint"} role="status" aria-live="polite"><strong>{answered ? "ACERTOU" : "PISTA"}</strong><span>{message}</span></div>}
        {answered && <button className="primary-button next" onClick={next}>{index === mission.questions.length - 1 ? "Concluir missão" : "Próximo desafio"}</button>}
      </div>
    </section>
  );
}

function SortMission({ mission, onComplete, sound }: { mission: SortMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [index, setIndex] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const item = mission.items[index];

  function classify(category: number) {
    if (answered) return;
    if (category === item.correct) {
      setPoints((value) => value + (attempted ? 50 : 80));
      setMessage(item.explanation);
      setAnswered(true);
      playTone("ok", sound);
    } else {
      setAttempted(true);
      setMessage("Observe o material ou o tipo de informação e tente novamente.");
      playTone("no", sound);
    }
  }

  function next() {
    if (index === mission.items.length - 1) {
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setAttempted(false);
    setAnswered(false);
    setMessage("");
  }

  if (done) {
    return <MissionComplete icon={mission.icon} points={points} text="Classificador calibrado. A equipe transformou exemplos em decisões verificáveis." onContinue={() => onComplete(points)} />;
  }

  return (
    <section className="mission-stage" aria-labelledby="sort-title">
      <div className="mission-heading">
        <span className={`mission-symbol ${mission.color}`}>{mission.icon}</span>
        <div><p className="eyebrow">ITEM {index + 1} DE {mission.items.length}</p><h2 id="sort-title">{mission.title}</h2></div>
      </div>
      <p className="mission-intro">{index === 0 ? mission.intro : "Escolham juntos a categoria mais adequada."}</p>
      <div className="sort-arena">
        <div className="conveyor" aria-label={item.label}><span className="sort-icon">{item.icon}</span><strong>{item.label}</strong></div>
        <div className="sort-buttons">
          {mission.categories.map((category, categoryIndex) => <button key={category} onClick={() => classify(categoryIndex)} disabled={answered}><span>{categoryIndex === 0 ? "◀" : "▶"}</span>{category}</button>)}
        </div>
        {message && <div className={answered ? "feedback success" : "feedback hint"} role="status"><strong>{answered ? "CLASSIFICADO" : "REVISEM"}</strong><span>{message}</span></div>}
        {answered && <button className="primary-button next" onClick={next}>{index === mission.items.length - 1 ? "Concluir missão" : "Próximo item"}</button>}
      </div>
    </section>
  );
}

function MemoryMission({ mission, onComplete, sound }: { mission: MemoryMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function turn(index: number) {
    if (busy || open.includes(index) || matched.includes(index)) return;
    if (open.length === 0) {
      setOpen([index]);
      playTone("step", sound);
      return;
    }
    const first = open[0];
    setOpen([first, index]);
    setMoves((value) => value + 1);
    setBusy(true);
    if (mission.cards[first] === mission.cards[index]) {
      playTone("ok", sound);
      window.setTimeout(() => {
        const nextMatched = [...matched, first, index];
        setMatched(nextMatched);
        setOpen([]);
        setBusy(false);
        if (nextMatched.length === mission.cards.length) setDone(true);
      }, 420);
    } else {
      playTone("no", sound);
      window.setTimeout(() => {
        setOpen([]);
        setBusy(false);
      }, 760);
    }
  }

  const points = Math.max(350, 900 - Math.max(0, moves - mission.cards.length / 2) * 25);
  if (done) return <MissionComplete icon={mission.icon} points={points} text={`Todos os pares foram encontrados em ${moves} jogadas.`} onContinue={() => onComplete(points)} />;

  return (
    <section className="mission-stage" aria-labelledby="memory-title">
      <div className="mission-heading"><span className={`mission-symbol ${mission.color}`}>{mission.icon}</span><div><p className="eyebrow">{matched.length / 2} DE {mission.cards.length / 2} PARES</p><h2 id="memory-title">{mission.title}</h2></div></div>
      <p className="mission-intro">{mission.intro}</p>
      <div className="memory-grid">
        {mission.cards.map((card, index) => {
          const visible = open.includes(index) || matched.includes(index);
          return <button className={`memory-card ${visible ? "visible" : ""} ${matched.includes(index) ? "matched" : ""}`} key={`${card}-${index}`} onClick={() => turn(index)} aria-label={visible ? card : "Carta escondida"} disabled={matched.includes(index)}><span>{visible ? card : "?"}</span></button>;
        })}
      </div>
      <div className="visual-counter"><strong>{moves}</strong><span>jogadas</span></div>
    </section>
  );
}

function OddMission({ mission, onComplete, sound }: { mission: OddMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [round, setRound] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [found, setFound] = useState(false);
  const [points, setPoints] = useState(0);
  const [done, setDone] = useState(false);
  const current = mission.rounds[round];

  function select(index: number) {
    if (found) return;
    if (index === current.correct) {
      setPoints((value) => value + (attempted ? 60 : 100));
      setFound(true);
      playTone("ok", sound);
    } else {
      setAttempted(true);
      playTone("no", sound);
    }
  }

  function next() {
    if (round === mission.rounds.length - 1) {
      setDone(true);
      return;
    }
    setRound((value) => value + 1);
    setAttempted(false);
    setFound(false);
  }

  if (done) return <MissionComplete icon={mission.icon} points={points} text="O radar visual foi calibrado em todos os painéis." onContinue={() => onComplete(points)} />;

  return (
    <section className="mission-stage" aria-labelledby="odd-title">
      <div className="mission-heading"><span className={`mission-symbol ${mission.color}`}>{mission.icon}</span><div><p className="eyebrow">PAINEL {round + 1} DE {mission.rounds.length}</p><h2 id="odd-title">{mission.title}</h2></div></div>
      <p className="mission-intro">{mission.intro}</p>
      <div className="odd-grid">
        {current.items.map((item, index) => <button className={found && index === current.correct ? "found" : ""} key={`${item}-${index}`} onClick={() => select(index)} disabled={found}><span>{item}</span></button>)}
      </div>
      <div className={`visual-status ${found ? "ok" : attempted ? "try" : ""}`}>{found ? "ENCONTRADO" : attempted ? "TENTE OUTRA FIGURA" : "TOQUE NO INTRUSO"}</div>
      {found && <button className="primary-button next" onClick={next}>{round === mission.rounds.length - 1 ? "Concluir missão" : "Próximo painel"}</button>}
    </section>
  );
}

function SequenceMission({ mission, onComplete, sound }: { mission: SequenceMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [round, setRound] = useState(0);
  const [show, setShow] = useState(true);
  const [input, setInput] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [complete, setComplete] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("OBSERVE");
  const sequence = mission.rounds[round];

  function command(symbol: string) {
    if (show || complete) return;
    const position = input.length;
    if (symbol !== sequence[position]) {
      playTone("no", sound);
      setMessage("REVISE A SEQUÊNCIA");
      setShow(true);
      setInput([]);
      return;
    }
    const nextInput = [...input, symbol];
    setInput(nextInput);
    playTone("step", sound);
    if (nextInput.length === sequence.length) {
      setComplete(true);
      setPoints((value) => value + 120);
      setMessage("SEQUÊNCIA CORRETA");
      playTone("ok", sound);
    }
  }

  function next() {
    if (round === mission.rounds.length - 1) {
      setDone(true);
      return;
    }
    setRound((value) => value + 1);
    setShow(true);
    setInput([]);
    setComplete(false);
    setMessage("OBSERVE");
  }

  if (done) return <MissionComplete icon={mission.icon} points={points} text="A equipe reproduziu todas as rotas visuais do painel." onContinue={() => onComplete(points)} />;

  return (
    <section className="mission-stage" aria-labelledby="sequence-title">
      <div className="mission-heading"><span className={`mission-symbol ${mission.color}`}>{mission.icon}</span><div><p className="eyebrow">ROTA {round + 1} DE {mission.rounds.length}</p><h2 id="sequence-title">{mission.title}</h2></div></div>
      <p className="mission-intro">{mission.intro}</p>
      <div className="sequence-screen">
        {(show ? sequence : sequence.map(() => "●")).map((symbol, index) => <span className={!show && index < input.length ? "entered" : ""} key={`${symbol}-${index}`}>{!show && index < input.length ? input[index] : symbol}</span>)}
      </div>
      <div className="visual-status">{message}</div>
      {show ? <button className="primary-button next" onClick={() => { setShow(false); setMessage("REPITA"); }}>Memorizei</button> : (
        <div className="sequence-dpad">
          {["↑", "←", "↓", "→"].map((symbol) => <button key={symbol} onClick={() => command(symbol)} disabled={complete}>{symbol}</button>)}
        </div>
      )}
      {complete && <button className="primary-button next" onClick={next}>{round === mission.rounds.length - 1 ? "Concluir missão" : "Próxima rota"}</button>}
    </section>
  );
}

function MazeMission({ mission, onComplete, sound }: { mission: MazeMissionData; onComplete: (points: number) => void; sound: boolean }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [position, setPosition] = useState<[number, number]>(mission.levels[0].start);
  const [batteries, setBatteries] = useState<string[]>([]);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("OBSERVEM O MAPA");
  const [levelComplete, setLevelComplete] = useState(false);
  const [done, setDone] = useState(false);
  const level = mission.levels[levelIndex];
  const blockSet = useMemo(() => new Set(level.blocks), [level]);
  const goalKey = `${level.goal[0]},${level.goal[1]}`;

  function move(dx: number, dy: number) {
    if (done || levelComplete) return;
    const next: [number, number] = [position[0] + dx, position[1] + dy];
    const key = `${next[0]},${next[1]}`;
    if (next[0] < 0 || next[0] >= level.size || next[1] < 0 || next[1] >= level.size || blockSet.has(key)) {
      setMessage("BLOQUEIO");
      playTone("no", sound);
      return;
    }
    setPosition(next);
    setSteps((value) => value + 1);
    playTone("step", sound);
    let nextBatteries = batteries;
    if (level.batteries.includes(key) && !batteries.includes(key)) {
      nextBatteries = [...batteries, key];
      setBatteries(nextBatteries);
      setMessage("BATERIA COLETADA");
      playTone("ok", sound);
    } else {
      setMessage("ROTA LIVRE");
    }
    if (key === goalKey) {
      if (nextBatteries.length === level.batteries.length) {
        playTone("ok", sound);
        if (levelIndex === mission.levels.length - 1) setDone(true);
        else setLevelComplete(true);
      } else {
        setMessage(`FALTAM ${level.batteries.length - nextBatteries.length} BATERIAS`);
      }
    }
  }

  function nextLevel() {
    const nextIndex = levelIndex + 1;
    setLevelIndex(nextIndex);
    setPosition(mission.levels[nextIndex].start);
    setBatteries([]);
    setMessage("OBSERVEM O NOVO MAPA");
    setLevelComplete(false);
  }

  const points = mission.levels.length * 500 + Math.max(0, 300 - steps * 2);
  if (done) return <MissionComplete icon={mission.icon} points={points} text={`${mission.levels.length} mapas concluídos em ${steps} movimentos.`} onContinue={() => onComplete(points)} />;

  if (levelComplete) {
    return (
      <section className="level-complete">
        <span>✦</span><p className="eyebrow">MAPA {levelIndex + 1} CONCLUÍDO</p><h2>{level.name}</h2>
        <button className="primary-button" onClick={nextLevel}>Abrir próximo mapa</button>
      </section>
    );
  }

  return (
    <section className="mission-stage" aria-labelledby="maze-title">
      <div className="mission-heading"><span className={`mission-symbol ${mission.color}`}>{mission.icon}</span><div><p className="eyebrow">MAPA {levelIndex + 1} DE {mission.levels.length} · {level.batteries.length} BATERIAS</p><h2 id="maze-title">{mission.title}</h2></div></div>
      <div className="maze-name"><span>{level.name}</span><small>{mission.intro}</small></div>
      <div className="maze-layout">
        <div className="maze" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }} role="grid" aria-label={`Labirinto ${level.name}`}>
          {Array.from({ length: level.size * level.size }, (_, cell) => {
            const x = cell % level.size;
            const y = Math.floor(cell / level.size);
            const key = `${x},${y}`;
            const isRobot = position[0] === x && position[1] === y;
            const battery = level.batteries.includes(key) && !batteries.includes(key);
            return <div className={`maze-cell ${blockSet.has(key) ? "blocked" : ""} ${key === goalKey ? "goal" : ""}`} role="gridcell" key={key}>{isRobot ? "🤖" : battery ? "🔋" : key === goalKey ? "✦" : blockSet.has(key) ? "■" : ""}</div>;
          })}
        </div>
        <div className="maze-controls">
          <div className="battery-meter" aria-label={`${batteries.length} de ${level.batteries.length} baterias coletadas`}>{level.batteries.map((_, battery) => <span className={battery < batteries.length ? "charged" : ""} key={battery}>▰</span>)}</div>
          <div className="visual-status">{message}</div>
          <div className="dpad" aria-label="Controles do robô">
            <button aria-label="Mover para cima" onClick={() => move(0, -1)}>↑</button><button aria-label="Mover para esquerda" onClick={() => move(-1, 0)}>←</button><button aria-label="Mover para baixo" onClick={() => move(0, 1)}>↓</button><button aria-label="Mover para direita" onClick={() => move(1, 0)}>→</button>
          </div>
          <small>{steps} movimentos</small>
        </div>
      </div>
    </section>
  );
}

function MissionComplete({ icon, points, text, onContinue }: { icon: string; points: number; text: string; onContinue: () => void }) {
  return (
    <section className="mission-complete">
      <div className="complete-orbit"><span>{icon}</span></div>
      <p className="eyebrow">MISSÃO CONCLUÍDA</p><h2>Excelente trabalho em equipe</h2><p>{text}</p>
      <strong className="points-earned">+ {points} pontos</strong>
      <button className="primary-button" onClick={onContinue}>Abrir próxima missão</button>
    </section>
  );
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="teacher-title">
      <section className="teacher-panel">
        <button className="close-button" aria-label="Fechar orientações" onClick={onClose}>×</button>
        <p className="eyebrow">ORIENTAÇÕES</p><h2 id="teacher-title">Aplicação em uma aula de aproximadamente 90 minutos</h2>
        <div className="teacher-timeline">
          <div><strong>5 min</strong><span>Formar duplas e inventar o nome da equipe.</span></div>
          <div><strong>70 a 80 min</strong><span>Realizar as treze missões, incluindo memória, comandos visuais e cinco mapas de labirinto.</span></div>
          <div><strong>10 min</strong><span>Comparar pontuações e escolher o desafio mais difícil.</span></div>
          <div><strong>10 min</strong><span>Discutir dados, erros, privacidade, justiça e supervisão humana.</span></div>
        </div>
        <p className="teacher-note">O jogo não elimina os participantes após uma tentativa incorreta. Ele oferece uma pista e permite nova resposta, evitando que dificuldades de leitura impeçam a conclusão.</p>
        <button className="secondary-button" onClick={onClose}>Voltar ao jogo</button>
      </section>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"start" | "game" | "finish">("start");
  const [teamName, setTeamName] = useState("");
  const [missionIndex, setMissionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState(true);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const mission = missions[missionIndex];
  const title = useMemo(() => score >= 9500 ? "Guardiões Supremos da IA" : score >= 7800 ? "Detetives de Dados" : "Exploradores de Inteligência Artificial", [score]);

  function startGame() {
    setTeamName(teamName.trim() || "Equipe LUMI");
    setScreen("game");
  }

  function completeMission(points: number) {
    setScore((value) => value + points);
    if (missionIndex === missions.length - 1) setScreen("finish");
    else setMissionIndex((value) => value + 1);
  }

  function restart() {
    setMissionIndex(0); setScore(0); setTeamName(""); setScreen("start");
  }

  return (
    <main className="app-shell">
      <div className="star-field" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Missão IA do IMDAZ"><span className="brand-mark">I</span><span><strong>IMDAZ</strong><small>MISSÃO IA</small></span></a>
        <div className="top-actions">
          {screen === "game" && <div className="score-chip"><span>✦</span><strong>{score}</strong></div>}
          <button className="icon-button" onClick={() => setSound((value) => !value)} aria-label={sound ? "Desativar sons" : "Ativar sons"}>{sound ? "♪" : "×♪"}</button>
          <button className="teacher-button" onClick={() => setTeacherOpen(true)}>Área do professor</button>
        </div>
      </header>

      {screen === "start" && (
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">AVENTURA COLABORATIVA · 13 MISSÕES</p>
            <h1>Ajude LUMI a se tornar uma <em>IA responsável.</em></h1>
            <p className="hero-text">Resolva padrões, escolha dados, investigue erros, proteja informações e conduza o robô até o portal final.</p>
            <label className="team-input">
              <span>Nome inventado da equipe</span>
              <div><input value={teamName} onChange={(event) => setTeamName(event.target.value.slice(0, 24))} placeholder="Ex.: Estrelas Digitais" onKeyDown={(event) => event.key === "Enter" && startGame()} /><button onClick={startGame}>INICIAR</button></div>
            </label>
            <div className="hero-facts"><span><strong>2</strong> crianças por equipe</span><span><strong>70–90</strong> minutos de jogo</span><span><strong>5</strong> mapas</span></div>
          </div>
          <div className="robot-bay" aria-label="Robô LUMI">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="robot"><div className="antenna"><i /></div><div className="robot-head"><span className="eye left" /><span className="eye right" /><b /></div><div className="robot-body"><span>LUMI</span><i /><i /><i /></div><div className="robot-arm arm-left" /><div className="robot-arm arm-right" /></div>
            <div className="status-card"><span className="pulse" /><div><small>STATUS</small><strong>AGUARDANDO EQUIPE</strong></div></div>
          </div>
        </section>
      )}

      {screen === "game" && mission && (
        <>
          <nav className="mission-map" aria-label="Progresso das missões">
            {missions.map((item, index) => <div className={index < missionIndex ? "map-node complete" : index === missionIndex ? "map-node active" : "map-node"} key={item.short}><span>{index < missionIndex ? "✓" : item.icon}</span><small>{item.short}</small></div>)}
          </nav>
          <div className="team-strip"><span>Equipe</span><strong>{teamName}</strong><i /><span>Setor</span><strong>{missionIndex + 1}/{missions.length}</strong></div>
          <div className="game-container" key={missionIndex}>
            {mission.type === "choice" && <ChoiceMission mission={mission} onComplete={completeMission} sound={sound} />}
            {mission.type === "sort" && <SortMission mission={mission} onComplete={completeMission} sound={sound} />}
            {mission.type === "memory" && <MemoryMission mission={mission} onComplete={completeMission} sound={sound} />}
            {mission.type === "odd" && <OddMission mission={mission} onComplete={completeMission} sound={sound} />}
            {mission.type === "sequence" && <SequenceMission mission={mission} onComplete={completeMission} sound={sound} />}
            {mission.type === "maze" && <MazeMission mission={mission} onComplete={completeMission} sound={sound} />}
          </div>
        </>
      )}

      {screen === "finish" && (
        <section className="finish-screen">
          <div className="confetti" aria-hidden="true">✦ · ◇ · ✦ · ◈ · ✦ · ◇ · ✦</div>
          <p className="eyebrow">PORTAL ABERTO · MISSÃO CONCLUÍDA</p><h1>{title}</h1>
          <p>A equipe <strong>{teamName}</strong> completou os treze setores e demonstrou que uma IA responsável exige dados adequados, testes, privacidade, justiça e supervisão humana.</p>
          <div className="final-score"><span>PONTUAÇÃO</span><strong>{score}</strong><small>cristais de conhecimento</small></div>
          <div className="principle-grid"><span>▦ <strong>Dados</strong></span><span>⌕ <strong>Testes</strong></span><span>◇ <strong>Privacidade</strong></span><span>⚖ <strong>Justiça</strong></span><span>◎ <strong>Pessoas</strong></span></div>
          <div className="finish-actions"><button className="primary-button" onClick={() => window.print()}>Imprimir certificado</button><button className="secondary-button" onClick={restart}>Nova equipe</button></div>
        </section>
      )}

      {teacherOpen && <TeacherPanel onClose={() => setTeacherOpen(false)} />}
      <footer><span>IMDAZ · Atividade educativa</span><span>Nenhum dado é enviado ou armazenado</span></footer>
    </main>
  );
}
