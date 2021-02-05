import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';

import { Digit } from './types';
import { VALID_CHARACTERS, ACCOUNT_NUMBER_LENGTH, CHARACTER_WIDTH, CHARACTER_HEIGHT } from './constants';

export const validateEntry = (entry: string[]): string[] => {
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
  if (character.length !== CHARACTER_HEIGHT) {
    throw new Error(`Invalid character. Characters must be ${CHARACTER_HEIGHT} lines, not ${character.length}.`);
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
  const rows = validateEntry(entry).map(
    (row: string): string[] => <string[]>row.match(new RegExp(`.{1,${CHARACTER_WIDTH}}`, 'g')),
  );

  return <string[][]>new Array(ACCOUNT_NUMBER_LENGTH).fill([]).map((_) => rows.map((row) => row.shift()));
};

export const digitToCharacter = (digit: number): string[] => {
  return [...(VALID_CHARACTERS[digit] || [])];
};

export const characterToDigit = (character: string[]): Digit => {
  return <Digit>VALID_CHARACTERS.findIndex((c: string[]) => c.join(',') === validateCharacter(character).join(','));
};

export const entryToAccount = (entry: string[]): string => {
  return entryToCharacters(entry)
    .map((character) => characterToDigit(character))
    .join('');
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const parseAccountNumbers = async (filePath: string, onProgress = (_: string) => {}): Promise<string[]> => {
  const accountNumbers: string[] = [];

  const readStream = createInterface({ input: createReadStream(filePath) });
  const writeStream = createWriteStream(`${filePath}.out`);

  let entry: string[] = [];
  let lines = 1;

  const writeAccountNumber = (entry: string[]): void => {
    const accountNumber = entryToAccount(entry);
    onProgress(accountNumber);
    accountNumbers.push(accountNumber);
    writeStream.write(accountNumber + '\n');
  };

  return new Promise((resolve, reject) => {
    writeStream.on('open', () => {
      readStream.on('line', (line: string) => {
        if (entry.length === CHARACTER_HEIGHT) {
          try {
            writeAccountNumber(entry);
          } catch (e) {
            reject(e);
          }
          entry = [];
        }

        if (lines % (CHARACTER_HEIGHT + 1) !== 0) {
          entry.push(line);
        }

        lines++;
      });

      readStream.on('close', () => {
        if (entry.length === CHARACTER_HEIGHT) {
          try {
            writeAccountNumber(entry);
          } catch (e) {
            reject(e);
          }
        }
        writeStream.end();
        resolve(accountNumbers);
      });

      readStream.on('error', (e) => {
        readStream.close();
        reject(e);
      });
    });

    writeStream.on('error', (e) => {
      writeStream.end();
      writeStream.close();
      reject(e);
    });
  });
};
