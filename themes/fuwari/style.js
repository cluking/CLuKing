/* eslint-disable react/no-unknown-property */

const Style = () => {
  return <style jsx global>{`
    #theme-fuwari {
      --fuwari-bg: #f0f4fb;
      --fuwari-bg-soft: #eef2f9;
      --fuwari-surface: #ffffff;
      --fuwari-muted: #64748b;
      --fuwari-text: #1e293b;
      --fuwari-primary: #2563eb;
      --fuwari-primary-soft: rgba(37, 99, 235, 0.12);
      --fuwari-border: #e2e8f0;
      --fuwari-gradient: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
    }

    .dark #theme-fuwari {
      --fuwari-bg: #0a0f1a;
      --fuwari-bg-soft: #0f1625;
      --fuwari-surface: #111827;
      --fuwari-muted: #94a3b8;
      --fuwari-text: #f1f5f9;
      --fuwari-primary: #3b82f6;
      --fuwari-primary-soft: rgba(59, 130, 246, 0.2);
      --fuwari-border: #1e293b;
      --fuwari-gradient: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    }

    #theme-fuwari.fuwari-bg {
      background:
        radial-gradient(circle at 10% -10%, var(--fuwari-primary-soft) 0, transparent 45%),
        radial-gradient(circle at 100% 10%, rgba(122, 199, 255, 0.14) 0, transparent 35%),
        var(--fuwari-bg);
    }

    #theme-fuwari {
      transition: background-color 0.2s ease, color 0.2s ease;
      overflow-x: clip;
      font-size: 17px;
      line-height: 1.6;
    }

    #theme-fuwari .fuwari-card {
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    #theme-fuwari .fuwari-card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.1);
    }

    #theme-fuwari .fuwari-cover-wrap {
      overflow: hidden;
      border-radius: 12px;
    }

    #theme-fuwari .fuwari-cover-wrap img {
      transition: transform 0.35s ease;
    }
    #theme-fuwari .fuwari-profile-card {
      padding: .95rem;
    }
    #theme-fuwari .fuwari-profile-card-polished {
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-profile-card-polished::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      z-index: -1;
      height: 7.5rem;
      background:
        radial-gradient(circle at 22% 18%, color-mix(in oklab, var(--fuwari-primary) 22%, transparent), transparent 48%),
        linear-gradient(180deg, color-mix(in oklab, var(--fuwari-primary) 8%, transparent), transparent);
      pointer-events: none;
    }
    #theme-fuwari .fuwari-profile-link {
      border-radius: 1rem;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-profile-thumb {
      background: var(--fuwari-bg-soft);
      transform: translateY(0) scale(1);
      transition: transform .2s ease;
    }
    #theme-fuwari .fuwari-profile-thumb img {
      transition: transform .24s ease, filter .24s ease;
    }
    #theme-fuwari .fuwari-profile-overlay {
      position: absolute;
      inset: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 2rem;
      background: rgba(12, 18, 30, .24);
      opacity: 0;
      transform: scale(.92);
      transition: opacity .2s ease, transform .2s ease;
      pointer-events: none;
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-thumb {
      transform: translateY(1px) scale(.992);
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-thumb img {
      transform: scale(1.02);
      filter: saturate(1.03) brightness(.9);
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-overlay {
      opacity: 1;
      transform: scale(1);
    }
    #theme-fuwari .cyber-profile-card {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      overflow: hidden;
      min-height: 15rem;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, .1);
      border-radius: 1rem;
      background:
        radial-gradient(circle at 18% 10%, rgba(51, 255, 131, .18), transparent 34%),
        radial-gradient(circle at 86% 4%, rgba(202, 30, 179, .2), transparent 30%),
        linear-gradient(180deg, rgba(20, 20, 20, .72), rgba(8, 8, 10, .84));
      backdrop-filter: blur(16px);
      box-shadow: 0 18px 42px rgba(0, 0, 0, .22), inset 0 1px 0 rgba(255, 255, 255, .08);
    }
    #theme-fuwari .cyber-profile-card::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255,255,255,.035) 1px, transparent 1px);
      background-size: 22px 22px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,.75), transparent 78%);
      pointer-events: none;
    }
    #theme-fuwari .cyber-profile-scanline {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent, rgba(51, 255, 131, .12), transparent);
      transform: translateY(-110%);
      animation: cyber-profile-scan 4.8s ease-in-out infinite;
      pointer-events: none;
    }
    #theme-fuwari .cyber-profile-core {
      display: inline-flex;
      width: fit-content;
      margin: .2rem auto 0;
      border-radius: 1.1rem;
    }
    #theme-fuwari .cyber-profile-avatar-shell {
      position: relative;
      display: inline-flex;
      width: 64px;
      height: 64px;
      padding: 3px;
      border: 1px solid rgba(51, 255, 131, .38);
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(51, 255, 131, .24), rgba(202, 30, 179, .18));
      box-shadow: 0 0 15px rgba(51, 255, 131, .3), inset 0 0 10px rgba(51, 255, 131, .2);
      transition: transform .22s ease, box-shadow .22s ease;
    }
    #theme-fuwari .cyber-profile-core:hover .cyber-profile-avatar-shell,
    #theme-fuwari .cyber-profile-core:focus-visible .cyber-profile-avatar-shell {
      transform: translateY(-1px) scale(1.04);
      box-shadow: 0 0 22px rgba(51, 255, 131, .48), 0 0 24px rgba(202, 30, 179, .24), inset 0 0 10px rgba(51, 255, 131, .24);
    }
    #theme-fuwari .cyber-profile-core:focus-visible {
      outline: 2px solid rgba(51, 255, 131, .72);
      outline-offset: 4px;
    }
    #theme-fuwari .cyber-profile-avatar {
      width: 100%;
      height: 100%;
      border-radius: .8rem;
      object-fit: cover;
      filter: saturate(1.12) contrast(1.04);
    }
    #theme-fuwari .cyber-profile-terminal {
      display: grid;
      gap: .45rem;
      padding: .85rem .8rem;
      border: 1px solid rgba(255, 255, 255, .07);
      border-radius: .85rem;
      background: rgba(3, 6, 8, .42);
      font-family: 'Courier New', Courier, monospace;
    }
    #theme-fuwari .cyber-profile-row {
      position: relative;
      display: flex;
      align-items: baseline;
      gap: .45rem;
      margin: 0;
      padding-left: .85rem;
      line-height: 1.5;
    }
    #theme-fuwari .cyber-profile-row::before {
      content: '';
      position: absolute;
      left: 0;
      top: .58em;
      width: .42rem;
      height: .42rem;
      border-radius: 999px;
      background: #33ff83;
      box-shadow: 0 0 8px rgba(51, 255, 131, .9);
      animation: cyber-profile-cursor 1.2s steps(2, end) infinite;
    }
    #theme-fuwari .cyber-profile-key {
      flex: 0 0 auto;
      color: rgba(255, 255, 255, .34);
      font-size: .68rem;
      letter-spacing: .13em;
    }
    #theme-fuwari .cyber-profile-value {
      min-width: 0;
      color: #f8fff9;
      font-size: .95rem;
      font-weight: 900;
      letter-spacing: .04em;
      text-shadow: 0 0 12px rgba(51, 255, 131, .24);
    }
    #theme-fuwari .cyber-profile-status {
      align-items: flex-start;
    }
    #theme-fuwari .cyber-profile-status-value {
      min-width: 0;
      color: #888;
      font-size: .72rem;
      letter-spacing: .08em;
      line-height: 1.65;
    }
    #theme-fuwari .cyber-profile-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: .45rem .65rem;
      padding-top: .15rem;
    }
    #theme-fuwari .cyber-profile-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      overflow: hidden;
      color: rgba(210, 255, 228, .72);
      font-family: 'Courier New', Courier, monospace;
      font-size: .72rem;
      line-height: 1;
      letter-spacing: .04em;
      transition: color .18s ease, transform .18s ease, text-shadow .18s ease;
    }
    #theme-fuwari .cyber-profile-link::before {
      content: '';
      position: absolute;
      inset: 0;
      background: currentColor;
      opacity: 0;
      transform: translateX(-110%) skewX(-18deg);
      transition: opacity .18s ease, transform .32s ease;
      pointer-events: none;
    }
    #theme-fuwari .cyber-profile-link:hover,
    #theme-fuwari .cyber-profile-link:focus-visible {
      color: #33ff83;
      transform: scale(1.05);
      text-shadow: 0 0 8px currentColor;
    }
    #theme-fuwari .cyber-profile-link:focus-visible {
      outline: 1px solid currentColor;
      outline-offset: 3px;
    }
    #theme-fuwari .cyber-profile-link:hover::before,
    #theme-fuwari .cyber-profile-link:focus-visible::before {
      opacity: .18;
      transform: translateX(110%) skewX(-18deg);
    }

    @keyframes cyber-profile-cursor {
      0%, 46% { opacity: 1; }
      47%, 100% { opacity: .18; }
    }
    @keyframes cyber-profile-scan {
      0%, 55% { transform: translateY(-110%); opacity: 0; }
      64% { opacity: .85; }
      100% { transform: translateY(110%); opacity: 0; }
    }

    #theme-fuwari .fuwari-card-hover:hover .fuwari-cover-enlarge img {
      transform: scale(1.03);
    }

    #theme-fuwari .fuwari-link {
      color: var(--fuwari-primary);
      transition: opacity 0.2s ease;
    }
    #theme-fuwari .fuwari-link:hover {
      opacity: 0.78;
    }
    #theme-fuwari .fuwari-footer {
      border-top: 1px dashed color-mix(in oklab, var(--fuwari-border) 85%, transparent);
      background: transparent;
    }
    #theme-fuwari .fuwari-copy-btn {
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 24%, var(--fuwari-border));
      background: color-mix(in oklab, var(--fuwari-primary) 8%, var(--fuwari-surface));
      color: color-mix(in oklab, var(--fuwari-primary) 80%, var(--fuwari-text));
      border-radius: .6rem;
      font-size: .8rem;
      font-weight: 600;
      padding: .35rem .65rem;
      transition: all .2s ease;
    }
    #theme-fuwari .fuwari-copy-btn:hover {
      background: color-mix(in oklab, var(--fuwari-primary) 14%, var(--fuwari-surface));
    }

    #theme-fuwari .fuwari-navbar {
      backdrop-filter: blur(12px);
      background: color-mix(in oklab, var(--fuwari-surface) 94%, transparent);
      border-radius: 0 0 16px 16px;
      border: 1px solid var(--fuwari-border);
      border-top: none;
    }
    #theme-fuwari .fuwari-tool-btn {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 0.65rem;
      border: 1px solid color-mix(in oklab, var(--fuwari-border) 75%, transparent);
      background: color-mix(in oklab, var(--fuwari-bg-soft) 82%, #fff);
      color: color-mix(in oklab, var(--fuwari-primary) 56%, var(--fuwari-muted));
      font-size: .86rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all .2s ease;
    }
    #theme-fuwari .fuwari-tool-btn:hover {
      color: var(--fuwari-primary);
      transform: translateY(-1px);
    }
    #theme-fuwari .fuwari-theme-panel {
      background: var(--fuwari-surface);
      border-radius: 16px;
    }
    #theme-fuwari .fuwari-hue-wrap {
      width: 100%;
      height: 1.5rem;
      padding: 0 .25rem;
      border-radius: .5rem;
      background: color-mix(in oklab, var(--fuwari-bg-soft) 90%, transparent);
    }
    #theme-fuwari .fuwari-hue-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 1.5rem;
      background: linear-gradient(
        90deg,
        hsl(0, 85%, 65%) 0%,
        hsl(60, 85%, 65%) 16%,
        hsl(120, 85%, 65%) 32%,
        hsl(180, 85%, 65%) 48%,
        hsl(240, 85%, 65%) 64%,
        hsl(300, 85%, 65%) 82%,
        hsl(360, 85%, 65%) 100%
      );
      border-radius: .5rem;
    }
    #theme-fuwari .fuwari-hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: .55rem;
      height: 1rem;
      border-radius: .2rem;
      background: rgba(255,255,255,.88);
      border: 1px solid rgba(0,0,0,.08);
      cursor: pointer;
    }
    #theme-fuwari .fuwari-hue-slider::-moz-range-thumb {
      width: .55rem;
      height: 1rem;
      border-radius: .2rem;
      background: rgba(255,255,255,.88);
      border: 1px solid rgba(0,0,0,.08);
      cursor: pointer;
    }

    #theme-fuwari .fuwari-hero {
      position: relative;
      min-height: clamp(420px, 58vh, 680px);
      border-radius: 0;
      margin-top: -92px;
      padding-top: 92px;
      background:
        radial-gradient(circle at 18% 24%, rgba(255, 255, 255, .18), transparent 28%),
        radial-gradient(circle at 84% 18%, color-mix(in oklab, var(--fuwari-primary) 44%, transparent), transparent 32%),
        var(--fuwari-gradient);
    }
    #theme-fuwari .fuwari-hero-content {
      display: flex;
      min-height: clamp(330px, 46vh, 560px);
      flex-direction: column;
      justify-content: center;
      padding-top: clamp(4rem, 9vh, 7.5rem);
      padding-bottom: clamp(4rem, 8vh, 6rem);
      color: #fff;
    }
    #theme-fuwari .fuwari-hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.015);
      filter: saturate(1.08) contrast(1.02);
    }
    #theme-fuwari .fuwari-hero-mask {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(9, 14, 24, .32) 0%, rgba(9, 14, 24, .08) 46%, rgba(9, 14, 24, .78) 100%),
        linear-gradient(112deg, rgba(9, 14, 24, .72) 0%, rgba(9, 14, 24, .34) 48%, rgba(9, 14, 24, .08) 100%);
      z-index: 1;
    }
    #theme-fuwari .fuwari-hero-kicker {
      width: fit-content;
      max-width: 100%;
      margin-bottom: .9rem;
      border: 1px solid rgba(255, 255, 255, .28);
      border-radius: 999px;
      background: rgba(255, 255, 255, .12);
      backdrop-filter: blur(14px);
      color: rgba(255, 255, 255, .9);
      font-size: .78rem;
      font-weight: 800;
      letter-spacing: .22em;
      line-height: 1;
      overflow: hidden;
      padding: .58rem .85rem;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }
    #theme-fuwari .fuwari-hero-title {
      max-width: min(780px, 94vw);
      margin: 0;
      font-size: clamp(2.65rem, 8vw, 6.4rem);
      font-weight: 900;
      letter-spacing: -.07em;
      line-height: .95;
      text-wrap: balance;
      text-shadow: 0 18px 54px rgba(0, 0, 0, .32);
    }
    #theme-fuwari .fuwari-hero-description {
      max-width: 42rem;
      margin-top: 1.1rem;
      color: rgba(255, 255, 255, .86);
      font-size: clamp(1rem, 2vw, 1.24rem);
      line-height: 1.8;
      text-shadow: 0 10px 30px rgba(0, 0, 0, .28);
    }
    #theme-fuwari .fuwari-hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: .8rem;
      margin-top: 1.5rem;
    }
    #theme-fuwari .fuwari-hero-btn {
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(255, 255, 255, .38);
      box-shadow: 0 16px 42px rgba(0, 0, 0, .22);
      color: #111827;
      font-size: 0.9rem;
      font-weight: 800;
      padding: 0.72rem 1.1rem;
      transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
    }
    #theme-fuwari .fuwari-hero-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 48px rgba(0, 0, 0, .28);
    }
    #theme-fuwari .fuwari-hero-btn-soft {
      background: rgba(255, 255, 255, 0.13);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(14px);
      box-shadow: none;
    }
    #theme-fuwari .fuwari-hero-credit {
      position: absolute;
      right: 1.1rem;
      bottom: 1rem;
      font-size: .7rem;
      color: rgba(255,255,255,.9);
      background: rgba(0,0,0,.36);
      border-radius: 999px;
      padding: .25rem .6rem;
    }

    #theme-fuwari .fuwari-overlap {
      margin-top: -26px;
      position: relative;
      z-index: 5;
    }
    #theme-fuwari .fuwari-main-overlap {
      margin-top: -42px;
      position: relative;
      z-index: 10;
    }

    #theme-fuwari .fuwari-home {
      min-width: 0;
      width: 100%;
    }
    #theme-fuwari .fuwari-home-intro {
      position: relative;
      isolation: isolate;
      border-radius: 1.35rem;
      background:
        linear-gradient(135deg, color-mix(in oklab, var(--fuwari-surface) 94%, transparent), color-mix(in oklab, var(--fuwari-bg-soft) 86%, var(--fuwari-surface))),
        var(--fuwari-surface);
    }
    #theme-fuwari .fuwari-home-intro::before {
      content: '';
      position: absolute;
      inset: -28% auto auto 48%;
      z-index: -1;
      width: 24rem;
      height: 24rem;
      border-radius: 999px;
      background: radial-gradient(circle, color-mix(in oklab, var(--fuwari-primary) 22%, transparent), transparent 68%);
      pointer-events: none;
    }
    #theme-fuwari .fuwari-snake-track {
      position: absolute;
      inset: .55rem;
      z-index: -1;
      border-radius: 1rem;
      opacity: .95;
      overflow: hidden;
      pointer-events: none;
    }
    #theme-fuwari .fuwari-snake-track::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background:
        conic-gradient(
          from var(--fuwari-snake-angle, 0deg),
          transparent 0deg,
          transparent 118deg,
          color-mix(in oklab, var(--fuwari-primary) 18%, transparent) 150deg,
          color-mix(in oklab, var(--fuwari-primary) 88%, #06b6d4) 172deg,
          #fff 180deg,
          color-mix(in oklab, var(--fuwari-primary) 88%, #06b6d4) 188deg,
          color-mix(in oklab, var(--fuwari-primary) 18%, transparent) 214deg,
          transparent 246deg,
          transparent 360deg
        );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: fuwari-snake-spin 5.2s linear infinite;
      filter: drop-shadow(0 0 10px color-mix(in oklab, var(--fuwari-primary) 54%, transparent));
    }
    #theme-fuwari .fuwari-snake-track::after {
      content: '';
      position: absolute;
      inset: 9%;
      border-radius: 999px;
      background:
        radial-gradient(circle at var(--fuwari-snake-x, 12%) var(--fuwari-snake-y, 18%), color-mix(in oklab, var(--fuwari-primary) 16%, transparent), transparent 18%),
        radial-gradient(circle at calc(100% - var(--fuwari-snake-x, 12%)) calc(100% - var(--fuwari-snake-y, 18%)), rgba(6, 182, 212, .13), transparent 22%);
      animation: fuwari-snake-glow 7.4s ease-in-out infinite;
      filter: blur(.5px);
    }
    #theme-fuwari .fuwari-snake-orb {
      position: absolute;
      width: .62rem;
      height: .62rem;
      border-radius: 999px;
      background: #fff;
      box-shadow:
        0 0 0 4px color-mix(in oklab, var(--fuwari-primary) 18%, transparent),
        0 0 24px color-mix(in oklab, var(--fuwari-primary) 90%, #06b6d4),
        0 0 48px rgba(6, 182, 212, .45);
      transform: translate(-50%, -50%);
    }
    #theme-fuwari .fuwari-snake-orb-one {
      animation: fuwari-snake-run 5.2s linear infinite;
    }
    #theme-fuwari .fuwari-snake-orb-two {
      animation: fuwari-snake-run 5.2s linear infinite reverse;
      opacity: .58;
      scale: .72;
    }
    #theme-fuwari .fuwari-home-intro-main,
    #theme-fuwari .fuwari-home-featured {
      position: relative;
      z-index: 1;
    }
    #theme-fuwari .fuwari-home-intro-main {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(17rem, .95fr);
      gap: clamp(1.2rem, 4vw, 2.2rem);
      align-items: center;
    }
    #theme-fuwari .fuwari-home-kicker,
    #theme-fuwari .fuwari-list-kicker,
    #theme-fuwari .fuwari-home-featured-label {
      color: color-mix(in oklab, var(--fuwari-primary) 74%, var(--fuwari-muted));
      font-size: .72rem;
      font-weight: 900;
      letter-spacing: .2em;
      text-transform: uppercase;
    }
    #theme-fuwari .fuwari-home-title {
      margin-top: .38rem;
      color: var(--fuwari-text);
      font-size: clamp(2rem, 5vw, 4.1rem);
      font-weight: 900;
      letter-spacing: -.055em;
      line-height: 1;
      overflow-wrap: anywhere;
      text-wrap: balance;
    }
    #theme-fuwari .fuwari-home-description {
      max-width: 38rem;
      margin-top: .9rem;
      color: var(--fuwari-muted);
      font-size: 1rem;
      line-height: 1.85;
    }
    #theme-fuwari .fuwari-home-actions {
      display: flex;
      flex-wrap: wrap;
      gap: .65rem;
      margin-top: 1.15rem;
    }
    #theme-fuwari .fuwari-home-action,
    #theme-fuwari .fuwari-home-action-primary,
    #theme-fuwari .fuwari-list-more {
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      border-radius: 999px;
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 18%, var(--fuwari-border));
      color: color-mix(in oklab, var(--fuwari-primary) 78%, var(--fuwari-text));
      font-size: .85rem;
      font-weight: 800;
      padding: .6rem .9rem;
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }
    #theme-fuwari .fuwari-home-action-primary {
      background: var(--fuwari-gradient);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 14px 32px color-mix(in oklab, var(--fuwari-primary) 20%, transparent);
    }
    #theme-fuwari .fuwari-home-action:hover,
    #theme-fuwari .fuwari-home-action-primary:hover,
    #theme-fuwari .fuwari-list-more:hover {
      transform: translateY(-1px);
      border-color: color-mix(in oklab, var(--fuwari-primary) 36%, var(--fuwari-border));
      background: color-mix(in oklab, var(--fuwari-primary) 8%, var(--fuwari-surface));
    }
    #theme-fuwari .fuwari-home-action-primary:hover {
      background: var(--fuwari-gradient);
    }
    #theme-fuwari .fuwari-home-showcase {
      position: relative;
      min-height: 18.5rem;
      border-radius: 1.35rem;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-orbit-stage {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        radial-gradient(circle at 50% 48%, color-mix(in oklab, var(--fuwari-primary) 18%, transparent), transparent 28%),
        radial-gradient(circle at 82% 18%, rgba(6, 182, 212, .16), transparent 30%),
        linear-gradient(145deg, color-mix(in oklab, var(--fuwari-bg-soft) 74%, transparent), color-mix(in oklab, var(--fuwari-surface) 72%, transparent));
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 14%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-orbit-stage::before {
      content: '';
      position: absolute;
      inset: 1.1rem;
      border-radius: 1rem;
      background-image:
        linear-gradient(color-mix(in oklab, var(--fuwari-primary) 9%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in oklab, var(--fuwari-primary) 9%, transparent) 1px, transparent 1px);
      background-size: 28px 28px;
      mask-image: radial-gradient(circle at 52% 46%, #000 0 42%, transparent 74%);
      opacity: .75;
    }
    #theme-fuwari .fuwari-orbit-ring {
      position: absolute;
      left: 50%;
      top: 45%;
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 34%, transparent);
      border-radius: 999px;
      transform: translate(-50%, -50%) rotate(var(--orbit-rotate, 0deg));
    }
    #theme-fuwari .fuwari-orbit-ring-one {
      width: 14rem;
      height: 7rem;
      animation: fuwari-orbit-spin 9s linear infinite;
    }
    #theme-fuwari .fuwari-orbit-ring-two {
      width: 16rem;
      height: 8.25rem;
      --orbit-rotate: 62deg;
      animation: fuwari-orbit-spin 12s linear infinite reverse;
    }
    #theme-fuwari .fuwari-orbit-core {
      position: absolute;
      left: 50%;
      top: 45%;
      width: 4.6rem;
      height: 4.6rem;
      border-radius: 999px;
      background:
        radial-gradient(circle at 35% 28%, #fff, rgba(255,255,255,.18) 28%, transparent 56%),
        var(--fuwari-gradient);
      box-shadow:
        0 0 0 10px color-mix(in oklab, var(--fuwari-primary) 9%, transparent),
        0 0 42px color-mix(in oklab, var(--fuwari-primary) 42%, transparent);
      transform: translate(-50%, -50%);
      animation: fuwari-core-pulse 3.4s ease-in-out infinite;
    }
    #theme-fuwari .fuwari-orbit-dot {
      position: absolute;
      width: .72rem;
      height: .72rem;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 0 22px color-mix(in oklab, var(--fuwari-primary) 90%, #06b6d4);
    }
    #theme-fuwari .fuwari-orbit-dot-one {
      left: 26%;
      top: 34%;
      animation: fuwari-dot-float 4.8s ease-in-out infinite;
    }
    #theme-fuwari .fuwari-orbit-dot-two {
      right: 20%;
      top: 48%;
      animation: fuwari-dot-float 5.4s ease-in-out infinite reverse;
    }
    #theme-fuwari .fuwari-orbit-dot-three {
      left: 48%;
      bottom: 18%;
      width: .48rem;
      height: .48rem;
      animation: fuwari-dot-float 6s ease-in-out infinite;
    }
    #theme-fuwari .fuwari-home-feature-card {
      position: absolute;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      z-index: 2;
      display: block;
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 18%, rgba(255,255,255,.24));
      border-radius: 1.05rem;
      background: color-mix(in oklab, var(--fuwari-surface) 82%, transparent);
      backdrop-filter: blur(16px);
      padding: 1rem;
      box-shadow: 0 18px 42px rgba(15, 23, 42, .12);
      transition: transform .2s ease, border-color .2s ease;
    }
    #theme-fuwari .fuwari-home-feature-card:hover {
      transform: translateY(-3px);
      border-color: color-mix(in oklab, var(--fuwari-primary) 42%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-home-feature-badge,
    #theme-fuwari .fuwari-home-note-card span {
      display: block;
      color: color-mix(in oklab, var(--fuwari-primary) 78%, var(--fuwari-muted));
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    #theme-fuwari .fuwari-home-feature-card strong,
    #theme-fuwari .fuwari-home-note-card strong {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin-top: .45rem;
      color: var(--fuwari-text);
      font-size: 1rem;
      line-height: 1.45;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-home-feature-card small {
      display: block;
      margin-top: .6rem;
      color: var(--fuwari-muted);
      font-size: .78rem;
      font-weight: 700;
    }
    #theme-fuwari .fuwari-home-note-card {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 2;
      width: min(13.5rem, calc(100% - 2rem));
      border: 1px solid color-mix(in oklab, var(--fuwari-border) 70%, transparent);
      border-radius: 1rem;
      background: color-mix(in oklab, var(--fuwari-surface) 78%, transparent);
      backdrop-filter: blur(14px);
      padding: .85rem;
      transition: transform .2s ease, border-color .2s ease;
    }
    #theme-fuwari .fuwari-home-note-card:hover {
      transform: translateY(-2px) rotate(.5deg);
      border-color: color-mix(in oklab, var(--fuwari-primary) 34%, var(--fuwari-border));
    }
    #theme-fuwari .cluking-landing {
      position: relative;
      border: 1px solid rgba(255, 141, 121, .26);
      background:
        radial-gradient(circle at 11% 16%, rgba(255, 215, 1, .18), transparent 27%),
        radial-gradient(circle at 88% 18%, rgba(202, 30, 179, .22), transparent 32%),
        linear-gradient(135deg, rgba(12, 12, 17, .96), rgba(35, 20, 31, .92) 48%, rgba(18, 18, 21, .97));
      color: #fff;
      box-shadow: 0 30px 80px rgba(20, 8, 19, .28);
    }
    #theme-fuwari .cluking-landing::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-image:
        linear-gradient(rgba(255, 255, 255, .045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, .035) 1px, transparent 1px);
      background-size: 34px 34px;
      mask-image: radial-gradient(circle at 48% 48%, #000 0 40%, transparent 78%);
      pointer-events: none;
    }
    #theme-fuwari .cluking-bento-showcase {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 16px;
      min-height: 22rem;
      padding: 16px;
      border-radius: 20px;
      background:
        radial-gradient(circle at 18% 18%, rgba(255, 215, 1, .1), transparent 25%),
        radial-gradient(circle at 80% 12%, rgba(202, 30, 179, .16), transparent 30%),
        rgba(7, 7, 10, .56);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .06);
    }
    #theme-fuwari .cluking-bento-header {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: .85rem;
      align-items: center;
      min-width: 0;
      min-height: 4.15rem;
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: 20px;
      background: rgba(20, 20, 20, .48);
      backdrop-filter: blur(10px);
      padding: .85rem 1rem;
    }
    #theme-fuwari .cluking-bento-grid {
      display: grid;
      grid-template-columns: minmax(0, .42fr) minmax(0, .58fr);
      gap: 16px;
      align-items: stretch;
    }
    #theme-fuwari .cluking-bento-card {
      min-height: 15.5rem;
      border: 1px solid rgba(255, 255, 255, .1);
      border-radius: 20px;
      background: rgba(20, 20, 20, .6);
      backdrop-filter: blur(10px);
    }
    #theme-fuwari .cluking-loader {
      display: flex;
      width: 30px;
      aspect-ratio: 1;
      flex: 0 0 auto;
      filter: drop-shadow(0 0 14px rgba(253, 46, 36, .36));
    }
    #theme-fuwari .cluking-loader-mark {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    #theme-fuwari .cluking-loader-dash {
      animation: cluking-dash-array 5s ease-in-out infinite, cluking-dash-offset 5s linear infinite;
    }
    #theme-fuwari .cluking-loader-spin {
      animation: cluking-spin-dash-array 5s ease-in-out infinite, cluking-spin 5s ease-in-out infinite, cluking-dash-offset 5s linear infinite;
      transform-origin: center;
    }
    #theme-fuwari .cluking-eyebrow {
      justify-self: end;
      color: rgba(255, 185, 168, .78);
      font-size: .64rem;
      font-weight: 500;
      letter-spacing: .28em;
      text-align: right;
      text-transform: uppercase;
      white-space: nowrap;
    }
    #theme-fuwari .cluking-name {
      margin: 0;
      color: #fff;
      font-size: clamp(1.45rem, 3vw, 2.2rem);
      font-weight: 950;
      letter-spacing: -.045em;
      line-height: 1;
      text-shadow:
        0 0 18px rgba(253, 46, 36, .28),
        0 8px 28px rgba(0, 0, 0, .32);
    }
    #theme-fuwari .cluking-signature-card {
      display: flex;
      width: 100%;
      padding: 0;
      overflow: hidden;
      animation: cluking-card-breathe 5s ease-in-out infinite;
    }
    #theme-fuwari .cluking-signature-content {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
      width: 100%;
      min-height: inherit;
      overflow: hidden;
      border-radius: inherit;
      padding: 1rem;
    }
    #theme-fuwari .cluking-sunset-svg {
      position: relative;
      z-index: 1;
      align-self: center;
      justify-self: center;
      width: min(100%, 14.5rem);
      opacity: .92;
      filter: drop-shadow(0 20px 38px rgba(253, 46, 36, .18));
    }
    #theme-fuwari .cluking-signature-details {
      position: relative;
      z-index: 1;
      display: grid;
      gap: .35rem;
      align-self: end;
      text-align: center;
    }
    #theme-fuwari .cluking-signature-title {
      color: #ff8d79;
      font-size: clamp(1.05rem, 2vw, 1.3rem);
      font-weight: 900;
      letter-spacing: -.02em;
      line-height: 1.25;
    }
    #theme-fuwari .cluking-signature-body {
      color: rgba(255, 199, 183, .78);
      font-size: .86rem;
      line-height: 1.65;
    }
    #theme-fuwari .cluking-signature-subtitle {
      white-space: nowrap;
      font-size: 9px;
      letter-spacing: 1.5px;
      text-align: center;
    }
    #theme-fuwari .cluking-langding-stage {
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 1rem;
    }
    #theme-fuwari .cluking-glow-disc {
      position: absolute;
      width: min(21rem, 82%);
      aspect-ratio: 1;
      border-radius: 999px;
      background:
        radial-gradient(circle, rgba(255, 215, 1, .12), transparent 28%),
        conic-gradient(from 120deg, rgba(202, 30, 179, .26), rgba(253, 46, 36, .32), rgba(255, 215, 1, .22), rgba(202, 30, 179, .26));
      filter: blur(14px);
      opacity: .72;
      animation: cluking-glow-cycle 5s ease-in-out infinite;
    }
    #theme-fuwari .cluking-terminal-loader {
      position: relative;
      z-index: 1;
      width: min(100%, 24rem);
      min-height: 13.5rem;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: 1rem;
      background:
        linear-gradient(180deg, rgba(24, 24, 26, .86), rgba(8, 8, 10, .9)),
        #1a1a1a;
      color: #33ff83;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1rem;
      box-shadow: none;
    }
    #theme-fuwari .cluking-terminal-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1.7em;
      background-color: rgba(255, 255, 255, .08);
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      padding: 0 .55em;
      box-sizing: border-box;
    }
    #theme-fuwari .cluking-terminal-title {
      float: left;
      line-height: 1.7em;
      color: #eee;
      font-size: .86rem;
    }
    #theme-fuwari .cluking-terminal-controls {
      float: right;
      line-height: 1.7em;
    }
    #theme-fuwari .cluking-terminal-control {
      display: inline-block;
      width: .6em;
      height: .6em;
      margin-left: .4em;
      border-radius: 50%;
      background-color: #777;
    }
    #theme-fuwari .cluking-terminal-close { background-color: #e33; }
    #theme-fuwari .cluking-terminal-minimize { background-color: #ee0; }
    #theme-fuwari .cluking-terminal-maximize { background-color: #0b0; }
    #theme-fuwari .cluking-terminal-screen {
      display: grid;
      gap: .8rem;
      padding: 3.4rem 1.2rem 1.2rem;
    }
    #theme-fuwari .cluking-terminal-prompt {
      color: rgba(255,255,255,.56);
      font-size: .78rem;
    }
    #theme-fuwari .cluking-terminal-text {
      display: inline-block;
      width: 0;
      max-width: max-content;
      white-space: nowrap;
      overflow: hidden;
      border-right: .2em solid #33ff83;
      color: #58ff9b;
      font-size: clamp(1.55rem, 5vw, 2.35rem);
      font-weight: 900;
      letter-spacing: .02em;
      animation: cluking-type-hold 5s steps(8) infinite, cluking-blink-cursor .5s step-end infinite alternate;
    }
    #theme-fuwari .cluking-terminal-status {
      display: inline-flex;
      width: fit-content;
      border: 1px solid rgba(51, 255, 131, .28);
      border-radius: 999px;
      color: rgba(163, 255, 199, .82);
      font-size: .76rem;
      padding: .35rem .65rem;
      background: rgba(51, 255, 131, .08);
    }

    @keyframes cluking-dash-array {
      0% { stroke-dasharray: 0 1 359 0; }
      52% { stroke-dasharray: 0 359 1 0; }
      72%, 100% { stroke-dasharray: 359 1 0 0; }
    }
    @keyframes cluking-spin-dash-array {
      0% { stroke-dasharray: 270 90; }
      52% { stroke-dasharray: 0 360; }
      72%, 100% { stroke-dasharray: 270 90; }
    }
    @keyframes cluking-dash-offset {
      0% { stroke-dashoffset: 365; }
      72%, 100% { stroke-dashoffset: 5; }
    }
    @keyframes cluking-spin {
      0% { rotate: 0deg; }
      18%, 30% { rotate: 270deg; }
      42%, 54% { rotate: 540deg; }
      66%, 100% { rotate: 810deg; }
    }
    @keyframes cluking-card-breathe {
      0%, 100% { transform: translateY(0); filter: saturate(1); }
      58% { transform: translateY(-3px); filter: saturate(1.12); }
    }
    @keyframes cluking-glow-cycle {
      0%, 100% { transform: rotate(0deg) scale(.96); opacity: .58; }
      68% { transform: rotate(120deg) scale(1.04); opacity: .86; }
    }
    @keyframes cluking-blink-cursor {
      50% { border-right-color: transparent; }
    }
    @keyframes cluking-type-hold {
      0%, 10% { width: 0; }
      54%, 100% { width: 9ch; }
    }

    #theme-fuwari .fuwari-list-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
      margin: 1rem 0 .75rem;
    }
    #theme-fuwari .fuwari-list-more {
      flex: 0 0 auto;
      background: color-mix(in oklab, var(--fuwari-surface) 72%, transparent);
    }

    #theme-fuwari .fuwari-chip {
      background: var(--fuwari-bg-soft);
      border: 1px solid var(--fuwari-border);
      border-radius: 999px;
      color: var(--fuwari-muted);
      font-size: 14px;
      line-height: 1;
      padding: 0.5rem 0.8rem;
    }

    #theme-fuwari .fuwari-title-gradient {
      background: var(--fuwari-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    #theme-fuwari .fuwari-prose :is(h1, h2, h3, h4, h5) {
      color: var(--fuwari-text);
    }

    #theme-fuwari #article-wrapper .notion {
      font-size: 1rem;
    }

    #theme-fuwari .catalog-item span {
      color: var(--fuwari-muted);
    }

    #theme-fuwari .fuwari-summary {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-meta-row {
      display: flex;
      align-items: center;
      gap: .35rem .42rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9375rem;
      color: var(--fuwari-muted);
      min-height: 1.5rem;
    }
    @media (max-width: 1023px) {
      #theme-fuwari .fuwari-meta-row {
        flex-wrap: wrap;
        white-space: normal;
        overflow: visible;
      }
      #theme-fuwari .fuwari-meta-tags {
        flex-wrap: wrap;
        white-space: normal;
        max-width: 100%;
      }
      #theme-fuwari .fuwari-post-title,
      #theme-fuwari .fuwari-post-title a {
        overflow-wrap: anywhere;
        word-break: break-word;
      }
    }
    #theme-fuwari .fuwari-meta-item {
      display: inline-flex;
      align-items: center;
      gap: .34rem;
      padding: 0;
      border-radius: 0;
      background: transparent;
      border: none;
      color: #777d86;
      flex: 0 0 auto;
    }
    #theme-fuwari .fuwari-meta-icon {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: .28rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .72rem;
      color: color-mix(in oklab, var(--fuwari-primary) 72%, #9aa0aa);
      background: color-mix(in oklab, var(--fuwari-primary) 13%, #faf8ed);
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-meta-text {
      color: var(--fuwari-muted);
    }
    #theme-fuwari .fuwari-meta-tags {
      display: inline-flex;
      align-items: center;
      gap: .28rem;
      min-height: 1.28rem;
      color: var(--fuwari-muted);
      flex: 0 0 auto;
    }
    #theme-fuwari .fuwari-meta-tags i {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: .28rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .72rem;
      color: color-mix(in oklab, var(--fuwari-primary) 72%, #9aa0aa);
      background: color-mix(in oklab, var(--fuwari-primary) 13%, #faf8ed);
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-post-title {
      position: relative;
      padding-left: 12px;
    }
    #theme-fuwari .fuwari-post-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: .45rem;
      width: 4px;
      height: 1.45rem;
      border-radius: 999px;
      background: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-section-title {
      position: relative;
      padding-left: 10px;
    }
    #theme-fuwari .fuwari-section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: .2rem;
      width: 3px;
      height: 14px;
      border-radius: 999px;
      background: var(--fuwari-primary);
    }

    #theme-fuwari .fuwari-float-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid color-mix(in oklab, var(--fuwari-border) 85%, transparent);
      background: var(--fuwari-surface);
      color: color-mix(in oklab, var(--fuwari-primary) 75%, var(--fuwari-muted));
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    #theme-fuwari .fuwari-float-btn:hover {
      transform: translateY(-2px);
      opacity: 0.88;
    }
    #theme-fuwari .fuwari-float-wrap {
      right: max(1rem, calc((100vw - 72rem) / 2 - 2.8rem));
      bottom: 1.15rem;
    }
    #theme-fuwari .fuwari-toc-mobile {
      position: fixed;
      inset: 0;
      z-index: 60;
    }
    #theme-fuwari .fuwari-toc-mask {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, .32);
      backdrop-filter: blur(1.5px);
    }
    #theme-fuwari .fuwari-toc-panel {
      position: absolute;
      right: .8rem;
      bottom: 4.35rem;
      width: min(21rem, calc(100vw - 1.6rem));
      max-height: 58vh;
      overflow: hidden;
    }
    @media (max-width: 1280px) {
      #theme-fuwari .fuwari-float-wrap {
        right: 1.05rem;
        bottom: 1rem;
      }
    }
    #theme-fuwari .fuwari-social-btn {
      width: 1.95rem;
      height: 1.95rem;
      border-radius: .65rem;
      background: color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface));
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 22%, var(--fuwari-border));
      color: color-mix(in oklab, var(--fuwari-primary) 88%, #8c8c8c);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all .18s ease;
    }
    #theme-fuwari .fuwari-social-btn:hover {
      transform: translateY(-1px);
      color: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-analytics-item {
      padding: .7rem .35rem;
      border-radius: .85rem;
    }
    #theme-fuwari .fuwari-analytics-label {
      font-size: 12px;
      line-height: 1.2;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--fuwari-muted);
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
    }
    #theme-fuwari .fuwari-readmore-rail {
      width: 3.5rem;
      min-width: 3.5rem;
      border-radius: 1rem;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
      background: color-mix(in oklab, var(--fuwari-primary) 8%, var(--fuwari-surface));
      color: var(--fuwari-primary);
      font-size: 1.06rem;
      transition: all .2s ease;
      opacity: .95;
    }
    #theme-fuwari .fuwari-pagination {
      --_page-size: 2.75rem;
    }
    #theme-fuwari .fuwari-page-btn,
    #theme-fuwari .fuwari-page-num {
      width: var(--_page-size);
      height: var(--_page-size);
      border-radius: .75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: color-mix(in oklab, var(--fuwari-text) 70%, #8f8f8f);
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      transition: all .18s ease;
    }
    #theme-fuwari .fuwari-page-btn:hover,
    #theme-fuwari .fuwari-page-num:hover {
      color: var(--fuwari-primary);
      border-color: color-mix(in oklab, var(--fuwari-primary) 30%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-page-box {
      border-radius: .85rem;
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      padding: .15rem;
    }
    #theme-fuwari .fuwari-page-num-active {
      color: #fff;
      background: var(--fuwari-primary);
      border-color: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-page-btn-disabled {
      pointer-events: none;
      opacity: .45;
    }
    #theme-fuwari .fuwari-page-ellipsis {
      width: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--fuwari-muted);
      font-size: .8rem;
    }
    #theme-fuwari #posts-wrapper article:hover .fuwari-readmore-rail {
      background: color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface));
      transform: translateX(1px);
    }
    #theme-fuwari #posts-wrapper {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      gap: 0.95rem;
    }
    #theme-fuwari #posts-wrapper article {
      border-radius: 1.15rem;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    #theme-fuwari .fuwari-home #posts-wrapper article {
      border-color: color-mix(in oklab, var(--fuwari-border) 82%, transparent);
      box-shadow: 0 12px 34px rgba(15, 23, 42, .06);
    }
    #theme-fuwari aside > section.fuwari-card {
      border-radius: 0.75rem;
    }
    #theme-fuwari aside .fuwari-card {
      box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
    }
    #theme-fuwari aside .fuwari-chip {
      font-size: 15px;
      padding: .5rem .8rem;
    }
    #theme-fuwari aside .fuwari-card h3 {
      letter-spacing: .06em;
    }
    #theme-fuwari .fuwari-side-post-link {
      display: grid;
      grid-template-columns: 2rem minmax(0, 1fr);
      gap: .65rem;
      align-items: start;
      border-radius: .8rem;
      color: var(--fuwari-text);
      padding: .45rem .35rem;
      transition: background .18s ease, color .18s ease, transform .18s ease;
    }
    #theme-fuwari .fuwari-side-post-link:hover {
      background: color-mix(in oklab, var(--fuwari-primary) 7%, transparent);
      color: var(--fuwari-primary);
      transform: translateX(2px);
    }
    #theme-fuwari .fuwari-side-post-link span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.65rem;
      height: 1.65rem;
      border-radius: .55rem;
      background: color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface));
      color: color-mix(in oklab, var(--fuwari-primary) 72%, var(--fuwari-muted));
      font-size: .7rem;
      font-weight: 900;
      line-height: 1;
    }
    #theme-fuwari .fuwari-side-post-link strong {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: .92rem;
      font-weight: 700;
      line-height: 1.55;
      overflow: hidden;
    }
    @keyframes fuwari-snake-spin {
      to { --fuwari-snake-angle: 360deg; }
    }
    @keyframes fuwari-snake-glow {
      0%, 100% {
        --fuwari-snake-x: 12%;
        --fuwari-snake-y: 18%;
        opacity: .72;
      }
      28% {
        --fuwari-snake-x: 86%;
        --fuwari-snake-y: 24%;
        opacity: .96;
      }
      58% {
        --fuwari-snake-x: 78%;
        --fuwari-snake-y: 82%;
        opacity: .78;
      }
      82% {
        --fuwari-snake-x: 16%;
        --fuwari-snake-y: 76%;
        opacity: .92;
      }
    }
    @keyframes fuwari-snake-run {
      0%, 100% { left: 3%; top: 3%; }
      24% { left: 97%; top: 3%; }
      50% { left: 97%; top: 97%; }
      76% { left: 3%; top: 97%; }
    }
    @keyframes fuwari-orbit-spin {
      to { transform: translate(-50%, -50%) rotate(calc(var(--orbit-rotate, 0deg) + 360deg)); }
    }
    @keyframes fuwari-core-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(.96); opacity: .9; }
      50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
    }
    @keyframes fuwari-dot-float {
      0%, 100% { transform: translate3d(0, 0, 0); opacity: .72; }
      50% { transform: translate3d(.45rem, -.7rem, 0); opacity: 1; }
    }

    @media (max-width: 768px) {
      #theme-fuwari .fuwari-hero {
        min-height: 420px;
        margin-top: -72px;
        padding-top: 72px;
      }
      #theme-fuwari .fuwari-hero-content {
        min-height: 340px;
        padding-top: 4.25rem;
        padding-bottom: 4.5rem;
      }
      #theme-fuwari .fuwari-hero-kicker {
        max-width: calc(100vw - 2rem);
        font-size: .68rem;
      }
      #theme-fuwari .fuwari-hero-title {
        font-size: clamp(2.35rem, 14vw, 4.2rem);
      }
      #theme-fuwari .fuwari-hero-actions {
        gap: .55rem;
      }
      #theme-fuwari .fuwari-main-overlap {
        margin-top: -28px;
      }
      #theme-fuwari .fuwari-navbar {
        border-radius: 0 0 14px 14px;
      }
      #theme-fuwari .fuwari-home-intro-main {
        grid-template-columns: 1fr;
      }
      #theme-fuwari .cluking-landing {
        padding: 1.15rem !important;
      }
      #theme-fuwari .cluking-bento-showcase {
        min-height: 0;
        padding: 12px;
      }
      #theme-fuwari .cluking-bento-header {
        grid-template-columns: auto minmax(0, 1fr);
      }
      #theme-fuwari .cluking-bento-header .cluking-eyebrow {
        grid-column: 1 / -1;
        justify-self: start;
        text-align: left;
      }
      #theme-fuwari .cluking-bento-grid {
        grid-template-columns: 1fr;
      }
      #theme-fuwari .cluking-bento-card {
        min-height: 15rem;
      }
      #theme-fuwari .cluking-name {
        font-size: clamp(1.75rem, 8vw, 2.65rem);
      }
      #theme-fuwari .cluking-signature-details {
        margin-inline: auto;
        max-width: 20rem;
      }
      #theme-fuwari .cluking-terminal-loader {
        width: min(100%, 28rem);
      }
      #theme-fuwari .fuwari-home-showcase {
        min-height: 17rem;
      }
      #theme-fuwari .fuwari-orbit-ring-one {
        width: 12rem;
        height: 6rem;
      }
      #theme-fuwari .fuwari-orbit-ring-two {
        width: 13.5rem;
        height: 7rem;
      }
      #theme-fuwari .fuwari-list-head {
        align-items: flex-start;
        flex-direction: column;
      }
      #theme-fuwari #posts-wrapper > article {
        border-radius: 0.95rem;
      }
      #theme-fuwari .fuwari-post-title {
        font-size: 2rem !important;
      }
      #theme-fuwari .fuwari-summary {
        -webkit-line-clamp: 2;
      }
      #theme-fuwari .fuwari-profile-card {
        margin-top: .25rem;
      }
    }

    @media (max-width: 540px) {
      #theme-fuwari .fuwari-snake-track {
        inset: .4rem;
        opacity: .82;
      }
      #theme-fuwari .fuwari-snake-orb {
        width: .48rem;
        height: .48rem;
      }
      #theme-fuwari .fuwari-home-actions,
      #theme-fuwari .fuwari-hero-actions {
        flex-direction: column;
        align-items: stretch;
      }
      #theme-fuwari .fuwari-home-action,
      #theme-fuwari .fuwari-home-action-primary,
      #theme-fuwari .fuwari-hero-btn {
        justify-content: center;
        text-align: center;
      }
      #theme-fuwari .cluking-landing {
        border-radius: 1rem;
      }
      #theme-fuwari .cluking-bento-showcase,
      #theme-fuwari .cluking-bento-grid {
        gap: 12px;
      }
      #theme-fuwari .cluking-bento-header {
        min-height: 0;
        border-radius: 16px;
      }
      #theme-fuwari .cluking-bento-card {
        border-radius: 16px;
        min-height: 14rem;
      }
      #theme-fuwari .cluking-loader {
        width: 30px;
      }
      #theme-fuwari .cluking-eyebrow {
        font-size: .58rem;
        letter-spacing: .2em;
        white-space: normal;
      }
      #theme-fuwari .cluking-signature-content {
        padding: .9rem;
      }
      #theme-fuwari .cluking-sunset-svg {
        width: min(100%, 13rem);
        opacity: .84;
      }
      #theme-fuwari .cluking-signature-body {
        font-size: .84rem;
      }
      #theme-fuwari .cluking-terminal-loader {
        min-height: 12.5rem;
        font-size: .92rem;
      }
      #theme-fuwari .cluking-terminal-screen {
        padding: 3.1rem .95rem 1rem;
      }
      #theme-fuwari .cluking-terminal-status {
        white-space: normal;
        text-align: left;
      }
      #theme-fuwari .cyber-profile-card {
        min-height: 13.5rem;
        padding: .9rem;
      }
      #theme-fuwari .cyber-profile-status-value {
        font-size: .68rem;
        letter-spacing: .055em;
      }
      #theme-fuwari .cyber-profile-link {
        font-size: .68rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #theme-fuwari .fuwari-snake-track::before,
      #theme-fuwari .fuwari-snake-track::after,
      #theme-fuwari .fuwari-snake-orb,
      #theme-fuwari .fuwari-orbit-ring,
      #theme-fuwari .fuwari-orbit-core,
      #theme-fuwari .fuwari-orbit-dot,
      #theme-fuwari .cluking-loader-dash,
      #theme-fuwari .cluking-loader-spin,
      #theme-fuwari .cluking-signature-card,
      #theme-fuwari .cluking-glow-disc,
      #theme-fuwari .cluking-terminal-text,
      #theme-fuwari .cyber-profile-scanline,
      #theme-fuwari .cyber-profile-row::before {
        animation: none;
      }
      #theme-fuwari .fuwari-snake-track {
        opacity: .34;
      }
    }

    #theme-fuwari .fuwari-card,
    #theme-fuwari #posts-wrapper > article {
      animation: fuwari-enter .28s ease both;
    }
    /* Readmore 的 modal 使用 fixed 定位；文章主卡若保留 transform/animation 会把它困在卡片内 */
    #theme-fuwari article.fuwari-card {
      animation: none !important;
      transform: none !important;
    }
    @keyframes fuwari-enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: none; }
    }

    /* 日历 */
    #theme-fuwari .fuwari-cal-nav {
      width: 1.65rem;
      height: 1.65rem;
      border-radius: .5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .72rem;
      color: var(--fuwari-muted);
      transition: all .18s ease;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    #theme-fuwari .fuwari-cal-nav:hover {
      color: var(--fuwari-primary);
      background: var(--fuwari-bg-soft);
    }
    #theme-fuwari .fuwari-cal-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      text-align: center;
    }
    #theme-fuwari .fuwari-cal-weekday {
      font-size: .68rem;
      color: var(--fuwari-muted);
      padding: .25rem 0;
    }
    #theme-fuwari .fuwari-cal-day {
      font-size: .78rem;
      padding: .3rem 0;
      border-radius: .4rem;
      color: var(--fuwari-text);
      transition: all .12s ease;
    }
    #theme-fuwari .fuwari-cal-today {
      background: var(--fuwari-primary);
      color: #fff;
      font-weight: 700;
    }
    #theme-fuwari .fuwari-cal-has-post:not(.fuwari-cal-today) {
      color: var(--fuwari-primary);
      font-weight: 600;
    }
  `}</style>
}

export { Style }

