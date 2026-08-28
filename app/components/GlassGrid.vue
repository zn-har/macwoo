<script setup lang="ts">
interface Props {
  grids?: number
}

const props = withDefaults(defineProps<Props>(), {
  grids: 53
})

// Responsive panel count. This used to be seeded with the full desktop count
// (53), so a phone's SSR HTML contained 53 panels — each with an inline SVG, a
// gradient, two box-shadows and a ::before — that hydration then threw away.
// Seeding from the User-Agent means mobile renders the small count from the
// start; only genuinely ambiguous form factors get corrected on mount.
const isMobile = useIsMobile(1024)

const countForWidth = (w: number) => {
  let count: number
  if (w >= 1280) count = props.grids
  else if (w >= 1024) count = Math.round(props.grids * 0.72)
  else if (w >= 768) count = Math.round(props.grids * 0.50)
  else if (w >= 480) count = Math.round(props.grids * 0.30)
  else count = Math.round(props.grids * 0.18)
  // Always show at least 3 panels
  return Math.max(3, count)
}

const responsiveCount = ref(
  isMobile.value ? Math.max(3, Math.round(props.grids * 0.30)) : props.grids
)

function updateCount() {
  responsiveCount.value = countForWidth(window.innerWidth)
}

onMounted(() => {
  updateCount()
  window.addEventListener('resize', updateCount, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCount)
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden select-none z-[4]">
    <!-- Single Backdrop Blur Overlay for high-performance scrolling. -->
    <div
      class="glass-blur absolute inset-0 pointer-events-none z-[4]"
      aria-hidden="true"
    />

    <!-- Premium Glass Panel Overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-[5] flex items-center justify-start overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      <div
        v-for="i in responsiveCount"
        :key="i"
        class="glass-panel"
        :style="{
          '--panel-index': i,
          'width': `calc(100% / ${responsiveCount})`,
          'flex': `0 0 calc(100% / ${responsiveCount})`
        }"
      >
        <svg
          class="glass-svg"
          width="29"
          height="386"
          viewBox="0 0 29 386"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect
            y="-96"
            width="29"
            height="519"
            fill="#1E1E1E"
            fill-opacity="0.2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The blur layer relied SOLELY on backdrop-filter. Firefox composites
   backdrop-filter over a <video> backdrop intermittently — when it doesn't
   promote the video to its own layer that frame, the blur no-ops and the
   panel renders fully transparent (the random "transparent grid" flicker).
   Two-part fix: */

/* 1. Force the blur layer onto its own compositor layer so Firefox applies
      backdrop-filter consistently instead of flickering. */
.glass-blur {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transform: translateZ(0);
  isolation: isolate;
  /* Base frosted tint present in EVERY browser. Guarantees the glass never
     reads as fully transparent even when backdrop-filter silently no-ops.
     Subtle enough to layer cleanly under a working blur in Chromium. */
  background-color: rgba(20, 20, 20, 0.12);
}

/* 2a. Firefox: stronger tint so the frosted look survives a failed blur. The
       `-moz-appearance` feature query matches Firefox exclusively. */
@supports (-moz-appearance: none) {
  .glass-blur {
    background-color: rgba(20, 20, 20, 0.28);
  }
}

/* 2b. Browsers with no backdrop-filter at all (older Safari/embedded WebViews):
       fall back to a near-solid frosted tint instead of a transparent grid. */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-blur {
    background-color: rgba(20, 20, 20, 0.38);
  }
}

/* ── Premium Glassmorphism Vertical Panels ── */
.glass-panel {
  position: relative;
  display: block !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
  overflow: hidden;
  pointer-events: none; /* Let all mouse events pass through to content */
}

/* Sub-pixel SVG styling to fit perfectly inside the column wrapper */
.glass-svg {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
  z-index: 1;
  pointer-events: none;
}

/* Alternating gradients to create realistic refractive depth between side-by-side sheets */
.glass-panel:nth-child(odd) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.02) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.18), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.4);         /* Shadow cast to the right */
}

.glass-panel:nth-child(even) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.01) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.14), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.35);        /* Shadow cast to the right */
}

/* Left edge reflection — sharp vertical specular highlight */
.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.30) 25%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.30) 75%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  z-index: 2;
}

/* A full-viewport backdrop-filter that samples a decoding <video> is a
   per-frame GPU blur of the whole screen — the single biggest cause of scroll
   jank on mid-range Android. Touch/small viewports get the flat frosted tint
   the no-backdrop-filter fallback above already defines. `will-change` is
   likewise scoped to desktop: as a permanent declaration it pinned an extra
   compositor layer for the life of the page. */
@media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
  .glass-blur {
    will-change: transform;
  }
}

@media (max-width: 1023px), (hover: none), (pointer: coarse) {
  .glass-blur {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(20, 20, 20, 0.38);
  }

  /* Bevel highlights and cast shadows on every panel are pure overdraw at
     phone panel widths. */
  .glass-panel:nth-child(odd),
  .glass-panel:nth-child(even) {
    box-shadow: 1px 0 0 rgba(255, 255, 255, 0.14);
  }
}
</style>
