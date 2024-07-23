import { Injectable } from '@nestjs/common';
import {
  Block,
  CreateDiscussionInput,
  CreateDiscussionWithUploadInput,
  Discussion,
} from '../graphql.schema';
import { CreateProfileInput } from './dto/create-profile.input';
import { join } from 'path';
import { uploadFileStream } from 'src/common/utils/upload';

@Injectable()
export class DiscussionsService {
  private readonly discussions: Array<Discussion> = [
    {
      id: 1,
      main: { id: 1, text: 'Request #1', owner: 'George' },
      children: [
        { id: 2, text: 'Answer #1', owner: 'Rick' },
        { id: 3, text: 'Answer #2', owner: 'Andrew' },
      ],
    },
    {
      id: 2,
      main: { id: 1, text: 'Request #2', owner: 'Kos' },
      children: [{ id: 2, text: 'Answer #1', owner: 'Ricky' }],
    },
  ];

  createDiscussion(discussion: CreateDiscussionInput): Discussion {
    const discussionFound = this.discussions.find(
      (x) => x.id == discussion.discussionId,
    );
    if (discussionFound != null) {
      if (discussionFound.main.empty == false) {
        discussionFound.main.text = discussion.text;
        return discussionFound;
      } else {
        const newEntry = new Block();
        newEntry.id = discussionFound.children.length + 1;
        newEntry.text = discussion.text;
        discussionFound.children.push(newEntry);
        return discussionFound;
      }
    } else {
      const newEntry = new Discussion();
      newEntry.children = [];
      newEntry.id = this.discussions.length + 1;
      newEntry.main = new Block();
      newEntry.main.text = discussion.text;
      this.discussions.push(newEntry);
      return newEntry;
    }
  }

  findAll(): Discussion[] {
    return this.discussions;
  }

  findOneById(id: number): Discussion {
    return this.discussions.find((discussion) => discussion.id === id);
  }

  uploadDir = 'uploads';
  async createProfile(createProfileInput: CreateProfileInput) {
    console.log(createProfileInput);
    // return 'This action adds a new profile';

    // let profileInputData = {
    //   ...createProfileInput,
    //   images: null,
    // };
    // const profileData: Profile = await this.profileRepo.save({
    //   ...profileInputData,
    // });
    const imagePaths = createProfileInput.images.map(async (image, index) => {
      const imageFile: any = await image;
      const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
      console.log('filename', fileName);
      const uploadDir = join(this.uploadDir, 'images');
      const filePath = await uploadFileStream(
        imageFile.createReadStream,
        uploadDir,
        fileName,
      );

      return filePath;
    });
    // const profileImages: Promise<ProfileImage>[] = imagePaths.map(
    //   async (imagePath) => {
    //     return await this.profileImageRepo.save({
    //       imageURL: await imagePath,
    //       profile: profileData,
    //     });
    //   },
    // );
    // profileInputData = {
    //   ...profileInputData,
    //   images: await Promise.all(profileImages),
    // };
    // profileData.images = profileInputData.images;
    // return profileData;
  }

  async createDiscussionWithUpload(
    discussion: CreateDiscussionWithUploadInput,
  ): Promise<Discussion> {
    console.log('createDiscussionWithUpload', discussion);

    const imagePathsPromise = discussion.images.map(async (image, index) => {
      const imageFile: any = await image;
      const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
      const uploadDir = join(this.uploadDir, 'images');
      const filePath = await uploadFileStream(
        imageFile.createReadStream,
        uploadDir,
        fileName,
      );
      return filePath;
    });

    const imagePaths = await Promise.all(imagePathsPromise);

    console.log('imagePaths', imagePaths);
    const discussionFound = this.discussions.find(
      (x) => x.id == discussion.discussionId,
    );
    if (discussionFound != null) {
      if (discussionFound.main.empty == false) {
        discussionFound.main.text = discussion.text;

        discussionFound.main.images = imagePaths;
        console.log('discussionFound', discussionFound);
        return discussionFound;
      } else {
        console.log('new entry block');
        const newEntry = new Block();
        newEntry.id = discussionFound.children.length + 1;
        newEntry.text = discussion.text;
        discussionFound.children.push(newEntry);
        return discussionFound;
      }
    } else {
      console.log('new entry discussion');
      const newEntry = new Discussion();
      newEntry.children = [];
      newEntry.id = this.discussions.length + 1;
      newEntry.main = new Block();
      newEntry.main.text = discussion.text;
      newEntry.main.images = imagePaths;
      this.discussions.push(newEntry);
      return newEntry;
    }
  }
}
