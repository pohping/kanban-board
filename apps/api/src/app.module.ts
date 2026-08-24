import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }: { req: Request }) => ({ req }),
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
