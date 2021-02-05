import { createReadStream } from 'fs';
import { createInterface } from 'readline';

import { Digit } from './types';
import { CHARACTERS, ACCOUNT_NUMBER_LENGTH, CHARACTER_WIDTH, CHARACTER_HEIGHT } from './constants';

export const validateEntry = (entry: string[]): string[] => {
  if (!entry) {
    throw new Error(`Undefined account number entry.`);
  }
  if (entry.length !== CHARACTER_HEIGHT) {
    throw new Error(`
      Invalid account number entry.
      Entry must be ${CHARACTER_HEIGHT} lines, not ${entry.length}.
    `);
  }
  entry.forEach((row: string, index: number) => {
    if (row.length !== ACCOUNT_NUMBER_LENGTH * CHARACTER_WIDTH) {
      throw new Error(`
        Invalid account number entry.
        Entries must be ${ACCOUNT_NUMBER_LENGTH * CHARACTER_WIDTH} characters wide, not ${row.length} (row ${index}).
      `);
    }
  });
  return entry;
};

export const validateCharacter = (character: string[]): string[] => {
  if (!character) {
    throw new Error(`Undefined character.`);
  }
  if (character.length !== CHARACTER_HEIGHT) {
    throw new Error(`Invalid character. Characters must me ${CHARACTER_HEIGHT} lines.`);
  }
  character.forEach((row: string, index: number) => {
    if (row.length !== CHARACTER_WIDTH) {
      throw new Error(`
        Invalid character.
        Characters must be ${CHARACTER_WIDTH} characters wide, not ${row.length} (row ${index}).
      `);
    }
  });
  return character;
};

export const entryToCharacters = (entry: string[]): string[][] => {
  const rows = entry.map((row: string): string[] => <string[]>row.match(new RegExp(`.{1,${CHARACTER_WIDTH}}`, 'g')));

  return <string[][]>new Array(ACCOUNT_NUMBER_LENGTH).fill([]).map((_) => rows.map((row) => row.shift()));
};

export const characterToDigit = (character: string[]): Digit => {
  return <Digit>CHARACTERS.findIndex((c: string[]) => c.join(',') === character.join(','));
};

export const entryToAccount = (entry: string[]): string => {
  return entryToCharacters(validateEntry(entry))
    .map((character) => characterToDigit(validateCharacter(character)))
    .join('');
};

export const parseAccountNumbers = async (filepath: string): Promise<string[]> => {
  const entries: string[][] = [];
  const rl = createInterface({
    input: createReadStream(filepath),
    output: process.stdout,
  });

  let entry: string[] = [];
  let lines = 1;

  return new Promise((resolve, reject) => {
    rl.on('line', (line: string) => {
      if (entry.length === CHARACTER_HEIGHT) {
        entries.push(entry);
        entry = [];
      }

      if (lines % (CHARACTER_HEIGHT + 1) !== 0) {
        entry.push(line);
      }

      lines++;
    });

    rl.on('close', () => {
      if (entry.length === CHARACTER_HEIGHT) {
        entries.push(entry);
      }

      try {
        resolve(entries.map((entry: string[]): string => entryToAccount(entry)));
      } catch (e) {
        reject(e);
      }
    });
  });
};
