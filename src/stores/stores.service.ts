import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}
  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store';
  }

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
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
