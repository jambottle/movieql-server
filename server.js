import { ApolloServer, gql } from 'apollo-server';

let users = [
  {
    id: '1',
    firstName: 'Justin',
    lastName: 'Bieber',
  },
  {
    id: '2',
    firstName: 'Katy',
    lastName: 'Perry',
  },
];

let tweets = [
  {
    id: '1',
    text: 'first one',
  },
  {
    id: '2',
    text: 'second one',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(tweetId: ID!): Tweet
  }

  type Mutation {
    createTweet(userId: ID!, text: String!): Tweet!
    deleteTweet(tweetId: ID!): Boolean!
  }
`;

const resolvers = {
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { tweetId }) {
      return tweets.find(tweet => tweet.id === tweetId);
    },
  },
  Mutation: {
    createTweet(root, { userId, text }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };

      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { tweetId }) {
      const tweet = tweets.find(tweet => tweet.id === tweetId);

      if (!tweet) {
        return false;
      } else {
        tweets = tweets.filter(tweet => tweet.id !== tweetId);
        return true;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
