import ISubmission from "../interfaces/submission.interface";
import Blink from "../models/submission.model";

export default class SubmissionService {
  async create(submission: Partial<ISubmission>) {
    return await Blink.create(submission);
  }

  async findOne(params: {}) {
    return await Blink.findOne(params);
  }

  async find(params: {}) {
    return await Blink.find(params).populate("sponsorId", "userId");
  }
}
