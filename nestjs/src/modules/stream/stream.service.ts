import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Stream } from '@prisma/generated/browser';
import type { User } from '@prisma/generated/browser';
import type Upload from 'graphql-upload/Upload.mjs';
import sharp from 'sharp';
import { PrismaService } from '@/core/prisma/prisma.service';
import { readStreamToBuffer } from '@/shared/utils/read-stream.util';
import { StorageService } from '../libs/storage/storage.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';

@Injectable()
export class StreamService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  public async findAllStreams(input: FiltersInput = {}) {
    const { take, skip, searchTerm } = input;

    const whereClause = searchTerm
      ? this.findBySearchTermFilter(searchTerm)
      : undefined;

    return this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findRandomStreams() {
    const where = {
      user: {
        isDeactivated: false,
      },
    };

    const total = await this.prismaService.stream.count({ where });

    if (total === 0) {
      return [];
    }

    const take = Math.min(4, total);
    const skip =
      total <= take ? 0 : Math.floor(Math.random() * (total - take + 1));

    return this.prismaService.stream.findMany({
      where,
      include: {
        user: true,
      },
      take,
      skip,
    });
  }

  public async changeStreamInfo(
    input: ChangeStreamInfoInput,
    user: User,
  ): Promise<boolean> {
    const { title } = input;

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: { title },
    });
    return true;
  }

  public async changeThumbnail(file: Upload, user: User): Promise<Stream> {
    const stream = await this.findByUserId(user);

    const { createReadStream } = await file.promise;
    const rawBuffer = await readStreamToBuffer(createReadStream());

    const processedBuffer = await sharp(rawBuffer)
      .resize(1280, 720, { fit: 'cover' })
      .webp()
      .toBuffer();

    const thumbnailUrl = await this.storageService.uploadThumbnail(
      stream.id,
      processedBuffer,
      'image/webp',
    );

    if (stream.thumbnailUrl) {
      await this.storageService.delete(stream.thumbnailUrl);
    }

    return this.prismaService.stream.update({
      where: { id: stream.id },
      data: { thumbnailUrl },
    });
  }

  public async removeThumbnail(user: User): Promise<Stream> {
    const stream = await this.findByUserId(user);

    if (stream.thumbnailUrl) {
      await this.storageService.delete(stream.thumbnailUrl);
    }

    return this.prismaService.stream.update({
      where: { id: stream.id },
      data: { thumbnailUrl: null },
    });
  }

  private async findByUserId(user: User): Promise<Stream> {
    const stream = await this.prismaService.stream.findUnique({
      where: { userId: user.id },
    });
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    return stream;
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }
}
