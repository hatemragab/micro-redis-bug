import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createClient } from 'redis';

const digitalOceanOptions = {
  host: 'db-redis-nyc1-93996-do-user-6764627-0.b.db.ondigitalocean.com',
  username: 'default',
  password: 'AVNS_-m_Sz9Q_i4SMljmnQXp',
  port: 25061,
};
//local options works good for nestjs but with redis version 6 installed to my machine
const localOptions = {
  host: 'localhost',
  username: '',
  password: '',
  port: 6379,
};

const client = createClient(digitalOceanOptions);
// Listen for the 'connect' event
client.on('connect', () => {
  console.log('Connected to Redis from redis not front nest microservice!!');
});

// Listen for the 'error' event
client.on('error', (err) => {
  console.error('Failed to connect to Redis', err);
});
client.connect();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    /// this testing v7 redis hosted on digitalocean self database management
    /// this db will delete after close this issue
    options: digitalOceanOptions,
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
