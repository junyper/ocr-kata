import { characterToDigit, entryToAccount, entryToCharacters, parseAccountNumbers } from './lib';
import { resolve } from 'path';

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
      entryToCharacters([' _  _  _  _  _  _  _  _  _ ', '| || || || || || || || || |', '|_||_||_||_||_||_||_||_||_|']),
    ).toStrictEqual([
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
      [' _ ', '| |', '|_|'],
    ]);
  });
});

describe('characterToDigit', (): void => {
  test('parses zero', (): void => {
    expect(characterToDigit([' _ ', '| |', '|_|'])).toBe(0);
  });
  test('parses one', (): void => {
    expect(characterToDigit(['   ', '  |', '  |'])).toBe(1);
  });
  test('parses two', (): void => {
    expect(characterToDigit([' _ ', ' _|', '|_ '])).toBe(2);
  });
  test('parses three', (): void => {
    expect(characterToDigit([' _ ', ' _|', ' _|'])).toBe(3);
  });
  test('parses four', (): void => {
    expect(characterToDigit(['   ', '|_|', '  |'])).toBe(4);
  });
  test('parses five', (): void => {
    expect(characterToDigit([' _ ', '|_ ', ' _|'])).toBe(5);
  });
  test('parses six', (): void => {
    expect(characterToDigit([' _ ', '|_ ', '|_|'])).toBe(6);
  });
  test('parses seven', (): void => {
    expect(characterToDigit([' _ ', '  |', '  |'])).toBe(7);
  });
  test('parses eight', (): void => {
    expect(characterToDigit([' _ ', '|_|', '|_|'])).toBe(8);
  });
  test('parses nine', (): void => {
    expect(characterToDigit([' _ ', '|_|', ' _|'])).toBe(9);
  });
});

describe('entryToAccount', (): void => {
  test('parses zeros', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '| || || || || || || || || |', '|_||_||_||_||_||_||_||_||_|']),
    ).toBe('000000000');
  });
  test('parses ones', (): void => {
    expect(
      entryToAccount(['                           ', '  |  |  |  |  |  |  |  |  |', '  |  |  |  |  |  |  |  |  |']),
    ).toBe('111111111');
  });
  test('parses twos', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', ' _| _| _| _| _| _| _| _| _|', '|_ |_ |_ |_ |_ |_ |_ |_ |_ ']),
    ).toBe('222222222');
  });
  test('parses threes', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', ' _| _| _| _| _| _| _| _| _|', ' _| _| _| _| _| _| _| _| _|']),
    ).toBe('333333333');
  });
  test('parses fours', (): void => {
    expect(
      entryToAccount(['                           ', '|_||_||_||_||_||_||_||_||_|', '  |  |  |  |  |  |  |  |  |']),
    ).toBe('444444444');
  });
  test('parses fives', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '|_ |_ |_ |_ |_ |_ |_ |_ |_ ', ' _| _| _| _| _| _| _| _| _|']),
    ).toBe('555555555');
  });
  test('parses sixes', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '|_ |_ |_ |_ |_ |_ |_ |_ |_ ', '|_||_||_||_||_||_||_||_||_|']),
    ).toBe('666666666');
  });
  test('parses sevens', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '  |  |  |  |  |  |  |  |  |', '  |  |  |  |  |  |  |  |  |']),
    ).toBe('777777777');
  });
  test('parses eights', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '|_||_||_||_||_||_||_||_||_|', '|_||_||_||_||_||_||_||_||_|']),
    ).toBe('888888888');
  });
  test('parses nines', (): void => {
    expect(
      entryToAccount([' _  _  _  _  _  _  _  _  _ ', '|_||_||_||_||_||_||_||_||_|', ' _| _| _| _| _| _| _| _| _|']),
    ).toBe('999999999');
  });
  test('parses a sequence', (): void => {
    expect(
      entryToAccount(['    _  _     _  _  _  _  _ ', '  | _| _||_||_ |_   ||_||_|', '  ||_  _|  | _||_|  ||_| _|']),
    ).toBe('123456789');
  });
});
