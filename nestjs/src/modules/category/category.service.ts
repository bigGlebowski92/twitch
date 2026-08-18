import { Injectable, NotFoundException } from '@nestjs/common';
import type { Category } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class CategoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAllCategories(): Promise<Category[]> {
    return this.prismaService.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findRandomCategories(): Promise<Category[]> {
    const total = await this.prismaService.category.count();

    if (total === 0) {
      return [];
    }

    const take = Math.min(7, total);
    const skip =
      total <= take ? 0 : Math.floor(Math.random() * (total - take + 1));

    return this.prismaService.category.findMany({
      take,
      skip,
    });
  }

  public async findCategoryById(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  public async findCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug,
      },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
