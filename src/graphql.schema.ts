
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCatInput {
    name?: Nullable<string>;
    age?: Nullable<number>;
}

export class CreateDiscussionInput {
    discussionId?: Nullable<number>;
    text?: Nullable<string>;
    stars?: Nullable<number>;
    approved?: Nullable<boolean>;
    owner?: Nullable<string>;
    videos?: Nullable<Nullable<string>[]>;
    images?: Nullable<Nullable<string>[]>;
}

export class CreateProfileInput {
    text?: Nullable<string>;
    images?: Nullable<Nullable<Upload>[]>;
}

export class CreateDiscussionWithUploadInput {
    discussionId?: Nullable<number>;
    text?: Nullable<string>;
    stars?: Nullable<number>;
    approved?: Nullable<boolean>;
    owner?: Nullable<string>;
    videos?: Nullable<Nullable<string>[]>;
    images?: Nullable<Nullable<Upload>[]>;
}

export abstract class IQuery {
    abstract cats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract cat(id: string): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract discussions(): Nullable<Discussion>[] | Promise<Nullable<Discussion>[]>;

    abstract discussionByEditor(editor: string): Discussion[] | Promise<Discussion[]>;

    abstract discussionById(id: string): Discussion | Promise<Discussion>;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: Nullable<CreateCatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract createDiscussion(discussion?: Nullable<CreateDiscussionInput>): Nullable<Discussion> | Promise<Nullable<Discussion>>;

    abstract createDiscussionWithUpload(discussionInput?: Nullable<CreateDiscussionWithUploadInput>): Nullable<Discussion> | Promise<Nullable<Discussion>>;

    abstract createProfile(profileInput?: Nullable<CreateProfileInput>): Nullable<string> | Promise<Nullable<string>>;
}

export abstract class ISubscription {
    abstract catCreated(): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract discussionCreated(): Nullable<Discussion> | Promise<Nullable<Discussion>>;
}

export class Owner {
    id: number;
    name: string;
    age?: Nullable<number>;
    cats?: Nullable<Cat[]>;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    owner?: Nullable<Owner>;
}

export class Discussion {
    id?: Nullable<number>;
    main?: Nullable<Block>;
    children?: Nullable<Nullable<Block>[]>;
}

export class Block {
    id?: Nullable<number>;
    text: string;
    stars?: Nullable<number>;
    approved?: Nullable<boolean>;
    replyNumber?: Nullable<number>;
    owner: string;
    videos?: Nullable<Nullable<string>[]>;
    images?: Nullable<Nullable<string>[]>;
    empty?: Nullable<boolean>;
}

export type Upload = any;
type Nullable<T> = T | null;
