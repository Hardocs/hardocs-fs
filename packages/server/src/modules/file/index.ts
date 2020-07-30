import * as matter from 'gray-matter';

const extractData = ({ filePath }: HDS.IOpenFileOnQueryArguments) => {
  const { data, content } = matter(filePath);
  return { data, content };
};

export default {
  extractData
};
