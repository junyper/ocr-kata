import { resolve } from 'path';
import { digitToCharacter, characterToDigit, entryToAccount, entryToCharacters, parseAccountNumbers } from './lib';

describe('parseAccountNumbers', (): void => {
  test('parses account numbers from a file', async (): Promise<void> => {
    const numbers = await parseAccountNumbers(resolve(__dirname, './__fixtures__/use_case_one.txt'));
    expect(numbers).toStrictEqual([
      '000000000',
      '111111111',
      '222222222',
      '333333333',
      '444444444',
      '555555555',
      '666666666',
      '777777777',
      '888888888',
      '999999999',
      '123456789',
    ]);
  });
});

describe('entryToCharacters', (): void => {
  test('parses zeros', (): void => {
    expect(
      entryToCharacters([
        /* eslint-disable */
        ' _  _  _  _  _  _  _  _  _ ',
        '| || || || || || || || || |',
        '|_||_||_||_||_||_||_||_||_|'
          /* eslint-enable */
      ]),
    ).toStrictEqual(new Array(9).fill(digitToCharacter(0)));
  });
  test('throws an error for invalid entry width', (): void => {
    expect(() => {
      entryToCharacters([
        /* eslint-disable */
        ' _  _  _ ',
        '| || || |',
        '|_||_||_|'
          /* eslint-enable */
      ]);
    }).toThrow();
  });
  test('throws an error for invalid entry height', (): void => {
    expect(() => {
      entryToCharacters([
        /* eslint-disable */
        '| || || || || || || || || |',
        '|_||_||_||_||_||_||_||_||_|'
          /* eslint-enable */
      ]);
    }).toThrow();
  });
});

describe('characterToDigit', (): void => {
  test('throws an error for a character with the wrong height', (): void => {
    expect(() => {
      characterToDigit(['---', '---']);
    }).toThrow();
  });
  test('throws an error for a character with the wrong width', (): void => {
    expect(() => {
      characterToDigit(['--', '--', '--']);
    }).toThrow();
  });
});

describe('entryToAccount', (): void => {
  test('parses a sequence', (): void => {
    expect(
      entryToAccount([
        /* eslint-disable */
        '    _  _     _  _  _  _  _ ',
        '  | _| _||_||_ |_   ||_||_|',
        '  ||_  _|  | _||_|  ||_| _|',
        /* eslint-enable */
      ]),
    ).toBe('123456789');
  });
  test('throws an error for invalid entry width', (): void => {
    expect(() => {
      entryToAccount([
        /* eslint-disable */
        ' _  _  _ ',
        '| || || |',
        '|_||_||_|'
          /* eslint-enable */
      ]);
    }).toThrow();
  });
  test('throws an error for invalid entry height', (): void => {
    expect(() => {
      entryToAccount([
        /* eslint-disable */
        '| || || || || || || || || |',
        '|_||_||_||_||_||_||_||_||_|'
          /* eslint-enable */
      ]);
    }).toThrow();
  });
});
