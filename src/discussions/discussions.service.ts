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
import * as _ from 'lodash';

@Injectable()
export class DiscussionsService {
  private readonly discussions: Array<Discussion> = [
    {
      id: 1,
      main: {
        id: 2,
        text: '',
        stars: 0,
        empty: true,
        replyNumber: 0,
        approved: true,
        owner: 'george',
        images: [],
        videos: [],
      },
      children: [],
    },
  ];
  private readonly blockInstance: Block = {
    id: 2,
    text: '',
    stars: 0,
    empty: false,
    replyNumber: 0,
    approved: true,
    owner: 'george',
    images: [],
    videos: [],
  };
  // {
  //   id: 1,
  //   main: { id: 1, text: 'Request #1', owner: 'George', images: ['abcd'], videos: ['xyz'] },
  //   children: [
  //     { id: 2, text: 'Answer #1', owner: 'Rick', images: ['abcd'], videos: ['xyz'] },
  //     { id: 3, text: 'Answer #2', owner: 'Andrew' },
  //   ],
  // },
  // {
  //   id: 2,
  //   main: { id: 1, text: 'Request #2', owner: 'Kos' },
  //   children: [{ id: 2, text: 'Answer #1', owner: 'Ricky' }],
  // },
  //   {
  //     id: 1,
  //     main: {
  //       id: 1,
  //       text: 'Hey Do you know how can I replace the radio for my Toyota Verso 2017?',
  //       stars: 4,
  //       empty: false,
  //       replyNumber: 3,
  //       approved: true,
  //       owner: 'ownerId',
  //       videos: ['https://www.youtube.com/watch?v=LXb3EKWsInQ', 'https://www.youtube.com/watch?v=LXb3EKWsInQ', 'https://vimeo.com/838818874'],
  //     },
  //     children: [
  //       {
  //         id: 12,
  //         text: 'Answer 1',
  //         // icon: DeleteIcon,
  //         videos: ['https://www.youtube.com/watch?v=LXb3EKWsInQ'],
  //         images: [],
  //         stars: 4,
  //         approved: true,
  //         owner: 'ownerId #1',
  //       },
  //       {
  //         id: 13,
  //         text: 'Answer 2',
  //         // icon: DeleteIcon,
  //         stars: 3,
  //         videos: ['https://www.youtube.com/watch?v=LXb3EKWsInQ', 'https://www.youtube.com/watch?v=LXb3EKWsInQ', 'https://vimeo.com/838818874'],
  //         images: ['https://assets.codepen.io/6093409/river.jpg', 'https://assets.codepen.io/6093409/river.jpg'],
  //         approved: true,
  //         owner: 'ownerId #2',
  //       },
  //       {
  //         id: 14,
  //         text: 'Answer 3',
  //         // icon: DeleteIcon,
  //         videos: ['https://assets.codepen.io/6093409/river.mp4'],
  //         images: ['https://assets.codepen.io/6093409/river.jpg'],
  //         stars: 1,
  //         approved: false,
  //         owner: 'ownerId #3',
  //       },
  //     ],
  //   },
  // ];

  createDiscussion(discussion: CreateDiscussionInput): Discussion {

    console.log('CreateDiscussionInput', CreateDiscussionInput);

    const discussionFound = this.discussions.find(
      (x) => x.id == discussion.discussionId,
    );
    console.log('discussionFound', discussionFound);

    if (discussionFound != null) {
      if (discussionFound.main.empty == true) {
        discussionFound.main.text = discussion.text;
        discussionFound.main.empty = false;
        discussionFound.main.stars = 0;
        return discussionFound;
      } else {
        console.log('blockInstance', this.blockInstance);
        const newEntry = _.cloneDeep(this.blockInstance);
        newEntry.id = discussionFound.children.length + 1;
        newEntry.text = discussion.text;
        newEntry.stars = 0;
        discussionFound.children.push(newEntry);
        console.log('returning discussionFound', discussionFound);
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
    console.log('returning discussions', this.discussions);
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
