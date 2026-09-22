import type { Flashcard } from '@/types';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv(cards: Flashcard[]): void {
  const headers = ['Front', 'Back', 'Example', 'Category', 'Difficulty', 'Tags'];
  const rows = cards.map(c => [
    escapeCsv(c.front),
    escapeCsv(c.back),
    escapeCsv(c.example),
    escapeCsv(c.category),
    escapeCsv(c.difficulty),
    escapeCsv(`German::C2::${c.category}`),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csv, 'german-tutor-flashcards.csv', 'text/csv');
}

export function exportToAnki(cards: Flashcard[]): void {
  // Anki TSV format: Front\tBack\tTags
  // Anki can import tab-separated files directly
  const headers = ['#separator:tab', '#html:false', '#tags column:3'];
  const rows = cards.map(c =>
    [c.front, c.back, `German::C2::${c.category}`]
      .map(v => v.replace(/\t/g, ' '))
      .join('\t'),
  );

  const tsv = [...headers, '', ...rows].join('\n');
  downloadFile(tsv, 'german-tutor-anki-deck.txt', 'text/tab-separated-values');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
