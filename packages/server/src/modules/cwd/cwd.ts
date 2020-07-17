const cwd: string = process.cwd();

const normalize = (value: string) => {
  console.log(value);
};

export default {
  get: () => cwd,
  set: (value: string) => {
    const newValue = normalize(value);
    return newValue;
  }
};
