import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { BucketsModule } from "./buckets/buckets.module";
import { ProductsModule } from "./products/products.module";
import { FilesModule } from "./files/files.module";
import { ProfilesModule } from "./profiles/profiles.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    BucketsModule,
    ProductsModule,
    FilesModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
