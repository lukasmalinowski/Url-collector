import type { Module } from '../types/Module';
import { PictureModule } from './picture/picture.module';

export const defaultModules: Module<any>[] = [new PictureModule()];
