import { createReadStream, createWriteStream } from 'fs';
import { join, basename } from 'path';
import { createInterface } from 'readline';
import { Digit, STATUS_TYPES, AccountNumberStatus } from './types';
import { VALID_CHARACTERS, ACCOUNT_NUMBER_LENGTH, CHARACTER_WIDTH, CHARACTER_HEIGHT } from './constants';

export const getAccountStatus = (accountNumber: string): AccountNumberStatus => {
  const chars = Array.from(accountNumber);
  let checkSum = 0;

  for (let i = 1; i <= chars.length; i++) {
    const char = `${chars[chars.length - i]}`;

    if (char === '?') {
      return STATUS_TYPES.ILLEGAL;
    }

    checkSum = checkSum + parseInt(char) * i;
  }

  checkSum = checkSum % 11;

  return checkSum === 0 ? STATUS_TYPES.VALID : STATUS_TYPES.ERROR;
};

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
  const index = VALID_CHARACTERS.findIndex((c: string[]) => c.join(',') === validateCharacter(character).join(','));
  return index >= 0 ? <Digit>index : '?';
};

export const entryToAccount = (entry: string[]): string => {
  return entryToCharacters(entry)
    .map((character) => characterToDigit(character))
    .join('');
};

export const streamAccountEntries = (
  sourceFilePath: string,
  destinationDir: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  parseEntry = (_entry: string[]): string => {
    return '';
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStreamComplete = () => {},
): void => {
  const readStream = createInterface({ input: createReadStream(sourceFilePath) });
  const writeStream = createWriteStream(join(destinationDir, `${basename(sourceFilePath, '.data')}.out`));

  let entry: string[] = [];
  let lines = 1;

  writeStream.on('open', () => {
    readStream.on('line', (line: string) => {
      if (entry.length === CHARACTER_HEIGHT) {
        writeStream.write(parseEntry(entry) + '\n');
        entry = [];
      }

      if (lines % (CHARACTER_HEIGHT + 1) !== 0) {
        entry.push(line);
      }

      lines++;
    });

    readStream.on('close', () => {
      if (entry.length === CHARACTER_HEIGHT) {
        writeStream.write(parseEntry(entry) + '\n');
      }
      onStreamComplete();
      writeStream.end();
    });

    readStream.on('error', (e) => {
      readStream.close();
      throw e;
    });
  });

  writeStream.on('error', (e) => {
    writeStream.end();
    writeStream.close();
    throw e;
  });
};

export const parseAccountNumbers = (
  sourceFilePath: string,
  destinationDir: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAccountNumberParsed = (_accountNumber: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete = (_accountNumbers: string[]) => {},
): void => {
  const accountNumbers: string[] = [];

  /*
   Note: an entry is an array like:
   [
    ' _  _  _  _  _  _  _  _  _ ',
    '| || || || || || || || || |',
    '|_||_||_||_||_||_||_||_||_|'
    ]
  */
  const parseEntry = (entry: string[]) => {
    const accountNumber = entryToAccount(entry); // e.g. '000000000'
    const status: AccountNumberStatus = getAccountStatus(accountNumber); // e.g. 'ERR'
    const result = [accountNumber, status].join(' ').trim(); // e.g. '000000000 ERR'

    onAccountNumberParsed(result);
    accountNumbers.push(result);

    return result;
  };

  const handleStreamComplete = () => {
    onComplete(accountNumbers);
  };

  streamAccountEntries(sourceFilePath, destinationDir, parseEntry, handleStreamComplete);
};
