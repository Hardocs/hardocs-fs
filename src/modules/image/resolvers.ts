import { ResolverMap } from '../../typings/globals';
import image from '.';

export const resolver: ResolverMap = {
  Query: {
    getImages: (_root, { path }: HDS.IGetImagesOnQueryArguments) =>
      image.getImages(path)
  }
};
