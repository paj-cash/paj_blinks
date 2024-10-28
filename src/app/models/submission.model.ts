import { model, Schema } from "mongoose";
import ISubmission from "../interfaces/submission.interface";

const submissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: String,
      required: true,
    },

    submission: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    strict: true,
    timestamps: true,
    versionKey: false,
  }
);

const Blink = model("Submissions", submissionSchema, "Submissions");
export default Blink;
