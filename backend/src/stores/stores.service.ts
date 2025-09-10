import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createStoreDto: CreateStoreDto, ownerId: number) {
    return await this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        email: createStoreDto.email,
        address: createStoreDto.address,
        ownerId: ownerId,
      },
    });
  }

  async findAll() {
    // find all stores
    // map stores and find ratings for the same
    // RETURN THE STORES WITH RATING MAPPED

    const stores = await this.prisma.store.findMany({
      include: { owner: { select: { name: true } } },
    });

    // 2. Group ratings by storeId and calculate average rating
    const ratings = await this.prisma.rating.groupBy({
      by: ['storeId'],
      _avg: {
        value: true,
      },
    });

    // 3. Create a mapping from storeId to average rating
    const ratingMap = ratings.reduce((acc, cur) => {
      acc[cur.storeId] = cur._avg.value;
      return acc;
    }, {});

    // 4. Map over stores and attach the average rating
    const storesWithRatings = stores.map((store) => ({
      ...store,
      rating: ratingMap[store.id] || 0, // if no rating, default to 0
    }));

    // 5. Return the final result
    return storesWithRatings;
  }

  async findOne(id: number) {
    return await this.prisma.store.findUnique({ where: { id: id } });
  }

  async update(id: number, data: UpdateStoreDto) {
    return await this.prisma.store.update({
      where: { id },
      data,
      select: {
        name: true,
        email: true,
        address: true,
        ownerId: true,
      },
    });
  }

  async getOwnerStores(ownerId: number) {
    return await this.prisma.store.findMany({
      where: { ownerId: ownerId },
      include: { owner: { select: { name: true } } },
    });
  }

  remove(id: number) {
    return this.prisma.store.delete({ where: { id: id } });
  }

  async list(dto: ListUsersDto) {
    const { q, address, sortBy, sortOrder, page, pageSize } = dto;

    // Example: replace this with actual DB query logic
    const mockData = [
      { id: 1, name: 'Alice', email: 'alice@mail.com', address: 'NY' },
      { id: 2, name: 'Bob', email: 'bob@mail.com', address: 'LA' },
    ];

    // Filtering (basic example)
    let results = mockData;
    if (q) {
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()),
      );
    }
    if (address) {
      results = results.filter(
        (u) => u.address.toLowerCase() === address.toLowerCase(),
      );
    }

    // Sorting (simple in-memory example)
    if (sortBy) {
      results = results.sort((a, b) => {
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];
        if (fieldA < fieldB) return sortOrder === 'DESC' ? 1 : -1;
        if (fieldA > fieldB) return sortOrder === 'DESC' ? -1 : 1;
        return 0;
      });
    }

    // Pagination
    const total = results.length;
    const start = ((page ?? 1) - 1) * (pageSize ?? 10);
    const paged = results.slice(start, start + (pageSize ?? 10));

    return {
      data: paged,
      meta: {
        total,
        page: page ?? 1,
        pageSize: pageSize ?? 10,
        totalPages: Math.ceil(total / (pageSize ?? 10)),
      },
    };
  }

  async ownerRatings(ownerUserId: number) {
    const store = await this.prisma.store.findFirst({
      where: { ownerId: ownerUserId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!store) return { items: [], average: 0 };
    const avg = store.ratings.length
      ? store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length
      : 0;
    const items = store.ratings.map((r) => ({
      userId: r.userId,
      name: r.user.name,
      email: r.user.email,
      value: r.value,
      when: r.updatedAt,
    }));
    return { items, average: +avg.toFixed(2) };
  }
}
