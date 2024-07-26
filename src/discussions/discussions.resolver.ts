import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Discussion, CreateDiscussionInput } from '../graphql.schema';
import { DiscussionsService } from './discussions.service';
import { CreateProfileInput } from './dto/create-profile.input';

const pubSub = new PubSub();

@Resolver('Discussion')
export class DiscussionsResolver {
  constructor(private readonly discussionsService: DiscussionsService) { }

  @Query('discussions')
  async getDiscussions() {
    console.log('discussions is triggered');
    return this.discussionsService.findAll();
  }

  @Query('discussionById')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Discussion> {
    return this.discussionsService.findOneById(id);
  }

  @Mutation('createDiscussion')
  async createDiscussion(
    @Args('discussion') args: CreateDiscussionInput,
  ): Promise<Discussion> {
    console.log('createDiscussion', args);
    const createdDiscussion =
      await this.discussionsService.createDiscussion(args);
    pubSub.publish('discussionCreated', {
      discussionCreated: createdDiscussion,
    });
    console.log('returning discussion after update', createdDiscussion);
    return createdDiscussion;
  }

  @Subscription('discussionCreated')
  discussionCreated() {
    return pubSub.asyncIterator('discussionCreated');
  }

  // for multipart file upload
  // https://medium.com/@raj.shrestha777/step-by-step-guide-to-uploading-multiples-files-with-graphql-in-nestjs-ecc4dfe42424


  @Mutation('createDiscussionWithUpload')
  async createDiscussionWithUpload(
    @Args('discussionInput') args: CreateProfileInput,
  ): Promise<Discussion> {
    console.log('createDiscussionWithUpload-Resolver', args);
    // await this.discussionsService.createProfile(args);
    const createdDiscussion =
      await this.discussionsService.createDiscussionWithUpload(args);
    pubSub.publish('discussionCreated', {
      discussionCreated: createdDiscussion,
    });
    return createdDiscussion;
  }



  @Mutation('createProfile')
  async createSomeProfile(@Args('profileInput') args: CreateProfileInput) {
    await this.discussionsService.createProfile(args);
  }
}

// mutation{
//   createDiscussion(discussion: { discussionId: 3, text: "AAA" }) {
//     id
//     main {
//       id
//       text
//     }
//     children {
//       id
//       text
//     }
//   }
// }

// query {
//   discussions {
//     id
//     main {
//       id
//       text
//     }
//     children {
//       id
//       text
//     }
//   }
// }
