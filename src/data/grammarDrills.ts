export type DrillCategory = 'n_deklination' | 'konjunktiv' | 'genitiv' | 'zustandspassiv';

export interface GrammarQuestion {
  id: string;
  category: DrillCategory;
  question: string;
  options: string[];
  correctIndex: number;
  rule: string;
  explanation: string;
}

export const DRILL_CATEGORIES: { id: DrillCategory; label: string; description: string }[] = [
  { id: 'n_deklination', label: 'N-Deklination', description: 'N-Declension of masculine nouns' },
  { id: 'konjunktiv', label: 'Konjunktiv I/II', description: 'Subjunctive in news reporting' },
  { id: 'genitiv', label: 'Genitiv-Präpositionen', description: 'Genitive prepositions' },
  { id: 'zustandspassiv', label: 'Zustandspassiv', description: 'State passive (sein + Partizip II)' },
];

export const CATEGORY_LABELS: Record<DrillCategory, string> = {
  n_deklination: 'N-Deklination',
  konjunktiv: 'Konjunktiv I/II',
  genitiv: 'Genitiv-Präpositionen',
  zustandspassiv: 'Zustandspassiv',
};

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  // N-Deklination
  {
    id: 'nd1',
    category: 'n_deklination',
    question: 'Der Student beschwert sich beim ____ des Prüfungsausschusses.',
    options: ['Herrn', 'Herr', 'Herren', 'Herrs'],
    correctIndex: 0,
    rule: 'N-Deklination: Maskuline Nomen auf -e, -ent, -ant, -ist, -or, -oge, -graf erhalten im Dativ/Akkusativ/Genitiv ein -n.',
    explanation: '"Herr" gehört zu den N-Deklinationswörtern. Im Dativ (nach "beim") wird ein -n angehängt: "dem Herrn". Andere Beispiele: der Student → dem Studenten, der Herr → dem Herrn.',
  },
  {
    id: 'nd2',
    category: 'n_deklination',
    question: 'Das Gespräch mit dem ____ verlief konstruktiv.',
    options: ['Präsident', 'Präsidenten', 'Präsidentn', 'Präsidenden'],
    correctIndex: 1,
    rule: 'N-Deklination: Nomen auf -ent und -ant erhalten ein -n im obliquen Kasus (Dativ, Akkusativ, Genitiv).',
    explanation: '"Präsident" endet auf -ent/-ant und gehört zur N-Deklination. Im Dativ heißt es: "dem Präsidenten". Ebenso: der Assistent → dem Assistenten.',
  },
  {
    id: 'nd3',
    category: 'n_deklination',
    question: 'Wir danken dem ____ für seine Ausführungen.',
    options: ['Soziologe', 'Soziologen', 'Soziolog', 'Soziologens'],
    correctIndex: 1,
    rule: 'N-Deklination: Nomen auf -oge (Biologe, Soziologe, Psychologe) deklinieren mit -n.',
    explanation: '"Soziologe" endet auf -oge und erhält im Dativ ein -n: "dem Soziologen". Gleiches gilt für: Biologe → Biologen, Psychologe → Psychologen.',
  },
  {
    id: 'nd4',
    category: 'n_deklination',
    question: 'Welcher Satz ist korrekt?',
    options: [
      'Ich sehe den Herr und grüße ihn.',
      'Ich sehe den Herrn und grüße ihn.',
      'Ich sehe den Herren und grüße ihn.',
      'Ich sehe der Herrn und grüße ihn.',
    ],
    correctIndex: 1,
    rule: 'N-Deklination im Akkusativ: Auch im Akkusativ erhält das Nomen das -n.',
    explanation: '"Herr" dekliniert nach der N-Deklination. Akkusativ: "den Herrn" (nicht "den Herr"). Das -n erscheint in allen Kasus außer dem Nominativ Singular.',
  },
  {
    id: 'nd5',
    category: 'n_deklination',
    question: 'Die Rechte des ____ sind verfassungsmäßig garantiert.',
    options: ['Bürgers', 'Bürgern', 'Bürgers', 'Bürger'],
    correctIndex: 3,
    rule: 'Ausnahme: N-Deklination gilt NICHT im Genitiv Singular — dort bleibt die Form ohne -n.',
    explanation: 'Im Genitiv Singular endet "Bürger" ohne -n: "des Bürgers". Die N-Deklination greift nur in Dativ und Akkusativ, nicht im Genitiv Singular.',
  },

  // Konjunktiv I/II
  {
    id: 'kj1',
    category: 'konjunktiv',
    question: 'Der Minister sagte, er ____ die Reform vorantreiben.',
    options: ['werde', 'würde', 'wird', 'werden'],
    correctIndex: 0,
    rule: 'Konjunktiv I in der indirekten Rede: Der Minister sagte, er werde... (wird zu würde nur, wenn Konjunktiv I mit Indikativ identisch ist).',
    explanation: 'In der indirekten Rede (Nachrichtenstil) steht Konjunktiv I: "er werde". Konjunktiv II ("würde") verwendet man nur, wenn Konjunktiv I mit dem Indikativ identisch ist (z.B. bei "haben": er habe → würde haben).',
  },
  {
    id: 'kj2',
    category: 'konjunktiv',
    question: 'Der Sprecher erklärte, die Verhandlungen ____ erfolgreich verlaufen.',
    options: ['seien', 'wären', 'sind', 'waren'],
    correctIndex: 0,
    rule: 'Konjunktiv I der Vergangenheit von "sein": seien (Plural). In der indirekten Rede bleibt Konjunktiv I.',
    explanation: '"Sein" im Konjunktiv I Plural: "sie seien". In der indirekten Rede: "die Verhandlungen seien erfolgreich verlaufen." Konjunktiv II ("wären") ist hier nicht nötig, da Konjunktiv I eindeutig ist.',
  },
  {
    id: 'kj3',
    category: 'konjunktiv',
    question: 'Die Zeitung berichtet, der Kanzler ____ heute eine Rede halten.',
    options: ['werde', 'würde', 'wird', 'werden'],
    correctIndex: 0,
    rule: 'Konjunktiv I zur Distanzierung in Nachrichten: Der Reporter signalisiert, dass er die Aussage nicht als eigene Tatsache verbürgt.',
    explanation: 'Im journalistischen Kontext signalisiert Konjunktiv I ("werde") Distanz: Der Reporter übernimmt die Aussage nicht als eigene. Konjunktiv II ("würde") ist hier nicht korrekt, da Konjunktiv I eindeutig ist.',
  },
  {
    id: 'kj4',
    category: 'konjunktiv',
    question: 'Welche Form ist korrekt? "Er sagte, er ____ Zeit gehabt."',
    options: ['habe', 'hätte', 'hatte', 'haben'],
    correctIndex: 0,
    rule: 'Konjunktiv I Perfekt: habe + Partizip II. Da "habe" nicht mit Indikativ identisch ist, bleibt Konjunktiv I.',
    explanation: 'Konjunktiv I Perfekt: "er habe Zeit gehabt". Da die Form "habe" eindeutig als Konjunktiv I erkennbar ist (Indikativ: "hatte"), wird sie beibehalten. Konjunktiv II ("hätte") wäre nur bei Mehrdeutigkeit nötig.',
  },
  {
    id: 'kj5',
    category: 'konjunktiv',
    question: 'In der indirekten Rede: "Sie meinte, sie ____ gerne kommen." (Konjunktiv II, da KI = Indikativ)',
    options: ['kommen', 'käme', 'käm', 'würde kommen'],
    correctIndex: 3,
    rule: 'Wenn Konjunktiv I mit dem Indikativ identisch ist, wird auf Konjunktiv II ausgewichen: würde + Infinitiv.',
    explanation: 'Konjunktiv I von "kommen" (sie komme) ist eindeutig, aber in der 1. Person Singular/Plural ist "ich komme/wir kommen" identisch mit dem Indikativ. In solchen Fällen weicht man auf Konjunktiv II aus: "sie würde gerne kommen".',
  },

  // Genitiv-Präpositionen
  {
    id: 'ge1',
    category: 'genitiv',
    question: '____ der schweren Bedingungen wurde das Experiment abgebrochen.',
    options: ['Wegen', 'Aufgrund', 'Trotz', 'Während'],
    correctIndex: 0,
    rule: 'Genitiv-Präpositionen: wegen, aufgrund, trotz, während, wegen, anstatt, innerhalb, außerhalb verlangen den Genitiv.',
    explanation: '"Wegen" verlangt den Genitiv: "wegen der schweren Bedingungen" (Genitiv). Im umgangssprachlichen Deutsch wird oft der Dativ verwendet ("wegen den..."), was im formellen C2-Kontext als fehlerhaft gilt.',
  },
  {
    id: 'ge2',
    category: 'genitiv',
    question: '____ des schlechten Wetters fiel die Veranstaltung aus.',
    options: ['Aufgrund', 'Mit', 'Bei', 'Für'],
    correctIndex: 0,
    rule: 'Aufgrund + Genitiv: Eine der wichtigsten Genitiv-Präpositionen im formellen Register.',
    explanation: '"Aufgrund" verlangt zwingend den Genitiv: "aufgrund des schlechten Wetters". Im C2-Kontext ist dies die formellere Alternative zu "wegen".',
  },
  {
    id: 'ge3',
    category: 'genitiv',
    question: '____ der komplexen Methodik blieben die Ergebnisse unklar.',
    options: ['Trotz', 'Trotz', 'Trotz', 'Trotz'],
    correctIndex: 0,
    rule: 'Trotz + Genitiv: Im gehobenen Deutsch immer mit Genitiv, nie mit Dativ.',
    explanation: '"Trotz" verlangt den Genitiv: "trotz der komplexen Methodik". Die umgangssprachliche Dativform ("trotz dem...") ist im C2-Register nicht akzeptabel.',
  },
  {
    id: 'ge4',
    category: 'genitiv',
    question: 'Die Ergebnisse sind ____ der Erwartungen ausgefallen.',
    options: ['innerhalb', 'außerhalb', 'oberhalb', 'unterhalb'],
    correctIndex: 3,
    rule: 'Lokale Genitiv-Präpositionen: innerhalb, außerhalb, oberhalb, unterhalb, diesseits, jenseits verlangen den Genitiv.',
    explanation: '"Unterhalb" ist eine lokale Genitiv-Präposition: "unterhalb der Erwartungen" (Genitiv). Ebenso: oberhalb des Berges, innerhalb der Stadt, außerhalb des Gebäudes.',
  },
  {
    id: 'ge5',
    category: 'genitiv',
    question: '____ der Diskussion wurden neue Argumente vorgebracht.',
    options: ['Während', 'Bei', 'In', 'Mit'],
    correctIndex: 0,
    rule: 'Während + Genitiv: Temporale Genitiv-Präposition im formellen Deutsch.',
    explanation: '"Während" verlangt den Genitiv: "während der Diskussion". Die Dativform ("während der Diskussion" kann auch Dativ sein, aber "während des Tages" ist eindeutig Genitiv). Im C2-Kontext ist Genitiv die korrekte Wahl.',
  },
  {
    id: 'ge6',
    category: 'genitiv',
    question: '____ der hohen Kosten wurde das Projekt eingestellt.',
    options: ['Anstatt', 'Laut', 'Wegen', 'Mit'],
    correctIndex: 2,
    rule: 'Wegen + Genitiv: Die häufigste Genitiv-Präposition für Kausalangaben.',
    explanation: '"Wegen" verlangt den Genitiv: "wegen der hohen Kosten". Dies ist die Standard-Genitiv-Präposition für kausale Begründungen im formellen Register.',
  },

  // Zustandspassiv
  {
    id: 'zp1',
    category: 'zustandspassiv',
    question: 'Die Tür ist ____. (Zustandspassiv)',
    options: ['geschlossen', 'schließen', 'schließt', 'schloss'],
    correctIndex: 0,
    rule: 'Zustandspassiv: sein + Partizip II. Es beschreibt einen Zustand, der das Resultat einer Handlung ist.',
    explanation: 'Das Zustandspassiv wird mit "sein + Partizip II" gebildet: "die Tür ist geschlossen". Es beschreibt den Zustand (die Tür ist zu), nicht die Handlung (Vorgangspassiv: die Tür wird geschlossen).',
  },
  {
    id: 'zp2',
    category: 'zustandspassiv',
    question: 'Welcher Satz beschreibt ein Zustandspassiv?',
    options: [
      'Das Haus wird renoviert.',
      'Das Haus ist renoviert.',
      'Das Haus wird renovieren.',
      'Das Haus renoviert.',
    ],
    correctIndex: 1,
    rule: 'Zustandspassiv (sein + Partizip II) vs. Vorgangspassiv (werden + Partizip II).',
    explanation: '"Das Haus ist renoviert" = Zustandspassiv (sein + Partizip II) — beschreibt den fertigen Zustand. "Das Haus wird renoviert" = Vorgangspassiv (werden + Partizip II) — beschreibt den laufenden Vorgang.',
  },
  {
    id: 'zp3',
    category: 'zustandspassiv',
    question: 'Der Brief ist bereits ____. (Zustand nach einer Handlung)',
    options: ['abgeschickt', 'abschicken', 'schickt ab', 'abgeschickt worden'],
    correctIndex: 0,
    rule: 'Zustandspassiv mit "sein + Partizip II": Der Zustand als Resultat einer abgeschlossenen Handlung.',
    explanation: '"Der Brief ist bereits abgeschickt" = Zustandspassiv. Das Resultat der Handlung (Abschicken) ist eingetreten und beschreibt nun einen Zustand. Vorgangspassiv wäre: "Der Brief ist abgeschickt worden" (Perfekt Vorgangspassiv).',
  },
  {
    id: 'zp4',
    category: 'zustandspassiv',
    question: 'Die Wände sind frisch ____. (Zustandspassiv)',
    options: ['gestrichen', 'streichen', 'gestrichen worden', 'wird gestrichen'],
    correctIndex: 0,
    rule: 'Zustandspassiv: sein + Partizip II. Das Partizip II beschreibt den erreichten Zustand.',
    explanation: '"Die Wände sind frisch gestrichen" = Zustandspassiv. Die Wände sind in einem frisch gestrichenen Zustand. Die Handlung (Streichen) ist abgeschlossen, das Resultat ist sichtbar.',
  },
  {
    id: 'zp5',
    category: 'zustandspassiv',
    question: 'Welche Form ist das Zustandspassiv von "öffnen" in der 3. Person Singular?',
    options: ['ist geöffnet', 'wird geöffnet', 'öffnete', 'hat geöffnet'],
    correctIndex: 0,
    rule: 'Zustandspassiv = sein + Partizip II: ist geöffnet, sind geöffnet, war geöffnet, waren geöffnet.',
    explanation: 'Das Zustandspassiv von "öffnen": "ist geöffnet" (Präsens), "war geöffnet" (Präteritum), "ist geöffnet gewesen" (Perfekt). Es beschreibt den Zustand des Offenseins, nicht das Öffnen selbst.',
  },
];
