import colors from 'colors';

const verbose = 0;

export function log(...args) {
  if(verbose >= 0) {
    console.log(colors.gray('      ', ...args));
  }
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}