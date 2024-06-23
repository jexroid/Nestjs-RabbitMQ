import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RabbitmqService } from './rabbitmq.service';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly Rabbitmq: RabbitmqService,
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const response = this.user.create(createUserDto);
    const rabbitmqDeliveryStatus = this.Rabbitmq.sendEmail();
    if (rabbitmqDeliveryStatus.success) {
      return response;
    }

    return 'Error occurred with Storing and Sending Email';
  }

  @Get(':id')
  find(@Param('id') id: number) {
    return this.user.find(id);
  }

  @Get(':id/avatar')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/', // directory where files will be saved
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  findAll(@Param('id') id: number) {
    return this.user.storeAvatar(id);
  }

  @Delete(':id/avatar')
  remove(@Param('id') id: string) {
    return this.user.delete(id);
  }
}
