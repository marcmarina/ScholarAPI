export const getMongoDBUri = () => {
  const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}-csgin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
  return MONGODB_URI;
};

export const getSecretKey = () => process.env.APP_SECRET_KEY;

export const getPort = () => process.env.PORT;
