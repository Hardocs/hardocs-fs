import * as chalk from 'chalk';

const Log = console;
const Warn = (val: any) => Log.warn(chalk.yellow(val));
const Err = (val: any) => Log.error(chalk.red(val));
const Success = (val: any) => Log.info(chalk.green(val));
const Good = (val: any) => Log.log(chalk.blue(val));

export default {
  Warn,
  Err,
  Success,
  Good,
  chalk
};
