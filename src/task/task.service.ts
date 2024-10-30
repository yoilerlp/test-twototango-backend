import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './interfaces/task.interface';
import { PaginatedResult } from 'src/common/interfaces/response';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(taskToCreateData: {
    data: CreateTaskDto;
    userId: string;
  }): Promise<Task> {
    try {
      const { data: createTaskDto, userId } = taskToCreateData;

      const newTask = this.taskRepository.create({
        ...createTaskDto,
        status: createTaskDto.status || TaskStatus.PENDING,
        userId,
      });

      await this.taskRepository.save(newTask);

      return newTask;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllByUserId(params: {
    userId: string;
    page: number;
  }): Promise<PaginatedResult<Task>> {
    const { userId, page: pageQuery } = params;
    const page = pageQuery ? Number(pageQuery) : 1;
    const LIMIT = 10;
    const SKIP = (page - 1) * LIMIT;

    const [result, total] = await this.taskRepository.findAndCount({
      where: { userId },
      take: LIMIT,
      skip: SKIP,
    });

    return {
      rows: result,
      total,
      page,
    };
  }

  async findOneByUser({
    userId,
    taskId,
  }: {
    userId: string;
    taskId: string;
  }): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { userId, id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTaskByUser({
    id,
    updateTaskDto,
    userId,
  }: {
    id: string;
    updateTaskDto: UpdateTaskDto;
    userId: string;
  }): Promise<Task> {
    const task = await this.findOneByUser({ taskId: id, userId });

    const updatedTask = await this.taskRepository.save({
      ...task,
      ...updateTaskDto,
    });

    return updatedTask;
  }

  async removeTaskByUser({ id, userId }: { id: string; userId: string }) {
    const task = await this.findOneByUser({ taskId: id, userId });
    try {
      await this.taskRepository.remove(task);
      return {
        message: 'Task deleted successfully',
        task,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }
}
