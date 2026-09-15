"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./lab.module.css";

type Screen = "start" | "lab" | "finish";
type WireMode = "led" | "traffic" | "pedestrian";
type SimState = "off" | "red" | "green" | "yellow" | "walk";
type Terminal = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
};
type Block = {
  id: string;
  label: string;
  detail: string;
  color: "blue" | "orange" | "pink" | "green" | "violet";
};
type Stage = {
  short: string;
  title: string;
  time: number;
  description: string;
  points: number;
};

const stages: Stage[] = [
  {
    short: "Componentes",
    title: "Conheça a bancada",
    time: 10,
    description: "Descubra a função de cada componente antes de iniciar a montagem.",
    points: 500,
  },
  {
    short: "Primeiro LED",
    title: "Monte o primeiro circuito",
    time: 20,
    description: "Conecte um LED ao Arduino, incluindo o resistor de proteção.",
    points: 1200,
  },
  {
    short: "Pisca-pisca",
    title: "Programe o LED",
    time: 15,
    description: "Organize blocos para ligar e desligar o LED continuamente.",
    points: 1200,
  },
  {
    short: "Semáforo",
    title: "Construa um semáforo",
    time: 25,
    description: "Monte três ramos independentes para os LEDs vermelho, amarelo e verde.",
    points: 1600,
  },
  {
    short: "Controle",
    title: "Controle o trânsito",
    time: 20,
    description: "Defina a sequência e o tempo correto de cada luz do semáforo.",
    points: 1600,
  },
  {
    short: "Pedestres",
    title: "Crie uma travessia segura",
    time: 15,
    description: "Adicione um botão e um buzzer, teste o sistema e corrija sua lógica.",
    points: 1900,
  },
];

const balloonRewards = [
  { stage: 0, color: "azul", filter: "hue-rotate(190deg)" },
  { stage: 1, color: "amarelo", filter: "hue-rotate(55deg) saturate(1.4)" },
  { stage: 2, color: "vermelho", filter: "none" },
  { stage: 4, color: "verde", filter: "hue-rotate(105deg)" },
  { stage: 5, color: "roxo", filter: "hue-rotate(250deg)" },
];

const terminals: Terminal[] = [
  { id: "d2", label: "D2", x: 170, y: 135, color: "#9d82ff" },
  { id: "d6", label: "D6", x: 170, y: 180, color: "#ff6fbd" },
  { id: "d9", label: "D9", x: 170, y: 225, color: "#ff6a62" },
  { id: "d10", label: "D10", x: 170, y: 270, color: "#55d98d" },
  { id: "d11", label: "D11", x: 170, y: 315, color: "#ffd84e" },
  { id: "gnd", label: "GND", x: 170, y: 370, color: "#5d6989" },
  { id: "rr1", label: "R1", x: 345, y: 145, color: "#ff9f45" },
  { id: "rr2", label: "R2", x: 425, y: 145, color: "#ff9f45" },
  { id: "ra", label: "+", x: 520, y: 145, color: "#ff6a62" },
  { id: "rk", label: "−", x: 585, y: 145, color: "#ff6a62" },
  { id: "rg1", label: "R1", x: 345, y: 245, color: "#ff9f45" },
  { id: "rg2", label: "R2", x: 425, y: 245, color: "#ff9f45" },
  { id: "ga", label: "+", x: 520, y: 245, color: "#55d98d" },
  { id: "gk", label: "−", x: 585, y: 245, color: "#55d98d" },
  { id: "ry1", label: "R1", x: 345, y: 345, color: "#ff9f45" },
  { id: "ry2", label: "R2", x: 425, y: 345, color: "#ff9f45" },
  { id: "ya", label: "+", x: 520, y: 345, color: "#ffd84e" },
  { id: "yk", label: "−", x: 585, y: 345, color: "#ffd84e" },
  { id: "bt1", label: "A", x: 365, y: 435, color: "#9d82ff" },
  { id: "bt2", label: "B", x: 445, y: 435, color: "#9d82ff" },
  { id: "bz1", label: "+", x: 675, y: 435, color: "#ff6fbd" },
  { id: "bz2", label: "−", x: 750, y: 435, color: "#ff6fbd" },
];

const redEdges = ["d9|rr1", "ra|rr2", "gnd|rk"];
const greenEdges = ["d10|rg1", "ga|rg2", "gk|gnd"];
const yellowEdges = ["d11|ry1", "ry2|ya", "gnd|yk"];
const trafficEdges = [...redEdges, ...greenEdges, ...yellowEdges];
const pedestrianEdges = ["bt1|d2", "bt2|gnd", "bz1|d6", "bz2|gnd"];

