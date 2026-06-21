import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity({ name: "users" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column({ name: "password_hash" })
  passwordHash!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
