import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from 'src/common/decorators/user';
import { IUserToken } from 'src/common/interfaces/userToken';
import { TaskStatus } from './interfaces/task.interface';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: IUserToken) {
    return this.taskService.create({
      data: createTaskDto,
      userId: user.userId,
    });
  }

  @Get()
  findAll(
    @GetUser() user: IUserToken,
    @Query() params: { page: number; status: TaskStatus },
  ) {
    return this.taskService.findAllByUserId({
      userId: user.userId,
      page: params.page,
      status: params.status,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: IUserToken) {
    return this.taskService.findOneByUser({
      userId: user.userId,
      taskId: id,
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: IUserToken,
  ) {
    return this.taskService.updateTaskByUser({
      id,
      updateTaskDto,
      userId: user.userId,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: IUserToken) {
    return this.taskService.removeTaskByUser({
      id,
      userId: user.userId,
    });
  }
}
