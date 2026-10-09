"use client";

import { useState } from "react";
import Image from "next/image";

const VIDEO_ID = "8J19V4PFq20";

/**
 * IntroVideo — click-to-play facade for the "Artemis Intro" film.
 *
 * Nothing loads until the visitor chooses to watch: the poster is a local
 * 11KB image and the YouTube embed (privacy-enhanced) is only created
 * on click. Static and silent by default.
 */
export function IntroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-navy-deep/40">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="Artemis Intro video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play the Artemis Intro video, 2 minutes 24 seconds"
          className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Image
            src="/video/artemis-intro-poster.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <span
            className="absolute inset-0 bg-lunar/40 transition-colors group-hover:bg-lunar/25"
            aria-hidden="true"
          />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-lunar shadow-gold transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <polygon points="7,4.5 17.5,11 7,17.5" />
              </svg>
            </span>
          </span>
          <span
            className="absolute bottom-4 right-4 rounded-md bg-lunar/70 px-2 py-1 font-mono text-[0.66rem] text-parchment"
            aria-hidden="true"
          >
            2:24
          </span>
        </button>
      )}
    </div>
  );
}
