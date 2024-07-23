import { InputType, Field } from '@nestjs/graphql';
import { UploadScalar } from './upload.scalar';

@InputType()
export class CreateProfileInput {
  @Field(() => [UploadScalar], { description: 'Input for the profile image files.' })
  images: UploadScalar[];
  text: string;
}
