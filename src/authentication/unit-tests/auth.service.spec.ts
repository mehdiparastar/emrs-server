import {
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { authTypeEnum } from '../../enum/authType.enum';
import { UserRoles } from '../../enum/userRoles.enum';
import { hashData } from '../../helperFunctions/hash-data';
import { validateHashedData } from '../../helperFunctions/validate-hashed-data';
import { CreateLocalUserDto } from '../../users/dto/user/create-local-user.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { AccessTokenStrategy } from '../strategies/accessToken.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';

let getFakeUsersRepo = async () => [
  {
    id: 0,
    provider: authTypeEnum.local,
    email: 'inDBtest01@test.com',
    password: await hashData('test'),
    providerId: null,
    name: null,
    photo: null,
    roles: [UserRoles.superUser],
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User,
];

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersRepo: User[];
  let fakeUsersDto: CreateLocalUserDto[] = [
    {
      name: 'test1',
      email: 'toEnterTestUser01@test.com',
      password: 'test01',
    },
    {
      name: 'test2',
      email: 'toEnterTestUser02@test.com',
      password: 'test02',
    },
    {
      name: 'test3',
      email: 'toEnterTestUser03@test.com',
      password: 'test03',
    },
  ];

  beforeEach(async () => {
    fakeUsersRepo = await getFakeUsersRepo();
    let fakeUsersService: Partial<UsersService> = {
      async createUserWithUserPass(email, password) {
        // Check if user exists
        const [userExists] = await this.findByEmail(email);
        if (userExists) {
          throw new BadRequestException('User already exists');
        }

        const defaultUserRoles = [UserRoles.patientsLL];

        // Create new User
        const newUser = {
          id: fakeUsersRepo.length,
          provider: authTypeEnum.local,
          email: email,
          password: password,
          providerId: null,
          name: null,
          photo: null,
          roles: defaultUserRoles,
          refreshToken: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User;

        fakeUsersRepo.push(newUser);
        return newUser;
      },

      async update(id, attrs) {
        const user = await this.findOneById(id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        fakeUsersRepo = fakeUsersRepo.map((usr) =>
          usr.id === id ? user : user,
        );
        return user;
      },

      async findOneById(id) {
        if (!id) {
          throw new NotFoundException('user not found');
        }
        const [find] = fakeUsersRepo.filter((user) => user.id === id);
        if (!find) {
          throw new NotFoundException('user not found');
        }
        return find;
      },

      async findByEmail(email) {
        if (!email) {
          throw new NotFoundException('user not found');
        }

        const find = fakeUsersRepo.filter((usr) => usr.email === email);
        return find;
      },
    };

    const nodeENV = process.env.NODE_ENV

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.${nodeENV}.env`,
        }),
        JwtModule.register({}),
      ],
      providers: [
        ConfigService,
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
        JwtService,
        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a local user object when credentials are valid', async () => {
    const res = await service.localUserValidate(fakeUsersRepo[0].email, 'test');
    expect(res.id).toEqual(0);
  });

  it('should throw error when credentials are invalid', async () => {
    await expect(
      service.localUserValidate('wrong@wrong.com', 'wrong'),
    ).rejects.toThrow(NotAcceptableException);
  });

  it('create a local new user and check tokens and password hashing', async () => {
    const user = await service.createNewLocalUser(
      fakeUsersDto[0].email,
      fakeUsersDto[0].password,
      fakeUsersDto[0].name
    );

    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();

    const findUser = fakeUsersRepo.find(
      (usr) => usr.email === fakeUsersDto[0].email,
    );
    expect(
      await validateHashedData(fakeUsersDto[0].password, findUser.password),
    ).toEqual(true);
  });

  it('throwing an error on dupliucate email in signing up', async () => {
    await service.createNewLocalUser(
      fakeUsersDto[1].email,
      fakeUsersDto[1].password,
      fakeUsersDto[1].name
    );
    await expect(
      service.createNewLocalUser(
        fakeUsersDto[1].email,
        fakeUsersDto[1].password,
        fakeUsersDto[1].name
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throwing an error on logging in in with unused email', async () => {
    await expect(service.login({ ...fakeUsersDto[3], id: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('get tokens on login', async () => {
    await service.createNewLocalUser(
      fakeUsersDto[2].email,
      fakeUsersDto[2].password,
      fakeUsersDto[2].name
    );
    const registeredUser = fakeUsersRepo.find(
      (usr) => usr.email === fakeUsersDto[2].email,
    );
    const login = await service.login(registeredUser);
    expect(login.accessToken).toBeDefined();
    expect(login.refreshToken).toBeDefined();
  });
});
