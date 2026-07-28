import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';
import { FiltersInput } from './inputs/filters.input';

@Injectable()
export class StreamService {
  public constructor(private readonly prismaService: PrismaService) {}

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
