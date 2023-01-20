export enum PictureProvider {
  NASA = 'NASA',
}

export interface PictureAttrs {
  provider: PictureProvider;
  address: string;
  imageUrl: string;
}

export class Picture {
  private attrs: PictureAttrs;

  public get address() {
    return this.attrs.address;
  }

  public get imageUrl() {
    return this.attrs.imageUrl;
  }

  public toAttrs(): PictureAttrs {
    return this.attrs;
  }

  public static fromAttrs(attrs: PictureAttrs) {
    return new Picture(attrs);
  }

  private constructor(attrs: PictureAttrs) {
    this.attrs = {
      provider: attrs.provider,
      address: attrs.address,
      imageUrl: attrs.imageUrl,
    };
  }
}
