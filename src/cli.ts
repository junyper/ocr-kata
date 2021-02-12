#!/usr/bin/env node

import { join, sep, basename } from 'path';
import glob from 'glob';

import { parseAccountNumbers } from './lib';

const args = process.argv.slice(2);
const sourceDir = args[0] || '.';
const destinationDir = args[1] || sourceDir;

glob(join(sourceDir, sep, '*.data'), (err, files) => {
  if (err) {
    console.error(`🔴 ${err}`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.log(`🔴 No account number *.data files found.`);
  }
  files.forEach((sourceFilePath: string) => {
    console.log(`⏳ Parsing ${sourceFilePath}...`);

    const handleAccountNumberParsed = (number: string) => {
      console.log(number);
    };

    const handleComplete = (accountNumbers: string[]) => {
      console.log(`✅ Parsed ${accountNumbers.length} account numbers from ${basename(sourceFilePath)}.`);
      console.log(`Generated output file in ${destinationDir}.`);
    };

    try {
      parseAccountNumbers(sourceFilePath, destinationDir, handleAccountNumberParsed, handleComplete);
    } catch (e) {
      console.error(`🔴 ${e}`);
      process.exit(1);
    }
  });
});
