import { model, Schema } from 'mongoose';
import { isEmail } from 'validator';
import { urlRegex } from '../utils/consts';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value: string) {
        return isEmail(value);
      },
      message: 'Укажите валидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default model<IUser>('User', userSchema);
