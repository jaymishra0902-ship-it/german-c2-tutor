export type EssayType = 'academic_opinion' | 'formal_petition' | 'literary_analysis';

export interface ExamPrompt {
  id: string;
  type: EssayType;
  title: string;
  prompt: string;
  instructions: string[];
  timeLimitMin: number;
  minWords: number;
  maxWords: number;
}

export const EXAM_PROMPTS: ExamPrompt[] = [
  {
    id: 'academic_opinion_1',
    type: 'academic_opinion',
    title: 'Akademische Stellungnahme',
    prompt: 'Inwiefern trägt die Digitalisierung der Wissenschaften zu einer Demokratisierung des Wissens bei, und welche Gefahren sind damit verbunden? Nehmen Sie kritisch Stellung und belegen Sie Ihre Argumente mit konkreten Beispielen.',
    instructions: [
      'Formulieren Sie eine klare These mit begründetem Standpunkt.',
      'Belegen Sie Ihre Argumente mit konkreten Beispielen aus der Wissenschaftsgeschichte.',
      'Gehen Sie konträre Positionen ein und widerlegen Sie diese sachlich.',
      'Verwenden Sie einen sachlich-akademischen Stil mit komplexen Satzgefügen.',
    ],
    timeLimitMin: 70,
    minWords: 250,
    maxWords: 400,
  },
  {
    id: 'formal_petition_1',
    type: 'formal_petition',
    title: 'Formeller Antrag',
    prompt: 'Verfassen Sie einen formalen Antrag an den Senat der Universität, in dem Sie die Wiedereinführung von Präsenzveranstaltungen in den Geisteswissenschaften fordern. Berücksichtigen Sie die formellen Kriterien eines akademischen Antrags.',
    instructions: [
      'Gliedern Sie den Antrag in Einleitung, Begründung, Forderung und Schluss.',
      'Verwenden Sie formelle Anrede und höflich-präzise Sprache.',
      'Nennen Sie mindestens drei konkrete Argumente mit Begründung.',
      'Schließen Sie mit einer klaren, handlungsorientierten Forderung ab.',
    ],
    timeLimitMin: 60,
    minWords: 200,
    maxWords: 350,
  },
  {
    id: 'literary_analysis_1',
    type: 'literary_analysis',
    title: 'Literarische Analyse',
    prompt: 'Analysieren Sie die Funktion des Erzählers in Thomas Manns "Der Zauberberg". Inwiefern dient die ironische Distanz des Erzählers als Kommentar zur bürgerlichen Kultur der Vorkriegszeit?',
    instructions: [
      'Beginnen Sie mit einer präzisen These zur Erzählerfunktion.',
      'Analysieren Sie konkrete Textstellen und Stilmerkmale.',
      'Beziehen Sie sich auf den historisch-kulturellen Kontext der Erzählung.',
      'Vermeiden Sie reine Nacherzählung — argumentieren Sie analytisch.',
    ],
    timeLimitMin: 80,
    minWords: 300,
    maxWords: 500,
  },
];

export const ESSAY_TYPE_LABELS: Record<EssayType, string> = {
  academic_opinion: 'Akademische Stellungnahme',
  formal_petition: 'Formeller Antrag',
  literary_analysis: 'Literarische Analyse',
};

export interface GoetheScore {
  vocabularyRichness: number;
  coherence: number;
  grammarPrecision: number;
  overall: number;
  band: string;
  feedback: string[];
  wordCount: number;
  timeUsed: number;
  taskFulfillment: number;
}
