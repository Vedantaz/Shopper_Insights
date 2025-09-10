import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, OwnerStoreDto } from './dto/admin-user.dto';
import { ListUsersDto } from 'src/stores/dto/list-users.dto';
import { ListStoresDto } from 'src/stores/dto/list-store.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [users, stores, ratings] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);
    return { totalUsers: users, totalStores: stores, totalRatings: ratings };
  }

  async signUpUser(body: CreateUserDto) {
    const hash = await bcrypt.hash(body.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
        passwordHash: hash,
        role: body.role,
      },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    let store = {};

    if (body.role === 'OWNER' && body.ownerStore) {
      store = await this.prisma.store.create({
        data: {
          name: body.ownerStore.name,
          email: body.ownerStore.email,
          address: body.ownerStore.address,
          ownerId: user.id,
        },
      });
    }
    return { user, store };
  }

  async showUsersPerConstraint(userData: CreateUserDto, data: ListUsersDto) {
    const { name, email, address, role } = userData;
    const where: any = {
      AND: [
        name ? { name: { contains: userData.name, mode: 'insensitive' } } : {},
        email
          ? { email: { contains: userData.email, mode: 'insensitive' } }
          : {},
        address
          ? { address: { contains: userData.address, mode: 'insensitive' } }
          : {},
        role ? { role } : {},
      ],
    };
    const { sortBy = 'id', sortOrder, page = 1, pageSize = 10 } = data;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder as any },
        skip: (+page - 1) * +pageSize,
        take: +pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          store: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // if user is the owner : include store ratings
    const mapped = await Promise.all(
      items.map(async (u) => {
        if (u.role === 'OWNER' && u.store) {
          const agg = await this.prisma.rating.aggregate({
            where: { storeId: u.id },
            _avg: { value: true },
          });
          return {
            ...u,
            ownerStoreAverageRating: +(agg._avg.value ?? 0).toFixed(2),
          };
        }
        return u;
      }),
    );
    return { items: mapped, total, page: +page, pageSize: +pageSize };
  }

  async getUser(id: number) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: true,
      },
    });
    if (!u) return null;
    if (u.role === 'OWNER' && u.store) {
      const agg = await this.prisma.rating.aggregate({
        where: { storeId: u.id },
        _avg: { value: true },
      });
      return {
        ...u,
        ownerStoreAverageRating: +(agg._avg.value ?? 0).toFixed(2),
      };
    }
    return u;
  }

  async listStores(data: ListStoresDto) {
    const {
      name,
      email,
      address,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      pageSize = 10,
    } = data;

    const where: any = {
      AND: [
        name ? { name: { contains: name, mode: 'insensitive' } } : {},
        email ? { email: { contains: email, mode: 'insensitive' } } : {},
        address ? { address: { contains: address, mode: 'insensitive' } } : {},
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        orderBy: { [sortBy]: sortOrder as any },
        skip: (+page - 1) * +pageSize,
        take: +pageSize,
        include: { ratings: true },
      }),
      this.prisma.store.count({ where }),
    ]);

    const mapped = items.map((s) => {
      const avg = s.ratings.length
        ? s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length
        : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        rating: +avg.toFixed(2),
      };
    });

    return { items: mapped, total, page: +page, pageSize: +pageSize };
  }
}
