import * as chalk from 'chalk';

const Log = console.log;
const Warn = (val: any) => Log(chalk.yellow(val));
const Err = (val: any) => Log(chalk.red(val));
const Success = (val: any) => Log(chalk.green(val));
const Good = (val: any) => Log(chalk.blue(val));

export default {
  Log,
  Warn,
  Err,
  Success,
  Good,
  chalk
};
