import { join } from 'path';
import {
  getAccountStatus,
  digitToCharacter,
  characterToDigit,
  entryToAccount,
  entryToCharacters,
  parseAccountNumbers,
} from './lib';

describe('parseAccountNumbers', () => {
  test('parses account numbers from a file', async (): Promise<void> => {
    const numbers = await parseAccountNumbers(
      join(__dirname, './__fixtures__/use_case_one.data'),
      join(__dirname, './__fixtures__'),
    );
    expect(numbers).toStrictEqual([
      ['000000000', 'VALID'],
      ['111111111', 'ERR'],
      ['222222222', 'ERR'],
      ['333333333', 'ERR'],
      ['444444444', 'ERR'],
      ['555555555', 'ERR'],
      ['666666666', 'ERR'],
      ['777777777', 'ERR'],
      ['888888888', 'ERR'],
      ['999999999', 'ERR'],
      ['123456789', 'VALID'],
    ]);
  });
  test('parses illegal account numbers from a file', async (): Promise<void> => {
    const numbers = await parseAccountNumbers(
      join(__dirname, './__fixtures__/use_case_three.data'),
      join(__dirname, './__fixtures__'),
    );
    expect(numbers).toStrictEqual([
      ['000000051', 'VALID'],
      ['49006771?', 'ILL'],
      ['1234?678?', 'ILL'],
    ]);
  });
});

describe('getAccountStatus', () => {
  test('returns VALID if valid', () => {
    expect(getAccountStatus('457508000')).toBe('VALID');
  });
  test('returns ERR if not valid', () => {
    expect(getAccountStatus('664371495')).toBe('ERR');
  });
  test('returns ILL if some chars are not valid', () => {
    expect(getAccountStatus('86110??36')).toBe('ILL');
  });
});

describe('entryToCharacters', () => {
  test('parses zeros', () => {
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
  test('throws an error for invalid entry width', () => {
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
  test('throws an error for invalid entry height', () => {
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

describe('characterToDigit', () => {
  test('throws an error for a character with the wrong height', () => {
    expect(() => {
      characterToDigit(['---', '---']);
    }).toThrow();
  });
  test('throws an error for a character with the wrong width', () => {
    expect(() => {
      characterToDigit(['--', '--', '--']);
    }).toThrow();
  });
});

describe('entryToAccount', () => {
  test('parses a sequence', () => {
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
  test('throws an error for invalid entry width', () => {
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
  test('throws an error for invalid entry height', () => {
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
