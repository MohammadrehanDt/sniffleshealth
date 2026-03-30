import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppModule } from "./modules/app.module";
import { ensureUploadDirectories, UPLOAD_DIR } from "./shared/upload.utils";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  ensureUploadDirectories();
  app.useStaticAssets(UPLOAD_DIR, { prefix: "/uploads" });

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.WEB_URL || "http://localhost:5173",
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
}

bootstrap();
