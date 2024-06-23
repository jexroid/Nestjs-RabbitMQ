import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('EMAIL_SERVICE') private RabbitClient: ClientProxy) {}

  sendEmail() {
    try {
      this.RabbitClient.emit('email-queue', 'dummy@dummy.com');
      console.log('email sended');
      return { success: true, message: 'email has been sended' };
    } catch (e) {
      return { success: false, message: 'email has NOT been sended' };
    }
  }
}
