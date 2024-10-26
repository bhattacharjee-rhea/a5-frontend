import { Authing, Grouping } from "./app";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friending";
import { GroupDoc } from "./concepts/grouping";
import { LikeDoc } from "./concepts/liking";
import { PermissionDoc } from "./concepts/permitting";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/posting";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await Authing.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await Authing.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await Authing.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  /**
   * Converts an array of LikeDocs into more readable format for the frontend by converting the author id into a username.
   */
  static async likes(likes: LikeDoc[]) {
    const authors = await Authing.idsToUsernames(likes.map((likes) => likes.likedBy));
    return likes.map((like, i) => ({ ...like, likedBy: authors[i] }));
  }

  /**
   * Converts an array of GroupDocs into more readable format for the frontend by converting the member ids into usernames.
   */
  static async groups(groups: GroupDoc[]) {
    const members = await Promise.all(groups.map((group) => Authing.idsToUsernames(group.includes)));
    return groups.map((group, i) => ({ ...group, members: members[i] }));
  }

  /**
   * Converts an array of PermissionDocs into more readable format for the frontend by converting the group id into a name.
   */
  static async permissions(permissions: PermissionDoc[]) {
    const groupNames = (await Promise.all(permissions.map((permission) => permission.target).map((oid) => Grouping.getGroup(oid)))).map((group) => group.name);
    return permissions.map((permission, i) => ({ ...permission, groupName: groupNames[i] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
