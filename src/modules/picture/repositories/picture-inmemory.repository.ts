import { Picture, type PictureAttrs } from '../entities/picture.entity';
import { PictureRepository } from '../interfaces';

export class PictureInMemoryRepository extends PictureRepository {
  private pictures: PictureAttrs[] = [];

  createMany(pictures: PictureAttrs[]) {
    this.pictures.push(...pictures);
  }

  findMany({ addresses }: { addresses: String[] }) {
    const pictures = this.pictures.filter((p) => {
      if (addresses.includes(p.address)) {
        return true;
      }
      return false;
    });

    return this.mapToEntities(pictures);
  }

  private mapToEntities(pictures: PictureAttrs[]): Picture[] {
    return pictures.map((picture) => Picture.fromAttrs(picture));
  }
}
