import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  mezonId: string;

  @Column({ type: "jsonb", default: { gold: 100, elixir: 50, gems: 10 } })
  resources: { gold: number; elixir: number; gems: number };

  @Column({ default: 0 })
  trophies: number;

  @Column({ type: "jsonb", default: [] })
  stateStack: string[]; // Per-user nav stack, reset on new *
}
