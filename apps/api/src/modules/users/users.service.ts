import { Injectable } from "@nestjs/common";
import { UserRole, UserStatus } from "@in-between/shared";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../database/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  listPlayers() {
    return this.usersRepository.find({
      where: { role: UserRole.PLAYER },
      order: { createdAt: "DESC" },
    });
  }

  countAll() {
    return this.usersRepository.count();
  }

  async create(input: {
    id: string;
    username: string;
    displayName: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    locale: string;
  }) {
    const user: UserEntity = this.usersRepository.create(input);
    return this.usersRepository.save(user);
  }
}
