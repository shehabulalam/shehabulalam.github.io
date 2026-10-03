/**
 * Tailwind CDN configuration.
 *
 * MUST load AFTER the Tailwind CDN <script> tag — the CDN defines the global
 * `tailwind` object, and assigning `tailwind.config` before it exists is a
 * silent no-op that drops the whole theme.
 *
 * Colours resolve to the CSS custom properties declared in css/styles.css, so
 * a utility like `text-muted` follows the active theme automatically and no
 * `dark:` variant is needed anywhere in the markup.
 *
 * Trade-off: because these are var() references rather than hex literals,
 * Tailwind's slash opacity syntax (e.g. `bg-accent/20`) will not work. Use the
 * pre-mixed `--accent-soft` token instead.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        base:     'var(--bg)',
        sunken:   'var(--bg-sunken)',
        content:  'var(--text)',
        muted:    'var(--text-muted)',
        faint:    'var(--text-faint)',
        accent:   'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        coral:    'var(--coral)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
};
