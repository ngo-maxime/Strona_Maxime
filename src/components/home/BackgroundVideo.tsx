"use client";

import { useEffect, useRef, useState } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function BackgroundVideo() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Nie pobieramy wideo przy włączonym oszczędzaniu danych lub bardzo wolnej sieci –
    // zostaje statyczny poster (identyczny kadr), który i tak jest elementem LCP.
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    const slowNetwork =
      connection?.saveData ||
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g";
    if (slowNetwork) return;

    // Telefon: pionowy kadr 608×1080 (356 KB), komputer: 1920×1080 (0,9 MB)
    const load = () =>
      setVideoSrc(
        window.matchMedia("(max-width: 767px)").matches
          ? "/bg-video-mobile.mp4"
          : "/bg-video.mp4",
      );

    // Ładujemy wideo dopiero, gdy przeglądarka jest bezczynna – nie konkuruje z LCP
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, []);

  // Pauza poza ekranem – oszczędza CPU i baterię podczas przewijania strony
  // biome-ignore lint/correctness/useExhaustiveDependencies: element <video> pojawia się dopiero po ustawieniu videoSrc
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoSrc]);

  if (!videoSrc) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      className="animate-cinematic-zoom pointer-events-none absolute inset-0 h-full w-full object-cover"
      src={videoSrc}
    />
  );
}
