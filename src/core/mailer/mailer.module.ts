import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MAILER } from './mailer.port';
import { NodemailerService } from './nodemailer.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [{ provide: MAILER, useClass: NodemailerService }],
  exports: [MAILER],
})
export class MailerModule {}
