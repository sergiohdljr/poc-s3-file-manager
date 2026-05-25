import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../../../shared/infrastructure/database.module';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../../application/mappers/user.mapper';

interface UserRow {
  id: string;
  nome: string;
  email: string;
  password_hash: string;
}

@Injectable()
export class SqlUserRepository implements UserRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<User | null> {
    const { rows } = await this.pool.query<UserRow>(
      `SELECT id, nome, email, password_hash
       FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ? UserMapper.toDomain(this.toMapperRow(rows[0])) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.pool.query<UserRow>(
      `SELECT id, nome, email, password_hash
       FROM users WHERE email = $1`,
      [email],
    );
    return rows[0] ? UserMapper.toDomain(this.toMapperRow(rows[0])) : null;
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, nome, email, password_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         nome = EXCLUDED.nome,
         email = EXCLUDED.email,
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()`,
      [user.id, user.name, user.email, user.passwordHash],
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  private toMapperRow(row: UserRow) {
    return {
      id: row.id,
      name: row.nome,
      email: row.email,
      passwordHash: row.password_hash,
    };
  }
}
