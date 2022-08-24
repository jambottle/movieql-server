import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

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
    userId: '2',
  },
  {
    id: '2',
    text: 'second one',
    userId: '1',
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

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(tweetId: ID!): Tweet
    allMovies: [Movie!]!
    movie(movieId: Int!): Movie
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
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId);
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
    async allMovies() {
      const response = await fetch(`https://yts.mx/api/v2/list_movies.json`);
      const { data } = await response.json();
      return data.movies;
    },
    async movie(root, { movieId }) {
      const response = await fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`
      );
      const { data } = await response.json();
      return data.movie;
    },
  },
  Mutation: {
    createTweet(root, { userId, text }) {
      const user = users.find(user => user.id === userId);

      if (!user) {
        throw new Error('User ID does not exist.');
      } else {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId,
        };

        tweets.push(newTweet);
        return newTweet;
      }
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