const componentQuestions = [
  {
    icon: "▣",
    name: "Arduino",
    prompt: "Qual é a principal função desta placa?",
    options: ["Executar o programa e controlar o circuito", "Diminuir a corrente elétrica", "Produzir luz"],
    correct: 0,
    explanation: "O Arduino executa as instruções e controla os pinos ligados aos componentes.",
  },
  {
    icon: "▦",
    name: "Protoboard",
    prompt: "Por que utilizamos uma protoboard?",
    options: ["Para armazenar o programa", "Para montar e testar sem soldar", "Para medir a temperatura"],
    correct: 1,
    explanation: "A protoboard permite experimentar conexões e reorganizar o circuito com facilidade.",
  },
  {
    icon: "●",
    name: "LED",
    prompt: "O LED possui polaridade. O que isso significa?",
    options: ["Funciona somente no escuro", "Pode receber qualquer corrente", "Deve ser ligado na orientação correta"],
    correct: 2,
    explanation: "O terminal positivo e o terminal negativo precisam ser conectados corretamente.",
  },
  {
    icon: "▰",
    name: "Resistor",
    prompt: "Qual é a função do resistor junto ao LED?",
    options: ["Aumentar a tensão", "Limitar a corrente e proteger o LED", "Guardar energia"],
    correct: 1,
    explanation: "O resistor limita a corrente elétrica e evita que o LED seja danificado.",
  },
  {
    icon: "◎",
    name: "Botão",
    prompt: "Como o botão participa do sistema?",
    options: ["Produz som", "Substitui a alimentação", "Envia uma entrada quando é pressionado"],
    correct: 2,
    explanation: "O botão informa ao programa que uma pessoa solicitou uma ação.",
  },
];

const blinkBlocks: Block[] = [
  { id: "setup", label: "preparar pino D9", detail: "definir D9 como saída", color: "blue" },
  { id: "repeat", label: "repetir sempre", detail: "iniciar laço contínuo", color: "violet" },
  { id: "on", label: "ligar LED", detail: "enviar nível alto para D9", color: "green" },
  { id: "wait1", label: "esperar 1 segundo", detail: "manter o LED ligado", color: "orange" },
  { id: "off", label: "desligar LED", detail: "enviar nível baixo para D9", color: "pink" },
  { id: "wait2", label: "esperar 1 segundo", detail: "manter o LED desligado", color: "orange" },
  { id: "read", label: "ler botão D2", detail: "entrada não utilizada agora", color: "blue" },
  { id: "fast", label: "esperar 0 segundo", detail: "mudança rápida demais", color: "orange" },
];

const blinkExpected = ["setup", "repeat", "on", "wait1", "off", "wait2"];

const trafficBlocks: Block[] = [
  { id: "repeat", label: "repetir sempre", detail: "iniciar o ciclo", color: "violet" },
  { id: "redOn", label: "vermelho ligado", detail: "D9 ligado", color: "pink" },
  { id: "redWait", label: "esperar 4 segundos", detail: "trânsito parado", color: "orange" },
  { id: "redOff", label: "vermelho desligado", detail: "D9 desligado", color: "pink" },
  { id: "greenOn", label: "verde ligado", detail: "D10 ligado", color: "green" },
  { id: "greenWait", label: "esperar 4 segundos", detail: "trânsito liberado", color: "orange" },
  { id: "greenOff", label: "verde desligado", detail: "D10 desligado", color: "green" },
  { id: "yellowOn", label: "amarelo ligado", detail: "D11 ligado", color: "orange" },
  { id: "yellowWait", label: "esperar 2 segundos", detail: "atenção", color: "orange" },
  { id: "yellowOff", label: "amarelo desligado", detail: "D11 desligado", color: "orange" },
  { id: "allOn", label: "ligar todas as luzes", detail: "comando inseguro", color: "pink" },
];

const trafficExpected = ["repeat", "redOn", "redWait", "redOff", "greenOn", "greenWait", "greenOff", "yellowOn", "yellowWait", "yellowOff"];

function canonicalEdge(first: string, second: string) {
  return [first, second].sort().join("|");
}

function normalizedEdges(edges: string[]) {
  return edges.map((edge) => {
    const [first, second] = edge.split("|");
    return canonicalEdge(first, second);
  });
}

