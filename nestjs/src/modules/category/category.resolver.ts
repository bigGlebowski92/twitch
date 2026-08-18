import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryModel } from './models/category.model';

@Resolver('Category')
export class CategoryResolver {
  public constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryModel], { name: 'findAllCategories' })
  public async findAllCategories(): Promise<CategoryModel[]> {
    return this.categoryService.findAllCategories();
  }

  @Query(() => [CategoryModel], { name: 'findRandomCategories' })
  public async findRandomCategories(): Promise<CategoryModel[]> {
    return this.categoryService.findRandomCategories();
  }

  @Query(() => CategoryModel, { name: 'findCategoryBySlug' })
  public async findCategoryBySlug(
    @Args('slug') slug: string,
  ): Promise<CategoryModel> {
    return this.categoryService.findCategoryBySlug(slug);
  }
}
