import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsResolver } from './discussions.resolver';
import { UploadScalar } from './dto/upload.scalar';

@Module({
  providers: [DiscussionsService, DiscussionsResolver, UploadScalar],
})
export class DiscussionsModule { }
