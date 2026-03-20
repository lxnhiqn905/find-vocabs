"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, options?: SpeechSynthesisOptions) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    // Chrome Android stops speech after ~15s — pause/resume trick keeps it alive
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, [stopKeepAlive]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setIsSupported(true);

    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Android Chrome: voices may load late — retry a few times
    const timers = [100, 500, 1000, 2000].map((d) => setTimeout(loadVoices, d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    stopKeepAlive();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [stopKeepAlive]);

  const speak = useCallback(
    (text: string, options: SpeechSynthesisOptions = {}) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      stopKeepAlive();

      const utterance = new SpeechSynthesisUtterance(text);
      if (options.voice) utterance.voice = options.voice;
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.lang = "en-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        startKeepAlive();
      };

      utterance.onend = () => {
        stopKeepAlive();
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        if (event.error === "interrupted" || event.error === "canceled") return;
        console.error("Speech synthesis error:", event.error);
        stopKeepAlive();
        setIsSpeaking(false);
      };

      // Android Chrome: small delay after cancel() before speak() to avoid silent failure
      setTimeout(() => window.speechSynthesis.speak(utterance), 50);
    },
    [startKeepAlive, stopKeepAlive]
  );

  useEffect(() => {
    return () => {
      stopKeepAlive();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopKeepAlive]);

  return { isSpeaking, isSupported, speak, stop };
}
