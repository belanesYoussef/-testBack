// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(projectId: string, dto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel({ ...dto, projectId });
    return task.save();
  }

  async findAll(
    projectId: string,
    page = 1,
    limit = 10,
    sort: 'asc' | 'desc' = 'asc',
    status?: TaskStatus,
  ): Promise<Task[]> {
    const skip = (page - 1) * limit;
    const filter: any = { projectId };
    if (status) filter.status = status;

    return this.taskModel
      .find(filter)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async toggleStatus(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    task.status =
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    return task.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Task not found');
  }
}
