import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Return id instead of _id
  async create(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; passwordHash: string }> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new this.userModel({ email, passwordHash });
    const savedUser = await user.save();

    return {
      id: (savedUser._id as Types.ObjectId).toString(), // map _id -> id
      email: savedUser.email,
      passwordHash: savedUser.passwordHash,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Return id instead of _id
  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return {
        id: (user._id as Types.ObjectId).toString(), // map _id -> id
        email: user.email,
      };
    }
    return null;
  }
}
