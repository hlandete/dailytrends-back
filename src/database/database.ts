import * as mongoose from "mongoose";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: async (): Promise<typeof mongoose> => {
      const uri = "mongodb://localhost:27017/dailytrends";
      const options = { useNewUrlParser: true };
      return await mongoose.connect(uri, options);
    }
  }
];
