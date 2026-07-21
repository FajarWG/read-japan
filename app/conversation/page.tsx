"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Phone, PhoneOff, Loader2, Mic, Volume2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

// 3D avatar is client-only + heavy (three.js). Load it lazily so it never
// ships to other routes or runs during SSR.
const VRMAvatar = dynamic(() => import("./VRMAvatar"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 size={24} className="animate-spin text-accent/60" />
    </div>
  ),
});

type Status = "idle" | "connecting" | "connected" | "disconnecting";

interface Transcript {
  id: number;
  speaker: "user" | "ai";
  text: string;
}

interface ConversationTopic {
  id: string;
  emoji: string;
  label: { id: string; en: string };
  focus: string;
  greeting: string;
}

const TOPICS: ConversationTopic[] = [
  {
    id: "free",
    emoji: "💬",
    label: { id: "Ngobrol Bebas", en: "Free Talk" },
    focus: "Topik bebas: ngobrol santai seputar kehidupan sehari-hari, tidak ada topik khusus.",
    greeting: "こんにちは。",
  },
  {
    id: "intro",
    emoji: "🙋",
    label: { id: "Perkenalan Diri", en: "Self Introduction" },
    focus: "Fokus topik: perkenalan diri. Tanyakan nama, asal, pekerjaan/sekolah, dan hobi siswa satu per satu.",
    greeting: "はじめまして。",
  },
  {
    id: "restaurant",
    emoji: "🍜",
    label: { id: "Di Restoran", en: "At a Restaurant" },
    focus: "Fokus topik: kamu berperan sebagai pelayan restoran. Sambut siswa, tanyakan mau pesan apa, dan rekomendasikan menu sederhana.",
    greeting: "いらっしゃいませ。",
  },
  {
    id: "shopping",
    emoji: "🛍️",
    label: { id: "Belanja", en: "Shopping" },
    focus: "Fokus topik: kamu berperan sebagai penjaga toko. Bahas barang yang dicari siswa, harga, ukuran, atau warna.",
    greeting: "いらっしゃいませ。何をお探しですか。",
  },
  {
    id: "directions",
    emoji: "🗺️",
    label: { id: "Tanya Arah", en: "Asking Directions" },
    focus: "Fokus topik: siswa sedang bertanya arah ke suatu tempat (stasiun, toko, restoran). Beri arahan sederhana level N5.",
    greeting: "こんにちは。どこに行きたいですか。",
  },
  {
    id: "hobby",
    emoji: "🎨",
    label: { id: "Hobi & Liburan", en: "Hobbies & Weekend" },
    focus: "Fokus topik: obrolan tentang hobi, akhir pekan, dan liburan siswa.",
    greeting: "しゅみは何ですか。",
  },
];

interface Character {
  id: string;
  name: string;
  model: string;
  /** Injected into the system prompt so the AI role-plays this persona. */
  persona: string;
  /** Prebuilt Gemini voice that best fits the character. */
  voice: string;
}

// VRM models live in /public/models. Each character maps to one file.
const CHARACTERS: Character[] = [
  {
    id: "aoi",
    name: "葵 あおい (Aoi)",
    model: "/models/aoi.vrm",
    persona: "Namamu 葵あおい (Aoi), gadis yang tenang, kalem, dan dewasa. Bicara lembut, sopan, dan menenangkan.",
    voice: "Leda",
  },
  {
    id: "hinata",
    name: "陽向 ひなた (Hinata)",
    model: "/models/hinata.vrm",
    persona: "Namamu 陽向ひなた (Hinata), gadis yang ramah dan keibuan. Bicara hangat, sabar, dan perhatian seperti kakak.",
    voice: "Kore",
  },
  {
    id: "yuki",
    name: "結城 ゆき (Yuki)",
    model: "/models/yuki.glb",
    persona: "Namamu 結城ゆき (Yuki), gadis yang cool dan sedikit pemalu tapi sopan. Bicara singkat, tenang, dan tulus.",
    voice: "Zephyr",
  },
];

interface ConvMode {
  id: string;
  label: string;
  model: string;
  /** Native-audio models accept a thinking budget; half-cascade ones don't. */
  nativeAudio: boolean;
  hint: { id: string; en: string };
}

