import { Scalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';

@Scalar('Upload')
export class UploadScalar {
  description = 'Upload files';

  parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
