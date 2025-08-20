// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from './schemas/task.schema';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(@Param('projectId') projectId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(projectId, dto);
  }

  @Get('projects/:projectId/tasks')
  findAll(
    @Param('projectId') projectId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAll(
      projectId,
      Number(page) || 1,
      Number(limit) || 10,
      sort,
      status,
    );
  }

  @Patch('tasks/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Patch('tasks/:id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.tasksService.toggleStatus(id);
  }

  @Delete('tasks/:id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
