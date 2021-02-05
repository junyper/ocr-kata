#!/usr/bin/env node

import { resolve } from 'path';
import glob from 'glob';

import { parseAccountNumbers } from './lib';

const args = process.argv.slice(2);
const dir = args[0] || '*.data';

glob(resolve(dir, '*.data'), (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  if (files.length === 0) {
    console.log(`No account number .data files found.`);
  }
  files.forEach((file: string) => {
    console.log(`Parsing ${file}...`);
    parseAccountNumbers(file, (number) => console.log(number))
      .then((accountNumbers) => {
        console.log(`Parsed ${accountNumbers.length} account numbers.`);
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  });
});