// Different Gemini Live backends — let the user compare voice quality vs
// responsiveness. If a mode fails to connect, its model ID may need updating
// (watch the debug log for the WS close reason).
const MODES: ConvMode[] = [
  {
    id: "natural",
    label: "Natural",
    model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
    nativeAudio: true,
    hint: { id: "Suara paling natural, tapi bisa melambat saat ngobrol lama", en: "Most natural voice, may slow down over long chats" },
  },
  {
    id: "fluent",
    label: "Lancar",
    model: "models/gemini-live-2.5-flash-preview",
    nativeAudio: false,
    hint: { id: "Lebih responsif untuk sesi panjang (suara sedikit kurang hidup)", en: "Snappier for long sessions (slightly less lively voice)" },
  },
  {
    id: "stable",
    label: "Stabil",
    model: "models/gemini-2.0-flash-live-001",
    nativeAudio: false,
    hint: { id: "Paling stabil & latency rendah", en: "Most stable, lowest latency" },
  },
];

export default function ConversationPage() {
  const { lang } = useLanguage();

  const [status, setStatus] = useState<Status>("idle");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const [characterId, setCharacterId] = useState(CHARACTERS[0].id);
  const character = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];
  const [modeId, setModeId] = useState(MODES[0].id);
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const [lookAtCursor, setLookAtCursor] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptIdRef = useRef(0);
  const statusRef = useRef<Status>("idle");

  const addDebug = useCallback((msg: string) => {
    setDebugLog((prev) => [...prev.slice(-20), `[${new Date().toISOString().slice(11, 23)}] ${msg}`]);
  }, []);

  const addTranscript = useCallback((speaker: "user" | "ai", text: string) => {
    transcriptIdRef.current += 1;
    setTranscripts((prev) => [
      ...prev,
      { id: transcriptIdRef.current, speaker, text },
    ]);
  }, []);

  const stopConversation = useCallback(() => {
    addDebug("Cleaning up...");
    statusRef.current = "idle";
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close();
      playbackCtxRef.current = null;
      analyserRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    setStatus("idle");
    setUserSpeaking(false);
  }, [addDebug]);

  useEffect(() => {
    return () => stopConversation();
  }, [stopConversation]);

  const startConversation = useCallback(async () => {
    setError(null);
    setDebugLog([]);
    setTranscripts([]);
    setStatus("connecting");
    statusRef.current = "connecting";
    addDebug("Starting...");

    try {
      const res = await fetch("/api/live/session");
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Failed to get session");
      }

      const data = (await res.json()) as { apiKey?: string };
      if (!data.apiKey) throw new Error("No API key returned");

      const apiKey = data.apiKey;
      addDebug("Got API key");

      // Open WebSocket to Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      addDebug("Connecting WS...");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let greetingSent = false;
      const sendGreeting = () => {
        if (greetingSent || ws.readyState !== WebSocket.OPEN) return;
        greetingSent = true;
        addDebug("Sending greeting text...");
        ws.send(JSON.stringify({
          clientContent: {
            turns: [{
              role: "user",
              parts: [{ text: topic.greeting }],
            }],
            turnComplete: true,
          },
        }));
      };

      ws.onopen = () => {
        addDebug(`WS opened, sending setup (${mode.label})`);
        const generationConfig: Record<string, unknown> = {
          temperature: 0.8,
          maxOutputTokens: 1024,
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: character.voice },
            },
          },
        };
        // Only native-audio models understand a thinking budget.
        if (mode.nativeAudio) {
          generationConfig.thinkingConfig = { thinkingBudget: 0 };
        }
        ws.send(JSON.stringify({
          setup: {
            model: mode.model,
            generationConfig,
            systemInstruction: {
              parts: [{
                text: `Kamu adalah partner percakapan bahasa Jepang (日本語パートナー) untuk pelajar tingkat N5.
${character.persona}
Berbicaralah natural seperti native speaker Jepang.
Gunakan hanya kosakata dan tata bahasa level N5.
Koreksi kesalahan grammar dengan lembut dalam Bahasa Indonesia.
Dorong siswa terus berbicara dengan semangat 頑張って.
Ajukan follow-up questions sederhana.
Respon pendek 1-3 kalimat. Suara ramah dan ceria.
Jika siswa bertanya arti atau maksud suatu kata/kalimat dalam Bahasa Indonesia (misalnya "artinya apa?", "apa artinya dalam bahasa indonesia?"), jawab pertanyaan itu dengan jelas dan singkat dalam Bahasa Indonesia terlebih dahulu, baru lanjutkan lagi percakapan dalam Bahasa Jepang N5.
${topic.focus}`,
              }],
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            realtimeInputConfig: {
              automaticActivityDetection: {
                silenceDurationMs: 400,
              },
            },
            // Keep response latency flat over a long chat: compress the
            // rolling context aggressively so per-turn cost stays bounded
            // instead of growing every turn (which is what made turn 5+ lag).
            contextWindowCompression: {
              triggerTokens: 6400,
              slidingWindow: { targetTokens: 3200 },
            },
          },
        }));
      };

      const handleJsonMessage = (text: string) => {
        const msg = JSON.parse(text);
        addDebug(`← ${JSON.stringify(msg).slice(0, 150)}`);

        const sc = msg.serverContent;
        const turn = sc?.modelTurn;

        if (turn?.parts) {
          for (const part of turn.parts) {
            if (part.inlineData?.data) {
              addDebug("→ playing audio (inline)");
              playPCMAudio(part.inlineData.data);
            }
            if (part.text) {
              const t = part.text;
              // Skip internal thinking/tool text
              if (!t.startsWith("**") && !t.startsWith("I ") && !t.includes("planning")) {
                addDebug(`→ AI: ${t.slice(0, 80)}`);
                addTranscript("ai", t);
              }
            }
          }
        }

        if (msg.outputTranscription?.text) {
          addDebug(`→ AI: ${msg.outputTranscription.text.slice(0, 80)}`);
          addTranscript("ai", msg.outputTranscription.text);
        }
        if (msg.inputTranscription?.text) {
          addDebug(`→ You: ${msg.inputTranscription.text.slice(0, 80)}`);
          addTranscript("user", msg.inputTranscription.text);
          setUserSpeaking(false);
        }

        if (sc?.interrupted) {
          addDebug("→ interrupted");
          stopPCMPlayback();
        }

        if (msg.turnComplete) addDebug("→ turn complete");
        if (msg.setupComplete) {
          addDebug("→ setup complete");
          sendGreeting();
        }
      };

      ws.onmessage = async (event) => {
        try {
          // Handle text (JSON control messages)
          if (typeof event.data === "string") {
            handleJsonMessage(event.data);
            return;
          }

          // Handle binary
          let buf: ArrayBuffer;
          if (event.data instanceof Blob) {
            buf = await event.data.arrayBuffer();
          } else if (event.data instanceof ArrayBuffer) {
            buf = event.data;
          } else {
            return;
          }

          // Try JSON first (small blobs might be control messages)
          const text = new TextDecoder().decode(buf);
          try {
            const trial = JSON.parse(text);
            if (trial?.setupComplete || trial?.serverContent || trial?.toolCall || trial?.outputTranscription || trial?.inputTranscription) {
              handleJsonMessage(text);
              return;
            }
          } catch { /* not JSON */ }

          // Raw PCM audio
          if (buf.byteLength < 100) {
            addDebug(`← small blob: ${buf.byteLength}b "${text.slice(0, 60)}"`);
            return;
          }

          addDebug(`← audio: ${buf.byteLength} bytes`);
          const pcm16 = new Int16Array(buf);
          const float32 = new Float32Array(pcm16.length);
          for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;
          playFloatAudio(float32);
        } catch {
          // ignore
        }
      };

      ws.onerror = (e) => {
        addDebug("WS ERROR");
        console.error("Gemini WS error:", e);
        setError(lang === "id" ? "Koneksi terputus. Coba lagi." : "Connection lost. Try again.");
        stopConversation();
      };

      ws.onclose = (e) => {
        addDebug(`WS closed: code=${e.code} reason=${e.reason}`);
        if (statusRef.current === "connected") {
          setError(lang === "id" ? "Koneksi terputus." : "Connection dropped.");
          stopConversation();
        }
      };

      // Start microphone
      await startMicrophone(ws);
      statusRef.current = "connected";
      setStatus("connected");
      addDebug("Mic started");

      // Fallback in case setupComplete was missed for some reason
      setTimeout(sendGreeting, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      addDebug(`Error: ${msg}`);
      setError(msg);
      statusRef.current = "idle";
      setStatus("idle");
    }
  }, [lang, addTranscript, addDebug, stopConversation, topic, character, mode]);

  const startMicrophone = async (ws: WebSocket) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    streamRef.current = stream;

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = audioCtx;

    // Create a dummy gain node with zero volume to keep the graph alive
    // without feeding mic to speakers
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      // Float32 → Int16 PCM
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Int16 → base64
      const bytes = new Uint8Array(pcm16.buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      if (base64.length > 0) {
        setUserSpeaking(true);
        ws.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64,
            }],
          },
        }));
      }
    };

    source.connect(processor);
    processor.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  };

  const disconnect = () => {
    setStatus("disconnecting");
    stopConversation();
  };

  // ── PCM Playback ──────────────────────────────────
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextPlayTimeRef = useRef(0);

  // Lazily create the playback context + an AnalyserNode that the VRM avatar
  // reads for lip sync. Audio flows: source → analyser → speakers.
  const ensurePlayback = () => {
    if (!playbackCtxRef.current) {
      const ctx = new AudioContext({ sampleRate: 24000 });
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.3;
      analyser.connect(ctx.destination);
      playbackCtxRef.current = ctx;
      analyserRef.current = analyser;
      nextPlayTimeRef.current = ctx.currentTime;
      addDebug("→ AudioContext + analyser created (24kHz)");
    }
    return { ctx: playbackCtxRef.current, analyser: analyserRef.current! };
  };

  const playFloatAudio = async (float32: Float32Array) => {
    try {
      const { ctx, analyser } = ensurePlayback();
      if (ctx.state === "suspended") {
        await ctx.resume();
        addDebug("→ AudioContext resumed");
      }
      nextPlayTimeRef.current = Math.max(ctx.currentTime, nextPlayTimeRef.current);

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);

      const startTime = nextPlayTimeRef.current;
      source.start(startTime);
      nextPlayTimeRef.current = startTime + buffer.duration;
      addDebug(`→ scheduled ${float32.length}smp @ ${startTime.toFixed(3)}s (${buffer.duration.toFixed(3)}s)`);
    } catch (e) {
      addDebug(`Audio err: ${e}`);
    }
  };

  const playPCMAudio = (base64Data: string) => {
    try {
      const { ctx, analyser } = ensurePlayback();

      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);

      const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + buffer.duration;
    } catch (e) {
      addDebug(`PCM error: ${e}`);
    }
  };

  const stopPCMPlayback = () => {
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close();
      playbackCtxRef.current = null;
      analyserRef.current = null;
      nextPlayTimeRef.current = 0;
    }
  };

  // ── UI ────────────────────────────────────────────
  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-8 md:py-12">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <header className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Link href="/" className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1">
                <ArrowLeft size={12} />
                {lang === "id" ? "Kembali" : "Back to Home"}
              </Link>
              <h1 className="text-xl sm:text-2xl font-black font-jp text-foreground">
                🗣️ AI Conversation
              </h1>
              <p className="text-xs text-muted">
                Gemini 2.5 Flash Native Audio · N5
                {status !== "idle" ? ` · ${lang === "id" ? topic.label.id : topic.label.en}` : ""}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold ${
              status === "connected" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25" :
              status === "connecting" ? "bg-amber-500/10 text-amber-600 border border-amber-500/25" :
              "bg-surface-muted text-muted border border-border/40"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === "connected" ? "bg-emerald-500 animate-pulse" :
                status === "connecting" ? "bg-amber-500" : "bg-muted"
              }`} />
              {status === "connected" ? (lang === "id" ? "Terhubung" : "Connected") :
               status === "connecting" ? (lang === "id" ? "Menghubungkan..." : "Connecting...") :
               (lang === "id" ? "Siap" : "Ready")}
            </span>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        {/* 3D Avatar */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-surface/60 to-surface-muted/30">
          <VRMAvatar analyser={analyserRef} url={character.model} lookAtCursor={lookAtCursor} />

          {/* Character name badge */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-sm">
            {status === "connected" && <Volume2 size={11} className="animate-pulse" />}
            {character.name}
          </span>

          {/* Eye-tracking toggle */}
          <button
            onClick={() => setLookAtCursor((v) => !v)}
            title={lang === "id" ? "Mata mengikuti kursor" : "Eyes follow cursor"}
            className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold backdrop-blur-sm transition-all cursor-pointer ${
              lookAtCursor ? "bg-accent text-white" : "bg-black/30 text-white/70 hover:bg-black/50"
            }`}
          >
            {lookAtCursor ? <Eye size={11} /> : <EyeOff size={11} />}
            {lang === "id" ? "Tatapan" : "Gaze"}
          </button>

          {/* Character switcher — only before a call starts */}
          {status === "idle" && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {CHARACTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCharacterId(c.id)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold backdrop-blur-sm transition-all cursor-pointer ${
                    characterId === c.id
                      ? "bg-accent text-white"
                      : "bg-black/30 text-white/80 hover:bg-black/50"
                  }`}
                >
                  {c.name.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transcripts */}
        <div className="flex-1 min-h-[200px] max-h-[340px] overflow-y-auto rounded-2xl border border-border/40 bg-surface/30 p-4 space-y-3 scrollbar-none">
          {transcripts.length === 0 && status !== "connected" && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Volume2 size={28} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">
                  {lang === "id" ? "Percakapan Suara AI" : "AI Voice Conversation"}
                </h3>
                <p className="text-xs text-muted max-w-sm leading-relaxed">
                  {lang === "id"
                    ? "Klik Mulai untuk berbicara langsung dengan AI partner Jepang. Bicara natural — AI akan mendengar dan membalas dengan suara."
                    : "Click Start to talk directly with a Japanese AI partner."}
                </p>
              </div>

              {status === "idle" && (
                <div className="w-full max-w-md space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                      {lang === "id" ? "Pilih Topik Percakapan" : "Choose a Topic"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTopicId(t.id)}
                          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            topicId === t.id
                              ? "bg-accent text-white border-accent"
                              : "bg-surface-muted text-foreground border-border/40 hover:border-accent/50"
                          }`}
                        >
                          <span className="text-base">{t.emoji}</span>
                          {lang === "id" ? t.label.id : t.label.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-wider mb-2">
                      {lang === "id" ? "Mode Suara AI" : "AI Voice Mode"}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setModeId(m.id)}
                          className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            modeId === m.id
                              ? "bg-accent text-white border-accent"
                              : "bg-surface-muted text-foreground border-border/40 hover:border-accent/50"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted/70 mt-1.5 leading-relaxed">
                      {lang === "id" ? mode.hint.id : mode.hint.en}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {transcripts.map((t) => (
            <div key={t.id} className={`flex ${t.speaker === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                t.speaker === "user"
                  ? "bg-accent text-white rounded-br-md"
                  : "bg-surface-muted text-foreground rounded-bl-md border border-border/30"
              }`}>
                <div className="text-[9px] font-black tracking-wider uppercase opacity-60 mb-1">
                  {t.speaker === "user" ? "You" : "AI"}
                </div>
                <p className={`text-sm leading-relaxed ${t.speaker === "user" ? "font-semibold" : "font-jp font-medium"}`}>
                  {t.text}
                </p>
              </div>
            </div>
          ))}

          {status === "connected" && (
            <div className="flex justify-start">
              <div className="bg-surface-muted rounded-2xl rounded-bl-md px-4 py-2.5 border border-border/20">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted/40 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted/40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted/40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  <span className="text-[10px] text-muted/60 ml-1">
                    {userSpeaking
                      ? lang === "id" ? "Mendengarkan..." : "Listening..."
                      : lang === "id" ? "AI berpikir..." : "AI thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug log */}
        {debugLog.length > 0 && (
          <details className="text-[9px] font-mono text-muted/60 bg-surface/30 border border-border/30 rounded-xl p-2 max-h-32 overflow-y-auto">
            <summary className="cursor-pointer font-bold">Debug ({debugLog.length})</summary>
            {debugLog.map((line, i) => (
              <div key={i} className="truncate">{line}</div>
            ))}
          </details>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {status === "idle" && (
            <button onClick={startConversation}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Phone size={18} />
              {lang === "id" ? "Mulai Percakapan" : "Start Conversation"}
            </button>
          )}
          {status === "connecting" && (
            <button disabled className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface-muted text-muted text-sm font-extrabold cursor-wait">
              <Loader2 size={18} className="animate-spin" />
              {lang === "id" ? "Menghubungkan..." : "Connecting..."}
            </button>
          )}
          {(status === "connected" || status === "disconnecting") && (
            <>
              {userSpeaking && (
                <span className="flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse">
                  <Mic size={14} /> {lang === "id" ? "Bicara..." : "Speaking..."}
                </span>
              )}
              <button onClick={disconnect}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <PhoneOff size={18} />
                {lang === "id" ? "Akhiri" : "End Call"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-muted/50 leading-relaxed">
          {lang === "id"
            ? "Gunakan headphone. Bicara jelas — AI otomatis mendeteksi suara Anda."
            : "Use headphones. Speak clearly — AI auto-detects your voice."}
          {" · "}<span className="font-bold text-accent/60">N5 日本語</span>
        </p>
      </div>
    </div>
  );
}