function formatTime(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function playTone(kind: "ok" | "no" | "step", enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = kind === "ok" ? 740 : kind === "no" ? 210 : 430;
  gain.gain.setValueAtTime(0.06, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
}

function StageFrame({ stage, index, children }: { stage: Stage; index: number; children: React.ReactNode }) {
  return (
    <section className={styles.stage} aria-labelledby="stage-title">
      <div className={styles.stageHeading}>
        <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p>MISSÃO {index + 1} DE {stages.length} · {stage.time} MINUTOS</p>
          <h1 id="stage-title">{stage.title}</h1>
          <span>{stage.description}</span>
        </div>
      </div>
      {children}
    </section>
  );
}

function ComponentsMission({ onComplete, sound }: { onComplete: () => void; sound: boolean }) {
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState("Conversem em dupla e escolham uma resposta.");
  const [done, setDone] = useState(false);
  const current = componentQuestions[question];

  function answer(option: number) {
    setSelected(option);
    if (option === current.correct) {
      setMessage(current.explanation);
      playTone("ok", sound);
      return;
    }
    setMessage("Ainda não. Pensem no papel desse componente durante a montagem.");
    playTone("no", sound);
  }

  function next() {
    if (selected !== current.correct) return;
    if (question === componentQuestions.length - 1) {
      setDone(true);
      return;
    }
    setQuestion((value) => value + 1);
    setSelected(null);
    setMessage("Conversem em dupla e escolham uma resposta.");
  }

  return (
    <div className={styles.discoveryGrid}>
      <div className={styles.componentRail} aria-label="Componentes da bancada">
        {componentQuestions.map((item, index) => (
          <button className={`${styles.componentCard} ${index === question ? styles.activeCard : ""} ${index < question || done ? styles.completedCard : ""}`} key={item.name} onClick={() => index <= question && setQuestion(index)}>
            <span>{index < question || done ? "✓" : item.icon}</span>
            <strong>{item.name}</strong>
          </button>
        ))}
      </div>
      <div className={styles.discoveryPanel}>
        {!done ? (
          <>
            <div className={styles.largeComponent} aria-hidden="true">{current.icon}</div>
            <p className={styles.kicker}>COMPONENTE {question + 1}</p>
            <h2>{current.name}</h2>
            <p className={styles.question}>{current.prompt}</p>
            <div className={styles.answerList}>
              {current.options.map((option, index) => (
                <button className={selected === index ? (index === current.correct ? styles.correctAnswer : styles.wrongAnswer) : ""} key={option} onClick={() => answer(index)}>{option}</button>
              ))}
            </div>
            <div className={styles.feedback}>{message}</div>
            <button className={styles.primaryButton} disabled={selected !== current.correct} onClick={next}>{question === componentQuestions.length - 1 ? "Concluir investigação" : "Próximo componente"}</button>
          </>
        ) : (
          <div className={styles.successPanel}>
            <span>✦</span>
            <p className={styles.kicker}>BANCADA RECONHECIDA</p>
            <h2>Vocês já podem iniciar a montagem</h2>
            <p>Arduino, protoboard, LED, resistor e botão possuem funções diferentes e trabalham juntos no mesmo sistema.</p>
            <button className={styles.primaryButton} onClick={onComplete}>Receber pontuação</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CircuitBoard({ mode, onComplete, sound }: { mode: WireMode; onComplete: () => void; sound: boolean }) {
  const visibleIds = useMemo(() => {
    if (mode === "led") return new Set(["d9", "gnd", "rr1", "rr2", "ra", "rk"]);
    if (mode === "traffic") return new Set(["d9", "d10", "d11", "gnd", "rr1", "rr2", "ra", "rk", "rg1", "rg2", "ga", "gk", "ry1", "ry2", "ya", "yk"]);
    return new Set(terminals.map((terminal) => terminal.id));
  }, [mode]);
  const required = useMemo(() => normalizedEdges(mode === "led" ? redEdges : mode === "traffic" ? trafficEdges : pedestrianEdges), [mode]);
  const initial = useMemo(() => mode === "pedestrian" ? normalizedEdges(trafficEdges) : [], [mode]);
  const [wires, setWires] = useState<string[]>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("Clique em dois terminais para criar um fio.");
  const [validated, setValidated] = useState(false);
  const [simState, setSimState] = useState<SimState>("off");
  const [cycle, setCycle] = useState(false);

  useEffect(() => {
    if (!cycle) return;
    const states: SimState[] = mode === "led" ? ["red", "off"] : mode === "pedestrian" ? ["yellow", "red", "walk", "green"] : ["red", "green", "yellow"];
    let index = 0;
    setSimState(states[index]);
    const timer = window.setInterval(() => {
      index = (index + 1) % states.length;
      setSimState(states[index]);
    }, mode === "pedestrian" ? 1100 : 900);
    return () => window.clearInterval(timer);
  }, [cycle, mode]);

  const visibleTerminals = terminals.filter((terminal) => visibleIds.has(terminal.id));
  const byId = new Map(terminals.map((terminal) => [terminal.id, terminal]));
  const addedWires = wires.filter((wire) => !initial.includes(wire));
  const correctCount = required.filter((edge) => wires.includes(edge)).length;

  function selectTerminal(id: string) {
    if (validated) return;
    if (!selected) {
      setSelected(id);
      setMessage(`Terminal ${byId.get(id)?.label} selecionado. Escolha o segundo terminal.`);
      playTone("step", sound);
      return;
    }
    if (selected === id) {
      setSelected(null);
      setMessage("Seleção cancelada.");
      return;
    }
    const edge = canonicalEdge(selected, id);
    if (wires.includes(edge)) {
      setSelected(null);
      setMessage("Esses terminais já estão conectados.");
      return;
    }
    setWires((value) => [...value, edge]);
    setSelected(null);
    setMessage("Fio conectado. Continue montando o circuito.");
    playTone("step", sound);
  }

  function removeWire(edge: string) {
    if (validated || initial.includes(edge)) return;
    setWires((value) => value.filter((item) => item !== edge));
    setMessage("Fio removido.");
    setSelected(null);
  }

  function validate() {
    const extras = addedWires.filter((edge) => !required.includes(edge));
    const missing = required.filter((edge) => !wires.includes(edge));
    if (missing.length || extras.length) {
      setMessage(extras.length ? "Há pelo menos um fio em posição incorreta. Remova-o e teste novamente." : `Faltam ${missing.length} conexões para fechar o circuito.`);
      playTone("no", sound);
      return;
    }
    setValidated(true);
    setCycle(true);
    setMessage(mode === "led" ? "Circuito correto. O LED pisca durante a simulação." : mode === "traffic" ? "Circuito correto. Os três LEDs respondem separadamente." : "Sistema correto. Pressione o botão virtual para testar a travessia.");
    playTone("ok", sound);
  }

  function reset() {
    setWires(initial);
    setSelected(null);
    setValidated(false);
    setCycle(false);
    setSimState("off");
    setMessage("Bancada reiniciada. Clique em dois terminais para criar um fio.");
  }

  return (
    <div className={styles.workbenchLayout}>
      <div className={styles.boardPanel}>
        <div className={styles.boardToolbar}>
          <div><span className={styles.statusDot} data-running={cycle} /><strong>{cycle ? "SIMULAÇÃO ATIVA" : "SIMULAÇÃO PARADA"}</strong></div>
          <div><span>{correctCount}/{required.length} conexões corretas</span><button onClick={reset}>Reiniciar</button></div>
        </div>
        <svg className={styles.board} viewBox="0 0 900 510" role="img" aria-label="Bancada virtual com Arduino, protoboard e componentes">
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <pattern id="holes" width="30" height="25" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.5" fill="#cad1df" opacity=".42" /></pattern>
          </defs>
          <rect x="18" y="40" width="190" height="405" rx="26" fill="#167b94" stroke="#39e1e3" strokeWidth="3" />
          <rect x="49" y="76" width="92" height="66" rx="8" fill="#d5dbe5" opacity=".92" />
          <rect x="60" y="88" width="70" height="42" rx="5" fill="#556176" />
          <rect x="55" y="205" width="80" height="118" rx="9" fill="#10283a" />
          <circle cx="75" cy="356" r="19" fill="#d4ac4e" />
          <text x="113" y="410" fill="#d9feff" fontSize="22" fontWeight="800" textAnchor="middle">ARDUINO</text>
          <rect x="250" y="35" width="620" height="425" rx="30" fill="#edf0f4" stroke="#c5ccda" strokeWidth="4" />
          <rect x="278" y="65" width="564" height="360" rx="18" fill="url(#holes)" />
          <line x1="278" y1="195" x2="842" y2="195" stroke="#a9b4c5" strokeWidth="2" />
          <line x1="278" y1="295" x2="842" y2="295" stroke="#a9b4c5" strokeWidth="2" />
          <line x1="278" y1="395" x2="842" y2="395" stroke="#a9b4c5" strokeWidth="2" />
          <text x="815" y="93" fill="#68758d" fontSize="16" fontWeight="700">PROTOBOARD</text>
          {(mode === "led" || mode === "traffic" || mode === "pedestrian") && <>
            <rect x="345" y="130" width="80" height="30" rx="10" fill="#eacb8f" stroke="#7b552d" strokeWidth="2" />
            <line x1="366" y1="130" x2="366" y2="160" stroke="#714624" strokeWidth="5" /><line x1="386" y1="130" x2="386" y2="160" stroke="#d85245" strokeWidth="5" /><line x1="406" y1="130" x2="406" y2="160" stroke="#714624" strokeWidth="5" />
            <path d="M500 145 Q552 76 605 145 L605 167 L500 167 Z" fill={simState === "red" || simState === "walk" ? "#ff4c45" : "#913b45"} stroke="#682630" strokeWidth="3" filter={simState === "red" || simState === "walk" ? "url(#glow)" : undefined} />
            <text x="552" y="117" fill="#662430" fontSize="14" fontWeight="800" textAnchor="middle">VERMELHO</text>
          </>}
          {(mode === "traffic" || mode === "pedestrian") && <>
            <rect x="345" y="230" width="80" height="30" rx="10" fill="#eacb8f" stroke="#7b552d" strokeWidth="2" />
            <line x1="366" y1="230" x2="366" y2="260" stroke="#714624" strokeWidth="5" /><line x1="386" y1="230" x2="386" y2="260" stroke="#d85245" strokeWidth="5" /><line x1="406" y1="230" x2="406" y2="260" stroke="#714624" strokeWidth="5" />
            <path d="M500 245 Q552 176 605 245 L605 267 L500 267 Z" fill={simState === "green" ? "#39dc87" : "#3f775d"} stroke="#285542" strokeWidth="3" filter={simState === "green" ? "url(#glow)" : undefined} />
            <text x="552" y="217" fill="#285542" fontSize="14" fontWeight="800" textAnchor="middle">VERDE</text>
            <rect x="345" y="330" width="80" height="30" rx="10" fill="#eacb8f" stroke="#7b552d" strokeWidth="2" />
            <line x1="366" y1="330" x2="366" y2="360" stroke="#714624" strokeWidth="5" /><line x1="386" y1="330" x2="386" y2="360" stroke="#d85245" strokeWidth="5" /><line x1="406" y1="330" x2="406" y2="360" stroke="#714624" strokeWidth="5" />
            <path d="M500 345 Q552 276 605 345 L605 367 L500 367 Z" fill={simState === "yellow" ? "#ffe24d" : "#9a823a"} stroke="#665522" strokeWidth="3" filter={simState === "yellow" ? "url(#glow)" : undefined} />
            <text x="552" y="317" fill="#665522" fontSize="14" fontWeight="800" textAnchor="middle">AMARELO</text>
          </>}
          {mode === "pedestrian" && <>
            <rect x="350" y="404" width="110" height="62" rx="14" fill="#646f87" stroke="#30384d" strokeWidth="3" />
            <circle cx="405" cy="435" r="22" fill={simState === "walk" ? "#36e6e2" : "#262e40"} stroke="#151b2a" strokeWidth="3" />
            <text x="405" y="490" fill="#68758d" fontSize="14" fontWeight="800" textAnchor="middle">BOTÃO</text>
            <circle cx="712" cy="435" r="44" fill={simState === "walk" ? "#ff70bd" : "#707b90"} stroke="#30384d" strokeWidth="4" />
            <circle cx="712" cy="435" r="23" fill="#273043" />
            <text x="712" y="494" fill="#68758d" fontSize="14" fontWeight="800" textAnchor="middle">BUZZER</text>
          </>}
          {wires.map((edge, index) => {
            const [firstId, secondId] = edge.split("|");
            const first = byId.get(firstId);
            const second = byId.get(secondId);
            if (!first || !second) return null;
            const color = ["#36e6e2", "#ff6fbd", "#ffe75b", "#9d82ff", "#52e09a"][index % 5];
            return <path className={styles.wire} d={`M${first.x},${first.y} C${(first.x + second.x) / 2},${first.y - 45} ${(first.x + second.x) / 2},${second.y + 45} ${second.x},${second.y}`} fill="none" stroke={color} strokeWidth="7" key={edge} />;
          })}
          {visibleTerminals.map((terminal) => (
            <g className={`${styles.terminal} ${selected === terminal.id ? styles.selectedTerminal : ""}`} key={terminal.id} role="button" tabIndex={0} aria-label={`Terminal ${terminal.label}`} onClick={() => selectTerminal(terminal.id)} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && selectTerminal(terminal.id)}>
              <circle cx={terminal.x} cy={terminal.y} r="14" fill={terminal.color} stroke="#ffffff" strokeWidth="4" />
              <text x={terminal.x} y={terminal.y - 22} fill={terminal.x < 220 ? "#d9feff" : "#3a4458"} fontSize="14" fontWeight="900" textAnchor="middle">{terminal.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <aside className={styles.inspector}>
        <p className={styles.kicker}>INSPETOR DE CONEXÕES</p>
        <h2>{mode === "led" ? "LED no pino D9" : mode === "traffic" ? "Três saídas digitais" : "Entrada e sinal sonoro"}</h2>
        <div className={styles.objectiveList}>
          {mode === "led" && <><span>D9 → resistor</span><span>resistor → positivo do LED</span><span>negativo do LED → GND</span></>}
          {mode === "traffic" && <><span>Vermelho → D9</span><span>Verde → D10</span><span>Amarelo → D11</span><span>Um resistor em cada ramo</span></>}
          {mode === "pedestrian" && <><span>Botão → D2 e GND</span><span>Buzzer → D6 e GND</span><span>Semáforo já conectado</span></>}
        </div>
        <div className={styles.wireList}>
          <strong>Fios adicionados</strong>
          {!addedWires.length && <span className={styles.emptyState}>Nenhum fio adicionado</span>}
          {addedWires.map((edge) => {
            const [first, second] = edge.split("|");
            return <button key={edge} onClick={() => removeWire(edge)} disabled={validated}><span>{byId.get(first)?.label} ↔ {byId.get(second)?.label}</span><b>×</b></button>;
          })}
        </div>
        <div className={styles.labMessage} data-success={validated}>{message}</div>
        {!validated ? <button className={styles.primaryButton} onClick={validate}>Iniciar simulação</button> : <button className={styles.primaryButton} onClick={onComplete}>Concluir montagem</button>}
      </aside>
    </div>
  );
}

function BlockProgram({ mode, onComplete, sound }: { mode: "blink" | "traffic"; onComplete: () => void; sound: boolean }) {
  const palette = mode === "blink" ? blinkBlocks : trafficBlocks;
  const expected = mode === "blink" ? blinkExpected : trafficExpected;
  const [program, setProgram] = useState<string[]>([]);
  const [message, setMessage] = useState("Selecione os blocos na ordem em que devem ser executados.");
  const [valid, setValid] = useState(false);
  const [running, setRunning] = useState(false);
  const [simState, setSimState] = useState<SimState>("off");

  useEffect(() => {
    if (!running) return;
    const states: SimState[] = mode === "blink" ? ["red", "off"] : ["red", "green", "yellow"];
    let index = 0;
    setSimState(states[index]);
    const timer = window.setInterval(() => {
      index = (index + 1) % states.length;
      setSimState(states[index]);
    }, mode === "blink" ? 800 : 1100);
    return () => window.clearInterval(timer);
  }, [mode, running]);

  const available = palette.filter((block) => !program.includes(block.id));

  function addBlock(id: string) {
    if (valid) return;
    setProgram((value) => [...value, id]);
    setMessage("Bloco adicionado. Verifiquem a sequência antes de testar.");
    playTone("step", sound);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= program.length || valid) return;
    setProgram((value) => {
      const next = [...value];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(id: string) {
    if (valid) return;
    setProgram((value) => value.filter((item) => item !== id));
  }

  function validate() {
    const correct = program.length === expected.length && program.every((id, index) => id === expected[index]);
    if (!correct) {
      const firstWrong = expected.findIndex((id, index) => program[index] !== id);
      setMessage(firstWrong === -1 ? "Há um bloco que não pertence ao programa. Removam o comando excedente." : program.length < expected.length && firstWrong === program.length ? "Ainda falta pelo menos um bloco." : `Revisem o bloco da posição ${firstWrong + 1}. A ordem modifica o comportamento do circuito.`);
      playTone("no", sound);
      return;
    }
    setValid(true);
    setRunning(true);
    setMessage(mode === "blink" ? "Programa correto. O LED alterna entre ligado e desligado." : "Programa correto. O semáforo executa vermelho, verde e amarelo com tempos distintos.");
    playTone("ok", sound);
  }

  return (
    <div className={styles.codeLayout}>
      <aside className={styles.palette}>
        <p className={styles.kicker}>BLOCOS DISPONÍVEIS</p>
        <h2>Comandos</h2>
        <div>
          {available.map((block) => <button className={`${styles.codeBlock} ${styles[block.color]}`} key={block.id} onClick={() => addBlock(block.id)}><strong>{block.label}</strong><span>{block.detail}</span></button>)}
        </div>
        {!available.length && <p className={styles.emptyState}>Todos os blocos estão no programa.</p>}
      </aside>
      <div className={styles.programPanel}>
        <div className={styles.programHeader}><div><p className={styles.kicker}>PROGRAMA DA EQUIPE</p><h2>Sequência de execução</h2></div><span>{program.length}/{expected.length}</span></div>
        <div className={styles.programDrop}>
          {!program.length && <div className={styles.dropHint}>Clique nos blocos da coluna ao lado para montar o programa.</div>}
          {program.map((id, index) => {
            const block = palette.find((item) => item.id === id)!;
            return (
              <div className={`${styles.programLine} ${styles[block.color]}`} key={id}>
                <span className={styles.lineNumber}>{index + 1}</span>
                <div><strong>{block.label}</strong><small>{block.detail}</small></div>
                <div className={styles.lineActions}><button aria-label="Mover para cima" onClick={() => move(index, -1)}>↑</button><button aria-label="Mover para baixo" onClick={() => move(index, 1)}>↓</button><button aria-label="Remover bloco" onClick={() => remove(id)}>×</button></div>
              </div>
            );
          })}
        </div>
        <div className={styles.labMessage} data-success={valid}>{message}</div>
        <div className={styles.programActions}><button className={styles.secondaryButton} disabled={valid || !program.length} onClick={() => setProgram([])}>Limpar</button>{!valid ? <button className={styles.primaryButton} onClick={validate}>Testar programa</button> : <button className={styles.primaryButton} onClick={onComplete}>Concluir programação</button>}</div>
      </div>
      <aside className={styles.simulatorPanel}>
        <div className={styles.simulatorScreen}>
          {mode === "blink" ? (
            <div className={`${styles.singleLed} ${simState === "red" ? styles.litRed : ""}`}><i /><span>LED D9</span></div>
          ) : (
            <div className={styles.trafficLight}>
              <i className={simState === "red" ? styles.litRed : ""} />
              <i className={simState === "yellow" ? styles.litYellow : ""} />
              <i className={simState === "green" ? styles.litGreen : ""} />
            </div>
          )}
          <span className={styles.runLabel}>{running ? "EXECUTANDO" : "AGUARDANDO TESTE"}</span>
        </div>
        {valid && <div className={styles.generatedCode}><strong>Código gerado</strong><pre>{mode === "blink" ? "pinMode(9, OUTPUT);\n\nwhile (true) {\n  digitalWrite(9, HIGH);\n  delay(1000);\n  digitalWrite(9, LOW);\n  delay(1000);\n}" : "while (true) {\n  faseVermelha(4000);\n  faseVerde(4000);\n  faseAmarela(2000);\n}"}</pre></div>}
      </aside>
    </div>
  );
}

function PedestrianMission({ onComplete, sound }: { onComplete: () => void; sound: boolean }) {
  const [wired, setWired] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [tested, setTested] = useState(false);
  const options = [
    "Ligar verde para os carros e tocar o buzzer ao mesmo tempo.",
    "Ligar amarelo, parar os carros no vermelho, sinalizar a travessia e depois retomar o ciclo.",
    "Apagar todas as luzes e aguardar outro toque no botão.",
  ];

  if (!wired) return <CircuitBoard mode="pedestrian" onComplete={() => setWired(true)} sound={sound} />;

  function test() {
    if (choice !== 1) {
      setTested(false);
      playTone("no", sound);
      return;
    }
    setTested(true);
    playTone("ok", sound);
  }

  return (
    <div className={styles.finalChallenge}>
      <div className={styles.pedestrianScene}>
        <div className={styles.street}>
          <div className={styles.crosswalk}><i /><i /><i /><i /><i /></div>
          <span className={styles.car}>🚙</span>
          <span className={styles.person}>🚶</span>
          <div className={styles.miniLight}><i className={tested ? styles.litRed : ""} /><i /><i className={tested ? "" : styles.litGreen} /></div>
        </div>
        <button className={styles.pedestrianButton} onClick={() => choice === 1 && setTested(true)} disabled={!tested}>PRESSIONAR BOTÃO</button>
      </div>
      <div className={styles.logicPanel}>
        <p className={styles.kicker}>DECISÃO DO SISTEMA</p>
        <h2>O que deve ocorrer após o botão ser pressionado?</h2>
        <p>Escolham a sequência que mantém carros e pedestres em estados seguros.</p>
        <div className={styles.logicOptions}>
          {options.map((option, index) => <button className={choice === index ? styles.selectedLogic : ""} key={option} onClick={() => { setChoice(index); setTested(false); }}>{option}</button>)}
        </div>
        <div className={styles.labMessage} data-success={tested}>{tested ? "Sistema aprovado. O botão interrompe o ciclo de forma controlada e libera a travessia com sinal sonoro." : choice !== null && choice !== 1 ? "Essa sequência cria uma situação insegura. Revisem quem pode avançar em cada momento." : "Montem a lógica, executem o teste e observem a travessia."}</div>
        {!tested ? <button className={styles.primaryButton} disabled={choice === null} onClick={test}>Executar teste final</button> : <button className={styles.primaryButton} onClick={onComplete}>Finalizar protótipo</button>}
      </div>
    </div>
  );
}

function TeacherPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="teacher-title">
      <section className={styles.teacherPanel}>
        <button className={styles.closeButton} aria-label="Fechar orientações" onClick={onClose}>×</button>
        <p className={styles.kicker}>ROTEIRO PARA APLICAÇÃO</p>
        <h2 id="teacher-title">Oficina de prototipagem de 120 minutos</h2>
        <p>A proposta foi planejada para crianças de 10 anos, organizadas em duplas. Cada dupla utiliza um computador e toma as decisões em conjunto.</p>
        <div className={styles.teacherTimeline}>
          <div><strong>5 min</strong><span>Apresentação do desafio, formação das duplas e escolha do nome da equipe.</span></div>
          {stages.map((stage) => <div key={stage.short}><strong>{stage.time} min</strong><span>{stage.title}: {stage.description}</span></div>)}
          <div><strong>10 min</strong><span>Comparação dos protótipos, discussão sobre segurança e registro do que foi aprendido.</span></div>
        </div>
        <div className={styles.teacherSummary}><span><strong>Tempo total</strong>120 minutos</span><span><strong>Organização</strong>duplas</span><span><strong>Pré-requisito</strong>nenhum</span></div>
        <p className={styles.teacherNote}>As conexões incorretas não eliminam a equipe. O simulador informa que há um problema, mantém a montagem disponível e permite novas tentativas. Recomenda-se solicitar que uma criança opere o mouse e a outra explique cada decisão, invertendo os papéis após a terceira missão.</p>
        <button className={styles.secondaryButton} onClick={onClose}>Voltar à atividade</button>
      </section>
    </div>
  );
}

function StageComplete({ stage, reward, onContinue }: { stage: Stage; reward: typeof balloonRewards[number] | null; onContinue: () => void }) {
  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <section className={styles.completePanel}>
        {reward ? <span className={styles.balloon} style={{ filter: reward.filter }} role="img" aria-label={`Balão ${reward.color}`}>🎈</span> : <span className={styles.completionStar}>✦</span>}
        <p className={styles.kicker}>MISSÃO CONCLUÍDA</p>
        <h2 id="complete-title">{reward ? "Vocês ganharam um balão!" : "Protótipo validado"}</h2>
        <p>{stage.title} foi concluída com sucesso.</p>
        <strong className={styles.points}>+ {stage.points} pontos</strong>
        <button className={styles.primaryButton} onClick={onContinue}>Continuar</button>
      </section>
    </div>
  );
}

export default function CircuitLab() {
  const [screen, setScreen] = useState<Screen>("start");
  const [teamName, setTeamName] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [seconds, setSeconds] = useState(120 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const stage = stages[stageIndex];
  const reward = balloonRewards.find((item) => item.stage === stageIndex) ?? null;
  const rank = score >= 7600 ? "Engenheiros do Futuro" : score >= 6000 ? "Inventores de Circuitos" : "Exploradores da Eletrônica";

  useEffect(() => {
    if (!timerRunning || screen !== "lab" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [screen, seconds, timerRunning]);

  function start() {
    setTeamName(teamName.trim() || "Equipe LUMI");
    setScreen("lab");
    setTimerRunning(true);
  }

  function completeStage() {
    setScore((value) => value + stage.points);
    if (reward) setBalloons((value) => value + 1);
    setCompleted(true);
  }

  function advance() {
    setCompleted(false);
    if (stageIndex === stages.length - 1) {
      setTimerRunning(false);
      setScreen("finish");
      return;
    }
    setStageIndex((value) => value + 1);
  }

  function restart() {
    setScreen("start");
    setTeamName("");
    setStageIndex(0);
    setScore(0);
    setBalloons(0);
    setCompleted(false);
    setSeconds(120 * 60);
    setTimerRunning(false);
  }

  return (
    <main className={styles.shell}>
      <div className={styles.gridBackdrop} aria-hidden="true" />
      <header className={styles.topbar}>
        <a className={styles.brand} href="/IMDAZ/" aria-label="Voltar à página principal do IMDAZ"><span>I</span><div><strong>IMDAZ</strong><small>LABORATÓRIO DE CIRCUITOS</small></div></a>
        <div className={styles.topActions}>
          {screen === "lab" && <><div className={styles.metric}><small>PONTOS</small><strong>{score}</strong></div><div className={styles.metric}><small>BALÕES</small><strong>🎈 {balloons}/5</strong></div><button className={styles.timer} data-warning={seconds < 15 * 60} onClick={() => setTimerRunning((value) => !value)}><small>{timerRunning ? "TEMPO RESTANTE" : "TEMPO PAUSADO"}</small><strong>{formatTime(seconds)}</strong></button></>}
          <button className={styles.iconButton} onClick={() => setSound((value) => !value)} aria-label={sound ? "Desativar sons" : "Ativar sons"}>{sound ? "♪" : "×♪"}</button>
          <button className={styles.teacherButton} onClick={() => setTeacherOpen(true)}>Área do professor</button>
        </div>
      </header>

      {screen === "start" && (
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>OFICINA INTERATIVA · 120 MINUTOS</p>
            <h1>Projete um <em>semáforo inteligente</em> na bancada virtual.</h1>
            <p className={styles.heroText}>Conecte componentes, organize blocos de programação, execute simulações e construa uma travessia segura para pedestres.</p>
            <label className={styles.teamInput}><span>Nome da equipe</span><div><input value={teamName} maxLength={24} placeholder="Ex.: Inventoras Digitais" onChange={(event) => setTeamName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && start()} /><button onClick={start}>ABRIR BANCADA</button></div></label>
            <div className={styles.heroFacts}><span><strong>2</strong> crianças por equipe</span><span><strong>6</strong> missões práticas</span><span><strong>5</strong> balões</span></div>
            <a className={styles.backLink} href="/IMDAZ/">← Voltar à Missão IA</a>
          </div>
          <div className={styles.heroBench} aria-label="Representação de uma bancada de circuitos">
            <div className={styles.heroArduino}><span>ARDUINO</span><i /><i /><i /><b /></div>
            <div className={styles.heroBreadboard}>
              <div className={`${styles.heroLed} ${styles.redLed}`} /><div className={`${styles.heroLed} ${styles.yellowLed}`} /><div className={`${styles.heroLed} ${styles.greenLed}`} />
              <div className={styles.heroResistor} /><div className={styles.heroResistor} /><div className={styles.heroResistor} />
            </div>
            <svg viewBox="0 0 520 330" aria-hidden="true"><path d="M145 105 C230 30 290 95 375 80" /><path d="M145 165 C225 150 295 165 375 160" /><path d="M145 225 C230 300 300 230 375 240" /></svg>
            <div className={styles.heroStatus}><span /><div><small>PROJETO</small><strong>AGUARDANDO EQUIPE</strong></div></div>
          </div>
        </section>
      )}

      {screen === "lab" && (
        <>
          <nav className={styles.progressMap} aria-label="Progresso da oficina">
            {stages.map((item, index) => <div className={`${styles.progressNode} ${index < stageIndex ? styles.nodeDone : ""} ${index === stageIndex ? styles.nodeActive : ""}`} key={item.short}><span>{index < stageIndex ? "✓" : index + 1}</span><small>{item.short}</small><b>{item.time} min</b></div>)}
          </nav>
          <div className={styles.teamStrip}><span>EQUIPE</span><strong>{teamName}</strong><i /><span>BANCADA</span><strong>{stageIndex + 1}/{stages.length}</strong></div>
          <div className={styles.stageContainer} key={stageIndex}>
            <StageFrame stage={stage} index={stageIndex}>
              {stageIndex === 0 && <ComponentsMission onComplete={completeStage} sound={sound} />}
              {stageIndex === 1 && <CircuitBoard mode="led" onComplete={completeStage} sound={sound} />}
              {stageIndex === 2 && <BlockProgram mode="blink" onComplete={completeStage} sound={sound} />}
              {stageIndex === 3 && <CircuitBoard mode="traffic" onComplete={completeStage} sound={sound} />}
              {stageIndex === 4 && <BlockProgram mode="traffic" onComplete={completeStage} sound={sound} />}
              {stageIndex === 5 && <PedestrianMission onComplete={completeStage} sound={sound} />}
            </StageFrame>
          </div>
        </>
      )}

      {screen === "finish" && (
        <section className={styles.finish}>
          <div className={styles.finishSparkles}>✦ · ◇ · ✦ · ◈ · ✦ · ◇ · ✦</div>
          <p className={styles.kicker}>PROTÓTIPO APROVADO</p>
          <h1>{rank}</h1>
          <p>A equipe <strong>{teamName}</strong> construiu e testou um semáforo inteligente com sinalização para pedestres.</p>
          <div className={styles.balloonCollection}>{balloonRewards.map((item) => <span key={item.color} style={{ filter: item.filter }} role="img" aria-label={`Balão ${item.color}`}>🎈</span>)}<strong>5 balões conquistados</strong></div>
          <div className={styles.finalMetrics}><span><small>PONTUAÇÃO</small><strong>{score}</strong></span><span><small>TEMPO UTILIZADO</small><strong>{formatTime(120 * 60 - seconds)}</strong></span></div>
          <div className={styles.learningGrid}><span>▣ <strong>Componentes</strong></span><span>⌁ <strong>Conexões</strong></span><span>▤ <strong>Programação</strong></span><span>▷ <strong>Simulação</strong></span><span>✓ <strong>Segurança</strong></span></div>
          <div className={styles.reflection}><strong>Conversa final de 10 minutos</strong><p>Qual erro foi mais difícil de identificar? Por que o resistor é necessário? Como o programa impede que carros e pedestres avancem ao mesmo tempo?</p></div>
          <div className={styles.finishActions}><button className={styles.primaryButton} onClick={() => window.print()}>Imprimir certificado</button><button className={styles.secondaryButton} onClick={restart}>Nova equipe</button><a href="/IMDAZ/">Voltar ao IMDAZ</a></div>
        </section>
      )}

      {teacherOpen && <TeacherPanel onClose={() => setTeacherOpen(false)} />}
      {completed && <StageComplete stage={stage} reward={reward} onContinue={advance} />}
      <footer className={styles.footer}><span>IMDAZ · Laboratório de Circuitos</span><span>Nenhum dado é enviado ou armazenado</span></footer>
    </main>
  );
}
