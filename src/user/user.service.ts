import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/common/helpers/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userAlreadyExists = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (userAlreadyExists) {
        throw new BadRequestException('User already exists');
      }

      const { password, ...userToCreateBody } = createUserDto;

      const hashedPassword = await hashPassword(password);

      const user = this.userRepository.create({
        ...userToCreateBody,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return userToCreateBody;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }
}
