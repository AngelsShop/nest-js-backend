import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/list')
  @ApiResponse({ type: [Category] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':uuid')
  @ApiResponse({ type: Category })
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  @Post()
  @ApiResponse({ type: Category })
  create(@Body() _createCategoryDto: CreateCategoryDto) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) _uuid: string,
    @Body() _updateCategoryDto: UpdateCategoryDto,
  ) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) _uuid: string) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}
