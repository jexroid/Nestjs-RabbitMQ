import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CheckExistence } from '../../lib/existance.validation';
import { externalAPIResponse } from 'types/user.interface';
import * as fs from 'fs'
import * as bcrypt from "bcrypt";



@Injectable()
export class UserService {
  private readonly EXTERNAL_URL: string = 'https://reqres.in/api';
  constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

  // Private function for fetching external APIs ---
  private async fetchExternalRoute(id: number): Promise<externalAPIResponse> {
    return new Promise((resolve, reject) => {
      fetch(`${this.EXTERNAL_URL}/users/${id}`).then((response) => {
        if (!response.ok) {
          reject('Failed to fetch data');
        }
        return response.json();
      }).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  // ---

  /**
   * ### Creates a User in Database
   * @param {CreateUserDto} CreateUserDto
   */
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.UserModel(CreateUserDto);
    return createdUser.save();
  }

  /**
   * ### get a specific User within the parameter
   * @param {number} id
   */
  async find(id: number) {
    return this.fetchExternalRoute(id);
  }

  async storeAvatar(id: number) {
    const externalAPIResponse: externalAPIResponse = await this.fetchExternalRoute(id);
    console.log(externalAPIResponse.data.avatar)
    const avatarURL = await fetch(externalAPIResponse.data.avatar)

    // Turning file into Buffers
    const arrayBuffer = await avatarURL.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Making Unique Filename to avoid duplication
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const outputFileName = `./uploads/${uniqueSuffix}.jpg`

    // writing the File
    fs.writeFileSync(outputFileName, buffer)

    // Base64 Avatar
    const Base64Image = Buffer.from(buffer).toString('base64');

    // Hashed ID
    const nameOfUser = externalAPIResponse.data.id.toString()
    const HashedUserId = await bcrypt.hash(nameOfUser, 7);

    // Storing into Database
    const userWithAvatar = new this.UserModel({ id: nameOfUser, userId: HashedUserId, avatar: Base64Image });
    await userWithAvatar.save()

    // destructuring the data
    return JSON.stringify({ avatar: Base64Image })
  }

  /**
   * ### Delete a User from Database
   * @param {string} id
   * id Object in MongoDB
   */
  async delete(id: string): Promise<User[]> {
    const deletedUser = await this.UserModel.deleteOne({ id: id });
    return CheckExistence(deletedUser);
  }
}
