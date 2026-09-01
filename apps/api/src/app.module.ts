import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CardsModule } from './modules/cards/cards.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { BoardsModule } from './modules/boards/boards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'src/schema.gql')
          : true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CardsModule,
    ColumnsModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
