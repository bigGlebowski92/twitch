/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: File; output: File; }
};

export type AuthModel = {
  __typename: 'AuthModel';
  message: Maybe<Scalars['String']['output']>;
  user: Maybe<UserModel>;
};

export type CategoryModel = {
  __typename: 'CategoryModel';
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  streams: Maybe<Array<StreamModel>>;
  thumbnailUrl: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeChatSettingsInput = {
  isChatEnabled: Scalars['Boolean']['input'];
  isChatFollowersOnly: Scalars['Boolean']['input'];
  isChatPremiumFollowersOnly: Scalars['Boolean']['input'];
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
};

export type ChangeNotificationsSettingsInput = {
  siteNotifications: Scalars['Boolean']['input'];
  telegramNotifications: Scalars['Boolean']['input'];
};

export type ChangeNotificationsSettingsOutput = {
  __typename: 'ChangeNotificationsSettingsOutput';
  notificationSettings: NotificationSettingsModel;
  telegramAuthToken: Maybe<Scalars['String']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangeStreamInfoInput = {
  categoryId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type ChatMessageModel = {
  __typename: 'ChatMessageModel';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  stream: Maybe<StreamModel>;
  streamId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: Maybe<UserModel>;
  userId: Scalars['String']['output'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeactivateAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type DeactivateInput = {
  token: Scalars['String']['input'];
};

export type DeviceModel = {
  __typename: 'DeviceModel';
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type EnableTotpInput = {
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type FiltersInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type FollowModel = {
  __typename: 'FollowModel';
  createdAt: Scalars['DateTime']['output'];
  follower: UserModel;
  followerId: Scalars['String']['output'];
  following: UserModel;
  followingId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GenerateStreamTokenInput = {
  channelId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type GenerateStreamTokenModel = {
  __typename: 'GenerateStreamTokenModel';
  token: Scalars['String']['output'];
};

export enum IngressInput {
  RtmpInput = 'RTMP_INPUT',
  UrlInput = 'URL_INPUT',
  WhipInput = 'WHIP_INPUT'
}

export type LocationModel = {
  __typename: 'LocationModel';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename: 'Mutation';
  addSocialLink: Scalars['Boolean']['output'];
  changeAvatar: UserModel;
  changeChatSettings: Scalars['Boolean']['output'];
  changeEmail: UserModel;
  changeNotificationsSettings: ChangeNotificationsSettingsOutput;
  changePassword: UserModel;
  changeStreamInfo: Scalars['Boolean']['output'];
  changeThumbnail: StreamModel;
  clearSession: Scalars['Boolean']['output'];
  createIngress: Scalars['Boolean']['output'];
  createUser: UserModel;
  deactivate: AuthModel;
  deactivateAccount: AuthModel;
  disableTotp: Scalars['Boolean']['output'];
  enableTotp: Scalars['Boolean']['output'];
  follow: Scalars['Boolean']['output'];
  generateStreamToken: GenerateStreamTokenModel;
  generateTotp: TotpModel;
  login: AuthModel;
  logout: Scalars['Boolean']['output'];
  removeAvatar: UserModel;
  removeSession: Scalars['Boolean']['output'];
  removeSocialLink: Scalars['Boolean']['output'];
  removeThumbnail: StreamModel;
  reorderSocialLinks: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendMessage: ChatMessageModel;
  setNewPassword: Scalars['Boolean']['output'];
  unfollow: Scalars['Boolean']['output'];
  updateProfile: UserModel;
  updateSocialLink: Scalars['Boolean']['output'];
  verify: UserModel;
};


export type MutationAddSocialLinkArgs = {
  input: SocialLinkInput;
};


export type MutationChangeAvatarArgs = {
  avatar: Scalars['Upload']['input'];
};


export type MutationChangeChatSettingsArgs = {
  input: ChangeChatSettingsInput;
};


export type MutationChangeEmailArgs = {
  input: ChangeEmailInput;
};


export type MutationChangeNotificationsSettingsArgs = {
  data: ChangeNotificationsSettingsInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChangeStreamInfoArgs = {
  input: ChangeStreamInfoInput;
};


export type MutationChangeThumbnailArgs = {
  thumbnail: Scalars['Upload']['input'];
};


export type MutationCreateIngressArgs = {
  ingressType: IngressInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeactivateArgs = {
  input: DeactivateInput;
};


export type MutationDeactivateAccountArgs = {
  input: DeactivateAccountInput;
};


export type MutationEnableTotpArgs = {
  input: EnableTotpInput;
};


export type MutationFollowArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationGenerateStreamTokenArgs = {
  input: GenerateStreamTokenInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSocialLinkArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderSocialLinksArgs = {
  list: Array<SocialLinkOrderInput>;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSetNewPasswordArgs = {
  data: NewPasswordInput;
};


export type MutationUnfollowArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateSocialLinkArgs = {
  id: Scalars['String']['input'];
  input: SocialLinkInput;
};


export type MutationVerifyArgs = {
  input: VerificationInput;
};

export type NewPasswordInput = {
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type NotificationModel = {
  __typename: 'NotificationModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  userId: Maybe<Scalars['String']['output']>;
};

export type NotificationSettingsModel = {
  __typename: 'NotificationSettingsModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  siteNotifications: Scalars['Boolean']['output'];
  telegramNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: Maybe<UserModel>;
  userId: Maybe<Scalars['String']['output']>;
};

export enum NotificationType {
  EnableTwoFactorAuth = 'ENABLE_TWO_FACTOR_AUTH',
  NewFollower = 'NEW_FOLLOWER',
  NewSponsorship = 'NEW_SPONSORSHIP',
  StreamStarted = 'STREAM_STARTED',
  VerifiedChannel = 'VERIFIED_CHANNEL'
}

export type ProfileModel = {
  __typename: 'ProfileModel';
  avatar: Maybe<Scalars['String']['output']>;
  bio: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  socialLinks: Array<SocialLinkModel>;
  username: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  findAllCategories: Array<CategoryModel>;
  findAllStreams: Array<StreamModel>;
  findByUser: Array<SessionModel>;
  findCategoryBySlug: CategoryModel;
  findChannelByUsername: UserModel;
  findChatMessages: Array<ChatMessageModel>;
  findCurrentSession: SessionModel;
  findFollowersByChannelId: Array<UserModel>;
  findMyFollowers: Array<FollowModel>;
  findMyFollowings: Array<FollowModel>;
  findNotificationsByUser: Array<NotificationModel>;
  findRandomCategories: Array<CategoryModel>;
  findRandomStreams: Array<StreamModel>;
  findRecommendedChannels: Array<UserModel>;
  findSocialLinks: Array<SocialLinkModel>;
  findUnreadNotificationsCount: Scalars['Float']['output'];
  me: UserModel;
  profile: ProfileModel;
};


export type QueryFindAllStreamsArgs = {
  filters?: InputMaybe<FiltersInput>;
};


export type QueryFindCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryFindChannelByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryFindChatMessagesArgs = {
  streamId: Scalars['String']['input'];
};


export type QueryFindFollowersByChannelIdArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryProfileArgs = {
  username: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
};

export type SendMessageInput = {
  streamId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type SessionMetadataModel = {
  __typename: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SessionModel = {
  __typename: 'SessionModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  metadata: SessionMetadataModel;
  userId: Scalars['String']['output'];
};

export type SocialLinkInput = {
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type SocialLinkModel = {
  __typename: 'SocialLinkModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  userId: Maybe<Scalars['String']['output']>;
};

export type SocialLinkOrderInput = {
  id: Scalars['String']['input'];
  position: Scalars['Float']['input'];
};

export type StreamModel = {
  __typename: 'StreamModel';
  category: Maybe<CategoryModel>;
  categoryId: Maybe<Scalars['String']['output']>;
  chatMessages: Maybe<Array<ChatMessageModel>>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  ingressId: Maybe<Scalars['String']['output']>;
  isChatEnabled: Scalars['Boolean']['output'];
  isChatFollowersOnly: Scalars['Boolean']['output'];
  isChatPremiumFollowersOnly: Scalars['Boolean']['output'];
  isLive: Scalars['Boolean']['output'];
  serverUrl: Maybe<Scalars['String']['output']>;
  streamKey: Maybe<Scalars['String']['output']>;
  thumbnailUrl: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: Maybe<UserModel>;
  userId: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename: 'Subscription';
  chatMessageAdded: ChatMessageModel;
};


export type SubscriptionChatMessageAddedArgs = {
  streamId: Scalars['String']['input'];
};

export type TotpModel = {
  __typename: 'TotpModel';
  qrcodeUrl: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type UpdateProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserModel = {
  __typename: 'UserModel';
  avatar: Maybe<Scalars['String']['output']>;
  bio: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deactivatedAt: Maybe<Scalars['DateTime']['output']>;
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  followers: Maybe<Array<FollowModel>>;
  followings: Maybe<Array<FollowModel>>;
  id: Scalars['String']['output'];
  isDeactivated: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isTotpEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  notificationSettings: Maybe<Array<NotificationSettingsModel>>;
  notifications: Maybe<Array<NotificationModel>>;
  password: Scalars['String']['output'];
  socialLinks: Maybe<Array<SocialLinkModel>>;
  stream: Maybe<StreamModel>;
  telegramId: Maybe<Scalars['String']['output']>;
  totpSecret: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type FindAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllCategoriesQuery = { findAllCategories: Array<{ __typename: 'CategoryModel', id: string, title: string, slug: string, description: string | null, thumbnailUrl: string | null }> };


export const FindAllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAllCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}}]}}]} as unknown as DocumentNode<FindAllCategoriesQuery, FindAllCategoriesQueryVariables>;