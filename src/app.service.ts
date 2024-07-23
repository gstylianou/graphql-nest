import { Injectable } from '@nestjs/common';
import { uploadFileStreamForPost } from './common/utils/upload';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  uploadDir = 'uploads';
  async uploadFiles(files: Array<Express.Multer.File>): Promise<string> {
    const imagePathsPromise = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.originalname}`;
      const uploadDir = join(this.uploadDir, 'images');
      const filePath = await uploadFileStreamForPost(
        file.buffer,
        uploadDir,
        fileName,
      );

      return filePath;
    });

    const imagePaths = await Promise.all(imagePathsPromise);

    console.log('imagePaths', imagePaths);
    return 'file upload finished';
  }
}
