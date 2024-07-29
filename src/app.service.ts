import { Injectable } from '@nestjs/common';
import { uploadFileStreamForPost } from './common/utils/upload';
import { join } from 'path';
import { UploadFileResponse } from './discussions/payloads/uploadFileResponse';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }



  uploadDir = 'uploads';
  async uploadFiles(
    files: Array<Express.Multer.File>,
  ): Promise<UploadFileResponse> {
    console.log('input files', files);
    const imagePathsPromise = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.originalname.replace(/\s+/g, '')}`;
      const uploadDir = join(this.uploadDir, 'tmp');
      await uploadFileStreamForPost(file.buffer, uploadDir, fileName);

      return fileName;
    });

    const fileNames = await Promise.all(imagePathsPromise);

    console.log('fileNames', fileNames);
    return new UploadFileResponse(fileNames, 'Success from George');
  }
}
