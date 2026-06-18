// Single source of truth for the 3D models. `slug` is the /konfigurator/[modul]
// route segment; `file` is the GLB in /public/models; `name` is the display name.
// `specs` are language-neutral (numbers + unit); their labels are translated.
export const MODELS = [
  {
    slug: "large-modul",
    file: "/models/large_full_final.glb",
    name: "Large Modul",
    specs: [
      { key: "width", value: "12'" },
      { key: "length", value: "24'" },
      { key: "height", value: "10'" },
      { key: "floors", value: "1" },
    ],
    // Configurator schema. Node names are the REAL group-node names inside
    // large_full_final.glb (verified by parsing the GLB). Toggling a group
    // node's `.visible` hides/shows its child geometry (visibility in three.js
    // is hierarchical). `base` nodes are always visible. Each group is a radio:
    // exactly one option visible at a time; the first option is the default.
    config: {
      base: ["konstrukcija"],
      groups: [
        {
          id: "krov",
          title: { sr: "Krovovi", en: "Roofs" },
          options: [
            { node: "krov_pun", label: { sr: "Puni krov", en: "Full roof" } },
            { node: "stakleni_krov", label: { sr: "Stakleni krov", en: "Glass roof" } },
          ],
        },
        {
          id: "fasada1",
          title: { sr: "Fasada 1", en: "Facade 1" },
          options: [
            { node: "fasada_1_sa_vratima", label: { sr: "Sa vratima", en: "With door" } },
            { node: "fasada_1_bez_vrata", label: { sr: "Bez vrata", en: "Without door" } },
          ],
        },
        {
          id: "fasada2",
          title: { sr: "Fasada 2", en: "Facade 2" },
          options: [
            { node: "fasada_2_pun_zid", label: { sr: "Pun zid", en: "Solid wall" } },
          ],
        },
        {
          id: "fasada3",
          title: { sr: "Fasada 3", en: "Facade 3" },
          options: [
            { node: "fasada_3_pun_zid", label: { sr: "Pun zid", en: "Solid wall" } },
            { node: "fasada_3_prozor_spavaca", label: { sr: "Prozor (spavaća)", en: "Window (bedroom)" } },
          ],
        },
        {
          id: "fasada4",
          title: { sr: "Fasada 4", en: "Facade 4" },
          options: [
            { node: "fasada_4_pun_zid", label: { sr: "Pun zid", en: "Solid wall" } },
            { node: "fasada_4_fix", label: { sr: "Fiksno staklo", en: "Fixed glass" } },
            { node: "fasada_4_kupatilo_prozor", label: { sr: "Prozor (kupatilo)", en: "Window (bathroom)" } },
            { node: "fasada_4_podizno_klizniiiiiii", label: { sr: "Podizno-klizna vrata", en: "Lift-slide door" } },
          ],
        },
      ],
    },
  },
  {
    slug: "small-modul",
    file: "/models/small_full.glb",
    name: "Small Modul",
    specs: [
      { key: "width", value: "8'" },
      { key: "length", value: "20'" },
      { key: "height", value: "9.5'" },
      { key: "floors", value: "1" },
    ],
  },
  {
    slug: "small-modul-v2",
    file: "/models/small_v2_full.glb",
    name: "Small Modul V2",
    specs: [
      { key: "width", value: "8'" },
      { key: "length", value: "16'" },
      { key: "height", value: "9.5'" },
      { key: "floors", value: "1" },
    ],
  },
];

export const getModel = (slug) => MODELS.find((m) => m.slug === slug);

// Default model used by the global Menu "Konfigurator" link.
export const DEFAULT_MODEL_SLUG = MODELS[0].slug;
