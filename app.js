/* VAULT — application complète (assemblée par tools/build.py) */
/* ==== js/00-util.js ==== */
/* Utilitaires : nombres, dates, texte, identifiants. Aucune dépendance au DOM (testé sous Node). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VaultUtil = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  /** Nombre fini ou `fallback` (une chaîne vide, null, un booléen ne sont pas des nombres). */
  function num(value, fallback = null) {
    if (value === '' || value == null || typeof value === 'boolean') return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  const escMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => escMap[ch]);

  // --- formats français (virgule décimale, espace fine pour les milliers)
  const formatters = new Map();
  function frFormat(n, minDigits, maxDigits) {
    const key = minDigits + '/' + maxDigits;
    let f = formatters.get(key);
    if (!f) { f = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits }); formatters.set(key, f); }
    return f.format(n);
  }
  /** 1234,5 — jusqu'à `max` décimales, sans zéros inutiles. */
  const fmt = (n, max = 1) => (Number.isFinite(n) ? frFormat(n, 0, max) : '0');
  /** 6,0 — toujours une décimale. */
  const fmt1 = n => (Number.isFinite(n) ? frFormat(n, 1, 1) : '0,0');
  /** 12 345 — entier arrondi. */
  const fmtInt = n => (Number.isFinite(n) ? frFormat(Math.round(n), 0, 0) : '0');
  /** « 1 jour » / « 2 jours » (0 et 1 : singulier, comme en français). */
  const plural = (n, one, many) => (Math.abs(n) >= 2 ? many : one);

  // --- dates ISO locales (AAAA-MM-JJ), sans heure ni fuseau : pas de décalage d'un jour
  const pad = n => String(n).padStart(2, '0');
  const isoDate = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function parseIso(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof s === 'string' ? s : '');
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    const t = new Date(Date.UTC(y, mo - 1, d));
    return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d ? { y, mo, d } : null;
  }
  const isIso = s => parseIso(s) !== null;
  function dayNumber(iso) { const p = parseIso(iso); return p ? Math.floor(Date.UTC(p.y, p.mo - 1, p.d) / 86400000) : NaN; }
  /** Nombre de jours entre deux dates ISO (positif si `toIso` est après `fromIso`). */
  const daysBetween = (fromIso, toIso) => dayNumber(toIso) - dayNumber(fromIso);
  function addDays(iso, n) {
    const p = parseIso(iso);
    if (!p) return '';
    const t = new Date(Date.UTC(p.y, p.mo - 1, p.d + n));
    return t.getUTCFullYear() + '-' + pad(t.getUTCMonth() + 1) + '-' + pad(t.getUTCDate());
  }
  const frDate = iso => (isIso(iso) ? iso.split('-').reverse().join('/') : '');

  // --- divers
  function uid(prefix = 'id') {
    const c = typeof globalThis !== 'undefined' ? globalThis.crypto : null;
    const rnd = c && c.randomUUID ? c.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    return prefix + '-' + rnd;
  }
  const truncate = (value, max) => String(value == null ? '' : value).slice(0, max);
  /** Texte sans accents ni majuscules, pour les recherches. */
  const fold = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function debounce(fn, ms) {
    let t = null;
    const wrapped = (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    wrapped.flush = (...args) => { clearTimeout(t); fn(...args); };
    wrapped.cancel = () => clearTimeout(t);
    return wrapped;
  }
  /** Copie profonde de données JSON. */
  const clone = value => JSON.parse(JSON.stringify(value));

  return { clamp, num, esc, fmt, fmt1, fmtInt, plural, pad, isoDate, parseIso, isIso, daysBetween, addDays, frDate, uid, truncate, fold, debounce, clone };
});


/* ==== js/01-icons.js ==== */
/* Icônes : Lucide (https://lucide.dev), licence ISC, assemblées en un sprite SVG.
 * FICHIER GÉNÉRÉ par tools/make_sprite.cjs : ne pas modifier à la main. */
const VaultIcons = (() => {
  const SPRITE = "<svg id=\"vault-sprite\" class=\"sprite\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><symbol id=\"i-house\" viewBox=\"0 0 24 24\"><path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></symbol><symbol id=\"i-clipboard-check\" viewBox=\"0 0 24 24\"><rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"m9 14 2 2 4-4\"/></symbol><symbol id=\"i-list-checks\" viewBox=\"0 0 24 24\"><path d=\"M13 5h8\"/><path d=\"M13 12h8\"/><path d=\"M13 19h8\"/><path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/></symbol><symbol id=\"i-boxes\" viewBox=\"0 0 24 24\"><path d=\"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z\"/><path d=\"m7 16.5-4.74-2.85\"/><path d=\"m7 16.5 5-3\"/><path d=\"M7 16.5v5.17\"/><path d=\"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z\"/><path d=\"m17 16.5-5-3\"/><path d=\"m17 16.5 4.74-2.85\"/><path d=\"M17 16.5v5.17\"/><path d=\"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z\"/><path d=\"M12 8 7.26 5.15\"/><path d=\"m12 8 4.74-2.85\"/><path d=\"M12 13.5V8\"/></symbol><symbol id=\"i-package\" viewBox=\"0 0 24 24\"><path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"/><path d=\"M12 22V12\"/><polyline points=\"3.29 7 12 12 20.71 7\"/><path d=\"m7.5 4.27 9 5.15\"/></symbol><symbol id=\"i-phone\" viewBox=\"0 0 24 24\"><path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"/></symbol><symbol id=\"i-phone-call\" viewBox=\"0 0 24 24\"><path d=\"M13 2a9 9 0 0 1 9 9\"/><path d=\"M13 6a5 5 0 0 1 5 5\"/><path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"/></symbol><symbol id=\"i-siren\" viewBox=\"0 0 24 24\"><path d=\"M7 18v-6a5 5 0 1 1 10 0v6\"/><path d=\"M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z\"/><path d=\"M21 12h1\"/><path d=\"M18.5 4.5 18 5\"/><path d=\"M2 12h1\"/><path d=\"M12 2v1\"/><path d=\"m4.929 4.929.707.707\"/><path d=\"M12 12v6\"/></symbol><symbol id=\"i-book-open\" viewBox=\"0 0 24 24\"><path d=\"M12 7v14\"/><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/></symbol><symbol id=\"i-wrench\" viewBox=\"0 0 24 24\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z\"/></symbol><symbol id=\"i-settings\" viewBox=\"0 0 24 24\"><path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></symbol><symbol id=\"i-user\" viewBox=\"0 0 24 24\"><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></symbol><symbol id=\"i-users\" viewBox=\"0 0 24 24\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/></symbol><symbol id=\"i-sliders-horizontal\" viewBox=\"0 0 24 24\"><path d=\"M10 5H3\"/><path d=\"M12 19H3\"/><path d=\"M14 3v4\"/><path d=\"M16 17v4\"/><path d=\"M21 12h-9\"/><path d=\"M21 19h-5\"/><path d=\"M21 5h-7\"/><path d=\"M8 10v4\"/><path d=\"M8 12H3\"/></symbol><symbol id=\"i-droplet\" viewBox=\"0 0 24 24\"><path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"/></symbol><symbol id=\"i-droplets\" viewBox=\"0 0 24 24\"><path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"/></symbol><symbol id=\"i-utensils\" viewBox=\"0 0 24 24\"><path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"/><path d=\"M7 2v20\"/><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"/></symbol><symbol id=\"i-wheat\" viewBox=\"0 0 24 24\"><path d=\"M2 22 16 8\"/><path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\"/><path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/><path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/><path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/></symbol><symbol id=\"i-battery-charging\" viewBox=\"0 0 24 24\"><path d=\"m11 7-3 5h4l-3 5\"/><path d=\"M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935\"/><path d=\"M22 14v-4\"/><path d=\"M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936\"/></symbol><symbol id=\"i-battery\" viewBox=\"0 0 24 24\"><path d=\"M 22 14 L 22 10\"/><rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\"/></symbol><symbol id=\"i-zap\" viewBox=\"0 0 24 24\"><path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/></symbol><symbol id=\"i-plug\" viewBox=\"0 0 24 24\"><path d=\"M12 22v-5\"/><path d=\"M15 8V2\"/><path d=\"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z\"/><path d=\"M9 8V2\"/></symbol><symbol id=\"i-flame\" viewBox=\"0 0 24 24\"><path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\"/></symbol><symbol id=\"i-flashlight\" viewBox=\"0 0 24 24\"><path d=\"M12 13v1\"/><path d=\"M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z\"/><path d=\"M6 6h12\"/></symbol><symbol id=\"i-volume-2\" viewBox=\"0 0 24 24\"><path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\"/><path d=\"M16 9a5 5 0 0 1 0 6\"/><path d=\"M19.364 18.364a9 9 0 0 0 0-12.728\"/></symbol><symbol id=\"i-vibrate\" viewBox=\"0 0 24 24\"><path d=\"m2 8 2 2-2 2 2 2-2 2\"/><path d=\"m22 8-2 2 2 2-2 2 2 2\"/><rect width=\"8\" height=\"14\" x=\"8\" y=\"5\" rx=\"1\"/></symbol><symbol id=\"i-mic\" viewBox=\"0 0 24 24\"><path d=\"M12 19v3\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\"/></symbol><symbol id=\"i-camera\" viewBox=\"0 0 24 24\"><path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/></symbol><symbol id=\"i-map-pin\" viewBox=\"0 0 24 24\"><path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/></symbol><symbol id=\"i-compass\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"/></symbol><symbol id=\"i-navigation\" viewBox=\"0 0 24 24\"><polygon points=\"3 11 22 2 13 21 11 13 3 11\"/></symbol><symbol id=\"i-crosshair\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"22\" x2=\"18\" y1=\"12\" y2=\"12\"/><line x1=\"6\" x2=\"2\" y1=\"12\" y2=\"12\"/><line x1=\"12\" x2=\"12\" y1=\"6\" y2=\"2\"/><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"18\"/></symbol><symbol id=\"i-locate-fixed\" viewBox=\"0 0 24 24\"><line x1=\"2\" x2=\"5\" y1=\"12\" y2=\"12\"/><line x1=\"19\" x2=\"22\" y1=\"12\" y2=\"12\"/><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"5\"/><line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\"/><circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></symbol><symbol id=\"i-radio\" viewBox=\"0 0 24 24\"><path d=\"M16.247 7.761a6 6 0 0 1 0 8.478\"/><path d=\"M19.075 4.933a10 10 0 0 1 0 14.134\"/><path d=\"M4.925 19.067a10 10 0 0 1 0-14.134\"/><path d=\"M7.753 16.239a6 6 0 0 1 0-8.478\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></symbol><symbol id=\"i-radio-tower\" viewBox=\"0 0 24 24\"><path d=\"M4.9 16.1C1 12.2 1 5.8 4.9 1.9\"/><path d=\"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5\"/><circle cx=\"12\" cy=\"9\" r=\"2\"/><path d=\"M16.2 4.8c2 2 2.26 5.11.8 7.47\"/><path d=\"M19.1 1.9a9.96 9.96 0 0 1 0 14.1\"/><path d=\"M9.5 18h5\"/><path d=\"m8 22 4-11 4 11\"/></symbol><symbol id=\"i-audio-lines\" viewBox=\"0 0 24 24\"><path d=\"M2 10v3\"/><path d=\"M6 6v11\"/><path d=\"M10 3v18\"/><path d=\"M14 8v7\"/><path d=\"M18 5v13\"/><path d=\"M22 10v3\"/></symbol><symbol id=\"i-activity\" viewBox=\"0 0 24 24\"><path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"/></symbol><symbol id=\"i-megaphone\" viewBox=\"0 0 24 24\"><path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\"/><path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\"/><path d=\"M8 6v8\"/></symbol><symbol id=\"i-bell\" viewBox=\"0 0 24 24\"><path d=\"M10.268 21a2 2 0 0 0 3.464 0\"/><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"/></symbol><symbol id=\"i-ear\" viewBox=\"0 0 24 24\"><path d=\"M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0\"/><path d=\"M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4\"/></symbol><symbol id=\"i-languages\" viewBox=\"0 0 24 24\"><path d=\"m5 8 6 6\"/><path d=\"m4 14 6-6 2-3\"/><path d=\"M2 5h12\"/><path d=\"M7 2h1\"/><path d=\"m22 22-5-10-5 10\"/><path d=\"M14 18h6\"/></symbol><symbol id=\"i-route\" viewBox=\"0 0 24 24\"><circle cx=\"6\" cy=\"19\" r=\"3\"/><path d=\"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15\"/><circle cx=\"18\" cy=\"5\" r=\"3\"/></symbol><symbol id=\"i-lightbulb\" viewBox=\"0 0 24 24\"><path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/><path d=\"M9 18h6\"/><path d=\"M10 22h4\"/></symbol><symbol id=\"i-gauge\" viewBox=\"0 0 24 24\"><path d=\"m12 14 4-4\"/><path d=\"M3.34 19a10 10 0 1 1 17.32 0\"/></symbol><symbol id=\"i-signal\" viewBox=\"0 0 24 24\"><path d=\"M2 20h.01\"/><path d=\"M7 20v-4\"/><path d=\"M12 20v-8\"/><path d=\"M17 20V8\"/><path d=\"M22 4v16\"/></symbol><symbol id=\"i-heart-pulse\" viewBox=\"0 0 24 24\"><path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/><path d=\"M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27\"/></symbol><symbol id=\"i-stethoscope\" viewBox=\"0 0 24 24\"><path d=\"M11 2v2\"/><path d=\"M5 2v2\"/><path d=\"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1\"/><path d=\"M8 15a6 6 0 0 0 12 0v-3\"/><circle cx=\"20\" cy=\"10\" r=\"2\"/></symbol><symbol id=\"i-pill\" viewBox=\"0 0 24 24\"><path d=\"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z\"/><path d=\"m8.5 8.5 7 7\"/></symbol><symbol id=\"i-cross\" viewBox=\"0 0 24 24\"><path d=\"M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z\"/></symbol><symbol id=\"i-ambulance\" viewBox=\"0 0 24 24\"><path d=\"M10 10H6\"/><path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14\"/><path d=\"M8 8v4\"/><path d=\"M9 18h6\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/></symbol><symbol id=\"i-hospital\" viewBox=\"0 0 24 24\"><path d=\"M12 7v4\"/><path d=\"M14 21v-3a2 2 0 0 0-4 0v3\"/><path d=\"M14 9h-4\"/><path d=\"M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2\"/><path d=\"M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16\"/></symbol><symbol id=\"i-baby\" viewBox=\"0 0 24 24\"><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"/><path d=\"M15 12h.01\"/><path d=\"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"/><path d=\"M9 12h.01\"/></symbol><symbol id=\"i-paw-print\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"4\" r=\"2\"/><circle cx=\"18\" cy=\"8\" r=\"2\"/><circle cx=\"20\" cy=\"16\" r=\"2\"/><path d=\"M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z\"/></symbol><symbol id=\"i-id-card\" viewBox=\"0 0 24 24\"><path d=\"M16 10h2\"/><path d=\"M16 14h2\"/><path d=\"M6.17 15a3 3 0 0 1 5.66 0\"/><circle cx=\"9\" cy=\"11\" r=\"2\"/><rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/></symbol><symbol id=\"i-contact\" viewBox=\"0 0 24 24\"><path d=\"M16 2v2\"/><path d=\"M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2\"/><path d=\"M8 2v2\"/><circle cx=\"12\" cy=\"11\" r=\"3\"/><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/></symbol><symbol id=\"i-heart\" viewBox=\"0 0 24 24\"><path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/></symbol><symbol id=\"i-triangle-alert\" viewBox=\"0 0 24 24\"><path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/></symbol><symbol id=\"i-cloud-lightning\" viewBox=\"0 0 24 24\"><path d=\"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973\"/><path d=\"m13 12-3 5h4l-3 5\"/></symbol><symbol id=\"i-tornado\" viewBox=\"0 0 24 24\"><path d=\"M21 4H3\"/><path d=\"M18 8H6\"/><path d=\"M19 12H9\"/><path d=\"M16 16h-6\"/><path d=\"M11 20H9\"/></symbol><symbol id=\"i-waves\" viewBox=\"0 0 24 24\"><path d=\"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/></symbol><symbol id=\"i-thermometer\" viewBox=\"0 0 24 24\"><path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/></symbol><symbol id=\"i-snowflake\" viewBox=\"0 0 24 24\"><path d=\"m10 20-1.25-2.5L6 18\"/><path d=\"M10 4 8.75 6.5 6 6\"/><path d=\"m14 20 1.25-2.5L18 18\"/><path d=\"m14 4 1.25 2.5L18 6\"/><path d=\"m17 21-3-6h-4\"/><path d=\"m17 3-3 6 1.5 3\"/><path d=\"M2 12h6.5L10 9\"/><path d=\"m20 10-1.5 2 1.5 2\"/><path d=\"M22 12h-6.5L14 15\"/><path d=\"m4 10 1.5 2L4 14\"/><path d=\"m7 21 3-6-1.5-3\"/><path d=\"m7 3 3 6h4\"/></symbol><symbol id=\"i-wind\" viewBox=\"0 0 24 24\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></symbol><symbol id=\"i-mountain\" viewBox=\"0 0 24 24\"><path d=\"m8 3 4 8 5-5 5 15H2L8 3z\"/></symbol><symbol id=\"i-biohazard\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"11.9\" r=\"2\"/><path d=\"M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6\"/><path d=\"m8.9 10.1 1.4.8\"/><path d=\"M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5\"/><path d=\"m15.1 10.1-1.4.8\"/><path d=\"M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2\"/><path d=\"M12 13.9v1.6\"/><path d=\"M13.5 5.4c-1-.2-2-.2-3 0\"/><path d=\"M17 16.4c.7-.7 1.2-1.6 1.5-2.5\"/><path d=\"M5.5 13.9c.3.9.8 1.8 1.5 2.5\"/></symbol><symbol id=\"i-radiation\" viewBox=\"0 0 24 24\"><path d=\"M12 12h.01\"/><path d=\"M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z\"/><path d=\"M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z\"/><path d=\"M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z\"/></symbol><symbol id=\"i-flame-kindling\" viewBox=\"0 0 24 24\"><path d=\"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z\"/><path d=\"m5 22 14-4\"/><path d=\"m5 18 14 4\"/></symbol><symbol id=\"i-wifi-off\" viewBox=\"0 0 24 24\"><path d=\"M12 20h.01\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/><path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"/><path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"/><path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"/><path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"/><path d=\"m2 2 20 20\"/></symbol><symbol id=\"i-shield-check\" viewBox=\"0 0 24 24\"><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/></symbol><symbol id=\"i-shield\" viewBox=\"0 0 24 24\"><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/></symbol><symbol id=\"i-life-buoy\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m4.93 4.93 4.24 4.24\"/><path d=\"m14.83 9.17 4.24-4.24\"/><path d=\"m14.83 14.83 4.24 4.24\"/><path d=\"m9.17 14.83-4.24 4.24\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/></symbol><symbol id=\"i-octagon-alert\" viewBox=\"0 0 24 24\"><path d=\"M12 16h.01\"/><path d=\"M12 8v4\"/><path d=\"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z\"/></symbol><symbol id=\"i-plus\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14\"/><path d=\"M12 5v14\"/></symbol><symbol id=\"i-minus\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14\"/></symbol><symbol id=\"i-x\" viewBox=\"0 0 24 24\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></symbol><symbol id=\"i-check\" viewBox=\"0 0 24 24\"><path d=\"M20 6 9 17l-5-5\"/></symbol><symbol id=\"i-chevron-right\" viewBox=\"0 0 24 24\"><path d=\"m9 18 6-6-6-6\"/></symbol><symbol id=\"i-chevron-left\" viewBox=\"0 0 24 24\"><path d=\"m15 18-6-6 6-6\"/></symbol><symbol id=\"i-chevron-down\" viewBox=\"0 0 24 24\"><path d=\"m6 9 6 6 6-6\"/></symbol><symbol id=\"i-chevron-up\" viewBox=\"0 0 24 24\"><path d=\"m18 15-6-6-6 6\"/></symbol><symbol id=\"i-arrow-right\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/></symbol><symbol id=\"i-arrow-left\" viewBox=\"0 0 24 24\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></symbol><symbol id=\"i-arrow-up\" viewBox=\"0 0 24 24\"><path d=\"m5 12 7-7 7 7\"/><path d=\"M12 19V5\"/></symbol><symbol id=\"i-external-link\" viewBox=\"0 0 24 24\"><path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/></symbol><symbol id=\"i-search\" viewBox=\"0 0 24 24\"><path d=\"m21 21-4.34-4.34\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/></symbol><symbol id=\"i-pencil\" viewBox=\"0 0 24 24\"><path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/><path d=\"m15 5 4 4\"/></symbol><symbol id=\"i-trash-2\" viewBox=\"0 0 24 24\"><path d=\"M10 11v6\"/><path d=\"M14 11v6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M3 6h18\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></symbol><symbol id=\"i-copy\" viewBox=\"0 0 24 24\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></symbol><symbol id=\"i-share-2\" viewBox=\"0 0 24 24\"><circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"/><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"/></symbol><symbol id=\"i-download\" viewBox=\"0 0 24 24\"><path d=\"M12 15V3\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/></symbol><symbol id=\"i-upload\" viewBox=\"0 0 24 24\"><path d=\"M12 3v12\"/><path d=\"m17 8-5-5-5 5\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/></symbol><symbol id=\"i-printer\" viewBox=\"0 0 24 24\"><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"/></symbol><symbol id=\"i-save\" viewBox=\"0 0 24 24\"><path d=\"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\"/><path d=\"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7\"/><path d=\"M7 3v4a1 1 0 0 0 1 1h7\"/></symbol><symbol id=\"i-refresh-cw\" viewBox=\"0 0 24 24\"><path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M8 16H3v5\"/></symbol><symbol id=\"i-rotate-ccw\" viewBox=\"0 0 24 24\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/></symbol><symbol id=\"i-info\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/></symbol><symbol id=\"i-circle-question-mark\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><path d=\"M12 17h.01\"/></symbol><symbol id=\"i-lock\" viewBox=\"0 0 24 24\"><rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></symbol><symbol id=\"i-sun\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/></symbol><symbol id=\"i-moon\" viewBox=\"0 0 24 24\"><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/></symbol><symbol id=\"i-eye\" viewBox=\"0 0 24 24\"><path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></symbol><symbol id=\"i-eye-off\" viewBox=\"0 0 24 24\"><path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"/><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"/><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"/><path d=\"m2 2 20 20\"/></symbol><symbol id=\"i-clock\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/></symbol><symbol id=\"i-calendar\" viewBox=\"0 0 24 24\"><path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/></symbol><symbol id=\"i-calendar-clock\" viewBox=\"0 0 24 24\"><path d=\"M16 14v2.2l1.6 1\"/><path d=\"M16 2v4\"/><path d=\"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5\"/><path d=\"M3 10h5\"/><path d=\"M8 2v4\"/><circle cx=\"16\" cy=\"16\" r=\"6\"/></symbol><symbol id=\"i-shopping-cart\" viewBox=\"0 0 24 24\"><circle cx=\"8\" cy=\"21\" r=\"1\"/><circle cx=\"19\" cy=\"21\" r=\"1\"/><path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\"/></symbol><symbol id=\"i-file-text\" viewBox=\"0 0 24 24\"><path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"/><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/></symbol><symbol id=\"i-key\" viewBox=\"0 0 24 24\"><path d=\"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4\"/><path d=\"m21 2-9.6 9.6\"/><circle cx=\"7.5\" cy=\"15.5\" r=\"5.5\"/></symbol><symbol id=\"i-building-2\" viewBox=\"0 0 24 24\"><path d=\"M10 12h4\"/><path d=\"M10 8h4\"/><path d=\"M14 21v-3a2 2 0 0 0-4 0v3\"/><path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\"/><path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\"/></symbol><symbol id=\"i-backpack\" viewBox=\"0 0 24 24\"><path d=\"M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z\"/><path d=\"M8 10h8\"/><path d=\"M8 18h8\"/><path d=\"M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6\"/><path d=\"M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2\"/></symbol><symbol id=\"i-tent\" viewBox=\"0 0 24 24\"><path d=\"M3.5 21 14 3\"/><path d=\"M20.5 21 10 3\"/><path d=\"M15.5 21 12 15l-3.5 6\"/><path d=\"M2 21h20\"/></symbol><symbol id=\"i-message-square\" viewBox=\"0 0 24 24\"><path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\"/></symbol><symbol id=\"i-badge-check\" viewBox=\"0 0 24 24\"><path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m9 12 2 2 4-4\"/></symbol><symbol id=\"i-graduation-cap\" viewBox=\"0 0 24 24\"><path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/><path d=\"M22 10v6\"/><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/></symbol><symbol id=\"i-smartphone\" viewBox=\"0 0 24 24\"><rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M12 18h.01\"/></symbol><symbol id=\"i-star\" viewBox=\"0 0 24 24\"><path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/></symbol><symbol id=\"i-pin\" viewBox=\"0 0 24 24\"><path d=\"M12 17v5\"/><path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\"/></symbol><symbol id=\"i-history\" viewBox=\"0 0 24 24\"><path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/></symbol><symbol id=\"i-circle-check\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m9 12 2 2 4-4\"/></symbol><symbol id=\"i-circle-alert\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/></symbol><symbol id=\"i-ellipsis\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/><circle cx=\"5\" cy=\"12\" r=\"1\"/></symbol><symbol id=\"i-palette\" viewBox=\"0 0 24 24\"><path d=\"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z\"/><circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/></symbol><symbol id=\"i-type\" viewBox=\"0 0 24 24\"><path d=\"M12 4v16\"/><path d=\"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2\"/><path d=\"M9 20h6\"/></symbol><symbol id=\"i-wifi\" viewBox=\"0 0 24 24\"><path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.859a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/></symbol><symbol id=\"i-hand-heart\" viewBox=\"0 0 24 24\"><path d=\"M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16\"/><path d=\"m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95\"/><path d=\"m2 15 6 6\"/><path d=\"m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91\"/></symbol><symbol id=\"i-scan-line\" viewBox=\"0 0 24 24\"><path d=\"M3 7V5a2 2 0 0 1 2-2h2\"/><path d=\"M17 3h2a2 2 0 0 1 2 2v2\"/><path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"/><path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"/><path d=\"M7 12h10\"/></symbol><symbol id=\"i-play\" viewBox=\"0 0 24 24\"><path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\"/></symbol><symbol id=\"i-square\" viewBox=\"0 0 24 24\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/></symbol><symbol id=\"i-pause\" viewBox=\"0 0 24 24\"><rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/><rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/></symbol><symbol id=\"i-bug-off\" viewBox=\"0 0 24 24\"><path d=\"M12 20v-8\"/><path d=\"M12.656 7H14a4 4 0 0 1 4 4v1.344\"/><path d=\"M14.12 3.88 16 2\"/><path d=\"M17.123 17.123A6 6 0 0 1 6 14v-3a4 4 0 0 1 1.72-3.287\"/><path d=\"m2 2 20 20\"/><path d=\"M21 5a4 4 0 0 1-3.55 3.97\"/><path d=\"M22 13h-3.344\"/><path d=\"M3 21a4 4 0 0 1 3.81-4\"/><path d=\"M3 5a4 4 0 0 0 3.55 3.97\"/><path d=\"M6 13H2\"/><path d=\"m8 2 1.88 1.88\"/><path d=\"M9.712 4.06A3 3 0 0 1 15 6v1.13\"/></symbol><symbol id=\"i-monitor-smartphone\" viewBox=\"0 0 24 24\"><path d=\"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8\"/><path d=\"M10 19v-3.96 3.15\"/><path d=\"M7 19h5\"/><rect width=\"6\" height=\"10\" x=\"16\" y=\"12\" rx=\"2\"/></symbol><symbol id=\"i-list-filter\" viewBox=\"0 0 24 24\"><path d=\"M2 5h20\"/><path d=\"M6 12h12\"/><path d=\"M9 19h6\"/></symbol><symbol id=\"i-arrow-down-to-line\" viewBox=\"0 0 24 24\"><path d=\"M12 17V3\"/><path d=\"m6 11 6 6 6-6\"/><path d=\"M19 21H5\"/></symbol><symbol id=\"i-git-branch\" viewBox=\"0 0 24 24\"><path d=\"M15 6a9 9 0 0 0-9 9V3\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/></symbol><symbol id=\"i-sparkles\" viewBox=\"0 0 24 24\"><path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/></symbol><symbol id=\"i-party-popper\" viewBox=\"0 0 24 24\"><path d=\"M5.8 11.3 2 22l10.7-3.79\"/><path d=\"M4 3h.01\"/><path d=\"M22 8h.01\"/><path d=\"M15 2h.01\"/><path d=\"M22 20h.01\"/><path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\"/><path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\"/><path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\"/><path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\"/></symbol><symbol id=\"i-hammer\" viewBox=\"0 0 24 24\"><path d=\"m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9\"/><path d=\"m18 15 4-4\"/><path d=\"m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5\"/></symbol><symbol id=\"i-footprints\" viewBox=\"0 0 24 24\"><path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\"/><path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\"/><path d=\"M16 17h4\"/><path d=\"M4 13h4\"/></symbol><symbol id=\"i-hand\" viewBox=\"0 0 24 24\"><path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"/><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"/><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"/><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/></symbol><symbol id=\"i-milk\" viewBox=\"0 0 24 24\"><path d=\"M8 2h8\"/><path d=\"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2\"/><path d=\"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0\"/></symbol><symbol id=\"i-bone\" viewBox=\"0 0 24 24\"><path d=\"M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z\"/></symbol></svg>";
  const NAMES = ["house","clipboard-check","list-checks","boxes","package","phone","phone-call","siren","book-open","wrench","settings","user","users","sliders-horizontal","droplet","droplets","utensils","wheat","battery-charging","battery","zap","plug","flame","flashlight","volume-2","vibrate","mic","camera","map-pin","compass","navigation","crosshair","locate-fixed","radio","radio-tower","audio-lines","activity","megaphone","bell","ear","languages","route","lightbulb","gauge","signal","heart-pulse","stethoscope","pill","cross","ambulance","hospital","baby","paw-print","id-card","contact","heart","triangle-alert","cloud-lightning","tornado","waves","thermometer","snowflake","wind","mountain","biohazard","radiation","flame-kindling","wifi-off","shield-check","shield","life-buoy","octagon-alert","plus","minus","x","check","chevron-right","chevron-left","chevron-down","chevron-up","arrow-right","arrow-left","arrow-up","external-link","search","pencil","trash-2","copy","share-2","download","upload","printer","save","refresh-cw","rotate-ccw","info","circle-question-mark","lock","sun","moon","eye","eye-off","clock","calendar","calendar-clock","shopping-cart","file-text","key","building-2","backpack","tent","message-square","badge-check","graduation-cap","smartphone","star","pin","history","circle-check","circle-alert","ellipsis","palette","type","wifi","hand-heart","scan-line","play","square","pause","bug-off","monitor-smartphone","list-filter","arrow-down-to-line","git-branch","sparkles","party-popper","hammer","footprints","hand","milk","bone"];
  const available = new Set(NAMES);
  function mount() {
    if (document.getElementById('vault-sprite')) return;
    document.body.insertAdjacentHTML('afterbegin', SPRITE);
  }
  /** Balise <svg> d'une icône (décorative : le libellé est toujours porté par le texte voisin ou un aria-label). */
  function svg(name, cls) {
    const id = available.has(name) ? name : 'circle-question-mark';
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + id + '"/></svg>';
  }
  return { mount, svg, has: n => available.has(n), names: NAMES };
})();


/* ==== js/10-data-kit.js ==== */
/* Kit 72 h : éléments de base, compléments, besoins du foyer, contrôles périodiques. Données + calculs purs. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'));
  else root.VaultKit = factory(root.VaultUtil);
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  const CATEGORIES = [
    { id: 'water-food', label: 'Eau et nourriture', icon: 'droplets' },
    { id: 'power-comms', label: 'Énergie et communication', icon: 'zap' },
    { id: 'health', label: 'Santé et hygiène', icon: 'heart-pulse' },
    { id: 'docs', label: 'Documents et argent', icon: 'file-text' },
    { id: 'comfort', label: 'Confort et protection', icon: 'tent' },
    { id: 'household', label: 'Selon mon foyer', icon: 'users' },
    { id: 'custom', label: 'Mes éléments', icon: 'pencil' },
  ];

  // Les 12 éléments d'origine gardent leurs numéros 0 à 11 : les cases déjà cochées restent valables.
  const BASE = [
    { id: '0', cat: 'water-food', label: 'Eau pour 72 h', hint: '6 litres par personne pour 72 h (2 L par jour), en bouteilles fermées.' },
    { id: '1', cat: 'water-food', label: 'Nourriture sans cuisson', hint: 'Conserves, biscuits, fruits secs, barres : ce qui se mange sans chauffer.' },
    { id: '2', cat: 'power-comms', label: 'Lampe + piles', hint: 'Lampe frontale ou à piles, avec des piles de rechange rangées à part.' },
    { id: '3', cat: 'power-comms', label: 'Batterie externe', hint: 'Chargée, avec les câbles adaptés à tes appareils.' },
    { id: '4', cat: 'power-comms', label: 'Radio autonome', hint: 'À piles ou à manivelle, pour suivre les consignes officielles.' },
    { id: '5', cat: 'health', label: 'Trousse de premiers secours', hint: 'Pansements, compresses, antiseptique, couverture de survie, ciseaux, gants.' },
    { id: '6', cat: 'health', label: 'Traitements personnels', hint: 'Quelques jours de réserve et des ordonnances à jour.' },
    { id: '7', cat: 'docs', label: 'Copies de documents', hint: 'Pièce d’identité, assurance, ordonnances : copies papier ou clé USB protégée.' },
    { id: '8', cat: 'docs', label: 'Argent liquide', hint: 'En petites coupures : les paiements par carte peuvent être indisponibles.' },
    { id: '9', cat: 'comfort', label: 'Couverture / vêtements chauds', hint: 'Une couverture par personne et des couches chaudes faciles à atteindre.' },
    { id: '10', cat: 'health', label: 'Hygiène de base', hint: 'Savon, brosse à dents, papier toilette, protections hygiéniques, sacs poubelle.' },
    { id: '11', cat: 'power-comms', label: 'Contacts d’urgence hors ligne', hint: 'Numéros importants sur papier : proches, médecin, école, voisin.' },
  ];

  // Éléments ajoutés selon le foyer : ils comptent dans le score uniquement si la case correspondante est cochée.
  const NEEDS = {
    baby: { label: 'Un bébé', icon: 'baby', items: [
      { id: 'n-baby-1', label: 'Lait infantile et biberons (avec l’eau pour 72 h)' },
      { id: 'n-baby-2', label: 'Couches, lingettes et vêtements de rechange' },
      { id: 'n-baby-3', label: 'Doudou, tétine et médicaments pédiatriques' },
    ] },
    child: { label: 'Des enfants', icon: 'users', items: [
      { id: 'n-child-1', label: 'Vêtements adaptés et rechange pour les enfants' },
      { id: 'n-child-2', label: 'Jeux ou livres pour les occuper' },
      { id: 'n-child-3', label: 'Contacts et point de rendez-vous connus des enfants' },
    ] },
    senior: { label: 'Une personne âgée ou à mobilité réduite', icon: 'user', items: [
      { id: 'n-senior-1', label: 'Appareil auditif (piles) et lunettes de rechange' },
      { id: 'n-senior-2', label: 'Aide à la mobilité (canne, déambulateur) à portée de main' },
      { id: 'n-senior-3', label: 'Ordonnances et dossier médical à jour' },
    ] },
    pets: { label: 'Des animaux', icon: 'paw-print', items: [
      { id: 'n-pets-1', label: 'Nourriture et eau pour les animaux (72 h)' },
      { id: 'n-pets-2', label: 'Laisse, caisse de transport ou cage' },
      { id: 'n-pets-3', label: 'Carnet de santé et identification de l’animal' },
    ] },
    medical: { label: 'Un besoin médical particulier', icon: 'stethoscope', items: [
      { id: 'n-medical-1', label: 'Réserve de traitements pour au moins 7 jours' },
      { id: 'n-medical-2', label: 'Matériel médical de secours (piles, alimentation de secours)' },
      { id: 'n-medical-3', label: 'Coordonnées du médecin et du service de soins' },
    ] },
  };

  // Compléments conseillés : suivis, mais sans effet sur le score.
  const SUPPLEMENTS = [
    { id: 's-purify', cat: 'water-food', label: 'Pastilles ou filtre pour rendre l’eau potable' },
    { id: 's-opener', cat: 'water-food', label: 'Ouvre-boîte manuel et couverts' },
    { id: 's-whistle', cat: 'power-comms', label: 'Sifflet (signal de détresse)' },
    { id: 's-cables', cat: 'power-comms', label: 'Câbles et chargeurs de rechange' },
    { id: 's-spare', cat: 'power-comms', label: 'Piles de rechange' },
    { id: 's-crank', cat: 'power-comms', label: 'Lampe ou chargeur à manivelle ou solaire' },
    { id: 's-masks', cat: 'health', label: 'Masques FFP2 et gants jetables' },
    { id: 's-glasses', cat: 'health', label: 'Lunettes de rechange' },
    { id: 's-thermo', cat: 'health', label: 'Thermomètre' },
    { id: 's-clothes', cat: 'comfort', label: 'Vêtements de rechange et chaussures solides' },
    { id: 's-bags', cat: 'comfort', label: 'Sacs poubelle et sacs étanches' },
    { id: 's-tools', cat: 'comfort', label: 'Ruban adhésif et couteau multifonction' },
    { id: 's-map', cat: 'comfort', label: 'Carte papier de la région et crayon' },
    { id: 's-games', cat: 'comfort', label: 'Jeux, livres ou activités' },
  ];

  // Contrôles périodiques : « tous les N jours ».
  const REMINDERS = [
    { id: 'water', label: 'Renouveler l’eau stockée', every: 180, icon: 'droplet', hint: 'Remplace l’eau tous les 6 mois environ, ou selon la date de l’emballage.' },
    { id: 'food', label: 'Vérifier les dates des aliments', every: 90, icon: 'utensils', hint: 'Passe en revue les dates et consomme d’abord ce qui approche de la limite.' },
    { id: 'lights', label: 'Tester lampes, radio et piles', every: 180, icon: 'flashlight', hint: 'Allume chaque appareil et remplace les piles faibles.' },
    { id: 'powerbank', label: 'Recharger la batterie externe', every: 90, icon: 'battery-charging', hint: 'Une batterie inutilisée se décharge lentement.' },
    { id: 'meds', label: 'Vérifier traitements et trousse de secours', every: 180, icon: 'pill', hint: 'Contrôle les dates et complète ce qui manque.' },
    { id: 'docs', label: 'Mettre à jour copies et contacts', every: 365, icon: 'file-text', hint: 'Documents, numéros importants, ordonnances.' },
  ];

  const mark = (state, id) => !!(state && state.checklist && state.checklist[id]);

  /** Éléments du kit pour un état donné : { core, supplements, custom } avec `done` renseigné. */
  function kitItems(state) {
    const needs = (state && state.needs) || {};
    const core = BASE.map(i => Object.assign({ core: true }, i, { done: mark(state, i.id) }));
    Object.keys(NEEDS).forEach(key => {
      if (needs[key]) NEEDS[key].items.forEach(i => core.push(Object.assign({ core: true, cat: 'household', need: key }, i, { done: mark(state, i.id) })));
    });
    const supplements = SUPPLEMENTS.map(i => Object.assign({ core: false }, i, { done: mark(state, i.id) }));
    const custom = ((state && state.customKit) || []).map(i => ({ id: i.id, cat: 'custom', label: i.label, done: !!i.done, core: false, custom: true }));
    return { core, supplements, custom };
  }

  /** Progression de la liste qui compte dans le score. */
  function coreProgress(state) {
    const items = kitItems(state).core;
    const done = items.filter(i => i.done).length;
    return { done, total: items.length, ratio: items.length ? done / items.length : 0 };
  }

  /** État d'un contrôle périodique : jamais fait, à jour, bientôt dû, en retard. */
  function reminderStatus(reminder, lastIso, todayIso) {
    if (!U.isIso(lastIso)) return { level: 'never', daysSince: null, daysLeft: null };
    const daysSince = U.daysBetween(lastIso, todayIso);
    const daysLeft = reminder.every - daysSince;
    const level = daysLeft < 0 ? 'overdue' : daysLeft <= 14 ? 'soon' : 'ok';
    return { level, daysSince, daysLeft };
  }

  return { CATEGORIES, BASE, NEEDS, SUPPLEMENTS, REMINDERS, kitItems, coreProgress, reminderStatus };
});


/* ==== js/11-data-catalog.js ==== */
/* Catalogue de modèles d'aliments : valeurs MOYENNES INDICATIVES pour 100 g, à remplacer par l'étiquette. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'));
  else root.VaultCatalog = factory(root.VaultUtil);
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  const CATEGORIES = [
    { id: 'starch', label: 'Féculents secs' },
    { id: 'breakfast', label: 'Petit-déjeuner' },
    { id: 'snack', label: 'Biscuits et en-cas' },
    { id: 'nuts', label: 'Fruits secs et oléagineux' },
    { id: 'sweet', label: 'Produits sucrés' },
    { id: 'canned', label: 'Conserves' },
    { id: 'meal', label: 'Plats cuisinés' },
    { id: 'dairy', label: 'Laitiers et matières grasses' },
  ];

  // [nom, catégorie, poids d'une unité (g), kcal, protéines, glucides, lipides, fibres, sel, sans cuisson]
  const ROWS = [
    ['Pâtes sèches', 'starch', 500, 355, 12.5, 72, 1.5, 3, 0.02, false],
    ['Riz blanc sec', 'starch', 1000, 350, 7, 78, 0.6, 1, 0.01, false],
    ['Semoule ou couscous sec', 'starch', 500, 360, 12, 73, 1.5, 3.5, 0.02, false],
    ['Lentilles sèches', 'starch', 500, 330, 24, 50, 1.5, 11, 0.02, false],
    ['Pois chiches secs', 'starch', 500, 340, 20, 47, 5, 15, 0.03, false],
    ['Flocons d’avoine', 'breakfast', 500, 370, 13, 59, 7, 10, 0.02, true],
    ['Céréales du petit-déjeuner', 'breakfast', 375, 375, 7, 84, 1, 3, 1, true],
    ['Muesli', 'breakfast', 500, 370, 9, 62, 8, 8, 0.1, true],
    ['Biscuits secs', 'snack', 300, 440, 7, 74, 13, 2, 0.5, true],
    ['Biscottes', 'snack', 300, 400, 11, 72, 7, 4, 1, true],
    ['Crackers salés', 'snack', 200, 450, 10, 65, 16, 4, 1.5, true],
    ['Barres de céréales', 'snack', 150, 390, 6, 66, 11, 4, 0.3, true],
    ['Chocolat noir', 'snack', 100, 540, 6, 46, 35, 10, 0.02, true],
    ['Amandes', 'nuts', 200, 580, 21, 5, 52, 11, 0.01, true],
    ['Cacahuètes nature', 'nuts', 250, 590, 25, 9, 50, 8, 0.01, true],
    ['Raisins secs', 'nuts', 250, 300, 3, 70, 0.5, 4, 0.03, true],
    ['Beurre de cacahuète', 'nuts', 350, 600, 25, 11, 50, 6, 0.6, true],
    ['Miel', 'sweet', 250, 305, 0.4, 80, 0, 0, 0, true],
    ['Confiture', 'sweet', 370, 250, 0.4, 60, 0.1, 1, 0.01, true],
    ['Sucre', 'sweet', 1000, 400, 0, 100, 0, 0, 0, true],
    ['Thon au naturel (égoutté)', 'canned', 112, 110, 25, 0, 1, 0, 0.9, true],
    ['Thon à l’huile (égoutté)', 'canned', 112, 190, 25, 0, 10, 0, 0.9, true],
    ['Sardines à l’huile (égouttées)', 'canned', 90, 210, 24, 0, 12, 0, 1, true],
    ['Haricots rouges en conserve (égouttés)', 'canned', 265, 100, 7, 14, 0.5, 6, 0.5, true],
    ['Pois chiches en conserve (égouttés)', 'canned', 265, 120, 7.5, 15, 2.5, 5.5, 0.5, true],
    ['Lentilles en conserve (égouttées)', 'canned', 265, 105, 8, 15, 0.6, 5, 0.5, true],
    ['Maïs doux en conserve (égoutté)', 'canned', 285, 90, 3, 17, 1.2, 3, 0.4, true],
    ['Petits pois-carottes en conserve (égouttés)', 'canned', 265, 55, 4, 8, 0.5, 4, 0.5, true],
    ['Compote de pommes', 'canned', 400, 70, 0.3, 16, 0.1, 1.5, 0.01, true],
    ['Ravioli ou pâtes en conserve', 'meal', 800, 95, 4, 14, 2.5, 1.2, 0.8, true],
    ['Cassoulet ou plat cuisiné en conserve', 'meal', 840, 125, 7, 9, 7, 3, 0.9, true],
    ['Soupe en brique', 'meal', 1000, 35, 1, 6, 0.8, 1.2, 0.6, true],
    ['Lait UHT demi-écrémé', 'dairy', 1000, 46, 3.2, 4.8, 1.6, 0, 0.1, true],
    ['Lait en poudre entier', 'dairy', 400, 500, 26, 38, 27, 0, 0.7, true],
    ['Huile d’olive', 'dairy', 920, 900, 0, 0, 100, 0, 0, true],
  ];

  const FOODS = ROWS.map(([name, cat, mass, energy, protein, carbs, fat, fibre, salt, ready], i) => (
    { id: 'cat-' + i, name, cat, mass, energy, protein, carbs, fat, fibre, salt, ready }
  ));

  /**
   * Recherche insensible aux accents et à la casse ; `query` vide : tout le catalogue.
   * Chaque mot saisi doit commencer un mot du nom ou de la catégorie (« lent » trouve les lentilles, pas les féculents) ;
   * les aliments dont le nom correspond passent avant ceux qui ne correspondent que par leur catégorie.
   */
  function search(query) {
    const q = U.fold(query).trim();
    if (!q) return FOODS.slice();
    const words = q.split(/\s+/);
    const starts = (text, w) => U.fold(text).split(/[^a-z0-9]+/).some(t => t.startsWith(w));
    const found = [];
    FOODS.forEach(f => {
      const category = (CATEGORIES.find(c => c.id === f.cat) || {}).label || '';
      const byName = words.every(w => starts(f.name, w));
      if (byName || words.every(w => starts(f.name, w) || starts(category, w))) found.push({ rank: byName ? 0 : 1, food: f });
    });
    return found.sort((a, b) => a.rank - b.rank).map(x => x.food);
  }

  /** Valeurs par défaut d'un formulaire d'aliment à partir d'un modèle. */
  function toForm(food) {
    return {
      name: food.name, quantity: 1, mass: food.mass, energy: food.energy, protein: food.protein, carbs: food.carbs,
      fat: food.fat, fibre: food.fibre, salt: food.salt, ready: food.ready,
    };
  }

  return { CATEGORIES, FOODS, search, toForm };
});


/* ==== js/12-data-numbers.js ==== */
/* Numéros d'urgence (France) et trame « Que dire aux secours ». */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'));
  else root.VaultNumbers = factory(root.VaultUtil);
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  const MAIN = [
    { num: '112', title: 'Urgence européenne', desc: 'Tous les secours, gratuit, 24\u00a0h/24', tone: 'danger' },
    { num: '15', title: 'SAMU', desc: 'Urgence médicale : malaise, blessure grave' },
    { num: '17', title: 'Police / Gendarmerie', desc: 'Danger, violence, agression' },
    { num: '18', title: 'Pompiers', desc: 'Incendie, gaz, accident, inondation' },
  ];
  const SMS = { num: '114', title: 'Urgence par SMS', desc: 'Si tu ne peux pas parler ou entendre, ou s’il est dangereux de parler' };
  const OTHER = [
    { num: '115', title: 'Hébergement d’urgence', desc: 'Mise à l’abri d’une personne sans solution, gratuit, 24\u00a0h/24' },
    { num: '119', title: 'Enfance en danger', desc: 'Allô Enfance en danger, gratuit, 24\u00a0h/24' },
    { num: '3114', title: 'Prévention du suicide', desc: 'Numéro national, gratuit, 24\u00a0h/24' },
    { num: '196', title: 'Urgence en mer', desc: 'CROSS : sauvetage en mer, depuis le littoral' },
  ];

  const NATURES = [
    { id: 'health', label: 'Malaise ou blessure', text: 'Urgence médicale' },
    { id: 'fire', label: 'Incendie', text: 'Incendie' },
    { id: 'violence', label: 'Agression ou danger', text: 'Danger : agression ou violence' },
    { id: 'accident', label: 'Accident', text: 'Accident' },
    { id: 'other', label: 'Autre', text: 'Urgence' },
  ];

  // Ce qu'on dit aux secours, dans l'ordre (écran Urgences et dossier papier).
  const SAY_STEPS = [
    { title: 'Qui et où', text: 'ton nom, ton numéro et l’adresse exacte (étage, code).' },
    { title: 'Quoi', text: 'ce qui se passe, en une phrase.' },
    { title: 'Combien', text: 'le nombre de victimes et leur état.' },
    { title: 'Danger', text: 'feu, gaz, eau, électricité.' },
  ];
  const SAY_HINT = 'Reste en ligne et suis les instructions : les secours peuvent te guider pour les gestes.';

  /** Texte prêt à envoyer par SMS au 114 (ou à lire au 112). */
  function buildMessage(data) {
    const nature = (NATURES.find(n => n.id === data.nature) || NATURES[4]).text;
    const lines = ['URGENCE — ' + nature + '.'];
    if (data.address) lines.push('Adresse : ' + U.truncate(data.address, 200) + '.');
    if (data.position) lines.push('Position GPS : ' + data.position + '.');
    if (data.people) lines.push('Personnes concernées : ' + U.truncate(data.people, 40) + '.');
    if (data.details) lines.push(U.truncate(data.details, 300));
    if (data.name) lines.push('Nom : ' + U.truncate(data.name, 80) + '.');
    return lines.join(' ');
  }

  /** Lien SMS compatible Android et iPhone. */
  const smsLink = (number, body) => 'sms:' + number + '?&body=' + encodeURIComponent(body);

  return { MAIN, SMS, OTHER, NATURES, SAY_STEPS, SAY_HINT, buildMessage, smsLink };
});


/* ==== js/13-data-guides.js ==== */
/* Guides par situation : petits arbres de décision hors ligne, avec les sources officielles de chaque parcours.
 * Les consignes suivent les pages officielles citées (Sécurité civile, info.gouv.fr, ministère de l'Intérieur, Croix-Rouge, GRDF).
 * Une consigne locale ou celle des secours prime toujours. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'));
  else root.VaultGuides = factory(root.VaultUtil);
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  const civil = 'https://www.securite-civile.interieur.gouv.fr/reagir/';
  const kit = ['Sécurité civile — kit d’urgence 72 h', civil + 'comment-se-preparer-face-aux-risques/kit-durgence'];
  const croix = slug => 'https://www.croix-rouge.fr/les-gestes-de-premiers-secours/' + slug;
  const GQS = ['Ministère de l’Intérieur — gestes qui sauvent', 'https://www.interieur.gouv.fr/content/download/105174/832517/file/2022%20GQS.pdf'];
  const PSC = ['Ministère de l’Intérieur — référentiel PSC1', 'https://www.interieur.gouv.fr/content/download/111131/888067/file/2022%20PSC1.pdf'];
  const FORMATION = 'Ces gestes ne remplacent pas une formation : les gestes qui sauvent et le PSC1 (formation de 7 heures) s’apprennent près de chez toi.';

  const option = (label, next) => ({ label, next });
  const node = (title, actions = [], question = '', choices = [], shortcuts = []) => ({ title, actions, question, choices, shortcuts });
  const go = (label, view) => ({ label, view });
  const call = (label, phone) => ({ label, phone });
  const guide = (label, id) => ({ label, guide: id });

  const CATEGORIES = [
    { id: 'urgent', label: 'Danger immédiat', icon: 'triangle-alert' },
    { id: 'health', label: 'Premiers secours', icon: 'heart-pulse' },
    { id: 'natural', label: 'Risques naturels', icon: 'cloud-lightning' },
    { id: 'network', label: 'Réseaux et ressources', icon: 'plug' },
    { id: 'alerts', label: 'Alertes et départ', icon: 'bell' },
  ];

  // Gestes à garder à portée de main sur l'accueil.
  const QUICK = ['cardiac', 'bleeding', 'unconscious', 'choking', 'burn'];

  const GUIDES = [
    // ------------------------------------------------------------------ danger immédiat
    { id: 'fire', cat: 'urgent', icon: 'flame', title: 'Feu ou fumée', description: 'Départ de feu dans le logement ou fumée à l’extérieur.',
      keywords: 'incendie flammes fumée évacuation',
      sources: [['Sécurité civile — incendie domestique', civil + 'risques-de-vie-courante/incendie-domestique']], nodes: {
        start: node('Identifier où se trouve le feu', ['Alerte les occupants. En cas d’incendie, appelle le 18 ou le 112.'], 'Le feu se trouve-t-il dans ton logement ?', [option('Oui', 'exit'), option('Non, fumée dans le couloir / ailleurs', 'inside'), option('Je ne sais pas / sortie enfumée', 'inside')], [call('Appeler le 18', '18')]),
        exit: node('Vérifier une sortie sûre', ['Ne tente pas de traverser un passage envahi par la fumée.'], 'Peux-tu sortir sans traverser les flammes ou une zone enfumée ?', [option('Oui', 'outside'), option('Non', 'blocked')]),
        outside: node('Évacuer et rester dehors', ['Sors, ferme les portes derrière toi sans les verrouiller. Utilise les escaliers, jamais l’ascenseur.', 'Depuis un endroit sûr, appelle les secours et ne retourne pas dans le logement.'], '', [], [call('Appeler le 18', '18')]),
        inside: node('Rester protégé dans le logement', ['Si le couloir ou l’escalier est enfumé, ne l’emprunte pas. Ferme la porte et place du linge humide au bas de celle-ci.', 'Appelle les secours, indique ton étage et signale ta présence à une fenêtre sans t’exposer.'], '', [], [call('Appeler le 18', '18')]),
        blocked: node('Signaler que tu es bloqué', ['Isole-toi du feu derrière une porte fermée si possible et signale ta position aux secours.', 'Reste près du sol si la fumée entre. Ne saute pas par une fenêtre.'], '', [], [call('Appeler le 112', '112')]),
      } },
    { id: 'gas', cat: 'urgent', icon: 'flame-kindling', title: 'Odeur de gaz', description: 'Fuite de gaz : éviter toute étincelle, aérer, sortir et alerter.',
      keywords: 'fuite gaz explosion butane propane grdf',
      sources: [['GRDF — que faire en cas de fuite de gaz', 'https://www.grdf.fr/particuliers/urgence-depannage-fuite-gaz']], nodes: {
        start: node('Reconnaître une fuite', ['Une odeur d’œuf pourri, un sifflement près d’une installation ou un appareil qui s’éteint sans raison peuvent signaler une fuite de gaz.'], 'Sens-tu une odeur de gaz, entends-tu un sifflement, ou as-tu un doute ?', [option('Oui, ou j’ai un doute', 'act'), option('Non, je veux seulement me préparer', 'prevent')]),
        act: node('Aérer sans provoquer d’étincelle', ['Ne provoque ni flamme ni étincelle : n’allume pas la lumière, n’actionne aucun interrupteur ni sonnette, ne fume pas, n’utilise ni briquet ni appareil électrique.', 'Ouvre grand les fenêtres et les portes.', 'Ferme le robinet d’arrivée du gaz si tu peux l’atteindre sans risque.', 'Sors du bâtiment avec les autres personnes ; n’utilise pas l’ascenseur.'], '', [option('Alerter depuis l’extérieur', 'alert')]),
        alert: node('Alerter depuis l’extérieur', ['Une fois dehors et à distance du bâtiment, appelle le numéro d’urgence gaz (GRDF : 0 800 47 33 33, gratuit, 24\u00a0h/24 ; sinon le numéro de ton distributeur, indiqué sur ta facture), ou le 18 ou le 112.', 'N’utilise ni téléphone ni appareil électrique à l’intérieur.', 'Empêche toute personne d’entrer dans la zone jusqu’à l’arrivée des secours.', 'Ne rentre pas avant l’autorisation d’un professionnel.'], '', [], [call('Appeler GRDF — 0 800 47 33 33', '0800473333'), call('Appeler le 18', '18'), call('Appeler le 112', '112')]),
        prevent: node('Prévenir le risque', ['Fais vérifier tes installations de gaz et tes appareils par un professionnel qualifié ; ne bricole pas une installation.', 'Garde accessible le robinet d’arrivée du gaz et sache où il se trouve.', 'En cas de doute un jour, applique le parcours « Oui » : mieux vaut une intervention pour rien.'], '', [], [go('Noter l’emplacement des coupures', 'prepare/plan')]),
      } },
    { id: 'co', cat: 'urgent', icon: 'wind', title: 'Monoxyde de carbone', description: 'Maux de tête, nausées, malaise : gaz invisible et sans odeur.',
      keywords: 'co intoxication chauffage poêle groupe électrogène braséro barbecue',
      sources: [['Sécurité civile — monoxyde de carbone', civil + 'risques-de-vie-courante/intoxication-au-monoxyde-de-carbone']], nodes: {
        start: node('Reconnaître une intoxication', ['Le monoxyde de carbone (CO) est invisible, inodore et non irritant. Des maux de tête, nausées, vomissements, une fatigue de type grippal, de la somnolence ou de la confusion chez plusieurs personnes (ou chez les animaux) dans un même lieu doivent y faire penser.'], 'Une personne a-t-elle des maux de tête violents, de la confusion, ou a-t-elle perdu connaissance ?', [option('Oui', 'urgent'), option('Non, premiers symptômes seulement', 'act'), option('Aucun symptôme : je veux me prémunir', 'prevent')]),
        urgent: node('Sortir et appeler les secours', ['Ouvre les fenêtres et les portes en grand sans rester dans la pièce.', 'Sors avec tout le monde et les animaux à l’air libre, puis appelle le 18 ou le 112 (le 15 pour un malaise ; le 114 par SMS si tu ne peux pas parler).', 'Ne retourne pas dans le logement avant l’autorisation des secours.'], '', [], [call('Appeler le 18', '18'), call('Appeler le 112', '112'), call('Appeler le 15', '15'), guide('Personne inconsciente', 'unconscious')]),
        act: node('Aérer, arrêter, sortir', ['Ouvre les fenêtres.', 'Arrête les appareils à combustion si tu peux le faire rapidement.', 'Quitte le logement et appelle le 18 ou le 112. Si tu habites en immeuble, alerte aussi tes voisins.'], '', [option('Que faire ensuite ?', 'after')], [call('Appeler le 18', '18'), call('Appeler le 112', '112')]),
        after: node('Après l’alerte', ['Ne réutilise pas l’appareil avant qu’un professionnel qualifié l’ait vérifié.', 'Même sans symptôme grave, fais-toi examiner par un médecin si tu as été exposé.']),
        prevent: node('Prévenir le risque', ['Avant l’hiver, fais vérifier et entretenir chauffage, production d’eau chaude et conduits de fumée par un professionnel qualifié.', 'Aère ton logement au moins 10 minutes par jour, même quand il fait froid. N’obstrue jamais les entrées et sorties d’air.', 'Ne fais jamais fonctionner un chauffage d’appoint en continu et respecte les consignes du fabricant.', 'Place impérativement les groupes électrogènes à l’extérieur des bâtiments. Ne te chauffe et ne cuisine jamais en intérieur avec un appareil non prévu pour cela (cuisinière, brasero, barbecue…).']),
      } },
    { id: 'attack', cat: 'urgent', icon: 'shield', title: 'Attaque ou fusillade', description: 'S’échapper, se cacher, alerter : la consigne officielle.',
      keywords: 'terrorisme attentat agression armée danger',
      sources: [['info.gouv.fr — réagir en cas d’attaque terroriste', 'https://www.info.gouv.fr/risques/reagir-en-cas-dattaque-terroriste']], nodes: {
        start: node('S’échapper si c’est possible sans risque', ['Consigne officielle : s’échapper, se cacher, alerter.'], 'Es-tu certain de pouvoir t’échapper sans risque ?', [option('Oui', 'escape'), option('Non', 'hide')]),
        escape: node('S’échapper', ['Laisse toutes tes affaires sur place. Ne déclenche pas l’alarme incendie.', 'Ne t’expose pas (courbe-toi), prends la sortie la moins exposée et un itinéraire connu.', 'Aide les autres à s’échapper, alerte les personnes sur ton chemin, évite les mouvements de panique.', 'Facilite l’intervention des forces de sécurité et des secours : garde les mains visibles et obéis à leurs consignes.'], '', [option('Alerter les secours', 'alert')]),
        hide: node('Se cacher', ['Enferme-toi, barricade la porte et éloigne-toi des fenêtres.', 'Mets ton téléphone en silencieux (sans vibreur) et décroche les téléphones fixes.', 'Reste le plus silencieux et discret possible ; rassure les personnes autour de toi.'], '', [option('Alerter les secours', 'alert'), option('Fuir et se cacher sont impossibles, ma vie est en danger', 'resist')]),
        alert: node('Alerter', ['Une fois caché ou en sécurité, contacte les secours : 17, 18 ou 112 (le 114 par SMS si tu ne peux pas parler).', 'Donne des informations précises : où (lieu), quoi (nature de l’événement), qui (description des assaillants).', 'N’utilise ton téléphone qu’en cas de nécessité, pour ne pas saturer les réseaux.'], '', [], [call('Appeler le 17', '17'), call('Appeler le 112', '112'), go('Écrire au 114', 'emergency')]),
        resist: node('En dernier recours', ['Consigne officielle : si se cacher ou s’échapper est impossible et si ta vie est en danger, tente de neutraliser l’agresseur à plusieurs, distrais-le et protège-toi avec un bouclier de fortune.']),
      } },
    { id: 'toxic', cat: 'urgent', icon: 'biohazard', title: 'Produit toxique ou fumées', description: 'Exposition à un produit chimique ou contaminant.',
      keywords: 'chimique contamination gaz toxique nuage odeur',
      sources: [['info.gouv.fr — exposition à un produit toxique', 'https://www.info.gouv.fr/risques/reagir-en-cas-dattaque-terroriste']], nodes: {
        start: node('Se protéger et quitter la zone', ['Protège ton nez et ta bouche par tous les moyens : mouchoir, foulard ou tissu humide.', 'Quitte rapidement les lieux qui semblent dangereux (odeur anormale, personnes qui larmoient ou qui font des malaises).', 'Si plus de 2 personnes ont les mêmes symptômes au même endroit, donne l’alerte.', 'Même si tu te sens mal, ne t’allonge pas et ne t’assieds pas : tu pourrais ne plus te relever. Aide les personnes qui s’évanouissent ou suffoquent à sortir de la zone, sans revenir sur tes pas.'], '', [option('Je suis à distance de la zone', 'away')], [call('Appeler le 18', '18'), call('Appeler le 112', '112')]),
        away: node('Une fois à distance', ['Retire délicatement ta première couche de vêtements sans toucher l’extérieur, et isole-la dans un sac plastique (sinon pose-la au sol à distance). Si tu peux, déshabille-toi complètement et lave-toi les mains à l’eau et au savon.', 'Ne rentre pas chez toi. Ne va pas de toi-même à l’hôpital, chez ton médecin ou à la pharmacie : attends les secours et suis leurs consignes, tu risquerais de contaminer tes proches.', 'Ne serre pas de mains, ne bois pas, ne mange pas, ne fume pas, évite de te frotter le visage.', 'Des symptômes graves peuvent survenir plusieurs heures après : appelle alors le 15 et précise que tu étais dans la zone.'], '', [option('Alerter', 'alert')]),
        alert: node('Alerter les secours', ['Utilise ton téléphone uniquement pour alerter : pompiers 18 ou 112, Samu 15. Précise ton emplacement et décris la situation.', 'Reste à l’écoute des consignes des autorités.'], '', [], [call('Appeler le 18', '18'), call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
      } },

    // ------------------------------------------------------------------ premiers secours
    { id: 'cardiac', cat: 'health', icon: 'heart-pulse', title: 'Arrêt cardiaque', description: 'Ne répond pas et ne respire pas : massage cardiaque et défibrillateur.',
      keywords: 'massage cardiaque rcp défibrillateur dae inconscient ne respire pas réanimation',
      note: FORMATION, sources: [['Croix-Rouge — arrêt cardiaque', croix('arret-cardiaque')], ['Croix-Rouge — défibrillateur', croix('defibrillateur')], GQS], nodes: {
        start: node('Reconnaître l’arrêt cardiaque', ['Une personne qui ne répond pas, ne réagit pas et ne respire pas — ou respire de façon anormale (lente, bruyante, difficile) — est en arrêt cardiaque. Chaque minute compte : agis tout de suite.', 'Chez l’enfant et le nourrisson, les gestes diffèrent (5 insufflations au départ, puis 15 compressions pour 2 insufflations) : forme-toi.'], 'Es-tu seul avec la personne ?', [option('Non, quelqu’un est avec moi', 'helped'), option('Oui, je suis seul', 'alone')], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
        helped: node('Alerter et masser', ['Demande à quelqu’un d’appeler le 15, le 18 ou le 112 et d’apporter un défibrillateur (DAE) s’il y en a un à proximité.', 'Allonge la personne sur le dos, sur un plan dur, et dénude sa poitrine si possible.', 'Masse tout de suite : talon d’une main au centre de la poitrine (moitié inférieure du sternum), l’autre main par-dessus, bras tendus. Enfonce d’environ 5 cm (jamais plus de 6), 100 à 120 fois par minute, en laissant la poitrine se relever entre deux appuis.', 'Si tu es formé : 30 compressions puis 2 insufflations. Sinon, ou si tu ne te sens pas capable : compressions seules, en continu.', 'Relaie-toi toutes les 2 minutes si tu peux, en interrompant le moins possible.'], '', [option('Un défibrillateur est arrivé', 'dae')], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
        alone: node('Appeler en haut-parleur et masser', ['Mets le téléphone en haut-parleur et appelle le 15, le 18 ou le 112 : les secours te guident pas à pas.', 'Allonge la personne sur le dos et commence immédiatement le massage cardiaque : 5 cm de profondeur, 100 à 120 par minute, bras tendus, poitrine qui se relève.', 'Si un défibrillateur est tout proche (moins de 10 secondes), va le chercher ; sinon continue le massage.'], '', [option('Un défibrillateur est arrivé', 'dae')], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
        dae: node('Utiliser le défibrillateur', ['Mets-le en marche et suis ses instructions vocales : il est sûr, même sans formation.', 'Dénude et sèche la poitrine, colle les électrodes comme sur le schéma et branche-les si nécessaire.', 'Quand l’appareil le dit, ne touche plus la personne et écarte les témoins. Si un choc est indiqué, laisse l’appareil le délivrer ou appuie sur « choc » quand il le demande.', 'Reprends le massage immédiatement après le choc, ou si aucun choc n’est nécessaire.'], '', [option('Poursuivre jusqu’aux secours', 'continue')]),
        continue: node('Ne pas s’arrêter', ['Poursuis jusqu’à l’arrivée des secours, jusqu’à ce que la personne respire normalement, ou jusqu’à ce que le défibrillateur te demande de t’arrêter.', 'Ne retarde jamais un choc pour faire des compressions quand l’appareil est prêt.']),
      } },
    { id: 'bleeding', cat: 'health', icon: 'droplet', title: 'Saignement abondant', description: 'Comprimer la plaie, allonger, alerter ; garrot en dernier recours.',
      keywords: 'hémorragie plaie sang coupure garrot compression',
      note: FORMATION, sources: [['Croix-Rouge — hémorragie', croix('hemorragie')], GQS], nodes: {
        start: node('Comprimer tout de suite', ['Si tu peux, protège-toi : gants ou sac plastique autour de la main.', 'Appuie fortement sur l’endroit qui saigne avec ta main, en interposant un tissu propre (mouchoirs, torchon, vêtement) s’il y en a un. La victime peut appuyer elle-même si elle en est capable.', 'Garde la compression sans interruption jusqu’à l’arrivée des secours.', 'Allonge la victime confortablement (lit, canapé ou sol) pour retarder une détresse.', 'Fais alerter le 15, le 18 ou le 112 par un témoin pendant que tu comprimes. Si tu es seul, comprime d’abord, puis alerte avec le téléphone en haut-parleur sans relâcher la pression.'], 'Le saignement s’arrête-t-il avec la compression ?', [option('Oui', 'controlled'), option('Non, ou la compression est impossible (membre)', 'severe')], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
        controlled: node('Maintenir et surveiller', ['Un pansement compressif ne remplace la compression manuelle que si elle a arrêté le saignement. S’il saigne encore, reprends la compression directe par-dessus.', 'Rassure la victime, protège-la du froid ou de la chaleur et surveille-la : sueurs abondantes, froid, pâleur intense ou perte de connaissance signalent une aggravation — rappelle les secours.', 'Saignement de nez : assieds la personne, tête penchée en avant (ne l’allonge jamais), fais-la se moucher puis comprimer les deux narines pendant 10 minutes sans relâcher.']),
        severe: node('Garrot (membre uniquement)', ['Si la compression d’un membre est inefficace ou impossible, pose un garrot entre la plaie et le cœur, idéalement 5 à 7 cm au-dessus de la plaie, jamais sur une articulation.', 'Un garrot du commerce se pose selon sa notice. À défaut : un lien de toile solide, non élastique, de 3 à 5 cm de large (deux tours et un nœud), une barre de 10 à 20 cm placée sur le nœud puis maintenue par deux nœuds ; tourne la barre jusqu’à l’arrêt du saignement et maintiens le serrage.', 'Une fois posé, ne le retire jamais sans avis médical. Note l’heure de la pose.', 'Rappelle les secours si l’état s’aggrave.'], '', [], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
      } },
    { id: 'unconscious', cat: 'health', icon: 'user', title: 'Personne inconsciente', description: 'Ne répond pas : libérer les voies aériennes et vérifier la respiration.',
      keywords: 'pls position latérale de sécurité malaise évanouissement ne répond pas',
      note: FORMATION, sources: [['Croix-Rouge — inconscience', croix('inconscience')], GQS], nodes: {
        start: node('Vérifier la réponse', ['Pose des questions simples (« Comment ça va ? », « Vous m’entendez ? »), secoue doucement les épaules ou demande-lui de serrer ta main.', 'Si tu es seul, appelle à l’aide.'], 'La personne répond-elle ou réagit-elle ?', [option('Oui', 'talks'), option('Non', 'airway')]),
        talks: node('Adapter à un malaise', ['Installe la personne dans la position où elle se sent le mieux, rassure-la et desserre ses vêtements.', 'Appelle le 15 en cas de doute ou de signe inquiétant, et suis les consignes.', 'Surveille-la jusqu’à l’arrivée des secours.'], '', [], [call('Appeler le 15', '15')]),
        airway: node('Libérer les voies aériennes et vérifier la respiration', ['Allonge la personne sur le dos.', 'Pose une main sur son front et deux doigts sous la pointe de son menton : bascule doucement la tête en arrière en relevant le menton.', 'Penche-toi, oreille et joue au-dessus de sa bouche et de son nez : regarde si le ventre et la poitrine se soulèvent, écoute, sens le souffle. Dix secondes au plus.'], 'Respire-t-elle normalement ?', [option('Oui', 'pls'), option('Non, ou respiration anormale', 'stop')]),
        pls: node('Position latérale de sécurité (PLS)', ['Retire ses lunettes et rapproche ses jambes de l’axe du corps. Place le bras proche de toi à angle droit, coude plié, paume vers le haut.', 'Prends le bras opposé et amène le dos de sa main contre son oreille, côté toi, en la maintenant. Attrape la jambe opposée juste derrière le genou et relève-la, pied au sol.', 'Tire sur la jambe pour faire pivoter la personne vers toi, en un seul temps, jusqu’à ce que le genou touche le sol. Dégage ta main de sous sa tête en gardant la tête basculée en arrière.', 'Ajuste la jambe du dessus (hanche et genou à angle droit) et ouvre sa bouche sans bouger la tête.', 'Fais alerter ou alerte le 15, le 18 ou le 112, couvre la personne et surveille sa respiration jusqu’à l’arrivée des secours. Si elle s’arrête ou devient anormale, passe à l’arrêt cardiaque.', 'Après un traumatisme (chute, accident) ou si tu ne connais pas la cause : laisse la personne sur le dos et suis les consignes des secours.'], '', [], [call('Appeler le 15', '15'), call('Appeler le 112', '112'), guide('Arrêt cardiaque', 'cardiac')]),
        stop: node('Arrêt cardiaque', ['Une personne qui ne répond pas et ne respire pas, ou respire de façon anormale, est en arrêt cardiaque : appelle le 15, le 18 ou le 112 (haut-parleur) et commence tout de suite le massage cardiaque.'], '', [], [call('Appeler le 15', '15'), guide('Arrêt cardiaque : massage et défibrillateur', 'cardiac')]),
      } },
    { id: 'choking', cat: 'health', icon: 'hand', title: 'Étouffement', description: 'Obstruction des voies aériennes : claques dans le dos et compressions.',
      keywords: 'heimlich avalé fausse route obstruction bloqué gorge',
      note: FORMATION, sources: [['Croix-Rouge — étouffement', croix('etouffement')], PSC], nodes: {
        start: node('Reconnaître l’étouffement', ['Demande : « Est-ce que vous vous étouffez ? »'], 'La personne peut-elle parler, crier, tousser ou respirer ?', [option('Oui, elle tousse ou respire', 'partial'), option('Non : plus de voix, plus de toux, bouche ouverte, elle devient bleue', 'complete')]),
        partial: node('Obstruction partielle', ['Installe la personne dans la position où elle se sent le mieux et encourage-la à tousser.', 'Demande un avis médical (15) et surveille-la attentivement.', 'Si la toux devient inefficace ou si elle se fatigue, applique la conduite pour une obstruction complète.'], '', [option('La toux devient inefficace', 'complete')], [call('Appeler le 15', '15')]),
        complete: node('Obstruction complète', ['Adulte ou grand enfant : penche-le vers l’avant, soutiens sa poitrine d’une main et donne de 1 à 5 claques vigoureuses dans le dos, entre les omoplates, avec le talon de la main ouverte.', 'Sans effet : de 1 à 5 compressions abdominales. Place-toi derrière, passe tes bras sous les siens, poing fermé juste au-dessus du nombril (dos de la main vers le ciel), l’autre main par-dessus, et tire franchement vers l’arrière et vers le haut, sans appuyer sur les côtes.', 'Femme enceinte, personne obèse (abdomen impossible à encercler) ou nourrisson : compressions sur la poitrine, au milieu du sternum.', 'Répète le cycle claques dans le dos puis compressions jusqu’à ce que la personne tousse, respire ou rejette l’objet.'], 'La personne a-t-elle perdu connaissance ?', [option('Non, elle a rejeté l’objet ou respire', 'ok'), option('Oui, elle a perdu connaissance', 'faint')], [call('Appeler le 15', '15'), call('Appeler le 112', '112')]),
        ok: node('Après la désobstruction', ['Installe la personne dans la position où elle se sent le mieux, réconforte-la et desserre ses vêtements.', 'Fais alerter ou alerte le 15 ou le 112 et applique les consignes. Surveille-la : des complications peuvent apparaître plus tard.'], '', [], [call('Appeler le 15', '15')]),
        faint: node('Perte de connaissance', ['Accompagne la personne au sol, appelle ou fais appeler le 15, le 18 ou le 112, puis commence la réanimation.', 'Regarde dans la bouche après chaque série de compressions et retire l’objet prudemment s’il est accessible.'], '', [], [call('Appeler le 15', '15'), guide('Arrêt cardiaque', 'cardiac')]),
      } },
    { id: 'burn', cat: 'health', icon: 'flame', title: 'Brûlure', description: 'Refroidir longtemps à l’eau tempérée, puis évaluer la gravité.',
      keywords: 'brûlure ébouillanté chaleur chimique électrique cloque',
      note: FORMATION, sources: [['Croix-Rouge — brûlure', croix('que-faire-en-cas-de-brulure')], PSC], nodes: {
        start: node('Refroidir tout de suite', ['Refroidis immédiatement la brûlure à l’eau courante tempérée, à faible pression, pendant au moins 10 minutes, idéalement 20. Commencer après 30 minutes n’a plus d’intérêt.', 'En même temps, retire vêtements et bijoux sur ou près de la brûlure, sauf s’ils collent à la peau.', 'Une brûlure est grave si : cloques dont la surface dépasse la moitié de la paume de la victime ; peau blanchâtre ou noirâtre ; visage, cou, mains, articulations ou près d’un orifice naturel ; rougeur étendue chez l’enfant ; origine chimique, électrique ou radiologique.'], 'Quelle est la brûlure ?', [option('Brûlure grave', 'severe'), option('Brûlure simple', 'simple'), option('Produit chimique ou électricité', 'special')]),
        severe: node('Brûlure grave', ['Alerte ou fais alerter le 15 ou le 18 dès le début de l’arrosage et suis les consignes.', 'Poursuis le refroidissement selon les consignes des secours.', 'Après refroidissement, installe la personne allongée confortablement (assise en cas de gêne respiratoire), laisse la zone brûlée visible et surveille-la.', 'N’applique aucun produit sur une brûlure grave sans avis médical.'], '', [], [call('Appeler le 15', '15'), call('Appeler le 18', '18')]),
        simple: node('Brûlure simple', ['Poursuis le refroidissement jusqu’à la disparition de la douleur. Ne perce jamais les cloques.', 'Protège la brûlure avec un pansement stérile ou un film alimentaire non adhésif, posé sans serrer.', 'Demande un avis médical : pour vérifier ton vaccin antitétanique, s’il s’agit d’un enfant ou d’un nourrisson, ou si de la fièvre ou une zone chaude, rouge, gonflée ou douloureuse apparaît dans les jours suivants.']),
        special: node('Chimique ou électrique', ['Produit chimique : protège-toi du produit et rince abondamment à l’eau courante tempérée (tout le corps en cas de projection, vêtements imbibés ôtés sous l’eau ; pour un œil, rince l’œil atteint sans que l’eau coule dans l’autre, lentilles retirées). Ne fais jamais vomir ni boire en cas d’ingestion, garde l’emballage du produit et alerte les secours.', 'Électricité : ne touche jamais la victime avant d’avoir supprimé le risque électrique (coupe le courant au disjoncteur). Arrose la zone visiblement brûlée à l’eau tempérée et alerte les secours.'], '', [], [call('Appeler le 15', '15'), call('Appeler le 18', '18'), call('Appeler le 112', '112')]),
      } },

    // ------------------------------------------------------------------ risques naturels
    { id: 'flood', cat: 'natural', icon: 'waves', title: 'L’eau monte', description: 'Inondation : se mettre à l’abri ou suivre une évacuation.',
      keywords: 'inondation crue débordement submersion eau',
      sources: [['Géorisques — inondation', 'https://www.georisques.gouv.fr/me-preparer-me-proteger/que-faire-en-cas-d-inondation'], ['Sécurité civile — inondation', civil + 'risques-majeurs/inondations']], nodes: {
        start: node('Éviter les zones inondées', ['Ne descends pas en sous-sol ou dans un parking pour récupérer des affaires.', 'Ne traverse pas une voie inondée, à pied ou en voiture.'], 'Les autorités ordonnent-elles d’évacuer ?', [option('Oui', 'leave'), option('Non / pas de consigne reçue', 'shelter')]),
        leave: node('Vérifier le trajet', ['Suis le lieu et l’itinéraire indiqués par les autorités.'], 'Le trajet indiqué est-il accessible sans traverser l’eau ?', [option('Oui', 'route'), option('Non / je suis bloqué', 'trapped')]),
        route: node('Partir par l’itinéraire sûr', ['Prends le kit seulement s’il est immédiatement accessible.', 'Suis les secours. Ne t’engage pas sur une route devenue inondée.'], '', [], [go('Vérifier mon kit', 'prepare/kit')]),
        shelter: node('Se mettre en hauteur', ['Rejoins un étage ou un lieu haut accessible en sécurité avec ton kit.', 'Coupe gaz et électricité uniquement si tu peux le faire depuis un endroit sec sans t’exposer.', 'Écoute les consignes officielles et garde les communications disponibles pour les urgences.'], 'L’eau t’empêche-t-elle de rejoindre un abri sûr ?', [option('Oui', 'trapped'), option('Non, je suis à l’abri', 'wait')]),
        trapped: node('Demander du secours', ['Appelle le 112 et indique ta position, le nombre de personnes et le danger. Reste en hauteur ; n’entre pas dans l’eau.'], '', [], [call('Appeler le 112', '112')]),
        wait: node('Rester à l’écoute', ['Reste à l’abri. Suis toute nouvelle consigne d’évacuation et ne retourne pas dans les zones inondées.']),
      } },
    { id: 'quake', cat: 'natural', icon: 'activity', title: 'Secousses', description: 'Pendant le séisme, puis après les premières secousses.',
      keywords: 'séisme tremblement de terre répliques',
      sources: [['Sécurité civile — séisme', civil + 'risques-majeurs/seisme']], nodes: {
        start: node('Situer le moment', [], 'Les secousses sont-elles encore en cours ?', [option('Oui', 'during'), option('Non', 'after')]),
        during: node('Se protéger pendant les secousses', ['À l’intérieur, abrite-toi sous un meuble solide, couvre tête et torse et éloigne-toi des fenêtres.', 'À l’extérieur, reste dans un espace dégagé, loin de ce qui peut tomber. En voiture, arrête-toi sur le côté et reste dans le véhicule.'], 'Les secousses ont-elles cessé ?', [option('Oui, passer à la suite', 'after'), option('Non, rester protégé', 'hold')]),
        hold: node('Maintenir la protection', ['Reste protégé et garde tes distances avec ce qui peut tomber.'], 'Quand les secousses ont cessé :', [option('Examiner la suite', 'after')]),
        after: node('Repérer les dégâts sans s’exposer', ['Des répliques sont possibles. Écoute les autorités.'], 'Le bâtiment est-il endommagé ou présente-t-il un danger ?', [option('Oui / doute', 'leave'), option('Non', 'monitor')]),
        leave: node('Sortir du bâtiment endommagé', ['Lorsque tu peux le faire en sécurité, sors par les escaliers ; n’utilise pas l’ascenseur.', 'Rejoins un espace dégagé et suis les instructions des secours. En cas de personne bloquée ou blessée, appelle le 112.'], '', [], [call('Appeler le 112', '112')]),
        monitor: node('Rester vigilant', ['Surveille les consignes et les répliques. Ne retourne pas dans un bâtiment déclaré dangereux.']),
      } },
    { id: 'storm', cat: 'natural', icon: 'cloud-lightning', title: 'Tempête ou orage', description: 'Vent violent, orage, cyclone : se préparer et s’abriter.',
      keywords: 'tempête vent orage foudre cyclone vigilance météo',
      sources: [['Sécurité civile — tempête et cyclone', civil + 'risques-majeurs/tempete-et-cyclone'], ['Météo-France — vigilance', 'https://vigilance.meteofrance.fr/']], nodes: {
        start: node('Où en est l’événement ?', ['Consulte la vigilance Météo-France et suis les consignes des autorités.'], 'Le phénomène a-t-il commencé ?', [option('Pas encore : vigilance annoncée', 'before'), option('Oui, il est en cours', 'during'), option('Il est passé', 'after')]),
        before: node('Se préparer', ['Prépare ton kit d’urgence 72 h et rentre tes animaux.', 'Ferme portails, portes, fenêtres et volets ; remonte les stores. N’allume pas de feu de cheminée ; éteins celui qui brûle.', 'Mets à l’abri tout objet qui peut chuter ou devenir un projectile et rentre le mobilier extérieur (jardin, barbecue, poubelles).', 'Gare ta voiture dans un garage, sinon loin des arbres. Débranche les appareils électriques non indispensables.', 'Éloigne-toi des fenêtres et des vérandas. Reste dans une pièce sûre, au centre de la maison, et évite de dormir sous les combles.'], '', [], [go('Vérifier mon kit', 'prepare/kit')]),
        during: node('S’abriter', ['Abrite-toi dans un bâtiment, en dur de préférence, et reste à l’écoute des consignes des autorités.', 'Évite de rester sous un arbre.', 'Pour un cyclone : ne sors pas pendant l’œil du cyclone.']),
        after: node('Après le passage', ['Reste à l’écoute des consignes et éloigne-toi des zones dangereuses.', 'Ne touche pas aux lignes électriques endommagées ou tombées à terre et signale-les immédiatement.', 'Examine murs, sols, portes, escaliers et fenêtres pour repérer un risque d’écroulement. Porte des vêtements fermés, des gants et des chaussures fermées.', 'Signale les blessés aux secours ; ne déplace pas une personne gravement blessée sauf risque immédiat. Évite les déplacements en véhicule.'], '', [], [call('Appeler le 112', '112')]),
      } },
    { id: 'wildfire', cat: 'natural', icon: 'flame-kindling', title: 'Feu de forêt', description: 'Donner l’alerte, s’éloigner ou se confiner dans un bâtiment en dur.',
      keywords: 'incendie forêt végétation massif flammes',
      sources: [['Sécurité civile — feu de forêt', civil + 'risques-majeurs/feu-de-foret']], nodes: {
        start: node('Donner l’alerte et s’éloigner', ['Témoin d’un début d’incendie : donne l’alerte au 112, au 18 (ou au 114 par SMS) et essaie de localiser le feu.', 'Quitte immédiatement le massif forestier ou abrite-toi dans un bâtiment en dur. Reste informé et conforme-toi aux consignes des secours ou de la mairie.'], 'Quelle est ta situation ?', [option('Les autorités ordonnent d’évacuer', 'leave'), option('Je suis dans un bâtiment', 'shelter'), option('Je suis en voiture, surpris par le feu', 'car')], [call('Appeler le 18', '18'), call('Appeler le 112', '112')]),
        leave: node('Évacuer', ['Suis le lieu et l’itinéraire indiqués. Emporte ton kit s’il est accessible.'], '', [option('Après le passage du feu', 'after')]),
        shelter: node('Rester dans le bâtiment', ['Tu es davantage en sécurité dans un immeuble : n’évacue que sur ordre des autorités.', 'Bouche les aérations et les bas de porte pour empêcher fumées et flammèches de pénétrer.', 'Couvre ton nez et ta bouche d’un linge humide pour te protéger de la fumée.', 'Rentre ton tuyau d’arrosage : il servira après le passage du feu pour éteindre les dernières braises.'], '', [option('Après le passage du feu', 'after')]),
        car: node('En voiture', ['Évite de quitter ta voiture. Si tu es surpris par un front de flammes, arrête-toi dans une zone dégagée.'], '', [], [call('Appeler le 112', '112')]),
        after: node('Après le passage du feu', ['Reste à l’écoute des consignes. Si on t’a demandé d’évacuer, ne regagne pas ton domicile avant d’en avoir reçu l’autorisation.', 'Jette toute nourriture qui pourrait avoir été exposée à la chaleur, à la fumée ou à la suie. L’eau peut aussi être contaminée : dans ce cas, ne l’utilise pas.']),
      } },
    { id: 'heat', cat: 'natural', icon: 'thermometer', title: 'Forte chaleur', description: 'Repérer un malaise, se rafraîchir et aider ses proches.',
      keywords: 'canicule coup de chaleur déshydratation',
      sources: [['Santé publique France — canicule', 'https://www.santepubliquefrance.fr/linfo-accessible-a-tous/canicule'], ['Santé publique France — bons réflexes', 'https://www.santepubliquefrance.fr/index.php/les-actualites/les-fortes-chaleurs-nous-concernent-tous-adoptons-les-bons-reflexes']], nodes: {
        start: node('Vérifier l’état des personnes', [], 'Une personne présente-t-elle un malaise ou une confusion ?', [option('Oui', 'urgent'), option('Non', 'cool')]),
        urgent: node('Appeler et rafraîchir', ['Appelle le 15. Installe la personne dans un endroit frais et suis les instructions du régulateur.', 'Rafraîchis le corps avec de l’eau et une ventilation. Ne laisse pas la personne seule.'], '', [], [call('Appeler le 15', '15')]),
        cool: node('Réduire l’exposition', ['Bois régulièrement de l’eau. Humidifie ton corps et évite les efforts aux heures chaudes.', 'Ferme volets et fenêtres pendant la chaleur ; aère lorsque l’air extérieur devient plus frais.'], 'Le logement reste-t-il trop chaud ?', [option('Oui', 'refuge'), option('Non', 'check')]),
        refuge: node('Chercher un lieu frais', ['Passe du temps dans un lieu rafraîchi accessible en sécurité. Renseigne-toi auprès de la mairie sur les lieux ouverts.'], '', [], [go('Vérifier mon eau', 'prepare/stock')]),
        check: node('Prendre des nouvelles', ['Contacte les proches vulnérables et propose de l’aide. Réévalue la situation si des symptômes apparaissent.']),
      } },
    { id: 'cold', cat: 'natural', icon: 'snowflake', title: 'Grand froid', description: 'Trouver un abri et repérer les signes préoccupants.',
      keywords: 'froid hypothermie neige gel chauffage',
      sources: [['Ministère de la Santé — grand froid', 'https://sante.gouv.fr/sante-et-environnement/risques-climatiques/article/grand-froid-information-du-public'], ['Service public — solutions d’hébergement (115)', 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2003']], nodes: {
        start: node('Vérifier l’état des personnes', [], 'Confusion, parole anormale ou grande fatigue inhabituelle après exposition au froid ?', [option('Oui / doute', 'urgent'), option('Non', 'shelter')]),
        urgent: node('Appeler les secours', ['Appelle le 15 ou le 112. Mets la personne à l’abri et couvre-la ; suis les instructions reçues.'], '', [], [call('Appeler le 15', '15')]),
        shelter: node('Se protéger du froid', ['Cherche un abri chauffé, reste au sec et porte plusieurs couches couvrant aussi les extrémités.'], 'Peux-tu accéder à un logement ou un abri chauffé ?', [option('Oui', 'warm'), option('Non', 'help')]),
        warm: node('Maintenir une chaleur sûre', ['Utilise le chauffage conformément à sa notice et conserve une ventilation adaptée. Ne bouche pas les aérations.', 'Ne chauffe pas le logement avec un réchaud ou un barbecue. Un groupe électrogène doit rester dehors, jamais dans une cave ou un garage.', 'Prends des nouvelles des personnes isolées et limite l’exposition au froid.'], '', [], [guide('Monoxyde de carbone', 'co')]),
        help: node('Demander une mise à l’abri', ['Appelle le 115 pour demander une mise à l’abri. Si la santé est menacée, appelle le 15 ou le 112.'], '', [], [call('Appeler le 115', '115'), call('Appeler le 112', '112')]),
      } },

    // ------------------------------------------------------------------ réseaux et ressources
    { id: 'power', cat: 'network', icon: 'zap', title: 'Plus d’électricité', description: 'Danger électrique, panne durable et réserves.',
      keywords: 'panne courant coupure électricité blackout groupe électrogène',
      sources: [['Enedis — dépannage et urgences', 'https://www.enedis.fr/aide-contact/depannage-et-urgences']], nodes: {
        start: node('Vérifier les dangers visibles', ['Garde tes distances avec les câbles tombés, les coffrets abîmés et les objets en contact avec eux.'], 'Vois-tu des étincelles, un câble tombé ou sens-tu une odeur de brûlé ?', [option('Oui / un danger est visible', 'danger'), option('Non, seulement une coupure', 'supply')]),
        danger: node('S’éloigner et signaler', ['Ne touche pas l’installation. Éloigne les personnes.', 'Contacte le dépannage Enedis : 09 72 67 50 suivi du numéro de ton département. En cas de feu ou de danger immédiat, appelle les secours.'], '', [], [call('Appeler le 112', '112')]),
        supply: node('Protéger les usages essentiels', ['Utilise une lampe à piles. Laisse le réfrigérateur et le congélateur fermés.', 'Économise la batterie du téléphone et consulte les informations du gestionnaire de réseau.', 'Un groupe électrogène se place toujours à l’extérieur, jamais dans le logement, la cave ou le garage (monoxyde de carbone).'], 'Un appareil médical indispensable dépend-il de l’électricité ?', [option('Oui', 'medical'), option('Non', 'reserve')]),
        medical: node('Suivre le plan de secours prévu', ['Applique les consignes de ton équipe de soins et contacte-la. Si l’interruption menace la personne, appelle le 15.'], '', [], [call('Appeler le 15', '15')]),
        reserve: node('Évaluer la durée disponible', ['Vérifie l’autonomie de tes batteries et tes aliments accessibles sans cuisson.', 'Réévalue les réserves et les nouvelles consignes si la panne se prolonge.'], '', [], [go('Voir mon stock', 'prepare/stock')]),
      } },
    { id: 'water', cat: 'network', icon: 'droplets', title: 'Eau indisponible', description: 'Coupure, restriction de consommation ou réserve faible.',
      keywords: 'eau potable robinet coupure restriction pénurie',
      sources: [['Ministère de la Santé — eau du robinet', 'https://sante.gouv.fr/sante-et-environnement/eaux/article/eau-du-robinet'], kit], nodes: {
        start: node('Clarifier le problème', ['Consulte les informations de la mairie, du distributeur ou de l’ARS.'], 'Une restriction de consommation est-elle annoncée ?', [option('Oui / potabilité incertaine', 'restriction'), option('Non, le réseau est coupé', 'stock')]),
        restriction: node('Choisir une eau sûre', ['Suis les restrictions locales. Utilise une réserve d’eau potable sûre, par exemple des bouteilles scellées.', 'Ne suppose pas qu’une filtration ou une ébullition élimine tous les contaminants. Attends les instructions adaptées au problème.'], 'As-tu assez d’eau potable pour ton foyer ?', [option('Oui', 'enough'), option('Non / je ne sais pas', 'supply')]),
        stock: node('Faire le point sur l’eau potable', ['Sépare les réserves d’eau potable de celles réservées au nettoyage.', 'Compare les litres disponibles au nombre de personnes et à la durée visée.'], 'La réserve potable est-elle suffisante ?', [option('Oui', 'enough'), option('Non / je ne sais pas', 'supply')], [go('Calculer mes réserves', 'prepare/stock')]),
        enough: node('Préserver la réserve', ['Garde l’eau potable pour boire et préparer les aliments. Suis les informations sur le rétablissement du service.', 'Ne consomme pas une eau soumise à restriction avant la levée officielle de celle-ci.'], '', [], [go('Actualiser mon stock', 'prepare/stock')]),
        supply: node('Organiser le réapprovisionnement', ['Cherche les points de distribution annoncés par la mairie ou le distributeur.', 'Préviens-les si une personne vulnérable ne peut pas accéder à l’eau.'], '', [], [go('Voir mon stock', 'prepare/stock')]),
      } },
    { id: 'communication', cat: 'network', icon: 'wifi-off', title: 'Réseau indisponible', description: 'Alerter, économiser la batterie et garder des contacts.',
      keywords: 'téléphone réseau internet panne communication radio morse',
      sources: [kit, ['Service public — numéros d’urgence', 'https://www.service-public.gouv.fr/particuliers/vosdroits/F33954']], nodes: {
        start: node('Distinguer urgence et information', [], 'Une personne est-elle en danger immédiat ?', [option('Oui', 'urgent'), option('Non', 'contact')]),
        urgent: node('Chercher à alerter', ['Essaie le 112. Si l’appel échoue, demande à une personne disposant d’un moyen de communication d’alerter les secours, sans t’exposer.'], '', [], [call('Appeler le 112', '112'), go('Mes numéros d’urgence', 'emergency')]),
        contact: node('Conserver les moyens disponibles', ['Économise la batterie et utilise la radio autonome pour les annonces.', 'Si le réseau le permet, transmets un message court à ton contact convenu. Garde les coordonnées importantes sur papier.'], 'As-tu convenu d’un contact ou d’un point de rendez-vous ?', [option('Oui', 'plan'), option('Non', 'prepare')]),
        plan: node('Suivre le plan convenu', ['Utilise le contact et le lieu prévus seulement si les conditions et les consignes locales le permettent.'], '', [], [go('Signal Morse', 'tools/signal'), go('Mon plan', 'prepare/plan')]),
        prepare: node('Préparer les contacts', ['Ajoute les contacts hors ligne et la radio à ton kit. Le Morse peut échanger un message entre personnes équipées ; il ne garantit pas qu’un appel de secours sera reçu.'], '', [], [go('Ma checklist', 'prepare/kit'), go('Mon plan', 'prepare/plan'), go('Signal Morse', 'tools/signal')]),
      } },

    // ------------------------------------------------------------------ alertes et départ
    { id: 'alert', cat: 'alerts', icon: 'bell', title: 'Sirène ou FR-Alert', description: 'Signal national d’alerte ou message sur le téléphone.',
      keywords: 'alerte sirène saip fr-alert danger confinement',
      sources: [['Sécurité civile — système d’alerte des populations', civil + 'comment-se-preparer-face-aux-risques/systeme-dalerte-des'], ['FR-Alert', 'https://fr-alert.gouv.fr']], nodes: {
        start: node('Se mettre en sécurité sans délai', ['Le signal national d’alerte est un son modulé, montant et descendant, de trois séquences de 1 minute 41 secondes séparées par 5 secondes de silence. La fin d’alerte est un son continu de 30 secondes. Les sirènes sont testées le premier mercredi de chaque mois (1 minute 41 secondes) : ce n’est pas une alerte.', 'FR-Alert arrive sur ton téléphone : notification avec un signal sonore distinctif, même en mode silencieux (4G/5G), ou SMS géolocalisé. Lis le message en entier.', 'Mets-toi en sécurité sans délai et informe-toi sur les chaînes de Radio France ou de France Télévisions.', 'Ne va pas chercher tes enfants à l’école : ils y sont protégés par leurs enseignants.', 'Ne téléphone qu’en cas d’urgence vitale, pour laisser les réseaux libres aux secours.'], 'Que demande le message ou la radio ?', [option('Rester à l’abri', 'stay'), option('Évacuer', 'leave')]),
        stay: node('Se confiner', ['Reste à l’abri, portes et fenêtres closes (sauf consigne contraire), jusqu’à l’annonce officielle de fin d’alerte ou de nouvelles consignes.', 'Garde ta radio ou ton téléphone allumés pour suivre les consignes.'], '', [], [go('Mon kit', 'prepare/kit')]),
        leave: node('Évacuer', ['Suis exactement le lieu et l’itinéraire annoncés. Emporte ton kit s’il est accessible.'], '', [], [guide('Préparer un départ', 'evacuation'), go('Mon kit', 'prepare/kit')]),
      } },
    { id: 'industry', cat: 'alerts', icon: 'biohazard', title: 'Alerte industrielle', description: 'Se confiner et suivre les instructions locales.',
      keywords: 'accident industriel usine chimique nuage confinement',
      sources: [['Sécurité civile — accident industriel', civil + 'risques-majeurs/accident-industriel']], nodes: {
        start: node('Recevoir la consigne', ['Consulte le message FR-Alert, la radio ou les informations de la préfecture.'], 'Un ordre officiel d’évacuation est-il donné ?', [option('Oui', 'evacuate'), option('Non / consigne de confinement', 'shelter')]),
        shelter: node('Se confiner', ['Rejoins un bâtiment clos proche. Ferme portes, fenêtres et aérations ; arrête la ventilation.', 'Évite flammes, cigarettes et étincelles. Reste à l’intérieur.', 'Ne va pas chercher tes enfants à l’école et ne téléphone qu’en cas d’urgence vitale.'], 'Une nouvelle consigne demande-t-elle de partir ?', [option('Oui', 'evacuate'), option('Non', 'wait')]),
        evacuate: node('Suivre l’évacuation officielle', ['Suis exactement la destination et l’itinéraire annoncés. Ne choisis pas de passer près du site accidenté.'], '', [], [go('Mon kit de départ', 'prepare/kit')]),
        wait: node('Attendre la fin officielle de l’alerte', ['Reste confiné et continue à écouter les autorités. Ne sors pas sur la seule impression que le danger est passé.']),
      } },
    { id: 'nuclear', cat: 'alerts', icon: 'radiation', title: 'Accident nucléaire', description: 'S’abriter, suivre les consignes, iode seulement sur ordre.',
      keywords: 'radioactivité iode centrale radiation',
      sources: [['Sécurité civile — accident nucléaire', civil + 'risques-majeurs/accident-nucleaire']], nodes: {
        start: node('Se mettre à l’abri', ['Les consignes des autorités priment sur tout autre conseil.'], 'Habites-tu à proximité d’une installation nucléaire ?', [option('Oui', 'near'), option('Non / je ne sais pas', 'far')]),
        near: node('Si tu habites à proximité', ['Abrite-toi dans un bâtiment clos. Ferme fenêtres, portes et aérations ; arrête la ventilation.', 'Ne consomme pas les produits du jardin.', 'Sur ordre des autorités, prépare-toi à évacuer et à prendre tes comprimés d’iode. N’en prends pas sans consigne.', 'N’évacue ton domicile que sur ordre des autorités et reste à l’écoute des médias publics.'], '', [], [go('Mon kit', 'prepare/kit')]),
        far: node('Si tu n’habites pas à proximité', ['Conforme-toi aux consignes des autorités.', 'Anticipe et prépare-toi à une éventuelle évacuation. Reste à l’écoute des médias publics.'], '', [], [go('Mon kit', 'prepare/kit')]),
      } },
    { id: 'evacuation', cat: 'alerts', icon: 'route', title: 'Préparer un départ', description: 'Ordre d’évacuation, kit et consignes de destination.',
      keywords: 'évacuation départ sac kit fuite',
      sources: [kit], nodes: {
        start: node('Clarifier la raison du départ', [], 'Une évacuation est-elle demandée par les autorités ?', [option('Oui', 'ordered'), option('Non, je prépare mon kit', 'prepare'), option('Un danger est déjà présent', 'danger')]),
        ordered: node('Suivre le départ indiqué', ['Suis la destination et les consignes annoncées.', 'Emporte ton kit accessible : eau, nourriture sans cuisson, traitements, documents, clés, lampe et moyens de communication. Ne retarde pas le départ pour récupérer des objets.'], '', [], [go('Ma checklist', 'prepare/kit')]),
        prepare: node('Préparer le kit accessible', ['Regroupe les ressources essentielles et vérifie régulièrement piles, consommables et dates.'], '', [], [go('Compléter ma checklist', 'prepare/kit'), go('Vérifier mes réserves', 'prepare/stock')]),
        danger: node('Choisir les consignes du danger', ['Les actions diffèrent selon le danger. Choisis le parcours correspondant ou appelle le 112 en danger immédiat.'], '', [], [call('Appeler le 112', '112')]),
      } },
  ];

  const byId = id => GUIDES.find(g => g.id === id) || null;

  /** Recherche insensible aux accents et à la casse : chaque mot saisi doit commencer un mot du titre, de la description ou des mots-clés. */
  function search(query, cat) {
    const words = U.fold(query).trim().split(/\s+/).filter(Boolean);
    return GUIDES.filter(g => {
      if (cat && cat !== 'all' && g.cat !== cat) return false;
      const tokens = U.fold(g.title + ' ' + g.description + ' ' + (g.keywords || '')).split(/[^a-z0-9]+/);
      return words.every(w => tokens.some(t => t.startsWith(w)));
    });
  }

  /** Contrôle d'intégrité : renvoie la liste des problèmes (vide si tout va bien). */
  function validate(routes) {
    const problems = [];
    const ids = new Set();
    const catIds = new Set(CATEGORIES.map(c => c.id));
    GUIDES.forEach(g => {
      if (ids.has(g.id)) problems.push('identifiant en double : ' + g.id);
      ids.add(g.id);
      if (!catIds.has(g.cat)) problems.push(g.id + ' : catégorie inconnue ' + g.cat);
      if (!g.nodes || !g.nodes.start) { problems.push(g.id + ' : pas de nœud « start »'); return; }
      if (!g.sources || !g.sources.length) problems.push(g.id + ' : aucune source');
      (g.sources || []).forEach(([label, url]) => {
        if (!label || !/^https:\/\/[^\s]+$/.test(url)) problems.push(g.id + ' : source invalide ' + url);
      });
      const reached = new Set(['start']);
      const queue = ['start'];
      while (queue.length) {
        const id = queue.shift();
        const n = g.nodes[id];
        if (!n) { problems.push(g.id + ' : nœud introuvable ' + id); continue; }
        if (!n.actions.length && !n.question && !n.choices.length && !n.shortcuts.length) problems.push(g.id + '/' + id + ' : nœud vide');
        if (n.question && !n.choices.length) problems.push(g.id + '/' + id + ' : question sans choix');
        n.choices.forEach(c => {
          if (!c.label) problems.push(g.id + '/' + id + ' : choix sans libellé');
          if (!reached.has(c.next)) { reached.add(c.next); queue.push(c.next); }
        });
        n.shortcuts.forEach(s => {
          if (s.phone && !/^\d{2,10}$/.test(s.phone)) problems.push(g.id + '/' + id + ' : numéro invalide ' + s.phone);
          if (s.guide && !byId(s.guide)) problems.push(g.id + '/' + id + ' : guide inconnu ' + s.guide);
          if (s.view && routes && !routes.includes(s.view)) problems.push(g.id + '/' + id + ' : écran inconnu ' + s.view);
          if (!s.phone && !s.guide && !s.view) problems.push(g.id + '/' + id + ' : raccourci vide');
        });
      }
      Object.keys(g.nodes).forEach(id => { if (!reached.has(id)) problems.push(g.id + ' : nœud inaccessible ' + id); });
    });
    QUICK.forEach(id => { if (!byId(id)) problems.push('accès rapide inconnu : ' + id); });
    return problems;
  }

  /** Date de la dernière vérification des sources officielles (voir VERIFICATION.md). */
  const VERIFIED = '2026-10-05';

  return { CATEGORIES, GUIDES, QUICK, FORMATION, VERIFIED, byId, search, validate };
});


/* ==== js/14-data-codes.js ==== */
/* Codes de communication : alphabets d'épellation, signaux de détresse, signes sol-air. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VaultCodes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const ICAO_WORDS = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike',
    'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
  const FR_WORDS = ['Anatole', 'Berthe', 'Célestin', 'Désiré', 'Eugène', 'François', 'Gaston', 'Henri', 'Irma', 'Joseph', 'Kléber', 'Louis',
    'Marcel', 'Nicolas', 'Oscar', 'Pierre', 'Quintal', 'Raoul', 'Suzanne', 'Thérèse', 'Ursule', 'Victor', 'William', 'Xavier', 'Yvonne', 'Zoé'];

  const ICAO = LETTERS.map((letter, i) => ({ letter, word: ICAO_WORDS[i] }));
  const FRENCH = LETTERS.map((letter, i) => ({ letter, word: FR_WORDS[i] }));

  /** Épelle un texte avec l'un des alphabets : « Noel » → « Nicolas · Oscar · Eugène · Louis ». */
  function spell(text, table) {
    const map = new Map(table.map(e => [e.letter, e.word]));
    return String(text || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split('')
      .map(ch => (ch === ' ' ? '/' : map.get(ch) || (/[0-9]/.test(ch) ? ch : '')))
      .filter(Boolean).join(' · ').replace(/ · \/ · /g, '  /  ');
  }

  // Signes à tracer au sol, bien visibles d'un avion ou d'un hélicoptère (code international sol-air).
  const GROUND_AIR = [
    { sign: 'V', meaning: 'J’ai besoin d’aide' },
    { sign: 'X', meaning: 'J’ai besoin de soins médicaux' },
    { sign: 'Y', meaning: 'Oui' },
    { sign: 'N', meaning: 'Non' },
    { sign: '↑', meaning: 'Je vais dans cette direction' },
  ];

  const DISTRESS = [
    { icon: 'radio-tower', title: 'SOS en Morse', text: 'Trois points, trois traits, trois points (· · · − − − · · ·), sans pause entre les lettres. Lumière, son ou vibration.' },
    { icon: 'volume-2', title: 'Signal de détresse en montagne', text: 'Six signaux sonores ou lumineux par minute (un toutes les 10 secondes), puis une minute de pause, et on recommence. Réponse : trois signaux par minute.' },
    { icon: 'tent', title: 'Signes au sol', text: 'Un grand V (ou un X pour un besoin médical) tracé avec des pierres, des branches ou des vêtements de couleur vive, sur un terrain dégagé.' },
    { icon: 'sun', title: 'Miroir ou surface brillante', text: 'Fais miroiter la lumière du soleil vers l’avion ou les secours, par séries de trois éclats.' },
  ];

  return { ICAO, FRENCH, GROUND_AIR, DISTRESS, spell };
});


/* ==== js/20-state.js ==== */
/* État de l'application : schéma, valeurs par défaut, nettoyage (normalize), migration depuis la V1, stockage local,
 * sauvegarde / restauration. L'état V2 est un sur-ensemble de l'état V1 : les données déjà saisies restent valables. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'), require('./10-data-kit.js'));
  else root.VaultState = factory(root.VaultUtil, root.VaultKit);
})(typeof self !== 'undefined' ? self : this, function (U, Kit) {
  'use strict';

  const SCHEMA = 2;
  const KEY = 'vaultState';
  const HOUSING = ['Appartement', 'Maison', 'Autre'];
  const ZONES = ['Urbaine', 'Périurbaine', 'Rurale', 'Montagne', 'Littoral'];
  const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const THEMES = ['auto', 'dark', 'light'];
  const NUTRIENTS = ['energy', 'protein', 'carbs', 'fat', 'fibre', 'salt'];
  const LIMITS = { inventory: 300, contacts: 30, places: 50, customKit: 60, checklist: 400 };

  function defaults() {
    return {
      schema: SCHEMA,
      people: 1, targetDays: 3,
      waterLiters: 0, waterPerPerson: 2,                       // réserves à zéro : rien n'est supposé tant que rien n'est saisi
      foodKcal: 0, kcalPerPerson: 2000,
      powerMah: 0, dailyMah: 2500,
      housing: 'Appartement', zone: 'Urbaine', lowProfile: false,
      checklist: {}, foodMode: 'total', noCooking: false, inventory: [],
      needs: { baby: false, child: false, senior: false, pets: false, medical: false },
      customKit: [], checks: {},
      ice: { name: '', birth: '', blood: '', allergies: '', treatments: '', conditions: '', doctor: '', doctorPhone: '', notes: '' },
      contacts: [],
      plan: { address: '', meetNear: '', meetFar: '', remoteContact: '', gas: '', water: '', electricity: '', documents: '', pets: '', notes: '' },
      places: [],
      prefs: { theme: 'auto', night: false, textScale: 100, haptics: true },
      signal: { unit: 300, rxUnit: 300, freq: 700, torch: true, sound: false, vibrate: false, repeat: false },
      meta: { lastBackup: '', created: '', installDismissed: false },
    };
  }

  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const str = (v, max, fallback = '') => (typeof v === 'string' ? v.slice(0, max) : fallback);
  const bool = (v, fallback = false) => (typeof v === 'boolean' ? v : fallback);
  const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);
  const numIn = (v, min, max, fallback) => { const n = U.num(v, null); return n === null ? fallback : U.clamp(n, min, max); };
  const phone = v => (typeof v === 'string' ? v.replace(/[^\d+()\-.\s]/g, '').slice(0, 30) : '');
  const nutrient = (v, key) => { const n = U.num(v, null); return n !== null && n >= 0 ? Math.min(key === 'energy' ? 100000 : 100, n) : null; };

  function normalizeInventory(items) {
    if (!Array.isArray(items)) return [];
    const used = new Set();
    const out = [];
    items.filter(isObj).slice(0, LIMITS.inventory).forEach(i => {
      let id = typeof i.id === 'string' && /^food-[\w-]+$/.test(i.id) ? i.id : U.uid('food');
      if (used.has(id)) id = U.uid('food');
      used.add(id);
      const row = {
        id, name: str(i.name, 100, 'Aliment') || 'Aliment',
        quantity: Math.min(100000, Math.max(0, U.num(i.quantity, 0))),
        mass: Math.min(1000000, Math.max(0, U.num(i.mass, 0))),
        inStock: i.inStock === true, ready: i.ready === true,
        date: U.isIso(i.date) ? i.date : '',
        dateType: pick(i.dateType, ['', 'DLC', 'DDM'], ''),
        cat: str(i.cat, 20), note: str(i.note, 200),
      };
      NUTRIENTS.forEach(key => { row[key] = nutrient(i[key], key); });
      out.push(row);
    });
    return out;
  }

  /** Nettoie n'importe quelle donnée (stockage, import) et la complète : le résultat est toujours un état valide. */
  function normalize(raw) {
    const d = defaults();
    const r = isObj(raw) ? raw : {};
    const s = d;

    s.people = Math.round(numIn(r.people, 1, 99, d.people));
    s.targetDays = numIn(r.targetDays, 1, 3650, d.targetDays);
    s.waterLiters = numIn(r.waterLiters, 0, 1e6, d.waterLiters);
    s.waterPerPerson = numIn(r.waterPerPerson, 0.1, 100, d.waterPerPerson);
    s.foodKcal = numIn(r.foodKcal, 0, 1e9, d.foodKcal);
    s.kcalPerPerson = numIn(r.kcalPerPerson, 1, 20000, d.kcalPerPerson);
    s.powerMah = numIn(r.powerMah, 0, 1e9, d.powerMah);
    s.dailyMah = numIn(r.dailyMah, 1, 1e8, d.dailyMah);
    s.housing = pick(r.housing, HOUSING, d.housing);
    s.zone = pick(r.zone, ZONES, d.zone);
    s.lowProfile = bool(r.lowProfile);
    s.foodMode = r.foodMode === 'inventory' ? 'inventory' : 'total';
    s.noCooking = bool(r.noCooking);
    s.inventory = normalizeInventory(r.inventory);

    s.checklist = {};
    if (isObj(r.checklist)) {
      Object.keys(r.checklist).slice(0, LIMITS.checklist).forEach(k => {
        if (/^[\w-]{1,40}$/.test(k) && typeof r.checklist[k] === 'boolean') s.checklist[k] = r.checklist[k];
      });
    }
    if (isObj(r.needs)) Object.keys(s.needs).forEach(k => { s.needs[k] = bool(r.needs[k]); });
    s.customKit = [];
    if (Array.isArray(r.customKit)) {
      const used = new Set();
      r.customKit.filter(isObj).slice(0, LIMITS.customKit).forEach(i => {
        const label = str(i.label, 120).trim();
        if (!label) return;
        let id = typeof i.id === 'string' && /^c-[\w-]+$/.test(i.id) ? i.id : U.uid('c');
        if (used.has(id)) id = U.uid('c');
        used.add(id);
        s.customKit.push({ id, label, done: bool(i.done) });
      });
    }
    s.checks = {};
    if (isObj(r.checks)) Object.keys(r.checks).slice(0, 30).forEach(k => { if (/^[a-z0-9-]{1,30}$/.test(k) && U.isIso(r.checks[k])) s.checks[k] = r.checks[k]; });

    if (isObj(r.ice)) {
      const i = r.ice;
      s.ice = {
        name: str(i.name, 100), birth: U.isIso(i.birth) ? i.birth : '', blood: pick(i.blood, BLOOD, ''),
        allergies: str(i.allergies, 500), treatments: str(i.treatments, 500), conditions: str(i.conditions, 500),
        doctor: str(i.doctor, 100), doctorPhone: phone(i.doctorPhone), notes: str(i.notes, 500),
      };
    }
    s.contacts = [];
    if (Array.isArray(r.contacts)) {
      const used = new Set();
      r.contacts.filter(isObj).slice(0, LIMITS.contacts).forEach(c => {
        const name = str(c.name, 80).trim(), tel = phone(c.phone);
        if (!name && !tel) return;
        let id = typeof c.id === 'string' && /^ct-[\w-]+$/.test(c.id) ? c.id : U.uid('ct');
        if (used.has(id)) id = U.uid('ct');
        used.add(id);
        s.contacts.push({ id, name, phone: tel, role: str(c.role, 60), main: bool(c.main) });
      });
    }
    if (isObj(r.plan)) Object.keys(s.plan).forEach(k => { s.plan[k] = str(r.plan[k], k === 'notes' ? 1000 : 300); });
    s.places = [];
    if (Array.isArray(r.places)) {
      r.places.filter(isObj).slice(0, LIMITS.places).forEach(p => {
        const lat = U.num(p.lat, null), lon = U.num(p.lon, null);
        if (lat === null || lon === null || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
        s.places.push({ id: typeof p.id === 'string' && /^pl-[\w-]+$/.test(p.id) ? p.id : U.uid('pl'), name: str(p.name, 60) || 'Point', lat, lon, acc: U.num(p.acc, null), ts: U.num(p.ts, 0) });
      });
    }
    if (isObj(r.prefs)) {
      s.prefs = {
        theme: pick(r.prefs.theme, THEMES, 'auto'), night: bool(r.prefs.night),
        textScale: Math.round(numIn(r.prefs.textScale, 85, 140, 100)), haptics: bool(r.prefs.haptics, true),
      };
    }
    if (isObj(r.signal)) {
      const g = r.signal;
      s.signal = {
        unit: Math.round(numIn(g.unit, 100, 1200, 300)), rxUnit: Math.round(numIn(g.rxUnit, 60, 1200, 300)), freq: Math.round(numIn(g.freq, 300, 2000, 700)),
        torch: bool(g.torch, true), sound: bool(g.sound), vibrate: bool(g.vibrate), repeat: bool(g.repeat),
      };
    }
    if (isObj(r.meta)) {
      s.meta = { lastBackup: typeof r.meta.lastBackup === 'string' ? r.meta.lastBackup.slice(0, 40) : '', created: U.isIso(r.meta.created) ? r.meta.created : '', installDismissed: bool(r.meta.installDismissed) };
    }
    return s;
  }

  /** Rien n'a été saisi en dehors des réglages (foyer, objectif, thème) : réserves, aliments, kit, contacts, fiche, plan, points, contrôles. */
  function untouched(s) {
    const ice = s.ice || {};
    return !(s.inventory || []).length && !Object.values(s.checklist || {}).some(Boolean) && !(s.customKit || []).length && !(s.contacts || []).length
      && !(s.places || []).length && !Object.keys(s.checks || {}).length && !Object.values(ice).some(Boolean) && !Object.values(s.plan || {}).some(Boolean);
  }

  /** Lit le stockage. Une V1 (sans `schema`) est migrée : les champs inconnus de la V1 reçoivent leurs valeurs par défaut. */
  function load(storage) {
    let raw = null;
    try { raw = JSON.parse((storage && storage.getItem(KEY)) || 'null'); } catch (_) { raw = null; }
    const migrated = !isObj(raw) || raw.schema !== SCHEMA;
    const s = normalize(raw);
    // La V1 préremplissait trois valeurs d'exemple (6 L, 6 000 kcal, 10 000 mAh). Si rien d'autre n'a été saisi, on repart de zéro
    // plutôt que d'afficher une préparation que personne n'a renseignée.
    if (isObj(raw) && raw.schema === undefined && s.waterLiters === 6 && s.foodKcal === 6000 && s.powerMah === 10000 && untouched(s)) { s.waterLiters = 0; s.foodKcal = 0; s.powerMah = 0; }
    if (!s.meta.created) s.meta.created = U.isoDate();
    return { state: s, migrated, existed: isObj(raw) };
  }

  /** Écrit l'état. Renvoie true si l'écriture a réussi (stockage plein ou bloqué : false, sans exception). */
  function save(storage, state) {
    try { storage.setItem(KEY, JSON.stringify(state)); return true; } catch (_) { return false; }
  }

  /** Magasin d'état : lecture, modification, abonnement, enregistrement différé. */
  function createStore(storage) {
    const loaded = load(storage);
    let state = loaded.state;
    const listeners = new Set();
    let timer = null;
    let lastSaveOk = true;
    const flush = () => { clearTimeout(timer); timer = null; if (storage) lastSaveOk = save(storage, state); return lastSaveOk; };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(flush, 120); };
    const notify = what => listeners.forEach(fn => { try { fn(state, what); } catch (e) { if (typeof console !== 'undefined') console.error(e); } });
    return {
      get: () => state,
      info: { migrated: loaded.migrated, existed: loaded.existed },
      /** Modifie l'état avec `fn(state)` puis enregistre et prévient les abonnés. `what` indique ce qui a changé (facultatif). */
      update(fn, what) { fn(state); schedule(); notify(what); },
      /** Comme `update`, sans prévenir les abonnés (saisie en cours dans un champ : la vue se met à jour elle-même). */
      quiet(fn) { fn(state); schedule(); },
      replace(raw) { state = normalize(raw); if (!state.meta.created) state.meta.created = U.isoDate(); flush(); notify('replace'); },
      reset() { state = normalize({}); state.meta.created = U.isoDate(); flush(); notify('replace'); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      flush,
      get saveOk() { return lastSaveOk; },
    };
  }

  // --- sauvegarde et restauration (fichier JSON)
  function exportData(state, now) {
    return JSON.stringify({ app: 'VAULT', schema: SCHEMA, exported: (now || new Date()).toISOString(), data: state }, null, 2);
  }
  /** Lit un fichier de sauvegarde. Renvoie { ok, state } ou { ok:false, error }. */
  function parseImport(text) {
    if (typeof text !== 'string' || !text.trim()) return { ok: false, error: 'Le fichier est vide.' };
    if (text.length > 2000000) return { ok: false, error: 'Le fichier est trop volumineux pour être une sauvegarde VAULT.' };
    let json;
    try { json = JSON.parse(text); } catch (_) { return { ok: false, error: 'Ce fichier n’est pas une sauvegarde VAULT lisible.' }; }
    if (!isObj(json) || json.app !== 'VAULT' || !isObj(json.data)) return { ok: false, error: 'Ce fichier n’est pas une sauvegarde VAULT.' };
    return { ok: true, state: normalize(json.data), exported: typeof json.exported === 'string' ? json.exported : '' };
  }

  return { SCHEMA, KEY, HOUSING, ZONES, BLOOD, THEMES, NUTRIENTS, LIMITS, defaults, normalize, load, save, createStore, exportData, parseImport };
});


/* ==== js/21-calc.js ==== */
/* Calculs : autonomie, score de préparation, inventaire, péremption, liste d'achats, priorités. Fonctions pures. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'), require('./10-data-kit.js'), require('./20-state.js'));
  else root.VaultCalc = factory(root.VaultUtil, root.VaultKit, root.VaultState);
})(typeof self !== 'undefined' ? self : this, function (U, Kit, State) {
  'use strict';

  const RESOURCES = {
    water: { label: 'Eau', article: 'd’eau', icon: 'droplet', unit: 'L' },
    food: { label: 'Nourriture', article: 'de nourriture', icon: 'utensils', unit: 'kcal' },
    energy: { label: 'Énergie', article: 'd’énergie', icon: 'zap', unit: 'mAh' },
  };
  const SOON_DAYS = 30;
  const WARN_DAYS = 90;
  const BACKUP_AFTER_DAYS = 30;

  // ------------------------------------------------------------------ péremption
  /** Statut d'une date de péremption : none, ok, warn (≤ 90 j), soon (≤ 30 j), expired. */
  function expiry(item, todayIso) {
    if (!item || !U.isIso(item.date)) return { level: 'none', days: null, dlc: false };
    const days = U.daysBetween(todayIso, item.date);
    const dlc = item.dateType === 'DLC';
    const level = days < 0 ? 'expired' : days <= SOON_DAYS ? 'soon' : days <= WARN_DAYS ? 'warn' : 'ok';
    return { level, days, dlc };
  }
  /** Une DLC dépassée n'est jamais comptée dans les réserves (danger sanitaire). Une DDM dépassée reste comptée, signalée. */
  const excluded = (item, todayIso) => { const e = expiry(item, todayIso); return e.level === 'expired' && e.dlc; };

  // ------------------------------------------------------------------ inventaire
  function totals(state, todayIso) {
    const all = Array.isArray(state.inventory) ? state.inventory : [];
    const eligible = i => i.inStock && (!state.noCooking || i.ready) && U.num(i.quantity, 0) > 0 && U.num(i.mass, 0) > 0;
    const selected = all.filter(i => eligible(i) && !excluded(i, todayIso));
    const values = {}, missing = {};
    State.NUTRIENTS.forEach(key => {
      values[key] = 0; missing[key] = 0;
      selected.forEach(i => {
        const n = U.num(i[key], null);
        if (n === null || n < 0) missing[key]++;
        else values[key] += (i.quantity * i.mass / 100) * n;
      });
    });
    return {
      values, missing, selected: selected.length,
      owned: all.filter(i => i.inStock).length, shopping: all.filter(i => !i.inStock).length,
      expiredDlc: all.filter(i => i.inStock && excluded(i, todayIso)).length,
      expiredOther: all.filter(i => i.inStock && !excluded(i, todayIso) && expiry(i, todayIso).level === 'expired').length,
      soon: all.filter(i => i.inStock && expiry(i, todayIso).level === 'soon').length,
    };
  }
  const effectiveCalories = (state, todayIso) => (state.foodMode === 'inventory' ? totals(state, todayIso).values.energy : U.num(state.foodKcal, 0));

  // ------------------------------------------------------------------ ressources et score
  function resources(state, todayIso) {
    const people = Math.max(1, Number(state.people) || 1);
    const target = Math.max(1, Number(state.targetDays) || 3);
    const perWater = Math.max(0.1, Number(state.waterPerPerson) || 2);
    const perKcal = Math.max(1, Number(state.kcalPerPerson) || 2000);
    const daily = Math.max(1, Number(state.dailyMah) || 2500);
    const waterHave = U.num(state.waterLiters, 0), foodHave = effectiveCalories(state, todayIso), energyHave = U.num(state.powerMah, 0);
    const water = { have: waterHave, days: waterHave / (people * perWater), need: target * people * perWater };
    const food = { have: foodHave, days: foodHave / (people * perKcal), need: target * people * perKcal };
    const energy = { have: energyHave, days: energyHave / daily, need: target * daily };
    [water, food, energy].forEach(r => { r.missing = Math.max(0, r.need - r.have); r.ratio = U.clamp(r.days / target, 0, 1); });
    const list = [['water', water], ['food', food], ['energy', energy]];
    const critical = list.slice().sort((a, b) => a[1].days - b[1].days)[0];
    return {
      people, target, water, food, energy,
      autonomy: Math.max(0, Math.min(water.days, food.days, energy.days)),
      critical: { id: critical[0], label: RESOURCES[critical[0]].label, days: critical[1].days },
    };
  }

  /** Score = 70 % ressources (par rapport à l'objectif) + 30 % liste du kit qui compte. */
  function score(state, todayIso) {
    const r = resources(state, todayIso);
    const kit = Kit.coreProgress(state);
    const resourceScore = (r.water.ratio + r.food.ratio + r.energy.ratio) / 3;
    return { score: Math.round((resourceScore * 0.7 + kit.ratio * 0.3) * 100), resourceScore, kit };
  }
  const scoreLabel = s => (s < 35 ? 'Base de préparation à renforcer.' : s < 70 ? 'Préparation partielle : quelques manques restent critiques.' : 'Base solide : vérifie régulièrement les consommables.');

  // ------------------------------------------------------------------ liste d'achats
  function shopping(state, todayIso) {
    const r = resources(state, todayIso);
    const out = [];
    if (r.water.missing > 0.05) {
      const l = Math.ceil(r.water.missing);
      out.push({ id: 'water', kind: 'water', icon: 'droplet', label: 'Eau potable', detail: l + ' L, soit environ ' + Math.ceil(l / 1.5) + ' bouteilles de 1,5 L' });
    }
    if (r.food.missing > 1) {
      const kg = Math.ceil(r.food.missing / 35.5) / 100;   // kg de pâtes sèches (355 kcal pour 100 g), arrondi à 10 g
      out.push({ id: 'food', kind: 'food', icon: 'utensils', label: 'Nourriture', detail: U.fmtInt(r.food.missing) + ' kcal, soit environ ' + U.fmt(kg, 2) + ' kg de pâtes sèches' });
    }
    if (r.energy.missing > 1) {
      const n = Math.ceil(r.energy.missing / 10000);
      out.push({ id: 'energy', kind: 'energy', icon: 'zap', label: 'Énergie', detail: U.fmtInt(r.energy.missing) + ' mAh, soit ' + n + ' ' + U.plural(n, 'batterie', 'batteries') + ' externe' + (n >= 2 ? 's' : '') + ' de 10 000 mAh' });
    }
    (state.inventory || []).filter(i => !i.inStock).forEach(i => {
      out.push({ id: i.id, kind: 'item', icon: 'shopping-cart', label: i.name, detail: U.fmt(i.quantity, 2) + ' × ' + U.fmt(i.mass, 1) + ' g' });
    });
    Kit.kitItems(state).core.filter(i => !i.done).forEach(i => out.push({ id: 'kit-' + i.id, kind: 'kit', icon: 'clipboard-check', label: i.label, detail: 'Kit 72 h' }));
    return out;
  }
  const shoppingText = items => (items.length ? items.map(i => '☐ ' + i.label + (i.detail ? ' — ' + i.detail : '')).join('\n') : 'Rien à acheter pour le moment.');

  // ------------------------------------------------------------------ contrôles périodiques
  function reminders(state, todayIso) {
    return Kit.REMINDERS.map(r => Object.assign({ reminder: r }, Kit.reminderStatus(r, (state.checks || {})[r.id], todayIso)));
  }

  /** État vierge : rien n'a encore été saisi (réserves, aliments, kit, contacts, fiche, plan, points, contrôles). Les réglages ne comptent pas. */
  function isBlank(state) {
    const s = state || {};
    const ice = s.ice || {};
    return !(U.num(s.waterLiters, 0) > 0 || U.num(s.foodKcal, 0) > 0 || U.num(s.powerMah, 0) > 0)
      && !(s.inventory || []).length && !Object.values(s.checklist || {}).some(Boolean) && !(s.customKit || []).length && !(s.contacts || []).length
      && !(s.places || []).length && !Object.keys(s.checks || {}).length && !Object.values(ice).some(Boolean) && !Object.values(s.plan || {}).some(Boolean);
  }

  // ------------------------------------------------------------------ priorités de l'accueil
  const LEVEL_ORDER = { critical: 0, warn: 1, info: 2, ok: 3 };
  function priorities(state, todayIso) {
    const r = resources(state, todayIso);
    const t = totals(state, todayIso);
    const out = [];

    ['water', 'food', 'energy'].forEach(id => {
      const res = r[id];
      if (res.days >= r.target) return;
      const unit = id === 'water' ? ' L' : id === 'food' ? ' kcal' : ' mAh';
      out.push({
        id: 'low-' + id, level: res.days < 1 ? 'critical' : 'warn', icon: RESOURCES[id].icon,
        title: 'Renforcer : ' + RESOURCES[id].label.toLowerCase(),
        text: 'Ta réserve ' + RESOURCES[id].article + ' couvre environ ' + U.fmt1(res.days) + ' jours pour un objectif de ' + U.fmt(r.target, 1) + '. Il manque environ ' + U.fmtInt(Math.ceil(res.missing)) + unit + '.',
        route: 'prepare/stock', cta: 'Voir le stock', days: res.days,
      });
    });
    if (t.expiredDlc) out.push({ id: 'dlc', level: 'critical', icon: 'triangle-alert', title: t.expiredDlc + ' ' + U.plural(t.expiredDlc, 'aliment', 'aliments') + ' avec une DLC dépassée', text: 'Ces aliments ne sont pas comptés dans tes réserves. Retire-les et remplace-les.', route: 'prepare/stock', cta: 'Voir l’inventaire' });
    if (t.expiredOther) out.push({ id: 'ddm', level: 'warn', icon: 'calendar-clock', title: t.expiredOther + ' ' + U.plural(t.expiredOther, 'aliment', 'aliments') + ' avec une date dépassée', text: 'Vérifie l’emballage et la conservation avant toute consommation : une date peut être une simple recommandation de qualité.', route: 'prepare/stock', cta: 'Voir l’inventaire' });
    if (t.soon) out.push({ id: 'soon', level: 'warn', icon: 'calendar-clock', title: t.soon + ' ' + U.plural(t.soon, 'aliment', 'aliments') + ' à consommer dans les 30 jours', text: 'Consomme-les en priorité et remplace-les pour garder une réserve à jour.', route: 'prepare/stock', cta: 'Voir l’inventaire' });

    const rem = reminders(state, todayIso);
    const overdue = rem.filter(x => x.level === 'overdue');
    if (overdue.length) out.push({ id: 'checks', level: 'warn', icon: 'history', title: overdue.length + ' ' + U.plural(overdue.length, 'contrôle', 'contrôles') + ' en retard', text: overdue.map(x => x.reminder.label).join(' · '), route: 'prepare/kit', cta: 'Faire les contrôles' });
    else if (rem.some(x => x.level === 'never')) out.push({ id: 'checks-never', level: 'info', icon: 'history', title: 'Planifier tes contrôles', text: 'Note quand tu vérifies l’eau, les piles et les dates : VAULT te rappellera de les refaire.', route: 'prepare/kit', cta: 'Ouvrir les contrôles' });

    const kit = Kit.coreProgress(state);
    if (kit.done < kit.total) out.push({ id: 'kit', level: 'info', icon: 'clipboard-check', title: 'Terminer le kit 72 h', text: (kit.total - kit.done) + ' ' + U.plural(kit.total - kit.done, 'élément reste', 'éléments restent') + ' à préparer.', route: 'prepare/kit', cta: 'Voir le kit' });

    const ice = state.ice || {};
    if (!ice.name && !ice.allergies && !ice.treatments && !ice.conditions) out.push({ id: 'ice', level: 'info', icon: 'id-card', title: 'Remplir ta fiche vitale', text: 'Allergies, traitements, contact à prévenir : elle reste sur ton appareil et se lit en un geste.', route: 'emergency', cta: 'Ma fiche' });
    if (!(state.contacts || []).length) out.push({ id: 'contacts', level: 'info', icon: 'users', title: 'Ajouter un contact d’urgence', text: 'Une personne à prévenir et un point de rendez-vous évitent bien des difficultés si le réseau est saturé.', route: 'prepare/plan', cta: 'Mon plan' });

    const meaningful = (state.inventory || []).length || kit.done || (state.contacts || []).length || ice.name;
    const last = state.meta && state.meta.lastBackup ? state.meta.lastBackup.slice(0, 10) : '';
    if (meaningful && (!U.isIso(last) || U.daysBetween(last, todayIso) > BACKUP_AFTER_DAYS)) {
      out.push({ id: 'backup', level: 'info', icon: 'download', title: 'Sauvegarder tes données', text: 'Tout est stocké dans ce navigateur : un fichier de sauvegarde te protège d’un effacement accidentel.', route: 'settings', cta: 'Sauvegarder' });
    }

    out.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || (a.days || 0) - (b.days || 0));
    if (!out.length) out.push({ id: 'ok', level: 'ok', icon: 'shield-check', title: 'Préparation opérationnelle', text: 'Tes ressources atteignent l’objectif et ton kit est complet. Continue à vérifier régulièrement les dates et les piles.', route: null, cta: '' });
    return out;
  }

  return { RESOURCES, expiry, excluded, totals, effectiveCalories, resources, score, scoreLabel, shopping, shoppingText, reminders, isBlank, priorities, SOON_DAYS, WARN_DAYS };
});


/* ==== js/22-morse.js ==== */
/* Morse : encodage, minuterie d'émission, traduction, décodage adaptatif (la vitesse de l'émetteur est estimée).
 * Aucune dépendance au DOM : testé sous Node avec des signaux simulés. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VaultMorse = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ALPHABET = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '-': '-....-', '"': '.-..-.', ':': '---...',
    ';': '-.-.-.', '_': '..--.-', '@': '.--.-.', '$': '...-..-', '(': '-.--.', ')': '-.--.-', '&': '.-...', '+': '.-.-.', '=': '-...-',
    // lettres accentuées usuelles en français
    'É': '..-..', 'È': '.-..-', 'À': '.--.-', 'Ç': '-.-..', 'Ö': '---.', 'Ü': '..--', 'Ä': '.-.-', 'Ñ': '--.--',
  };
  // Signaux de procédure : envoyés sans pause entre leurs lettres, notés <AR> dans le message.
  const PROSIGNS = { SOS: '...---...', AR: '.-.-.', SK: '...-.-', KN: '-.--.', BT: '-...-', AS: '.-...', CT: '-.-.-' };
  const PROSIGN_MEANING = {
    SOS: 'Détresse', AR: 'Fin de message', SK: 'Fin de la communication', KN: 'À toi, pas aux autres', BT: 'Pause / séparation',
    AS: 'Attends', CT: 'Début de transmission',
  };

  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  // Table inverse : à code identique, le signal de procédure prime sur la ponctuation (+ = AR, = = BT, ( = KN, & = AS).
  const REVERSE = {};
  Object.keys(ALPHABET).forEach(ch => { if (!has(REVERSE, ALPHABET[ch])) REVERSE[ALPHABET[ch]] = ch; });
  Object.keys(PROSIGNS).forEach(name => { REVERSE[PROSIGNS[name]] = name === 'SOS' ? 'SOS' : '<' + name + '>'; });

  /** Lettre de l'alphabet Morse correspondant à un caractère (accents ramenés à la lettre de base si besoin), sinon ''. */
  function toKey(ch) {
    const up = String(ch).toUpperCase();
    if (has(ALPHABET, up)) return up;
    const base = up.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return has(ALPHABET, base) ? base : '';
  }

  /** Message → { morse: '... --- ...', words, unknown } ; <AR> et les autres signaux de procédure sont reconnus. */
  function encode(text) {
    const words = [];
    const unknown = new Set();
    String(text == null ? '' : text).split(/\s+/).filter(Boolean).forEach(raw => {
      const letters = [];
      const re = /<([A-Za-z]{2,3})>|([\s\S])/gu;
      let m;
      while ((m = re.exec(raw))) {
        if (m[1]) {
          const name = m[1].toUpperCase();
          if (has(PROSIGNS, name)) letters.push({ ch: '<' + name + '>', code: PROSIGNS[name] }); else unknown.add(m[0]);
        } else {
          const key = toKey(m[2]);
          if (key) letters.push({ ch: key, code: ALPHABET[key] }); else unknown.add(m[2]);
        }
      }
      if (letters.length) words.push(letters);
    });
    return { morse: words.map(w => w.map(l => l.code).join(' ')).join(' / '), words, unknown: [...unknown] };
  }

  /** Séquence de signaux { on, ms } : point = 1, trait = 3, pause entre signes = 1, entre lettres = 3, entre mots = 7. */
  function timeline(morse, unit) {
    const out = [];
    const off = ms => { out.push({ on: false, ms }); };
    const words = String(morse || '').split('/').map(w => w.trim()).filter(Boolean);
    words.forEach((word, wi) => {
      const letters = word.split(/\s+/);
      letters.forEach((letter, li) => {
        const symbols = [...letter].filter(s => s === '.' || s === '-');
        symbols.forEach((s, si) => {
          out.push({ on: true, ms: (s === '.' ? 1 : 3) * unit });
          if (si < symbols.length - 1) off(unit);
        });
        if (symbols.length && li < letters.length - 1) off(3 * unit);
      });
      if (wi < words.length - 1) off(7 * unit);
    });
    return out;
  }
  /** Position de chaque lettre dans le temps : [{ ch, start, end, word }] en ms (suivi de l'émission dans le message). */
  function spans(text, unit) {
    const words = encode(text).words;
    const out = [];
    let t = 0;
    words.forEach((word, wi) => {
      word.forEach((letter, li) => {
        const symbols = [...letter.code];
        const dur = symbols.reduce((s, c, i) => s + (c === '.' ? 1 : 3) * unit + (i < symbols.length - 1 ? unit : 0), 0);
        out.push({ ch: letter.ch, start: t, end: t + dur, word: wi });
        t += dur;
        if (li < word.length - 1) t += 3 * unit; else if (wi < words.length - 1) t += 7 * unit;
      });
    });
    return out;
  }
  const duration = tl => tl.reduce((s, e) => s + e.ms, 0);
  /** Motif de vibration [allumé, éteint, allumé, …] (navigator.vibrate). */
  const vibrationPattern = tl => tl.map(e => Math.round(e.ms));
  /** Nombre de flashs par seconde le plus rapide : au-delà de 3, les lumières clignotantes peuvent gêner. */
  const flashRate = unit => 1000 / (2 * unit);

  /** Traduit du Morse saisi (points, traits, espaces entre lettres, / entre mots). */
  function translate(raw) {
    const normalized = String(raw || '').trim().replace(/[·•]/g, '.').replace(/[–—−_]/g, '-');
    if (!normalized) return '';
    return normalized.split(/\s*\/\s*|\n+/).map(word => word.trim().split(/\s+/).filter(Boolean)
      .map(token => (has(REVERSE, token) ? REVERSE[token] : '?')).join('')).filter(Boolean).join(' ');
  }

  // ------------------------------------------------------------------ décodage
  const median = arr => { const s = arr.slice().sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const clampUnit = u => Math.min(3000, Math.max(30, u));

  /** Deux groupes de durées (points / traits) : 2-moyennes dans l'échelle logarithmique. */
  function twoMeans(sorted) {
    const logs = sorted.map(Math.log);
    let c1 = logs[0], c2 = logs[logs.length - 1], n1 = 0, n2 = 0;
    for (let it = 0; it < 24; it++) {
      let s1 = 0, s2 = 0;
      n1 = 0; n2 = 0;
      for (const x of logs) { if (Math.abs(x - c1) <= Math.abs(x - c2)) { s1 += x; n1++; } else { s2 += x; n2++; } }
      const a = n1 ? s1 / n1 : c1, b = n2 ? s2 / n2 : c2;
      if (Math.abs(a - c1) < 1e-7 && Math.abs(b - c2) < 1e-7) break;
      c1 = a; c2 = b;
    }
    return { c1: Math.exp(c1), c2: Math.exp(c2), n1, n2 };
  }

  /** Durée d'un point d'après les durées des signaux allumés ; `prior` départage points seuls et traits seuls. */
  function estimateUnit(ons, prior) {
    const good = ons.filter(d => d > 0);
    if (!good.length) return prior || 300;
    const med = median(good);
    const sorted = good.filter(d => d <= 8 * med).sort((a, b) => a - b);
    if (sorted.length >= 2) {
      const k = twoMeans(sorted);
      if (k.n1 && k.n2 && k.c2 / k.c1 >= 1.9) return clampUnit(Math.sqrt(k.c1 * (k.c2 / 3)));
    }
    const c = Math.exp(sorted.reduce((s, d) => s + Math.log(d), 0) / sorted.length);
    if (prior) return clampUnit(Math.abs(Math.log(c / prior)) <= Math.abs(Math.log(c / (3 * prior))) ? c : c / 3);
    return clampUnit(c);
  }

  /**
   * Décode une suite d'événements [{ on, d }] (durées en ms, en alternance).
   * options : prior (durée d'un point attendue), auto (estimer la vitesse), trailing (silence en cours, ms), final.
   */
  function decodeEvents(events, options = {}) {
    const auto = options.auto !== false;
    const ons = events.filter(e => e.on).map(e => e.d);
    const unit = auto ? estimateUnit(ons, options.prior) : (options.prior || 300);
    const words = [[]];
    let token = '';
    let bad = 0;
    const flushLetter = () => { if (token) { words[words.length - 1].push(token); token = ''; } };
    const gap = d => {
      if (d >= 5 * unit) { flushLetter(); if (words[words.length - 1].length) words.push([]); }
      else if (d >= 2 * unit) flushLetter();
    };
    events.forEach(e => {
      if (e.on) {
        token += e.d < 2 * unit ? '.' : '-';
        if (token.length > 9) { flushLetter(); bad++; }
      } else gap(e.d);
    });
    if (options.trailing != null) gap(options.trailing); else if (options.final) flushLetter();
    const pending = token;
    const done = words.filter(w => w.length);
    const letter = t => (has(REVERSE, t) ? REVERSE[t] : '?');
    return {
      unit, bad, pending,
      morse: done.map(w => w.join(' ')).join(' / ') + (pending ? (done.length || words[words.length - 1].length ? ' ' : '') + pending : ''),
      text: done.map(w => w.map(letter).join('')).join(' '),
    };
  }

  /**
   * Décodeur au fil de l'eau : on lui donne un état allumé / éteint à chaque instant (feed), il garde les
   * événements et redécode le tout, de sorte que la vitesse estimée corrige les premiers signes.
   */
  class StreamDecoder {
    constructor(options = {}) {
      this.prior = options.unit || 300;
      this.auto = options.auto !== false;
      this.debounce = options.debounce == null ? 25 : options.debounce;
      this.reset();
    }
    reset() {
      this.state = false; this.cand = false; this.candSince = null; this.edge = null;
      this.events = []; this.committed = []; this._cache = null; this._unit = this.prior;
    }
    setUnit(unit) { this.prior = unit; this._cache = null; }
    setAuto(auto) { this.auto = auto; this._cache = null; }
    silenceLimit() { return Math.max(2500, 14 * this._unit); }
    commit() {
      if (this.events.length) {
        const d = decodeEvents(this.events, { prior: this.prior, auto: this.auto, final: true });
        if (d.text || d.morse) this.committed.push({ morse: d.morse, text: d.text });
        if (this.committed.length > 30) this.committed.shift();
        this._unit = d.unit;
      }
      this.events = []; this._cache = null;
    }
    /** value : lumière / bip détecté à l'instant t (ms, horloge monotone). */
    feed(value, t) {
      value = !!value;
      if (this.edge === null) { this.edge = t; this.candSince = t; this.cand = value; return; }
      if (value !== this.cand) { this.cand = value; this.candSince = t; }
      if (this.cand !== this.state && t - this.candSince >= this.debounce) {
        const at = this.candSince;
        const d = at - this.edge;
        if (this.state) {
          this.events.push({ on: true, d });
          this._cache = null;
        } else if (this.events.length) {
          if (d >= this.silenceLimit()) this.commit(); else { this.events.push({ on: false, d }); this._cache = null; }
        }
        this.state = this.cand; this.edge = at;
        if (this.events.length > 600) this.commit();
      }
    }
    /** État décodé à l'instant `now` : { morse, text, unit, lit }. */
    snapshot(now) {
      const open = !this.state && this.events.length && this.edge !== null ? Math.max(0, now - this.edge) : null;
      if (open !== null && open >= this.silenceLimit()) this.commit();
      const trailing = !this.state && this.events.length && this.edge !== null ? Math.max(0, now - this.edge) : null;
      // le résultat ne change que si les événements ou la classe du silence en cours changent
      const unit = this._cache ? this._cache.unit : this._unit;
      const cls = trailing === null ? -1 : trailing >= 5 * unit ? 2 : trailing >= 2 * unit ? 1 : 0;
      if (!this._cache || this._cache.n !== this.events.length || this._cache.cls !== cls) {
        const d = decodeEvents(this.events, { prior: this.prior, auto: this.auto, trailing });
        this._cache = { n: this.events.length, cls, unit: d.unit, d };
        this._unit = d.unit;
      }
      const d = this._cache.d;
      const parts = this.committed.map(c => c.text).concat(d.text).filter(Boolean);
      const morse = this.committed.map(c => c.morse).concat(d.morse).filter(Boolean);
      return { morse: morse.join(' / '), text: parts.join(' '), unit: d.unit, lit: this.state, bad: d.bad };
    }
    finish() { this.commit(); }
  }

  return {
    ALPHABET, PROSIGNS, PROSIGN_MEANING, REVERSE, toKey, encode, timeline, spans, duration, vibrationPattern, flashRate, translate,
    estimateUnit, decodeEvents, StreamDecoder,
  };
});


/* ==== js/23-acoustic.js ==== */
/* Analyse acoustique : indices tirés du spectre du microphone. EXPÉRIMENTALE : elle relève des indices sonores
 * (tonalité stable, harmoniques) et ne peut jamais confirmer ni exclure la présence d'une source précise (drone, moteur…). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VaultAcoustic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const finite = (v, fallback = -160) => (Number.isFinite(v) ? v : fallback);

  /**
   * Caractéristiques d'un instant : niveau (dBFS, relatif au micro), fréquence dominante, part de la tonalité,
   * nombre d'harmoniques de la fréquence dominante.
   * frequency : spectre en dB (AnalyserNode.getFloatFrequencyData) ; waveform : échantillons temporels.
   */
  function spectralFeatures(frequency, waveform, sampleRate, fftSize) {
    let sum = 0;
    for (const x of waveform) sum += x * x;
    const rms = Math.sqrt(sum / waveform.length);
    const db = 20 * Math.log10(Math.max(rms, 1e-8));
    const binHz = sampleRate / fftSize;
    const lo = Math.max(1, Math.ceil(80 / binHz)), hi = Math.min(frequency.length - 1, Math.floor(6000 / binHz));
    let total = 0, peak = lo, peakDb = -160;
    for (let i = lo; i <= hi; i++) {
      const value = finite(frequency[i]);
      total += 10 ** (value / 10);
      if (value > peakDb) { peakDb = value; peak = i; }
    }
    let peakPower = 0;
    for (let i = Math.max(lo, peak - 2); i <= Math.min(hi, peak + 2); i++) peakPower += 10 ** (finite(frequency[i]) / 10);
    const toneShare = peakPower / Math.max(total, 1e-16);
    // Des pics harmoniques seuls n'identifient pas leur source physique.
    let harmonics = 0;
    for (let multiple = 2; multiple <= 5; multiple++) {
      const expected = peak * multiple;
      if (expected > hi) break;
      const tolerance = Math.max(2, Math.round(expected * 0.025));
      let harmonicDb = -160;
      for (let i = Math.max(lo, expected - tolerance); i <= Math.min(hi, expected + tolerance); i++) harmonicDb = Math.max(harmonicDb, finite(frequency[i]));
      if (harmonicDb > -75 && harmonicDb > peakDb - 20) harmonics++;
    }
    return { db, peakHz: peak * binHz, toneShare, harmonics };
  }

  /** Suit la stabilité de la fréquence dominante sur 2,5 s et décrit ce qui s'entend, sans jamais conclure sur la source. */
  class AcousticTracker {
    constructor() { this.history = []; }
    update(features, timestamp) {
      if (features.db < -60) {
        this.history = [];
        return { level: 'quiet', title: 'Son très faible', detail: 'Aucune signature exploitable. Ce résultat ne permet pas de conclure à l’absence d’une source sonore.' };
      }
      this.history.push({ hz: features.peakHz, time: timestamp });
      this.history = this.history.filter(item => timestamp - item.time < 2500).slice(-100);
      const mean = this.history.reduce((sum, x) => sum + x.hz, 0) / this.history.length;
      const deviation = Math.sqrt(this.history.reduce((sum, x) => sum + (x.hz - mean) ** 2, 0) / this.history.length) / Math.max(mean, 1);
      const stable = this.history.length >= 15 && timestamp - this.history[0].time >= 1500 && deviation < 0.06;
      if (stable && features.toneShare > 0.12 && features.harmonics >= 2) {
        return { level: 'harmonics', title: 'Harmoniques persistantes', detail: 'Indices compatibles avec une source motorisée. Drone, ventilateur ou véhicule possibles ; la source ne peut pas être identifiée.' };
      }
      if (stable && features.toneShare > 0.25) return { level: 'stable', title: 'Tonalité stable', detail: 'Une fréquence ressort régulièrement. Bip, sifflement ou moteur possibles ; la source reste indéterminée.' };
      if (features.toneShare > 0.25) return { level: 'tonal', title: 'Son tonal détecté', detail: 'Une fréquence dominante est présente. Laisse l’écoute se poursuivre pour vérifier sa stabilité.' };
      return { level: 'noise', title: 'Bruit diffus ou variable', detail: 'Pas de motif tonal stable relevé. Voix, circulation et vent peuvent produire ce type de spectre.' };
    }
  }

  /**
   * Réduit un spectre à `count` barres sur une échelle logarithmique de `fmin` à `fmax` Hz (pour l'affichage).
   * Chaque valeur est ramenée entre 0 et 1 (de -100 dB à -20 dB).
   */
  function logBars(frequency, sampleRate, fftSize, count, fmin = 80, fmax = 8000) {
    const binHz = sampleRate / fftSize;
    const out = new Array(count).fill(0);
    const ratio = Math.log(fmax / fmin);
    for (let b = 0; b < count; b++) {
      const f0 = fmin * Math.exp((ratio * b) / count), f1 = fmin * Math.exp((ratio * (b + 1)) / count);
      const i0 = Math.max(1, Math.floor(f0 / binHz)), i1 = Math.min(frequency.length - 1, Math.max(i0, Math.ceil(f1 / binHz)));
      let peak = -160;
      for (let i = i0; i <= i1; i++) peak = Math.max(peak, finite(frequency[i]));
      out[b] = Math.min(1, Math.max(0, (peak + 100) / 80));
    }
    return out;
  }

  return { spectralFeatures, AcousticTracker, logBars };
});


/* ==== js/24-geo.js ==== */
/* Calculs de position : distance, cap, formats de coordonnées, cap de la boussole d'après les capteurs d'orientation.
 * Aucune dépendance au DOM : testé sous Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./00-util.js'));
  else root.VaultGeo = factory(root.VaultUtil);
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  const EARTH = 6371008.8;                                  // rayon moyen de la Terre (m)
  const rad = d => (d * Math.PI) / 180;
  const deg = r => (r * 180) / Math.PI;
  const norm = d => ((d % 360) + 360) % 360;

  /** Distance en mètres entre deux points { lat, lon } (formule de haversine). */
  function distance(a, b) {
    const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  /** Cap initial de a vers b, en degrés (0 = nord géographique, sens horaire). */
  function bearing(a, b) {
    const dLon = rad(b.lon - a.lon);
    const y = Math.sin(dLon) * Math.cos(rad(b.lat));
    const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
    return norm(deg(Math.atan2(y, x)));
  }

  const WINDS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  /** Point cardinal en français (O = ouest) pour un cap en degrés. */
  const cardinal = d => WINDS[Math.round(norm(d) / 22.5) % 16];

  /** Distance lisible : « 85 m », « 1,2 km ». */
  function formatDistance(m) {
    if (!Number.isFinite(m)) return '—';
    if (m < 100) return U.fmtInt(Math.max(0, m)) + ' m';
    const tens = Math.round(m / 10) * 10;
    if (tens < 1000) return U.fmtInt(tens) + ' m';
    return U.fmt(Math.round(m / 100) / 10, 1) + ' km';
  }

  const axis = (value, pos, neg) => (value >= 0 ? pos : neg);
  /** Degrés décimaux : « 48,85660° N ». */
  const formatDD = (value, pos, neg) => Math.abs(value).toFixed(5).replace('.', ',') + '° ' + axis(value, pos, neg);
  /** Degrés, minutes, secondes : « 48° 51′ 23,8″ N ». */
  function formatDMS(value, pos, neg) {
    const v = Math.abs(value);
    let d = Math.floor(v);
    let m = Math.floor((v - d) * 60);
    let s = Math.round(((v - d) * 60 - m) * 600) / 10;
    if (s >= 60) { s = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    return d + '° ' + String(m).padStart(2, '0') + '′ ' + s.toFixed(1).replace('.', ',') + '″ ' + axis(value, pos, neg);
  }
  const latDD = lat => formatDD(lat, 'N', 'S');
  const lonDD = lon => formatDD(lon, 'E', 'O');
  const latDMS = lat => formatDMS(lat, 'N', 'S');
  const lonDMS = lon => formatDMS(lon, 'E', 'O');
  /** Coordonnées en texte brut avec point décimal, à coller dans un SMS ou une carte : « 48.85660, 2.35220 ». */
  const plain = (lat, lon) => lat.toFixed(5) + ', ' + lon.toFixed(5);
  /** Lien de carte (utile à quelqu'un qui a du réseau). */
  const mapLink = (lat, lon) => 'https://www.openstreetmap.org/?mlat=' + lat.toFixed(5) + '&mlon=' + lon.toFixed(5) + '#map=17/' + lat.toFixed(5) + '/' + lon.toFixed(5);

  /**
   * Cap de la boussole (0 à 360, par rapport au nord magnétique) d'après alpha, bêta, gamma d'un événement d'orientation
   * absolu. Téléphone plutôt à plat : on suit le haut du téléphone ; plutôt à la verticale : on suit la direction de
   * l'arrière (là où pointe l'appareil photo). Les deux se rejoignent quand on incline le téléphone.
   */
  function compassHeading(alpha, beta, gamma) {
    const a = rad(alpha), b = rad(beta), g = rad(gamma);
    let east, north;
    if (Math.abs(Math.cos(b) * Math.cos(g)) > 0.7) {
      east = -Math.sin(a) * Math.cos(b);
      north = Math.cos(a) * Math.cos(b);
    } else {
      east = -Math.cos(a) * Math.sin(g) - Math.sin(a) * Math.sin(b) * Math.cos(g);
      north = -Math.sin(a) * Math.sin(g) + Math.cos(a) * Math.sin(b) * Math.cos(g);
    }
    return norm(deg(Math.atan2(east, north)));
  }
  /** Écart angulaire signé le plus court de `from` vers `to`, entre -180 et 180. */
  const delta = (from, to) => ((to - from + 540) % 360) - 180;
  /** Lissage d'un cap : avance de `k` vers la nouvelle valeur par le plus court chemin. */
  const smooth = (current, next, k) => (current === null ? norm(next) : norm(current + delta(current, next) * k));

  return { distance, bearing, cardinal, formatDistance, latDD, lonDD, latDMS, lonDMS, plain, mapLink, compassHeading, delta, smooth, norm };
});


/* ==== js/25-detect.js ==== */
/* Détecteurs de signal pour la réception du Morse : un bip dans le spectre du microphone, un flash dans la luminosité de la caméra.
 * Fonctions pures (sans micro ni caméra) : les capteurs leur donnent des mesures, elles répondent « allumé » ou « éteint ».
 * Le seuil automatique suit le bruit ambiant sur 4 secondes et ne se fige jamais ; sans écart net, rien n'est détecté. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VaultDetect = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WINDOW_MS = 4000;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  /** Fenêtre glissante de mesures : renvoie le bruit de fond (centile bas) et le niveau fort (maximum) des dernières secondes. */
  class Recent {
    constructor(spanMs = WINDOW_MS) { this.span = spanMs; this.items = []; }
    push(now, value) {
      this.items.push([now, value]);
      while (this.items.length && now - this.items[0][0] > this.span) this.items.shift();
    }
    range(lowQuantile = 0.2) {
      const v = this.items.map(x => x[1]).sort((a, b) => a - b);
      return { lo: v[Math.floor(v.length * lowQuantile)], hi: v[v.length - 1] };
    }
  }

  /**
   * Détecteur de bip. options : { freq (Hz), autoFreq, autoThreshold, threshold (dBFS) }.
   * update(spectre en dB, fréquence d'échantillonnage, taille de FFT, instant en ms) → { detected, hz, toneDb, sideDb, threshold, level }.
   * Un bip doit dépasser le seuil et ressortir d'au moins 6 dB par rapport au bruit voisin (+/- 350 Hz).
   */
  class ToneDetector {
    constructor(options = {}) { this.options = options; this.detected = false; this.recent = new Recent(); }
    reset() { this.detected = false; this.auto = undefined; this.recent = new Recent(); }
    update(frequency, sampleRate, fftSize, now) {
      const o = this.options;
      const binHz = sampleRate / fftSize;
      let hz = o.freq || 700;
      if (o.autoFreq) {
        let loudest = -Infinity;
        for (let i = Math.ceil(200 / binHz); i < Math.min(frequency.length, Math.floor(3000 / binHz)); i++) {
          if (frequency[i] > loudest) { loudest = frequency[i]; hz = i * binHz; }
        }
      }
      let toneDb = -160, sideSum = 0, sideCount = 0;
      for (let i = Math.max(1, Math.floor((hz - 350) / binHz)); i <= Math.min(frequency.length - 1, Math.ceil((hz + 350) / binHz)); i++) {
        if (Math.abs(i * binHz - hz) <= 80) toneDb = Math.max(toneDb, frequency[i]);
        else { sideSum += 10 ** (frequency[i] / 10); sideCount++; }
      }
      const sideDb = 10 * Math.log10(Math.max(sideSum / Math.max(sideCount, 1), 1e-16));
      let threshold = o.threshold;
      if (o.autoThreshold) {
        // Seuil au milieu entre le bruit de fond (5e centile) et le niveau le plus fort des 4 dernières secondes ; il suit le bruit
        // ambiant. Il n'est recalculé que hors d'un bip : un trait très long ne doit pas effacer l'écart qui le fait voir.
        this.recent.push(now, toneDb);
        if (!this.detected || this.auto === undefined) {
          const { lo, hi } = this.recent.range(0.05);
          this.auto = hi - lo >= 12 ? (lo + hi) / 2 : Infinity;
        }
        threshold = this.auto;
      }
      this.detected = toneDb > (this.detected ? threshold - 3 : threshold) && toneDb - sideDb > 6;
      return { detected: this.detected, hz, toneDb, sideDb, threshold, level: clamp((toneDb + 80) / 0.8, 0, 100) };
    }
  }

  /**
   * Détecteur de flash : luminosité moyenne (0 à 100) du centre de l'image. Sans contraste net (moins de 10 points sur 4 secondes),
   * rien n'est détecté. options : { autoThreshold, threshold (0 à 100) }.
   */
  class LightDetector {
    constructor(options = {}) { this.options = options; this.detected = false; this.recent = new Recent(); }
    reset() { this.detected = false; this.auto = undefined; this.recent = new Recent(); }
    update(brightness, now) {
      const o = this.options;
      let threshold = o.threshold;
      if (o.autoThreshold) {
        this.recent.push(now, brightness);
        if (!this.detected || this.auto === undefined) {         // recalculé hors flash seulement : un flash très long garde son seuil
          const { lo, hi } = this.recent.range(0);
          this.auto = hi - lo >= 10 ? (lo + hi) / 2 : 101;
        }
        threshold = this.auto;
      }
      const margin = o.autoThreshold ? 3 : 5;
      this.detected = brightness > (this.detected ? threshold - margin : threshold);
      return { detected: this.detected, threshold, level: clamp(brightness, 0, 100) };
    }
  }

  return { Recent, ToneDetector, LightDetector };
});


/* ==== js/30-ui.js ==== */
/* Interface commune : objet Vault, routeur par adresse (#/accueil…), notifications, fenêtres (feuilles), anneau d'autonomie,
 * apparence (thème, Low Profile, taille du texte). Aucune vue ici : chaque écran s'enregistre dans 5x-view-*.js. */
const Vault = {
  version: '2.0.0',
  build: '550a6562e6',
  store: null,
  views: {},
  order: [],
  today: () => VaultUtil.isoDate(),
  online: () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false),
  /** Enregistre un écran : { id, title, tab, mount(el), enter(parts), leave(), update(state, what) }. */
  registerView(def) { this.views[def.id] = def; this.order.push(def.id); },
  /** Constructeurs de pages imprimables (numéros, fiche, plan, guides) : chaque écran enregistre les siens, le dossier papier les assemble. */
  paper: {},
};

const VaultUI = (() => {
  const U = VaultUtil;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const icon = (name, cls) => VaultIcons.svg(name, cls);
  const esc = U.esc;
  /** Écoute déléguée : handler(event, élément correspondant au sélecteur). */
  function on(root, type, selector, handler) {
    root.addEventListener(type, e => {
      const t = e.target instanceof Element ? e.target.closest(selector) : null;
      if (t && root.contains(t)) handler(e, t);
    });
  }
  const prefs = () => (Vault.store ? Vault.store.get().prefs : { theme: 'auto', night: false, textScale: 100, haptics: true });
  function haptic(ms) {
    if (!prefs().haptics) return;
    try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (_) { /* non pris en charge */ }
  }

  // ------------------------------------------------------------------ apparence
  const THEME_COLORS = { dark: '#070a08', light: '#f1f4f1', night: '#050000' };
  function applyAppearance() {
    const s = Vault.store.get();
    const root = document.documentElement;
    const p = s.prefs;
    let theme = p.night ? 'night' : p.theme;                   // 'auto' : pas d'attribut, la feuille de style suit le téléphone
    if (theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme);
    if (s.lowProfile) root.setAttribute('data-low', '1'); else root.removeAttribute('data-low');
    root.style.setProperty('--ts', String(p.textScale / 100));
    if (p.textScale >= 115) root.setAttribute('data-bigtext', '1'); else root.removeAttribute('data-bigtext');
    let effective = theme;
    if (theme === 'auto') effective = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[effective] || THEME_COLORS.dark);
    const low = $('#btn-low');
    if (low) { low.setAttribute('aria-pressed', String(!!s.lowProfile)); low.setAttribute('title', s.lowProfile ? 'Désactiver Low Profile' : 'Activer Low Profile'); }
  }

  // ------------------------------------------------------------------ notifications
  function toast(message, opts = {}) {
    const host = $('#toasts');
    if (!host) return null;
    const el = document.createElement('div');
    el.className = 'toast' + (opts.tone ? ' toast-' + opts.tone : '');
    const ic = opts.icon || (opts.tone === 'danger' ? 'octagon-alert' : opts.tone === 'warn' ? 'triangle-alert' : opts.tone === 'ok' ? 'circle-check' : 'info');
    el.innerHTML = icon(ic) + '<span>' + esc(message) + '</span>';
    let timer = null;
    const remove = () => { clearTimeout(timer); if (el.parentNode) el.remove(); };
    if (opts.action) {
      const b = document.createElement('button');
      b.className = 'btn btn-sm btn-soft'; b.type = 'button'; b.textContent = opts.action.label;
      b.addEventListener('click', () => { remove(); opts.action.onClick(); });
      el.appendChild(b);
    }
    host.appendChild(el);
    while (host.children.length > 3) host.firstElementChild.remove();
    timer = setTimeout(remove, opts.duration || (opts.action ? 9000 : 3400));
    return { remove };
  }

  // ------------------------------------------------------------------ feuilles (fenêtres modales)
  let openSheets = 0;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  /**
   * sheet({ title, body, actions:[{label, kind, onClick}], onOpen(root), onClose(), wide })
   * `body` : texte HTML ou nœud. Un `onClick` qui renvoie false laisse la feuille ouverte.
   */
  function sheet(opts) {
    const previous = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const titleId = 'sheet-title-' + Math.random().toString(36).slice(2, 8);
    overlay.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '"><div class="sheet-handle" aria-hidden="true"></div>' +
      '<div class="sheet-head"><h2 id="' + titleId + '">' + esc(opts.title || '') + '</h2><button type="button" class="icon-btn" data-close aria-label="Fermer">' + icon('x') + '</button></div>' +
      '<div class="sheet-body"></div>' + (opts.actions && opts.actions.length ? '<div class="sheet-foot"></div>' : '') + '</div>';
    const panel = $('.sheet', overlay);
    const body = $('.sheet-body', overlay);
    if (typeof opts.body === 'string') body.innerHTML = opts.body; else if (opts.body) body.appendChild(opts.body);
    let closed = false;
    const ctl = {
      el: overlay, body,
      close(result) {
        if (closed) return;
        closed = true;
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        openSheets = Math.max(0, openSheets - 1);
        if (!openSheets) document.documentElement.style.overflow = '';
        if (opts.onClose) opts.onClose(result);
        if (previous && previous.focus && document.contains(previous)) { try { previous.focus({ preventScroll: true }); } catch (_) { /* élément disparu */ } }
      },
    };
    (opts.actions || []).forEach(a => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ' + (a.kind === 'primary' ? 'btn-primary' : a.kind === 'danger' ? 'btn-solid-danger' : 'btn-ghost'); b.textContent = a.label;
      if (a.id) b.id = a.id;
      b.addEventListener('click', async () => { const r = a.onClick ? await a.onClick(ctl) : undefined; if (r !== false) ctl.close(a.value); });
      $('.sheet-foot', overlay).appendChild(b);
    });
    function onKey(e) {
      if (e.key === 'Escape' && opts.dismissible !== false) { e.stopPropagation(); ctl.close('escape'); return; }
      if (e.key !== 'Tab') return;
      const items = $$(FOCUSABLE, panel).filter(x => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active) || active === panel) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }   // focus sur le cadre ou perdu : on rentre dans la feuille
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('mousedown', e => { if (e.target === overlay && opts.dismissible !== false) ctl.close('backdrop'); });
    on(overlay, 'click', '[data-close]', () => ctl.close('close'));
    document.body.appendChild(overlay);
    openSheets++;
    document.documentElement.style.overflow = 'hidden';
    if (opts.onOpen) opts.onOpen(ctl);
    // Focus initial : sur téléphone, le cadre lui-même (le clavier ne se lève pas tout seul) ; sinon le premier champ visible.
    // Confirmation destructive : le bouton « Annuler », pour qu'un Entrée distrait ne supprime rien.
    panel.setAttribute('tabindex', '-1');
    const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const firstField = $$('input:not([type=hidden]),select,textarea', body).find(x => x.offsetParent !== null);
    const safeButton = opts.focus === 'cancel' ? $('.sheet-foot .btn', overlay) : null;
    const target = safeButton || (coarse ? panel : (firstField || $('.sheet-foot .btn-primary,.sheet-foot .btn-solid-danger', overlay) || $('[data-close]', overlay) || panel));
    if (opts.focus !== false && target) target.focus({ preventScroll: true });
    return ctl;
  }
  /** Confirmation : renvoie une promesse (true si confirmé). */
  function confirm(opts) {
    return new Promise(resolve => {
      sheet({
        title: opts.title, body: '<p class="muted">' + esc(opts.text || '') + '</p>', dismissible: true, focus: opts.danger ? 'cancel' : undefined,
        actions: [{ label: opts.cancelLabel || 'Annuler', value: false }, { label: opts.confirmLabel || 'Confirmer', kind: opts.danger ? 'danger' : 'primary', value: true }],
        onClose: r => resolve(r === true),
      });
    });
  }

  /** Ligne d'état annoncée aux lecteurs d'écran (role="status" sur l'élément). tone : info | ok | warn. */
  function setStatus(el, message, tone) {
    if (!el) return;
    el.textContent = message || '';
    el.dataset.tone = tone || 'info';
    el.hidden = !message;
  }

  // ------------------------------------------------------------------ anneau d'autonomie
  const RING_RADII = [98, 78, 58];
  /** `kinds` : trois classes d'arc (de l'extérieur vers l'intérieur), par exemple ['water', 'food', 'energy']. */
  function ringSvg(kinds, label) {
    const arcs = RING_RADII.map((r, i) => {
      const c = 2 * Math.PI * r;
      return '<circle class="ring-track" cx="120" cy="120" r="' + r + '" stroke-width="14"/>' +
        '<circle class="ring-arc arc-' + kinds[i] + '" data-arc="' + i + '" cx="120" cy="120" r="' + r + '" stroke-width="14" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + c.toFixed(2) + '"/>';
    }).join('');
    return '<svg viewBox="0 0 240 240" role="img" aria-label="' + esc(label || '') + '">' + arcs + '</svg>';
  }
  /** Met à jour les arcs (ratios 0 à 1) ; l'animation CSS fait le reste. */
  function ringSet(root, ratios) {
    $$('[data-arc]', root).forEach((arc, i) => {
      const c = 2 * Math.PI * RING_RADII[i];
      arc.style.strokeDashoffset = String((c * (1 - U.clamp(ratios[i] || 0, 0, 1))).toFixed(2));
    });
  }

  // ------------------------------------------------------------------ routeur
  const Router = (() => {
    let currentId = null;
    const mounted = new Set();
    const parse = hash => {
      const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map(p => { try { return decodeURIComponent(p); } catch (_) { return p; } });
      return parts.length ? parts : ['home'];
    };
    function go(path, opts) {
      const target = '#/' + path;
      if (location.hash === target) { render(); return; }
      if (opts && opts.replace) location.replace(target); else location.hash = target;
    }
    function render() {
      const parts = parse(location.hash);
      const id = Vault.views[parts[0]] ? parts[0] : 'home';
      const view = Vault.views[id];
      const main = $('#main');
      if (currentId && currentId !== id && Vault.views[currentId].leave) { try { Vault.views[currentId].leave(); } catch (e) { console.error(e); } }
      $$('.view', main).forEach(v => { const on = v.dataset.view === id; v.classList.toggle('active', on); v.hidden = !on; });
      const section = $('#view-' + id);
      if (!mounted.has(id)) { mounted.add(id); if (view.mount) view.mount(section); }
      $$('.tab').forEach(t => { const active = t.dataset.route === (view.tab || id); if (active) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
      document.title = (view.title ? view.title + ' — ' : '') + 'VAULT';
      const changedView = currentId !== id;
      currentId = id;
      if (view.enter) view.enter(parts.slice(1));
      if (view.update) view.update(Vault.store.get(), 'enter');
      if (changedView) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    }
    function start() {
      window.addEventListener('hashchange', render);
      render();
    }
    return { go, render, start, parse, current: () => currentId, parts: () => parse(location.hash) };
  })();

  return { $, $$, icon, esc, on, haptic, toast, sheet, confirm, setStatus, ringSvg, ringSet, applyAppearance, Router };
})();

/** Actions partagées entre plusieurs écrans. */
Vault.actions = {
  /** Coche ou décoche un élément du kit (élément de base, compléments ou élément personnel). */
  toggleKit(id, done) {
    Vault.store.update(s => {
      if (/^c-/.test(id)) { const c = s.customKit.find(x => x.id === id); if (c) c.done = !!done; } else s.checklist[id] = !!done;
    }, 'kit');
    VaultUI.haptic(8);
  },
  /** Note qu'un contrôle périodique vient d'être fait. */
  markCheck(id) {
    Vault.store.update(s => { s.checks[id] = Vault.today(); }, 'checks');
    VaultUI.haptic(10);
  },
  /** Copie un texte dans le presse-papiers (avec repli pour les navigateurs sans l'API moderne). */
  async copy(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
    } catch (_) { /* repli ci-dessous */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr-only';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    ta.remove();
    return ok;
  },
  /** Partage via la feuille de partage du système, sinon copie. */
  async share(title, text) {
    if (navigator.share) { try { await navigator.share({ title, text }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; } }
    return (await this.copy(text)) ? 'copied' : 'failed';
  },
  /** Imprime un contenu HTML dans une zone dédiée (le reste de l'application est masqué par la feuille de style d'impression). */
  print(html) {
    let area = document.getElementById('print-area');
    if (!area) { area = document.createElement('div'); area.id = 'print-area'; document.body.appendChild(area); }
    area.innerHTML = html;
    document.body.classList.add('printing');
    const done = () => { document.body.classList.remove('printing'); area.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(() => window.print(), 60);
  },
};


/* ==== js/40-torch.js ==== */
/* Lampe du téléphone : commandée par la contrainte « torch » d'une piste de la caméra arrière. Aucune image n'est
 * enregistrée ni envoyée : la piste vidéo ne sert qu'à commander la lampe. Chaque session est protégée contre les
 * commandes tardives (jeton de génération), les lenteurs et les blocages ; la lampe est éteinte et la caméra libérée
 * dans tous les cas de sortie. Un essai sur deux téléphones réels reste nécessaire pour valider les flashs. */
const VaultTorch = (() => {
  const compatible = caps => !!caps && (caps.torch === true || (Array.isArray(caps.torch) && caps.torch.includes(true) && caps.torch.includes(false)));

  function errorMessage(error) {
    const n = error && error.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') return 'Accès caméra refusé. Autorise la caméra dans ton navigateur pour commander la lampe, puis réessaie.';
    if (n === 'NotFoundError') return 'Aucune caméra disponible. La lampe ne peut pas être commandée sur cet appareil.';
    if (n === 'NotReadableError') return 'Caméra occupée ou indisponible. Ferme l’autre application qui l’utilise puis réessaie.';
    if (n === 'TorchUnsupported') return 'Torche indisponible pour cette caméra ou ce navigateur. Essaie une autre caméra de la liste, ou un navigateur à jour. Le son et la vibration restent utilisables.';
    if (n === 'TorchSlow') return 'Commande de lampe trop lente pour cette vitesse. Augmente la durée du point, vérifie la lampe, puis réessaie.';
    if (n === 'TorchTimeout') return 'La lampe ne répond pas. Émission interrompue et caméra libérée. Vérifie la lampe puis réessaie.';
    return 'Impossible de commander la lampe. Vérifie les autorisations et la compatibilité de ton téléphone. Aucun signal n’a été remplacé par un flash de l’écran.';
  }
  const named = name => Object.assign(new Error(name), { name });

  /**
   * hooks : { status(message, tone), changed({ ready, busy, active }), video (élément <video> masqué),
   *           cameras([{ id, label }]), device() → identifiant choisi, beforeStart() }
   */
  function create(hooks = {}) {
    let session = null;
    let generation = 0;
    const status = (message, tone) => { if (hooks.status) hooks.status(message, tone || 'info'); };
    const info = () => ({ ready: !!(session && session.ready && !session.released), busy: !!(session && session.busy), active: !!session });
    const changed = () => { if (hooks.changed) hooks.changed(info()); };
    const current = (s, token) => session === s && generation === token && !s.released;

    function release(s) {
      if (!s || s.released) return;
      s.released = true;
      clearTimeout(s.timer);
      if (s.wake) s.wake(false);
      s.wake = null;
      if (s.cancel) s.cancel();
      s.cancel = null;
      // Demande l'obscurité et arrête les pistes tout de suite, même si une commande d'allumage est encore en cours.
      if (s.track && s.track.readyState !== 'ended' && s.track.applyConstraints) {
        try { Promise.resolve(s.track.applyConstraints({ advanced: [{ torch: false }] })).catch(() => {}); } catch (_) { /* déjà arrêtée */ }
      }
      if (s.stream) s.stream.getTracks().forEach(track => track.stop());
      const v = hooks.video;
      if (v && s.stream && v.srcObject === s.stream) { v.pause(); v.srcObject = null; }
      if (s.lock) Promise.resolve(s.lock.release()).catch(() => {});
    }
    function stop(message) {
      generation++;
      const previous = session;
      session = null;
      release(previous);
      changed();
      if (previous) status(message || 'Lampe arrêtée. Caméra libérée.');
    }
    async function command(s, on, token) {
      if (!current(s, token)) return false;
      let guard;
      try {
        await Promise.race([
          s.track.applyConstraints({ advanced: [{ torch: on }] }),
          new Promise((_, reject) => { guard = setTimeout(() => reject(named('TorchTimeout')), 1500); }),
          new Promise(resolve => { s.cancel = resolve; }),
        ]);
        return current(s, token);
      } finally { clearTimeout(guard); s.cancel = null; }
    }
    function wait(s, ms, token) {
      if (!current(s, token)) return Promise.resolve(false);
      return new Promise(resolve => {
        s.wake = resolve;
        s.timer = setTimeout(() => { s.wake = null; resolve(current(s, token)); }, Math.max(0, ms));
      });
    }
    async function listCameras(s, token) {
      if (!navigator.mediaDevices.enumerateDevices) return;
      try {
        const devices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
        if (!current(s, token)) return;
        if (hooks.cameras) hooks.cameras(devices.map((d, i) => ({ id: d.deviceId, label: d.label || 'Caméra ' + (i + 1) })));
      } catch (_) { /* l'énumération est facultative : elle ne doit jamais bloquer une lampe qui fonctionne */ }
    }

    /** Vérifie la lampe : demande la caméra arrière, contrôle que la torche est commandable, puis éteint. */
    async function prepare() {
      if (session && session.busy) return false;
      if (hooks.beforeStart) hooks.beforeStart();
      stop();
      if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status('Ce navigateur ne permet pas l’accès nécessaire à la lampe. Ouvre VAULT en HTTPS dans un navigateur compatible sur ton téléphone. Le son et la vibration restent utilisables.', 'warn');
        return false;
      }
      const token = generation;
      const s = { busy: true, ready: false, stream: null, track: null, timer: null, wake: null, cancel: null, released: false, lock: null };
      session = s;
      changed();
      status('Autorise la caméra pour vérifier la torche…');
      try {
        const device = hooks.device ? hooks.device() : '';
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: device ? { deviceId: { exact: device } } : { facingMode: { ideal: 'environment' } } });
        if (!current(s, token)) { stream.getTracks().forEach(track => track.stop()); return false; }
        s.stream = stream;
        s.track = stream.getVideoTracks()[0];
        if (!s.track) throw named('NotFoundError');
        s.track.addEventListener('ended', () => { if (current(s, token)) stop('Caméra déconnectée. Lampe arrêtée.'); });
        s.track.addEventListener('mute', () => { if (current(s, token)) stop('Caméra interrompue par le téléphone. Lampe arrêtée.'); });
        await listCameras(s, token);
        if (!current(s, token)) return false;
        if (!s.track.applyConstraints || !compatible(s.track.getCapabilities && s.track.getCapabilities())) throw named('TorchUnsupported');
        if (hooks.video) { hooks.video.srcObject = stream; await hooks.video.play(); }
        if (!current(s, token)) return false;
        if (!await command(s, false, token)) return false;
        s.ready = true; s.busy = false;
        changed();
        status('Commande de torche disponible. Teste la lampe avant d’envoyer ton message.', 'ok');
        return true;
      } catch (error) {
        if (current(s, token)) { stop(); status(errorMessage(error), 'warn'); }
        return false;
      }
    }

    /**
     * Joue une séquence [{ on, ms }]. options : unit (durée d'un point, pour détecter une lampe trop lente),
     * repeat, test (essai d'une seconde : la lampe reste prête ensuite), onProgress.
     * Renvoie true si la séquence est allée au bout.
     */
    async function run(timeline, options = {}) {
      const s = session;
      if (!s || !s.ready || s.busy) return false;
      const token = generation;
      s.busy = true;
      changed();
      status(options.test ? 'Test de la lampe pendant une seconde…' : 'Émission avec la lampe en cours…');
      try {
        if (navigator.wakeLock && navigator.wakeLock.request) {
          try {
            const lock = await navigator.wakeLock.request('screen');
            if (!current(s, token)) { await lock.release(); return false; }
            s.lock = lock;
          } catch (_) { /* l'instruction « garde le téléphone déverrouillé » reste affichée */ }
        }
        do {
          for (const segment of timeline) {
            const started = performance.now();
            if (!await command(s, !!segment.on, token)) return false;
            const latency = performance.now() - started;
            if (!options.test && options.unit && latency > options.unit * 0.6) throw named('TorchSlow');
            if (!await wait(s, segment.ms - latency, token)) return false;
          }
          if (!await command(s, false, token)) return false;
          if (options.repeat && !await wait(s, 7 * (options.unit || 300), token)) return false;
        } while (options.repeat && current(s, token));
        if (options.test) {
          if (s.lock) { await s.lock.release(); s.lock = null; }
          if (!current(s, token)) return false;
          s.busy = false;
          changed();
          status('Test terminé, lampe éteinte. Vérifie qu’elle s’est allumée. La caméra reste prête ; touche Arrêter pour la libérer.', 'ok');
        } else stop('Message terminé. Lampe arrêtée et caméra libérée.');
        return true;
      } catch (error) {
        if (current(s, token)) { stop(); status(errorMessage(error), 'warn'); }
        return false;
      }
    }

    return { prepare, run, stop, info };
  }

  return { create, compatible, errorMessage };
})();


/* ==== js/41-audio-tx.js ==== */
/* Émission : son (WebAudio, programmé sur l'horloge audio), vibration, et coordination avec la lampe ; alarme sonore.
 * Le son et la vibration marchent sans caméra : ils complètent la lampe, qui n'existe pas sur tous les navigateurs. */
const VaultTx = (() => {
  const M = VaultMorse;
  const AudioCtor = () => (typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null);
  const supports = () => ({
    sound: !!AudioCtor(),
    vibrate: typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function',
    wakeLock: typeof navigator !== 'undefined' && !!navigator.wakeLock,
  });

  /** Oscillateur unique dont le volume est programmé : chaque signal = un palier avec de courtes rampes (pas de claquements). */
  class Beeper {
    constructor() { this.ctx = null; this.osc = null; this.gain = null; }
    async ensure() {
      const AC = AudioCtor();
      if (!AC) throw new Error('Audio non disponible');
      if (!this.ctx) this.ctx = new AC();
      if (this.ctx.state !== 'running') await this.ctx.resume();
      if (!this.osc) {
        this.osc = this.ctx.createOscillator();
        this.osc.type = 'sine';
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0;
        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.osc.start();
      }
    }
    setFrequency(hz) { if (this.osc) this.osc.frequency.setValueAtTime(hz, this.ctx.currentTime); }
    now() { return this.ctx ? this.ctx.currentTime : 0; }
    /** Programme `timeline` à partir de l'instant audio `at` (secondes). Renvoie l'instant de fin. */
    schedule(timeline, at, volume) {
      const g = this.gain.gain;
      let t = at;
      timeline.forEach(seg => {
        const d = seg.ms / 1000;
        if (seg.on) {
          const ramp = Math.min(0.006, d / 4);
          g.setValueAtTime(0, t);
          g.linearRampToValueAtTime(volume, t + ramp);
          g.setValueAtTime(volume, t + d - ramp);
          g.linearRampToValueAtTime(0, t + d);
        }
        t += d;
      });
      return t;
    }
    silence() { if (this.gain && this.ctx) { const g = this.gain.gain; g.cancelScheduledValues(0); g.setValueAtTime(0, this.ctx.currentTime); } }
    close() {
      try { if (this.osc) this.osc.stop(); } catch (_) { /* déjà arrêté */ }
      try { if (this.ctx) this.ctx.close(); } catch (_) { /* déjà fermé */ }
      this.ctx = null; this.osc = null; this.gain = null;
    }
  }

  /**
   * Émetteur Morse. hooks : { torch (contrôleur VaultTorch ou null), progress({ on, letter, ratio, cycles, elapsed }), ended(reason), status(message, tone) }
   * play({ text, unit, repeat, torch, sound, vibrate, freq, volume }) : à appeler depuis un geste de l'utilisateur.
   */
  function createTransmitter(hooks = {}) {
    const beeper = new Beeper();
    let run = null;
    let seq = 0;
    const status = (m, t) => { if (hooks.status) hooks.status(m, t || 'info'); };

    function cleanup(r, stopTorch) {
      cancelAnimationFrame(r.raf);
      r.timers.forEach(clearTimeout);
      clearInterval(r.pump);
      beeper.silence();
      beeper.close();
      if (supports().vibrate) { try { navigator.vibrate(0); } catch (_) { /* ignoré */ } }
      if (r.lock) { Promise.resolve(r.lock.release()).catch(() => {}); r.lock = null; }
      if (stopTorch && r.opts.torch && hooks.torch) hooks.torch.stop();
    }
    function finish(r, reason) {
      if (run !== r) return;
      run = null;
      cleanup(r, reason !== 'done');
      if (hooks.ended) hooks.ended(reason);
    }
    function stop(reason) { if (run) finish(run, reason || 'stopped'); }

    async function play(opts) {
      stop('restart');
      const enc = M.encode(opts.text);
      if (!enc.morse) { status('Saisis un message avec des lettres ou des chiffres.', 'warn'); return false; }
      const tl = M.timeline(enc.morse, opts.unit);
      const spans = M.spans(opts.text, opts.unit);
      const total = M.duration(tl);
      const cycle = total + (opts.repeat ? 7 * opts.unit : 0);
      const r = { id: ++seq, tl, spans, total, cycle, opts, raf: 0, timers: [], pump: 0, t0: 0, lock: null };
      run = r;
      const sup = supports();
      const channels = { sound: false, vibrate: false, torch: false };
      if (opts.sound && sup.sound) {
        try { await beeper.ensure(); beeper.setFrequency(opts.freq || 700); channels.sound = true; }
        catch (_) { status('Le son n’a pas pu démarrer sur ce navigateur.', 'warn'); }
      }
      if (run !== r) return false;
      if (opts.vibrate && sup.vibrate) channels.vibrate = true;
      if (opts.torch && hooks.torch && hooks.torch.info().ready) channels.torch = true;
      if (!channels.sound && !channels.vibrate && !channels.torch) {
        run = null; cleanup(r, false);
        status('Aucun moyen d’émission disponible : vérifie la lampe, ou active le son ou la vibration.', 'warn');
        if (hooks.ended) hooks.ended('nochannel');
        return false;
      }
      if (sup.wakeLock) { try { r.lock = await navigator.wakeLock.request('screen'); } catch (_) { /* facultatif */ } }
      if (run !== r) { cleanup(r, false); return false; }

      const lead = 180;
      r.t0 = performance.now() + lead;
      if (channels.sound) {
        const volume = Math.min(1, Math.max(0.05, (opts.volume == null ? 0.8 : opts.volume)));
        let next = beeper.now() + lead / 1000;
        const horizon = () => { while (run === r && next - beeper.now() < 2.5) { next = beeper.schedule(tl, next, volume) + (opts.repeat ? 7 * opts.unit / 1000 : 0); if (!opts.repeat) break; } };
        horizon();
        if (opts.repeat) r.pump = setInterval(horizon, 400);
      }
      if (channels.vibrate) {
        const pattern = M.vibrationPattern(tl).concat(opts.repeat ? [7 * opts.unit] : []);
        const fire = k => {
          if (run !== r) return;
          try { navigator.vibrate(pattern); } catch (_) { /* ignoré */ }
          if (opts.repeat) r.timers.push(setTimeout(() => fire(k + 1), Math.max(0, r.t0 + (k + 1) * cycle - performance.now())));
        };
        r.timers.push(setTimeout(() => fire(0), lead));
      }
      if (channels.torch) r.timers.push(setTimeout(() => { if (run === r) hooks.torch.run(tl, { unit: opts.unit, repeat: opts.repeat }); }, lead));

      const tick = () => {
        if (run !== r) return;
        const elapsed = performance.now() - r.t0;
        if (elapsed < 0) { r.raf = requestAnimationFrame(tick); return; }
        let pos = elapsed;
        let cycles = 0;
        if (opts.repeat) { cycles = Math.floor(elapsed / cycle); pos = elapsed - cycles * cycle; }
        else if (elapsed >= total + 120) { finish(r, 'done'); return; }
        let acc = 0, on = false;
        for (let i = 0; i < tl.length; i++) { if (pos < acc + tl[i].ms) { on = tl[i].on; break; } acc += tl[i].ms; }
        let letter = -1;
        for (let i = 0; i < spans.length; i++) { if (pos >= spans[i].start && pos < spans[i].end) { letter = i; break; } }
        if (hooks.progress) hooks.progress({ on, letter, ratio: Math.min(1, pos / total), cycles, elapsed, channels });
        r.raf = requestAnimationFrame(tick);
      };
      r.raf = requestAnimationFrame(tick);
      return true;
    }
    return { play, stop, get running() { return !!run; }, supports };
  }

  /**
   * Alarme sonore pour attirer l'attention : sirène, signal de détresse de montagne (6 coups par minute, une minute de pause),
   * bip régulier. Le volume réel dépend du téléphone : le monter au maximum, ne jamais le tenir contre l'oreille.
   */
  function createAlarm(hooks = {}) {
    let ctx = null, nodes = [], pump = 0, mode = null, lock = null;
    const status = (m, t) => { if (hooks.status) hooks.status(m, t || 'info'); };
    function teardown() {
      clearInterval(pump);
      nodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch (_) { /* déjà arrêté */ } });
      nodes = [];
      try { if (ctx) ctx.close(); } catch (_) { /* déjà fermé */ }
      ctx = null;
      if (lock) { Promise.resolve(lock.release()).catch(() => {}); lock = null; }
    }
    function stop() { if (mode) { mode = null; teardown(); if (hooks.changed) hooks.changed(null); } }
    async function start(kind, options = {}) {
      stop();
      const AC = AudioCtor();
      if (!AC) { status('Le son n’est pas disponible sur ce navigateur.', 'warn'); return false; }
      ctx = new AC();
      try { await ctx.resume(); } catch (_) { /* démarrage refusé */ }
      if (!ctx) return false;
      mode = kind;
      const volume = Math.min(1, Math.max(0.05, options.volume == null ? 1 : options.volume));
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      nodes.push(master);
      const osc = ctx.createOscillator();
      osc.connect(master);
      nodes.push(osc);
      const now = ctx.currentTime;
      if (kind === 'siren') {
        osc.type = 'square';
        osc.frequency.value = 1000;
        const lfo = ctx.createOscillator(), depth = ctx.createGain();
        lfo.frequency.value = 0.9; depth.gain.value = 420;
        lfo.connect(depth); depth.connect(osc.frequency);
        lfo.start(); nodes.push(lfo, depth);
        master.gain.setValueAtTime(volume * 0.55, now);
      } else if (kind === 'whistle') {
        osc.type = 'sine';
        osc.frequency.value = 2900;
        let next = now + 0.15;
        const schedule = () => {
          while (ctx && next - ctx.currentTime < 25) {
            // une minute : six coups d'une seconde, un toutes les dix secondes ; puis une minute de pause
            for (let k = 0; k < 6; k++) {
              const t = next + k * 10;
              master.gain.setValueAtTime(0, t); master.gain.linearRampToValueAtTime(volume * 0.9, t + 0.01);
              master.gain.setValueAtTime(volume * 0.9, t + 1); master.gain.linearRampToValueAtTime(0, t + 1.02);
            }
            next += 120;
          }
        };
        schedule();
        pump = setInterval(schedule, 5000);
      } else {
        osc.type = 'sine';
        osc.frequency.value = 880;
        let next = now + 0.1;
        const schedule = () => {
          while (ctx && next - ctx.currentTime < 20) {
            master.gain.setValueAtTime(0, next); master.gain.linearRampToValueAtTime(volume * 0.8, next + 0.01);
            master.gain.setValueAtTime(volume * 0.8, next + 0.4); master.gain.linearRampToValueAtTime(0, next + 0.42);
            next += 2;
          }
        };
        schedule();
        pump = setInterval(schedule, 4000);
      }
      osc.start();
      if (supports().wakeLock) { try { lock = await navigator.wakeLock.request('screen'); } catch (_) { /* facultatif */ } }
      if (hooks.changed) hooks.changed(kind);
      return true;
    }
    return { start, stop, get mode() { return mode; } };
  }

  /** Bip d'essai de 300 ms à la fréquence donnée. */
  async function testBeep(freq) {
    const b = new Beeper();
    try {
      await b.ensure();
      b.setFrequency(freq || 700);
      b.schedule([{ on: true, ms: 300 }], b.now() + 0.05, 0.6);
      setTimeout(() => b.close(), 600);
      return true;
    } catch (_) { b.close(); return false; }
  }

  return { supports, createTransmitter, createAlarm, testBeep };
})();


/* ==== js/42-sensors.js ==== */
/* Capteurs : réception du Morse par le microphone (bips) ou la caméra (flashs), et écoute acoustique.
 * Traitement local et éphémère : rien n'est enregistré ni envoyé ; le microphone et la caméra s'arrêtent à la sortie de
 * l'écran ou quand la page est masquée. */
const VaultSensors = (() => {
  const M = VaultMorse;
  const A = VaultAcoustic;
  const D = VaultDetect;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  function sensorError(error) {
    const n = error && error.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') return 'Accès refusé. Autorise le capteur dans les réglages du navigateur, puis réessaie.';
    if (n === 'NotFoundError') return 'Aucun capteur compatible trouvé sur cet appareil.';
    if (n === 'NotReadableError') return 'Capteur indisponible : il est peut-être utilisé par une autre application.';
    return 'Impossible de démarrer ce capteur. Vérifie les autorisations et utilise HTTPS ou localhost.';
  }

  /**
   * hooks : { status(message, tone), frame(data), stopped(reason), beforeStart() }
   * start(mode, options) : mode 'audio' | 'camera' | 'acoustic'.
   *   audio    : { unit, auto, autoFreq, freq, threshold, autoThreshold }
   *   camera   : { unit, auto, threshold, autoThreshold, video }
   */
  function create(hooks = {}) {
    let generation = 0;
    let current = null;
    const decoder = new M.StreamDecoder({ unit: 300 });
    const status = (m, t) => { if (hooks.status) hooks.status(m, t || 'info'); };

    function release(session) {
      if (!session) return;
      clearTimeout(session.timer);
      cancelAnimationFrame(session.frame);
      if (session.stream) session.stream.getTracks().forEach(track => track.stop());
      if (session.source) { try { session.source.disconnect(); } catch (_) { /* déjà déconnecté */ } }
      if (session.context) session.context.close().catch(() => {});
      if (session.video) { try { session.video.pause(); } catch (_) { /* ignoré */ } session.video.srcObject = null; }
      if (session.lock) { Promise.resolve(session.lock.release()).catch(() => {}); session.lock = null; }
    }
    /** Garde l'écran allumé pendant l'écoute : sinon la mise en veille masque la page et coupe la réception. Facultatif. */
    function keepAwake(session, token) {
      if (!navigator.wakeLock || !navigator.wakeLock.request) return;
      navigator.wakeLock.request('screen').then(lock => {
        if (token !== generation || current !== session) { lock.release().catch(() => {}); return; }
        session.lock = lock;
      }).catch(() => { /* refusé : l'écran pourra se mettre en veille */ });
    }
    function stop(reason) {
      generation++;
      const previous = current;
      current = null;
      release(previous);
      if (previous) {
        if (previous.mode !== 'acoustic') decoder.finish();
        if (hooks.stopped) hooks.stopped(reason || '', previous.mode);
      }
    }
    function reset() { decoder.reset(); }

    async function start(mode, options = {}) {
      if (hooks.beforeStart) hooks.beforeStart();
      stop();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.isSecureContext) {
        status('Les capteurs nécessitent HTTPS ou localhost et un navigateur compatible.', 'warn');
        if (hooks.stopped) hooks.stopped('unsupported', mode);
        return false;
      }
      const token = generation;
      const session = { mode, stream: null, context: null, source: null, analyser: null, timer: null, frame: null, video: options.video || null };
      current = session;
      if (mode !== 'acoustic') { decoder.setUnit(options.unit || 300); decoder.setAuto(options.auto !== false); }
      status('En attente de l’autorisation du capteur…');
      try {
        if (mode !== 'camera') {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) throw new Error('Audio non disponible');
          session.context = new AC();
          await session.context.resume();                       // dans le geste de l'utilisateur : indispensable sur mobile
          if (token !== generation) return false;
        }
        const stream = await navigator.mediaDevices.getUserMedia(mode === 'camera'
          ? { video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }
          : { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
        if (token !== generation) { stream.getTracks().forEach(track => track.stop()); return false; }
        session.stream = stream;
        stream.getTracks().forEach(track => track.addEventListener('ended', () => { if (current === session) { status('Capteur déconnecté.', 'warn'); stop('disconnected'); } }));
        if (mode === 'camera') {
          if (!session.video) throw new Error('Pas d’élément vidéo');
          session.video.srcObject = stream;
          await session.video.play();
          if (token !== generation) return false;
          status('Caméra active. Vise les flashs au centre du cadre.', 'ok');
          cameraLoop(session, token, options);
        } else {
          if (session.context.state !== 'running') await session.context.resume();
          if (token !== generation) return false;
          session.context.onstatechange = () => { if (current === session && session.context.state !== 'running') { status('Écoute interrompue par le navigateur. Redémarre pour reprendre.', 'warn'); stop('interrupted'); } };
          session.source = session.context.createMediaStreamSource(stream);
          session.analyser = session.context.createAnalyser();
          session.analyser.fftSize = mode === 'acoustic' ? 4096 : 2048;
          session.analyser.smoothingTimeConstant = mode === 'acoustic' ? 0.35 : 0;
          session.source.connect(session.analyser);               // jamais relié aux haut-parleurs
          status(mode === 'acoustic' ? 'Microphone actif. Analyse locale en cours.' : 'Microphone actif. En attente de bips réguliers.', 'ok');
          (mode === 'acoustic' ? acousticLoop : audioLoop)(session, token, options);
        }
        keepAwake(session, token);
        return true;
      } catch (error) {
        if (token !== generation) return false;
        stop('error');
        status(sensorError(error), 'warn');
        return false;
      }
    }

    function audioLoop(session, token, options) {
      const frequency = new Float32Array(session.analyser.frequencyBinCount);
      const detector = new D.ToneDetector(options);              // `options` reste partagé : les réglages modifiés pendant l'écoute s'appliquent aussitôt
      function tick() {
        if (token !== generation) return;
        session.analyser.getFloatFrequencyData(frequency);
        const now = performance.now();
        const r = detector.update(frequency, session.context.sampleRate, session.analyser.fftSize, now);
        decoder.feed(r.detected, now);
        if (hooks.frame) hooks.frame({ mode: 'audio', detected: r.detected, level: r.level, hz: r.hz, toneDb: r.toneDb, threshold: r.threshold, decoded: decoder.snapshot(now) });
        session.timer = setTimeout(tick, 20);
      }
      tick();
    }

    function cameraLoop(session, token, options) {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Caméra non disponible');
      const video = session.video;
      const detector = new D.LightDetector(options);
      function tick(now) {
        if (token !== generation) return;
        if (video.readyState >= 2 && video.videoWidth) {
          const w = video.videoWidth, h = video.videoHeight;
          context.drawImage(video, w * 0.375, h * 0.375, w * 0.25, h * 0.25, 0, 0, 32, 32);   // centre de l'image seulement
          const pixels = context.getImageData(0, 0, 32, 32).data;
          let brightness = 0;
          for (let i = 0; i < pixels.length; i += 4) brightness += 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
          brightness = brightness / (32 * 32 * 255) * 100;
          const r = detector.update(brightness, now);
          decoder.feed(r.detected, now);
          if (hooks.frame) hooks.frame({ mode: 'camera', detected: r.detected, level: r.level, brightness, threshold: r.threshold, aspect: w / h, decoded: decoder.snapshot(now) });
        }
        session.frame = requestAnimationFrame(tick);
      }
      session.frame = requestAnimationFrame(tick);
    }
    function acousticLoop(session, token) {
      const frequency = new Float32Array(session.analyser.frequencyBinCount);
      const waveform = new Float32Array(session.analyser.fftSize);
      const tracker = new A.AcousticTracker();
      function tick() {
        if (token !== generation) return;
        session.analyser.getFloatFrequencyData(frequency);
        session.analyser.getFloatTimeDomainData(waveform);
        const now = performance.now();
        const features = A.spectralFeatures(frequency, waveform, session.context.sampleRate, session.analyser.fftSize);
        const result = tracker.update(features, now);
        const bars = A.logBars(frequency, session.context.sampleRate, session.analyser.fftSize, 48);
        if (hooks.frame) hooks.frame({ mode: 'acoustic', features, result, bars, level: clamp((features.db + 80) / 0.8, 0, 100) });
        session.timer = setTimeout(tick, 50);
      }
      tick();
    }

    return {
      start, stop, reset, snapshot: () => decoder.snapshot(performance.now()),
      setUnit: u => decoder.setUnit(u), setAuto: a => decoder.setAuto(a),
      get running() { return !!current; }, get mode() { return current ? current.mode : null; },
    };
  }

  return { create, sensorError };
})();


/* ==== js/50-view-home.js ==== */
/* Accueil : autonomie estimée (anneau eau / nourriture / énergie), score de préparation, actions prioritaires, accès rapides. */
Vault.registerView((() => {
  const U = VaultUtil, UI = VaultUI, Calc = VaultCalc, Kit = VaultKit, Guides = VaultGuides;
  let root = null;
  const $ = (sel) => UI.$(sel, root);

  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function installBanner(state) {
    if (standalone() || state.meta.installDismissed) return '';
    if (Vault.install && Vault.install.prompt) {
      return '<div class="banner">' + UI.icon('smartphone') + '<span>Installe VAULT sur ton écran d’accueil : il s’ouvre comme une application et fonctionne hors ligne.</span><button type="button" class="btn btn-sm btn-primary" data-install>Installer</button><button type="button" class="icon-btn" data-dismiss-install aria-label="Masquer">' + UI.icon('x') + '</button></div>';
    }
    if (isIOS()) {
      return '<div class="banner">' + UI.icon('smartphone') + '<span>Pour installer VAULT : touche <b>Partager</b>, puis <b>Sur l’écran d’accueil</b>. Il fonctionnera hors ligne.</span><button type="button" class="icon-btn" data-dismiss-install aria-label="Masquer">' + UI.icon('x') + '</button></div>';
    }
    return '';
  }

  function legendLine(id, kind, label) {
    return '<li><span class="swatch swatch-' + kind + '"></span><span>' + label + '</span><b class="num" id="lg-' + id + '"></b></li>';
  }

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div class="page-head"><div><div class="eyebrow">Vue d’ensemble</div><h1 id="h-home">Accueil</h1></div></div>' +
      '<div class="stack-lg">' +
        '<div id="home-install"></div>' +
        '<article class="card hero-card" aria-labelledby="home-ring-title">' +
          '<div class="hero-grid">' +
            '<div class="ring" id="home-ring">' + UI.ringSvg(['water', 'food', 'energy'], 'Autonomie : eau, nourriture, énergie') +
              '<div class="ring-center"><div class="ring-value num" id="home-days">0,0</div><div class="ring-unit" id="home-days-unit">jours</div></div></div>' +
            '<div class="hero-side">' +
              '<div class="label" id="home-ring-title">Autonomie estimée</div>' +
              '<span class="chip" id="home-critical"></span>' +
              '<ul class="legend">' + legendLine('water', 'water', 'Eau') + legendLine('food', 'food', 'Nourriture') + legendLine('energy', 'energy', 'Énergie') + '</ul>' +
            '</div>' +
          '</div>' +
          '<hr class="hr">' +
          '<div class="split"><div class="label">Préparation</div><div class="num"><b id="home-score" class="score-num">0</b><span class="muted">/100</span></div></div>' +
          '<div class="meter score-meter" role="progressbar" aria-label="Score de préparation" aria-valuemin="0" aria-valuemax="100" id="home-score-meter"><span id="home-score-bar"></span></div>' +
          '<p class="hint" id="home-score-hint"></p>' +
        '</article>' +
        '<section class="stack" aria-labelledby="home-todo-title"><div class="split"><h2 id="home-todo-title">À faire</h2></div><div class="list" id="home-todo"></div></section>' +
        '<section class="grid-2 quick" aria-label="Accès rapides">' +
          '<a class="tile tile-danger" href="tel:112"><span class="row-icon danger">' + UI.icon('phone-call') + '</span><span class="tile-title">Appeler le 112</span><span class="tile-sub">Urgence, gratuit, 24\u00a0h/24</span></a>' +
          '<button type="button" class="tile" data-go="guides"><span class="row-icon">' + UI.icon('book-open') + '</span><span class="tile-title">Que faire ?</span><span class="tile-sub">Guides pas à pas, hors ligne</span></button>' +
          '<button type="button" class="tile" data-go="tools/signal"><span class="row-icon info">' + UI.icon('radio-tower') + '</span><span class="tile-title">Signal Morse</span><span class="tile-sub">Lampe, son, vibration</span></button>' +
          '<button type="button" class="tile" data-go="emergency"><span class="row-icon warn">' + UI.icon('id-card') + '</span><span class="tile-title">Ma fiche vitale</span><span class="tile-sub">Allergies, traitements, contacts</span></button>' +
        '</section>' +
        '<article class="card" aria-labelledby="home-kit-title"><div class="card-head"><div><div class="label">Checklist 72 h</div><h2 id="home-kit-title"><span id="home-kit-count">0</span>/<span id="home-kit-total">0</span> prêts</h2></div></div><div class="check-list" id="home-kit"></div><button type="button" class="btn btn-ghost btn-block mt" data-go="prepare/kit">Voir la checklist complète</button></article>' +
        '<article class="card" aria-labelledby="home-gqs-title"><div class="card-head"><div><div class="label">Gestes qui sauvent</div><h2 id="home-gqs-title">Les bons réflexes</h2></div></div><div class="chips" id="home-gqs"></div><p class="hint">Ces guides ne remplacent pas une formation aux premiers secours.</p></article>' +
      '</div>';

    UI.on(el, 'click', '[data-go]', (e, t) => { UI.Router.go(t.dataset.go); });
    UI.on(el, 'change', 'input[data-kit]', (e, t) => { Vault.actions.toggleKit(t.dataset.kit, t.checked); });
    UI.on(el, 'click', '[data-install]', async () => {
      const p = Vault.install && Vault.install.prompt;
      if (!p) return;
      p.prompt();
      try { await p.userChoice; } catch (_) { /* ignoré */ }
      Vault.install.prompt = null;
      update(Vault.store.get());
    });
    UI.on(el, 'click', '[data-dismiss-install]', () => { Vault.store.update(s => { s.meta.installDismissed = true; }, 'meta'); });

    $('#home-gqs').innerHTML = Guides.QUICK.map(id => { const g = Guides.byId(id); return '<button type="button" class="chip-btn" data-go="guides/' + g.id + '">' + UI.icon(g.icon) + UI.esc(g.title) + '</button>'; }).join('');
  }

  const LEVEL_ICON = { critical: 'danger', warn: 'warn', info: 'info', ok: 'ok' };
  // Première ouverture : rien n'est saisi, VAULT ne prétend donc rien (ni objectif atteint, ni « base solide ») et guide les premiers pas.
  const FIRST_STEPS = [
    { icon: 'users', title: 'Dis combien vous êtes', text: 'Le nombre de personnes et de jours à couvrir : trois jours (72 h) est la base recommandée par la Sécurité civile.', route: 'prepare/stock' },
    { icon: 'boxes', title: 'Note tes réserves', text: 'Eau, nourriture, énergie : VAULT calcule ton autonomie et ce qu’il te manque.', route: 'prepare/stock' },
    { icon: 'clipboard-check', title: 'Prépare ton kit 72 h', text: 'Douze éléments de base à cocher au fil des jours.', route: 'prepare/kit' },
    { icon: 'id-card', title: 'Remplis ta fiche vitale et tes contacts', text: 'Allergies, traitements, personne à prévenir : lisibles en un geste.', route: 'emergency' },
  ];

  function update(state) {
    if (!root) return;
    const today = Vault.today();
    const r = Calc.resources(state, today);
    const sc = Calc.score(state, today);
    const blank = Calc.isBlank(state);

    UI.ringSet($('#home-ring'), [r.water.ratio, r.food.ratio, r.energy.ratio]);
    $('#home-days').textContent = U.fmt1(r.autonomy);
    $('#home-days-unit').textContent = U.plural(r.autonomy, 'jour', 'jours');
    const chip = $('#home-critical');
    if (blank) {
      chip.className = 'chip chip-accent';
      chip.innerHTML = UI.icon('sparkles') + 'Bienvenue : commence ici';
    } else if (r.critical.days < r.target) {
      chip.className = 'chip chip-warn';
      chip.innerHTML = UI.icon('triangle-alert') + 'Ressource critique : ' + UI.esc(r.critical.label);
    } else {
      chip.className = 'chip chip-ok';
      chip.innerHTML = UI.icon('circle-check') + 'Objectif de ' + U.fmt(r.target, 1) + ' ' + U.plural(r.target, 'jour', 'jours') + ' atteint';
    }
    $('#lg-water').textContent = U.fmt1(r.water.days) + ' j';
    $('#lg-food').textContent = U.fmt1(r.food.days) + ' j';
    $('#lg-energy').textContent = U.fmt1(r.energy.days) + ' j';

    $('#home-score').textContent = String(sc.score);
    $('#home-score-bar').style.width = sc.score + '%';
    $('#home-score-meter').setAttribute('aria-valuenow', String(sc.score));
    $('#home-score-hint').textContent = blank ? 'Saisis tes réserves et coche ton kit : le score se met à jour tout seul.' : Calc.scoreLabel(sc.score);

    $('#home-todo-title').textContent = blank ? 'Premiers pas' : 'À faire';
    const rows = blank
      ? FIRST_STEPS.map((s, i) => ({ level: 'info', icon: s.icon, title: (i + 1) + '. ' + s.title, text: s.text, route: s.route }))
      : Calc.priorities(state, today).slice(0, 4);
    $('#home-todo').innerHTML = rows.map(t => {
      const inner = '<span class="row-icon ' + LEVEL_ICON[t.level] + '">' + UI.icon(t.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(t.title) + '</span><span class="row-sub">' + UI.esc(t.text) + '</span></span>' + (t.route ? '<span class="row-end">' + UI.icon('chevron-right') + '</span>' : '');
      return t.route ? '<button type="button" class="row" data-go="' + t.route + '">' + inner + '</button>' : '<div class="row">' + inner + '</div>';
    }).join('') + (blank ? '<p class="hint">Tout reste sur ton téléphone : VAULT n’envoie rien et fonctionne sans réseau.</p>' : '');

    const items = Kit.kitItems(state).core;
    const done = items.filter(i => i.done).length;
    $('#home-kit-count').textContent = String(done);
    $('#home-kit-total').textContent = String(items.length);
    const next = items.filter(i => !i.done).slice(0, 4);
    const kitHost = $('#home-kit');
    const focused = document.activeElement && root.contains(document.activeElement) ? document.activeElement.dataset.kit : null;
    kitHost.innerHTML = next.length
      ? next.map(i => '<label class="check"><input type="checkbox" data-kit="' + i.id + '"><span class="box">' + UI.icon('check') + '</span><span class="check-text">' + UI.esc(i.label) + '</span></label>').join('')
      : '<div class="callout callout-ok">' + UI.icon('circle-check') + '<span>Le kit est complet. Pense à vérifier régulièrement piles et dates.</span></div>';
    if (focused) { const again = kitHost.querySelector('[data-kit="' + focused + '"]'); if (again) again.focus({ preventScroll: true }); }

    $('#home-install').innerHTML = installBanner(state);
  }

  return { id: 'home', title: 'Accueil', tab: 'home', mount, update };
})());


/* ==== js/51-view-prepare.js ==== */
/* Préparer : conteneur à trois sections (Stock, Kit 72 h, Plan) et section Stock / Autonomie
 * (eau, nourriture par total ou par aliment, énergie, liste d'achats). */
Vault.prepare = { panels: {}, register(panel) { this.panels[panel.id] = panel; } };

Vault.registerView((() => {
  const UI = VaultUI;
  const SUBS = [
    { id: 'stock', label: 'Stock', icon: 'boxes' },
    { id: 'kit', label: 'Kit 72 h', icon: 'clipboard-check' },
    { id: 'plan', label: 'Plan', icon: 'users' },
  ];
  let root = null;
  let current = null;

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div class="page-head"><div><div class="eyebrow">Ressources et plan</div><h1 id="h-prepare">Préparer</h1></div></div>' +
      '<div class="seg mb" role="tablist" aria-label="Sections de préparation">' +
        SUBS.map(s => '<button type="button" role="tab" id="prep-tab-' + s.id + '" data-sub="' + s.id + '" aria-controls="prep-' + s.id + '" aria-selected="false">' + UI.icon(s.icon) + s.label + '</button>').join('') +
      '</div>' +
      SUBS.map(s => '<div class="stack-lg prep-panel" id="prep-' + s.id + '" role="tabpanel" aria-labelledby="prep-tab-' + s.id + '" hidden></div>').join('');
    SUBS.forEach(s => { const p = Vault.prepare.panels[s.id]; if (p && p.mount) p.mount(UI.$('#prep-' + s.id, el)); });
    UI.on(el, 'click', '[data-sub]', (e, t) => UI.Router.go('prepare/' + t.dataset.sub));
  }
  function show(sub) {
    if (current && current !== sub) { const prev = Vault.prepare.panels[current]; if (prev && prev.leave) prev.leave(); }
    current = sub;
    SUBS.forEach(s => {
      const on = s.id === sub;
      UI.$('#prep-' + s.id, root).hidden = !on;
      UI.$('#prep-tab-' + s.id, root).setAttribute('aria-selected', String(on));
    });
    const panel = Vault.prepare.panels[sub];
    if (panel && panel.enter) panel.enter();
    if (panel && panel.update) panel.update(Vault.store.get(), 'enter');
  }
  function enter(parts) { show(SUBS.some(s => s.id === parts[0]) ? parts[0] : 'stock'); }
  function leave() { const p = current && Vault.prepare.panels[current]; if (p && p.leave) p.leave(); }
  function update(state, what) {
    if (what === 'enter') return;                               // enter() a déjà mis à jour la section affichée
    const p = current && Vault.prepare.panels[current];
    if (p && p.update) p.update(state, what);
  }
  return { id: 'prepare', title: 'Préparer', tab: 'prepare', mount, enter, leave, update };
})());

// ====================================================================== section Stock / Autonomie
Vault.prepare.register((() => {
  const U = VaultUtil, UI = VaultUI, Calc = VaultCalc, Catalog = VaultCatalog, State = VaultState;
  let root = null;
  let filter = 'all', query = '', sort = 'name';
  const $ = sel => UI.$(sel, root);

  const BIND = [
    { id: 'in-people', key: 'people', min: 1, max: 99, int: true },
    { id: 'in-target', key: 'targetDays', min: 1, max: 365 },
    { id: 'in-water', key: 'waterLiters', min: 0, max: 1e6 },
    { id: 'in-waterpp', key: 'waterPerPerson', min: 0.1, max: 100 },
    { id: 'in-kcal', key: 'foodKcal', min: 0, max: 1e9 },
    { id: 'in-kcalpp', key: 'kcalPerPerson', min: 1, max: 20000 },
    { id: 'in-mah', key: 'powerMah', min: 0, max: 1e9 },
    { id: 'in-daily', key: 'dailyMah', min: 1, max: 1e8 },
  ];

  const stepper = (id, label, min, max) =>
    '<div class="field"><label for="' + id + '">' + label + '</label><div class="stepper"><button type="button" data-step-for="' + id + '" data-dir="-1" aria-label="Diminuer">' + UI.icon('minus') + '</button>' +
    '<input id="' + id + '" type="number" inputmode="numeric" min="' + min + '" max="' + max + '" step="1"><button type="button" data-step-for="' + id + '" data-dir="1" aria-label="Augmenter">' + UI.icon('plus') + '</button></div></div>';
  const field = (id, label, unit, attrs) =>
    '<div class="field"><label for="' + id + '">' + label + '</label><div class="input-unit"><input class="input" id="' + id + '" type="number" inputmode="decimal" ' + attrs + '><span>' + unit + '</span></div></div>';
  const resHead = (kind, icon, label) =>
    '<div class="card-head"><div class="res-title"><span class="row-icon ' + (kind === 'water' ? 'info' : kind === 'food' ? 'warn' : 'ok') + '">' + UI.icon(icon) + '</span><div><div class="label">' + label + '</div><h2><span id="' + kind + '-days" class="num">0,0</span> <span id="' + kind + '-days-unit">jours</span></h2></div></div></div>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="stock-target-title"><div class="card-head"><div><div class="label">Objectif</div><h2 id="stock-target-title">Mon foyer et ma cible</h2></div></div>' +
        '<div class="grid-2">' + stepper('in-people', 'Personnes dans le foyer', 1, 99) + stepper('in-target', 'Objectif en jours', 1, 365) + '</div>' +
        '<p class="hint mt">VAULT compare tes réserves à cet objectif. Trois jours (72 h) est la base recommandée par la Sécurité civile pour un kit d’urgence.</p></article>' +

      '<article class="card resource" aria-label="Eau">' + resHead('water', 'droplet', 'Eau') +
        '<div class="meter meter-water"><span id="water-bar"></span></div><p class="hint mt-sm" id="water-gap"></p>' +
        '<div class="grid-2 collapse mt">' + field('in-water', 'Litres disponibles', 'L', 'min="0" step="0.5"') + field('in-waterpp', 'Besoin par personne et par jour', 'L', 'min="0.5" step="0.1"') + '</div>' +
        '<div class="chips mt" aria-label="Ajustement rapide"><button type="button" class="chip-btn" data-water="1.5">+ 1,5 L</button><button type="button" class="chip-btn" data-water="5">+ 5 L</button><button type="button" class="chip-btn" data-water="10">+ 10 L</button><button type="button" class="chip-btn" data-water="-1.5">− 1,5 L</button></div>' +
        '<p class="hint">Compte 2 litres par personne et par jour pour boire et préparer les aliments (6 litres par personne pour 72 h), davantage s’il fait chaud.</p></article>' +

      '<article class="card resource" aria-label="Nourriture">' + resHead('food', 'utensils', 'Nourriture') +
        '<div class="meter meter-food"><span id="food-bar"></span></div><p class="hint mt-sm" id="food-gap"></p>' +
        '<div class="field mt"><span class="field-label" id="food-mode-label">Calcul de la réserve alimentaire</span><div class="seg" role="group" aria-labelledby="food-mode-label"><button type="button" data-mode="total" aria-pressed="true">Saisie globale</button><button type="button" data-mode="inventory" aria-pressed="false">Par aliment</button></div></div>' +
        '<div class="grid-2 collapse mt"><div id="food-total-field">' + field('in-kcal', 'Calories disponibles', 'kcal', 'min="0" step="100"') + '</div><div id="food-derived" hidden class="field"><span class="field-label">Calories comptées</span><div class="derived" id="food-derived-value">0 kcal</div></div>' + field('in-kcalpp', 'Besoin par personne et par jour', 'kcal', 'min="800" step="50"') + '</div>' +
        '<p class="hint">Estimation énergétique d’après le besoin que tu renseignes. Les besoins varient selon les personnes et l’activité ; les calories seules ne décrivent pas une alimentation équilibrée.</p></article>' +

      '<article class="card" id="inv-card" aria-labelledby="inv-title" hidden>' +
        '<div class="card-head"><div><div class="label">Réserves alimentaires</div><h2 id="inv-title">Mon inventaire</h2></div><button type="button" class="btn btn-primary btn-sm" id="inv-add">' + UI.icon('plus') + 'Aliment</button></div>' +
        '<p class="hint">Coche « En stock » pour compter un aliment : les lignes décochées restent dans ta liste d’achats. Ce calcul remplace la saisie globale ; les deux ne s’additionnent pas.</p>' +
        '<label class="toggle-row mt"><span><span class="strong">Sans cuisson uniquement</span><span class="hint block">Ne compter que les aliments qui se mangent sans chauffer.</span></span><span class="switch"><input type="checkbox" id="inv-nocook"><span class="track"></span></span></label>' +
        '<div class="nutrition-grid mt" id="inv-summary" aria-label="Apports des réserves"></div>' +
        '<p class="muted mt-sm" id="inv-coverage" role="status"></p><p class="hint" id="inv-complete"></p>' +
        '<div class="hr"></div>' +
        '<div class="split"><h3>Aliments et achats</h3><span class="hint" id="inv-count"></span></div>' +
        '<div class="chips mt-sm" id="inv-filters" role="group" aria-label="Filtrer"></div>' +
        '<div class="grid-2 collapse mt-sm" id="inv-tools" hidden><input class="input" type="search" id="inv-search" placeholder="Chercher un aliment" aria-label="Chercher un aliment"><select class="select" id="inv-sort" aria-label="Trier"><option value="name">Trier par nom</option><option value="date">Trier par date</option><option value="kcal">Trier par calories</option></select></div>' +
        '<div class="food-list mt" id="inv-list"></div>' +
        '<p class="hint mt">Les apports affichés portent uniquement sur les nutriments saisis. Vitamines, minéraux et besoins particuliers ne sont pas évalués. Les dates sont des rappels à vérifier : VAULT ne certifie pas la sécurité d’un aliment.</p></article>' +

      '<article class="card resource" aria-label="Énergie">' + resHead('energy', 'zap', 'Énergie') +
        '<div class="meter meter-energy"><span id="energy-bar"></span></div><p class="hint mt-sm" id="energy-gap"></p>' +
        '<div class="grid-2 collapse mt">' + field('in-mah', 'Réserve externe', 'mAh', 'min="0" step="1000"') + field('in-daily', 'Consommation par jour', 'mAh', 'min="100" step="100"') + '</div>' +
        '<p class="hint" id="energy-hint"></p></article>' +

      '<details class="acc" id="shop-acc"><summary>' + UI.icon('shopping-cart') + '<span>Liste d’achats</span><span class="chip chip-accent" id="shop-count">0</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary>' +
        '<div class="acc-body stack"><div class="list" id="shop-list"></div><div class="cluster"><button type="button" class="btn btn-ghost btn-sm" id="shop-copy">' + UI.icon('copy') + 'Copier</button><button type="button" class="btn btn-ghost btn-sm" id="shop-share">' + UI.icon('share-2') + 'Partager</button><button type="button" class="btn btn-ghost btn-sm" id="shop-print">' + UI.icon('printer') + 'Imprimer</button></div></div></details>';

    // ---- champs liés à l'état
    UI.on(el, 'input', 'input[type=number]', (e, t) => {
      const b = BIND.find(x => x.id === t.id);
      if (!b) return;
      const n = U.num(t.value, null);
      if (n === null) return;
      t.setAttribute('aria-invalid', 'false');
      const v = U.clamp(b.int ? Math.round(n) : n, b.min, b.max);
      Vault.store.quiet(s => { s[b.key] = v; });
      refreshDerived(Vault.store.get());
    });
    UI.on(el, 'change', 'input[type=number]', (e, t) => {                // à la sortie du champ : la valeur affichée devient la valeur retenue
      const b = BIND.find(x => x.id === t.id);
      if (b) t.value = String(Vault.store.get()[b.key]);
    });
    UI.on(el, 'click', '[data-step-for]', (e, t) => {
      const b = BIND.find(x => x.id === t.dataset.stepFor);
      const dir = Number(t.dataset.dir);
      Vault.store.update(s => { s[b.key] = U.clamp(Math.round(s[b.key]) + dir, b.min, b.max); }, 'stock');
      UI.haptic(6);
    });
    UI.on(el, 'click', '[data-water]', (e, t) => {
      const d = Number(t.dataset.water);
      Vault.store.update(s => { s.waterLiters = Math.max(0, Math.round((s.waterLiters + d) * 100) / 100); }, 'stock');
      UI.haptic(6);
    });
    UI.on(el, 'click', '[data-mode]', (e, t) => { Vault.store.update(s => { s.foodMode = t.dataset.mode; }, 'stock'); });
    $('#inv-nocook').addEventListener('change', e => { Vault.store.update(s => { s.noCooking = e.target.checked; }, 'stock'); });
    $('#inv-add').addEventListener('click', () => openFoodSheet(null));
    UI.on($('#inv-filters'), 'click', '[data-filter]', (e, t) => { filter = t.dataset.filter; renderList(Vault.store.get()); renderFilters(Vault.store.get()); });
    $('#inv-search').addEventListener('input', e => { query = e.target.value; renderList(Vault.store.get()); });
    $('#inv-sort').addEventListener('change', e => { sort = e.target.value; renderList(Vault.store.get()); });

    // ---- liste des aliments
    const list = $('#inv-list');
    UI.on(list, 'change', 'input[data-stock]', (e, t) => { Vault.store.update(s => { const i = s.inventory.find(x => x.id === t.dataset.stock); if (i) i.inStock = t.checked; }, 'inventory'); });
    UI.on(list, 'click', '[data-qty-step]', (e, t) => {
      Vault.store.update(s => { const i = s.inventory.find(x => x.id === t.dataset.id); if (i) i.quantity = Math.max(0, Math.round((i.quantity + Number(t.dataset.qtyStep)) * 100) / 100); }, 'inventory');
      const again = list.querySelector('[data-qty="' + t.dataset.id + '"]');
      if (again) again.focus({ preventScroll: true });
    });
    UI.on(list, 'input', 'input[data-qty]', (e, t) => {
      const n = U.num(t.value, null);
      if (n === null || n < 0) return;
      Vault.store.quiet(s => { const i = s.inventory.find(x => x.id === t.dataset.qty); if (i) i.quantity = Math.min(100000, n); });
      refreshDerived(Vault.store.get());
      renderSummary(Vault.store.get());
      const row = list.querySelector('[data-total="' + t.dataset.qty + '"]');
      if (row) row.textContent = totalLine(Vault.store.get().inventory.find(x => x.id === t.dataset.qty), Vault.store.get());
    });
    UI.on(list, 'click', '[data-edit]', (e, t) => openFoodSheet(Vault.store.get().inventory.find(x => x.id === t.dataset.edit)));
    UI.on(list, 'click', '[data-del]', async (e, t) => {
      const item = Vault.store.get().inventory.find(x => x.id === t.dataset.del);
      if (!item) return;
      if (await UI.confirm({ title: 'Supprimer cet aliment ?', text: item.name + ' sera retiré de ton inventaire.', confirmLabel: 'Supprimer', danger: true })) {
        Vault.store.update(s => { s.inventory = s.inventory.filter(x => x.id !== item.id); }, 'inventory');
        UI.toast('Aliment supprimé.', { icon: 'trash-2' });
      }
    });

    // ---- liste d'achats
    $('#shop-copy').addEventListener('click', async () => { UI.toast(await Vault.actions.copy(Calc.shoppingText(Calc.shopping(Vault.store.get(), Vault.today()))) ? 'Liste copiée.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' }); });
    $('#shop-share').addEventListener('click', async () => {
      const r = await Vault.actions.share('Liste d’achats VAULT', Calc.shoppingText(Calc.shopping(Vault.store.get(), Vault.today())));
      if (r === 'copied') UI.toast('Liste copiée.', { tone: 'ok', icon: 'copy' });
    });
    $('#shop-print').addEventListener('click', () => {
      const items = Calc.shopping(Vault.store.get(), Vault.today());
      Vault.actions.print('<h1>Liste d’achats — VAULT</h1><p class="muted">Établie le ' + U.frDate(Vault.today()) + '</p><ul>' + items.map(i => '<li><span class="box"></span>' + UI.esc(i.label) + (i.detail ? ' — <span class="muted">' + UI.esc(i.detail) + '</span>' : '') + '</li>').join('') + '</ul>');
    });
  }

  // ---------------------------------------------------------------- affichage
  function setRes(kind, res, unit, target) {
    $('#' + kind + '-days').textContent = U.fmt1(res.days);
    $('#' + kind + '-days-unit').textContent = U.plural(res.days, 'jour', 'jours');
    $('#' + kind + '-bar').style.width = (res.ratio * 100).toFixed(1) + '%';
    const t = U.fmt(target, 1) + ' ' + U.plural(target, 'jour', 'jours');
    $('#' + kind + '-gap').innerHTML = res.missing > (unit === 'kcal' || unit === 'mAh' ? 1 : 0.05)
      ? UI.icon('triangle-alert') + ' Il manque environ <b class="num">' + U.fmtInt(Math.ceil(res.missing)) + ' ' + unit + '</b> pour atteindre ' + t + '.'
      : UI.icon('circle-check') + ' Objectif de ' + t + ' atteint.';
    $('#' + kind + '-gap').className = 'hint gap ' + (res.missing > (unit === 'kcal' || unit === 'mAh' ? 1 : 0.05) ? 'gap-warn' : 'gap-ok');
  }
  function refreshDerived(state) {
    const today = Vault.today();
    const r = Calc.resources(state, today);
    setRes('water', r.water, 'L', r.target);
    setRes('food', r.food, 'kcal', r.target);
    setRes('energy', r.energy, 'mAh', r.target);
    $('#food-derived-value').textContent = U.fmtInt(r.food.have) + ' kcal';
    const phones = Math.floor(state.powerMah * 0.65 / 4000);
    $('#energy-hint').textContent = 'Environ ' + phones + ' ' + U.plural(phones, 'charge', 'charges') + ' de smartphone (4 000 mAh), en comptant 65 % de capacité utile : la capacité annoncée d’une batterie externe n’est jamais entièrement disponible.';
  }
  function totalLine(item, state) {
    const e = Calc.expiry(item, Vault.today());
    const eligible = item.inStock && (!state.noCooking || item.ready);
    const kcal = item.energy == null ? 'Calories inconnues' : U.fmtInt(item.quantity * item.mass / 100 * item.energy) + ' kcal';
    return kcal + ' · ' + (!item.inStock ? 'À acheter' : Calc.excluded(item, Vault.today()) ? 'Non compté : DLC dépassée' : !eligible ? 'Exclu : cuisson nécessaire' : 'Compté') + (e.level === 'none' ? '' : '');
  }
  function renderSummary(state) {
    const t = Calc.totals(state, Vault.today());
    const share = Math.max(1, state.targetDays) * Math.max(1, state.people);
    const label = { energy: ['Calories', 'kcal'], protein: ['Protéines', 'g'], carbs: ['Glucides', 'g'], fat: ['Lipides', 'g'], fibre: ['Fibres', 'g'], salt: ['Sel', 'g'] };
    $('#inv-summary').innerHTML = State.NUTRIENTS.map(key => {
      const unknown = t.selected === 0 || t.missing[key] === t.selected;
      const partial = t.missing[key] > 0;
      return '<div class="nutrition-metric"><span class="label">' + label[key][0] + '</span><strong class="num">' + (unknown ? '—' : U.fmtInt(t.values[key] >= 100 ? t.values[key] : Math.round(t.values[key] * 10) / 10)) + ' <small>' + label[key][1] + '</small></strong><span class="hint">' + (unknown ? 'Non renseigné' : U.fmt(t.values[key] / share, 1) + ' ' + label[key][1] + ' / pers. / j' + (partial ? ' · partiel' : '')) + '</span></div>';
    }).join('');
    const need = share * Math.max(1, state.kcalPerPerson);
    const deficit = Math.max(0, need - t.values.energy);
    $('#inv-coverage').textContent = U.fmtInt(t.values.energy) + ' kcal comptées · ' + (deficit ? U.fmtInt(deficit) + ' kcal manquantes' : 'objectif calorique atteint') + ' pour ' + state.people + ' ' + U.plural(state.people, 'personne', 'personnes') + ' sur ' + U.fmt(state.targetDays, 1) + ' ' + U.plural(state.targetDays, 'jour', 'jours') + '.';
    const partialAny = State.NUTRIENTS.some(k => t.missing[k]);
    $('#inv-complete').textContent = 'Apports par personne et par jour = réserves réparties sur ton objectif, sans recommandation nutritionnelle personnalisée. ' + t.selected + ' ' + U.plural(t.selected, 'ligne comptée', 'lignes comptées') + '.' + (partialAny ? ' Totaux partiels : certains apports ne sont pas renseignés.' : '') + (t.expiredDlc ? ' ' + t.expiredDlc + ' ' + U.plural(t.expiredDlc, 'aliment à DLC dépassée n’est', 'aliments à DLC dépassée ne sont') + ' pas compté' + (t.expiredDlc > 1 ? 's' : '') + '.' : '');
    $('#inv-count').textContent = t.owned + ' en stock · ' + t.shopping + ' à acheter';
  }
  function matches(item, state) {
    const today = Vault.today();
    if (filter === 'stock' && !item.inStock) return false;
    if (filter === 'buy' && item.inStock) return false;
    if (filter === 'soon') { const e = Calc.expiry(item, today); if (!(item.inStock && (e.level === 'soon' || e.level === 'expired'))) return false; }
    if (query && !U.fold(item.name).includes(U.fold(query))) return false;
    return true;
  }
  function renderFilters(state) {
    const today = Vault.today();
    const inv = state.inventory;
    const counts = { all: inv.length, stock: inv.filter(i => i.inStock).length, buy: inv.filter(i => !i.inStock).length, soon: inv.filter(i => i.inStock && ['soon', 'expired'].includes(Calc.expiry(i, today).level)).length };
    const defs = [['all', 'Tous'], ['stock', 'En stock'], ['buy', 'À acheter'], ['soon', 'À consommer vite']];
    $('#inv-filters').innerHTML = defs.map(([id, name]) => '<button type="button" class="chip-btn" data-filter="' + id + '" aria-pressed="' + (filter === id) + '">' + name + ' <span class="num">' + counts[id] + '</span></button>').join('');
    $('#inv-tools').hidden = inv.length < 6;
  }
  function expiryChip(item) {
    const e = Calc.expiry(item, Vault.today());
    if (e.level === 'none') return '';
    const kind = item.dateType || 'Date';
    if (e.level === 'expired') return '<span class="chip chip-danger">' + UI.icon('triangle-alert') + kind + ' dépassée</span>';
    const txt = e.days === 0 ? 'aujourd’hui' : 'dans ' + e.days + ' j';
    return '<span class="chip ' + (e.level === 'soon' ? 'chip-warn' : '') + '">' + UI.icon('calendar-clock') + kind + ' ' + txt + '</span>';
  }
  function rowHtml(item, state) {
    return '<article class="food-row' + (item.inStock ? '' : ' food-buy') + '" data-row="' + item.id + '">' +
      '<h4>' + UI.esc(item.name) + '</h4>' +
      '<div class="cluster">' + expiryChip(item) + '<span class="chip">' + (item.ready ? 'Sans cuisson' : 'Cuisson nécessaire') + '</span></div>' +
      '<p class="hint">' + U.fmt(item.quantity, 2) + ' × ' + U.fmt(item.mass, 1) + ' g' + (item.date ? ' · date ' + U.frDate(item.date) : '') + '</p>' +
      '<p class="hint strong-hint" data-total="' + item.id + '">' + UI.esc(totalLine(item, state)) + '</p>' +
      '<div class="food-controls"><label class="check"><input type="checkbox" data-stock="' + item.id + '"' + (item.inStock ? ' checked' : '') + '><span class="box">' + UI.icon('check') + '</span><span class="check-text">En stock</span></label>' +
      '<div class="stepper stepper-sm"><button type="button" data-qty-step="-1" data-id="' + item.id + '" aria-label="Une unité de moins pour ' + UI.esc(item.name) + '">' + UI.icon('minus') + '</button><input type="number" inputmode="decimal" min="0" max="100000" step="any" data-qty="' + item.id + '" value="' + item.quantity + '" aria-label="Unités de ' + UI.esc(item.name) + '"><button type="button" data-qty-step="1" data-id="' + item.id + '" aria-label="Une unité de plus pour ' + UI.esc(item.name) + '">' + UI.icon('plus') + '</button></div></div>' +
      '<div class="cluster"><button type="button" class="btn btn-ghost btn-sm" data-edit="' + item.id + '">' + UI.icon('pencil') + 'Modifier</button><button type="button" class="btn btn-danger btn-sm" data-del="' + item.id + '" aria-label="Supprimer ' + UI.esc(item.name) + '">' + UI.icon('trash-2') + 'Supprimer</button></div></article>';
  }
  function renderList(state) {
    const host = $('#inv-list');
    const focusedId = document.activeElement && host.contains(document.activeElement) ? document.activeElement.dataset.qty || document.activeElement.dataset.stock : null;
    const kind = document.activeElement && host.contains(document.activeElement) ? (document.activeElement.dataset.qty ? 'qty' : 'stock') : null;
    let items = state.inventory.filter(i => matches(i, state));
    if (sort === 'date') items.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.name.localeCompare(b.name, 'fr'));
    else if (sort === 'kcal') items.sort((a, b) => (b.quantity * b.mass * (b.energy || 0)) - (a.quantity * a.mass * (a.energy || 0)));
    else items.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    if (!items.length) {
      host.innerHTML = '<div class="empty">' + UI.icon('boxes') + '<p>' + (state.inventory.length ? 'Aucun aliment ne correspond à ce filtre.' : 'Ajoute ton premier aliment : une conserve, des biscuits, un sachet…') + '</p></div>';
    } else {
      // Mise à jour par clé : seules les lignes dont le contenu change sont recréées (300 aliments restent fluides sur un téléphone modeste).
      const existing = new Map();
      Array.from(host.children).forEach(el => { if (el.dataset.row) existing.set(el.dataset.row, el); });
      const template = document.createElement('template');
      let cursor = host.firstElementChild;
      items.forEach(item => {
        const html = rowHtml(item, state);
        const old = existing.get(item.id);
        if (old && old.__html === html) {
          if (old === cursor) cursor = cursor.nextElementSibling; else host.insertBefore(old, cursor);
          return;
        }
        template.innerHTML = html;
        const fresh = template.content.firstElementChild;
        fresh.__html = html;
        if (old) {
          if (old === cursor) { host.replaceChild(fresh, old); cursor = fresh.nextElementSibling; }
          else { old.remove(); host.insertBefore(fresh, cursor); }
        } else host.insertBefore(fresh, cursor);
      });
      while (cursor) { const next = cursor.nextElementSibling; cursor.remove(); cursor = next; }
    }
    if (focusedId) { const again = host.querySelector(kind === 'qty' ? '[data-qty="' + focusedId + '"]' : '[data-stock="' + focusedId + '"]'); if (again) again.focus({ preventScroll: true }); }
  }
  function renderShopping(state) {
    const items = Calc.shopping(state, Vault.today());
    $('#shop-count').textContent = String(items.length);
    $('#shop-list').innerHTML = items.length
      ? items.map(i => '<div class="row"><span class="row-icon">' + UI.icon(i.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(i.label) + '</span>' + (i.detail ? '<span class="row-sub">' + UI.esc(i.detail) + '</span>' : '') + '</span></div>').join('')
      : '<div class="callout callout-ok">' + UI.icon('circle-check') + '<span>Rien à acheter pour le moment : tes réserves atteignent l’objectif et ton kit est complet.</span></div>';
  }

  function update(state) {
    if (!root) return;
    BIND.forEach(b => { const el = $('#' + b.id); if (el && document.activeElement !== el) el.value = String(state[b.key]); });
    const inventory = state.foodMode === 'inventory';
    UI.$$('[data-mode]', root).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.foodMode)));
    $('#food-total-field').hidden = inventory;
    $('#food-derived').hidden = !inventory;
    $('#inv-card').hidden = !inventory;
    $('#inv-nocook').checked = !!state.noCooking;
    refreshDerived(state);
    if (inventory) { renderSummary(state); renderFilters(state); renderList(state); }
    renderShopping(state);
  }

  // ---------------------------------------------------------------- formulaire d'un aliment
  function openFoodSheet(item) {
    const v = item || { name: '', quantity: 1, mass: '', energy: '', protein: '', carbs: '', fat: '', fibre: '', salt: '', date: '', dateType: '', inStock: true, ready: true, cat: '' };
    const val = x => (x == null ? '' : String(x));
    const nutri = (id, label, key, req) => '<div class="field"><label for="' + id + '">' + label + '</label><input class="input" id="' + id + '" type="number" inputmode="decimal" min="0" step="any"' + (req ? ' required' : ' placeholder="Facultatif"') + ' value="' + UI.esc(val(v[key])) + '"></div>';
    const check = (id, label, on) => '<label class="check"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span class="box">' + UI.icon('check') + '</span><span class="check-text">' + label + '</span></label>';
    const body =
      (item ? '' : '<details class="acc mb"><summary>' + UI.icon('search') + '<span>Partir d’un modèle indicatif</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack"><input class="input" type="search" id="f-search" placeholder="Pâtes, thon, lentilles…" aria-label="Chercher un modèle"><div class="list" id="f-results"></div><p class="hint">Valeurs moyennes indicatives : remplace-les par celles de ton étiquette.</p></div></details>') +
      '<form id="food-form" class="stack" novalidate autocomplete="off">' +
        '<div class="field"><label for="f-name">Nom de l’aliment</label><input class="input" id="f-name" maxlength="100" required placeholder="Ex. Conserves de lentilles" value="' + UI.esc(v.name) + '"></div>' +
        '<div class="grid-2 collapse"><div class="field"><label for="f-qty">Nombre d’unités</label><input class="input" id="f-qty" type="number" inputmode="decimal" min="0" max="100000" step="any" required value="' + UI.esc(val(v.quantity)) + '"></div>' +
        '<div class="field"><label for="f-mass">Poids consommable par unité (g)</label><input class="input" id="f-mass" type="number" inputmode="decimal" min="0.1" max="1000000" step="any" required placeholder="Ex. 400" value="' + UI.esc(val(v.mass)) + '"></div></div>' +
        '<p class="hint">Une unité = une boîte, un sachet ou une portion. Utilise le poids égoutté si les valeurs de l’étiquette concernent le produit égoutté.</p>' +
        '<details class="acc" open><summary><span>Valeurs pour 100 g</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack"><p class="hint">À copier de l’étiquette. Laisse vide une valeur inconnue : elle ne sera pas assimilée à zéro.</p><div class="grid-2">' +
          nutri('f-energy', 'Énergie (kcal)', 'energy', true) + nutri('f-protein', 'Protéines (g)', 'protein') + nutri('f-carbs', 'Glucides (g)', 'carbs') + nutri('f-fat', 'Lipides (g)', 'fat') + nutri('f-fibre', 'Fibres (g)', 'fibre') + nutri('f-salt', 'Sel (g)', 'salt') +
        '</div><p class="hint">Si tu utilises une estimation, vérifie la préparation et les unités. <a class="link" href="https://ciqual.anses.fr/" target="_blank" rel="noopener noreferrer">Table Ciqual (ANSES)</a></p></div></details>' +
        '<div class="grid-2 collapse"><div class="field"><label for="f-date">Date à vérifier</label><input class="input" id="f-date" type="date" value="' + UI.esc(v.date || '') + '"></div>' +
        '<div class="field"><label for="f-dtype">Type de date</label><select class="select" id="f-dtype"><option value="">Non précisé</option><option value="DLC"' + (v.dateType === 'DLC' ? ' selected' : '') + '>DLC : à ne pas dépasser</option><option value="DDM"' + (v.dateType === 'DDM' ? ' selected' : '') + '>DDM : de préférence avant</option></select></div></div>' +
        '<p class="hint">Une DLC dépassée n’est jamais comptée dans tes réserves ; une DDM dépassée reste comptée mais signalée. Vérifie l’emballage et la conservation avant toute consommation.</p>' +
        '<div class="check-list">' + check('f-stock', 'En stock', v.inStock !== false) + check('f-ready', 'Sans cuisson', v.ready !== false) + '</div>' +
      '</form>';
    let picked = v.cat || '';
    UI.sheet({
      title: item ? 'Modifier l’aliment' : 'Ajouter un aliment', body,
      actions: [{ label: 'Annuler' }, {
        label: 'Enregistrer', kind: 'primary',
        onClick: ctl => {
          const f = id => UI.$('#' + id, ctl.el);
          const name = f('f-name').value.trim();
          const qty = U.num(f('f-qty').value, null), mass = U.num(f('f-mass').value, null), energy = U.num(f('f-energy').value, null);
          const bad = [];
          if (!name) bad.push('f-name');
          if (qty === null || qty < 0) bad.push('f-qty');
          if (mass === null || mass <= 0) bad.push('f-mass');
          if (energy === null || energy < 0) bad.push('f-energy');
          UI.$$('.input', ctl.el).forEach(x => x.removeAttribute('aria-invalid'));
          if (bad.length) { bad.forEach(id => f(id).setAttribute('aria-invalid', 'true')); f(bad[0]).focus(); UI.toast('Complète les champs en rouge : nom, unités, poids et énergie sont nécessaires.', { tone: 'warn' }); return false; }
          const raw = { id: item ? item.id : U.uid('food'), name, quantity: qty, mass, inStock: f('f-stock').checked, ready: f('f-ready').checked, date: f('f-date').value, dateType: f('f-dtype').value, cat: picked, note: item ? item.note : '' };
          [['protein', 'f-protein'], ['carbs', 'f-carbs'], ['fat', 'f-fat'], ['fibre', 'f-fibre'], ['salt', 'f-salt']].forEach(([k, id]) => { raw[k] = U.num(f(id).value, null); });
          raw.energy = energy;
          const clean = State.normalize({ inventory: [raw] }).inventory[0];
          Vault.store.update(s => { const i = s.inventory.findIndex(x => x.id === clean.id); if (i < 0) s.inventory.push(clean); else s.inventory[i] = clean; }, 'inventory');
          UI.toast(item ? 'Aliment modifié.' : 'Aliment ajouté.', { tone: 'ok' });
        },
      }],
      onOpen: ctl => {
        const search = UI.$('#f-search', ctl.el);
        if (!search) return;
        const results = UI.$('#f-results', ctl.el);
        const draw = () => {
          const found = Catalog.search(search.value).slice(0, 8);
          results.innerHTML = found.map(f => '<button type="button" class="row" data-pick="' + f.id + '"><span class="row-main"><span class="row-title">' + UI.esc(f.name) + '</span><span class="row-sub">' + f.energy + ' kcal / 100 g · ' + f.mass + ' g l’unité</span></span></button>').join('') || '<p class="hint">Aucun modèle trouvé : saisis l’aliment à la main.</p>';
        };
        search.addEventListener('input', draw);
        draw();
        UI.on(results, 'click', '[data-pick]', (e, t) => {
          const food = Catalog.FOODS.find(x => x.id === t.dataset.pick);
          const set = (id, value) => { UI.$('#' + id, ctl.el).value = value == null ? '' : String(value); };
          set('f-name', food.name); set('f-qty', 1); set('f-mass', food.mass); set('f-energy', food.energy); set('f-protein', food.protein);
          set('f-carbs', food.carbs); set('f-fat', food.fat); set('f-fibre', food.fibre); set('f-salt', food.salt);
          UI.$('#f-ready', ctl.el).checked = food.ready;
          picked = food.cat;
          UI.$('#f-qty', ctl.el).focus();
          UI.toast('Modèle appliqué : ajuste les valeurs avec ton étiquette.', { icon: 'sparkles' });
        });
      },
    });
  }

  return { id: 'stock', mount, update };
})());


/* ==== js/51-view-prepare-kit.js ==== */
/* Préparer > Kit 72 h : checklist par catégories, besoins du foyer, compléments, éléments personnels, contrôles périodiques. */
Vault.prepare.register((() => {
  const U = VaultUtil, UI = VaultUI, Kit = VaultKit, Calc = VaultCalc;
  let root = null;
  const open = new Set(['water-food', 'power-comms', 'health', 'docs', 'comfort', 'household']);   // catégories dépliées
  const $ = sel => UI.$(sel, root);

  const checkRow = (item, extra) =>
    '<label class="check"><input type="checkbox" data-kit="' + item.id + '"' + (item.done ? ' checked' : '') + '><span class="box">' + UI.icon('check') + '</span>' +
    '<span class="check-text">' + UI.esc(item.label) + (item.hint ? '<span class="check-sub">' + UI.esc(item.hint) + '</span>' : '') + '</span>' + (extra || '') + '</label>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="kit-title"><div class="card-head"><div><div class="label">Mon kit</div><h2 id="kit-title"><span id="kit-done">0</span>/<span id="kit-total">0</span> prêts</h2></div><span class="chip chip-accent" id="kit-chip"></span></div>' +
        '<div class="meter" role="progressbar" aria-label="Progression du kit" aria-valuemin="0" aria-valuemax="100" id="kit-meter"><span id="kit-bar"></span></div>' +
        '<p class="hint mt-sm">Coche chaque élément une fois préparé. La progression contribue au score de préparation. Le kit d’urgence 72 h vise l’autonomie pendant 3 jours, en cas de coupures ou d’évacuation.</p></article>' +
      '<details class="acc" id="kit-needs"><summary>' + UI.icon('users') + '<span>Adapter la liste à mon foyer</span><span class="chip" id="kit-needs-count">0</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body">' +
        '<p class="hint">Chaque case ajoute trois éléments à ta checklist, comptés dans le score.</p><div class="stack mt-sm">' +
        Object.keys(Kit.NEEDS).map(k => '<label class="toggle-row"><span class="row-main"><span class="strong">' + UI.icon(Kit.NEEDS[k].icon) + ' ' + UI.esc(Kit.NEEDS[k].label) + '</span></span><span class="switch"><input type="checkbox" data-need="' + k + '" aria-label="' + UI.esc(Kit.NEEDS[k].label) + '"><span class="track"></span></span></label>').join('') +
        '</div></div></details>' +
      '<div class="stack" id="kit-groups"></div>' +
      '<article class="card" aria-labelledby="kit-checks-title"><div class="card-head"><div><div class="label">Entretien</div><h2 id="kit-checks-title">Contrôles périodiques</h2></div></div><p class="hint">Un kit n’est utile que s’il est à jour : note ici chaque vérification et VAULT te rappelle quand la refaire. La Sécurité civile recommande de contrôler le kit au moins une fois par an (dates des aliments et des médicaments, piles).</p><div class="list mt" id="kit-checks"></div></article>' +
      '<button type="button" class="btn btn-ghost btn-block" id="kit-print">' + UI.icon('printer') + 'Imprimer ma checklist</button>';

    UI.on(el, 'change', 'input[data-kit]', (e, t) => Vault.actions.toggleKit(t.dataset.kit, t.checked));
    UI.on(el, 'change', 'input[data-need]', (e, t) => { Vault.store.update(s => { s.needs[t.dataset.need] = t.checked; }, 'kit'); });
    UI.on(el, 'click', '[data-check]', (e, t) => { Vault.actions.markCheck(t.dataset.check); UI.toast('Contrôle noté pour aujourd’hui.', { tone: 'ok', icon: 'history' }); });
    UI.on(el, 'click', '[data-del-custom]', (e, t) => { Vault.store.update(s => { s.customKit = s.customKit.filter(x => x.id !== t.dataset.delCustom); }, 'kit'); UI.toast('Élément retiré.', { icon: 'trash-2' }); });
    el.addEventListener('toggle', e => {                                  // mémorise les catégories ouvertes ou fermées
      const d = e.target;
      if (d.dataset && d.dataset.cat) { if (d.open) open.add(d.dataset.cat); else open.delete(d.dataset.cat); }
    }, true);
    UI.on(el, 'submit', '#kit-add', (e, t) => {
      e.preventDefault();
      const input = t.querySelector('input');
      const label = input.value.trim();
      if (!label) { input.focus(); return; }
      if (Vault.store.get().customKit.length >= VaultState.LIMITS.customKit) { UI.toast('Tu as atteint le nombre maximal d’éléments personnels.', { tone: 'warn' }); return; }
      Vault.store.update(s => { s.customKit.push({ id: U.uid('c'), label: label.slice(0, 120), done: false }); }, 'kit');
      const again = $('#kit-add input');
      if (again) again.focus();
    });
    $('#kit-print').addEventListener('click', printKit);
  }

  function group(cat, items, opts = {}) {
    const done = items.filter(i => i.done).length;
    return '<details class="acc" data-cat="' + cat.id + '"' + (open.has(cat.id) ? ' open' : '') + '><summary>' + UI.icon(cat.icon) + '<span>' + UI.esc(opts.title || cat.label) + '</span><span class="chip ' + (done === items.length && items.length ? 'chip-ok' : '') + '">' + done + '/' + items.length + '</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary>' +
      '<div class="acc-body"><div class="check-list">' + items.map(i => checkRow(i, opts.removable ? '<button type="button" class="icon-btn small" data-del-custom="' + i.id + '" aria-label="Retirer ' + UI.esc(i.label) + '">' + UI.icon('trash-2') + '</button>' : '')).join('') + '</div>' + (opts.after || '') + '</div></details>';
  }

  function update(state) {
    if (!root) return;
    const k = Kit.kitItems(state);
    const prog = Kit.coreProgress(state);
    $('#kit-done').textContent = String(prog.done);
    $('#kit-total').textContent = String(prog.total);
    $('#kit-bar').style.width = (prog.ratio * 100).toFixed(1) + '%';
    $('#kit-meter').setAttribute('aria-valuenow', String(Math.round(prog.ratio * 100)));
    $('#kit-chip').textContent = Math.round(prog.ratio * 100) + ' %';
    UI.$$('input[data-need]', root).forEach(i => { i.checked = !!state.needs[i.dataset.need]; });
    $('#kit-needs-count').textContent = String(Object.values(state.needs).filter(Boolean).length);

    const focused = document.activeElement && root.contains(document.activeElement) ? (document.activeElement.dataset.kit || null) : null;
    const hasInput = document.activeElement && document.activeElement.closest && document.activeElement.closest('#kit-add');
    const typed = hasInput ? document.activeElement.value : '';
    const host = $('#kit-groups');
    let html = '';
    Kit.CATEGORIES.filter(c => c.id !== 'custom').forEach(cat => {
      const items = k.core.filter(i => i.cat === cat.id);
      if (items.length) html += group(cat, items);
    });
    const sup = { id: 'supplements', label: 'Compléments conseillés', icon: 'sparkles' };
    html += group(sup, k.supplements, { title: 'Compléments conseillés (facultatif)' });
    const custom = Kit.CATEGORIES.find(c => c.id === 'custom');
    html += group(custom, k.custom, { removable: true, after:
      '<form class="cluster nowrap mt" id="kit-add" autocomplete="off"><input class="input" maxlength="120" placeholder="Ajouter un élément (ex. lunettes de sécurité)" aria-label="Nouvel élément personnel"><button type="submit" class="btn btn-primary btn-icon" aria-label="Ajouter">' + UI.icon('plus') + '</button></form>' });
    host.innerHTML = html;
    if (hasInput) { const input = $('#kit-add input'); if (input) { input.value = typed; input.focus({ preventScroll: true }); } }
    if (focused) { const again = host.querySelector('[data-kit="' + focused + '"]'); if (again) again.focus({ preventScroll: true }); }

    const today = Vault.today();
    $('#kit-checks').innerHTML = Calc.reminders(state, today).map(r => {
      const last = state.checks[r.reminder.id];
      const status = r.level === 'never' ? ['chip', 'Jamais noté'] : r.level === 'overdue' ? ['chip chip-danger', 'En retard de ' + (-r.daysLeft) + ' j'] : r.level === 'soon' ? ['chip chip-warn', 'Dans ' + r.daysLeft + ' j'] : ['chip chip-ok', 'À jour'];
      const sub = last ? 'Dernier contrôle le ' + U.frDate(last) + ' · tous les ' + r.reminder.every + ' jours' : r.reminder.hint;
      return '<div class="row row-stack"><span class="row-icon ' + (r.level === 'overdue' ? 'danger' : r.level === 'soon' ? 'warn' : '') + '">' + UI.icon(r.reminder.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(r.reminder.label) + '</span><span class="row-sub">' + UI.esc(sub) + '</span></span><span class="row-end"><span class="' + status[0] + '">' + status[1] + '</span><button type="button" class="btn btn-soft btn-sm" data-check="' + r.reminder.id + '">Fait</button></span></div>';
    }).join('');
  }

  function printKit() {
    const state = Vault.store.get();
    const k = Kit.kitItems(state);
    const section = (title, items) => '<h2>' + UI.esc(title) + '</h2><ul>' + items.map(i => '<li><span class="box"></span>' + UI.esc(i.label) + '</li>').join('') + '</ul>';
    let html = '<h1>Kit d’urgence 72 h — VAULT</h1><p class="muted">Foyer : ' + state.people + ' ' + U.plural(state.people, 'personne', 'personnes') + ' · Imprimé le ' + U.frDate(Vault.today()) + '. À vérifier au moins une fois par an.</p>';
    Kit.CATEGORIES.filter(c => c.id !== 'custom').forEach(c => { const items = k.core.filter(i => i.cat === c.id); if (items.length) html += section(c.label, items); });
    html += section('Compléments conseillés', k.supplements);
    if (k.custom.length) html += section('Mes éléments', k.custom);
    Vault.actions.print(html);
  }

  return { id: 'kit', mount, update };
})());


/* ==== js/51-view-prepare-plan.js ==== */
/* Préparer > Plan : contacts à prévenir, points de rendez-vous, informations du logement, impression du plan. */
Vault.prepare.register((() => {
  const U = VaultUtil, UI = VaultUI;
  let root = null;
  const $ = sel => UI.$(sel, root);

  const FIELDS = [
    { key: 'meetNear', label: 'Point de rendez-vous proche', hint: 'Un lieu connu de tous, à pied du domicile (place, école, parc).', rows: 2 },
    { key: 'meetFar', label: 'Point de rendez-vous éloigné', hint: 'Si le quartier est inaccessible : une adresse dans une autre commune.', rows: 2 },
    { key: 'remoteContact', label: 'Personne à joindre hors de la région', hint: 'Quand les réseaux locaux sont saturés, un proche éloigné sert de relais pour tout le monde.', rows: 2 },
    { key: 'address', label: 'Adresse du logement', hint: 'Elle sera proposée dans le message à transmettre aux secours.', rows: 2 },
    { key: 'gas', label: 'Où couper le gaz', hint: 'Emplacement du robinet ou du compteur.', rows: 2 },
    { key: 'water', label: 'Où couper l’eau', hint: '', rows: 2 },
    { key: 'electricity', label: 'Où couper l’électricité', hint: 'Disjoncteur général.', rows: 2 },
    { key: 'documents', label: 'Où sont les documents et le kit', hint: '', rows: 2 },
    { key: 'pets', label: 'Animaux', hint: 'Nom, vétérinaire, lieu d’accueil possible.', rows: 2 },
    { key: 'notes', label: 'Autres informations', hint: 'Besoins particuliers, codes d’accès, voisins à prévenir…', rows: 3 },
  ];
  const ROLES = ['Famille', 'Ami ou voisin', 'Médecin ou santé', 'École ou travail', 'Autre'];
  const area = f => '<div class="field"><label for="plan-' + f.key + '">' + f.label + '</label><textarea class="textarea" id="plan-' + f.key + '" data-plan="' + f.key + '" rows="' + f.rows + '" maxlength="300" autocomplete="off"></textarea>' + (f.hint ? '<span class="hint">' + f.hint + '</span>' : '') + '</div>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="plan-contacts-title"><div class="card-head"><div><div class="label">Qui prévenir</div><h2 id="plan-contacts-title">Contacts d’urgence</h2></div><button type="button" class="btn btn-primary btn-sm" id="plan-add">' + UI.icon('plus') + 'Contact</button></div><div class="list" id="plan-contacts"></div></article>' +
      '<article class="card" aria-labelledby="plan-meet-title"><div class="card-head"><div><div class="label">Se retrouver</div><h2 id="plan-meet-title">Points de rendez-vous</h2></div></div><div class="stack">' + FIELDS.slice(0, 3).map(area).join('') + '</div></article>' +
      '<article class="card" aria-labelledby="plan-home-title"><div class="card-head"><div><div class="label">Logement</div><h2 id="plan-home-title">Informations pratiques</h2></div></div><div class="stack">' + FIELDS.slice(3).map(area).join('') + '</div></article>' +
      '<div class="cluster"><button type="button" class="btn btn-ghost" id="plan-print">' + UI.icon('printer') + 'Imprimer mon plan</button><button type="button" class="btn btn-ghost" id="plan-share">' + UI.icon('share-2') + 'Partager</button></div>' +
      '<p class="hint">Ces informations restent sur cet appareil. Un plan individuel de mise en sûreté (PIMS) officiel est proposé par la Sécurité civile : il complète ces notes avec les risques de ta commune.</p>';

    UI.on(el, 'input', 'textarea[data-plan]', (e, t) => { Vault.store.quiet(s => { s.plan[t.dataset.plan] = t.value.slice(0, t.dataset.plan === 'notes' ? 1000 : 300); }); });
    $('#plan-add').addEventListener('click', () => contactSheet(null));
    UI.on(el, 'click', '[data-edit-contact]', (e, t) => contactSheet(Vault.store.get().contacts.find(c => c.id === t.dataset.editContact)));
    UI.on(el, 'click', '[data-del-contact]', async (e, t) => {
      const c = Vault.store.get().contacts.find(x => x.id === t.dataset.delContact);
      if (c && await UI.confirm({ title: 'Supprimer ce contact ?', text: (c.name || c.phone) + ' sera retiré de tes contacts d’urgence.', confirmLabel: 'Supprimer', danger: true })) {
        Vault.store.update(s => { s.contacts = s.contacts.filter(x => x.id !== c.id); }, 'contacts');
        UI.toast('Contact supprimé.', { icon: 'trash-2' });
      }
    });
    $('#plan-print').addEventListener('click', () => Vault.actions.print(planHtml()));
    $('#plan-share').addEventListener('click', async () => {
      const r = await Vault.actions.share('Mon plan VAULT', planText());
      if (r === 'copied') UI.toast('Plan copié.', { tone: 'ok', icon: 'copy' });
    });
  }

  function contactSheet(contact) {
    const c = contact || { name: '', phone: '', role: ROLES[0], main: false };
    const body =
      '<form class="stack" id="contact-form" novalidate autocomplete="off">' +
        '<div class="field"><label for="c-name">Nom</label><input class="input" id="c-name" maxlength="80" value="' + UI.esc(c.name) + '" placeholder="Ex. Marie Dupont"></div>' +
        '<div class="field"><label for="c-phone">Téléphone</label><input class="input" id="c-phone" type="tel" inputmode="tel" maxlength="30" value="' + UI.esc(c.phone) + '" placeholder="Ex. 06 12 34 56 78"></div>' +
        '<div class="field"><label for="c-role">Lien</label><select class="select" id="c-role">' + ROLES.map(r => '<option' + (r === c.role ? ' selected' : '') + '>' + r + '</option>').join('') + (ROLES.includes(c.role) ? '' : '<option selected>' + UI.esc(c.role) + '</option>') + '</select></div>' +
        '<label class="toggle-row"><span class="row-main"><span class="strong">Personne à prévenir en priorité</span><span class="hint block">Elle apparaît en premier sur ta fiche vitale.</span></span><span class="switch"><input type="checkbox" id="c-main"' + (c.main ? ' checked' : '') + '><span class="track"></span></span></label>' +
      '</form>';
    UI.sheet({
      title: contact ? 'Modifier le contact' : 'Ajouter un contact', body,
      actions: [{ label: 'Annuler' }, {
        label: 'Enregistrer', kind: 'primary',
        onClick: ctl => {
          const name = UI.$('#c-name', ctl.el).value.trim(), phone = UI.$('#c-phone', ctl.el).value.trim();
          if (!name && !phone) { UI.$('#c-name', ctl.el).setAttribute('aria-invalid', 'true'); UI.$('#c-name', ctl.el).focus(); UI.toast('Saisis au moins un nom ou un numéro.', { tone: 'warn' }); return false; }
          if (!contact && Vault.store.get().contacts.length >= VaultState.LIMITS.contacts) { UI.toast('Tu as atteint le nombre maximal de contacts.', { tone: 'warn' }); return false; }
          const next = { id: contact ? contact.id : U.uid('ct'), name, phone, role: UI.$('#c-role', ctl.el).value, main: UI.$('#c-main', ctl.el).checked };
          const clean = VaultState.normalize({ contacts: [next] }).contacts[0];
          Vault.store.update(s => {
            if (clean.main) s.contacts.forEach(x => { x.main = false; });
            const i = s.contacts.findIndex(x => x.id === clean.id);
            if (i < 0) s.contacts.push(clean); else s.contacts[i] = clean;
            s.contacts.sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0));
          }, 'contacts');
          UI.toast(contact ? 'Contact modifié.' : 'Contact ajouté.', { tone: 'ok' });
        },
      }],
    });
  }

  const telHref = p => 'tel:' + String(p).replace(/[^\d+]/g, '');
  function update(state) {
    if (!root) return;
    UI.$$('textarea[data-plan]', root).forEach(t => { if (document.activeElement !== t) t.value = state.plan[t.dataset.plan] || ''; });
    $('#plan-contacts').innerHTML = state.contacts.length
      ? state.contacts.map(c => '<div class="row contact"><span class="row-icon ' + (c.main ? 'danger' : '') + '">' + UI.icon(c.main ? 'heart' : 'user') + '</span><span class="row-main"><span class="row-title">' + UI.esc(c.name || c.phone) + (c.main ? ' <span class="chip chip-danger">Prioritaire</span>' : '') + '</span><span class="row-sub">' + UI.esc(c.role) + (c.role && c.name && c.phone ? ' · ' : '') + (c.name && c.phone ? '<span class="tel">' + UI.esc(c.phone) + '</span>' : '') + '</span></span><span class="row-end">' +
        (c.phone ? '<a class="btn btn-soft btn-sm" href="' + telHref(c.phone) + '" aria-label="Appeler ' + UI.esc(c.name || c.phone) + '">' + UI.icon('phone') + 'Appeler</a>' : '') +
        '<button type="button" class="icon-btn small" data-edit-contact="' + c.id + '" aria-label="Modifier ' + UI.esc(c.name || c.phone) + '">' + UI.icon('pencil') + '</button>' +
        '<button type="button" class="icon-btn small" data-del-contact="' + c.id + '" aria-label="Supprimer ' + UI.esc(c.name || c.phone) + '">' + UI.icon('trash-2') + '</button></span></div>').join('')
      : '<div class="empty">' + UI.icon('users') + '<p>Aucun contact pour le moment. Ajoute une personne à prévenir et un proche hors de ta région.</p></div>';
  }

  function planText() {
    const s = Vault.store.get();
    const lines = ['PLAN — VAULT (' + U.frDate(Vault.today()) + ')', ''];
    if (s.contacts.length) { lines.push('CONTACTS'); s.contacts.forEach(c => lines.push('- ' + [c.name, c.phone, c.role].filter(Boolean).join(' · ') + (c.main ? ' (prioritaire)' : ''))); lines.push(''); }
    FIELDS.forEach(f => { if (s.plan[f.key]) lines.push(f.label.toUpperCase() + ' : ' + s.plan[f.key]); });
    return lines.join('\n');
  }
  function planHtml() {
    const s = Vault.store.get();
    let html = '<h1>Mon plan — VAULT</h1><p class="muted">Établi le ' + U.frDate(Vault.today()) + '</p>';
    if (s.contacts.length) html += '<h2>Contacts d’urgence</h2><table><tr><th>Nom</th><th>Téléphone</th><th>Lien</th></tr>' + s.contacts.map(c => '<tr><td>' + UI.esc(c.name) + (c.main ? ' (prioritaire)' : '') + '</td><td>' + UI.esc(c.phone) + '</td><td>' + UI.esc(c.role) + '</td></tr>').join('') + '</table>';
    html += '<h2>Informations</h2><table>' + FIELDS.filter(f => s.plan[f.key]).map(f => '<tr><th>' + UI.esc(f.label) + '</th><td>' + UI.esc(s.plan[f.key]).replace(/\n/g, '<br>') + '</td></tr>').join('') + '</table>';
    return html;
  }

  Vault.paper.plan = planHtml;

  return { id: 'plan', mount, update };
})());


/* ==== js/52-view-emergency.js ==== */
/* Urgences : numéros, « que dire aux secours » (message prêt à lire ou à envoyer par SMS au 114), position GPS,
 * fiche vitale (lisible en un geste, imprimable), contacts à prévenir. Tout reste sur l'appareil. */
Vault.registerView((() => {
  const U = VaultUtil, UI = VaultUI, N = VaultNumbers, State = VaultState;
  let root = null;
  let nature = 'health';
  let position = null;                                          // { lat, lon, acc } obtenue sur demande
  const $ = sel => UI.$(sel, root);
  const telHref = p => 'tel:' + String(p).replace(/[^\d+]/g, '');

  const bigCall = n => '<a class="call-btn' + (n.tone === 'danger' ? ' call-main' : '') + '" href="tel:' + n.num + '"><span class="call-num">' + n.num + '</span><span class="call-txt"><span class="call-title">' + UI.esc(n.title) + '</span><span class="call-desc">' + UI.esc(n.desc) + '</span></span>' + UI.icon('phone-call', 'call-ic') + '</a>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div class="page-head"><div><div class="eyebrow">Contacter</div><h1 id="h-emergency">Urgences</h1></div></div>' +
      '<div class="stack-lg">' +
        '<section class="stack" aria-label="Numéros d’urgence en France">' + bigCall(N.MAIN[0]) +
          '<div class="grid-3">' + N.MAIN.slice(1).map(n => '<a class="call-sm" href="tel:' + n.num + '"><span class="call-num">' + n.num + '</span><span class="call-sm-title">' + UI.esc(n.title) + '</span></a>').join('') + '</div>' +
          '<a class="call-btn call-sms" href="sms:' + N.SMS.num + '"><span class="call-num">' + N.SMS.num + '</span><span class="call-txt"><span class="call-title">' + UI.esc(N.SMS.title) + '</span><span class="call-desc">' + UI.esc(N.SMS.desc) + '</span></span>' + UI.icon('message-square', 'call-ic') + '</a>' +
          '<details class="acc"><summary>' + UI.icon('phone') + '<span>Autres numéros utiles</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body list">' +
            N.OTHER.map(n => '<a class="row" href="tel:' + n.num + '"><span class="row-icon">' + UI.icon('phone') + '</span><span class="row-main"><span class="row-title">' + n.num + ' · ' + UI.esc(n.title) + '</span><span class="row-sub">' + UI.esc(n.desc) + '</span></span></a>').join('') +
          '</div></details></section>' +

        '<article class="card" aria-labelledby="say-title"><div class="card-head"><div><div class="label">Que dire aux secours</div><h2 id="say-title">Préparer mon message</h2></div></div>' +
          '<ol class="steps">' + N.SAY_STEPS.map(s => '<li><b>' + UI.esc(s.title) + ' :</b> ' + UI.esc(s.text) + '</li>').join('') + '</ol><p class="hint">' + UI.esc(N.SAY_HINT) + '</p>' +
          '<div class="hr"></div>' +
          '<div class="field"><span class="field-label" id="nature-label">Nature de l’urgence</span><div class="chips" role="group" aria-labelledby="nature-label" id="say-nature">' + N.NATURES.map(n => '<button type="button" class="chip-btn" data-nature="' + n.id + '" aria-pressed="false">' + UI.esc(n.label) + '</button>').join('') + '</div></div>' +
          '<div class="stack mt"><div class="field"><label for="say-address">Adresse</label><input class="input" id="say-address" maxlength="200" autocomplete="street-address" placeholder="Rue, numéro, ville, étage, code"></div>' +
          '<div class="grid-2 collapse"><div class="field"><label for="say-people">Personnes concernées</label><input class="input" id="say-people" maxlength="40" placeholder="Ex. 2 adultes, 1 enfant"></div><div class="field"><label for="say-details">Précisions</label><input class="input" id="say-details" maxlength="300" placeholder="Ex. inconscient, respire"></div></div>' +
          '<button type="button" class="btn btn-ghost" id="say-gps">' + UI.icon('locate-fixed') + 'Ajouter ma position GPS</button><p class="hint" id="say-gps-status" role="status"></p>' +
          '<div class="say-output" id="say-output" aria-live="polite"></div>' +
          '<div class="actions-grid"><a class="btn btn-primary btn-lg" id="say-sms" href="#">' + UI.icon('message-square') + 'Écrire au 114</a><button type="button" class="btn btn-ghost" id="say-copy">' + UI.icon('copy') + 'Copier</button><button type="button" class="btn btn-ghost" id="say-share">' + UI.icon('share-2') + 'Partager</button></div></div></article>' +

        '<article class="card" aria-labelledby="ice-title"><div class="card-head"><div><div class="label">Fiche vitale</div><h2 id="ice-title">Ma fiche d’urgence</h2></div><span class="chip" id="ice-chip"></span></div><div id="ice-summary"></div>' +
          '<div class="actions-grid mt"><button type="button" class="btn btn-primary" id="ice-show">' + UI.icon('id-card') + 'Ouvrir la fiche</button><button type="button" class="btn btn-ghost" id="ice-edit">' + UI.icon('pencil') + 'Modifier</button><button type="button" class="btn btn-ghost" id="ice-print">' + UI.icon('printer') + 'Imprimer</button></div>' +
          '<p class="hint mt">Cette fiche reste sur l’appareil. Elle ne remplace pas la fiche santé (Médical ID) de ton téléphone, accessible écran verrouillé : remplis aussi celle-ci.</p></article>' +

        '<article class="card" aria-labelledby="em-contacts-title"><div class="card-head"><div><div class="label">Qui prévenir</div><h2 id="em-contacts-title">Mes contacts</h2></div><button type="button" class="btn btn-ghost btn-sm" data-go="prepare/plan">Gérer</button></div><div class="list" id="em-contacts"></div></article>' +
      '</div>';

    UI.on(el, 'click', '[data-go]', (e, t) => UI.Router.go(t.dataset.go));
    UI.on($('#say-nature'), 'click', '[data-nature]', (e, t) => { nature = t.dataset.nature; renderSay(); });
    ['say-address', 'say-people', 'say-details'].forEach(id => $('#' + id).addEventListener('input', renderSay));
    $('#say-address').addEventListener('change', () => { Vault.store.quiet(s => { s.plan.address = $('#say-address').value.slice(0, 300); }); });
    $('#say-gps').addEventListener('click', getPosition);
    $('#say-copy').addEventListener('click', async () => { UI.toast(await Vault.actions.copy(message()) ? 'Message copié.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' }); });
    $('#say-share').addEventListener('click', async () => { const r = await Vault.actions.share('Urgence', message()); if (r === 'copied') UI.toast('Message copié.', { tone: 'ok', icon: 'copy' }); });
    $('#ice-show').addEventListener('click', showCard);
    $('#ice-edit').addEventListener('click', editCard);
    $('#ice-print').addEventListener('click', () => Vault.actions.print(iceHtml(Vault.store.get())));
  }

  // ------------------------------------------------------------------ message aux secours
  function message() {
    return N.buildMessage({
      nature, address: $('#say-address').value.trim(), people: $('#say-people').value.trim(), details: $('#say-details').value.trim(),
      position: position ? position.lat.toFixed(5) + ', ' + position.lon.toFixed(5) + (position.acc ? ' (précision ' + Math.round(position.acc) + ' m)' : '') : '',
      name: Vault.store.get().ice.name,
    });
  }
  function renderSay() {
    UI.$$('[data-nature]', root).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.nature === nature)));
    const text = message();
    $('#say-output').textContent = text;
    $('#say-sms').setAttribute('href', N.smsLink(N.SMS.num, text));
  }
  function getPosition() {
    const status = $('#say-gps-status');
    if (!navigator.geolocation) { status.textContent = 'La géolocalisation n’est pas disponible sur ce navigateur.'; return; }
    status.textContent = 'Recherche de ta position…';
    navigator.geolocation.getCurrentPosition(p => {
      position = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy };
      status.textContent = 'Position ajoutée au message (précision environ ' + Math.round(p.coords.accuracy) + ' m).';
      renderSay();
    }, err => {
      status.textContent = err && err.code === 1 ? 'Accès à la position refusé. Autorise la localisation dans le navigateur.' : 'Position indisponible pour le moment. Réessaie à l’extérieur, ou donne l’adresse.';
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  }

  // ------------------------------------------------------------------ fiche vitale
  const iceRows = s => {
    const i = s.ice;
    const main = s.contacts.find(c => c.main) || s.contacts[0];
    return [
      ['Nom', i.name], ['Naissance', i.birth ? U.frDate(i.birth) : ''], ['Groupe sanguin', i.blood], ['Allergies', i.allergies], ['Traitements', i.treatments],
      ['Antécédents', i.conditions], ['Médecin', [i.doctor, i.doctorPhone].filter(Boolean).join(' · ')], ['À prévenir', main ? [main.name, main.phone].filter(Boolean).join(' · ') : ''], ['Autres informations', i.notes],
    ];
  };
  function showCard() {
    const s = Vault.store.get();
    const rows = iceRows(s).filter(r => r[1]);
    const main = s.contacts.find(c => c.main) || s.contacts[0];
    const body = rows.length
      ? '<dl class="ice-card">' + rows.map(r => '<div><dt>' + UI.esc(r[0]) + '</dt><dd>' + UI.esc(r[1]).replace(/\n/g, '<br>') + '</dd></div>').join('') + '</dl>' + (main && main.phone ? '<a class="btn btn-solid-danger btn-block btn-lg mt" href="' + telHref(main.phone) + '">' + UI.icon('phone-call') + 'Appeler ' + UI.esc(main.name || main.phone) + '</a>' : '')
      : '<div class="empty">' + UI.icon('id-card') + '<p>La fiche est vide. Remplis-la une fois, calmement : elle sera lisible en un geste en cas de besoin.</p></div>';
    UI.sheet({ title: 'Fiche d’urgence', body, actions: [{ label: 'Fermer' }, { label: 'Modifier', kind: 'primary', onClick: () => { setTimeout(editCard, 0); } }] });
  }
  function editCard() {
    const i = Vault.store.get().ice;
    const field = (id, label, value, extra) => '<div class="field"><label for="' + id + '">' + label + '</label>' + extra(id, value) + '</div>';
    const text = (id, v) => '<input class="input" id="' + id + '" maxlength="100" value="' + UI.esc(v) + '" autocomplete="off">';
    const area = (id, v) => '<textarea class="textarea" id="' + id + '" rows="2" maxlength="500" autocomplete="off">' + UI.esc(v) + '</textarea>';
    const body = '<form class="stack" id="ice-form" novalidate autocomplete="off">' +
      field('i-name', 'Nom et prénom', i.name, text) +
      '<div class="grid-2 collapse"><div class="field"><label for="i-birth">Date de naissance</label><input class="input" id="i-birth" type="date" value="' + UI.esc(i.birth) + '"></div><div class="field"><label for="i-blood">Groupe sanguin</label><select class="select" id="i-blood">' + State.BLOOD.map(b => '<option value="' + b + '"' + (b === i.blood ? ' selected' : '') + '>' + (b || 'Non renseigné') + '</option>').join('') + '</select></div></div>' +
      field('i-allergies', 'Allergies', i.allergies, area) + field('i-treatments', 'Traitements en cours', i.treatments, area) + field('i-conditions', 'Antécédents et maladies', i.conditions, area) +
      '<div class="grid-2 collapse"><div class="field"><label for="i-doctor">Médecin traitant</label>' + text('i-doctor', i.doctor) + '</div><div class="field"><label for="i-docphone">Téléphone du médecin</label><input class="input" id="i-docphone" type="tel" inputmode="tel" maxlength="30" value="' + UI.esc(i.doctorPhone) + '"></div></div>' +
      field('i-notes', 'Autres informations', i.notes, area) +
      '<p class="hint">La personne à prévenir est choisie parmi tes contacts (Préparer > Plan).</p></form>';
    UI.sheet({
      title: 'Ma fiche d’urgence', body, actions: [{ label: 'Annuler' }, {
        label: 'Enregistrer', kind: 'primary',
        onClick: ctl => {
          const v = id => UI.$('#' + id, ctl.el).value;
          const clean = State.normalize({ ice: { name: v('i-name').trim(), birth: v('i-birth'), blood: v('i-blood'), allergies: v('i-allergies').trim(), treatments: v('i-treatments').trim(), conditions: v('i-conditions').trim(), doctor: v('i-doctor').trim(), doctorPhone: v('i-docphone').trim(), notes: v('i-notes').trim() } }).ice;
          Vault.store.update(s => { s.ice = clean; }, 'ice');
          UI.toast('Fiche enregistrée sur cet appareil.', { tone: 'ok' });
        },
      }],
    });
  }
  function iceHtml(s) {
    const rows = iceRows(s).filter(r => r[1]);
    return '<h1>Fiche d’urgence</h1><p class="muted">Imprimée le ' + U.frDate(Vault.today()) + ' — VAULT</p><table>' + rows.map(r => '<tr><th>' + UI.esc(r[0]) + '</th><td class="big">' + UI.esc(r[1]).replace(/\n/g, '<br>') + '</td></tr>').join('') + '</table>' +
      (s.contacts.length ? '<h2>Contacts</h2><table>' + s.contacts.map(c => '<tr><td>' + UI.esc(c.name) + (c.main ? ' (prioritaire)' : '') + '</td><td>' + UI.esc(c.phone) + '</td><td>' + UI.esc(c.role) + '</td></tr>').join('') + '</table>' : '');
  }

  /** Page imprimable des numéros d'urgence et de ce qu'il faut dire aux secours (dossier papier). */
  function numbersHtml() {
    const rows = N.MAIN.concat([N.SMS], N.OTHER);
    return '<h1>Numéros d’urgence — France</h1><p class="muted">À garder avec ton kit. En danger ou en cas de doute : 112.</p>' +
      '<table><tr><th>Numéro</th><th>Service</th><th>Quand l’utiliser</th></tr>' + rows.map(n => '<tr><td class="big">' + UI.esc(n.num) + '</td><td>' + UI.esc(n.title) + '</td><td>' + UI.esc(n.desc) + '</td></tr>').join('') + '</table>' +
      '<h2>Que dire aux secours</h2><ol class="p-steps">' + N.SAY_STEPS.map(s => '<li><b>' + UI.esc(s.title) + ' :</b> ' + UI.esc(s.text) + '</li>').join('') + '</ol><p>' + UI.esc(N.SAY_HINT) + '</p>';
  }
  Vault.paper.numbers = numbersHtml;
  Vault.paper.ice = () => iceHtml(Vault.store.get());

  function update(state) {
    if (!root) return;
    const addr = $('#say-address');
    if (document.activeElement !== addr && !addr.value) addr.value = state.plan.address || '';
    renderSay();
    const filled = iceRows(state).filter(r => r[1] && r[0] !== 'À prévenir').length;
    $('#ice-chip').className = 'chip ' + (filled ? 'chip-ok' : 'chip-warn');
    $('#ice-chip').textContent = filled ? 'Renseignée' : 'À remplir';
    $('#ice-summary').innerHTML = filled
      ? '<dl class="kv">' + iceRows(state).filter(r => r[1] && ['Nom', 'Groupe sanguin', 'Allergies'].includes(r[0])).map(r => '<dt>' + UI.esc(r[0]) + '</dt><dd>' + UI.esc(r[1]) + '</dd>').join('') + '</dl>'
      : '<p class="muted">Groupe sanguin, allergies, traitements, personne à prévenir : renseigne l’essentiel en une minute.</p>';
    $('#em-contacts').innerHTML = state.contacts.length
      ? state.contacts.map(c => '<a class="row" href="' + (c.phone ? telHref(c.phone) : '#') + '"><span class="row-icon ' + (c.main ? 'danger' : '') + '">' + UI.icon(c.main ? 'heart' : 'user') + '</span><span class="row-main"><span class="row-title">' + UI.esc(c.name || c.phone) + '</span><span class="row-sub">' + UI.esc(c.role) + (c.role && c.name && c.phone ? ' · ' : '') + (c.name && c.phone ? '<span class="tel">' + UI.esc(c.phone) + '</span>' : '') + '</span></span><span class="row-end">' + UI.icon('phone') + '</span></a>').join('')
      : '<div class="empty">' + UI.icon('users') + '<p>Aucun contact enregistré.</p></div>';
  }

  return { id: 'emergency', title: 'Urgences', tab: 'emergency', mount, update };
})());


/* ==== js/53-view-guides.js ==== */
/* Guides : liste (recherche, catégories) et parcours pas à pas.
 * Le contenu vient de 13-data-guides.js (consignes officielles, sources citées). Tout fonctionne hors ligne. */
Vault.registerView((() => {
  const U = VaultUtil, UI = VaultUI, G = VaultGuides;
  const TONE = { urgent: 'danger', health: 'danger', natural: 'warn', network: 'info', alerts: 'ok' };
  const RESUME_MS = 10 * 60 * 1000;                       // on reprend un parcours interrompu (appel, autre écran) pendant 10 minutes
  let root = null;
  let query = '', cat = 'all';
  let session = null;                                     // { id, node, trail:[nœuds déjà vus], ts }
  let mode = '';                                          // 'list' | 'detail'
  const $ = sel => UI.$(sel, root);
  const catLabel = id => (G.CATEGORIES.find(c => c.id === id) || {}).label || '';
  const host = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return url; } };

  const guideRow = g => '<a class="row" href="#/guides/' + g.id + '"><span class="row-icon ' + TONE[g.cat] + '">' + UI.icon(g.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(g.title) + '</span><span class="row-sub">' + UI.esc(g.description) + '</span></span><span class="row-end">' + UI.icon('chevron-right') + '</span></a>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div id="g-list">' +
        '<div class="page-head"><div><div class="eyebrow">Savoir quoi faire</div><h1>Guides</h1></div></div>' +
        '<div class="stack-lg">' +
          '<div class="stack"><div class="search"><label class="sr-only" for="g-search">Rechercher un guide</label>' + UI.icon('search') +
            '<input class="input" id="g-search" type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Feu, gaz, saignement, inondation…"></div>' +
            '<div class="chips" id="g-cats" role="group" aria-label="Catégories"></div></div>' +
          '<div class="stack-lg" id="g-results" aria-live="polite"></div>' +
          '<article class="card" aria-labelledby="g-paper-title"><div class="card-head"><div><div class="label">Sur papier</div><h2 id="g-paper-title">Si le téléphone ne marche plus</h2></div></div><p class="muted">Imprime les consignes essentielles (numéros d’urgence, fiche d’urgence, plan, gestes qui sauvent) et range-les dans ton kit.</p><button type="button" class="btn btn-ghost btn-block mt" id="g-paper">' + UI.icon('printer') + 'Préparer mon dossier papier</button></article>' +
          '<p class="hint" id="g-foot"></p>' +
        '</div>' +
      '</div>' +
      '<div id="g-detail" hidden></div>';

    $('#g-search').addEventListener('input', e => { query = e.target.value; renderList(); });
    UI.on($('#g-cats'), 'click', '[data-cat]', (e, t) => { cat = t.dataset.cat; renderList(); });
    UI.on($('#g-detail'), 'click', '[data-next]', (e, t) => step(t.dataset.next));
    UI.on($('#g-detail'), 'click', '[data-act]', (e, t) => {
      if (!session) return;
      if (t.dataset.act === 'back' && session.trail.length) { session.node = session.trail.pop(); session.ts = Date.now(); renderDetail(true); }
      if (t.dataset.act === 'restart') { session.node = 'start'; session.trail = []; session.ts = Date.now(); renderDetail(true); }
      if (t.dataset.act === 'print') Vault.actions.print(guidePaper(G.byId(session.id)));
    });
    $('#g-paper').addEventListener('click', paperSheet);
    $('#g-foot').textContent = 'Résumé des consignes officielles (Sécurité civile, ministère de l’Intérieur, Croix-Rouge, GRDF). Sources vérifiées le ' + U.frDate(G.VERIFIED) + '. En cas de doute, appelle les secours : leur consigne et celle des autorités priment toujours.';
  }

  // ------------------------------------------------------------------ liste
  function renderList() {
    const filtered = !!query.trim() || cat !== 'all';
    $('#g-cats').innerHTML = [{ id: 'all', label: 'Tous', icon: 'list-filter' }].concat(G.CATEGORIES).map(c =>
      '<button type="button" class="chip-btn" data-cat="' + c.id + '" aria-pressed="' + (cat === c.id) + '">' + UI.icon(c.icon) + UI.esc(c.label) + '</button>').join('');
    const box = $('#g-results');
    if (!filtered) {
      box.innerHTML =
        '<section class="stack" aria-labelledby="g-quick-title"><div class="section-title"><h2 id="g-quick-title">À garder à portée de main</h2></div><div class="quick-grid">' +
          G.QUICK.map((id, i) => { const g = G.byId(id); return '<a class="tile' + (i === 0 ? ' tile-danger' : '') + '" href="#/guides/' + g.id + '"><span class="row-icon ' + TONE[g.cat] + '">' + UI.icon(g.icon) + '</span><span class="tile-title">' + UI.esc(g.title) + '</span><span class="tile-sub">' + UI.esc(g.description) + '</span></a>'; }).join('') +
        '</div></section>' +
        G.CATEGORIES.map(c => {
          const items = G.GUIDES.filter(g => g.cat === c.id);
          return '<section class="stack" aria-label="' + UI.esc(c.label) + '"><div class="section-title"><h2>' + UI.esc(c.label) + '</h2><span class="muted tiny">' + items.length + ' guides</span></div><div class="list">' + items.map(guideRow).join('') + '</div></section>';
        }).join('');
      return;
    }
    const results = G.search(query, cat);
    box.innerHTML = results.length
      ? '<section class="stack"><div class="section-title"><h2>' + results.length + ' ' + U.plural(results.length, 'guide', 'guides') + '</h2></div><div class="list">' + results.map(guideRow).join('') + '</div></section>'
      : '<div class="empty">' + UI.icon('search') + '<p>Aucun guide ne correspond' + (query.trim() ? ' à « ' + UI.esc(query.trim()) + ' »' : '') + '. Essaie un mot plus simple (gaz, feu, eau…).</p><p class="mt-sm"><b>En danger immédiat, appelle le 112.</b></p></div>';
  }

  // ------------------------------------------------------------------ papier
  /** Un guide sur papier : toutes les étapes numérotées dans l'ordre de lecture ; chaque réponse renvoie au numéro de l'étape suivante. */
  function guidePaper(g) {
    const order = [];
    const seen = new Set(['start']);
    const queue = ['start'];
    while (queue.length) {
      const id = queue.shift();
      order.push(id);
      g.nodes[id].choices.forEach(c => { if (!seen.has(c.next)) { seen.add(c.next); queue.push(c.next); } });
    }
    const number = id => order.indexOf(id) + 1;
    const steps = order.map(id => {
      const n = g.nodes[id];
      const calls = n.shortcuts.filter(s => s.phone).map(s => UI.esc(s.label.replace(/^Appeler\s+(le\s+|la\s+|l’)?/i, '')));
      return '<div class="p-step"><h3>Étape ' + number(id) + ' — ' + UI.esc(n.title) + '</h3>' +
        (n.actions.length ? '<ul>' + n.actions.map(a => '<li>' + UI.esc(a) + '</li>').join('') + '</ul>' : '') +
        (n.question ? '<p><b>' + UI.esc(n.question) + '</b></p>' : '') +
        (n.choices.length ? '<ul>' + n.choices.map(c => '<li>' + UI.esc(c.label) + ' → <b>étape ' + number(c.next) + '</b></li>').join('') + '</ul>' : '') +
        (calls.length ? '<p class="p-calls">À appeler : ' + calls.join(' · ') + '</p>' : '') + '</div>';
    }).join('');
    return '<h1>' + UI.esc(g.title) + '</h1><p class="muted">' + UI.esc(catLabel(g.cat)) + ' — ' + UI.esc(g.description) + '</p>' + steps +
      '<p class="muted">' + UI.esc(g.note || 'Ces consignes résument les sources officielles ; une consigne des secours ou des autorités prime toujours.') + '</p>' +
      '<p class="muted">Sources : ' + g.sources.map(s => UI.esc(s[0]) + ' (' + UI.esc(s[1]) + ')').join(' ; ') + ' — vérifiées le ' + U.frDate(G.VERIFIED) + '.</p>';
  }
  Vault.paper.guide = id => guidePaper(G.byId(id));

  /** Dossier papier : l'utilisateur choisit les parties ; chacune commence sur une nouvelle page. */
  function paperSheet() {
    const s = Vault.store.get();
    const hasIce = Object.values(s.ice).some(Boolean);
    const hasPlan = s.contacts.length > 0 || Object.values(s.plan).some(Boolean);
    const quick = G.QUICK.map(id => G.byId(id));
    const others = G.GUIDES.filter(g => !G.QUICK.includes(g.id));
    const opt = (id, label, sub, on) => '<label class="check"><input type="checkbox" id="pp-' + id + '"' + (on ? ' checked' : '') + '><span class="box">' + UI.icon('check') + '</span><span class="check-text">' + label + '<span class="check-sub">' + UI.esc(sub) + '</span></span></label>';
    UI.sheet({
      title: 'Dossier papier',
      body: '<p class="muted">Choisis ce qui t’est utile. Chaque partie commence sur une nouvelle page : range le tout dans ton kit d’urgence.</p><div class="check-list mt-sm">' +
        opt('numbers', 'Numéros d’urgence', '112, 15, 17, 18, 114… et ce qu’il faut dire aux secours', true) +
        opt('ice', 'Ma fiche d’urgence', hasIce ? 'Groupe sanguin, allergies, traitements, personne à prévenir' : 'Vide pour le moment : remplis-la dans Urgences', hasIce) +
        opt('plan', 'Mon plan', hasPlan ? 'Contacts, points de rendez-vous, coupures de gaz, d’eau et d’électricité' : 'Vide pour le moment : remplis-le dans Préparer, Plan', hasPlan) +
        opt('quick', 'Gestes qui sauvent', quick.map(g => g.title).join(', '), true) +
        opt('others', 'Les autres guides (' + others.length + ')', 'Incendie, gaz, inondation, séisme, coupure d’électricité…', false) + '</div>',
      actions: [{ label: 'Annuler' }, {
        label: 'Imprimer', kind: 'primary',
        onClick: ctl => {
          const on = id => UI.$('#pp-' + id, ctl.el).checked;
          const parts = [];
          if (on('numbers')) parts.push(Vault.paper.numbers());
          if (on('ice')) parts.push(Vault.paper.ice());
          if (on('plan')) parts.push(Vault.paper.plan());
          if (on('quick')) quick.forEach(g => parts.push(guidePaper(g)));
          if (on('others')) others.forEach(g => parts.push(guidePaper(g)));
          if (!parts.length) { UI.toast('Choisis au moins une partie à imprimer.', { tone: 'warn' }); return false; }
          Vault.actions.print(parts.join('<div class="pagebreak"></div>') + '<p class="muted">Dossier imprimé par VAULT le ' + U.frDate(Vault.today()) + '. Vérifie-le au moins une fois par an : numéros, coordonnées et consignes évoluent.</p>');
        },
      }],
    });
  }

  // ------------------------------------------------------------------ parcours
  const callBtn =s => '<a class="btn ' + (s.phone.length <= 3 ? 'btn-solid-danger' : 'btn-primary') + ' btn-lg btn-block" href="tel:' + s.phone + '">' + UI.icon('phone-call') + UI.esc(s.label) + '</a>';
  const shortcut = s => s.phone ? callBtn(s)
    : s.view ? '<a class="btn btn-ghost btn-block" href="#/' + s.view + '">' + UI.icon('arrow-right') + UI.esc(s.label) + '</a>'
      : '<a class="btn btn-ghost btn-block" href="#/guides/' + s.guide + '">' + UI.icon('book-open') + UI.esc(s.label) + '</a>';

  function renderDetail(focus) {
    const g = G.byId(session.id);
    const node = g.nodes[session.node] || g.nodes.start;
    const urgent = g.cat === 'urgent' || g.cat === 'health';
    const actions = node.actions.length > 1
      ? '<ol class="steps">' + node.actions.map(a => '<li>' + UI.esc(a) + '</li>').join('') + '</ol>'
      : node.actions.map(a => '<p class="lead">' + UI.esc(a) + '</p>').join('');
    const choices = node.choices.length
      ? (node.question ? '<p class="question">' + UI.esc(node.question) + '</p>' : '<div class="hr"></div>') +
        '<div class="stack">' + node.choices.map(c => '<button type="button" class="btn ' + (node.question ? 'btn-ghost' : 'btn-primary') + ' btn-lg btn-block choice" data-next="' + UI.esc(c.next) + '"><span>' + UI.esc(c.label) + '</span>' + UI.icon(node.question ? 'chevron-right' : 'arrow-right') + '</button>').join('') + '</div>'
      : '';
    const shortcuts = node.shortcuts.length ? '<div class="stack mt">' + node.shortcuts.map(shortcut).join('') + '</div>' : '';
    const nav = session.trail.length || session.node !== 'start'
      ? '<div class="actions-grid"><button type="button" class="btn btn-ghost" data-act="back"' + (session.trail.length ? '' : ' disabled') + '>' + UI.icon('chevron-left') + 'Étape précédente</button><button type="button" class="btn btn-ghost" data-act="restart">' + UI.icon('rotate-ccw') + 'Recommencer</button></div>'
      : '';
    const sources = '<details class="acc"><summary>' + UI.icon('badge-check') + '<span>Sources officielles</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body list">' +
      g.sources.map(s => '<a class="row" href="' + UI.esc(s[1]) + '" target="_blank" rel="noopener noreferrer"><span class="row-icon">' + UI.icon('external-link') + '</span><span class="row-main"><span class="row-title">' + UI.esc(s[0]) + '</span><span class="row-sub">' + UI.esc(host(s[1])) + '</span></span></a>').join('') +
      (Vault.online() ? '' : '<p class="hint">Hors ligne : les liens s’ouvriront quand tu auras du réseau.</p>') + '</div></details>';

    $('#g-detail').innerHTML =
      '<div class="page-head"><div><a class="back" href="#/guides">' + UI.icon('chevron-left') + 'Tous les guides</a><div class="eyebrow mt-sm">' + UI.esc(catLabel(g.cat)) + '</div><h1>' + UI.esc(g.title) + '</h1></div></div>' +
      '<div class="stack' + (urgent ? ' has-fab' : '') + '">' +
        '<article class="card step-card" aria-labelledby="g-step-title"><div class="label">Étape ' + (session.trail.length + 1) + '</div><h2 id="g-step-title" tabindex="-1">' + UI.esc(node.title) + '</h2>' + actions + choices + shortcuts + '</article>' +
        nav + sources +
        '<button type="button" class="btn btn-ghost btn-block" data-act="print">' + UI.icon('printer') + 'Imprimer ce guide</button>' +
        '<p class="hint">' + UI.esc(g.note || 'Ces consignes résument les sources officielles ci-dessus. Une consigne des secours ou des autorités prime toujours.') + '</p>' +
      '</div>' +
      (urgent ? '<a class="sos-fab" href="tel:112" aria-label="Appeler le 112">' + UI.icon('phone-call') + '<span>112</span></a>' : '');
    if (focus) { window.scrollTo(0, 0); const h = $('#g-step-title'); if (h) h.focus({ preventScroll: true }); }
  }

  function step(next) {
    const g = G.byId(session.id);
    if (!g || !g.nodes[next]) return;
    session.trail.push(session.node);
    session.node = next;
    session.ts = Date.now();
    UI.haptic(8);
    renderDetail(true);
  }

  // ------------------------------------------------------------------ cycle de vie
  function enter(parts) {
    const g = parts[0] ? G.byId(parts[0]) : null;
    const previous = mode;
    if (!g) {
      mode = 'list';
      $('#g-list').hidden = false; $('#g-detail').hidden = true;
      const input = $('#g-search');
      if (document.activeElement !== input) input.value = query;
      renderList();
      if (previous === 'detail') window.scrollTo(0, 0);
      return;
    }
    mode = 'detail';
    if (!session || session.id !== g.id || Date.now() - session.ts > RESUME_MS) session = { id: g.id, node: 'start', trail: [], ts: Date.now() };
    $('#g-list').hidden = true; $('#g-detail').hidden = false;
    renderDetail(previous !== 'detail');
  }

  return { id: 'guides', title: 'Guides', tab: 'guides', mount, enter };
})());


/* ==== js/54-view-tools.js ==== */
/* Outils : accueil des outils et conteneur. Chaque outil (Signal, Alarme, Écoute, Position, Codes) s'enregistre avec
 * Vault.tools.register({ id, title, eyebrow, desc, icon, tone, mount(el), enter(), leave(reason), update(state, what) }).
 * `leave` est appelée en quittant l'outil, l'écran, ou quand la page est masquée : lampe, micro, caméra et sons s'arrêtent. */
Vault.tools = { panels: {}, order: [], register(panel) { this.panels[panel.id] = panel; this.order.push(panel.id); } };

Vault.registerView((() => {
  const UI = VaultUI;
  let root = null;
  let current = null;
  const $ = sel => UI.$(sel, root);
  const panel = id => (id ? Vault.tools.panels[id] : null);

  function mount(el) {
    root = el;
    const list = Vault.tools.order.map(id => Vault.tools.panels[id]);
    el.innerHTML =
      '<div id="tools-hub">' +
        '<div class="page-head"><div><div class="eyebrow">Se signaler et s’orienter</div><h1>Outils</h1></div></div>' +
        '<div class="stack-lg"><div class="quick-grid" id="tools-grid">' +
          list.map(p => '<a class="tile" href="#/tools/' + p.id + '"><span class="row-icon ' + (p.tone || '') + '">' + UI.icon(p.icon) + '</span><span class="tile-title">' + UI.esc(p.title) + '</span><span class="tile-sub">' + UI.esc(p.desc) + '</span></a>').join('') +
        '</div>' +
        '<div class="callout">' + UI.icon('shield-check') + '<div>Micro, caméra et position servent uniquement à l’outil ouvert : traitement sur ton téléphone, rien n’est enregistré ni envoyé. Tout s’arrête quand tu quittes l’outil.</div></div></div>' +
      '</div>' +
      '<div id="tools-panel" hidden>' +
        '<div class="page-head"><div><a class="back" href="#/tools">' + UI.icon('chevron-left') + 'Outils</a><div class="eyebrow mt-sm" id="tp-eyebrow"></div><h1 id="tp-title"></h1></div></div>' +
        '<div id="tools-host">' + list.map(p => '<div class="stack-lg tool-host" id="tool-' + p.id + '" hidden></div>').join('') + '</div>' +
      '</div>';
    list.forEach(p => { if (p.mount) p.mount(UI.$('#tool-' + p.id, el)); });
    // Page masquée (écran verrouillé, autre application) : on coupe tout ce qui utilise lampe, micro, caméra ou son.
    document.addEventListener('visibilitychange', () => {
      const p = document.hidden ? panel(current) : null;
      if (p && p.leave) p.leave('hidden');
    });
  }

  function show(id) {
    const previous = current;
    if (previous && previous !== id && panel(previous) && panel(previous).leave) panel(previous).leave('nav');
    current = id;
    const p = panel(id);
    $('#tools-hub').hidden = !!p;
    $('#tools-panel').hidden = !p;
    if (!p) { if (previous) window.scrollTo(0, 0); return; }
    $('#tp-eyebrow').textContent = p.eyebrow || '';
    $('#tp-title').textContent = p.title;
    UI.$$('.tool-host', root).forEach(h => { h.hidden = h.id !== 'tool-' + id; });
    document.title = p.title + ' — VAULT';
    if (previous !== id) window.scrollTo(0, 0);
    if (p.enter) p.enter();
    if (p.update) p.update(Vault.store.get(), 'enter');
  }
  function enter(parts) { show(panel(parts[0]) ? parts[0] : null); }
  function leave() { const p = panel(current); if (p && p.leave) p.leave('nav'); }
  function update(state, what) {
    if (what === 'enter') return;                               // enter() a déjà mis à jour l'outil affiché
    const p = panel(current);
    if (p && p.update) p.update(state, what);
  }
  return { id: 'tools', title: 'Outils', tab: 'tools', mount, enter, leave, update };
})());


/* ==== js/55-view-signal.js ==== */
/* Outil Signal Morse : émettre (lampe, son, vibration), recevoir (micro ou caméra) et apprendre le code.
 * La lampe se commande par la caméra arrière (aucune image enregistrée) ; l'écran ne clignote jamais. */
Vault.tools.register((() => {
  const U = VaultUtil, UI = VaultUI, M = VaultMorse, Tx = VaultTx;
  const PRESETS = ['SOS', 'AIDE', 'OK', 'OUI', 'NON'];
  const SPEEDS = [{ label: 'Lent', unit: 450 }, { label: 'Normal', unit: 300 }, { label: 'Rapide', unit: 200 }];
  const SUBS = [{ id: 'tx', label: 'Émettre', icon: 'radio-tower' }, { id: 'rx', label: 'Recevoir', icon: 'ear' }, { id: 'learn', label: 'Apprendre', icon: 'graduation-cap' }];
  const LEARN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?/-'.split('');

  let root = null;
  let sub = 'tx';
  let text = '';                                            // message en cours, conservé tant que la page reste ouverte
  let torch = null, tx = null, sensors = null;
  let torchInfo = { ready: false, busy: false, active: false };
  let torchWarn = false;
  let cameras = [], cameraId = '';
  let running = false, runKind = null, usedTorch = false;  // émission en cours ; 'tx' (message) ou 'learn' (un caractère)
  let rxRunning = false, rxMode = 'audio';
  const rxOptions = { unit: 300, auto: true, autoFreq: true, freq: 700, threshold: -45, autoThreshold: true };
  let audioThreshold = -45, lightThreshold = 60;
  let live = { letter: -2, on: null };
  let rxShown = { morse: null, text: null, lit: null, unit: null, level: null };

  const $ = sel => UI.$(sel, root);
  const sig = () => Vault.store.get().signal;
  const setSig = fn => Vault.store.update(s => fn(s.signal), 'signal');
  const fmtSeconds = ms => { const s = Math.round(ms / 100) / 10; return s < 60 ? U.fmt(s, 1) + ' s' : Math.floor(s / 60) + ' min ' + String(Math.round(s % 60)).padStart(2, '0') + ' s'; };
  const codeHtml = code => [...code].map(c => (c === '.' ? '<i class="dit"></i>' : '<i class="dah"></i>')).join('');
  const toggle = (id, icon, label, subId) => '<label class="toggle-row"><span class="row-main"><span class="row-title">' + UI.icon(icon) + ' ' + label + '</span><span class="row-sub" id="' + subId + '"></span></span><span class="switch"><input type="checkbox" id="' + id + '"><span class="track"></span></span></label>';
  const stepper = (id, label, min, max, step, unit, hint) =>
    '<div class="field"><label for="' + id + '">' + label + '</label><div class="stepper"><button type="button" data-step-for="' + id + '" data-step="-' + step + '" aria-label="Diminuer">' + UI.icon('minus') + '</button><input id="' + id + '" type="number" inputmode="numeric" min="' + min + '" max="' + max + '" step="' + step + '"><span class="stepper-unit">' + unit + '</span><button type="button" data-step-for="' + id + '" data-step="' + step + '" aria-label="Augmenter">' + UI.icon('plus') + '</button></div>' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</div>';

  // ------------------------------------------------------------------ structure
  const txHtml = () =>
    '<article class="card" aria-labelledby="sg-msg-title"><div class="card-head"><div><div class="label">Émettre</div><h2 id="sg-msg-title">Mon message</h2></div></div>' +
      '<div class="field"><label class="sr-only" for="sg-text">Message à émettre</label><textarea class="textarea" id="sg-text" rows="2" maxlength="160" placeholder="Ex. BESOIN AIDE" autocapitalize="characters" autocomplete="off" spellcheck="false"></textarea></div>' +
      '<div class="chips mt-sm" role="group" aria-label="Messages courts">' + PRESETS.map(p => '<button type="button" class="chip-btn" data-preset="' + p + '">' + p + '</button>').join('') + '</div>' +
      '<div class="morse-strip mt" id="sg-strip" role="img" aria-label="Aperçu du message en Morse"></div>' +
      '<p class="hint mt-sm" id="sg-meta"></p><div class="callout callout-warn mt-sm" id="sg-unknown" hidden>' + UI.icon('triangle-alert') + '<div></div></div></article>' +

    '<article class="card" aria-labelledby="sg-ch-title"><div class="card-head"><div><div class="label">Moyens d’émission</div><h2 id="sg-ch-title">Lampe, son, vibration</h2></div></div>' +
      toggle('sg-torch', 'flashlight', 'Lampe du téléphone', 'sg-torch-sub') +
      toggle('sg-sound', 'volume-2', 'Son (bips)', 'sg-sound-sub') +
      toggle('sg-vibrate', 'vibrate', 'Vibration', 'sg-vibrate-sub') +
      '<div class="hr"></div><div class="stack">' +
      stepper('sg-unit', 'Durée d’un point', 100, 1200, 10, 'ms', 'Règle les deux téléphones sur la même durée. Plus long = plus facile à lire de loin.') +
      '<div class="chips" id="sg-speeds" role="group" aria-label="Vitesses prédéfinies">' + SPEEDS.map(s => '<button type="button" class="chip-btn" data-speed="' + s.unit + '" aria-pressed="false">' + s.label + ' <span class="num">' + s.unit + '</span></button>').join('') + '</div>' +
      '<div class="field" id="sg-freq-field"><label for="sg-freq">Hauteur du bip : <span id="sg-freq-val" class="num"></span></label><input type="range" id="sg-freq" min="400" max="1200" step="50"><div><button type="button" class="btn btn-ghost btn-sm" id="sg-beep">' + UI.icon('volume-2') + 'Tester le bip</button></div></div>' +
      toggle('sg-repeat', 'refresh-cw', 'Répéter jusqu’à l’arrêt', 'sg-repeat-sub') +
      '<div class="callout callout-warn" id="sg-rate" hidden>' + UI.icon('triangle-alert') + '<div>À cette vitesse, la lampe clignote plus de 3 fois par seconde. Évite de la fixer si tu es sensible aux lumières clignotantes ; choisis un point plus long.</div></div></div></article>' +

    '<article class="card card-accent" aria-labelledby="sg-go-title"><div class="card-head"><div><div class="label">Émission</div><h2 id="sg-go-title">Prêt à émettre</h2></div></div>' +
      '<div class="sg-live" id="sg-live" aria-hidden="true" hidden><span class="lamp" id="sg-lamp"></span><span class="sg-live-letter" id="sg-live-letter">·</span><div class="meter" id="sg-progress-meter"><span id="sg-progress"></span></div></div>' +
      '<div class="stack mt">' +
        '<button type="button" class="btn btn-primary btn-lg btn-block" id="sg-play"></button>' +
        '<button type="button" class="btn btn-solid-danger btn-lg btn-block" id="sg-stop" hidden>' + UI.icon('square') + 'Arrêter</button>' +
        '<div class="row-actions" id="sg-torch-actions"><button type="button" class="btn btn-ghost" id="sg-prepare">' + UI.icon('flashlight') + 'Vérifier la lampe</button><button type="button" class="btn btn-ghost" id="sg-test">' + UI.icon('lightbulb') + 'Tester 1 s</button><button type="button" class="btn btn-ghost" id="sg-release">' + UI.icon('camera') + 'Libérer la caméra</button></div>' +
        '<div class="field" id="sg-camera-field" hidden><label for="sg-camera">Caméra associée à la lampe</label><select class="select" id="sg-camera"></select></div>' +
      '</div>' +
      '<p class="status mt" id="sg-status" role="status" data-tone="info" hidden></p>' +
      '<p class="hint mt-sm">La lampe arrière envoie le Morse ; l’accès à la caméra sert uniquement à la commander, aucune image n’est enregistrée ni envoyée. Garde le téléphone déverrouillé avec VAULT visible : quitter l’écran, masquer l’application ou toucher Arrêter coupe la lampe et libère la caméra.</p>' +
      '<video id="sg-video" class="torch-video" autoplay muted playsinline aria-hidden="true" tabindex="-1"></video></article>';

  const rxHtml = () =>
    '<article class="card" aria-labelledby="rx-title"><div class="card-head"><div><div class="label">Recevoir</div><h2 id="rx-title">Lecteur de Morse</h2></div></div>' +
      '<p class="muted">Écoute des bips réguliers ou vise des flashs avec la caméra : le message s’affiche au fil de la réception.</p>' +
      '<div class="seg mt" role="group" aria-label="Source du Morse"><button type="button" data-rxmode="audio" aria-pressed="true">' + UI.icon('mic') + 'Micro · bips</button><button type="button" data-rxmode="camera" aria-pressed="false">' + UI.icon('camera') + 'Caméra · flashs</button></div>' +
      '<div class="camera-frame mt" id="rx-frame" hidden><video id="rx-video" autoplay muted playsinline></video><span class="camera-reticle" aria-hidden="true"></span></div>' +
      '<div class="actions-grid mt"><button type="button" class="btn btn-primary btn-lg" id="rx-start">' + UI.icon('play') + 'Commencer la réception</button><button type="button" class="btn btn-ghost" id="rx-stop" disabled>' + UI.icon('square') + 'Arrêter</button><button type="button" class="btn btn-ghost" id="rx-clear">' + UI.icon('rotate-ccw') + 'Effacer</button></div>' +
      '<p class="status mt-sm" id="rx-status" role="status" data-tone="info"></p>' +
      '<div class="rx-live mt"><span class="lamp" id="rx-lamp" aria-hidden="true"></span><span class="strong" id="rx-level-text">Aucun signal</span><span class="muted tiny num" id="rx-unit"></span></div><div class="meter mt-sm"><span id="rx-meter"></span></div>' +
      '<div class="label mt">Morse reçu</div><div class="morse-output" id="rx-morse">—</div>' +
      '<div class="label mt">Message traduit</div><div class="received-text" id="rx-text" aria-live="polite" aria-atomic="true">—</div>' +
      '<div class="cluster mt"><button type="button" class="btn btn-ghost btn-sm" id="rx-copy">' + UI.icon('copy') + 'Copier le message</button></div></article>' +
    '<details class="acc" id="rx-adv"><summary>' + UI.icon('sliders-horizontal') + '<span>Réglages de réception</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack">' +
      toggle('rx-auto-speed', 'gauge', 'Vitesse automatique', 'rx-auto-speed-sub') +
      stepper('rx-unit-in', 'Durée d’un point attendue', 60, 1200, 10, 'ms', '') +
      '<div id="rx-audio-set" class="stack">' + toggle('rx-auto-freq', 'audio-lines', 'Repérer la hauteur du bip', 'rx-auto-freq-sub') + stepper('rx-freq', 'Hauteur du bip', 200, 3000, 50, 'Hz', '') + '</div>' +
      toggle('rx-auto-thr', 'sliders-horizontal', 'Seuil automatique', 'rx-auto-thr-sub') +
      '<div class="field"><label for="rx-thr">Seuil de détection : <span id="rx-thr-val" class="num"></span></label><input type="range" id="rx-thr"><span class="hint" id="rx-thr-hint"></span></div>' +
    '</div></details>' +
    '<p class="hint">Les bruits, les reflets et les flashs irréguliers peuvent produire des erreurs ; « ? » signale une séquence inconnue. Tout est analysé sur ton téléphone, en direct : rien n’est enregistré ni envoyé, et les capteurs s’arrêtent en quittant l’écran ou en masquant l’application.</p>';

  const learnHtml = () =>
    '<article class="card" aria-labelledby="ln-title"><div class="card-head"><div><div class="label">Alphabet</div><h2 id="ln-title">Lettres et chiffres</h2></div></div>' +
      '<p class="hint">Un point dure 1, un trait 3. Entre deux signes : 1 ; entre deux lettres : 3 ; entre deux mots : 7. Touche un caractère pour l’entendre.</p>' +
      '<div class="mgrid mt-sm" id="ln-grid">' + LEARN_CHARS.map(ch => '<button type="button" class="mcell" data-char="' + ch + '" aria-label="' + ch + ' en Morse"><b>' + ch + '</b><span class="mcode">' + codeHtml(M.ALPHABET[ch]) + '</span></button>').join('') + '</div></article>' +
    '<article class="card" aria-labelledby="ln-pro-title"><div class="card-head"><div><div class="label">Signaux de procédure</div><h2 id="ln-pro-title">Abréviations</h2></div></div><div class="list">' +
      Object.keys(M.PROSIGNS).map(k => '<div class="row"><span class="row-icon">' + (k === 'SOS' ? UI.icon('life-buoy') : UI.icon('radio')) + '</span><span class="row-main"><span class="row-title">' + k + ' · ' + UI.esc(M.PROSIGN_MEANING[k]) + '</span><span class="row-sub mcode">' + codeHtml(M.PROSIGNS[k]) + '</span></span></div>').join('') +
    '</div><p class="hint mt-sm">Dans ton message, écris un signal entre chevrons pour l’envoyer d’un seul tenant, par exemple &lt;AR&gt;.</p></article>' +
    '<article class="card" aria-labelledby="ln-tr-title"><div class="card-head"><div><div class="label">Traducteur</div><h2 id="ln-tr-title">Lire du Morse</h2></div></div>' +
      '<div class="field"><label for="ln-input">Points et traits</label><textarea class="textarea" id="ln-input" rows="2" placeholder="... --- ... / -.- --- -.-" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea><span class="hint">Un espace entre les lettres, « / » entre les mots.</span></div>' +
      '<div class="received-text mt-sm" id="ln-output" aria-live="polite">—</div></article>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div class="seg" role="tablist" aria-label="Signal Morse">' + SUBS.map(s => '<button type="button" role="tab" data-sub="' + s.id + '" id="sg-tab-' + s.id + '" aria-controls="sg-' + s.id + '" aria-selected="false">' + UI.icon(s.icon) + s.label + '</button>').join('') + '</div>' +
      '<div class="stack-lg" id="sg-tx" role="tabpanel" aria-labelledby="sg-tab-tx">' + txHtml() + '</div>' +
      '<div class="stack-lg" id="sg-rx" role="tabpanel" aria-labelledby="sg-tab-rx" hidden>' + rxHtml() + '</div>' +
      '<div class="stack-lg" id="sg-learn" role="tabpanel" aria-labelledby="sg-tab-learn" hidden>' + learnHtml() + '</div>';

    // --- moteurs
    torch = VaultTorch.create({
      video: $('#sg-video'),
      status: (message, tone) => { torchWarn = tone === 'warn'; UI.setStatus($('#sg-status'), message, tone); refreshTx(); },
      changed: info => { torchInfo = info; refreshTx(); },
      cameras: list => { cameras = list; renderCameras(); },
      device: () => cameraId,
      beforeStart: () => { sensors.stop('exclusive'); },
    });
    tx = Tx.createTransmitter({
      torch,
      status: (message, tone) => UI.setStatus($('#sg-status'), message, tone),
      progress: onProgress,
      ended: onEnded,
    });
    sensors = VaultSensors.create({
      status: (message, tone) => UI.setStatus($('#rx-status'), message, tone),
      frame: onFrame,
      stopped: onSensorStopped,
      beforeStart: () => { tx.stop('exclusive'); torch.stop(); },
    });

    // --- onglets
    UI.on(el, 'click', '[data-sub]', (e, t) => showSub(t.dataset.sub));

    // --- émission : message
    $('#sg-text').addEventListener('input', e => { text = e.target.value; renderStrip(); refreshTx(); });
    UI.on(el, 'click', '[data-preset]', (e, t) => { text = t.dataset.preset; $('#sg-text').value = text; renderStrip(); refreshTx(); });
    // --- émission : moyens et vitesse
    [['sg-torch', 'torch'], ['sg-sound', 'sound'], ['sg-vibrate', 'vibrate'], ['sg-repeat', 'repeat']].forEach(([id, key]) => {
      $('#' + id).addEventListener('change', e => {
        setSig(s => { s[key] = e.target.checked; });
        if (key === 'torch' && !e.target.checked) torch.stop();
      });
    });
    $('#sg-unit').addEventListener('change', e => { const v = clampUnit(e.target.value, 100); e.target.value = String(v); setSig(s => { s.unit = v; }); renderStrip(); });
    UI.on(el, 'click', '[data-speed]', (e, t) => { setSig(s => { s.unit = +t.dataset.speed; }); renderStrip(); });
    $('#sg-freq').addEventListener('input', e => { setSig(s => { s.freq = +e.target.value; }); });
    $('#sg-beep').addEventListener('click', async () => {
      const ok = await Tx.testBeep(sig().freq);
      if (!ok) UI.toast('Le son n’a pas pu démarrer sur ce navigateur.', { tone: 'warn' });
    });
    UI.on(el, 'click', '[data-step-for]', (e, t) => {
      const input = $('#' + t.dataset.stepFor);
      const lo = +input.min, hi = +input.max;
      input.value = String(U.clamp((+input.value || lo) + (+t.dataset.step), lo, hi));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    $('#sg-camera').addEventListener('change', e => { cameraId = e.target.value; if (torchInfo.active) { torch.stop(); UI.setStatus($('#sg-status'), 'Caméra changée : vérifie à nouveau la lampe.', 'info'); } });
    // --- émission : actions
    $('#sg-prepare').addEventListener('click', () => { tx.stop('exclusive'); torch.prepare(); });
    $('#sg-test').addEventListener('click', () => { torch.run([{ on: true, ms: 1000 }], { test: true }); });
    $('#sg-release').addEventListener('click', () => { torch.stop(); });
    $('#sg-play').addEventListener('click', onPlay);
    $('#sg-stop').addEventListener('click', () => { tx.stop('stopped'); });

    // --- réception
    UI.on(el, 'click', '[data-rxmode]', (e, t) => {
      if (rxRunning) { sensors.stop('mode'); }
      rxMode = t.dataset.rxmode;
      refreshRx();
    });
    $('#rx-start').addEventListener('click', rxStart);
    $('#rx-stop').addEventListener('click', () => { sensors.stop('user'); UI.setStatus($('#rx-status'), 'Réception arrêtée. Capteur libéré.', 'info'); });
    $('#rx-clear').addEventListener('click', () => { sensors.reset(); rxShown = { morse: null, text: null, lit: null, unit: null, level: null }; renderRx({ morse: '', text: '', unit: null }); });
    $('#rx-copy').addEventListener('click', async () => {
      const t = $('#rx-text').textContent;
      if (!t || t === '—') { UI.toast('Aucun message reçu pour le moment.', { icon: 'info' }); return; }
      UI.toast(await Vault.actions.copy(t) ? 'Message copié.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' });
    });
    $('#rx-auto-speed').addEventListener('change', e => { rxOptions.auto = e.target.checked; sensors.setAuto(rxOptions.auto); refreshRx(); });
    $('#rx-unit-in').addEventListener('change', e => { const v = clampUnit(e.target.value, 60); e.target.value = String(v); setSig(s => { s.rxUnit = v; }); rxOptions.unit = v; sensors.setUnit(v); });
    $('#rx-auto-freq').addEventListener('change', e => { rxOptions.autoFreq = e.target.checked; refreshRx(); });
    $('#rx-freq').addEventListener('change', e => { const v = U.clamp(Math.round(+e.target.value || 700), 200, 3000); e.target.value = String(v); setSig(s => { s.freq = v; }); rxOptions.freq = v; });
    $('#rx-auto-thr').addEventListener('change', e => { rxOptions.autoThreshold = e.target.checked; refreshRx(); });
    $('#rx-thr').addEventListener('input', e => { if (rxMode === 'audio') audioThreshold = +e.target.value; else lightThreshold = +e.target.value; rxOptions.threshold = +e.target.value; refreshRx(); });

    // --- apprendre
    UI.on(el, 'click', '[data-char]', async (e, t) => {
      sensors.stop('exclusive');
      runKind = 'learn';
      const ok = await tx.play({ text: t.dataset.char, unit: sig().unit, sound: true, torch: false, vibrate: false, freq: sig().freq, volume: 0.7 });
      if (!ok) { runKind = null; UI.toast('Le son n’a pas pu démarrer sur ce navigateur.', { tone: 'warn' }); }
    });
    $('#ln-input').addEventListener('input', e => { const out = M.translate(e.target.value); $('#ln-output').textContent = out || '—'; });

    renderStrip();
  }

  const clampUnit = (value, min) => U.clamp(Math.round((+value || 300) / 10) * 10, min, 1200);

  function showSub(id) {
    if (id !== sub) leaveActive('nav');
    sub = id;
    SUBS.forEach(s => {
      UI.$('#sg-' + s.id, root).hidden = s.id !== id;
      UI.$('#sg-tab-' + s.id, root).setAttribute('aria-selected', String(s.id === id));
    });
  }

  // ------------------------------------------------------------------ émission
  function renderStrip() {
    const enc = M.encode(text);
    const strip = $('#sg-strip');
    const unit = sig().unit;
    if (!enc.words.length) {
      strip.innerHTML = '<span class="muted">Écris un message ou choisis un message court : le Morse s’affiche ici.</span>';
      strip.setAttribute('aria-label', 'Aucun message');
    } else {
      let i = 0;
      strip.innerHTML = enc.words.map(w => '<span class="mword">' + w.map(l => '<span class="mchar" data-i="' + (i++) + '"><b>' + (l.ch.length > 1 ? '<span class="prosign">' + UI.esc(l.ch.replace(/[<>]/g, '')) + '</span>' : UI.esc(l.ch)) + '</b><span class="mcode">' + codeHtml(l.code) + '</span></span>').join('') + '</span>').join('');
      strip.setAttribute('aria-label', 'Morse : ' + enc.morse);
    }
    live = { letter: -2, on: null };
    const unknown = $('#sg-unknown');
    unknown.hidden = !enc.unknown.length;
    if (enc.unknown.length) UI.$('div', unknown).textContent = 'Ces caractères n’ont pas de code Morse et seront ignorés : ' + enc.unknown.join(' ');
    renderStripMeta();
  }
  function renderStripMeta() {
    const enc = M.encode(text);
    if (!enc.morse) { $('#sg-meta').textContent = ''; return; }
    const unit = sig().unit;
    const letters = enc.words.reduce((n, w) => n + w.length, 0);
    $('#sg-meta').textContent = letters + ' ' + U.plural(letters, 'signe', 'signes') + ' · durée ≈ ' + fmtSeconds(M.duration(M.timeline(enc.morse, unit))) + ' à ' + unit + ' ms le point';
  }

  function renderCameras() {
    const sel = $('#sg-camera');
    sel.innerHTML = '<option value="">Caméra arrière automatique</option>' + cameras.map(c => '<option value="' + UI.esc(c.id) + '">' + UI.esc(c.label) + '</option>').join('');
    sel.value = cameraId;
    $('#sg-camera-field').hidden = cameras.length < 2;
  }

  function refreshTx() {
    if (!root) return;
    const s = sig();
    const sup = Tx.supports();
    const hasMessage = !!M.encode(text).morse;
    const needsPrepare = s.torch && !torchInfo.ready && !s.sound && !s.vibrate;
    $('#sg-torch-sub').textContent = torchInfo.ready ? 'Prête' : torchInfo.busy ? 'Vérification en cours…' : torchWarn ? 'Indisponible : voir le message ci-dessous' : 'À vérifier avant la première émission';
    $('#sg-sound-sub').textContent = sup.sound ? 'Bip à la hauteur choisie · monte le volume du téléphone' : 'Non disponible sur ce navigateur';
    $('#sg-vibrate-sub').textContent = sup.vibrate ? 'Impulsions dans la main' : 'Non prise en charge ici (iPhone, certains navigateurs)';
    $('#sg-sound').disabled = !sup.sound;
    $('#sg-vibrate').disabled = !sup.vibrate;
    $('#sg-repeat-sub').textContent = 'Le message recommence après une pause de 7 points';
    $('#sg-freq-field').hidden = !s.sound;
    const showPrepare = s.torch && !torchInfo.ready && !needsPrepare && !torchInfo.busy;
    const showTest = s.torch && torchInfo.ready;
    const showRelease = torchInfo.active && !running;
    $('#sg-prepare').hidden = !showPrepare;
    $('#sg-test').hidden = !showTest;
    $('#sg-release').hidden = !showRelease;
    $('#sg-torch-actions').hidden = !(showPrepare || showTest || showRelease);
    $('#sg-test').disabled = running || torchInfo.busy;
    $('#sg-live').hidden = !running;
    $('#sg-play').hidden = running;
    $('#sg-stop').hidden = !running;
    $('#sg-play').innerHTML = needsPrepare ? UI.icon('flashlight') + 'Vérifier la lampe' : UI.icon('play') + 'Émettre';
    $('#sg-play').disabled = torchInfo.busy || (!needsPrepare && !hasMessage) || (!s.torch && !s.sound && !s.vibrate);
    const reason = !s.torch && !s.sound && !s.vibrate ? 'Choisis au moins un moyen d’émission (lampe, son ou vibration).' : '';
    $('#sg-go-title').textContent = running ? 'Émission en cours' : 'Prêt à émettre';
    if (reason && !running) UI.setStatus($('#sg-status'), reason, 'warn');
    else if ($('#sg-status').textContent === 'Choisis au moins un moyen d’émission (lampe, son ou vibration).') UI.setStatus($('#sg-status'), '', 'info');
    $('#sg-rate').hidden = !(s.torch && M.flashRate(s.unit) > 3);
  }

  function onPlay() {
    const s = sig();
    if (!M.encode(text).morse) { UI.setStatus($('#sg-status'), 'Saisis un message avec des lettres ou des chiffres.', 'warn'); $('#sg-text').focus(); return; }
    if (s.torch && !torchInfo.ready && !s.sound && !s.vibrate) { tx.stop('exclusive'); torch.prepare(); return; }   // première étape : vérifier la lampe
    sensors.stop('exclusive');
    running = true; runKind = 'tx'; usedTorch = s.torch && torchInfo.ready;
    live = { letter: -2, on: null };
    refreshTx();
    if (s.torch && !torchInfo.ready) UI.setStatus($('#sg-status'), 'Lampe non vérifiée : émission par le son et la vibration seulement.', 'info');
    else UI.setStatus($('#sg-status'), '', 'info');
    tx.play({ text, unit: s.unit, repeat: s.repeat, torch: s.torch, sound: s.sound, vibrate: s.vibrate, freq: s.freq, volume: 0.9 }).then(ok => { if (!ok && running) { running = false; runKind = null; refreshTx(); } });
  }

  function onProgress(p) {
    if (!running || runKind !== 'tx') return;
    if (p.on !== live.on) { live.on = p.on; $('#sg-lamp').classList.toggle('on', p.on); }
    if (p.letter !== live.letter) {
      const previous = UI.$('.mchar.active', root);
      if (previous) previous.classList.remove('active');
      if (p.letter >= 0) {
        const cur = UI.$('.mchar[data-i="' + p.letter + '"]', root);
        if (cur) { cur.classList.add('active'); $('#sg-live-letter').textContent = UI.$('b', cur).textContent; }
      }
      live.letter = p.letter;
    }
    $('#sg-progress').style.width = (p.ratio * 100).toFixed(1) + '%';
  }
  function clearLive() {
    const previous = UI.$('.mchar.active', root);
    if (previous) previous.classList.remove('active');
    $('#sg-lamp').classList.remove('on');
    $('#sg-live-letter').textContent = '·';
    $('#sg-progress').style.width = '0%';
    live = { letter: -2, on: null };
  }
  function onEnded(reason) {
    if (runKind === 'learn') { runKind = null; return; }
    const wasTx = runKind === 'tx';
    running = false; runKind = null;
    clearLive(); refreshTx();
    if (!wasTx) return;
    if (reason === 'done') { if (!usedTorch) UI.setStatus($('#sg-status'), 'Message terminé.', 'ok'); }
    else if (reason === 'nochannel' || reason === 'restart') { /* message déjà affiché ou nouvelle émission */ }
    else UI.setStatus($('#sg-status'), usedTorch ? 'Émission arrêtée. Lampe éteinte et caméra libérée.' : 'Émission arrêtée.', 'info');
  }

  // ------------------------------------------------------------------ réception
  function refreshRx() {
    if (!root) return;
    UI.$$('[data-rxmode]', root).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.rxmode === rxMode)));
    $('#rx-start').disabled = rxRunning;
    $('#rx-stop').disabled = !rxRunning;
    $('#rx-frame').hidden = rxMode !== 'camera' || !rxRunning;
    $('#rx-audio-set').hidden = rxMode !== 'audio';
    const thr = $('#rx-thr');
    if (rxMode === 'audio') { thr.min = '-80'; thr.max = '-15'; thr.step = '1'; thr.value = String(audioThreshold); $('#rx-thr-val').textContent = audioThreshold + ' dBFS'; $('#rx-thr-hint').textContent = 'Baisse le seuil pour un bip faible, monte-le dans le bruit.'; }
    else { thr.min = '5'; thr.max = '95'; thr.step = '1'; thr.value = String(lightThreshold); $('#rx-thr-val').textContent = lightThreshold + ' %'; $('#rx-thr-hint').textContent = 'Vise la lumière au centre du cadre.'; }
    rxOptions.threshold = rxMode === 'audio' ? audioThreshold : lightThreshold;
    thr.disabled = rxOptions.autoThreshold;
    $('#rx-unit-in').disabled = rxOptions.auto;
    $('#rx-freq').disabled = rxOptions.autoFreq;
    $('#rx-auto-speed-sub').textContent = rxOptions.auto ? 'La vitesse de l’émetteur est estimée au fil du message' : 'Vitesse fixée à la durée ci-dessous';
    $('#rx-auto-freq-sub').textContent = rxOptions.autoFreq ? 'Suit le son le plus net entre 200 et 3 000 Hz' : 'Écoute uniquement la hauteur ci-dessous';
    $('#rx-auto-thr-sub').textContent = rxOptions.autoThreshold ? 'S’adapte au bruit ambiant ou à la lumière' : 'Seuil réglé à la main';
    $('#rx-start').innerHTML = UI.icon('play') + 'Commencer la réception';
  }
  async function rxStart() {
    const s = sig();
    rxOptions.unit = s.rxUnit;
    rxOptions.freq = s.freq;
    rxOptions.threshold = rxMode === 'audio' ? audioThreshold : lightThreshold;
    rxRunning = true;
    refreshRx();
    const options = Object.assign({}, rxOptions, rxMode === 'camera' ? { video: $('#rx-video') } : {});
    const ok = await sensors.start(rxMode, options);
    if (!ok) { rxRunning = false; refreshRx(); }
  }
  function renderRx(d) {
    if (d.morse !== rxShown.morse) { rxShown.morse = d.morse; $('#rx-morse').textContent = d.morse || '—'; }
    if (d.text !== rxShown.text) { rxShown.text = d.text; $('#rx-text').textContent = d.text || '—'; }
    const unit = d.unit && (d.text || d.morse) ? '≈ ' + Math.round(d.unit) + ' ms le point' : '';
    if (unit !== rxShown.unit) { rxShown.unit = unit; $('#rx-unit').textContent = unit; }
  }
  function onFrame(f) {
    if (f.detected !== rxShown.lit) {
      rxShown.lit = f.detected;
      $('#rx-lamp').classList.toggle('on', f.detected);
    }
    const level = f.mode === 'audio' ? (f.detected ? 'Bip détecté · ' + Math.round(f.hz) + ' Hz' : 'Aucun bip') : (f.detected ? 'Flash détecté' : 'Pas de flash');
    if (level !== rxShown.level) { rxShown.level = level; $('#rx-level-text').textContent = level; }
    $('#rx-meter').style.width = f.level.toFixed(0) + '%';
    renderRx(f.decoded);
  }
  function onSensorStopped(reason) {
    rxRunning = false;
    $('#rx-lamp').classList.remove('on');
    $('#rx-meter').style.width = '0%';
    rxShown.lit = null; rxShown.level = null;
    $('#rx-level-text').textContent = 'Aucun signal';
    refreshRx();
    if (reason === 'interrupted' || reason === 'disconnected') { /* message déjà affiché par le capteur */ }
  }

  // ------------------------------------------------------------------ cycle de vie
  function leaveActive(reason) {
    const wasBusy = running || rxRunning || torchInfo.active;
    tx.stop('leave');
    torch.stop();
    sensors.stop('leave');
    running = false; rxRunning = false; runKind = null;
    clearLive();
    refreshTx(); refreshRx();
    if (reason === 'hidden' && wasBusy) {
      UI.setStatus($('#sg-status'), 'Émission arrêtée : la page a été masquée. Lampe éteinte et caméra libérée.', 'warn');
      UI.setStatus($('#rx-status'), 'Réception arrêtée : la page a été masquée.', 'warn');
    } else { UI.setStatus($('#sg-status'), '', 'info'); }
  }
  function enter() {
    showSub(sub);
    if ($('#sg-text').value !== text && document.activeElement !== $('#sg-text')) $('#sg-text').value = text;
  }
  function leave(reason) { leaveActive(reason); }

  function update(state) {
    if (!root) return;
    const s = state.signal;
    const set = (id, key) => { const el = $('#' + id); if (el && el.checked !== s[key]) el.checked = s[key]; };
    set('sg-torch', 'torch'); set('sg-sound', 'sound'); set('sg-vibrate', 'vibrate'); set('sg-repeat', 'repeat');
    const val = (id, value) => { const el = $('#' + id); if (el && document.activeElement !== el && el.value !== String(value)) el.value = String(value); };
    val('sg-unit', s.unit); val('sg-freq', s.freq); val('rx-unit-in', s.rxUnit); val('rx-freq', s.freq);
    $('#sg-freq-val').textContent = s.freq + ' Hz';
    UI.$$('[data-speed]', root).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === s.unit)));
    const rxA = $('#rx-auto-speed'), rxF = $('#rx-auto-freq'), rxT = $('#rx-auto-thr');
    rxA.checked = rxOptions.auto; rxF.checked = rxOptions.autoFreq; rxT.checked = rxOptions.autoThreshold;
    if (!rxRunning) { rxOptions.unit = s.rxUnit; rxOptions.freq = s.freq; }
    refreshTx();
    refreshRx();
    renderStripMeta();
  }

  return { id: 'signal', title: 'Signal Morse', eyebrow: 'Signaler', desc: 'Lampe, son ou vibration ; lecture des bips et des flashs.', icon: 'radio-tower', tone: 'danger', mount, enter, leave, update };
})());


/* ==== js/56-view-alarm.js ==== */
/* Outil Alarme sonore : attire l'attention (sirène), signal de détresse en montagne (6 coups par minute) ou bip régulier.
 * Le son s'arrête en quittant l'écran ou quand la page est masquée. Le volume réel dépend du téléphone. */
Vault.tools.register((() => {
  const UI = VaultUI, Tx = VaultTx;
  const KINDS = [
    { id: 'siren', icon: 'siren', title: 'Sirène', text: 'Son montant et descendant en continu : se repère de très loin et attire tout de suite l’attention.' },
    { id: 'whistle', icon: 'megaphone', title: 'Détresse en montagne', text: 'Six sifflements par minute (un toutes les 10 secondes), puis une minute de pause. C’est le signal international ; la réponse est de trois signaux par minute.' },
    { id: 'beacon', icon: 'radio', title: 'Balise', text: 'Un bip clair toutes les deux secondes : économe et facile à suivre pour te retrouver.' },
  ];
  let root = null;
  let kind = 'siren';
  let active = null;
  let alarm = null;
  const $ = sel => UI.$(sel, root);

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card card-danger" aria-labelledby="al-title"><div class="card-head"><div><div class="label">Attirer l’attention</div><h2 id="al-title">Alarme sonore</h2></div></div>' +
        '<div class="stack" role="radiogroup" aria-label="Type d’alarme">' + KINDS.map(k =>
          '<label class="choice-card"><input type="radio" name="al-kind" value="' + k.id + '"><span class="row-icon danger">' + UI.icon(k.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(k.title) + '</span><span class="row-sub">' + UI.esc(k.text) + '</span></span></label>').join('') + '</div>' +
        '<div class="stack mt"><button type="button" class="btn btn-solid-danger btn-lg btn-block" id="al-start">' + UI.icon('volume-2') + 'Déclencher l’alarme</button>' +
          '<button type="button" class="btn btn-ghost btn-lg btn-block" id="al-stop" hidden>' + UI.icon('square') + 'Arrêter l’alarme</button></div>' +
        '<p class="status mt" id="al-status" role="status" data-tone="info" hidden></p></article>' +
      '<div class="callout callout-warn">' + UI.icon('triangle-alert') + '<div><b>Protège ton oreille.</b> Monte le volume du téléphone au maximum avant de déclencher, mais ne le tiens jamais contre l’oreille. Garde l’écran allumé : si le téléphone se verrouille ou si tu quittes VAULT, l’alarme s’arrête.</div></div>';

    alarm = Tx.createAlarm({
      status: (message, tone) => UI.setStatus($('#al-status'), message, tone),
      changed: k => { active = k; refresh(); },
    });
    UI.on(el, 'change', 'input[name="al-kind"]', (e, t) => { kind = t.value; if (active) alarm.start(kind, { volume: 1 }); refresh(); });
    $('#al-start').addEventListener('click', async () => {
      const ok = await alarm.start(kind, { volume: 1 });
      if (ok) UI.setStatus($('#al-status'), 'Alarme en cours. Touche « Arrêter » pour la couper.', 'warn');
    });
    $('#al-stop').addEventListener('click', () => { alarm.stop(); UI.setStatus($('#al-status'), 'Alarme arrêtée.', 'info'); });
  }

  function refresh() {
    if (!root) return;
    UI.$$('input[name="al-kind"]', root).forEach(r => { r.checked = r.value === kind; });
    $('#al-start').hidden = !!active;
    $('#al-stop').hidden = !active;
  }
  function enter() { refresh(); }
  function leave(reason) {
    const was = !!active;
    if (alarm) alarm.stop();
    active = null;
    refresh();
    if (was && reason === 'hidden') UI.setStatus($('#al-status'), 'Alarme arrêtée : la page a été masquée.', 'warn');
    else UI.setStatus($('#al-status'), '', 'info');
  }

  return { id: 'alarm', title: 'Alarme sonore', eyebrow: 'Signaler', desc: 'Sirène, signal de détresse en montagne, balise.', icon: 'siren', tone: 'danger', mount, enter, leave };
})());


/* ==== js/57-view-acoustic.js ==== */
/* Outil Écoute acoustique (expérimental) : niveau du micro, fréquence dominante, spectre, observation prudente.
 * Analyse locale et éphémère : aucun enregistrement, aucun envoi. Elle ne confirme ni n'exclut aucune source précise. */
Vault.tools.register((() => {
  const UI = VaultUI;
  const BARS = 48;
  let root = null;
  let sensors = null;
  let running = false;
  let bars = [];
  let shown = { title: null, level: null, peak: null };
  const $ = sel => UI.$(sel, root);

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="ac-title"><div class="card-head"><div><div class="label">Microphone</div><h2 id="ac-title">Écoute de l’environnement</h2></div><span class="chip chip-warn">Expérimental</span></div>' +
        '<p class="muted">Repère un bruit diffus, une tonalité stable ou des harmoniques persistantes, par exemple celles d’un moteur.</p>' +
        '<div class="spectrum mt" id="ac-spectrum" role="img" aria-label="Spectre sonore en direct">' + '<span></span>'.repeat(BARS) + '</div>' +
        '<div class="spectrum-axis" aria-hidden="true"><span>80 Hz</span><span>370 Hz</span><span>1,7 kHz</span><span>8 kHz</span></div>' +
        '<div class="stack mt"><button type="button" class="btn btn-primary btn-lg btn-block" id="ac-start">' + UI.icon('mic') + 'Démarrer l’écoute</button><button type="button" class="btn btn-ghost btn-lg btn-block" id="ac-stop" hidden>' + UI.icon('square') + 'Arrêter l’écoute</button></div>' +
        '<p class="status mt-sm" id="ac-status" role="status" data-tone="info">Microphone arrêté.</p>' +
        '<div class="meter mt-sm"><span id="ac-meter"></span></div>' +
        '<div class="acoustic-result mt"><div class="label">Observation</div><h3 id="ac-result">En attente d’écoute</h3><p class="muted" id="ac-detail">Laisse le microphone écouter quelques secondes.</p></div>' +
        '<div class="grid-2 mt"><div class="nutrition-metric"><span class="label">Niveau du micro</span><strong id="ac-level">—</strong></div><div class="nutrition-metric"><span class="label">Fréquence dominante</span><strong id="ac-peak">—</strong></div></div>' +
        '<p class="hint mt-sm">Niveau relatif au microphone, non calibré : ce n’est pas une mesure du volume ambiant en décibels acoustiques.</p></article>' +
      '<article class="card" aria-labelledby="ac-limits-title"><div class="card-head"><div><div class="label">Limites</div><h2 id="ac-limits-title">Source non identifiable avec certitude</h2></div></div>' +
        '<p class="muted">Un drone, un ventilateur et un véhicule peuvent produire des signatures proches. Cette analyse du spectre relève des indices sonores ; elle ne confirme ni l’absence ni la présence d’une source précise, drone compris.</p>' +
        '<p class="hint mt-sm">Traitement en direct sur ton téléphone. Quitter l’écran ou masquer l’application coupe le microphone.</p></article>';
    bars = UI.$$('#ac-spectrum span', el);

    sensors = VaultSensors.create({
      status: (message, tone) => UI.setStatus($('#ac-status'), message, tone),
      frame: onFrame,
      stopped: () => { running = false; clearDisplay(); refresh(); },
    });
    $('#ac-start').addEventListener('click', async () => {
      running = true; refresh();
      const ok = await sensors.start('acoustic', {});
      if (!ok) { running = false; refresh(); }
    });
    $('#ac-stop').addEventListener('click', () => { sensors.stop('user'); UI.setStatus($('#ac-status'), 'Microphone arrêté.', 'info'); });
  }

  function onFrame(f) {
    f.bars.forEach((v, i) => { if (bars[i]) bars[i].style.height = Math.max(3, Math.round(v * 100)) + '%'; });
    $('#ac-meter').style.width = f.level.toFixed(0) + '%';
    const level = Math.round(f.features.db) + ' dBFS';
    const peak = f.features.db < -60 ? '—' : Math.round(f.features.peakHz) + ' Hz';
    if (level !== shown.level) { shown.level = level; $('#ac-level').textContent = level; }
    if (peak !== shown.peak) { shown.peak = peak; $('#ac-peak').textContent = peak; }
    if (f.result.title !== shown.title) { shown.title = f.result.title; $('#ac-result').textContent = f.result.title; $('#ac-detail').textContent = f.result.detail; }
  }
  function clearDisplay() {
    bars.forEach(b => { b.style.height = '3%'; });
    $('#ac-meter').style.width = '0%';
    shown = { title: null, level: null, peak: null };
    $('#ac-level').textContent = '—'; $('#ac-peak').textContent = '—';
    $('#ac-result').textContent = 'En attente d’écoute';
    $('#ac-detail').textContent = 'Laisse le microphone écouter quelques secondes.';
  }
  function refresh() {
    if (!root) return;
    $('#ac-start').hidden = running;
    $('#ac-stop').hidden = !running;
  }
  function enter() { refresh(); }
  function leave(reason) {
    const was = running;
    if (sensors) sensors.stop('leave');
    running = false;
    clearDisplay(); refresh();
    UI.setStatus($('#ac-status'), was && reason === 'hidden' ? 'Écoute arrêtée : la page a été masquée. Microphone libéré.' : 'Microphone arrêté.', was && reason === 'hidden' ? 'warn' : 'info');
  }

  return { id: 'acoustic', title: 'Écoute acoustique', eyebrow: 'Microphone', desc: 'Niveau, fréquence dominante et spectre du son ambiant.', icon: 'audio-lines', tone: 'info', mount, enter, leave };
})());


/* ==== js/58-view-position.js ==== */
/* Outil Position : coordonnées GPS (copier, partager), boussole, points enregistrés avec distance et cap.
 * Le GPS et les capteurs d'orientation ne s'allument qu'à la demande et s'éteignent en quittant l'écran ; rien n'est envoyé. */
Vault.tools.register((() => {
  const U = VaultUtil, UI = VaultUI, Geo = VaultGeo;
  const PLACE_NAMES = ['Voiture', 'Camp', 'Point d’eau', 'Abri', 'Rendez-vous'];
  let root = null;
  let pos = null;                                           // { lat, lon, acc, ts }
  let watchId = null, ageTimer = null;
  let compassOn = false, orientHandler = null, orientEvent = '', raf = 0, noSignalTimer = null;
  let rawHeading = null, heading = null, drawn = { heading: null, arrow: null };
  let targetId = null;
  let wake = null, wakeAsking = false;
  const $ = sel => UI.$(sel, root);

  // ------------------------------------------------------------------ structure
  function roseSvg() {
    let ticks = '';
    for (let a = 0; a < 360; a += 10) {
      const major = a % 90 === 0, mid = a % 30 === 0;
      ticks += '<line class="tick' + (mid ? ' tick-mid' : '') + '" x1="120" y1="14" x2="120" y2="' + (14 + (major ? 16 : mid ? 12 : 7)) + '" transform="rotate(' + a + ' 120 120)"/>';
    }
    const letters = [['N', 0], ['E', 90], ['S', 180], ['O', 270]].map(([t, a]) => '<text class="rose-letter' + (t === 'N' ? ' rose-n' : '') + '" x="120" y="52" text-anchor="middle" transform="rotate(' + a + ' 120 120)">' + t + '</text>').join('');
    return '<svg viewBox="0 0 240 240" class="compass-svg" role="img" aria-label="Boussole"><circle class="rose-ring" cx="120" cy="120" r="108"/><g id="cp-rose">' + ticks + letters + '</g>' +
      '<g id="cp-arrow" hidden><path class="target-arrow" d="M120 6 l11 24 h-22 z"/></g>' +
      '<path class="heading-mark" d="M120 26 l7 -16 h-14 z" transform="translate(0 2)"/></svg>';
  }

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="ps-title"><div class="card-head"><div><div class="label">GPS</div><h2 id="ps-title">Ma position</h2></div><span class="chip" id="ps-chip">Inactif</span></div>' +
        '<div class="grid-2" id="ps-coords"><div class="nutrition-metric"><span class="label">Latitude</span><strong id="ps-lat">—</strong></div><div class="nutrition-metric"><span class="label">Longitude</span><strong id="ps-lon">—</strong></div></div>' +
        '<p class="hint mt-sm" id="ps-dms"></p><p class="hint" id="ps-acc"></p>' +
        '<div class="stack mt"><button type="button" class="btn btn-primary btn-lg btn-block" id="ps-start">' + UI.icon('locate-fixed') + 'Me localiser</button><button type="button" class="btn btn-ghost btn-lg btn-block" id="ps-stop" hidden>' + UI.icon('square') + 'Arrêter le GPS</button>' +
          '<div class="row-actions"><button type="button" class="btn btn-ghost" id="ps-copy" disabled>' + UI.icon('copy') + 'Copier</button><button type="button" class="btn btn-ghost" id="ps-share" disabled>' + UI.icon('share-2') + 'Partager</button><button type="button" class="btn btn-ghost" id="ps-save" disabled>' + UI.icon('pin') + 'Enregistrer</button></div></div>' +
        '<p class="status mt" id="ps-status" role="status" data-tone="info" hidden></p>' +
        '<p class="hint mt-sm">Le GPS fonctionne sans réseau mobile, de préférence à l’air libre. Il ne s’allume que pendant que cet écran est ouvert.</p></article>' +

      '<article class="card" aria-labelledby="cp-title"><div class="card-head"><div><div class="label">Orientation</div><h2 id="cp-title">Boussole</h2></div><span class="chip" id="cp-chip">Inactive</span></div>' +
        '<div class="compass">' + roseSvg() + '<div class="compass-readout"><strong class="num" id="cp-deg">—</strong><span id="cp-card" class="muted"></span></div></div>' +
        '<div class="callout mt" id="cp-target-box" hidden>' + UI.icon('navigation') + '<div id="cp-target-text"></div></div>' +
        '<div class="stack mt"><button type="button" class="btn btn-primary btn-lg btn-block" id="cp-start">' + UI.icon('compass') + 'Activer la boussole</button><button type="button" class="btn btn-ghost btn-lg btn-block" id="cp-stop" hidden>' + UI.icon('square') + 'Arrêter la boussole</button></div>' +
        '<p class="status mt" id="cp-status" role="status" data-tone="info" hidden></p>' +
        '<p class="hint mt-sm">Tiens le téléphone à plat ou à la verticale, loin des aimants et des objets métalliques ; si le cap dérive, dessine des 8 dans l’air pour le recalibrer. Le cap affiché est magnétique : en France, l’écart avec le nord géographique n’est que de quelques degrés.</p></article>' +

      '<article class="card" aria-labelledby="pl-title"><div class="card-head"><div><div class="label">Mes points</div><h2 id="pl-title">Retrouver un lieu</h2></div></div>' +
        '<div class="list" id="ps-places"></div><p class="hint mt-sm">Enregistre ta voiture, ton camp, un point d’eau… VAULT t’indique ensuite la distance et le cap pour y revenir, même sans réseau. Les points restent sur ton téléphone.</p></article>';

    $('#ps-start').addEventListener('click', startWatch);
    $('#ps-stop').addEventListener('click', () => { stopWatch(); UI.setStatus($('#ps-status'), 'GPS arrêté.', 'info'); });
    $('#ps-copy').addEventListener('click', async () => { if (pos) UI.toast(await Vault.actions.copy(shareText()) ? 'Coordonnées copiées.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' }); });
    $('#ps-share').addEventListener('click', async () => { if (pos) { const r = await Vault.actions.share('Ma position', shareText()); if (r === 'copied') UI.toast('Coordonnées copiées.', { tone: 'ok', icon: 'copy' }); } });
    $('#ps-save').addEventListener('click', () => { if (pos) saveSheet(); });
    $('#cp-start').addEventListener('click', startCompass);
    $('#cp-stop').addEventListener('click', () => { stopCompass(); UI.setStatus($('#cp-status'), 'Boussole arrêtée.', 'info'); });
    UI.on($('#ps-places'), 'click', '[data-target]', (e, t) => { targetId = targetId === t.dataset.target ? null : t.dataset.target; refreshPlaces(); refreshTarget(); });
    UI.on($('#ps-places'), 'click', '[data-copy-place]', async (e, t) => {
      const p = Vault.store.get().places.find(x => x.id === t.dataset.copyPlace);
      if (p) UI.toast(await Vault.actions.copy(placeText(p)) ? 'Coordonnées copiées.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' });
    });
    UI.on($('#ps-places'), 'click', '[data-del-place]', async (e, t) => {
      const p = Vault.store.get().places.find(x => x.id === t.dataset.delPlace);
      if (p && await UI.confirm({ title: 'Supprimer ce point ?', text: '« ' + p.name + ' » sera retiré de tes points enregistrés.', confirmLabel: 'Supprimer', danger: true })) {
        if (targetId === p.id) targetId = null;
        Vault.store.update(s => { s.places = s.places.filter(x => x.id !== p.id); }, 'places');
      }
    });
  }

  // ------------------------------------------------------------------ GPS
  const shareText = () => 'Ma position : ' + Geo.plain(pos.lat, pos.lon) + (pos.acc ? ' (précision environ ' + Math.round(pos.acc) + ' m)' : '') + ' — ' + Geo.mapLink(pos.lat, pos.lon);
  const placeText = p => p.name + ' : ' + Geo.plain(p.lat, p.lon) + ' — ' + Geo.mapLink(p.lat, p.lon);

  function startWatch() {
    if (!navigator.geolocation) { UI.setStatus($('#ps-status'), 'La géolocalisation n’est pas disponible sur ce navigateur.', 'warn'); return; }
    stopWatch(true);
    UI.setStatus($('#ps-status'), 'Recherche de ta position… Place-toi à l’air libre pour un meilleur signal.', 'info');
    watchId = navigator.geolocation.watchPosition(onFix, onGeoError, { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 });
    ageTimer = setInterval(refreshPos, 1000);
    refreshPos();
  }
  function stopWatch(keepStatus) {
    if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    clearInterval(ageTimer); ageTimer = null;
    refreshPos();
    if (!keepStatus) refreshPlaces();
  }
  function onFix(p) {
    pos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, ts: p.timestamp || Date.now() };
    UI.setStatus($('#ps-status'), '', 'info');
    refreshPos(); refreshPlaces(); refreshTarget();
  }
  function onGeoError(err) {
    const code = err && err.code;
    if (code === 1) { stopWatch(true); UI.setStatus($('#ps-status'), 'Accès à la position refusé. Autorise la localisation pour ce site dans les réglages du navigateur, puis réessaie.', 'warn'); }
    else if (code === 3) UI.setStatus($('#ps-status'), 'Le signal GPS tarde. Sors à l’air libre et patiente quelques instants.', 'warn');
    else UI.setStatus($('#ps-status'), 'Position indisponible pour le moment. Sors à l’air libre ; le GPS peut mettre une minute à s’accrocher.', 'warn');
  }

  function accuracyLabel(acc) {
    if (!Number.isFinite(acc)) return '';
    const quality = acc <= 15 ? 'bonne' : acc <= 50 ? 'moyenne' : 'faible';
    return 'Précision environ ' + Math.round(acc) + ' m (' + quality + ')';
  }
  /** Écran allumé tant que le GPS ou la boussole servent (comme un guidage) : sinon la veille masquerait la page et couperait tout. */
  function syncWake() {
    const wanted = watchId !== null || compassOn;
    if (wanted && !wake && !wakeAsking && navigator.wakeLock && navigator.wakeLock.request) {
      wakeAsking = true;
      navigator.wakeLock.request('screen').then(lock => { wakeAsking = false; if (watchId !== null || compassOn) wake = lock; else lock.release().catch(() => {}); }).catch(() => { wakeAsking = false; });
    } else if (!wanted && wake) { wake.release().catch(() => {}); wake = null; }
  }
  function refreshPos() {
    if (!root) return;
    syncWake();
    const watching = watchId !== null;
    $('#ps-start').hidden = watching; $('#ps-stop').hidden = !watching;
    $('#ps-copy').disabled = !pos; $('#ps-share').disabled = !pos; $('#ps-save').disabled = !pos;
    const chip = $('#ps-chip');
    chip.className = 'chip ' + (watching && pos ? 'chip-ok' : watching ? 'chip-warn' : '');
    chip.textContent = watching ? (pos ? 'GPS actif' : 'Recherche…') : pos ? 'Dernière position' : 'Inactif';
    if (!pos) { $('#ps-lat').textContent = '—'; $('#ps-lon').textContent = '—'; $('#ps-dms').textContent = ''; $('#ps-acc').textContent = ''; return; }
    $('#ps-lat').textContent = Geo.latDD(pos.lat); $('#ps-lon').textContent = Geo.lonDD(pos.lon);
    $('#ps-dms').textContent = Geo.latDMS(pos.lat) + ' · ' + Geo.lonDMS(pos.lon);
    const age = Math.max(0, Math.round((Date.now() - pos.ts) / 1000));
    $('#ps-acc').textContent = [accuracyLabel(pos.acc), watching ? 'mise à jour il y a ' + (age < 90 ? age + ' s' : Math.round(age / 60) + ' min') : 'relevée à ' + new Date(pos.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })].filter(Boolean).join(' · ');
  }

  // ------------------------------------------------------------------ boussole
  async function startCompass() {
    if (compassOn) return;
    const status = (m, t) => UI.setStatus($('#cp-status'), m, t);
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') { status('Ce navigateur ne donne pas accès aux capteurs d’orientation.', 'warn'); return; }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {          // iPhone : l'autorisation se demande après un geste
      try {
        const answer = await DeviceOrientationEvent.requestPermission();
        if (answer !== 'granted') { status('Accès aux capteurs d’orientation refusé. Autorise « Mouvement et orientation » pour ce site dans les réglages de ton navigateur, puis réessaie.', 'warn'); return; }
      } catch (_) { status('Impossible d’obtenir l’autorisation des capteurs d’orientation.', 'warn'); return; }
    }
    orientEvent = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    orientHandler = e => {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number' && Number.isFinite(e.webkitCompassHeading)) h = e.webkitCompassHeading;
      else if (typeof e.alpha === 'number' && (e.absolute || orientEvent === 'deviceorientationabsolute')) h = Geo.compassHeading(e.alpha, e.beta || 0, e.gamma || 0);
      if (h === null || !Number.isFinite(h)) return;
      rawHeading = h;
      clearTimeout(noSignalTimer); noSignalTimer = null;
    };
    window.addEventListener(orientEvent, orientHandler, true);
    compassOn = true;
    rawHeading = null; heading = null; drawn = { heading: null, arrow: null };
    status('Boussole active. Si rien ne bouge, fais des 8 avec le téléphone.', 'info');
    noSignalTimer = setTimeout(() => { if (rawHeading === null) status('Aucun capteur d’orientation absolu détecté sur cet appareil : la boussole n’est pas disponible ici.', 'warn'); }, 3000);
    refreshCompass();
    const loop = () => {
      if (!compassOn) return;
      if (rawHeading !== null) {
        heading = Geo.smooth(heading, rawHeading, 0.3);
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  function stopCompass() {
    if (orientHandler) window.removeEventListener(orientEvent, orientHandler, true);
    orientHandler = null;
    cancelAnimationFrame(raf); raf = 0;
    clearTimeout(noSignalTimer); noSignalTimer = null;
    compassOn = false;
    refreshCompass();
  }
  function targetPlace() { return targetId ? Vault.store.get().places.find(p => p.id === targetId) || null : null; }
  function draw() {
    if (!root || heading === null) return;
    const rounded = Math.round(heading);
    if (drawn.heading !== rounded) {
      drawn.heading = rounded;
      $('#cp-rose').setAttribute('transform', 'rotate(' + (-heading).toFixed(1) + ' 120 120)');
      $('#cp-deg').textContent = rounded + '°';
      $('#cp-card').textContent = Geo.cardinal(heading);
    }
    const t = targetPlace();
    const arrow = $('#cp-arrow');
    if (t && pos) {
      const rel = Geo.norm(Geo.bearing(pos, t) - heading);
      arrow.removeAttribute('hidden');
      if (drawn.arrow !== Math.round(rel)) { drawn.arrow = Math.round(rel); arrow.setAttribute('transform', 'rotate(' + rel.toFixed(1) + ' 120 120)'); }
    } else { arrow.setAttribute('hidden', ''); drawn.arrow = null; }
  }
  function refreshCompass() {
    if (!root) return;
    syncWake();
    $('#cp-start').hidden = compassOn; $('#cp-stop').hidden = !compassOn;
    const chip = $('#cp-chip');
    chip.className = 'chip ' + (compassOn ? 'chip-ok' : '');
    chip.textContent = compassOn ? 'Active' : 'Inactive';
    if (!compassOn) { $('#cp-deg').textContent = '—'; $('#cp-card').textContent = ''; $('#cp-arrow').setAttribute('hidden', ''); $('#cp-rose').setAttribute('transform', 'rotate(0 120 120)'); }
    refreshTarget();
  }
  function refreshTarget() {
    if (!root) return;
    const t = targetPlace();
    const box = $('#cp-target-box');
    box.hidden = !t;
    if (!t) return;
    if (!pos) { $('#cp-target-text').textContent = 'Direction de « ' + t.name + ' » : lance le GPS (« Me localiser ») pour connaître la distance et le cap.'; return; }
    const b = Geo.bearing(pos, t), d = Geo.distance(pos, t);
    $('#cp-target-text').innerHTML = '<b>' + UI.esc(t.name) + '</b> : à ' + Geo.formatDistance(d) + ', cap ' + Math.round(b) + '° (' + Geo.cardinal(b) + ', nord géographique). ' + (compassOn ? 'Garde la flèche rouge en haut.' : 'Active la boussole pour te guider avec la flèche.');
    if (compassOn) draw();
  }

  // ------------------------------------------------------------------ points enregistrés
  function refreshPlaces() {
    if (!root) return;
    const places = Vault.store.get().places;
    if (targetId && !places.some(p => p.id === targetId)) targetId = null;
    $('#ps-places').innerHTML = places.length
      ? places.map(p => {
        const info = pos ? 'À ' + Geo.formatDistance(Geo.distance(pos, p)) + ' · cap ' + Math.round(Geo.bearing(pos, p)) + '° ' + Geo.cardinal(Geo.bearing(pos, p)) : 'Enregistré le ' + U.frDate(new Date(p.ts || Date.now()).toISOString().slice(0, 10)) + ' · lance le GPS pour la distance';
        return '<div class="row contact"><span class="row-icon ' + (p.id === targetId ? 'danger' : '') + '">' + UI.icon('pin') + '</span><span class="row-main"><span class="row-title">' + UI.esc(p.name) + (p.id === targetId ? ' <span class="chip chip-danger">Cible</span>' : '') + '</span><span class="row-sub">' + UI.esc(info) + '</span><span class="row-sub tel">' + UI.esc(Geo.plain(p.lat, p.lon)) + '</span></span>' +
          '<span class="row-end"><button type="button" class="btn btn-soft btn-sm" data-target="' + p.id + '">' + UI.icon('navigation') + (p.id === targetId ? 'Retirer la cible' : 'Aller vers') + '</button>' +
          '<button type="button" class="icon-btn small" data-copy-place="' + p.id + '" aria-label="Copier les coordonnées de ' + UI.esc(p.name) + '">' + UI.icon('copy') + '</button>' +
          '<button type="button" class="icon-btn small" data-del-place="' + p.id + '" aria-label="Supprimer ' + UI.esc(p.name) + '">' + UI.icon('trash-2') + '</button></span></div>';
      }).join('')
      : '<div class="empty">' + UI.icon('pin') + '<p>Aucun point enregistré. Lance le GPS, puis touche « Enregistrer » pour garder cet endroit.</p></div>';
  }
  function saveSheet() {
    const places = Vault.store.get().places;
    if (places.length >= VaultState.LIMITS.places) { UI.toast('Tu as atteint le nombre maximal de points enregistrés.', { tone: 'warn' }); return; }
    const snapshot = { lat: pos.lat, lon: pos.lon, acc: pos.acc };
    UI.sheet({
      title: 'Enregistrer ce point',
      body: '<form class="stack" id="pl-form" novalidate autocomplete="off"><div class="field"><label for="pl-name">Nom du point</label><input class="input" id="pl-name" maxlength="60" placeholder="Ex. Voiture" value=""></div>' +
        '<div class="chips" role="group" aria-label="Noms proposés">' + PLACE_NAMES.map(n => '<button type="button" class="chip-btn" data-name="' + UI.esc(n) + '">' + UI.esc(n) + '</button>').join('') + '</div>' +
        '<p class="hint">' + UI.esc(Geo.plain(snapshot.lat, snapshot.lon)) + (snapshot.acc ? ' · précision environ ' + Math.round(snapshot.acc) + ' m' : '') + '</p></form>',
      onOpen: ctl => { UI.on(ctl.el, 'click', '[data-name]', (e, t) => { const i = UI.$('#pl-name', ctl.el); i.value = t.dataset.name; i.focus(); }); },
      actions: [{ label: 'Annuler' }, {
        label: 'Enregistrer', kind: 'primary',
        onClick: ctl => {
          const name = UI.$('#pl-name', ctl.el).value.trim() || 'Point ' + (Vault.store.get().places.length + 1);
          const clean = VaultState.normalize({ places: [{ id: U.uid('pl'), name, lat: snapshot.lat, lon: snapshot.lon, acc: snapshot.acc, ts: Date.now() }] }).places[0];
          if (!clean) return false;
          Vault.store.update(s => { s.places.push(clean); }, 'places');
          UI.toast('Point « ' + clean.name + ' » enregistré.', { tone: 'ok', icon: 'pin' });
        },
      }],
    });
  }

  // ------------------------------------------------------------------ cycle de vie
  function enter() { refreshPos(); refreshCompass(); refreshPlaces(); }
  function leave(reason) {
    const was = watchId !== null || compassOn;
    stopWatch(true);
    stopCompass();
    if (reason === 'hidden' && was) { UI.setStatus($('#ps-status'), 'GPS et boussole arrêtés : la page a été masquée.', 'warn'); UI.setStatus($('#cp-status'), '', 'info'); }
    else { UI.setStatus($('#ps-status'), '', 'info'); UI.setStatus($('#cp-status'), '', 'info'); }
  }
  function update(state, what) { if (what === 'places' || what === 'replace' || what === 'enter') { refreshPlaces(); refreshTarget(); } }

  return { id: 'position', title: 'Position et boussole', eyebrow: 'S’orienter', desc: 'Coordonnées GPS à communiquer, boussole, points à retrouver.', icon: 'compass', tone: 'ok', mount, enter, leave, update };
})());


/* ==== js/59-view-codes.js ==== */
/* Outil Codes : épeler un nom au téléphone (alphabets français et international), signaux de détresse, signes au sol.
 * Tout est affiché hors ligne ; rien à autoriser. */
Vault.tools.register((() => {
  const UI = VaultUI, Codes = VaultCodes;
  let root = null;
  let alphabet = 'fr';
  const $ = sel => UI.$(sel, root);

  const table = rows => '<div class="alpha-grid">' + rows.map(r => '<div class="alpha-cell"><b>' + r.letter + '</b><span>' + UI.esc(r.word) + '</span></div>').join('') + '</div>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<article class="card" aria-labelledby="cd-spell-title"><div class="card-head"><div><div class="label">Épeler</div><h2 id="cd-spell-title">Épeler un mot au téléphone</h2></div></div>' +
        '<div class="field"><label for="cd-text">Mot ou nom à épeler</label><input class="input" id="cd-text" maxlength="60" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Ex. MARTIN"></div>' +
        '<div class="seg mt" role="group" aria-label="Alphabet"><button type="button" data-alpha="fr" aria-pressed="true">Français</button><button type="button" data-alpha="icao" aria-pressed="false">International</button></div>' +
        '<div class="spell-output mt" id="cd-output" aria-live="polite">—</div>' +
        '<div class="cluster mt"><button type="button" class="btn btn-ghost btn-sm" id="cd-copy">' + UI.icon('copy') + 'Copier</button></div></article>' +
      '<details class="acc"><summary>' + UI.icon('languages') + '<span>Alphabet d’épellation français</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body">' + table(Codes.FRENCH) + '</div></details>' +
      '<details class="acc"><summary>' + UI.icon('languages') + '<span>Alphabet international (OACI)</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body">' + table(Codes.ICAO) + '</div></details>' +
      '<article class="card" aria-labelledby="cd-distress-title"><div class="card-head"><div><div class="label">Détresse</div><h2 id="cd-distress-title">Signaux pour être repéré</h2></div></div><div class="list">' +
        Codes.DISTRESS.map(d => '<div class="row"><span class="row-icon danger">' + UI.icon(d.icon) + '</span><span class="row-main"><span class="row-title">' + UI.esc(d.title) + '</span><span class="row-sub">' + UI.esc(d.text) + '</span></span></div>').join('') +
      '</div></article>' +
      '<article class="card" aria-labelledby="cd-ground-title"><div class="card-head"><div><div class="label">Sol-air</div><h2 id="cd-ground-title">Signes à tracer au sol</h2></div></div>' +
        '<div class="ground-grid">' + Codes.GROUND_AIR.map(g => '<div class="ground-cell"><b>' + UI.esc(g.sign) + '</b><span>' + UI.esc(g.meaning) + '</span></div>').join('') + '</div>' +
        '<p class="hint mt-sm">Trace-les en grand (plusieurs mètres), avec des pierres, des branches ou des vêtements bien contrastés, sur un terrain dégagé, pour qu’un avion ou un hélicoptère les repère.</p></article>';

    $('#cd-text').addEventListener('input', render);
    UI.on(el, 'click', '[data-alpha]', (e, t) => { alphabet = t.dataset.alpha; UI.$$('[data-alpha]', el).forEach(b => b.setAttribute('aria-pressed', String(b === t))); render(); });
    $('#cd-copy').addEventListener('click', async () => {
      const t = $('#cd-output').textContent;
      if (!t || t === '—') { UI.toast('Écris d’abord un mot à épeler.', { icon: 'info' }); return; }
      UI.toast(await Vault.actions.copy(t) ? 'Épellation copiée.' : 'Copie impossible.', { tone: 'ok', icon: 'copy' });
    });
  }
  function render() {
    const out = Codes.spell($('#cd-text').value, alphabet === 'icao' ? Codes.ICAO : Codes.FRENCH);
    $('#cd-output').textContent = out || '—';
  }

  return { id: 'codes', title: 'Codes et alphabets', eyebrow: 'Communiquer', desc: 'Épeler un nom, signaux de détresse, signes au sol.', icon: 'languages', tone: 'warn', mount, enter: () => {}, leave: () => {} };
})());


/* ==== js/60-view-settings.js ==== */
/* Réglages : apparence, sauvegarde et restauration, installation, mises à jour, confidentialité et à propos.
 * Les données restent dans le navigateur : la sauvegarde par fichier est la seule protection contre un effacement. */
Vault.registerView((() => {
  const U = VaultUtil, UI = VaultUI, State = VaultState;
  let root = null;
  let fileInput = null;
  const $ = sel => UI.$(sel, root);
  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const row = (icon, title, sub, control) => '<div class="toggle-row"><span class="row-main"><span class="row-title">' + UI.icon(icon) + ' ' + title + '</span>' + (sub ? '<span class="row-sub">' + sub + '</span>' : '') + '</span>' + control + '</div>';
  const sw = (id, label) => '<span class="switch"><input type="checkbox" id="' + id + '" aria-label="' + UI.esc(label) + '"><span class="track"></span></span>';

  function mount(el) {
    root = el;
    el.innerHTML =
      '<div class="page-head"><div><div class="eyebrow">Personnaliser et protéger</div><h1 id="h-settings">Réglages</h1></div></div>' +
      '<div class="stack-lg">' +

        '<article class="card" aria-labelledby="st-look-title"><div class="card-head"><div><div class="label">Apparence</div><h2 id="st-look-title">Affichage</h2></div></div><div class="stack">' +
          '<div class="field"><span class="field-label" id="st-theme-label">Thème</span><div class="seg" role="group" aria-labelledby="st-theme-label"><button type="button" data-theme="auto" aria-pressed="false">' + UI.icon('smartphone') + 'Auto</button><button type="button" data-theme="dark" aria-pressed="false">' + UI.icon('moon') + 'Sombre</button><button type="button" data-theme="light" aria-pressed="false">' + UI.icon('sun') + 'Clair</button></div></div>' +
          row('eye', 'Mode nuit', 'Tout en rouge : préserve la vision dans le noir', sw('st-night', 'Mode nuit')) +
          row('moon', 'Low Profile', 'Interface atténuée, sans effet lumineux : plus discret', sw('st-low', 'Low Profile')) +
          '<div class="field"><label for="st-scale">Taille du texte : <span class="num" id="st-scale-val"></span></label><input type="range" id="st-scale" min="85" max="140" step="5"></div>' +
          row('vibrate', 'Retour tactile', 'Courte vibration à certaines actions', sw('st-haptics', 'Retour tactile')) +
        '</div></article>' +

        '<article class="card" aria-labelledby="st-data-title"><div class="card-head"><div><div class="label">Données</div><h2 id="st-data-title">Sauvegarde</h2></div><span class="chip" id="st-backup-chip"></span></div>' +
          '<p class="muted">Tout reste sur cet appareil, dans le navigateur. Effacer les données du navigateur ou changer de téléphone efface aussi VAULT : exporte un fichier de sauvegarde de temps en temps et garde-le ailleurs (courriel à toi-même, ordinateur, clé USB).</p>' +
          '<p class="hint mt-sm" id="st-backup-info"></p>' +
          '<div class="stack mt"><button type="button" class="btn btn-primary btn-lg btn-block" id="st-export">' + UI.icon('download') + 'Exporter une sauvegarde</button>' +
            '<button type="button" class="btn btn-ghost btn-block" id="st-import">' + UI.icon('upload') + 'Restaurer depuis un fichier</button>' +
            '<button type="button" class="btn btn-danger btn-block" id="st-reset">' + UI.icon('trash-2') + 'Tout effacer sur cet appareil</button></div>' +
          '<p class="status mt" id="st-data-status" role="status" data-tone="info" hidden></p>' +
          '<input type="file" id="st-file" accept="application/json,.json" class="sr-only" tabindex="-1" aria-hidden="true"></article>' +

        '<article class="card" aria-labelledby="st-app-title"><div class="card-head"><div><div class="label">Application</div><h2 id="st-app-title">VAULT <span class="num" id="st-version"></span></h2></div><span class="chip" id="st-offline-chip"></span></div>' +
          '<dl class="kv" id="st-app-info"></dl>' +
          '<div class="stack mt"><div id="st-install"></div><button type="button" class="btn btn-ghost btn-block" id="st-update">' + UI.icon('refresh-cw') + 'Rechercher une mise à jour</button></div></article>' +

        '<details class="acc"><summary>' + UI.icon('gauge') + '<span>Comment le score est calculé</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack">' +
          '<p>Le <b>score de préparation</b> combine deux choses : 70 % pour tes réserves (eau, nourriture et énergie : moyenne des trois, chacune comptée par rapport à ton objectif en jours) et 30 % pour la checklist du kit (éléments de base et besoins du foyer activés).</p>' +
          '<p>L’<b>autonomie</b> est la plus petite des trois réserves : c’est la première qui manquera qui compte. Un aliment dont la <b>DLC</b> est dépassée n’est jamais comptée ; une <b>DDM</b> dépassée reste comptée mais signalée.</p>' +
          '<p class="hint">Ces chiffres sont des repères de préparation, pas une promesse : ils dépendent de ce que tu saisis et ne remplacent ni un professionnel de santé ni les consignes officielles.</p></div></details>' +

        '<details class="acc"><summary>' + UI.icon('shield-check') + '<span>Confidentialité et limites</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack">' +
          '<p><b>Aucune donnée ne quitte ton téléphone.</b> Pas de compte, pas de statistiques, pas de cookie, pas de serveur : VAULT n’envoie rien. Les données sont enregistrées dans le stockage de ton navigateur. Le micro, la caméra et la position ne servent qu’à l’outil ouvert, sans enregistrement.</p>' +
          '<p><b>Limites.</b> VAULT complète les consignes officielles sans les remplacer : en cas de doute ou de danger, appelle le 112. La lampe, la vibration, le GPS et la boussole dépendent de ton téléphone et de ton navigateur (l’iPhone ne permet généralement pas de commander la lampe depuis un navigateur). Les guides résument des sources officielles vérifiées le ' + U.frDate(VaultGuides.VERIFIED) + ' ; une consigne locale ou celle des secours prime toujours.</p></div></details>' +

        '<details class="acc"><summary>' + UI.icon('badge-check') + '<span>Crédits</span><span class="chev">' + UI.icon('chevron-down') + '</span></summary><div class="acc-body stack">' +
          '<p>Icônes : <b>Lucide</b> (licence ISC). Aucune police ni bibliothèque n’est téléchargée : tout est inclus dans l’application.</p>' +
          '<p>Consignes : Sécurité civile, ministère de l’Intérieur, info.gouv.fr, Croix-Rouge française, GRDF. Catalogue d’aliments : valeurs moyennes indicatives pour 100 g, à remplacer par celles de l’étiquette.</p></div></details>' +
      '</div>';

    // --- apparence
    UI.on(el, 'click', '[data-theme]', (e, t) => { Vault.store.update(s => { s.prefs.theme = t.dataset.theme; s.prefs.night = false; }, 'prefs'); });
    $('#st-night').addEventListener('change', e => { Vault.store.update(s => { s.prefs.night = e.target.checked; }, 'prefs'); });
    $('#st-low').addEventListener('change', e => { Vault.store.update(s => { s.lowProfile = e.target.checked; }, 'lowProfile'); });
    $('#st-haptics').addEventListener('change', e => { Vault.store.update(s => { s.prefs.haptics = e.target.checked; }, 'prefs'); if (e.target.checked) UI.haptic(15); });
    $('#st-scale').addEventListener('input', e => { Vault.store.update(s => { s.prefs.textScale = +e.target.value; }, 'prefs'); });

    // --- sauvegarde
    fileInput = $('#st-file');
    $('#st-export').addEventListener('click', exportBackup);
    $('#st-import').addEventListener('click', () => { fileInput.value = ''; fileInput.click(); });
    fileInput.addEventListener('change', importBackup);
    $('#st-reset').addEventListener('click', resetAll);

    // --- application
    $('#st-update').addEventListener('click', checkUpdate);
    UI.on(el, 'click', '[data-install]', async () => {
      const p = Vault.install && Vault.install.prompt;
      if (!p) return;
      try { await p.prompt(); await p.userChoice; } catch (_) { /* choix annulé */ }
      Vault.install = null;
      update(Vault.store.get());
    });
    window.addEventListener('online', () => root && refreshApp());
    window.addEventListener('offline', () => root && refreshApp());
  }

  // ------------------------------------------------------------------ sauvegarde
  function backupName() { return 'vault-sauvegarde-' + U.isoDate() + '.json'; }
  async function exportBackup() {
    const state = Vault.store.get();
    const text = State.exportData(state);
    const name = backupName();
    let done = false;
    try {
      const file = typeof File === 'function' ? new File([text], name, { type: 'application/json' }) : null;
      if (file && isMobile() && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sauvegarde VAULT' });
        done = true;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    if (!done) {
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = name; a.className = 'sr-only';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    Vault.store.update(s => { s.meta.lastBackup = new Date().toISOString(); }, 'meta');
    UI.setStatus($('#st-data-status'), 'Sauvegarde ' + name + ' prête. Garde-la ailleurs que sur ce téléphone.', 'ok');
    UI.toast('Sauvegarde exportée.', { tone: 'ok', icon: 'download' });
  }
  async function importBackup() {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const status = (m, t) => UI.setStatus($('#st-data-status'), m, t);
    if (file.size > 2000000) { status('Ce fichier est trop volumineux pour être une sauvegarde VAULT.', 'warn'); return; }
    let text = '';
    try { text = await file.text(); } catch (_) { status('Impossible de lire ce fichier.', 'warn'); return; }
    const result = State.parseImport(text);
    if (!result.ok) { status(result.error, 'warn'); return; }
    const s = result.state;
    const summary = s.people + ' ' + U.plural(s.people, 'personne', 'personnes') + ', ' + s.inventory.length + ' ' + U.plural(s.inventory.length, 'aliment', 'aliments') + ', ' + s.contacts.length + ' ' + U.plural(s.contacts.length, 'contact', 'contacts') + ', ' + s.places.length + ' ' + U.plural(s.places.length, 'point', 'points');
    const ok = await UI.confirm({
      title: 'Restaurer cette sauvegarde ?',
      text: 'Fichier du ' + (result.exported ? U.frDate(result.exported.slice(0, 10)) : 'date inconnue') + ' : ' + summary + '. Tes données actuelles seront remplacées.',
      confirmLabel: 'Restaurer', danger: true,
    });
    if (!ok) { status('Restauration annulée : tes données n’ont pas changé.', 'info'); return; }
    Vault.store.replace(s);
    status('Sauvegarde restaurée.', 'ok');
    UI.toast('Sauvegarde restaurée.', { tone: 'ok', icon: 'history' });
  }
  async function resetAll() {
    const ok = await UI.confirm({
      title: 'Tout effacer ?',
      text: 'Stock, kit, contacts, fiche vitale, points enregistrés et réglages seront effacés de cet appareil. Cette action est définitive : exporte d’abord une sauvegarde si tu veux pouvoir tout retrouver.',
      confirmLabel: 'Tout effacer', danger: true,
    });
    if (!ok) return;
    Vault.store.reset();
    UI.setStatus($('#st-data-status'), 'Toutes les données ont été effacées de cet appareil.', 'ok');
    UI.toast('Données effacées.', { icon: 'trash-2' });
  }

  // ------------------------------------------------------------------ application
  async function checkUpdate() {
    const reg = Vault.swReg;
    if (!reg) { UI.toast('Les mises à jour automatiques ne sont pas disponibles ici : ouvre VAULT depuis son adresse https.', { tone: 'warn' }); return; }
    if (!Vault.online()) { UI.toast('Hors ligne : impossible de vérifier pour le moment.', { tone: 'warn', icon: 'wifi-off' }); return; }
    try { await reg.update(); } catch (_) { UI.toast('Vérification impossible pour le moment.', { tone: 'warn' }); return; }
    setTimeout(() => { if (!reg.installing && !reg.waiting) UI.toast('Tu utilises la dernière version de VAULT.', { tone: 'ok', icon: 'badge-check' }); }, 1500);
  }
  function refreshApp() {
    const controlled = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    const chip = $('#st-offline-chip');
    chip.className = 'chip ' + (controlled ? 'chip-ok' : 'chip-warn');
    chip.textContent = controlled ? 'Disponible hors ligne' : 'Hors ligne non prêt';
    $('#st-version').textContent = Vault.version;
    const stored = Vault.storageOk ? (Vault.persisted ? 'Durable' : 'Standard') : 'Indisponible';
    $('#st-app-info').innerHTML =
      '<dt>Version</dt><dd>' + UI.esc(Vault.version) + '</dd><dt>Construction</dt><dd>' + UI.esc(Vault.build) + '</dd>' +
      '<dt>Réseau</dt><dd>' + (Vault.online() ? 'En ligne' : 'Hors ligne') + '</dd><dt>Stockage</dt><dd>' + stored + '</dd>';
    const install = $('#st-install');
    if (standalone()) install.innerHTML = '<div class="callout callout-ok">' + UI.icon('badge-check') + '<div>VAULT est installé sur ton écran d’accueil.</div></div>';
    else if (Vault.install && Vault.install.prompt) install.innerHTML = '<button type="button" class="btn btn-primary btn-lg btn-block" data-install>' + UI.icon('smartphone') + 'Installer VAULT</button>';
    else if (isIOS()) install.innerHTML = '<div class="callout">' + UI.icon('smartphone') + '<div>Pour installer VAULT sur iPhone : touche <b>Partager</b> dans Safari, puis <b>Sur l’écran d’accueil</b>. Il s’ouvrira comme une application, même hors ligne.</div></div>';
    else install.innerHTML = '<div class="callout">' + UI.icon('smartphone') + '<div>Pour installer VAULT, ouvre le menu de ton navigateur puis choisis <b>Installer l’application</b> ou <b>Ajouter à l’écran d’accueil</b>.</div></div>';
  }

  function update(state) {
    if (!root) return;
    const p = state.prefs;
    UI.$$('[data-theme]', root).forEach(b => b.setAttribute('aria-pressed', String(!p.night && b.dataset.theme === p.theme)));
    const set = (id, v) => { const el = $('#' + id); if (el.checked !== v) el.checked = v; };
    set('st-night', p.night); set('st-low', state.lowProfile); set('st-haptics', p.haptics);
    const scale = $('#st-scale');
    if (document.activeElement !== scale) scale.value = String(p.textScale);
    $('#st-scale-val').textContent = p.textScale + ' %';
    const last = state.meta.lastBackup;
    const days = last ? U.daysBetween(last.slice(0, 10), Vault.today()) : null;
    const chip = $('#st-backup-chip');
    chip.className = 'chip ' + (last ? (days > 30 ? 'chip-warn' : 'chip-ok') : 'chip-warn');
    chip.textContent = last ? (days > 30 ? 'À renouveler' : 'À jour') : 'Jamais faite';
    $('#st-backup-info').textContent = last ? 'Dernière sauvegarde : ' + U.frDate(last.slice(0, 10)) + (days > 0 ? ' (il y a ' + days + ' ' + U.plural(days, 'jour', 'jours') + ')' : ' (aujourd’hui)') + '.' : 'Aucune sauvegarde n’a encore été exportée depuis ce navigateur.';
    refreshApp();
  }

  return { id: 'settings', title: 'Réglages', mount, update };
})());


/* ==== js/90-app.js ==== */
/* Démarrage : stockage, structure de la page, apparence, navigation, hors ligne, mises à jour. */
(function boot() {
  const UI = VaultUI;

  // ------------------------------------------------------------------ stockage (repli en mémoire si le navigateur le bloque)
  let storage = null;
  let storageOk = true;
  try { storage = window.localStorage; storage.setItem('__vault_test', '1'); storage.removeItem('__vault_test'); } catch (_) {
    storageOk = false;
    const mem = {};
    storage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  }
  Vault.storageOk = storageOk;
  Vault.store = VaultState.createStore(storage);
  Vault.store.subscribe((state, what) => {
    if (what === 'prefs' || what === 'lowProfile' || what === 'replace') UI.applyAppearance();
    const id = UI.Router.current();
    const view = id && Vault.views[id];
    if (view && view.update) view.update(state, what);
  });
  window.addEventListener('pagehide', () => Vault.store.flush());
  document.addEventListener('visibilitychange', () => { if (document.hidden) Vault.store.flush(); });

  // ------------------------------------------------------------------ structure de la page
  VaultIcons.mount();
  const TABS = [
    { route: 'home', label: 'Accueil', icon: 'house' },
    { route: 'prepare', label: 'Préparer', icon: 'clipboard-check' },
    { route: 'guides', label: 'Guides', icon: 'book-open' },
    { route: 'emergency', label: 'Urgences', icon: 'siren' },
    { route: 'tools', label: 'Outils', icon: 'wrench' },
  ];
  const logo = '<svg class="brand-mark" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><rect class="bg" width="512" height="512" rx="112"/><circle class="ring" cx="256" cy="256" r="186" fill="none" stroke-width="12"/><path class="v" d="M130 140h64l62 190 62-190h64L292 386h-72z"/></svg>';
  const root = document.getElementById('root');
  root.innerHTML =
    '<div class="app">' +
      '<button type="button" class="skip" data-skip>Aller au contenu</button>' +
      '<header class="topbar">' +
        '<button type="button" class="brand" data-go="home" aria-label="VAULT, retour à l’accueil">' + logo + '<span><span class="brand-name">VAULT</span><span class="brand-sub">PREPAREDNESS SYSTEM</span></span></button>' +
        '<div class="topbar-actions">' +
          '<span class="chip chip-warn" id="net-chip" hidden>' + UI.icon('wifi-off') + 'Hors ligne</span>' +
          '<button type="button" class="icon-btn" id="btn-low" aria-pressed="false" aria-label="Mode Low Profile" title="Mode Low Profile">' + UI.icon('moon') + '</button>' +
          '<button type="button" class="icon-btn" data-go="settings" aria-label="Réglages" title="Réglages">' + UI.icon('settings') + '</button>' +
        '</div>' +
      '</header>' +
      '<main id="main" tabindex="-1">' + Vault.order.map(id => '<section class="view" id="view-' + id + '" data-view="' + id + '" aria-labelledby="h-' + id + '" hidden></section>').join('') + '</main>' +
      '<nav class="tabbar" aria-label="Navigation principale">' + TABS.map(t => '<button type="button" class="tab" data-route="' + t.route + '">' + UI.icon(t.icon) + '<span>' + t.label + '</span></button>').join('') + '</nav>' +
      '<div class="toasts" id="toasts" role="status" aria-live="polite"></div>' +
    '</div>';

  UI.on(root, 'click', '[data-go]', (e, t) => UI.Router.go(t.dataset.go));
  UI.on(root, 'click', '.tab', (e, t) => UI.Router.go(t.dataset.route));
  UI.on(root, 'click', '[data-skip]', () => UI.$('#main').focus());
  UI.$('#btn-low').addEventListener('click', () => {
    Vault.store.update(s => { s.lowProfile = !s.lowProfile; }, 'lowProfile');
    UI.toast(Vault.store.get().lowProfile ? 'Low Profile activé : interface atténuée.' : 'Low Profile désactivé.', { icon: 'moon' });
  });

  // ------------------------------------------------------------------ apparence
  UI.applyAppearance();
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const follow = () => { if (Vault.store.get().prefs.theme === 'auto') UI.applyAppearance(); };
    if (mq.addEventListener) mq.addEventListener('change', follow); else if (mq.addListener) mq.addListener(follow);
  }

  // ------------------------------------------------------------------ hors ligne
  const net = () => {
    const chip = UI.$('#net-chip');
    if (chip) chip.hidden = Vault.online();
  };
  window.addEventListener('online', () => { net(); UI.toast('De nouveau en ligne.', { tone: 'ok', icon: 'wifi' }); });
  window.addEventListener('offline', () => { net(); UI.toast('Hors ligne : VAULT continue de fonctionner.', { icon: 'wifi-off' }); });
  net();

  // ------------------------------------------------------------------ installation
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    Vault.install = { prompt: e };
    const id = UI.Router.current();
    if (Vault.views[id] && Vault.views[id].update) Vault.views[id].update(Vault.store.get(), 'install');
  });
  window.addEventListener('appinstalled', () => { Vault.install = null; UI.toast('VAULT est installé.', { tone: 'ok' }); });

  // ------------------------------------------------------------------ service worker et mises à jour
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    let controlled = !!navigator.serviceWorker.controller;                // la première prise de contrôle (premiere visite) ne declenche pas de rechargement
    const announce = worker => UI.toast('Une nouvelle version de VAULT est prête.', {
      tone: 'ok', icon: 'refresh-cw', duration: 20000, action: { label: 'Mettre à jour', onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }) },
    });
    navigator.serviceWorker.register('./sw.js').then(reg => {
      Vault.swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) announce(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) announce(w); });
      });
      reg.update().catch(() => {});
      setInterval(() => reg.update().catch(() => {}), 3600000);
    }).catch(() => {});
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!controlled) { controlled = true; return; }
      if (reloading) return;
      reloading = true;
      location.reload();
    });
  }
  // Demande un stockage durable (évite l'effacement automatique des données en cas de manque de place).
  if (navigator.storage && navigator.storage.persisted) {
    navigator.storage.persisted().then(p => {
      Vault.persisted = p;
      if (!p && navigator.storage.persist) navigator.storage.persist().then(r => { Vault.persisted = r; }).catch(() => {});
    }).catch(() => {});
  }

  // ------------------------------------------------------------------ démarrage
  UI.Router.start();
  if (Vault.store.info.existed && Vault.store.info.migrated) {
    UI.toast('Tes données de la version précédente ont été reprises.', { tone: 'ok', icon: 'history' });
    Vault.store.update(() => {}, 'migrated');
  }
  if (!storageOk) UI.toast('Le stockage du navigateur est bloqué : tes données ne seront pas conservées.', { tone: 'warn', duration: 8000 });
})();

