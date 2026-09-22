export interface IdiomEntry {
  id: string;
  idiom: string;
  literal: string;
  figurative: string;
  example: string;
  context: string;
  register: 'umgangssprachlich' | 'gehoben' | 'literarisch' | 'fachsprachlich';
}

export const IDIOMS: IdiomEntry[] = [
  {
    id: 'idiom_1',
    idiom: 'das Kind mit dem Bade ausschütten',
    literal: 'To pour the child out with the bathwater',
    figurative: 'Etwas Wertvolles zusammen mit dem Unerwünschten wegwerfen — übertriebene oder unangemessene Reaktion, bei der das Gute mit dem Schlechten beseitigt wird.',
    example: 'Durch die radikalen Sparmaßnahmen wurde das Kind mit dem Bade ausgeschüttet: auch bewährte Forschungsprogramme fielen den Kürzungen zum Opfer.',
    context: 'Häufig in politischen und wissenschaftlichen Debatten, um vor überzogenen Konsequenzen zu warnen.',
    register: 'gehoben',
  },
  {
    id: 'idiom_2',
    idiom: 'jemandem die Flinte ins Korn werfen',
    literal: 'To throw one\'s rifle into the grain (give up)',
    figurative: 'Aufgeben, die Flucht ergreifen — in einer schwierigen Situation resignieren oder kapitulieren.',
    example: 'Angesichts der komplexen theoretischen Anforderungen warf der Doktorand die Flinte ins Korn und wechselte das Thema.',
    context: 'Wird oft im akademischen oder beruflichen Kontext verwendet, um das Aufgeben einer Herausforderung zu beschreiben.',
    register: 'gehoben',
  },
  {
    id: 'idiom_3',
    idiom: 'die Kirche im Dorf lassen',
    literal: 'To leave the church in the village',
    figurative: 'Maßhalten, nicht übertreiben — Dinge in einem vernünftigen Rahmen halten und proportioniert reagieren.',
    example: 'Wir sollten die Kirche im Dorf lassen — es handelt sich um eine vorläufige Studie, nicht um ein endgültiges Urteil.',
    context: 'Besonders in Diskussionen, um zur Besonnenheit aufzurufen und Übertreibungen entgegenzutreten.',
    register: 'umgangssprachlich',
  },
  {
    id: 'idiom_4',
    idiom: 'den Bock zum Gärtner machen',
    literal: 'To make the billy goat the gardener',
    figurative: 'Jemandem eine Aufgabe übertragen, die er aufgrund seiner Natur zwangsläufig missbrauchen wird — eine Person mit einer Aufgabe betrauen, die sie nicht neutral ausführen kann.',
    example: 'Indem die Bank den Betrüger mit der internen Revision beauftragte, machten sie den Bock zum Gärtner.',
    context: 'Wird in institutionellen und politischen Kontexten verwendet, um strukturelle Interessenkonflikte zu kritisieren.',
    register: 'gehoben',
  },
  {
    id: 'idiom_5',
    idiom: 'bei jemandem durch den Rost fallen',
    literal: 'To fall through the rust (slats) with someone',
    figurative: 'Bei jemandem auffallen, negativ auffallen — durch eine Schwäche oder einen Fehler entlarvt werden.',
    example: 'Seine mangelnde Vertrautheit mit der Methodik fiel bei der mündlichen Prüfung schnell durch den Rost.',
    context: 'Häufig in akademischen Prüfungs- und Bewertungssettings, um das Aufdecken von Wissenslücken zu bezeichnen.',
    register: 'umgangssprachlich',
  },
  {
    id: 'idiom_6',
    idiom: 'jemandem nicht das Wasser reichen können',
    literal: 'To not be able to hand someone the water',
    figurative: 'Jemandem weit unterlegen sein — in keiner Weise mit jemandem mithalten können, sei es an Können, Wissen oder Qualität.',
    example: 'Was die rhetorische Brillanz betrifft, kann ihm keiner der Kandidaten das Wasser reichen.',
    context: 'Wird oft in Vergleichen von Personen oder Werken verwendet, um eine herausragende Qualität zu betonen.',
    register: 'gehoben',
  },
  {
    id: 'idiom_7',
    idiom: 'das Eisen schmieden, solange es heiß ist',
    literal: 'To forge the iron while it is hot',
    figurative: 'Eine günstige Gelegenheit sofort nutzen — im richtigen Moment handeln, bevor die Umstände sich verschlechtern.',
    example: 'Wir sollten das Eisen schmieden, solange es heiß ist und den Kooperationsvertrag jetzt abschließen, bevor sich die politische Lage ändert.',
    context: 'In strategischen und verhandlungstechnischen Kontexten, um zu sofortigem Handeln zu mahnen.',
    register: 'gehoben',
  },
  {
    id: 'idiom_8',
    idiom: 'Öl ins Feuer gießen',
    literal: 'To pour oil into the fire',
    figurative: 'Eine bereits angespannte Situation verschärfen — durch provokante Aussagen oder Handlungen einen Konflikt weiter eskalieren.',
    example: 'Seine provokanten Bemerkungen während der Podiumsdiskussion gossen weiteres Öl ins Feuer der Debatte.',
    context: 'In politischen und sozialen Konfliktsituationen, um das Verschärfen von Spannungen zu beschreiben.',
    register: 'gehoben',
  },
  {
    id: 'idiom_9',
    idiom: 'den Nagel auf den Kopf treffen',
    literal: 'To hit the nail on the head',
    figurative: 'Etwas exakt und präzise benennen — den Kern einer Sache mit wenigen Worten richtig erfassen.',
    example: 'Ihre knappe Analyse traf den Nagel auf den Kopf: das Problem liegt nicht in der Methode, sondern in den Prämissen.',
    context: 'In akademischen und analytischen Kontexten, um präzise und treffende Aussagen zu loben.',
    register: 'umgangssprachlich',
  },
  {
    id: 'idiom_10',
    idiom: 'auf dem laufenden sein',
    literal: 'To be on the running (track)',
    figurative: 'Aktuell informiert sein — über den neuesten Stand der Dinge Bescheid wissen.',
    example: 'Um auf dem laufenden zu bleiben, empfiehlt sich die regelmäßige Lektüre fachspezifischer Journals.',
    context: 'In beruflichen und akademischen Kontexten, um Wissensstand und Informiertheit auszudrücken.',
    register: 'umgangssprachlich',
  },
  {
    id: 'idiom_11',
    idiom: 'jm. einen Bären aufbinden',
    literal: 'To tie a bear onto someone',
    figurative: 'Jemanden täuschen oder belügen — jemandem eine unwahre oder übertriebene Geschichte erzählen und sie als wahr darstellen.',
    example: 'Der Verkäufer wollte ihm einen Bären aufbinden: angeblich sei das Gerät erst drei Monate alt.',
    context: 'Wird in alltäglichen und geschäftlichen Kontexten verwendet, um Täuschung zu bezeichnen.',
    register: 'umgangssprachlich',
  },
  {
    id: 'idiom_12',
    idiom: 'die Flinte ins Korn werfen',
    literal: 'To throw the rifle into the grain',
    figurative: 'Aufgeben, resignieren — in einer schwierigen Situation die Hoffnung oder das Engagement verlieren.',
    example: 'Trotz der anfänglichen Rückschläge warf sie nicht die Flinte ins Korn, sondern beharrte auf ihrer Methodik.',
    context: 'In akademischen und beruflichen Kontexten, um das Aufgeben von Projekten oder Vorhaben zu beschreiben.',
    register: 'gehoben',
  },
];
