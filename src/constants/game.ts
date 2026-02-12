import type { Preset } from "../types/preset";
import type { Theme } from "../types/theme";

export const FIXED_COLUMNS = ["Stadt", "Land", "Fluss"];
export const RANDOM_COLUMN_COUNT = 8;
export const MAX_COLUMN_COUNT = 12;
export const PREVIEW_ROWS = 13;

export const PRESET_COLUMNS = [
  "Tier",
  "Beruf",
  "Pflanze",
  "Essen",
  "Getränk",
  "Sportart",
  "Film",
  "Serie",
  "Musikband",
  "Instrument",
  "Farbe",
  "Auto-Marke",
  "Promi",
  "Vorname",
  "Nachname",
  "Stadtteil",
  "Bundesland",
  "Fluss",
  "Berg",
  "Obst",
  "Gemüse",
  "Spiel",
  "Buch",
  "Superheld",
  "Fantasywesen",
  "Fortbewegungsmittel",
  "Schulfach",
  "Erfindung",
  "Webseite",
  "App",
  "Emoji",
  "Getränkemarke",
  "Spitzname",
  "Märchenfigur",
  "Videospiel",
  "Zeitschrift/Zeitung",
  "Bauwerk"
] as const;

export const SCIENTIFIC_PRESET_COLUMNS = [
  "Physikalische Größe",
  "Chemisches Element",
  "Wissenschaftler/in",
  "Nobelpreisträger",
  "Sternbild / Weltall",
  "Laborgerät",
  "Programmiersprache",
  "Algorithmus",
  "Erfindung",
  "Geologie",
  "Biologie",
  "Mathebegriff",
  "Wetterbegriff",
  "Krankheit",
  "Computerteil"
] as const;

export const ADULT_PRESET_COLUMNS = [
  "Biermarke/Cocktail",
  "Spirituose",
  "Kartenspiel",
  "Film ab 18",
  "Sexstellung",
  "peinliche Nachricht",
  "Streitgrund",
  "Anmachspruch",
  "Date-Idee",
  "Flirtspruch",
  "Sexausrede",
  "Nachtaktivität",
  "Politiker"
 ] as const;

export const TV_AND_FILM_PRESET_COLUMNS = [
  "Filmgenre",
  "Fernsehserie",
  "Schauspieler/in",
  "Filmregisseur/in",
  "Filmfigur",
  "TV-Sender",
  "Science-Fiction-Film",
  "Romanzen-Film",
  "Comedy Serie/Film",
] as const;

export const KIDS_PRESET_COLUMNS = [
  "Farbe",
  "Tier",
  "Essen",
  "Süßigkeit",
  "aus Holz",
  "Im Kühlschrank",
  "Sportart",
  "Pizzabelag",
  "etwas rundes",
  "Auf dem Bauernhof",
  "Kleiner als ein Fußball",
  "Märchen",
  "Im Flugzeug",
  "In der Schule"
] as const;

export const CLASSIC_PRESET_COLUMNS = [
  "Stadt",
  "Land",
  "Fluss",
  "Tier",
  "Beruf",
  "Pflanze",
  "Name",
  "Farbe",
  "(Auto-)Marke",
  "Gegenstand",
  "Film",
  "Sportart",
  "Hauptstadt",
  "Essen",
] as const;

export const PRESETS: Preset[] = [
  {
    id: "klassiker",
    name: "Klassiker",
    columns: CLASSIC_PRESET_COLUMNS,
  },
  {
    id: "general",
    name: "Allgemein",
    columns: PRESET_COLUMNS,
  },
  {
    id: "scientific",
    name: "Wissenschaftlich",
    columns: SCIENTIFIC_PRESET_COLUMNS,
  },
  {
    id: "adult",
    name: "Über 18",
    columns: ADULT_PRESET_COLUMNS,
  },
  {
    id: "tv-film",
    name: "Fernsehen & Film",
    columns: TV_AND_FILM_PRESET_COLUMNS,
  },
  {
    id: "kids",
    name: "Kinder",
    columns: KIDS_PRESET_COLUMNS,
  },
];

export const DEFAULT_SELECTED_PRESET_IDS: string[] = PRESETS.map((preset) => preset.id);

export const THEMES: Theme[] = [
  { id: "classic", name: "Kariert", paperClass: "theme-classic" },
  { id: "sunny", name: "Notizblock", paperClass: "theme-sunny" },
  { id: "mint", name: "Skizzenblatt", paperClass: "theme-mint" },
  { id: "kids", name: "Kinder", paperClass: "theme-kids" },
];

export const DEFAULT_THEME: Theme = THEMES[0] ?? {
  id: "classic",
  name: "Kariert",
  paperClass: "theme-classic",
};

export const DEFAULT_CLASSIC_COLUMNS = [
  ...FIXED_COLUMNS,
  "Tier",
  "Beruf",
  "Pflanze",
  "Essen",
  "Sportart",
];
