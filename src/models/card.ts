import { model, Schema } from 'mongoose';

interface ICard{
  name: string;
  link: String;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId;
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('User', cardSchema);
