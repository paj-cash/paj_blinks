import { ObjectId } from "mongoose";

export default interface ISubmission {
  _id?: ObjectId;
  userId: string;
  submission: string;
}
