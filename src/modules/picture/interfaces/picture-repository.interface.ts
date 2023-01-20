import type { Picture, PictureAttrs } from '../entities/picture.entity';

export abstract class PictureRepository {
  abstract createMany(pictures: PictureAttrs[]): void;
  abstract findMany({ addresses }: { addresses: String[] }): Picture[];
}
